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
  mongoose.model('Event', eventSchema);

  var userSchema = new Schema({
  	name: { type:String, required: true},
  });
  // var practice = new Event({
  //   name: "Practice",
  //   id: "5",
  //   start: new Date().valueOf(),
  //   end: new Date().valueOf() + 60000,
  //   location: 'Maples Pavillion',
  //   mood: '1',
  //   comment: 'i am tired',
  //   note: 'early practice today for presidents day'
  // });
  // console.log(practice.start);
  // practice.save(function(err, saved) {
  //   if (err) {console.log('error saving')};
  //   console.log(saved);
  // });
  // Event.find(function(err, events) {
  //   if (err) {console.log('error retrieving events')};
  //   console.log(events);
  // });
// });

module.exports = db;