#!/usr/bin/env node

var http = require('http')

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err.message);
  console.log(err.stack)
});


var controller = require('./controller').controller


http.createServer(function (req, res) {
	controller(req, res)
}).listen(9191, "127.0.0.1");

console.log('Server running at http://127.0.0.1:9191/');



