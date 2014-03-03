exports.view = function(req,res) {
    console.log('---about---');
    var locals = {
	    user: '',
	    // title: 'Today',
	    goback: {
	        link: '',
	        display: '',
	    },
        nav:'nav'
	};

	locals.dayId = getTag(new Date());	// get tag for Today

    locals.user = req.session.username || req.cookies.username;
    locals.goback.display = 'Today';
    locals.goback.link = locals.dayId;
    console.log(locals);
    res.render('about',locals)
}

function getTag(currDate) {
    var month = currDate.getMonth()+1;
    month = month.toString();
    var date = currDate.getDate();
    date = date.toString();

    // month = appendZero(month);
    // date = appendZero(date);

    var tag = month+'-'+date;

    return tag;
}