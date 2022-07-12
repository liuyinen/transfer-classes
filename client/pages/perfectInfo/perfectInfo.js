// pages/perfectInfo/perfectInfo.js
const http = require('../../utils/request')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job_number: "",
    username: "",
    telephone: "",
    gender: 0,
    array: ['女性', '男性'],
    index: 0,
    mobileStatus: 1,
  },

  bindgetphonenumber(e) {
    var that = this;
    wx.login({
      success: function (res) {
        if (e.detail.errMsg == "getPhoneNumber:ok") {
          let url = "perfectInfo/setPhone"; //后台请求地址
          let params = {
            userid: app.globalData.userid,
            code: res.code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          }
          http.request(url, "POST", params).then(res => {
            if (res.code == 200) {
              app.globalData.telephone = res.data.telephone;
              that.setData({
                mobileStatus: 2,
                telephone: res.data.telephone
              });
            }            
          })
        }        
      },
      fail: function (res) {
        console.log('登陆失败');
      },
      complete: function (res) {},
    })
  },


  pickChange: function (e) {
    this.data.gender = e.detail.value
    this.setData({
      index: e.detail.value
    });
  },

  formSubmit: function (e) {
    if (e.detail.value.jobNumber == "" || e.detail.value.username == "" || e.detail.value.telephone == "" || typeof (e.detail.value.telephone) == "undefined") {
      wx.showModal({
        title: '提示',
        content: '请将带星的信息填写完整！',
        success: function (res) {
          console.log("请填写完信息！")
        }
      });
    } else {
      let params = {
        userid: app.globalData.userid,
        jobNumber: e.detail.value.jobNumber,
        username: e.detail.value.username,
        telephone: e.detail.value.telephone,
        gender: this.data.gender
      }      
      http.request("perfectInfo/update", "POST", params).then(res => {
        if (res.code && res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '用户信息更新成功，请耐心等待管理员审核！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
          app.globalData.job_number = res.data.job_number;
          app.globalData.username = res.data.username;
          app.globalData.gender = res.data.gender;
          app.globalData.telephone = res.data.telephone;
          app.globalData.identify = res.data.identify;
          this.setData({
            job_number: res.data.job_number,
            username: res.data.username,
            index: res.data.gender,
            telephone: res.data.telephone,
            identify: res.data.identify
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.telephone) {
      this.setData({
        mobileStatus: 2,
      })
    }
    this.setData({
      job_number: app.globalData.job_number,
      username: app.globalData.username,
      telephone: app.globalData.telephone,
      index: app.globalData.gender,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log()
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