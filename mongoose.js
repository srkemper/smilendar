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
  this.find({user: user, 'start':{$gte:beg}, 'end':{$lte:end}}, null, {sort:{'start':1}}, function(err, events) {
    console.log(events);
    console.log('events')
    events.forEach(function(eve) {
      // if (eve.start_day == date.getDate() && eve.start_month == date.getMonth() && eve.start_year == date.getYear()) {
        eventList.push(eve.toJSON());
      // }
    });
    callback(err, eventList);
  });
};

eventSchema.statics.moodByMonth = function(month, year, user, callback) {
  console.log('---mongoose moodByMonth ---')
  var starttime = new Date(year, month);
  var endtime = new Date(year, month+1, 0);
  starttime = starttime.getTime();  // convert to epoch
  endtime = endtime.getTime();  // convert to epoch
  this.find({user:user, 'start':{$gte:starttime}, 'end':{$lte: endtime}}, function(err, events) {


    callback(err, events);
  });
};

mongoose.model('Event', eventSchema);
var Event = mongoose.model('Event');



var userSchema = new Schema({
	name: { type:String, required: true},
});
mongoose.model('User', userSchema);

module.exports = db;