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
 * 根据用户角色和查询类型获取调课数据
 */
exports.getAjustClassList = function(req, res) {
	if (!req.query.role_id && !req.query.userId && !req.query.type) {
		let resultData = {
			code: 1001,
			msg: "用户数据获取失败,请检查是否登录!"
		}
		res.send(resultData);
	} else {
		var roleId = req.query.role_id;
		if (roleId == 1 || roleId == 2) {
			var sql =
				"SELECT ac.*,u.username FROM adjustcourse ac,user u WHERE ac.user_id = u.id AND ac.delete_time IS NULL";
		} else {
			var sql =
				"SELECT ac.*,u.username FROM adjustcourse ac,user u WHERE ac.user_id = u.id AND ac.delete_time IS NULL AND ac.user_id = " +
				req.query.userId;
		}
		if (req.query.type != 3) {
			sql = sql + " AND ac.status = " + req.query.type;
		}
		sql = sql + " ORDER BY id DESC"
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
	}

};

/**
 * @param {Object} req
 * @param {Object} res
 * 获取教师新增的调课课程
 */
exports.getNewCourse = function(req, res) {
	if (!req.query.username) {
		let resultData = {
			code: 1001,
			msg: "用户数据获取失败,请检查是否登录!"
		}
		res.send(resultData);
	} else {
		var sql =
			"SELECT * FROM adjustcourse WHERE adjust_teacher = '" + req.query.username + "' AND delete_time IS NULL";
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
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 删除还未调课的调课记录
 */
exports.deleteAdjustCourseRecord = function(req, res) {
	if (!req.query.recordIds) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		var ids = req.query.recordIds.replace(/\[/i, "(");
		var recordIds = ids.replace(/\]/i, ")");
		let params = {
			delete_time: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
		}
		let sql = "UPDATE adjustcourse SET ? WHERE id in " + recordIds;
		db.query(sql, params, function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				let resultData = {
					code: 200
				}
				res.send(resultData);
			}
		})
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 获取调课记录的详细信息
 */
exports.getAjustClassDetail = function(req, res) {
	if (!req.query.recordId) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		let params = {
			id: req.query.recordId
		};
		let sql = "SELECT * FROM adjustcourse WHERE ?";
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
 * 将获取到的调课记录写入excel
 */
exports.exportAdjustCourseRecord = function(req, res) {
	if (!req.query.recordIds) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		var ids = req.query.recordIds.replace(/\[/i, "(");
		var recordIds = ids.replace(/\]/i, ")");
		let sql = "SELECT * FROM adjustcourse WHERE id in " + recordIds + " AND delete_time IS NULL";
		db.query(sql, "", function(err, rows, fields) {
			if (err) {
				console.log(err);
				return;
			} else {
				var sectionArray = ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节', '第七节']
				var data = [] // 其实最后就是把这个数组写入excel 
				var title = ['序号', '调课日期', '节次', '申请调课的教师', '申请调课原因', '年级', '班级', '申请调课备注', '调课状态（0：未处理；1：同意；2：拒绝）', '安排上课的教师',
					'属性（1为自习，2为上课）',
					'拒绝调课原因', '管理员调课备注', '申请时间'
				] //这是第一行 俗称列名 
				data.push(title) // 添加完列名 下面就是添加真正的内容了
				rows.forEach((element) => {
					let arrInner = []
					arrInner.push(element.id)
					arrInner.push(element.date)
					arrInner.push(sectionArray[element.section])
					arrInner.push(element.username)
					arrInner.push(element.reason)
					arrInner.push(element.grade == '7' ? '七年级' : (element.grade == '8' ? '八年级' : '九年级'))
					arrInner.push(element.gclass)
					arrInner.push(element.remarks)
					arrInner.push(element.status)
					arrInner.push(element.adjust_teacher)
					arrInner.push(element.attribute)
					arrInner.push(element.refuse)
					arrInner.push(element.res_remarks)
					arrInner.push(element.create_time)
					data.push(arrInner) //data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
				});
				writeXls(data)
				let resultData = {
					code: 200
				}
				res.send(resultData);
			}
		})
	}
};

/**
 * @param {Object} req
 * @param {Object} res
 * 在服务端生成的调课记录excel表
 */
function writeXls(datas) {
	let buffer = xlsx.build([{
		name: 'sheet1',
		data: datas
	}]);
	fs.writeFileSync('./adjustCourse.xlsx', buffer, {
		'flag': 'w'
	});
};

/**
 * @param {Object} req
 * @param {Object} res
 * 获取服务端的调课记录excel表
 */
exports.downloadAdjustCourseRecord = function(req, res) {
	if (!req.query.fileName) {
		let resultData = {
			code: 1002,
			msg: "参数获取失败!"
		}
		res.send(resultData);
	} else {
		//这个是前台请求中的参数（文件名称）
		var fileName = req.query.fileName;
		//获取相对路径 （.默认指的是项目中的bin文件夹）
		var filePath = fileName
		//获取绝对路径
		filePath = path.resolve(filePath)
		//强制浏览器下载
		res.setHeader('Content-Type', 'application/force-download');
		//下载文件
		res.download(filePath, function(error) {
			//console.log("Error:", error)
		});
	}
};
