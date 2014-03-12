
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
var gapi = require('./routes/gapi');
var mongo_client = require('mongodb').MongoClient;
var mongojs = require('mongojs');

var db = require('./db');
var validator = require('validator');
var node_validator = require('node-validator');

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

app.get('/',user.splash);
app.get('/about', about.view);
app.get('/login', user.login_redirect);
app.get('/logout', user.logout);
app.get('/addEvent/:id', addEvent.view);
app.get('/oauth2callback', oauth2callback)
app.get('/:id',routes.index);
// app.get('/addEventPostSucess/:id', index.addEventPostSucess);
app.get('/alt/:id',index.alternate)
app.get('/users', user.list);
app.get('/calendar_event/:id', calendar_event.view);
app.get('/month/:id', month.view);

app.post('/newMoodAndComment', function(req, res) {
  console.log('---newMoodAndComment---')
  var moods = {
    "excited":2,
    "happy":1,
    "soso":0,
    "sad":-1,
    "angry":-2
  }
  var params = req.body;
  var moodId = moods[params.mood]; // subtract 2 to get "angry"=-2
  var comment = params.comment;
  var name = params.mood;
  name = name.charAt(0).toUpperCase() + name.slice(1); // upper case first letter

  var diff = 5; // 5 min difference between start and end
  var start = new Date().getTime();
  var end = start+diff*60000;

  var newEvent = new Event({
    name: name,
    start: start,
    end: end,
    location: 'Stanford d.school',  // epic magic ***change later***
    mood: moodId,
    comment: comment,
    note: '',
    user: params.user,
    isMood: 1 // a mood was added
  });
  console.log(newEvent);
  newEvent.save(function(err, saved) {
    if (err) {console.log('could not save new mood')};
    console.log(saved);
  })
  res.json(200);
  
});

app.post('/changeMood', function(request, response) {
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

  var startTime = (params.startTime || "").replace(/[TZ]/g," ");
  var endTime = (params.endTime || "").replace(/[TZ]/g," ");
  console.log('---params---');
  // console.log(params);
  // console.log(params.name)
  console.log(startTime);
  console.log(endTime)
  // validate for time
  var checkTime = validator.isDate(startTime) && validator.isDate(endTime);
  console.log(checkTime);
  checkTime = validator.isAfter(endTime, [startTime])
  console.log(checkTime)

  // validate for string
  var checkString = node_validator.isString(params.name);

  startTime = new Date(startTime);
  endTime = new Date(endTime);

  // var sameDay = (startTime.getFullYear() == endTime.getFullYear() && startTime.getMonth() == endTime.getMonth() && startTime.getDate() == endTime.getDate());
  // sameDay = true;

  var start = startTime.getTime();
  var end = endTime.getTime();
  // var start = Date.parse(startTime);
  // var end = Date.parse(endTime);

  var name = params.name || 'New Event';  // uses default value if nothing is defined
  console.log(name)

  // check that endString is larger than startString
  if (!checkTime || !checkString) {
  // if (params.startTime.length == 0 || params.endTime.length == 0 || end < start) {
    console.log('not updated')
    var flashCheckTime = '';
    var flashSameDay = '';

    if (!checkTime) {flashCheckTime = "End time must be later than begin time.";}
    // if (!sameDay) {flashSameDay = "Sorry, we currently only support events happening on the same day."; }

    request.session.addEventPostSucess = false;
    response.render('addEvent',{
      'user': params.user,
      'script': params.script,
      'curr_title': params.name,
      'default_start_time': params.startTime,
      'default_end_time': params.endTime,
      'curr_notes': params.note,
      'curr_location': params.location,
      'dayId': params.dayId,
      'goback': {
        'link': params.gobacklink,
        'display':"Back"
      },
      'nav':'nav',
      'flashCheckTime': flashCheckTime
      // 'flashSameDay': flashSameDay
    });


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
    user: params.user,
    isMood: 0 // not a mood event
  });
  newEvent.save(function(err, saved) {
    if (err) {console.log('could not save new event')};
    console.log(saved);
  })
  var month = new Date(start).getMonth() + 1;
  var date = new Date(start).getDate();
  request.session.addEventPostSucess = true;
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
  })
})

