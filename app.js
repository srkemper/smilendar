
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var calendar_event = require('./routes/calendar_event');
var month = require('./routes/month');
var app = express();
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var gapi = require('./lib/gapi');
var mongo_client = require('mongodb').MongoClient;

var collections = ['test'];
var db_test = require('mongojs').connect('exampleDb', collections);

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

mongo_client.connect('mongodb://localhost/exampleDb', function(err, db) {
  console.log('connected');
  if (err) {
    return console.dir(err);
  }
  var collection = db.collection('test');
  var doc1 = {'hello':'doc1'};
  var doc2 = {'hello':'doc2'};
  var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

  collection.insert(doc1, function(err, result) {});
  collection.insert(doc2, {w:1}, function(err, result) {});
  collection.insert(lotsOfDocs, {w:1}, function(err, result) {
    collection.find().toArray(function(err, items) {});

    // var stream = collection.find({mykey:{$ne:2}}).stream();
    // stream.on("data", function(item) {});
    // stream.on("end", function() {});

    collection.findOne({'hello':'doc3'}, function(err, item) {
      // console.log(item);
    });
  });

  console.log(collection);
});

db_test.test.find({'hello':'doc3'}, function(err, item) {
  if (item) {
    console.log('mongojs working!');
    console.log(item);
  }
})

app.get('/',routes.index);
app.get('/users', user.list);
app.get('/calendar_event', calendar_event.view);
app.get('/month', month.view);

// handling return value
app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  gapi.client.getToken(code, function(err, tokens) {
    gapi.client.credentials = tokens;   // getting access tokens
    getData();
  console.log('getting tokens-----------');
    console.log(tokens);
  });
    console.log('getting name---------');
    console.log(my_profile.name);
  var locals = {
        user: my_profile.name,
        title: 'Today',
        //title: 'This is my sample app',
        url: gapi.url       // add gapi.url to the locals object that is sent to index.jade.
      };
    console.log(locals);
    res.render('homepage',locals);
//  res.render('login.jade', locals);
});

app.get('/cal', function(req, res){
  var locals = {
    title: "These are your calendars",
    user: my_profile.name,
    bday: my_profile.birthday,
    events: my_calendars,
    email: my_email
  };
  res.render('cal.jade', locals);
});

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
      my_calendars.push(results.items[i].summary);
    };
  });
};


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
