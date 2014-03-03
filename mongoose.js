var dotenv = require('dotenv');
dotenv.load();

var databaseURI = process.env.MONGO_URL;
var mongoose = require("mongoose");
mongoose.connect(databaseURI);
var db = mongoose.connection;
var Schema = mongoose.Schema;

// db.once('open', function callback () {
var eventSchema = new Schema({
  name: String,
  id: String,
  start: Number,
  end: Number,
  location: String,
  mood: Number,
  comment: String,
  note: String,
  user: String
});

var sampleJSON = require('./sample.json');

function changeDayToToday(timestr) {
    var t = new Date(timestr);
    var d = new Date();
    var today = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes())
    return today.getTime();
}

function changeSampleJSONDatetime(user) {
    // var events = sampleJSON.events;
    console.log('---changeSampleJSONDatetime---')
    for (var i=0; i<sampleJSON.events.length; i++) {
        var starttime = sampleJSON.events[i].start;
        var endtime = sampleJSON.events[i].end;
        console.log(starttime)
        starttime = changeDayToToday(starttime)
        endtime = changeDayToToday(endtime);
        console.log(new Date(starttime));
        sampleJSON.events[i].start = starttime;
        sampleJSON.events[i].end = endtime;
        sampleJSON.events[i].user = user;
    }
}

eventSchema.virtual('start_day').get(function() {
  var start = new Date(this.start);
  return start.getDate();
});

eventSchema.virtual('start_month').get(function() {
  var start = new Date(this.start);
  return start.getMonth();
});

eventSchema.virtual('start_year').get(function() {
  var start = new Date(this.start);
  return start.getYear();
});

// Get total number of events for this user
eventSchema.statics.getNumTotalEvents = function(user, callback) {
  var count = 0;
  this.count({user: user}, function( err, count){
    console.log( "Number of events:", count );
    callback(err, count);
  });
};

// static findByDate method that takes in a date and returns a list of all the events on that date
// eventually will be extended to events for a specific user on a specific date
eventSchema.statics.findByDate = function(date, user, callback) {
  var eventList = [];
  // midnight
  var beg = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // 11:59pm
  var end = new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59);

  beg = beg.getTime();
  end = end.getTime();

  var curr = this;
  var count = 0;
  
  // checks to see if account is empty
  // curr.count({user: user}, function( err, count){
  //   console.log( "Number of total events:", count );
  //   var today = new Date();
  //   // console.log(date);
  //   // console.log(today);
  //   var isSameDay = (today.getDate() == date.getDate() 
  //       && today.getMonth() == date.getMonth()
  //       && today.getFullYear() == date.getFullYear())
  //   // console.log('is same day:', isSameDay)
  //   if (count == 0 && isSameDay) {
  //     changeSampleJSONDatetime(user);
  //     // console.log(sampleJSON);

  //     callback(err, sampleJSON.events);
  //   } else {

      // actual find by date function
      curr.find({user: user, 'start':{$gte:beg}, 'end':{$lte:end}}, null, {sort:{'start':1}}, function(err, events) {
        // console.log(events);
        // console.log('events')
        events.forEach(function(eve) {
          // if (eve.start_day == date.getDate() && eve.start_month == date.getMonth() && eve.start_year == date.getYear()) {
            eventList.push(eve.toJSON());
          // }
        });
        callback(err, eventList);
      });

  //   }
  // });


};

eventSchema.statics.moodByMonth = function(month, year, user, callback) {
  console.log('---mongoose moodByMonth ---')
  var starttime = new Date(year, month);
  var endtime = new Date(year, month+1, 0);
  starttime = starttime.getTime();  // convert to epoch
  endtime = endtime.getTime();  // convert to epoch

  var curr = this;
  var count = 0;

  // // checks to see if account is empty, if so, then provide sample data
  // curr.count({user: user}, function( err, count){
  //   console.log( "Number of total events:", count );
  //   var today = new Date();
  //   var isSameMonth = (today.getMonth() == month
  //       && today.getFullYear() == year)
  //   // console.log('is same day:', isSameDay)
  //   if (count == 0 && isSameMonth) {
  //     changeSampleJSONDatetime(user);

  //     callback(err, sampleJSON.events);
  //   } else {

      curr.find({user:user, 'start':{$gte:starttime}, 'end':{$lte: endtime}}, function(err, events) {
        callback(err, events);
      });
  //   }
  // });

};

mongoose.model('Event', eventSchema);
var Event = mongoose.model('Event');



var userSchema = new Schema({
	name: { type:String, required: true},
});
mongoose.model('User', userSchema);

module.exports = db;