app.post('/deleteEvent', function(request, response) {
  var params = request.body;
  console.log(params);
  Event.remove({_id:params.event_id}, function(err) {
    if (err) {console.log("error, not removed");}
    else {console.log('removed successfully');}
    request.session.deleted = true;
    response.redirect(params.goback)
  })
})

app.get('/dayEvent/:id',index.dayInfo);
app.get('/monthEvent/:id',month.monthInfo);   // AJAX to get month view information

// handling return value

function oauth2callback(req, res) {
  var code = req.query.code;
  console.log('called back')
  console.log(code);
  gapi.client.getToken(code, function(err, tokens) {
    gapi.client.credentials = tokens;   // getting access tokens

    gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
      console.log('getting results-----------');
      console.log(results);
      my_email = results.email;
      my_profile.name = results.name;
      my_profile.birthday = results.birthday;
      my_events = []
      gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
        console.log('calendar results');
        console.log(results);
        for (var i = results.items.length - 1; i >= 0; i--) {
          console.log('---');
          console.log(results.items[i].summary, results.items[i].id);
          my_calendars.push(results.items[i].summary);
          var start = new Date(new Date().getFullYear(), 1, 1, 0, 0, 0);
          var end = new Date(new Date().getFullYear(), 11, 30, 23, 59, 59);
          gapi.cal.events.list({'calendarId': results.items[i].id, 'singleEvents':true, 'orderBy':'startTime', 'timeMin': start.toISOString(), 'timeMax':end.toISOString()}).withAuthClient(gapi.client).execute(function(err, results){
            if (results && results.items) {
              var Event = mongoose.model('Event');
              results.items.forEach(function(eve) {
                //PUT INTO DB NOW
                var startTime = new Date(eve.start.dateTime).getTime()
                var endTime = new Date(eve.end.dateTime).getTime()
                Event.find({"name": eve.summary, "start":startTime, "end":endTime, "user":req.cookies.username}).exec(function(err, found) {
                  if (err) {console.log('error finding in mongoose')};
                  console.log(found)
                  if (!found || found.length == 0) {
                    var newEvent = new Event({
                      name: eve.summary,
                      start: startTime,
                      end: endTime,
                      location: eve.location,
                      mood: null,
                      comment: "",
                      note: "",
                      user: req.cookies.username
                    });
                    console.log(newEvent)
                    newEvent.save(function(err, saved) {
                      if (err) {console.log('could not save new event')};
                      console.log(saved);
                    })
                  }
                });
                // my_events.push(eve);
              });
            }
          });
        };
        console.log("my events--------------")
        console.log(my_events)
        console.log('getting tokens-----------');
        console.log(tokens);
        console.log('getting name---------');
        console.log(my_profile.name);
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        console.log('redirecting to ' + month + "-" + date);
        req.session.synced = true;
        res.redirect('/' + month + "-" + date);
      });
    });
  });
  // res.render('homepage',locals);
};


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

function startOfYear() {
  var start = new Date(new Date().getFullYear, 0, 1, 0, 0, 0);
  return start.toISOString()
}
function endOfYear() {
  var end = new Date(new Date().getFullYear, 11, 30, 23, 59, 59);
  return end
}


var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
    console.log('getting results-----------');
    console.log(results);
    my_email = results.email;
    my_profile.name = results.name;
    my_profile.birthday = results.birthday;
  });
  gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
    console.log('calendar results');
    console.log(results);
    for (var i = results.items.length - 1; i >= 0; i--) {
      console.log('---');
      console.log(results.items[i].summary);
      my_calendars.push(results.items[i].summary);
    };
  });
};


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
