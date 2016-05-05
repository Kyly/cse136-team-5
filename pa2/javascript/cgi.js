var _ = require('lodash');

var header = {
    server: [],
    http: []
};

var out  = process.stdout;
var html = {
    contentType: 'Content-Type: text/html\r\n\n',
    head: '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="UTF-8">\n\t<title>We code in our underpants</title>\n</head>\n',
    body: (color) => `<body style="background-color: ${color};">\n`,
    footer: () => {
        out.write('</body>\n</html>\n');
    },
    header: (color) => {
        out.write(`${html.contentType}${html.head}${html.body(color ? color : 'white')}`);
    }
};

header.parseHeader = (env) => {

    var http   = header.http;
    var server = header.server;

    if (!env)
    {
        return;
    }

    var keys = Object.keys(env).sort();

    keys.forEach(function (key) {

        var value = env[key];

        if (!value)
        {
            return;
        }

        if (key.startsWith('HTTP_') || key.startsWith('REQUEST_') || key.startsWith('QUERY_'))
        {
            http.push({name: key, val: value});
            return;
        }

        server.push({name: key, val: value});
    });

    return {
        server: server,
        http: http
    };
};

var query = {};

query.parseQueryString = (qStr) => {
    var elements  = qStr.split('&');
    
    return elements.reduce((prev, curr) => {
        var s = curr.split('=');

        prev[s[0]] = s[1];

        return prev;
    }, {});
    
};

query.getQueryStringObject = (env) => {

    header.parseHeader(env);
    var qStr = _.find(header.http, (arr) => {
        return arr[0] === 'QUERY_STRING';
    });

    if (!qStr)
    {
        return;
    }

    return parse.parseQueryString(qStr);
};

module.exports = {
    header: header,
    html: html,
    query: query
};
