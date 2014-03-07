var data = require("../tester.json");
/*
 * GET home page.
 */
var currUser;
var gapi = require('./gapi');
var db = require('../db.js');
var year = 2014;    // only code for current year
var mongoose = require('../mongoose');
var Event = mongoose.model('Event');



// given a day in a week, return the entire week in array
function getWeek(fromDate){
 var sunday = new Date(fromDate.setDate(fromDate.getDate()-fromDate.getDay()))
    ,result = [new Date(sunday)];
 while (sunday.setDate(sunday.getDate()+1) && sunday.getDay()!==0) {
  result.push(new Date(sunday));
 }
 return result;
}

var dayToName = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

var monthToName = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'Auguest',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};

var moodToString = {
    4: "excited",
    3: "happy",
    2: "soso",
    1: "sad",
    0: "angry",
    null: "null"
};

var locals = {
    user: currUser,
    url: '',
    // title: 'Today',
    script: '/javascripts/day_view.js',
    goback: {
        link: '',
        display: '',
    },
    nav: 'nav',
    fullDateInString: '',
    lastWeekURL: '',
    nextWeekURL: '',
    alternate: false,
    authurl: gapi.url
};

// append '0' to the front of string if string has length 1
function appendZero(tag) {
    if (tag.length == 1) {
            tag = "0"+tag;  // of form e.g. "02-12"
    }
    return tag;
}

function getTagAndDate(currDate) {
    var month = currDate.getMonth()+1;
    month = month.toString();
    var date = currDate.getDate();
    date = date.toString();

    // month = appendZero(month);
    // date = appendZero(date);

    var tag = month+'-'+date;

    return [tag, date]
}

function getCurrentWeek(currDate) {
    // defaults to today if currDate == NULL
    currDate = typeof currDate !== 'undefined' ? currDate : new Date();
    // console.log('getCurrentWeek----------------')
    // console.log(currDate)
    var lastSunday = new Date(currDate.getFullYear(),currDate.getMonth(),currDate.getDate()-currDate.getDay());
    var weekList = getWeek(lastSunday);  // get an array of current week
    var tags = new Array();
    var dates = new Array();
    var tagDate = new Array();

    for (var i=0; i<weekList.length; i++) {
        // var month = weekList[i].getMonth()+1;
        // month = month.toString();
        // var date = weekList[i].getDate();
        // date = date.toString();

        // tag = month+'-'+date;
        temp = getTagAndDate(weekList[i]);
        tags[i] = temp[0];
        dates[i] = temp[1];
        tagDate[i] = temp
    }
    return [tags, dates, tagDate]
}


// given a dayId object, returns the Javascript date object
function getDateFromDayID(dayId) {
    var monthId = parseInt(dayId.split('-')[0])-1;
    // var monthId = parseInt(dayId.substring(0,2))-1; // just extract month part, e.g. 02
    // var dateId = parseInt(dayId.substring(3,5));
    var dateId = parseInt(dayId.split('-')[1]);
    // console.log('---getDateFromDayID---')
    // console.log(monthId)
    // console.log(dateId)

    locals.goback.link = "/month/" + (monthId+1).toString();
    locals.goback.display = monthToName[monthId];

    return new Date(year, monthId, dateId)
}

// given date object, return date in string in format like
// "Thursday, February 20, 2014"
function returnDayInString(date) {
    // console.log('---returnDayInString---')
    var currYear = date.getFullYear();
    var monthId = date.getMonth();
    var day = date.getDate();
    var dayOfWeek = dayToName[date.getDay()];
    var fullDate = dayOfWeek + ' ' + monthToName[monthId] + ' ' + day.toString() + ', '+ currYear.toString();
    // console.log(fullDate)
    return fullDate
}

