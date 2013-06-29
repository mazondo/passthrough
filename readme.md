# Passthrough Server
A quick passthrough server that allows you to test local interfaces with separate APIs.

```
node passthrough.js 1337 "http://localhost:8080" "/path/to/public/dir"
```

Files that exist in the given public directory are served, other requests are routed to the server indidcated in the second parameter.  The first parameter sets where the proxy is listening at.

## Logging
All requests and responses are output to the console for debugging.