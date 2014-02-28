


exports.view = function(req, res) {
    console.log('---addEvent view---')
	console.log(req.params.id)
    console.log(req.session)
    console.log(req.cookies)
    res.render('addEvent', {
    	user:req.session.username || req.cookies.username,
    	script:"/javascripts/add_event.js",
    	dayId:req.params.id,
    	goback:{
    		link:"/" + req.params.id,
    		display:"Today"
    	}
    });
};
