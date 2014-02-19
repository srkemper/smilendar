var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var db = require('../db.js');

// given a day in a week, return the entire week in array
Date.prototype.getWeek = function(){
 return [new Date(this.setDate(this.getDate()-this.getDay()))]
          .concat(
            String(Array(6)).split(',')
               .map ( function(){
                       return new Date(this.setDate(this.getDate()+1));
                     }, this )
          );
}
// usage 
console.log(new Date().getWeek());

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
        var start = events[i].start.dateTime; // format: "2012-02-11T03:30:00-06:00"
        var end = events[i].end.dateTime; // format: "2012-02-11T03:30:00-06:00"

        timeobj = parseDateTime(start);
        var name = timeobj['day'];
        eventsByDay[name]['eventList'].push(events[i]);
    }
}

function populateTodayEvents() {
    
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
        	var docDate = new Date(Date.parse(doc.start.dateTime));
        	var eventDate = docDate.getDate();
        	if (todaysDate == eventDate) {
        		locals.todaysEvents.events.push(doc);
        	}
        });
		console.log(docs);
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
