const db = require('../utils/mysqlUtils.js');
var getUserInfo = async function(userid) {
	return await new Promise(function(resolve, reject) {
		let params = {
			id: userid
		};
		let sql = "SELECT * FROM user WHERE ?";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				resolve(rows[0]);
			}
		})
	})
}

module.exports = {
	getUserInfo
}
