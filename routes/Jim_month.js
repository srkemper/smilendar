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
  authurl: gapi.url
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
    var eventsToAdd = 1;
    if (eventMood == null && !moodForDay[start_day].MoodExist) {
        eventMood = 0;
        moodExist = false;
        eventsToAdd = 0;
        timeToAdd = 0;
    }

    // moodForDay[start_day].day = start_day;
    moodForDay[start_day].MoodExist = moodExist;
    moodForDay[start_day].timeToAdd += timeToAdd; // need to define first!!
    moodForDay[start_day].todaysScaledMood += eventMood*timeToAdd;
    moodForDay[start_day].totalEvents += eventsToAdd;

    console.log(tempEvent)
    console.log(moodForDay[start_day])
  }

  for (i=0; i<dayCount; i++) {
    if (moodForDay[i].MoodExist) {
      moodForDay[i].avgMood = Math.ceil(moodForDay[i].todaysScaledMood/moodForDay[i].timeToAdd) + 2;
    } else {
      moodForDay[i].avgMood = 5;
    }
    console.log('i='+i);
    console.log(moodForDay[i].avgMood)
  }
  return moodForDay;

}

exports.view = function(req, res) {
  var monthId = req.params.id;
  locals.dayId = monthId + "-" + new Date().getDate();
  console.log(monthId);
  dayCount = daysInMonth(monthId-1,2014);  // currently hardcoded for 2014 only
  console.log('How many days in this month? : '+dayCount);




  // Generating sudo data about daily summary here
  Event.moodByMonth(parseInt(monthId) - 1, 2014, req.session.username, function(err, events) {
    // console.log(parseInt(monthId) - 1, 114, req.session.username)
    if (err) {console.log('error getting moods');}
    

    var monthMood = {
      days:[]
    };
    var moodForDay = getAvgMoodInMonth(events);
    for (var i=0; i<dayCount; i++) {
      var j=i+1;
      monthMood.days.push(
          { date:j,
            url:monthId + '-' + j,
            aveMood:moodId[moodForDay[i].avgMood],
            totalEvents:moodForDay[i].totalEvents
          }
        );
    }
    
    cal = new calendar(0);               // weeks starting on Monday
    // m = cal.monthDays(2014, parseInt(monthId)-1);
    console.log('---mood by month---')
    console.log(monthMood);
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
    locals.weeks = weeks;
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
    locals.nav = nav;
    console.log('locals----------')
    console.log(locals.weeks)
  	res.render('month', locals);
  })


};

