
exports.view = function(req, res) {
    res.render('addEvent', { 
    	username : req.session.username, 
    	script:"/javascripts/add_event.js"});
};
