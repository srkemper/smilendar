var data = require("../tester.json");
var db = require('../db.js');
var mongojs = require('mongojs');


var locals = {
    goback: {
        link: '/',
        display: 'Today',
    },
    // eventlist: data
};


// exports.index = function(req, res){
//     console.log('-------------xxx');
// //  res.render('homepage', { title: 'Today' });
// //    console.log('--------------locals-----------');
//   locals.todaysEvents.events = [];

// };


exports.view = function(req, res) {
  var eveId = req.params.id;
  console.log('calendar_event_id: '+eveId);
  db.events.findOne({_id:mongojs.ObjectId(eveId)},function(err,doc){
    if (!err) {
      console.log('mongojs working in calendar_event.js!');
      eveIns = doc;
      console.log(doc);
      var std = new Date(Date.parse(eveIns.start.dateTime));
      var end = new Date(Date.parse(eveIns.end.dateTime));
      eveIns.day = std.getDay();
      if (eveIns.day != 3){
        locals.goback.display = 'Day';
      }
      eveIns.startHour = std.getHours();
      eveIns.startMin = std.getMinutes();
      eveIns.endHour = end.getHours();
      eveIns.endMin = end.getMinutes();
      locals.eveIns = eveIns;
      res.render('calendar_event', locals);
    }
  });
  // var eveList = data.events;
  // var eveIns = null;
  // for(var i = eveList.length;i--;) {
  //       console.log('1');
  //       if(eveList[i].id == eveId) {
  //           eveIns = eveList[i];
  //           console.log(eveIns);
  //           break;
  //       }
  //   }

 //  var std = new Date(Date.parse(eveIns.start.dateTime));
 //  var end = new Date(Date.parse(eveIns.end.dateTime));
 //  eveIns.startHour = std.getHours();
 //  eveIns.startMin = std.getMinutes();
 //  eveIns.endHour = end.getHours();
 //  eveIns.endMin = end.getMinutes();
 //  locals.eveIns = eveIns;
	// res.render('calendar_event', locals);
}

