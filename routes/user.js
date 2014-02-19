
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
	var day = new Date().getDate();
	var month = new Date().getMonth() + 1;
	if (month >= 10) {
		month = "0" + month
	}
	res.redirect('/' + month + "-" + day);
}

exports.logout = function(req, res){
	req.session.username = null;
	res.redirect('/');
}