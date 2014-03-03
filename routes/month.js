var gapi = require('./gapi');
var db = require('../db.js');
var calendar = require('calendar').Calendar;
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

var locals = {
  user: 'random',
  title: 'Today',
  script: '/javascripts/month_view.js',
  footer: 'month',
  nav: 'nav'
};

var monthNameFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var moodId = ['angry','sad','soso','happy','excited', 'undecided'];

function daysInMonth(month,year)
{
   return new Date(year, month+1, 0).getDate();
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function getAvgMoodInMonth(events) {
  console.log('---getAvgMoodInMonth---')
  var moodForDay = [];
  if (events.length == 0) {
    return [];
  }
  var tempDay = new Date(events[0].start);
  // console.log(events[0])
  // console.log(new Date(events[0].start))
  var month = tempDay.getMonth();
  var year = tempDay.getFullYear();
  var dayCount = daysInMonth(month, year);

  // initialize moodForDay
  for (var i=0; i<dayCount; i++) {
    moodForDay[i] = {
      'day': i+1,
      'timeToAdd': 0,
      'todaysScaledMood': 0.0,
      'MoodExist': false,  // counter for whether an event exists
      'avgMood': 0,
      'totalEvents': 0
    }
  }

  // populate moodForDay
  for (i=0; i<events.length; i++) {
    var eve = events[i];
    var tempEvent = new Date(eve.start);
    // console.log(eve.start_day);
    var start_day = tempEvent.getDate()-1;
    var timeToAdd = eve.end - eve.start;
    var eventMood = eve.mood;
    var moodExist = true;
    if (eventMood == null && !moodForDay[start_day].MoodExist) {
        eventMood = 0;
        moodExist = false;
        timeToAdd = 0;
    }

    // moodForDay[start_day].day = start_day;
    moodForDay[start_day].MoodExist = moodExist;
    moodForDay[start_day].timeToAdd += timeToAdd; // need to define first!!
    moodForDay[start_day].todaysScaledMood += eventMood*timeToAdd;
    moodForDay[start_day].totalEvents += 1;

    // console.log(tempEvent)
    // console.log(moodForDay[start_day])
  }

  for (i=0; i<dayCount; i++) {
    if (moodForDay[i].MoodExist) {
      moodForDay[i].avgMood = Math.ceil(moodForDay[i].todaysScaledMood/moodForDay[i].timeToAdd) + 2;
    } else {
      moodForDay[i].avgMood = 5;
    }
    // console.log('i='+i);
    // console.log(moodForDay[i].avgMood)
  }
  return moodForDay;

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
  console.log(req.params);
  console.log(req.session);
  console.log(req.cookies.username);
  var monthId = req.params.id;
  dayCount = daysInMonth(monthId-1,2014);  // currently hardcoded for 2014 only
  console.log('How many days in this month? : '+dayCount);

  var user = req.session.username || req.cookies.username;
  console.log('user!');
  console.log(user);
  console.log(typeof(user));
  if (typeof(user) == 'undefined') {
    console.log('undefined!');
    res.redirect('/');
  } else {

  Event.moodByMonth(parseInt(monthId) - 1, 2014, user, function(err, events) {
    if (err) {console.log('error getting moods');}


    var monthMood = {
      days:[]
    };
    console.log('---debuggg----')
    console.log('user is ' + user)
    // console.log(events);

    var moodForDay = getAvgMoodInMonth(events);
    // console.log(moodForDay)
    // console.log(moodForDay[i]);
    for (var i=0; i<dayCount; i++) {
      var j=i+1;
      var avgmood;
      var totalevents;
      if (moodForDay.length == 0) {
        avgmood = 5;
        totalevents = 0;
      } else {
        avgmood = moodForDay[i].avgMood;
        totalevents = moodForDay[i].totalEvents;
      }

      monthMood.days.push(
          { date:j,
            url:monthId + '-' + j,
            aveMood:moodId[avgmood],
            totalEvents:totalevents
          }
        );
    }

    cal = new calendar(0);               // weeks starting on Monday
    // m = cal.monthDays(2014, parseInt(monthId)-1);
    console.log('---mood by month---')
    // console.log(monthMood);
    m = cal.monthJSON(2014, parseInt(monthId)-1, monthMood);  // month is from 0 - 11

    var weeks = [],
        weekDay =[], // Temporary Array
        week = {
          weekDays:[]
        },
        i = 0;

    for (i = 0; i < m.length; i+=7) {
      weekDay = m.slice(i,i+7);
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

  }
};

