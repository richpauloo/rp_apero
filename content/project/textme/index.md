---
title: textme
summary: Text yourself from R when long running jobs complete.
tags: 
  - Data science
date: "2019-10-30T00:00:00Z"

# Optional external URL for project (replaces project detail page).
#external_link: "http://calwaterquality.com"

image:
  caption: ''
  focal_point: Smart

links:
- icon: github
  icon_pack: fab
  name: Github
  url: https://github.com/richpauloo/textme

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

<center>{{< tweet 1171983440486383616 >}}</center>


First and foremost, tremendous credit is due to [Sean Kross]() for the awesome [twilio](https://github.com/seankross/twilio) `R` package, which this package depends on.  

What I've done in this package is:  

1. generalized the process of configuring twilio API credentials so that they're saved in `.Renviron` files. The advantages of this approach are that the credentials only need to be supplied once, and you won't risk accidentally pushing them to Github. This functionality is provided by [`tm_configure()`](https://github.com/richpauloo/textme/blob/master/R/tm_configure.R).  
2. wrapped the default example into a function with helpful error messages, and a set of punny pre-made messages. This functionality is provided by [`textme()`](https://github.com/richpauloo/textme/blob/master/R/textme.R)
