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
			proxy.proxyRequest(req, res, {
				host: intendedUrl.hostname,
				port: intendedUrl.port
			});

		} else {
			console.log("Serving File Directly: " + fileName);
			//file DOES exist int he public dir
			var mimeType = mimeTypes[path.extname(fileName).split(".")[1]];
			res.writeHead(200, mimeType);
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
		console.log("== Request: ".cyan + currentPath.path.cyan + " -> ".cyan + intendedUrl.href.replace(/\/$/, "").cyan + currentPath.path.cyan);
		console.log("====================================================".cyan);
		_.each(req.headers, function(value, key) {
			console.log("== ".cyan + key.toString().green + " : ".green + value.toString().green);
		});
		console.log("== ".cyan + "==============\n".blue + "== ".cyan + "Response\n".blue + "== ".cyan + "==============".blue);
		console.log("== ".cyan + "Status: ".blue + res.statusCode.toString().blue);
		_.each(res._headers, function(value, key) {
			console.log("== ".cyan + key.blue + " : ".blue + value.blue);
		});
		console.log("== ".cyan + "==============\n".blue + "== ".cyan + "Body\n".blue + "== ".cyan + "==============".blue);
		//FIXME : Need to implement body logging
		console.log("== ".cyan + "FIXME : Need to implement body logging".blue)

		console.log("====================================================".cyan);
		console.log("== End Request: ".cyan + currentPath.path.cyan);
		console.log("====================================================".cyan);

	}

});