var databaseURI = "localhost:27017/smilendardb";
var collections = ["events"];
var db = require("mongojs").connect(databaseURI, collections);

module.exports = db;