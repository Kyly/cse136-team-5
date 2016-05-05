#!/usr/bin/env ruby
require "cgi"
require "./cgi-utils.rb"

cgi = CGI.new("html5")

cgi.out {
  cgi.html({"PRETTY" => " "}) {
    envServerVars = ""
    envBrowserVars = ""
    ENV.each {|key, value| 
      if key.match('^HTTP|^REQUEST')
        envBrowserVars.concat("<TR><TD>"+key+"</TD><TD>"+value+"</TD></TR>")
      else
        envServerVars.concat("<TR><TD>"+key+"</TD><TD>"+value+"</TD></TR>")
      end
    }
    html_head("white") + "<H1>Server</H1><TABLE><TR><TH>Name</TH><TH>Value</TH></TR>"+
    envServerVars + "</TABLE><H1>Client</H1><TABLE><TR><TH>Name</TH><TH>Value</TH></TR>"+
    envBrowserVars + "</TABLE></BODY>"
  }
}
