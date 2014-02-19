var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var db = require('../db.js');
var year = 2014;    // only code for current year
var mongoose = require('../mongoose')
var Event = mongoose.model('Event');

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
// console.log(new Date().getWeek());

var dayToName = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
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

// returns a parsed list of today's events
function populateTodayEvents(todayData) {
    
}

// append '0' to the front of string if string has length 1
function appendZero(tag) {
    if (tag.length == 1) {
            tag = "0"+tag;  // of form e.g. "02-12"
    }
    return tag;
}

function getCurrentWeek(currDate) {
    // defaults to today if currDate == NULL
    currDate = typeof currDate !== 'undefined' ? currDate : new Date();
    console.log('getCurrentWeek----------------')
    console.log(currDate)
    console.log('getCurrentWeek----------------')
    var weekList = currDate.getWeek();  // get an array of current week
    var tags = new Array();
    var dates = new Array();
    var tagDate = new Array();

    for (var i=0; i<weekList.length; i++) {
        var month = weekList[i].getMonth()+1;   
        month = month.toString();
        var date = weekList[i].getDate();
        date = date.toString();

        month = appendZero(month);
        date = appendZero(date);

        tag = month+'-'+date;
        tags[i] = tag;
        dates[i] = date;
        tagDate[i] = [tags[i], date] //, dayToName[i]]
    }
    // res.json(["tags":tag, "dates":dates])
    return [tags, dates, tagDate]
}


// given a dayId object, returns the Javascript date object
function getDateFromDayID(dayId) {
    var monthId = parseInt(dayId.substring(0,2))-1; // just extract month part, e.g. 02
    var dateId = parseInt(dayId.substring(3,5));
    // console.log('getDateFromDayID')
    // console.log(monthId)
    // console.log(dateId)

    return new Date(year, monthId, dateId)
}

//gets a ordered list (by start time) of the events for this day
exports.index = function(req, res){
    // parse id for date from URL
    var dayId = req.params.id;
    locals.dayId = dayId;
    locals.user = req.session.username;

    var today = getDateFromDayID(dayId);
    var currWeekInfo = getCurrentWeek(today);
    locals.tag = currWeekInfo[0];
    locals.dates = currWeekInfo[1];
    locals.tagDate = currWeekInfo[2];

    // locals.todaysEvents.events = [];
	// db.events.find(function(err, docs) {
 //      if (!err) {
 //        console.log('mongojs working in index.js!');
 //        // console.log(docs);
 //        docs.forEach(function(doc) {
 //        	var todaysDate = today.getDate();
 //        	var docDate = new Date(doc.start);
 //        	var eventDate = docDate.getDate();
 //        	if (todaysDate == eventDate) {
 //        		locals.todaysEvents.events.push(doc);
 //                // console.log(doc);
 //            }
 //        });
 //        // console.log(locals.todaysEvents);
	// 	// console.log(docs);
 //        locals.eventlist.events = docs;
 //    	
 //      }
 //    });


  console.log(locals);
    res.render('homepage', locals);
};

exports.dayInfo = function(req, res) {
    console.log('dayInfo');
    var dateId = req.params.id;
    var date = getDateFromDayID(dateId)
    console.log(dateId)
    console.log(date)

    Event.findByDate(date, function(err, events) {
        // console.log(typeof(events))
        // console.log(events.length)
        // locals.todayEvents.events = events;
      console.log("--------Event.findByDate--------------")
      // console.log(locals.todayEvents.events);
      console.log(events)

      res.json({"eventList": events});

    });

    // parseCalendarData(data);
   // parseCalendarData(locals.eventlist);
//    console.log(eventsByDay);
    // console.log(eventsByDay[dayName]);
    // console.log('mongo--22');
    // db.events.find(function(err, docs) {
    // 	console.log(docs);
    // });
    // res.json(eventsByDay[dayName]);
}
