#!/usr/bin/env python

import cgi
form = cgi.FieldStorage()

print "Content-Type: text/html"
print

print "<!DOCTYPE html> <html> <head> <meta charset='UTF-8'><title>We code in our underpants</title>"
print "</head> <body style='background-color:" + "white" + "'>"



variable = ""
value = ""
l = []
for key in form.keys():
	variable = str(key)
	l.append(str(form.getvalue(variable)))

username = l[0]

password = l[1]

magicnumber = int(l[2])

while magicnumber != 0:
	print "<h1>Hello " + str(username) +" with a password of " + str(password) + " !</h1>"
	magicnumber = magicnumber - 1

print "</body>"
print "</html>"