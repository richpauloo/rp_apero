---
title: interpretable random forests
summary: Cumulative variable importance.
tags: 
  - Data science
date: "2019-10-30T00:00:00Z"

# Optional external URL for project (replaces project detail page).
#external_link: "http://calwaterquality.com"

image:
  caption: 
  focal_point: Smart
  preview_only: true

links:
- icon: github
  icon_pack: fab
  name: Github
  url: https://gist.github.com/richpauloo/8742761e131bd6a0486a40df2b9d1f01

url_code: ""
url_pdf: ""
url_slides: ""
url_video: ""



# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides: example


---

The "variable importance" plot that shows the mean decrease in accuracy or node impurity per predictor is a classic metric used to interpret random forest models. 

This metric aggregates mean decrease in accuracy across all trees in the forest. I wanted to watch a forest "grow" tree by tree, alongside the cumulative variable importance:  

<center>{{< tweet 1124470765095538688 >}}</center>  

Animations like the one above may help visualize an important behavior of machine learning models: **the stability of random forest variable importance rankings**. Variable importance ranking stability is critical to scientific pursuits, which require interpretable models. Unstable models are not as interpretable as stable ones. To the best of my knowledge, variable importance ranking stability has been studied in the context of remote sensing [^1] and bioinformatics [^2].  

In the example random forest model above, one predictor was much more predictive than others, and the variable importance ranking was relatively stable. However with different data, it's imaginable that due to the random way in which training data and predictors are used at each node to determine splits, a few predictors might switch top rank as the most important variable. This may happen within a single forest as it grows, or between different fully-grown forests.  

Below is a minimal example in `R` to reproduce an animation like the one above. In a next iteration, it would edifying to add the *MSE/ntree* plot. I expect that as the number of trees increases and the out of bag error stabilizes, the variable importance ranking also stabilizes.  

{{< gist richpauloo 8742761e131bd6a0486a40df2b9d1f01 "minimal_example.R">}}

[^1]: [Calle, M. Luz, and Víctor Urrea. "Letter to the editor: stability of random forest importance measures." Briefings in bioinformatics 12.1 (2010): 86-89.](https://academic.oup.com/bib/article/12/1/86/243935)  
[^2]: [Behnamian, Amir, et al. "A systematic approach for variable selection with random forests: achieving stable variable importance values." IEEE Geoscience and Remote Sensing Letters 14.11 (2017): 1988-1992.](https://ieeexplore.ieee.org/abstract/document/8038868)

