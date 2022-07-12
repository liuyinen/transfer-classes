const db = require('../utils/mysqlUtils.js');
const WXBizDataCrypt = require('../utils/WXBizDataCrypt.js');
const express = require("express");
const sd = require('silly-datetime');
const https = require("https");

//测试号 wxf6c73c3340d3ec9b 4094fdf0d9d5b5cd04e2e8ac58f913c2
//正式 wxd61ff37d39d8ed3e 9950a8c491357f9b1d6d8a007025a59c
const appid = "wxf6c73c3340d3ec9b"; //自己小程序后台管理的appid，可登录小程序后台查看
const secret = "4094fdf0d9d5b5cd04e2e8ac58f913c2"; //小程序后台管理的secret，可登录小程序后台查看
const grant_type = "authorization_code"; // 授权（必填）默认值

var openid, sessionKey;

/**
 * @param {Object} req
 * @param {Object} res
 * 在用户表有记录后自动登录
 */
exports.userOldLogin = function(req, res) {
	if (!req.body.code) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let code = req.body.code; //获取小程序传来的code
		//请求获取openid
		var url = "https://api.weixin.qq.com/sns/jscode2session?grant_type=" + grant_type + "&appid=" + appid + "&secret=" +
			secret + "&js_code=" + code;

		https.get(url, (re) => {
			re.on('data', (d) => {
				let openid = JSON.parse(d).openid;
				let params = {
					openid: openid
				};
				let sql = "SELECT * FROM user where ? AND delete_time IS NULL";
				db.query(sql, params, function(err, rows, fields) {
					if (rows.length > 0) {
						let resultData = {
							code: 200,
							data: rows
						}
						res.send(resultData);
					}
				});
			}).on('error', (e) => {
				console.error(e);
				res.send(JSON.parse(e));
			});
		});
	}
}

/**
 * @param {Object} req
 * @param {Object} res
 * 第一次微信登录
 */
exports.userNewLogin = function(req, res) {
	if (!req.body.code && !req.body.encryptedData && req.body.iv) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let code = req.body.code; //获取小程序传来的code
		let encryptedData = req.body.encryptedData; //获取小程序传来的encryptedData
		let iv = req.body.iv; //获取小程序传来的iv
		//请求获取openid
		var url = "https://api.weixin.qq.com/sns/jscode2session?grant_type=" + grant_type + "&appid=" + appid + "&secret=" +
			secret + "&js_code=" + code;

		https.get(url, (re) => {
			re.on('data', (d) => {
				//解密
				var pc = new WXBizDataCrypt(appid, JSON.parse(d).session_key); //这里的sessionKey 是上面获取到的
				var decodeData = pc.decryptData(encryptedData, iv); //encryptedData 是从小程序获取到的
				var openid = JSON.parse(d).openid;
				var selectUserParams = {
					openid: openid
				};
				var selectUserInfoSql = "SELECT * FROM user where ? AND delete_time IS NULL";
				db.query(selectUserInfoSql, selectUserParams, function(err, rows, fields) {
					if (rows.length == 0) {
						//新增用户
						let post = {
							nickname: decodeData.nickName,
							gender: decodeData.gender,
							avatar: decodeData.avatarUrl,
							openid: openid,
							create_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
							// create_time: sd.format(decodeData.watermark.timestamp, 'YYYY-MM-DD HH:mm:ss')
						};
						let addUserInfoSql = "INSERT INTO user SET ?";
						db.query(addUserInfoSql, post, function(err, rows, fields) {
							if (err) {
								console.log(err);
								return;
							} else {
								db.query(selectUserInfoSql, selectUserParams, function(err, rows, fields) {
									let resultData = {
										code: 200,
										data: rows
									}
									res.send(resultData);
								});
							}
						})
					} else {
						//用户信息更新
						let post = {
							nickname: decodeData.nickName,
							avatar: decodeData.avatarUrl,
							update_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
						};
						let addUserInfoSql = "UPDATE user SET ? WHERE openid = '" + openid + "'";
						db.query(addUserInfoSql, post, function(err, rows, fields) {
							if (err) {
								console.log(err);
								return;
							} else {
								db.query(selectUserInfoSql, selectUserParams, function(err, rows, fields) {
									let resultData = {
										code: 200,
										data: rows
									}
									res.send(resultData);
								});
							}
						})
					}
				});
			}).on('error', (e) => {
				console.error(e);
				res.send(JSON.parse(e));
			});
		});
	}
};
