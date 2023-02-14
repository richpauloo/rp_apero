---
title: Parquet, SQL, DuckDB, arrow, dbplyr and R
author: Rich
date: '2021-11-06'
slug: parquet
tags:
- R
- data engineering
subtitle: ''
excerpt: As opposed to traditional row-based storage (e.g., SQL), Parquet files (`.parquet`) are columnar-based, and feature efficient compression (fast read/write and small disk usage) and optimized performance for big data. 
---


![](featured.jpeg)  
_French tapestry, "Jesuits performing astronomy with Chinese"_  


## Introduction

As opposed to traditional row-based storage (e.g., SQL), Parquet files (`.parquet`) are columnar-based, and feature efficient compression (fast read/write and small disk usage) and optimized performance for big data. Writing to parquet data format and partitioning (splitting the data across multiple files for faster querying) is relatively trivial in `R` with the `{arrow}` package which provides `arrow::write_dataset()`. There are a few options for querying Parquet data from `R`. I'll cover two approaches to query Parquet files from `R` in this post:

1. `{dbplyr}` - write dplyr code and `collect()` results  
2. `{duckdb}` and `{DBI}` - use DuckDB to query Parquet files with `SQL` 


## Create some data to play with

First, make sure you have `{tidyverse}`, `{duckdb}`, `{arrow}`, `{dbplyr}`, and `{DBI}` installed.  

Next, let's create some example data to play with:

```r
library(arrow)
library(duckdb)
library(fs)
library(tidyverse)
library(DBI)
library(glue)

# set a working directory on the desktop - make sure nothing else
# is in this directory except the parquet files we are about to write!
dir_out <- "~/Desktop/duck_parquet"

# create the directory
dir_create(dir_out)

# write iris data to parquet with partitioning by unique values in a column.
# need values for all rows otherwise NA values go to their own file 
iris_clean <- janitor::clean_names(iris) # make clean names first
arrow::write_dataset(iris_clean, dir_out, partitioning = "species")
dir_ls(dir_out)
```

This writes a subdirectory for each unique species in `iris`:

```r
/Users/richpauloo/Desktop/duck_parquet/species=setosa
/Users/richpauloo/Desktop/duck_parquet/species=versicolor
/Users/richpauloo/Desktop/duck_parquet/species=virginica
```

Each of these subdirectories has its own parquet file(s) which hold the data:

```r
dir_ls(dir_out, recurse = TRUE, glob = "*.parquet") 
```

```r
/Users/richpauloo/Desktop/duck_parquet/species=setosa/part-0.parquet
/Users/richpauloo/Desktop/duck_parquet/species=versicolor/part-0.parquet
/Users/richpauloo/Desktop/duck_parquet/species=virginica/part-0.parquet
```

Each parquet file is stored in its own subdirectory (by partition) in a series of parquet files. Because there are only 50 rows per iris species in this example, there is only one parquet file per subdirectory (`part-0.parquet`).


## Query with `{dbplyr}`

For simple queries I like to use `{dplyr}`. Parquet files can be "opened" as a `FileSystemDataset` object and queried with dplyr verbs. Results are gathered an `R` `data.frame` with a call to `collect()`.

Let's filter for only the "setosa" iris species, count the unique values in the sepal_length column, and collect the results:

```r
# we can query the parquet files by pointing arrow::open_dataset() to the 
# directory that holds the parquet partions and use dbplyr syntax that ends
# with a call to collect()

# open the dataset
ds <- arrow::open_dataset(dir_out, partitioning = "species") 

# query the dataset
ds %>% 
  filter(species == "species=setosa") %>%
  count(sepal_length) %>% 
  collect()
```

Note that rows in the species column (which we partioned by) are overwritten with a special character string that corresponds to the subdirectory names (e.g., `dir_ls(dir_out)`). Thus we need to filter like so: `filter(species == "species=setosa")`.  


```r
# A tibble: 15 × 2
   sepal_length     n
          <dbl> <int>
 1          5.1     8
 2          4.9     4
 3          4.7     2
 4          5       8
 5          4.8     5
 6          4.6     4
 7          5.4     5
 8          4.3     1
 9          5.7     2
10          5.5     2
11          4.4     3
12          5.8     1
13          5.2     3
14          4.5     1
15          5.3     1
```


## Query with `SQL`

At other times it makes more sense to query our parquet files with SQL. For this we can use a combination of `{duckdb}` and `{DBI}`. As before, we open the dataset with `arrow::open_dataset()`, but this time we create a DuckDB Database connection objection with `DBI::dbConnect(duckdb::duckdb())` and register the connection with `duckdb::duckdb_register_arrow()`. Then we use `DBI::dbGetQuery()` calls to query our Parquet files with SQL. Reproducing the same query as above with SQL:

```r
# open dataset
ds  <- arrow::open_dataset(dir_out, partitioning = "species")

# open connection to DuckDB
con <- dbConnect(duckdb::duckdb())

# register the dataset as a DuckDB table, and give it a name
duckdb::duckdb_register_arrow(con, "my_table", ds)

# query
dbGetQuery(con, 
           "SELECT sepal_length, COUNT(*) AS n 
           FROM my_table 
           WHERE species = 'species=setosa' 
           GROUP BY sepal_length")
```

```r
# A tibble: 15 × 2
   sepal_length     n
          <dbl> <int>
 1          5.1     8
 2          4.9     4
 3          4.7     2
 4          5       8
 5          4.8     5
 6          4.6     4
 7          5.4     5
 8          4.3     1
 9          5.7     2
10          5.5     2
11          4.4     3
12          5.8     1
13          5.2     3
14          4.5     1
15          5.3     1
```

Finally, don't forget to unregister the dataset and disconnect when you're done.

```r
# clean up
duckdb_unregister(con, "my_table")
dbDisconnect(con)
```

***

Here are some resources I found helpful in writing this short summary:

1. [DuckDB R docs](https://duckdb.org/docs/api/r)
2. [DuckDB Parquet docs](https://duckdb.org/docs/data/parquet)
3. [A helpful Jira ticket from the arrow project](https://issues.apache.org/jira/browse/ARROW-12688?page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel&focusedCommentId=17381539#comment-17381539)
