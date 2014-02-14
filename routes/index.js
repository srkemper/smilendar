var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
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
  res.render('homepage', locals);
};
