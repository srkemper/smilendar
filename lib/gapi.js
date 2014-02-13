var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '98692743004-fhh57e5no73d1nc6jccfcd8r60r2ebem.apps.googleusercontent.com',
    secret = 'GG1HhByxR9ka1a1OQiZrnNOE',
    redirect = 'http://localhost:3000/oauth2callback',
    calendar_auth_url = '',
    oauth2Client = new OAuth2Client(client, secret, redirect);

calendar_auth_url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
//Because we want the user’s email address (for, say, profile creation), and its profile (name and related available data for personalizing the profile), and we want to interact with the calendar and we want to do this even if the user isn’t on the page, these are the options:
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
});

exports.ping = function() {
    console.log('pong');
};

var callback = function(clients) {
  console.log(clients);
  exports.cal = clients.calendar;
  exports.oauth = clients.oauth2;
  exports.client = oauth2Client;  // export oauth2Client from gapi.js
  exports.url = calendar_auth_url;
};

googleapis
  .discover('calendar', 'v3')
  .discover('oauth2', 'v2')
  .execute(function(err, client){
    if(!err)
      callback(client);
  });
