var data = require("../tester.json");
var moment = require('moment');



exports.view = function(req, res) {
  var eveId = req.params.id;
  var eveList = data.events;
  var eveIns = null;
  for(var i = eveList.length;i--;) {
        console.log('1');
        if(eveList[i].id == eveId) {
            eveIns = eveList[i];
            console.log(eveIns);
            break;
        }
    }

  var std = new Date(Date.parse(eveIns.start.dateTime));
  var end = new Date(Date.parse(eveIns.end.dateTime));
  eveIns.startHour = std.getHours();
  eveIns.startMin = std.getMinutes();
  eveIns.endHour = end.getHours();
  eveIns.endMin = end.getMinutes();
	res.render('calendar_event', eveIns);
};

