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
var collection;

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'test';

function findHigherValue()
{
	return new Promise(function(resolve, reject)
	{
		this.collection.find({}).sort({"permits.VALUE":-1}).limit(3).toArray(function(err, docs) {
		  if (err) throw err;
		  resolve(docs);
		});
	});
}

function findAverageTotal()
{
	return new Promise(function(resolve, reject)
	{
		this.collection.aggregate([
		{
			$group : {
    			_id : null,
    			averageValue_unit: { $avg: "$permits.VALUE_unit" },
    			averageCost_unit: { $avg: "$permits.COST_unit" },
    			averageTotal_unit: { $avg: "$permits.TOTAL_unit" },
    			count: { $sum: 1 }
    		} 
    	}
		]).toArray(function(err, docs) {
	      if (err) throw err;
		  resolve(docs);
	    });
	});
}

/*db.ottawa_permits.aggregate([ { $group : {_id : "$permits.CONTRACTOR",averageValue: { $avg: "$permits.VALUE" },count: { $sum: 1 }}},{$match:{count:{$gt:5}}}, {'$sort': {'averageValue': -1}}, { $limit : 5 }]);*/
function findContractorMaxAvgCountSup5()
{
	return new Promise(function(resolve, reject)
	{
		this.collection.aggregate([
		{
			$group : {
    			_id : "$permits.CONTRACTOR",
    			averageValue: { $avg: "$permits.VALUE" },
    			count: { $sum: 1 }
    		} 
    	},
    	{$match:{count:{$gt:5}}},
    	{$sort: {'averageValue': -1}},
    	{$limit : 4 }
		]).toArray(function(err, docs) {
	      if (err) throw err;
		  resolve(docs);
	    });
	});
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to mongodb");
  this.client = client;
  this.db = client.db(dbName);
  // Get the documents collection
  this.collection = this.db.collection('ottawa_permits');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function()
{
	console.log("waiting on port " + port);
});

//Fetch data for html
app.get('/db/maxValue',function(req, res)
{
	findHigherValue().then(function(docs)
	{
		res.json(docs);
	});
});

app.get('/db/avgTotal',function(req, res)
{
	findAverageTotal().then(function(docs)
	{
		res.json(docs);
	});
});

app.get('/db/contractMax',function(req, res)
{
	findContractorMaxAvgCountSup5().then(function(docs)
	{
		res.json(docs);
	});
});

//Handler end function
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
