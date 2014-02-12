
/*
 * GET home page.
 */
var currUser;
var gapi = require('./../lib/gapi');
var locals = {
    user: currUser,
    url: gapi.url,
    title: 'Today'
};
//console.log(gapi);
exports.index = function(req, res){
//  res.render('homepage', { title: 'Today' });
//    console.log('--------------locals-----------');
//    console.log(locals);
  res.render('homepage', locals);
};
