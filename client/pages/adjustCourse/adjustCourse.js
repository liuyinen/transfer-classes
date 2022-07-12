const http = require('../../utils/request')
const app = getApp()
Page({
  data: {
    multiArray: [
      ['七年级', '八年级', '九年级'],
      ['1班', '2班', '3班', '4班', '5班', '6班', '7班', '8班']
    ],
    index: 0,
    section: "0",
    sectionArray: ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节', '第七节'],
    dateTime: "",
  },

  bindPickerChange: function (e) {
    this.data.section = e.detail.value
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that = this;
    var identify = app.globalData.identify;
    if (identify != 1) {
      wx.showModal({
        title: '提示',
        content: '教师身份尚未认证！',
        success: function (res) {
          if (app.globalData.userInfoStatus == 2) {
            wx.navigateTo({
              url: "/pages/perfectInfo/perfectInfo"
            });
          } else {
            wx.switchTab({
              url: "/pages/mine/mine"
            });
          }
        }
      });
    } else {     
      var username = e.detail.value.username.replace(/(^\s*)|(\s*$)/g, "");
      var reason = e.detail.value.reason.replace(/(^\s*)|(\s*$)/g, "");
      var remarks = e.detail.value.remarks.replace(/(^\s*)|(\s*$)/g, "");
      if (username == "" || reason == "") {
        wx.showModal({
          title: '提示',
          content: '请将带星的信息填写完整！',
          success: function (res) {
            console.log("请填写完信息！")
          }
        });
      } else {
        let grade = e.detail.value.gradeClass.grade == "七年级" ? "7" : (e.detail.value.gradeClass.grade == "八年级" ? "8" : "9")
        let gclass = e.detail.value.gradeClass.gclass.replace("班", "")
        let params = {
          userId: app.globalData.userid,
          dateTime: that.data.dateTime,
          section: that.data.section,
          username: username,
          reason: reason,
          grade: grade,
          gclass: gclass,
          remarks: remarks
        }
        http.request("adjustCourse/add", "POST", params).then(res => {
          if (res.code == 200) {
            wx.showModal({
              title: '提示',
              content: '调课记录登记成功！',
              success: function (res) {
                that.setData({
                  form_info: ''
                })
              }
            });
          }
        })
      }
    }
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      gradeClass: {
        grade: this.data.multiArray[0][e.detail.value[0]],
        gclass: this.data.multiArray[1][e.detail.value[1]]
      }
    })
  },

  onPickerChange3: function (e) {
    this.data.dateTime = e.detail.dateString
    this.setData({
      endedTime: e.detail.dateString
    })
  },

  toDouble: function (num) {
    if (num >= 10) {
      return num;
    } else {
      return '0' + num
    }
  },

  getToday: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let munutes = date.getMinutes();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day) + " " + this.toDouble(hour) + ":" + this.toDouble(munutes)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.dateTime = this.getToday()
    this.setData({
      endedTime: this.getToday(),
      gradeClass: {
        grade: "七年级",
        gclass: "1班"
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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