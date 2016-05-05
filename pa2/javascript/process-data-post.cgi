#!/usr/bin/node

var cgi = require('./cgi.js'), 
    out = process.stdout, html = cgi.html, queryParser = cgi.query;

var inputStream = process.stdin
    , data = '';

process.stdin.resume();

inputStream.on('data', (chunk) => {
    data += chunk;
});

inputStream.on('end', () => {
    var queryVar = queryParser.parseQueryString(data);
    
    html.header();

    for (var i = 0; i < queryVar.magicnumber; ++i) {
        out.write(`<h1>Hello ${queryVar.name} with a password of ${queryVar.password}!</h1>`);
    }

    html.footer();
});