var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var mongo_client = require('mongodb').MongoClient;
var locals = {
    user: currUser,
    url: gapi.url,
    title: 'Today',
    eventlist: data
};
//console.log(gapi);
exports.index = function(req, res){
  console.log(data);
//  res.render('homepage', { title: 'Today' });
//    console.log('--------------locals-----------');
	mongo_client.connect('mongodb://localhost/exampleDb', function(err, db) {
		if (err) {
			console.log('error in index.js');
			return console.dir(err);
		}
		var collection = db.collection('test', function(err, collection) {
			console.log(collection);
			if (err) {
				console.log(err);
			}
			collection.findOne({'hello':'doc1'}, function(err, item) {
				console.log(item);
			});
		});
	});
  res.render('homepage', locals);
};
