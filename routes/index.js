var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var db = require('../db.js');
var locals = {
    user: currUser,
    url: gapi.url,
    title: 'Today',
    eventlist: {'events':[]}
};
//console.log(gapi);
exports.index = function(req, res){
  console.log(locals);
//  res.render('homepage', { title: 'Today' });
//    console.log('--------------locals-----------');
	db.events.find(function(err, docs) {
  if (!err) {
    // console.log('mongojs working in index.js!');
    // console.log(docs);
    // sorting, for later
    // docs.sort(function(first, second) {
	  	// var date1 = first.start.dateTime;
	  	// var date2 = second.start.dateTime;
	  	// if (date1 > date2) {
				// return 1;
	  	// }
	  	// else if (date2 > date1) {
				// return -1;
	  	// }
	  	// else {
	  	// 	return 0;
	  	// }
    // });
    locals.eventlist.events = docs;
  }
	});
  res.render('homepage', locals);
};
