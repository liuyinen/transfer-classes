const db = require('../utils/mysqlUtils.js');
const express = require("express");
var sd = require('silly-datetime');

/**
 * @param {Object} req
 * @param {Object} res
 * 新增调课记录
 */
exports.addAjustClassList = function(req, res) {
	if (!req.body.userId && !req.body.dateTime && !req.body.username && !req.body.reason && !req.body.grade && !req.body.gclass &&
		!req.body.remarks && !req.body.section) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		var params = {
			user_id: req.body.userId,
			date: req.body.dateTime,
			section: req.body.section,
			username: req.body.username,
			reason: req.body.reason,
			grade: req.body.grade,
			gclass: req.body.gclass,
			remarks: req.body.remarks,
			create_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		};
		var sql = "INSERT INTO adjustcourse SET ?";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				let resultData = {
					code: 200,
					esg: "新增调课记录成功！"
				}
				res.send(resultData);
			}
		})
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 管理员审核调课记录
 */
exports.updateAjustClassStatus = function(req, res) {
	if (!req.body.recordId && !req.body.reason && !req.body.status && !req.body.attribute && !req.body.resRemarks) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		var id = req.body.recordId;
		var reason = req.body.reason;
		var status = req.body.status;
		var params = {
			attribute: req.body.attribute,
			status: status,
			res_remarks: req.body.resRemarks,
			update_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		};
		if (status == 1) {
			params.adjust_teacher = reason;
		} else {
			params.refuse = reason;
		}
		if(req.body.dateTime) {
			params.adjust_time = req.body.dateTime;
		}
		if(req.body.section) {
			params.adjust_section = req.body.section;
		}
		let sql = "UPDATE adjustcourse SET ? WHERE id = '" + id + "'";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				let resultData = {
					code: 200,
					esg: "调课成功！"
				}
				res.send(resultData);
			}
		})
	}
};
