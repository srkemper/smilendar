
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
	console.log("login");
	var username = req.query.username;
	console.log("username is: " + username);
	req.session.username = username;
	var id = new Date().getDate();
	res.redirect('/' + id);
}

exports.logout = function(req, res){
	req.session.username = null;
	res.redirect('/');
}