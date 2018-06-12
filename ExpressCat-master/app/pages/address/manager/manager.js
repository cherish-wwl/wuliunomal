// manager.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList0: [],
    orderList1: [],
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    hidden0:true,
    hidden1:true  
  }, 
  //  滑动切换tab 
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  // 跳转到管理地址簿页面
  managerAddress:function(e){

    var that = this;
    var status = that.data.currentTab;
    if(status==0){
      if (that.data.orderList0.length==0){
        return;
      }
    }else if(status==1){
      if (that.data.orderList1.length == 0) {
        return;
      }
    }
    app.getUserInfo(function () {      
      wx.navigateTo({
        url: '../managerAddress/managerAddress?status=' + that.data.currentTab,
        success: function (res) {
          // success
          //  console.log(res)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    })
  },
  // 点击tab切换  
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    /** 
    * 获取系统信息 
    */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    }); 
    
  },

  //生命周期函数--监听页面初次渲染完成 
  onReady: function () {
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    // 加载寄件人地址列表
    wx.request({
      url: app.globalData.API_URL + '/api/address/myDetailList',
      data: {
        ticket: app.globalData.ticket,
        type: 0,
        addressType: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        // success
        if (res.data.message == "获取成功") {
          that.setData({
            orderList0: res.data.data
          })
        }
        if (res.data.data.length == 0) {
          that.setData({
            hidden0: false
          })
        }

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
    // 加载收件人地址列表
    wx.request({
      url: app.globalData.API_URL + '/api/address/myDetailList',
      data: {
        ticket: app.globalData.ticket,
        type: 0,
        addressType: 2
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        // success
        if (res.data.message == "获取成功") {
          that.setData({
            orderList1: res.data.data
          })
        }
        if (res.data.data.length == 0) {
          that.setData({
            hidden1: false
          })
        }

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //生命周期函数--监听页面隐藏
  onHide: function () {
  
  }
})