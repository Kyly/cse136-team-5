#!/usr/bin/env python

import datetime
import random


now = datetime.datetime.now().strftime("%m/%d/%Y %H:%M:%S")

rand_int = random.randint(0,15)

colors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy",
           "olive", "purple", "red", "silver", "teal", "white", "yellow"]

text = "black"
if rand_int == 1:
    text = "white"


print "Content-type: text/html"
print ""
print "<!DOCTYPE html> <html> <head> <meta charset='UTF-8'><title>We code in our underpants</title>"
print "</head> <body style='background-color:" + colors[rand_int] + ";'>"
print "<h1 style='color:" + text + ";'>Hello World from Python @ " + str(now) + "</h1>"
print "</body>"
print "</html>"
