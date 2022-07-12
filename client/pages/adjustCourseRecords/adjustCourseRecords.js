// pages/adjustCourseRecords/adjustCourseRecords.js
const http = require('../../utils/request')
var util = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1,
    isActive: false,
    batchIds: [],
    recordLists: []
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.switchTab({
      url: "/pages/mine/mine"
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
        content: '请只选择一条需要查看的调课记录！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      wx.navigateTo({
        url: "/pages/adjustCourseDetail/adjustCourseDetail?groupId=" + that.data.batchIds[0]
      });
    }
  },

  /**
   * 删除未调的调课记录
   */
  deleteRecords() {
    var that = this;
    if (that.data.batchIds.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择需要删除的调课记录！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      let params = {
        recordIds: that.data.batchIds
      }
      http.request("adjustCourseRecord/delete", "get", params).then(res => {
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '删除调课记录成功！',
            success: function (res) {
              wx.reLaunch({
                url: '/pages/adjustCourseRecords/adjustCourseRecords?type=0',
              })
            }
          });
        }
      })
    }
  },

  /**
   * 点击导出
   */
  exportRecords() {
    let that = this
    if (that.data.batchIds.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择需要导出的调课记录！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    } else {
      let params = {
        recordIds: that.data.batchIds
      }
      http.request("adjustCourseRecord/export", "get", params).then(res => {
        if (res.code == 200) {
          that.download("adjustCourse.xlsx")
        }
      })
    }
  },

  /**
   * 查看导出返回的字节流
   */
  download(fileName) {
    let token = wx.getStorageSync('token');
    wx.downloadFile({ // downloadFile的url必须为http或者https
      url: 'http://127.0.0.1:8080/adjustCourseRecord/exportDownload?fileName=' + fileName,
      // header: {
      //   "content-type": "application/json",
      //   "token": token
      // },
      // responseType: "arraybuffer", //注意这里的responseType
      success(res) {
        console.log(res)
        const manage = wx.getFileSystemManager();
        if (res.statusCode === 200) {
          manage.saveFile({
            tempFilePath: res.tempFilePath,
            filePath: wx.env.USER_DATA_PATH + "/调课清单.xlsx", // 文件重命名 可自定义
            success: function (res) {
              // 打开文档
              console.log(wx.env.USER_DATA_PATH + "/调课清单.xlsx")
              wx.openDocument({
                fileType: "xlsx",
                filePath: wx.env.USER_DATA_PATH + "/调课清单.xlsx",
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            }
          });

        }
      },
      fail(err) {
        console.log('downloadfile err', err)
      }
    })
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
    for (let i = 0; i < that.data.recordLists.length; i++) {
      that.data.recordLists[i].checked = (!that.data.select_all)
      if (that.data.recordLists[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(that.data.recordLists[i].id.toString().split(','));
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
    let params = {
      role_id: app.globalData.roleid,
      userId: app.globalData.userid,
      type: options.type
    }
    http.request("adjustCourseRecord/list", "GET", params).then(res => {
      if (res.data.length == 0) {
        this.setData({
          type: options.type,
          roleid: app.globalData.roleid,
          flag: 0
        })
      } else {
        if (res.code == 200) {
          var recordData = res.data
          for (var i = 0; i < recordData.length; i++) {
            recordData[i].date = util.transformTimestamp(recordData[i].date)
          }
          this.setData({
            flag: this.data.flag,
            type: options.type,
            roleid: app.globalData.roleid,
            recordLists: recordData
          })
        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isActive: false
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