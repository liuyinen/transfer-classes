// pages/newCourse/newCourse.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1
  },

  /**
   * 根据调课结果跳转到相对页面
   */
  getNewCourseDetail: function (e) {
    wx.navigateTo({
      url: "/pages/newCourseDetail/newCourseDetail?id=" + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = {
      username: app.globalData.username
    }
    http.request("adjustCourseRecord/course", "GET", params).then(res => {
      if (res.code == "1001") {
        var msg = res.msg
        wx.showModal({
          title: '提示',
          content: msg,
          success: function (res) {
            wx.switchTab({
              url: "/pages/mine/mine"
            })
          }
        });
      }
      if (res.code == 200) {
        if (res.data.length == 0) {
          this.setData({
            flag: 0
          })
        } else {
          var courseLists = res.data
          for (var i = 0; i < courseLists.length; i++) {
            courseLists[i].date = util.transformTimestamp(courseLists[i].date)
          }
          this.setData({
            flag: this.data.flag,
            courseLists: courseLists
          })
        }

      }

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