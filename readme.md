# Passthrough Server
A quick passthrough server that allows you to test local interfaces with separate APIs.

```
node passthrough.js 1337 "http://localhost:8080" "/path/to/public/dir"
```

Files that exist in the given public directory are served, other requests are routed to the server indidcated in the second parameter.  The first parameter sets where the proxy is listening at.

## Logging
All requests and responses are output to the console for debugging. For example:

```
====================================================
== Request: /users
====================================================
== host : localhost:1337
== connection : keep-alive
== cache-control : max-age=0
== accept : application/json, text/javascript, */*; q=0.01
== user-agent : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36
== x-requested-with : XMLHttpRequest
== referer : http://localhost:1337/index.html
== accept-encoding : gzip,deflate,sdch
== accept-language : en-US,en;q=0.8
== cookie : cookie data here (removed to keep this shorter)
== x-forwarded-for : 127.0.0.1
== x-forwarded-port : undefined
== x-forwarded-proto : http
== ==============
== Response
== ==============
== Status: 401
== date : Sat, 29 Jun 2013 02:53:55 GMT
== www-authenticate : Bearer realm="user-resources"
== content-type : text/plain
== transfer-encoding : chunked
== connection : keep-alive
== ==============
== Body
== ==============
== FIXME : Need to implement body logging
====================================================
== End Request: /users
====================================================
```