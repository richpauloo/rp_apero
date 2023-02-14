---
title: Using Twilio To Text Myself After Long Running Jobs
author: Rich
summary: Text yourself from R using Twilio so you can leave the comptuer but be notified the instant a long-running job completes.
date: '2019-09-11 02:57:45+00:00'
slug: textme
header:
  caption: ''
  image: ''
image: 
  caption: "[View the project here.](/project/textme/)"
projects: [textme]
---

Update: I've written a small package containing (1) the function below, and (2) another function that configures and saves your twilio credentials. You can view the package [here on Github](https://github.com/richpauloo/textme), and install it via:  

```r
devtools::install_github("richpauloo/textme")
``` 


***  

First and foremost, tremendous credit is due to [Sean Kross]() for the awesome [twilio](https://github.com/seankross/twilio) `R` package.   

I was running a pretty long geocoding job, and I ended up throwing a [`beepr::beep()`](https://www.r-project.org/nosvn/pandoc/beepr.html) into the console just so I would get a notification when the job completed.  

But the beep alerts me over the computer, so I was tied to it...  darn.  

Then I thought about how nice it would be to go on a walk outside, get some lunch, grab coffee with a colleague, or even go to the gym, but be notified while I'm away from the computer.  

If only I could get a **text message** when the job was done. That would be cool.  

So while my job was running (it still is)... I wrote this little script that I can stick in my `.RProfile` that loads a function `textme()`. The function has one purpose: text me at my phone number when my job is done running. Beauty.  





## Here's the function

You'll need to sign up for a free [Twilio account](https://www.twilio.com/).  

```r
# the following is no more than Sean Kross' example wrapped in a function
textme <- function(){
  
  # First you need to set up your accound SID and token as environmental variables
  Sys.setenv(TWILIO_SID = "SID_goes_here")
  Sys.setenv(TWILIO_TOKEN = "secret_key_goes_here")
 
  # Then we're just going to store the numbers in some variables
  my_phone_number <- "your_phone_number_here"
  twilios_phone_number <- "your_twilio_phone_number_here"
  
  # Now we can send away!
  twilio::tw_send_message(from = twilios_phone_number, 
                          to = my_phone_number, 
                          body = "👋 Rejoice! The dark deed you have requested has been done. 🎉")
  
}
```

Edit your `.Rprofile`, paste the function above, and save.  

```r
if(!file.exists("~/.Rprofile")) # only create if not already there
    file.create("~/.Rprofile")  # (don't overwrite it)
file.edit("~/.Rprofile")
```

Now if start a fresh RStudio session, all you need to do is add `textme()` to the end of a long-running process, and you'll get a text!  

Since my job is STILL running, I'm going to go for a walk and breathe some fresh air -- but not before asking my computer to alert me once it's done working.  

