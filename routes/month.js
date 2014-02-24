var gapi = require('./gapi');
var db = require('../db.js');
var calendar = require('calendar').Calendar;
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

var locals = {
  user: 'random',
  title: 'Today',
  script: '/javascripts/month_view.js',
  footer: 'month'
};

var monthNameFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var moodId = ['angry','sad','soso','happy','excited', 'undecided'];

function daysInMonth(month,year)
{
   return new Date(year, month, 0).getDate();
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.view = function(req, res) {
  var monthId = req.params.id;
  locals.dayId = monthId + "-" + new Date().getDate();
  console.log(monthId);

  res.render('month', locals);
}


exports.monthInfo = function(req, res) {
  // Generating sudo data about daily summary here
  console.log("monthview AJAX received!");
  var monthId = req.params.id;
  dayCount = daysInMonth(monthId,2014);  // currently hardcoded for 2014 only
  console.log('How many days in this month? : '+dayCount);
  Event.moodByMonth(parseInt(monthId) - 1, 114, req.session.username, function(err, moods) {
    // console.log(parseInt(monthId) - 1, 114, req.session.username)
    if (err) {console.log('error getting moods');}
    console.log(moods);
    var monthMood = {
      days:[]
    };
    for (i = 0; i<dayCount; i++) {
      var j = i+1;
      var mood = null, events = null, average = null;
      if (moods[i + 1] != null) {
        mood = moods[i + 1].totalMood;
        events = moods[i + 1].totalEvents;
        average = null;
      }
      if (events != null && events > 0) {
        average = mood / events;
        average = Math.ceil(average) + 2;
      } else {
        average = 5;
        events = 0;
      }
      console.log('average = ' + average + " : " + moodId[average]);
      monthMood.days.push(
        { date:j,
          url:monthId + '-' + j,
          aveMood:moodId[average],
          totalEvents:events
        }
      );
    }

    console.log(monthMood)
    cal = new calendar(0);               // weeks starting on Monday
    // m = cal.monthDays(2014, parseInt(monthId)-1);
    m = cal.monthJSON(2014, parseInt(monthId)-1, monthMood);  // month is from 0 - 11

    // Assign data into JSON objects
    // { weeks: [
    //     { weekDays: [
    //         { date : 1,
    //           attr : somevalue
    //         },...
    //       ]
    //     },...
    //   ]
    // }

    var weeks = [],
        weekDay =[], // Temporary Array
        week = {
          weekDays:[]
        },
        i = 0;

    for (i = 0; i < m.length; i+=7) {
      weekDay = m.slice(i,i+7);
      // console.log(weekDay);
      // console.log('---------');
      week.weekDays = weekDay;
      weeks.push(week);
      week = {
          weekDays:[]
        };
    }


    // locals.weeks = weeks;
    // Clear the local months
    var nav = {};
    nav.url = monthId;
    nav.month = monthNameFull[parseInt(monthId) - 1];
    if (parseInt(monthId) - 1 >= 0) {
      nav.pUrl = parseInt(monthId) - 1;
      console.log('pUrl: '+ nav.pUrl);
      nav.pMonth = monthName[nav.pUrl -1 ];
    }
    if (parseInt(monthId) + 1 < 13) {
      nav.nUrl = parseInt(monthId) + 1;
      console.log('nUrl: '+nav.nUrl);
      nav.nMonth = monthName[nav.nUrl - 1];
    }
    // locals.nav = nav;
  	res.json({
          "weeks": weeks,
          "nav" : nav
      });
  })


};

