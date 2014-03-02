
/**
 * Module dependencies
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var calendar_event = require('./routes/calendar_event');
var month = require('./routes/month');
var addEvent = require('./routes/addEvent');
var about = require('./routes/about');
var app = express();
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
// var gapi = require('./routes/gapi');
var mongo_client = require('mongodb').MongoClient;
var mongojs = require('mongojs');

var db = require('./db');

var mongoose = require('mongoose');
var mongoosedb = require('./mongoose');
var Event = mongoose.model('Event');

var dotenv = require('dotenv');
dotenv.load();

// var secrets = require('./secrets');


var User = mongoose.model('User');

// Event.find(function(err, events) {
//   if (err) {console.log('error retrieving events')};
//   //console.log(events);
// });


var index = require('./routes/index');

var my_calendars = [],
    my_profile = {},
    my_email = '';

app.configure('development', function() {
  app.use(express.errorHandler());
});

// all environments
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.engine('handlebars', handlebars());
  app.set('view engine', 'handlebars');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.LOGIN_SECRET));
  // app.use(express.cookieSession());
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.locals.layout = 'main.handlebars';

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Previous code for log-in
//app.get('/', function(req, res) {
//  var locals = {
//        url: gapi.url
//      };
//  res.render('login.jade', locals);
//});
//app.get('/homepage', routes.index);


var eventsJSON = require("./data.json");

// code to populate original DB with fake events
// eventsJSON['events'].forEach(function(JSONevent) {
//   db.events.save(JSONevent, function(err, saved) {
//     if (err) {console.log("event not saved")};
//   });
// });

// code to clear db
// db.events.remove(function(err, removed) {
//   if (err) {
//     console.log("couldn't remove");
//   }
// })

// db.events.find(function(err, docs) {
//   if (!err) {
//     // console.log('mongojs working!');
//     // console.log(docs);
//   }
// });

app.get('/',user.loginpage);
app.get('/about', about.view);
app.get('/login', user.login_redirect);
app.get('/logout', user.logout);
app.get('/addEvent/:id', addEvent.view);
app.get('/:id',routes.index);
app.get('/alt/:id',index.alternate)
app.get('/users', user.list);
app.get('/calendar_event/:id', calendar_event.view);
app.get('/month/:id', month.view);

app.post('/changeMood', function(request, response) {
  //console.log(request.body.id);
  //console.log(request.body.mood);
  // mongoosedb.once('open', function callback () {
  //   var eventSchema = mongoose.Schema({
  //     name: String,
  //     id: String,
  //     start: Number,
  //     end: Number,
  //     location: String,
  //     mood: Number,
  //     comment: String,
  //     note: String
  //   });
  //   var Event = mongoose.model('Event', eventSchema);
  //   Event.find({"_id": mongojs.ObjectId(request.body.id)}).exec(function(err, eve) {
  //     if (err) {console.log('error finding in mongoose')};
  //     //console.log(eve);
  //   });
  // });
  console.log(request.body.id, request.body.mood)
  var moods = {
    "excited":2,
    "happy":1,
    "soso":0,
    "sad":-1,
    "angry":-2
  }
  db.events.update({_id: mongojs.ObjectId(request.body.id)}, {$set: {mood:moods[request.body.mood]}}, function(err, updated) {
    if (err) {
      console.log("not updated :(");
    }
    console.log(updated);

  })
  response.json(200);
});

app.post('/addEvent', function(request, response) {
  var params = request.body;
  console.log('---addEvent---');
  console.log('---params---');
  console.log(params);
  console.log('---console---');

  var startvec = params.startTime.split('T');
  var endvec = params.endTime.split('T');

  if (startvec.length == 2) {
    // represent time as user's local time
    var start = Date.parse(startvec[0]+' '+startvec[1]);
    var end = Date.parse(endvec[0]+' '+endvec[1]);
  } else {
    var start = Date.parse(params.startTime);
    var end = Date.parse(params.endTime);
  }

  console.log('start time');
  console.log(params.startTime);
  console.log('start date');
  console.log(new Date(start));

  console.log('end time');
  console.log(params.endTime);
  console.log('end date');
  console.log(new Date((end)));

  var name = params.name || 'New Event';  // uses default value if nothing is defined
  console.log(name)

  // check that endString is larger than startString
  if (params.startTime.length == 0 || params.endTime.length == 0 || end < start) {
    console.log('not updated')
    // request.flash("error", "Invalid form...");
    // response.redirect('/addEvent/'+params.dayId)
  
  } else {

  // var startString = params.date + " " + params.startTime;
  // var endString = params.date + " " + params.endTime;
  // var start = Date.parse(startString);
  // var end = Date.parse(endString);
  // console.log(startString, endString);
  console.log(start, end);
  // console.log(params);
  var newEvent = new Event({
    name: name,
    start: start,
    end: end,
    location: params.location,
    mood: null,
    comment: "",
    note: params.note,
    user: params.user
  });
  newEvent.save(function(err, saved) {
    if (err) {console.log('could not save new event')};
    console.log(saved);
  })
  var month = new Date(start).getMonth() + 1;
  var date = new Date(start).getDate();
  response.redirect('/' + month + "-" + date);

  }


});

app.post('/addCommentAJAX', function(req, res) {
  console.log('---addCommentAJAX---');
  console.log(req.body.id, req.body.comment);
  db.events.update({_id: mongojs.ObjectId(req.body.id)}, 
    {$set: {comment:req.body.comment}}, function(err, updated) {
    if (err) {
      console.log("not updated :(");
    }
    // console.log(updated);
    res.json(200);
    
  })


  // db.events.update({_id: mongojs.ObjectId(request.body.id)}, 
  //   {$set: {mood:moods[request.body.mood]}}, function(err, updated) {
  //   if (err) {
  //     console.log("not updated :(");
  //   }
  //   console.log(updated);

  // })
  // response.json(200);

});

app.post('/addComment', function(request, response) {
  var params = request.body;
  console.log(params);
  // Event.update({_id:params.event_id}, {comment:params.comment}, function(err, updated) {
  //   console.log(updated);
  //   response.redirect('/calendar_event/' + params.event_id);
  // })
  db.events.update({_id: mongojs.ObjectId(request.body.event_id)}, {$set: {comment:params.comment}}, function(err, updated) {
    if (err) {
      console.log("not updated :(");
    }
    console.log(updated);
    response.redirect(params.goback)
    // response.redirect('/calendar_event/' + params.event_id);
  })
})

app.post('/deleteEvent', function(request, response) {
  var params = request.body;
  console.log(params);
  Event.remove({_id:params.event_id}, function(err) {
    if (err) {console.log("error, not removed");}
    else {console.log('removed successfully');}
    response.redirect(params.goback)
  })
})

app.get('/dayEvent/:id',index.dayInfo);
app.get('/monthEvent/:id',month.monthInfo);   // AJAX to get month view information

// handling return value

// app.get('/oauth2callback', function(req, res) {
//   var code = req.query.code;
//   console.log(code);
//   gapi.client.getToken(code, function(err, tokens) {
//     gapi.client.credentials = tokens;   // getting access tokens
//     getData();
//   console.log('getting tokens-----------');
//     console.log(tokens);


//   });
//     console.log('getting name---------');
//     console.log(my_profile.name);
//   var locals = {
//         user: my_profile.name,
//         title: 'Today',
//         url: gapi.url
//       };
//     console.log(locals);
// //    res.redirect('/',locals);
//     res.render('homepage',locals);
// });


// app.get('/cal', function(req, res){
//   var locals = {
//     title: "These are your calendars",
//     user: my_profile.name,
//     bday: my_profile.birthday,
//     events: my_calendars,
//     email: my_email
//   };
//   res.render('cal.jade', locals);
// });



// var getData = function() {
//   gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
//   console.log('getting results-----------');
//       console.log(results);
//       my_email = results.email;
//       my_profile.name = results.name;
//       my_profile.birthday = results.birthday;
//   });
//   gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
//     console.log('calendar results');
//     console.log(results);
//     for (var i = results.items.length - 1; i >= 0; i--) {
//         console.log('---');
//         console.log(results.items[i].summary);
//       my_calendars.push(results.items[i].summary);
//     };
//   });
// };


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
