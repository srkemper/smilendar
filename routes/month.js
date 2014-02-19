var gapi = require('./gapi');
var db = require('../db.js');
var calendar = require('calendar').Calendar;

var locals = {
  user: 'random',
  title: 'Today'
};

var monthMood = [
  1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0
];

exports.view = function(req, res) {
  var monthId = req.params.id;
  console.log(monthId);
  cal = new calendar(0);               // weeks starting on Monday
  m = cal.monthDays(2014, parseInt(monthId)-1);
  console.log(m.length);
  for (i=0; i<m.length; i++) console.log(m[i]);
  m_entire = [];
  for (i=0; i<m.length; i++){
    m_entire = m_entire.concat(m[i]);
  }
  console.log(m_entire);
  locals.month = m;
	res.render('month', locals);
  // tested with calendar_event



};