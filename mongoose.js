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
  // var date = new Date();
  this.find({user: user}, null, {sort:{'start':1}}, function(err, events) {
    events.forEach(function(eve) {
      if (eve.start_day == date.getDate() && eve.start_month == date.getMonth() && eve.start_year == date.getYear()) {
        eventList.push(eve.toJSON());
      }
    });
    callback(err, eventList);
  });
};

eventSchema.statics.moodByMonth = function(month, year, user, callback) {
  console.log('---mongoose moodByMonth ---')
  // var moodForDay = []
  var starttime = new Date(year, month);
  var endtime = new Date(year, month+1, 0);
  starttime = starttime.getTime();  // convert to epoch
  endtime = endtime.getTime();  // convert to epoch
  this.find({user:user, 'start':{$gte:starttime}, 'end':{$lte: endtime}}, function(err, events) {
    // events.forEach(function(eve) {
    //   console.log('eve')
    //   console.log(new Date(eve.start));
    //   // console.log(eve.start_day);
    //   var start_day = eve.start_day;
    //   var timeToAdd = eve.end - eve.start;
    //   if (todaysMood == null) {
    //       todaysMood = 0;
    //       // eventToAdd = 0;
    //       timeToAdd = 0;
    //     }
    //   moodForDay[start_day].day = start_day;
    //   moodForDay[start_day].timeToAdd += timeToAdd; // need to define first!!
    //   moodForDay[start_day].todaysScaledMood += todaysMood*timeToAdd;

      // if (eve.start_month == month && eve.start_year == year) {
        // console.log(eve);
        // var today = moodForDay[eve.start_day];  // gets today, or null if not initialized
        // var todaysMood = eve.mood;  // gets today's mood, or null
        // console.log('today ' + today + ' todaysMood ' +todaysMood)
        // var eventToAdd = 1;
        // if (todaysMood == null) {
        //   todaysMood = 0;
        //   eventToAdd = 0;
        //   timeToAdd = 0;
        //   todaysScaledMood = 0;
        // }
        // if (today == null) {

        //   moodForDay[eve.start_day] = {day:eve.start_day,
        //                                totalMood: todaysMood,
        //                                totalEvents: eventToAdd
        //                                };
        // } else {
        //   moodForDay[eve.start_day].totalMood += todaysMood;
        //   moodForDay[eve.start_day].totalEvents += eventToAdd;
        // }
      // }

    // });
    // callback(err, moodForDay);
    callback(err, events);
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