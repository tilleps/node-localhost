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


app
  .listen(httpPort, program.host)
  .on('error', function (err) {
    
    if (err.code == 'EADDRINUSE') {
      
      console.error();
      console.error(colors.red.bold('You already have a server listening on port [%s]'), httpPort);
      console.error(colors.yellow('HTTP server has been disabled'));
      console.error();
      
      return;
    }
    
    console.error();  
    console.error(colors.red(err.stack));
    console.error();
  });


console.info();
console.info(colors.green('HTTP server listening on port [%d]'), httpPort);



//
//  Create LiveReload Server
//

var server = new tinylr.Server();


server.error = function (err) {
  
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


server.listen(liveReloadPort, function () {
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
      server.changed({ body: { files: [filepath] } });
    });

  })(directories[key]);
  
  watchers.push(watcher);
  
}


