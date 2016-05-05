#!/usr/bin/env ruby

require "cgi"
require "./cgi-utils.rb"

cgi = CGI.new("html5")

responseStr = ""
username = nil
password = nil
magicnum = nil

(cgi.has_key? "name") ? username = cgi["name"] : username = "username"
(cgi.has_key? "password") ? password = cgi["password"] : password = "password"
(cgi.has_key? "magicnumber") ? magicnum = cgi["magicnumber"] : magicnum = "0"
magicnum.to_i().times {
  responseStr.concat("<H1>Hello " + username + " with a password of " + password + "!</H1>")
}
cgi.out {
  cgi.html("PRETTY" => " ") {
    html_head("white") + responseStr + "</BODY>"
  }
}
