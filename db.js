var databaseURI = "mongodb://smilendar147:smilendar147@ds027819.mongolab.com:27819/heroku_app21990328";
var collections = ["events"];
var db = require("mongojs").connect(databaseURI, collections);

module.exports = db;