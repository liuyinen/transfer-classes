// pages/mine/mine.js
const http = require('../../utils/request')
const app = getApp()
Page({
  data: {
    menuitems: [{
        text: '完善信息',
        img_url: '/images/mine/perfect-information.png',
        url: '../perfectInfo/perfectInfo',
        flag: 1
      },
      {
        text: '新增课程',
        img_url: '/images/mine/new-courses.png',
        url: '../newCourse/newCourse',
        flag: 1
      },
      {
        text: '教师认证',
        img_url: '/images/mine/teacher-certification.png',
        url: '../userManage/userManage',
        flag: 2
      }
    ]
  },

  /**
   * 根据调课结果跳转到相对页面
   */
  goAdjustCourse: function (e) {
    wx.navigateTo({
      url: "/pages/adjustCourseRecords/adjustCourseRecords?type=" + e.currentTarget.dataset.type
    })
  },

  /**
   * 使用promise封装用户信息接口
   */
  getUserInfo: function () {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  /**
   * 使用promise封装wx.login接口
   */
  getLogin: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  /**
   * 登录接口
   */
  async newLogin() {
    let userRes = this.getUserInfo()
    let loginRes = this.getLogin()
    //使用promise.all()平级调用
    Promise.all([userRes, loginRes])
      .then((res) => {
        let params = {
          code: res[1].code,
          iv: res[0].iv,
          encryptedData: res[0].encryptedData
        }
        http.request("newLogin", "POST", params).then(res => {
          if (res.code == 200 && res.data.length != 0) {
            app.globalData.userInfoStatus = 2;
            app.globalData.job_number = res.data[0].job_number;
            app.globalData.roleid = res.data[0].role_id;
            app.globalData.identify = res.data[0].identify;
            app.globalData.refuse_reason = res.data[0].refuse_reason;
            app.globalData.userid = res.data[0].id;
            app.globalData.username = res.data[0].username;
            app.globalData.nickname = res.data[0].nickname;
            app.globalData.telephone = res.data[0].telephone;
            app.globalData.gender = res.data[0].gender;
            app.globalData.avatar = res.data[0].avatar;
            this.setData({
              globalData: app.globalData
            })
          }
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // identify: app.globalData.identify,
      globalData: app.globalData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // getApp().watch("identify", (res) => {
    //   if (res == 2) {
    //     getApp().watch("refuse_reason", (result) => {
    //       this.setData({
    //         refuseReason: result
    //       })
    //     }, this);
    //   }
    //   this.setData({
    //     identify: res
    //   })
    // }, this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})