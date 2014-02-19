var databaseURI = "mongodb://smilendar147:smilendar147@ds027819.mongolab.com:27819/heroku_app21990328";
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
  note: String
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
eventSchema.statics.findByDate = function(date, callback) {
  var eventList = [];
  var date = new Date();
  this.find({}, function(err, events) {
    events.forEach(function(eve) {
      if (eve.start_day == date.getDate() && eve.start_month == date.getMonth() && eve.start_year == date.getYear()) {
        eventList.push(eve);
      }
    });
    callback(err, eventList);
  });
};

eventSchema.statics.moodByMonth = function(month, year, callback) {
  var moodForDay = {}
  this.find({}, function(err, events) {
    events.forEach(function(eve) {
      if (eve.start_month == month && eve.start_year == year) {
        var today = moodForDay[eve.start_day];
        if (today == null) {
          moodForDay[eve.start_day] = [eve.mood];
        } else {
          moodForDay[eve.start_day].push(eve.mood);
        }
      }
    });
    callback(err, moodForDay);
  });
};

mongoose.model('Event', eventSchema);
var Event = mongoose.model('Event');

// Event.moodByMonth(new Date().getMonth(), new Date().getYear(), function(err, moods) {
//   console.log(moods);
// });
// example of how the static findByDate method works in Event
// Event.findByDate(new Date(), function(err, events) {
//   console.log("--------Event.findByDate--------------")
//   console.log(events);
// });

var userSchema = new Schema({
	name: { type:String, required: true},
});
mongoose.model('User', userSchema);

module.exports = db;