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
== POST /users -> http://localhost:8080/users
====================================================
== host : localhost:1337
== connection : keep-alive
== content-length : 54
== accept : application/json, text/javascript, */*; q=0.01
== origin : http://localhost:1337
== x-requested-with : XMLHttpRequest
== user-agent : Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36
== content-type : application/json
== referer : http://localhost:1337/index.html
== accept-encoding : gzip,deflate,sdch
== accept-language : en-US,en;q=0.8
== cookie : removed (to keep it short)
== x-forwarded-for : 127.0.0.1
== x-forwarded-port : 59555
== x-forwarded-proto : http
== =============
== BODY: {"email":"me@me.com","password":"password"}
== ==============
== Response
== ==============
== Status: 200
== date : Sat, 29 Jun 2013 05:01:29 GMT
== content-type : application/json
== content-encoding : gzip
== vary : Accept-Encoding, User-Agent
== transfer-encoding : chunked
== connection : keep-alive
== BODY: None
====================================================
== End POST /users
====================================================
```