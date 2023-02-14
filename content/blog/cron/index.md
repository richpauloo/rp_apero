---
title: Automating R scripts on Linux with cron 
author: Rich
date: '2020-01-21'
slug: crontabs
categories: []
tags: []
subtitle: ''
summary: 'Automate R scripts with crontabs.'
authors: []
#lastmod: '2019-12-29T09:47:33-08:00'
featured: no
image:
  caption: ''
  focal_point: ''
  preview_only: no
projects: []
---


![](featured.jpeg)  
_Hieronymus Bosch, "The Visions of Tondal" 1479._

## Introduction 


[`cron`](http://man7.org/linux/man-pages/man5/crontab.5.html) is a task scheduler that comes baked into Linux. 

The heart of `cron` is the crontab file that you can add tasks to. 

To edit the crontab file type:  

```r
crontab -e
```

This will open the VI editor.

To exit, press `esc`, type in `:wq`, then press `Enter`. Intuitive, right? I know.

Comments in the crontab file start with `#`, and tasks take the form:  

```bash
# Check out this cool task below!
MIN HOUR DOM MON DOW CMD
```


Comments and tasks can't live on the same line.


Allowable values for each parameter are detailed in this table that I copied from [Geeks for Geeks](https://www.geeksforgeeks.org/crontab-in-linux-with-examples/):

|Field  |  Description   |  Allowed Value               |  
|-------|----------------|------------------------------|
|MIN    |  Minute field  |  0 to 59                     |   
|HOUR   |  Hour field    |  0 to 23                     |      
|DOM    |  Day of Month  |  1-31                        |        
|MON    |  Month field   |  1-12                        |      
|DOW    |  Day Of Week   |  0-6                         |
|CMD    |  Command       |  Any command to be executed. |

You can use a `*` in any of the date-time fields to indicate all values. Therefore, `1 * * * * CMD` executes `CMD` every minute of every hour of every day of the month of every month and so on.  

*** 

## But how do we use this to automate R scripts?  

First, the `CMD` is `RScript`. Next, we pass `RScript` the .R script we want to run ([see the docs](https://www.rdocumentation.org/packages/utils/versions/3.6.2/topics/Rscript)).

Let's pretend we have a script (`my_script.R`) that we want to run once per minute. This script generates 100 random samples from a normal distribution with `mean=0` and `sd=1` and writes them to a csv called `my_file.csv`:

```r
library(readr)

d <- rnorm(100)

write_csv(data.frame(num = d), "my_file.csv")
```  

Now we locate `RScript`. In your favorite `R` development environment, run `R.home()`. 

On my Mac it's: 

```r
> R.home()
[1] "/Library/Frameworks/R.framework/Resources"
```

Whereas on the EC2 I'm running on AWS it's: 

```r
> R.home()
[1] "/usr/lib/R"
```

You can navigate to this directory to verify that `RScript` lives there, or believe me. 

***

## Putting it all together

Let's create a `crontab` that runs `my_script.R` once every minute. We use `RScript` to run `my_script.R`. We add the following line to the crontab file we opened with `crontab -e`:  

```bash
# once every minute, run `my_script.R`
1 * * * * RScript "my_script.R"
```

Note that the first line is just a comment, whereas the second line is the command. Moreover, in the example above, you need to:

1. specify the full path of `RScript`
2. specify the full path of `my_script.R`


I've found that on the AWS EC2 I'm using, `~/my_script` doesn't work, whereas `/home/richpauloo/my_script.R` does.


***


Here are some resources I found helpful in writing this short summary:

1. [Steven Mortimer's blog](https://stevenmortimer.com/automating-r-scripts-with-cron/)
2. [Geeks for Geeks](https://www.geeksforgeeks.org/crontab-in-linux-with-examples/)

