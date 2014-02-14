var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var db = require('../db.js');

var dayToName = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
}

var eventsByDay = {
    'sun': [],
    'mon': [],
    'tue': [],
    'wed': [],
    'thu': [],
    'fri': [],
    'sat': []
};   // organize events by day

// parses datetime
function parseDateTime(datetime) {
        var d = new Date(Date.parse(datetime));
        var day = dayToName[d.getDay()];   // gets the day of the week
        var month = d.getMonth();
        var date = d.getDate();
        var hour = d.getHours(); // returns the hour (from 0-23) of the time
        var minutes = d.getMinutes();   // returns the min (from 0-59)

        timeobj = {
            'day': day,
            'month': month,
            'date': date,
            'hour': hour,
            'minutes': minutes
        };
        return timeobj; 
}

// regroups the json data by days
function parseCalendarData(dat) {
    var events = dat.events;
    for (var i=0; i<events.length; i++) {
        var start = events[i].start.dateTime; // format: "2012-02-11T03:30:00-06:00"
        var end = events[i].end.dateTime; // format: "2012-02-11T03:30:00-06:00"
       
        timeobj = parseDateTime(start);
        var name = timeobj['day'];
        eventsByDay[name].push(events[i]); 
    }
}

var locals = {
    user: currUser,
    url: gapi.url,
    title: 'Today',
    eventlist: {'events':[]}
};

exports.index = function(req, res){
  console.log(locals);
    console.log('-------------xxx');
//  res.render('homepage', { title: 'Today' });
//    console.log('--------------locals-----------');
	db.events.find(function(err, docs) {
  if (!err) {
    // console.log('mongojs working in index.js!');
    // console.log(docs);
    // sorting, for later
    // docs.sort(function(first, second) {
	  	// var date1 = first.start.dateTime;
	  	// var date2 = second.start.dateTime;
	  	// if (date1 > date2) {
				// return 1;
	  	// }
	  	// else if (date2 > date1) {
				// return -1;
	  	// }
	  	// else {
	  	// 	return 0;
	  	// }
    // });
    locals.eventlist.events = docs;
  }
	});
  res.render('homepage', locals);
};

exports.dayInfo = function(req, res) {
    console.log('dayInfo');
    var dayName = req.params.id;
    parseCalendarData(data);
//    console.log(eventsByDay);
    console.log(eventsByDay[dayName]);
    res.json(eventsByDay[dayName]);
}
