#!/usr/bin/node

var cgi = require('./cgi.js'), 
    out = process.stdout, html = cgi.html, queryParser = cgi.query;

var qStr      = process.env.QUERY_STRING;
var queryVars = {};

if (qStr)
{
    queryVars = queryParser.parseQueryString(qStr);
}

html.header();

for (var i = 0; i < queryVars.magicnumber; ++i)
{
    out.write(`<h1>Hello ${queryVars.name} with a password of ${queryVars.password}!</h1>`);
}

html.footer();