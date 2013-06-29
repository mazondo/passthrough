//required libraries
var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var fs = require('fs');
var path = require('path');
var colors = require("colors");
var _ = require("underscore");

//config
var proxyPort = process.argv[2];
var intendedUrl = url.parse(process.argv[3]);
var publicDir = process.argv[4] || process.cwd();

var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"};

server = httpProxy.createServer(function (req, res, proxy) {

	var currentPath = url.parse(req.url);
	var fileName = publicDir + currentPath.pathname;

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
			var mimeType = mimeTypes[path.extname(fileName).split(".")[1]];
			console.log("Static File: ".grey + currentPath.pathname.grey + " - ".grey + mimeType.grey);
			res.writeHead(200, {'Content-Type' : mimeType});
			var fileStream = fs.createReadStream(fileName);
			fileStream.pipe(res);
		}
	});

}).listen(proxyPort, "127.0.0.1");

console.log('\n==================================\nProxy On: ' + proxyPort.green.bold + '\nForwarded To: ' + intendedUrl.host.blue.bold + "\nPublic Directory: " + publicDir + "\n==================================");

server.proxy.on("end", function(req, res) {

	var currentPath = url.parse(req.url);

	if (!currentPath.pathname.match(/ico|png|jpg$/i)) {
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
		//FIXME : Need to implement body logging
		console.log("== ".cyan + "BODY: ".blue + (res.chunkedBody || "None").blue)

		console.log("====================================================".cyan);
		console.log("== End ".cyan + req.method.cyan + " ".cyan + currentPath.path.cyan);
		console.log("====================================================".cyan);

	}

});