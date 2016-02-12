#!/usr/bin/env node
"use strict";


//
//  Dependencies
//
var fs = require('fs');
var path = require('path');
var tinylr = require('tiny-lr');
var program = require('commander');
var colors = require('colors/safe');
var pkg = require('./package.json');



//
//  Command Line Options
//
program
  .version(pkg.version)
  .usage('[options] <directory>')
  .option('--host [host]', 'the host to bind to [localhost]')
  .option('--port [port]', 'the port to bind to [8080]')
  .option('--live-reload-port [port]', 'the port to start LiveReload on [35729]')
  .option('--no-color', 'disable colored output')
	.option('--ssl', 'enable ssl/https')
	.option('--key [key]', 'path to secure key [~/.ssh/dev/key.pem]')
	.option('--cert [cert]', 'path to cert key [~/.ssh/dev/cert.pem]')
  .parse(process.argv);


//
//  Define Variables
//
var httpPort = (typeof program.port != 'undefined') ? program.port : 8080;
var liveReloadPort = (typeof program.liveReloadPort != 'undefined') ? program.liveReloadPort : 35729;



//
//  Define Directories
//
var directories = (program.args.length == 0) ? ['./'] : program.args;

console.info();
console.info(colors.cyan.underline('Watching these directories:'));

for (var key in directories) {
  console.info("  ", colors.white(directories[key]));
}


//
//  Setup File Serving via Express
//
var express = require('express');
var app = express();


//  Add directories
for (var key in directories) {
  app.use(express.static(directories[key]));
}


var server = app;

//
//	SSL/HTTPS Support (--ssl option)
//
if (program.ssl) {
  
	var keyPath = (typeof program.key != 'undefined') ? program.key : process.env.HOME + '/.ssh/dev.key.pem';
	var certPath = (typeof program.cert != 'undefined') ? program.cert : process.env.HOME + '/.ssh/dev.cert.pem';
  
	//
	//	openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 3001
	//	openssl req  -nodes -new -x509  -keyout key.pem -out cert.pem -days 365
	//
	var options = {
	  key: fs.readFileSync(keyPath).toString(),
	  cert: fs.readFileSync(certPath).toString(),
		passphrase: 'test'
	};
  
	var https = require('https');
	server = https.createServer(options, app);
  
}




server
  .listen(httpPort, program.host)
  .on('error', function (err) {
    
    if (err.code == 'EADDRINUSE') {
      
      console.error();
      console.error(colors.red.bold('You already have a server listening on port [%s]'), httpPort);
      console.error(colors.yellow((program.ssl ? 'HTTPS' : 'HTTP') + ' server has been disabled'));
      console.error();
      
      return;
    }
    
    console.error();  
    console.error(colors.red(err.stack));
    console.error();
  });


console.info();
console.info(colors.green((program.ssl ? 'HTTPS' : 'HTTP') + ' server listening on port [%d]'), httpPort);



//
//  Create LiveReload Server
//

var reloadServer = new tinylr.Server();


reloadServer.error = function (err) {
  
  if (err.code == 'EADDRINUSE') {
    console.error();
    console.error(colors.red.bold('You already have a server listening on port [%s]'), liveReloadPort);
    console.error(colors.yellow('LiveReload has been disabled'));
    console.error();
    return;
  }
  
  
  console.error();  
  console.error(colors.red(err.stack));
  console.error();
};


reloadServer.listen(liveReloadPort, function () {
  console.info(colors.green('Livereload listening on port [%d]'), liveReloadPort);
  console.info();
});



//
//  Watch Directories
//
var watchers = [];

for (var key in directories) {
  
  var watcher = (function (directory) {

    return fs.watch(directory, function (event, filename) {
      var filepath = path.join(directory, filename);
      console.info('  ', colors.grey(event), colors.white(filepath));
      
      //  Signal LiveReload server that file(s) have changed
      reloadServer.changed({ body: { files: [filepath] } });
    });

  })(directories[key]);
  
  watchers.push(watcher);
  
}


