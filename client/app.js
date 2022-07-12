// app.js
App({
  onLaunch() {
    this.oldLogin();
  },

  async oldLogin() {
    const http = require('./utils/request')
    wx.login({
      success: async (res) => {
        let code = res.code; //获取登录的临时凭证
        let params = {
          code: code,
        }
        if (code) {
          http.request("oldLogin", "POST", params).then(res => {
            if (res.code == 200 && res.data.length != 0) {
              console.log(res.data)
              this.globalData.userInfoStatus = 2;
              this.globalData.job_number = res.data[0].job_number;
              this.globalData.roleid = res.data[0].role_id;
              this.globalData.identify = res.data[0].identify;
              this.globalData.refuse_reason = res.data[0].refuse_reason;
              this.globalData.userid = res.data[0].id;
              this.globalData.username = res.data[0].username;
              this.globalData.nickname = res.data[0].nickname;
              this.globalData.telephone = res.data[0].telephone;
              this.globalData.gender = res.data[0].gender;
              this.globalData.avatar = res.data[0].avatar;
            }
          })
        }
        // console.log(this.globalData)
      },
      fail: (err) => {
        reject(err)
      }
    })
  },

  watch: function (dataName, callback, that) {
    var obj = this.globalData;
    Object.defineProperty(obj, dataName, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['temp' + dataName] = value;
        callback.call(that, value);
      },
      get: function () {
        return this['temp' + dataName];
      }
    })
  },

  globalData: {
    userInfoStatus: 1,
    roleid: "",
    identify: "",
    refuse_reason: "",
    userid: 0,
    job_number: "",
    username: "",
    nickname: "",
    telephone: "",
    gender: 1,
    avatar: ""
  }
})