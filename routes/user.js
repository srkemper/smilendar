
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

// login page 
exports.loginpage = function(req, res) {
	console.log("login page");
	var username = req.query.username;
	console.log("username is: " + username);
	var catchError = null;
	if (username) {
		var day = new Date().getDate();
		var month = new Date().getMonth() + 1;
		res.redirect('/' + month + "-" + day);
	}

	req.session.username = username;
	res.render('login.handlebars', catchError)
}

// redirect after login
exports.login_redirect = function(req, res){
	console.log("logged in");
	var username = req.query.username;
	console.log("username is: " + username);
	req.session.username = username;
	var catchError = null;
	if (username) {
		var day = new Date().getDate();
		var month = new Date().getMonth() + 1;
		res.redirect('/' + month + "-" + day);
	} else {
		catchError = 1;
		res.redirect('/')
		// res.render('login.handlebars', catchError)
	}
	
}

exports.logout = function(req, res){
	req.session.username = null;
	res.redirect('/');
}