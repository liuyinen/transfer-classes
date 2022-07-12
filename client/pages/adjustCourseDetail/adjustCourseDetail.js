// pages/adjustCourseDetail/adjustCourseDetail.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: "",
    dateTime: "",
    statusRadio: "同意",
    index: 0,
    section: "0",
    sectionArray: ['第一节', '第二节', '第三节', '第四节', '第五节', '第六节', '第七节'],
    attributeItems: [{
        name: '自习',
        value: '自习',
        checked: 'true'
      },
      {
        name: '上课',
        value: '上课'
      },
    ],
    statusItems: [{
        name: '同意',
        value: '同意',
        checked: 'true'
      },
      {
        name: '拒绝',
        value: '拒绝'
      },
    ],
  },

  radiochange: function (res) {
    this.setData({
      statusRadio: res.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.data.section = e.detail.value
    this.setData({
      index: e.detail.value
    })
  },

  confirmAdjustCourse: function (e) {
    var attribute = e.detail.value.attribute == "自习" ? 1 : 2
    var status = e.detail.value.status == "同意" ? 1 : 2
    if (status == 1 && e.detail.value.username.replace(/(^\s*)|(\s*$)/g, "") == "") {
      wx.showModal({
        title: '提示',
        content: '请填写被调课的教师！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else if (status == 2 && e.detail.value.refuse.replace(/(^\s*)|(\s*$)/g, "") == "") {
      wx.showModal({
        title: '提示',
        content: '请填写拒绝调课的理由！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      let reason = status == 1 ? e.detail.value.username.replace(/(^\s*)|(\s*$)/g, "") : e.detail.value.refuse.replace(/(^\s*)|(\s*$)/g, "")
      let params = {
        recordId: this.recordId,
        status: status,
        reason: reason,
        dateTime: this.data.dateTime,
        section: this.data.section,
        resRemarks: e.detail.value.resRemarks.replace(/(^\s*)|(\s*$)/g, "")
      }
      if (status == 1) {
        params.attribute = attribute;
      }
      http.request("adjustCourse/adjust", "POST", params).then(res => {
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '调课成功！',
            success: function (res) {
              wx.navigateTo({
                url: "/pages/adjustCourseRecords/adjustCourseRecords?type=0"
              });
            }
          });
        }
      })    
    }
  },

  navigateBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  onPickerChange3: function (e) {
    this.data.dateTime = e.detail.dateString
    this.setData({
      endedTime: e.detail.dateString
    })
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

  toDouble: function (num) {
    if (num >= 10) {
      return num;
    } else {
      return '0' + num
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.dateTime = this.getToday()
    this.recordId = options.groupId;
    let params = {
      recordId: options.groupId
    }
    http.request("adjustCourseRecord/detail", "get", params).then(res => {
      if (res.code == 200) {
        var recordData = res.data[0];
        recordData.date = util.transformTimestamp(recordData.date);
        recordData.adjust_time = util.transformTimestamp(recordData.adjust_time);
        recordData.grade = recordData.grade == "7" ? "七年级" : (recordData.grade == "8" ? "八年级" : "九年级");
        this.setData({
          endedTime: this.getToday(),
          role_id: app.globalData.roleid,
          recordData: recordData
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