const db = require('../utils/mysqlUtils.js');
const https = require("https");
const express = require("express");
const xlsx = require('node-xlsx');
const fs = require('fs');
const path = require("path");
const sd = require('silly-datetime');

/**
 * @param {Object} req
 * @param {Object} res
 * 获取用户列表
 */
exports.getUserList = function(req, res) {
	var sql = "SELECT * FROM user WHERE username IS NOT NULL AND delete_time IS NULL ORDER BY id DESC";
	db.query(sql, "", function(err, rows, fields) {
		if (err) {
			console.log(err);
			return;
		} else {
			let resultData = {
				code: 200,
				data: rows
			}
			res.send(resultData);
		}
	})
};

/**
 * @param {Object} req
 * @param {Object} res
 * 获取用户详细信息
 */
exports.getUserDetail = function(req, res) {
	if (!req.query.userId) {
		let resultData = {
			code: 1001,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let params = {
			id: req.query.userId
		};
		let sql = "SELECT * FROM user WHERE ?";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				let resultData = {
					code: 200,
					data: rows
				}
				res.send(resultData);
			}
		})
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 更新用户认证状态
 */
exports.updateUserIdentify = function(req, res) {
	if (!req.body.identify && !req.body.roleId && !req.body.userId) {
		let resultData = {
			code: 1001,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		var identify = req.body.identify;
		var params = {
			role_id: req.body.roleId,
			identify: identify,
			update_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		};
		if (identify == 2) {
			if (!req.body.refuseRemarks) {
				let resultData = {
					code: 1001,
					msg: "参数获取失败!"
				}
				res.send(resultData);
			}
			params.refuse_reason = req.body.refuseRemarks;
		}
		let sql = "UPDATE user SET ? WHERE id = '" + req.body.userId + "'";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				let resultData = {
					code: 200,
					esg: "认证状态更新成功！"
				}
				res.send(resultData);
			}
		})
	}
};
