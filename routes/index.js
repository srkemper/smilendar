
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('homepage', { title: 'Today' });
};
