//required libraries
var http = require('http'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    colors = require("colors"),
    _ = require("underscore"),
    mime = require("mime");

//config
var proxyPort = process.argv[2],
    intendedUrl = url.parse(process.argv[3]),
    publicDir = process.argv[4] || process.cwd();

server = httpProxy.createServer(function(req, res, proxy) {

  var currentPath = url.parse(req.url),
      fileName = publicDir + currentPath.pathname;

  fs.exists(fileName, function(exists) {
    if (!exists) {
      req.chunkedBody = "";

      req.buffer = httpProxy.buffer(req);

      req.on("data", function(chunk) {
        req.chunkedBody += chunk;
      });

      //file not found, redirect to proxy
      proxy.proxyRequest(req, res, {
        host: intendedUrl.hostname,
        port: intendedUrl.port,
        buffer: req.buffer
      });

    } else {
      //file exists, just serve it
      var mimeType = mime.lookup(fileName);
      console.log("Static File: ".grey + currentPath.pathname.grey + " - ".grey + mimeType.grey);
      res.writeHead(200, {'Content-Type': mimeType});
      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);
    }
  });

}).listen(proxyPort, "127.0.0.1");

console.log('\n==================================\nProxy On: ' + proxyPort.green.bold + '\nForwarded To: ' + intendedUrl.host.blue.bold + "\nPublic Directory: " + publicDir + "\n==================================");

server.proxy.on("proxyResponse", function(req, res, response) {
  var responseData = "";
  response.on("data", function(chunk) {
    responseData += chunk;
  });

  response.on("end", function() {
    var currentPath = url.parse(req.url);

    if (!currentPath.pathname.match(/ico$/i)) {
      console.log("\n====================================================".cyan);
      console.log("== ".cyan + req.method.cyan + " ".cyan + currentPath.path.cyan + " -> ".cyan + intendedUrl.href.replace(/\/$/, "").cyan + currentPath.path.cyan);
      console.log("====================================================".cyan);
      _.each(req.headers, function(value, key) {
        console.log("== ".cyan + key.toString().green + " : ".green + value.toString().green);
      });

      console.log("== ".cyan + "=============".green);
      console.log("== ".cyan + "BODY: ".green + (req.chunkedBody || "None").green);
      console.log("== ".cyan + "==============\n".blue + "== ".cyan + "Response\n".blue + "== ".cyan + "==============".blue);
      console.log("== ".cyan + "Status: ".blue + res.statusCode.toString().blue);

      _.each(res._headers, function(value, key) {
        console.log("== ".cyan + key.blue + " : ".blue + value.blue);
      });

      console.log("== ".cyan + "BODY: ".blue + (responseData.toString("utf8") || "None").blue);
      console.log("====================================================".cyan);
      console.log("== End ".cyan + req.method.cyan + " ".cyan + currentPath.path.cyan);
      console.log("====================================================".cyan);
    }
  });
});