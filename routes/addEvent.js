
exports.view = function(req, res) {
	console.log(req.params.id)
    res.render('addEvent', { 
    	username : req.session.username, 
    	script:"/javascripts/add_event.js",
    	goback:req.params.id});
};
