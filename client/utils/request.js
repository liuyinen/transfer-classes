function request(url, method, params) {
	let apiUrl = "http://127.0.0.1:8080/";
	return new Promise((resolve, reject) => {
		wx.request({
			url: apiUrl + url,
			data: params,
			header: {
				'content-type': 'application/json',
				'cookie': wx.getStorageSync("sessionid")
			},
			method: method,
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				if (res.statusCode == 200) {
					resolve(res.data);
				}
				if (res.statusCode == 500) {
					wx.showToast({
						title: '服务异常',
					})
				}
			},
			fail: function(err) {
				wx.hideLoading();
				reject(err);
			},
			complete: function(res) {
				wx.hideLoading();
			},
		})
	});
}
module.exports = {
	request: request
}
