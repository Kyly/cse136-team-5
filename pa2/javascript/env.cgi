#!/usr/bin/node

var out = process.stdout;
var cgi = require('./cgi.js');
var headers = cgi.header.parseHeader(process.env);
var html = cgi.html;

function printTable(arr) {
    out.write('<table><tr><th>Name</th><th>Value</th></tr>');
    arr.forEach(function(el) {
        out.write(`<tr>\n\t<td>${el.name}</td>\n\t<td>${el.val}</td>\n</tr>`);
    });
    out.write('</table>');
}

html.header();
out.write('<h1>Server</h1>');
printTable(headers.server);
out.write('<h1>Client</h1>');
printTable(headers.http);
html.footer();
