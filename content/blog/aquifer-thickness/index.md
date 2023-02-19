---
title: Aquifer thickness calculated from ~300,000 well logs
author: Rich
date: '2018-03-15 02:57:45+00:00'
slug: aquifer-thickness
summary: Data visualization from hundreds of thousands of well completion reports reveals aquifer characteristics in California groundwater basins.
external_link: ""
links:
- icon: github
  icon_pack: fab
  name: Github
  url: https://github.com/richpauloo/junkyard/blob/master/aquifer_thickness/index.Rmd
math: false
featured: true
tags:
- R
- spatial
- water
---

<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>
<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>
<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>

At the time of writing, the [California DWR Online Well Completion Report Database](https://data.ca.gov/dataset/well-completion-reports) contains \~1,000,000 digitized well logs. About 1/3 of those wells have information on the top and bottom of the perforated interval, which we can use to compute and visualize regional estimates of:

- top of perforated interval - aquifer top  
- bottom of perforated interval - aquifer bottom  
- thickness of perforated interval - aquifer thickness

### Read in pre-computed results

I realize that I’m skipping straight to the results. For how I arrived at these numbers, see [the full code here](https://github.com/richpauloo/junkyard/blob/master/aquifer_thickness/index.Rmd).

``` r
library(tidyverse)
library(sp)
library(sf)
library(leaflet)
library(widgetframe)

# pre-computed results
gwb_full <- read_rds("~/Documents/Github/rp/static/data/gwb_full.rds")
labels  <- read_rds("~/Documents/Github/rp/static/data/labels.rds")
```

### Thickness of perforated interval

``` r
bins <- c(0,50, 100,200,300,400,500,600)
pal <- colorBin("inferno", gwb_full$mean_pit, bins = bins)

# make another layer control group name
gwb_full$Basin_Subb_2 <- gwb_full$Basin_Subb

# rename groups for legend
temp <- gwb_full %>% 
  rename(median_perforated_interval_thickness = Basin_Subb,
         mean_perforated_interval_thickness = Basin_Subb_2)

# plot
leaflet(width = "100%") %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(mean_pit), 
              label = lapply(labels[[1]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "mean_perforated_interval_thickness") %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(median_pit), 
              label = lapply(labels[[2]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "median_perforated_interval_thickness") %>%
  addLegend(pal = pal, values = temp$mean_pit,
            title = ("thickness (ft.)")) %>%
  addLayersControl(overlayGroups =
                     c("median_perforated_interval_thickness",
                       "mean_perforated_interval_thickness")) %>%
  hideGroup("median_perforated_interval_thickness") %>% 
  frameWidget(height = "400")
```

    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()

<div id="htmlwidget-1" style="width:100%;height:400px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-1">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-2.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

------------------------------------------------------------------------

### Top of perforated interval: aquifer top (depth below sea level)

``` r
bins <- c(0,100,200,300,400,500,600,700, 800, 900, 1000)
pal <- colorBin("viridis", gwb_full$mean_top, bins = bins) 

# rename groups for legend
temp <- gwb_full %>% 
  rename(median_top_perforated_interval = Basin_Subb,
         mean_top_perforated_interval = Basin_Subb_2) 

# plot
leaflet(width = "100%") %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(mean_top), 
              label = lapply(labels[[3]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "mean_top_perforated_interval") %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(median_top), 
              label = lapply(labels[[4]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "median_top_perforated_interval") %>%
  addLegend(pal = pal, values = temp$mean_top,
            title = ("depth (ft.)")) %>%
  addLayersControl(overlayGroups =
                     c("median_top_perforated_interval",
                       "mean_top_perforated_interval")) %>%
  hideGroup("median_top_perforated_interval") %>% 
  frameWidget(height = "400")
```

    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()

<div id="htmlwidget-2" style="width:100%;height:400px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-2">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-3.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

------------------------------------------------------------------------

### Bottom of perforated interval: aquifer bottom (depth below sea level)

``` r
bins <- c(0,100,200,300,400,500,600,700, 800, 900, 1000, 1100)
pal <- colorBin("viridis", gwb_full$mean_bot, bins = bins) 

# rename groups for legend
temp <- gwb_full %>% 
  rename(median_bot_perforated_interval = Basin_Subb,
         mean_bot_perforated_interval = Basin_Subb_2)

# plot
leaflet(width = "100%") %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(mean_bot), 
              label = lapply(labels[[5]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "mean_bot_perforated_interval") %>%
  addPolygons(data = temp, stroke = FALSE, smoothFactor = 0.2,
              color = ~pal(median_bot), 
              label = lapply(labels[[6]], htmltools::HTML),
              fillOpacity = 0.8,
              group = "median_bot_perforated_interval") %>%
  addLegend(pal = pal, values = temp$mean_bot,
            title = ("depth (ft.)")) %>%
  addLayersControl(overlayGroups =
                     c("median_bot_perforated_interval",
                       "mean_bot_perforated_interval")) %>%
  hideGroup("median_bot_perforated_interval") %>% 
  frameWidget(height = "400")
```

    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()
    ## old-style crs object detected; please recreate object with a recent sf::st_crs()

<div id="htmlwidget-3" style="width:100%;height:400px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-3">{"x":{"url":"index_files/figure-html//widgets/widget_unnamed-chunk-4.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>
