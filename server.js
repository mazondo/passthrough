var http = require('http');
var url = require('url');
var path = require('path');

var colorize = require("colorize");
var colorconsole = colorize.console;

var _ = require("underscore");

var proxyPort = process.argv[2];
var intendedPort = process.argv[3];

http.createServer(function (req, res) {

	var currentPath = url.parse(req.url);
	var currentHeaders = req.headers;


	colorconsole.log("\n");

	// output what we've got so far
	if (!currentPath.pathname.match(/ico|png|jpg$/i)) {

		colorconsole.log("#green[=========== REQUEST ========\n== " + currentPath.path + "]");
		colorconsole.log("#green[=========== HEADERS ===========");
		_.each(currentHeaders, function(value, key) {
			colorconsole.log("#green[== " + key + " : " + value + "]");
		});

	} else {

		colorconsole.log("Skipped Logging: " + currentPath.pathname);
	}

	//send the request over to the intended destination
	var proxy = http.request(intendedPort, req.headers.host);
	
	res.writeHead(200, {'Content-Type': 'text/plain'});

	res.end(JSON.stringify(currentPath));

}).listen(proxyPort);

colorconsole.log('#blue[Proxy listening on ' + proxyPort + ' and forwarding to ' + intendedPort + "]");