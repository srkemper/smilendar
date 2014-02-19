var gapi = require('./gapi');
var db = require('../db.js');
var calendar = require('calendar').Calendar;

var locals = {
  user: 'random',
  title: 'Today',
  script: '/javascripts/month_view.js'
};


function daysInMonth(month,year)
{
   return new Date(year, month, 0).getDate();
}


exports.view = function(req, res) {
  var monthId = req.params.id;
  console.log(monthId);
  dayCount = daysInMonth(monthId,2014);  // currently hardcoded for 2014 only
  console.log('How many days in this month? : '+dayCount);

  // Generating sudo data about daily summary here
  var monthMood = {
    days:[]
  };
  for (i = 0; i<dayCount; i++) {
    var j = i+1;
    monthMood.days.push({date:j,url:monthId + '-' + j});
  }

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

  locals.weeks = weeks;
	res.render('month', locals);


};

