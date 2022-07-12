var dbhost = require("../config").host; //数据库地址
var dbuser = require("../config").user; //数据库用户
var dbpwd = require("../config").pwd; //数据库密码
var dbdatabase = require("../config").database; //数据库名称
var db = {};
var mysql = require('mysql');
var pool = mysql.createPool({
	host: dbhost,
	user: dbuser,
	password: dbpwd,
	database: dbdatabase
});
db.query = function(sql, param, callback) {
	if (!sql) {
		callback();
		return;
	}
	pool.query(sql, param, function(err, rows, fields) {
		if (err) {
			console.log(err);
			callback(err, null);
			return;
		};
		callback(null, rows, fields);
	});
}
module.exports = db;
