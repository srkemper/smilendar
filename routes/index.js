var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');

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
    eventlist: data
};
//console.log(gapi);
exports.index = function(req, res){
  console.log(data);
    console.log('-------------xxx');
    parseCalendarData(data);
//  res.render('homepage', { title: 'Today' });
//    console.log('--------------locals-----------');
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
