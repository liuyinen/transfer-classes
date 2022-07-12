const db = require('../utils/mysqlUtils.js');
const WXBizDataCrypt = require('../utils/WXBizDataCrypt.js');
const express = require("express");
const sd = require('silly-datetime');
const https = require("https");
const getInfo = require("../utils/getInfo.js");

const appid = "wxf6c73c3340d3ec9b"; //自己小程序后台管理的appid，可登录小程序后台查看
const secret = "4094fdf0d9d5b5cd04e2e8ac58f913c2"; //小程序后台管理的secret，可登录小程序后台查看
const grant_type = "authorization_code"; // 授权（必填）默认值

/**
 * @param {Object} req
 * @param {Object} res
 * 获取登录微信的手机号码
 */
exports.setUserPhone = function(req, res) {
	if (!req.body.userid && !req.body.code && !req.body.encryptedData && !req.body.iv) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let userid = req.body.userid;
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
				let params = {
					telephone: decodeData.phoneNumber,
					update_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
					// update_time: sd.format(decodeData.watermark.timestamp, 'YYYY-MM-DD HH:mm:ss')
				};
				let openid = JSON.parse(d).openid;
				let sql = "UPDATE user SET ? WHERE openid = '" + openid + "'";
				db.query(sql, params, function(err, rows, fields) {
					if (err) {
						console.log(err);
						return;
					} else {
						getInfo.getUserInfo(userid).then(data => {
							const userData = data;
							let resultData = {
								code: 200,
								data: userData,
								esg: "手机号码绑定成功！"
							}
							res.send(resultData);
						})
					}
				})
			}).on('error', (e) => {
				console.error(e);
				res.send(JSON.parse(e));
			});
		});
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 更新用户信息
 */
exports.updateUserInfo = function(req, res) {
	if (!req.body.userid && !req.body.jobNumber && !req.body.username && !req.body.telephone && !req.body.gender) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let userid = req.body.userid;
		let params = {
			job_number: req.body.jobNumber,
			username: req.body.username,
			telephone: req.body.telephone,
			gender: req.body.gender,
			identify: 0,
			update_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		};
		let sql = "UPDATE user SET ? WHERE id = '" + userid + "'";
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				getInfo.getUserInfo(userid).then(data => {
					const userData = data;
					let resultData = {
						code: 200,
						data: userData,
						esg: "用户信息更新成功！"
					}
					res.send(resultData);
				});
			}
		})
	}
};
