var data = require("../tester.json");
var db = require('../db.js');
var mongojs = require('mongojs');
var gapi = require('./gapi');


// The object of today, Currently fixed for testing.
var today = {
  date: 12,
  month: 1,
  year: 2014
};


var locals = {
    script: '/javascripts/event_view.js',
    goback: {
        link: '',
        display: '',
    },
    nav: 'nav',
    authurl: gapi.url
    // eventlist: data
};

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

// exports.index = function(req, res){
//     console.log('-------------xxx');
// //  res.render('homepage', { title: 'Today' });
// //    console.log('--------------locals-----------');
//   locals.todaysEvents.events = [];

// };

var moods = [
  "angry",
  "sad",
  "soso",
  "happy",
  "excited",
  "undefined"
]
exports.view = function(req, res) {
  var eveId = req.params.id;
  console.log('calendar_event_id: '+eveId);
  locals.user = req.cookies.username;
  db.events.findOne({_id:mongojs.ObjectId(eveId)},function(err,doc){
    if (!err) {
      console.log('mongojs working in calendar_event.js!');
      eveIns = doc;
      console.log('doc')
      console.log(doc);
      var start = new Date(eveIns.start);
      var end = new Date(eveIns.end);
      eveIns.date = start.getDate();
      eveIns.month = start.getMonth() + 1;
      locals.goback.link = '/'+ eveIns.month.toString() + "-" + eveIns.date.toString();
      locals.dayId = eveIns.month.toString() + "-" + eveIns.date.toString();
      if (eveIns.date != new Date().getDate()){
        locals.goback.display = 'Back';
      } else {
        locals.goback.display = 'Today';
      }
      // eveIns.startHour = start.getHours();
      // eveIns.startMin = start.getMinutes();
      // eveIns.endHour = end.getHours();
      // eveIns.endMin = end.getMinutes();
      eveIns.startTime = formatAMPM(start);
      eveIns.endTime = formatAMPM(end);
      console.log(start);
      console.log(end);

      if (end.getDate() > start.getDate()) {
        eveIns.startTime += " on " + monthToName[start.getMonth()].substr(0,3) +', '+start.getDate();
        eveIns.endTime += " on " + monthToName[end.getMonth()].substr(0,3) +', '+end.getDate();
      }

      if (eveIns.mood == null) {
        eveIns.mood = 5
      } else {
        eveIns.mood += 2
      }
      eveIns.mood = moods[eveIns.mood];
      locals.eveIns = eveIns;
      console.log(eveIns);
      res.render('calendar_event', locals);
    }
  });
  // var eveList = data.events;
  // var eveIns = null;
  // for(var i = eveList.length;i--;) {
  //       console.log('1');
  //       if(eveList[i].id == eveId) {
  //           eveIns = eveList[i];
  //           console.log(eveIns);
  //           break;
  //       }
  //   }

 //  var std = new Date(Date.parse(eveIns.start.dateTime));
 //  var end = new Date(Date.parse(eveIns.end.dateTime));
 //  eveIns.startHour = std.getHours();
 //  eveIns.startMin = std.getMinutes();
 //  eveIns.endHour = end.getHours();
 //  eveIns.endMin = end.getMinutes();
 //  locals.eveIns = eveIns;
	// res.render('calendar_event', locals);
}

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

