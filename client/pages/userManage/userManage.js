// pages/userManage/userManage.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: false,
    batchIds: [],
    userLists: []
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 查看调课的详细信息
   */
  viewDetails() {
    var that = this;
    if (that.data.batchIds.length != 1) {
      wx.showModal({
        title: '提示',
        content: '请只选择一条需要查看的教师认证申请记录！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      wx.navigateTo({
        url: "/pages/userManageDetail/userManageDetail?userId=" + that.data.batchIds[0]
      });
    }
  },

  /**
   * 删除记录
   */
  deleteUserApply() {
    var that = this;
    if (that.data.batchIds.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择需要删除的教师认证申请记录！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      let params = {
        userIds: that.data.batchIds
      }
      http.request("userManage/delete", "get", params).then(res => {
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '删除教师认证申请记录成功！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      })
    }
  },

  changeStatus: function (e) {
    this.setData({
      isActive: !this.data.isActive
    })
  },

  /**
   * 全选与反全选
   */
  selectall: function (e) {
    var that = this;
    var arr = []; //存放选中id的数组
    for (let i = 0; i < that.data.userLists.length; i++) {
      that.data.userLists[i].checked = (!that.data.select_all)
      if (that.data.userLists[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(that.data.userLists[i].id.toString().split(','));
      }
    }
    that.setData({
      recordLists: that.data.recordLists,
      select_all: (!that.data.select_all),
      batchIds: arr
    })
    that.data.batchIds = arr
  },

  /**
   * 单选
   */
  checkboxChange: function (e) {
    this.data.batchIds = e.detail.value
    this.setData({
      batchIds: e.detail.value //单个选中的值
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    http.request("userManage/list", "GET", "").then(res => {
      if (res.code == 200) {
        var userLists = res.data
        for (var i = 0; i < userLists.length; i++) {
          userLists[i].create_time = util.transformTimestamp(userLists[i].create_time)
        }
        this.setData({
          isActive: false,
          userLists: userLists
        })
      }
    })
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