function renderingIndex(req, res) {
    console.log('---renderingIndex---')
    console.log(req.session)
    // console.log(req.cookies)
    // parse id for date from URL
    var dayId = req.params.id;
    locals.dayId = dayId;
    locals.user = req.session.username || req.cookies.username;
    console.log(req.session.addEventPostSucess)

    locals.addEventPostSucess = false;
    if (req.session.addEventPostSucess) {
        locals.addEventPostSucess = true;
        req.session.addEventPostSucess = false;
    }

    console.log(locals.user)

    var today = getDateFromDayID(dayId);
    var currWeekInfo = getCurrentWeek(today);
    locals.tag = currWeekInfo[0];
    locals.dates = currWeekInfo[1];
    locals.tagDate = currWeekInfo[2];

    locals.fullDateInString = returnDayInString(today);
    tagsForPrevAndNextWeek = returnURLforPrevAndNextWeek(today);
    locals.lastWeekURL = tagsForPrevAndNextWeek[0];
    locals.nextWeekURL = tagsForPrevAndNextWeek[1];

    // storing alternative options
    req.cookies.alternate = locals.alternate;
    req.session.alternate = locals.alternate;
    res.render('homepage', locals);
}

//gets a ordered list (by start time) of the events for this day
exports.index = function(req, res){
    console.log('---routes.index---')
    locals.alternate = false;   // for A-B testing
    renderingIndex(req,res);
};

// renders alternative design, for A-B testing
exports.alternate = function(req, res) {
    locals.alternate = true;   // for A-B testing
    renderingIndex(req,res);
}

// exports.addEventPostSucess = function(req, res) {

// }

// source: http://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function returnURLforPrevAndNextWeek(date) {
    console.log('returnURLforPrevAndNextWeek');
    var oneWeekInEpoch = 60*60*24*7*1000;
    var fiveHours = 60*60*5*1000;
    // var tempDate = new Date();
    // tempDate.setDate(date.getDate()-7);
    var lastWeek = new Date(date.getTime() - oneWeekInEpoch + fiveHours);
    // var tempDate = new Date();
    // tempDate.setDate(date.getDate()+7);
    // var nextWeek = new Date(tempDate)
    var nextWeek = new Date(date.getTime() + oneWeekInEpoch + fiveHours);

    console.log(date);
    console.log(lastWeek);
    console.log(nextWeek);

    lastWeekTag = getTagAndDate(lastWeek);
    nextWeekTag = getTagAndDate(nextWeek);

    return ["/"+lastWeekTag[0], "/"+nextWeekTag[0]]

}

exports.dayInfo = function(req, res) {

    console.log('---dayInfo---');
    var dateId = req.params.id;
    console.log(dateId);
    var date = getDateFromDayID(dateId)
    // console.log('dateId is '+ dateId)
    // console.log(dateId)
    // console.log(date)
    // var eventForDate = [];
    locals.fullDateInString = returnDayInString(date);

    tagsForPrevAndNextWeek = returnURLforPrevAndNextWeek(date);
    locals.lastWeekURL = tagsForPrevAndNextWeek[0];
    locals.nextWeekURL = tagsForPrevAndNextWeek[1];

    var user = req.session.username || req.cookies.username;

    

    if (typeof(user) == 'undefined') {
        console.log('hello')
        res.redirect('/');
    } else {
        // Event.getNumTotalEvents(user, function(err, count) {
        //     console.log( "Number of events in routes:", count );
        //     if (count == 0 && isSameDay) {
        //         changeSampleJSONDatetime(user);
        //         // console.log(sampleJSON);
        //         res.json({
        //             "eventList": sampleJSON.events, 
        //             "fullDateInString": locals.fullDateInString,
        //             "lastWeekURL": locals.lastWeekURL,
        //             "nextWeekURL": locals.nextWeekURL
        //         });

        //     } else {

        Event.findByDate(date, user, function(err, events) {
          // console.log("--------Event.findByDate--------------")

          // adding "starttime" and "endtime" in strings
          for (var i=0; i<events.length; i++) {
                var m = events[i].mood;
                if (m==-2 || m==-1 || m==0 || m==1 || m==2) {
                    events[i].moodString = moodToString[events[i].mood+2];
                } else {
                    events[i].moodString = "null"
                }
                events[i].starttime = formatAMPM(new Date(events[i].start))
                events[i].endtime = formatAMPM(new Date(events[i].end))
                // console.log(events[i])
          }
          // console.log(events)
          res.json({
                "eventList": events,
                "fullDateInString": locals.fullDateInString,
                "lastWeekURL": locals.lastWeekURL,
                "nextWeekURL": locals.nextWeekURL,
                "dayId": dateId
            });

        });


        //     }

        // });

    }
}

