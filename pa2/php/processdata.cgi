#!/usr/bin/env php

<?php

if ( $_SERVER['REQUEST_METHOD'] == 'GET') {
    parse_str($_SERVER['QUERY_STRING']);
} else {
    $postData = fgets(STDIN);

    if (isset($postData)) {
        parse_str($postData);
    }
}

Print ("<!DOCTYPE html> <html> <head> <meta charset='UTF-8'><title>We code in our underpants</title>");
Print ("<body style='background-color: white'>");
for ($i = 0; $i < $magicnumber; $i++) {
    Print ("<h1>Hello " . $name . " with a password of " . $password . " </h1>");
}

Print ("</body></html>");
