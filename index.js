const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const port = 8080;
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

//Use the css of this folder
app.use(express.static(__dirname));

//Connection mongodb
var client;
var db;

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'test';

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('ottawa_permits');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
  	console.log(err);
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to mongodb");
  this.client = client;
  this.db = client.db(dbName);

  /*findDocuments(this.db, function(docs)
  	{
  		console.log("finished");
  	});*/
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function()
{
	console.log("waiting on port " + port);
});


function exitHandler(options, err) {
    if (options.cleanup) this.client.close();
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));