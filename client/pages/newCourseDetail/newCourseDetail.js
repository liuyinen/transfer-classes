// pages/newCourseDetail/newCourseDetail.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    sectionArray: ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节', '第七节'],
  },

  navigateBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    let params = {
      recordId: this.data.id
    }
    http.request("adjustCourseRecord/detail", "get", params).then(res => {
      if (res.code == 200) {
        var courseData = res.data[0];
        courseData.grade = courseData.grade == "7" ? "七年级" : (courseData.grade == "8" ? "八年级" : "九年级");
        courseData.date = util.transformTimestamp(courseData.date);
        courseData.adjust_time = util.transformTimestamp(courseData.adjust_time);
        this.setData({
          courseData: courseData
        })
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