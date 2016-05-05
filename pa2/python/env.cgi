#!/usr/bin/env python

import os
import re

env_vars = os.environ.data
sorted_env_vars = sorted(env_vars.items())
p1 = re.compile("^HTTP_*")
p2 = re.compile("^REQUEST_*")
server_vars = []
browser_vars = []

for var in sorted_env_vars:
    f1 = p1.match(var[0])
    f2 = p2.match(var[0])
    if f1 or f2:
        if var[1]:
            browser_vars.append(var)
    else:
        if var[1]:
    	    server_vars.append(var)

def printTable(array):
	print "<table><tr><th>Name</th><th>Value</th></tr>"
	for ele in array:
		print "<tr>"
		print "<td>" + ele[0] + "</td><td>" + ele[1] + "</td>"
		print "</tr>"
	print "</table>"

print "Content-Type: text/html"
print ""
print "<!DOCTYPE html> <html> <head> <meta charset='UTF-8'><title>We code in our underpants</title></head>"
print "<body style='background-color:white;'>"

print "<h1>Server</h1>"
printTable(server_vars)

print "<h1>Client</h1>"
printTable(browser_vars)

print "</body>"
print "</html>"
