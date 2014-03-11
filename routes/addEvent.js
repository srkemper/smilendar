var gapi = require('./gapi');

function getDateFromDayID(dayId) {
    var today = new Date();
    var year = today.getFullYear();
    var monthId = parseInt(dayId.split('-')[0])-1;
    // var monthId = parseInt(dayId.substring(0,2))-1; // just extract month part, e.g. 02
    // var dateId = parseInt(dayId.substring(3,5));
    var dateId = parseInt(dayId.split('-')[1]);
    // console.log('---getDateFromDayID---')
    // console.log(monthId)
    // console.log(dateId)

    return new Date(year, monthId, dateId)
}

function returnTwoDigits(digit) {
    // return digit in string XX form
    var d = digit.toString();
    if (d.length == 1) {
        d = '0'+d;
    }
    return d
}

function getTimeInputDefaultHelper(date) {
    // return date string as YYYY-MM-DDTHH:MM
    var year = date.getFullYear();
    var month = returnTwoDigits(date.getMonth()+1);
    var day = returnTwoDigits(date.getDate());
    var hour = returnTwoDigits(date.getHours());
    var minutes = returnTwoDigits(date.getMinutes());

    return year+'-'+month+'-'+day+'T'+hour+':'+minutes
}

function getTimeInputDefault(dayId) {
    // given dayId return date string as YYYY-MM-DDTHH:MM
    // example output: 2014-01-03T03:59
    console.log('---getTimeInputDefault---')
    var desiredDay = getDateFromDayID(dayId);
    console.log(desiredDay)
    var today = new Date(); // get curr time from today

    var year = desiredDay.getFullYear();
    var month = desiredDay.getMonth();
    var day = desiredDay.getDate();
    var hour = today.getHours();
    var minutes = today.getMinutes();

    var startDefault = new Date(year, month, day, hour, minutes);
    var endDefault = new Date(year, month, day, hour+1, minutes);
    var default_start_time = getTimeInputDefaultHelper(startDefault);
    var default_end_time = getTimeInputDefaultHelper(endDefault);
    return [default_start_time, default_end_time]
}

exports.view = function(req, res) {
    console.log('---addEvent view---')
	console.log(req.params.id)
    console.log(req.session)
    console.log(req.cookies)
    var dayId = req.params.id;
    
    default_times = getTimeInputDefault(dayId);
    
    res.render('addEvent', {
    	'user':req.session.username || req.cookies.username,
    	'script':"/javascripts/add_event.js",
    	'dayId':req.params.id,
    	'goback':{
    		'link':"/" + req.params.id,
    		'display':"Back"
    	},
        'default_start_time': default_times[0],
        'default_end_time': default_times[1],
        'nav': 'nav',
        'authurl': gapi.url
    });
};
