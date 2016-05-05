#!/usr/bin/env php

<?php

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}

$server = array();
$browser = array();

$bo = $_SERVER;
ksort($bo);
foreach($bo as $key_name => $key_value) {
    if (startsWith($key_name, "HTTP_") || startsWith($key_name, "REQUEST_") || startsWith($key_name, "QUERY_"))
        $browser[$key_name] = $key_value;
    else
        $server[$key_name] = $key_value;

}

Print ("<!DOCTYPE html>\n<html>\n");
Print ("<head>\n");
Print ("\t<title>We Code In Our Underpants</title>\n");
Print ("\t<meta charset='UTF-8'>\t");
Print ("</head>\n");
Print ("<body style='background-color: white;'>\n");
Print ("<h1>Server</h1>\n");
Print ("<table>\n<tr><th>Name</th><th>Value</th></tr>\n");

foreach($server as $key_name => $key_value) {
    Print ("<tr><td>" . $key_name . "</td><td>" . $key_value . "</td></tr>\n");
}

Print ("</table>\n");
Print ("<h1>Browser</h1>\n");
Print ("<table>\n<tr><th>Name</th><th>Value</th></tr>\n");

foreach($browser as $key_name => $key_value) {
    Print ("<tr><td>" . $key_name . "</td><td>" . $key_value . "</td></tr>\n");
}

Print ("</table>\n");
Print ("</body>\n</html>\n");