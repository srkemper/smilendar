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
function parseEpoch(epoch) {
        var d = new Date(epoch);
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
	eventsByDay = {
    'sun': {'eventList':[]},
    'mon': {'eventList':[]},
    'tue': {'eventList':[]},
    'wed': {'eventList':[]},
    'thu': {'eventList':[]},
    'fri': {'eventList':[]},
    'sat': {'eventList':[]}
	};
    var events = dat.events;
    for (var i=0; i<events.length; i++) {
        var start = events[i].start; // format: epoch time
        var end = events[i].end; // format: epoch time

        timeobj = parseEpoch(start);
        var name = timeobj['day'];
        eventsByDay[name]['eventList'].push(events[i]);
    }
}

var locals = {
    user: currUser,
    url: gapi.url,
    title: 'Today',
    script: '/javascripts/day_view.js',
    goback: {
        link: '/month/2',
        display: 'February',
    },
    // eventlist: data
   eventlist: {'events':[]},
   todaysEvents: {'events': []}
};
//gets a ordered list (by start time) of the events for this day
exports.index = function(req, res){
    // parse id for date from URL
    var dayId = req.params.id;
    locals.dayId = dayId;

    console.log('-------------xxx');
	locals.todaysEvents.events = [];
	db.events.find(function(err, docs) {
      if (!err) {
        console.log('mongojs working in index.js!');
        // console.log(docs);
        docs.forEach(function(doc) {
        	var today = new Date();
        	var todaysDate = 12; //today.getDate();
        	var docDate = new Date(doc.start);
        	var eventDate = docDate.getDate();
        	if (todaysDate == eventDate) {
        		locals.todaysEvents.events.push(doc);
                console.log(doc);
            }
        });
        console.log(locals.todaysEvents);
		// console.log(docs);
        locals.eventlist.events = docs;
    	res.render('homepage', locals);
      }
    });
  console.log(locals);
};

exports.dayInfo = function(req, res) {
    console.log('dayInfo');
    var dayName = req.params.id;
    // parseCalendarData(data);
   parseCalendarData(locals.eventlist);
//    console.log(eventsByDay);
    console.log(eventsByDay[dayName]);
    console.log('mongo--22');
    // db.events.find(function(err, docs) {
    // 	console.log(docs);
    // });
    res.json(eventsByDay[dayName]);
}
