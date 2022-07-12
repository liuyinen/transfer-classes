// pages/userManageDetail/userManageDetail.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    identify: "",
    refuseReason: "",
    statusRadio: "同意",
    roleItems: [{
        name: '总管理员',
        value: '总管理员',
      }, {
        name: '普通管理员',
        value: '普通管理员',
      },
      {
        name: '教师',
        value: '教师',
        checked: 'true'
      },
    ],
    identifyItems: [{
        name: '同意',
        value: '同意',
        checked: 'true'
      },
      {
        name: '拒绝',
        value: '拒绝',
      },
    ],
  },

  navigateBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  radiochange: function (res) {
    this.setData({
      statusRadio: res.detail.value
    })
  },

  confirmUser: function (e) {
    var userId = this.data.userId
    var role = e.detail.value.role == "总管理员" ? 1 : (e.detail.value.role == "普通管理员" ? 2 : 3);
    var identify = e.detail.value.identify == "同意" ? 1 : 2;
    if (identify == 2) {
      var refuseReason = e.detail.value.refuseRemarks.replace(/(^\s*)|(\s*$)/g, "");
    }
    if (identify == 2 && refuseReason == "") {
      wx.showModal({
        title: '提示',
        content: '请填写拒绝认证教师的原因！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      var params = {
        userId: userId,
        roleId: role,
        identify: identify
      }
      if (identify == 2) {
        params.refuseRemarks = refuseReason;
      }
      http.request("userManage/update", "POST", params).then(res => {
        if (res.code == 200) {
          this.setData({
            roleId: role,
            identify: identify
          })
          if (identify == 2) {
            this.setData({
              refuseReason: refuseReason
            })
          }
          wx.showModal({
            title: '提示',
            content: '认证状态更新成功！',
            success: function (res) {
              // wx.redirectTo({
              //   url: "/pages/userManage/userManage"
              // })
            }
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userId = options.userId;
    let params = {
      userId: this.data.userId
    }
    http.request("userManage/detail", "get", params).then(res => {
      if (res.code == 200) {
        var userData = res.data[0];
        userData.create_time = util.transformTimestamp(userData.create_time);
        this.setData({
          identify: userData.identify,
          refuseReason: userData.refuse_reason,
          roleId: userData.role_id,
          userData: userData
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