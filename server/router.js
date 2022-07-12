exports.setRequestUrl = function(app) {
	var login = require('./routers/login'),
		adjustCourse = require('./routers/adjustCourse'),
		adjustCourseRecord = require('./routers/adjustCourseRecord'),
		perfectInfo = require('./routers/perfectInfo'),
		userManage = require('./routers/userManage');

	app.post('/newLogin', login.userNewLogin);
	app.post('/oldLogin', login.userOldLogin);

	app.post('/perfectInfo/setPhone', perfectInfo.setUserPhone);
	app.post('/perfectInfo/update', perfectInfo.updateUserInfo);

	app.post('/adjustCourse/add', adjustCourse.addAjustClassList);
	app.post('/adjustCourse/adjust', adjustCourse.updateAjustClassStatus);
	app.get('/adjustCourseRecord/course',adjustCourseRecord.getNewCourse);
	app.get('/adjustCourseRecord/list', adjustCourseRecord.getAjustClassList);
	app.get('/adjustCourseRecord/detail', adjustCourseRecord.getAjustClassDetail);
	app.get('/adjustCourseRecord/export',adjustCourseRecord.exportAdjustCourseRecord);
	app.get('/adjustCourseRecord/delete',adjustCourseRecord.deleteAdjustCourseRecord);		
	app.get('/adjustCourseRecord/exportDownload',adjustCourseRecord.downloadAdjustCourseRecord);
	
	app.get('/userManage/list', userManage.getUserList);
	app.get('/userManage/detail', userManage.getUserDetail);
	app.post('/userManage/update', userManage.updateUserIdentify);
}
