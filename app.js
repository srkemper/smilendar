
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var calendar_event = require('./routes/calendar_event');
var month = require('./routes/month');
var addEvent = require('./routes/addEvent');
var app = express();
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
// var gapi = require('./routes/gapi');
var mongo_client = require('mongodb').MongoClient;
var mongojs = require('mongojs');

var db = require('./db');


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
  app.use(express.cookieParser('your secret here'));
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


var eventsJSON = require("./tester.json");

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

app.get('/:id',routes.index);
app.get('/users', user.list);
app.get('/calendar_event/:id', calendar_event.view);
app.get('/month/:id', month.view);
app.get('/addEvent', addEvent.view);

app.post('/changeMood', function(request, response) {
  console.log(request.body.id);
  console.log(request.body.mood);
  db.events.update({_id: mongojs.ObjectId(request.body.id)}, {$set: {mood:request.body.mood}}, function(err, updated) {
    if (err) {
      console.log("not updated :(");
    }
    console.log(updated);
  })
  response.json(200);
});

app.get('/dayEvent/:id',index.dayInfo);

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
