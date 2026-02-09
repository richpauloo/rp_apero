---
title: interpretable random forests
summary: Watch a random forest grow tree by tree and see how variable importance stabilizes.
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

Random forests are powerful but often opaque. The standard "variable importance" plot — showing mean decrease in accuracy or node impurity per predictor — summarizes the entire forest at once. But what happens as the forest grows?

I wanted to see variable importance evolve tree by tree:

<center>{{< tweet 1124470765095538688 >}}</center>

This kind of animation reveals something important: **how quickly variable importance rankings stabilize**. If rankings settle early, the model is interpretable and robust. If they keep shifting, the model may be unreliable for drawing scientific conclusions.

In the example above, one predictor clearly dominates, so the ranking stabilizes fast. But with more evenly matched predictors, the randomness of bagging and feature selection at each split could cause the top-ranked variable to fluctuate — both as a single forest grows and across independently trained forests.

Ranking stability has been studied in bioinformatics [^1] and remote sensing [^2], but it deserves wider attention anywhere random forests are used for inference rather than pure prediction.

Below is a minimal `R` example to reproduce an animation like this:

{{< gist richpauloo 8742761e131bd6a0486a40df2b9d1f01 "minimal_example.R">}}

A natural extension would be to plot out-of-bag error alongside importance as trees accumulate. I'd expect both to stabilize together.

[^1]: [Calle & Urrea (2010). "Stability of random forest importance measures." *Briefings in Bioinformatics*.](https://academic.oup.com/bib/article/12/1/86/243935)
[^2]: [Behnamian et al. (2017). "A systematic approach for variable selection with random forests." *IEEE Geoscience and Remote Sensing Letters*.](https://ieeexplore.ieee.org/abstract/document/8038868)

