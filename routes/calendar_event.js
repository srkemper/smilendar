var data = require("../tester.json");




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

	res.render('calendar_event', eveIns);
};