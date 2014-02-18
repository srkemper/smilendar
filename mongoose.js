var databaseURI = "mongodb://smilendar147:smilendar147@ds027819.mongolab.com:27819/heroku_app21990328";
var mongoose = require("mongoose");
mongoose.connect(databaseURI);
var db = mongoose.connection;

module.exports = db;