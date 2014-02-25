
exports.view = function(req, res) {
	console.log(req.params.id)
    res.render('addEvent', { 
    	user : req.session.username, 
    	script:"/javascripts/add_event.js",
    	dayId:req.params.id,
    	goback:{
    		link:"/" + req.params.id,
    		display:"Today"
    	}
    });
};
