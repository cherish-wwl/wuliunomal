// pages/orderDetail/orderDetail.js

// 查看已完成/配送中的订单详情
var app = getApp();
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js')
Page({
  data: {
    orderList0: [],
    orderList1: [],
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    pageSize0: 5,
    pageSize1: 5,
    start0: 0,
    start1: 0,
    hidden0: true,
    hidden1: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }

    });

  },
  //  滑动切换tab 
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
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
  //加载更多
  loadingMore: function (e) {
    var status = e.currentTarget.dataset.status;
    var ticket = app.globalData.ticket;
    var that = this;
    if (status == 3) {
      //退款中
      var start0 = that.data.start0;
      if (start0 != -1) {
        var pageSize0 = that.data.pageSize0;
        console.log(pageSize0);
        that.setData({
          pageSize0: pageSize0 + 2
        })
        that.getLists(ticket, 3, 0, that.data.pageSize0);

      } else {
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    } else if (status == 4) {
      // 已退款
      var start1 = that.data.start1;
      if (start1 != -1) {
        var pageSize1 = that.data.pageSize1;
        console.log(pageSize1);
        that.setData({
          pageSize1: pageSize1 + 2
        })
        that.getLists(ticket, 4, 0, that.data.pageSize1);
      } else {
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    } else if (status == 2) {
      // 已签收
      var start2 = that.data.start1;
      if (start2 != -1) {
        var pageSize2 = that.data.pageSize2
        console.log(pageSize2);
        that.setData({
          pageSize2: pageSize2 + 10
        })
        that.getLists(ticket, 2, 0, that.data.pageSize2);
      } else {
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

    var that = this;
    app.getUserInfo(function () {
      var ticket = app.globalData.ticket;
      var pageSize0 = that.data.pageSize0;
      var pageSize1 = that.data.pageSize1;
      // getLists(ticket, status, start)
      // 获取待取货的列表
      that.getLists(ticket, 3, 0, pageSize0);
      // 获取待取货的列表
      that.getLists(ticket, 4, 0, pageSize1);

    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    console.log("页面关闭")
  },
  getLists: function (ticket, status, start, pageSize) {
    var that = this
    var pageSize;
    var key = md5.hexMD5("size=" + pageSize + "start=" + start + "status=" + status + "ticket=" + ticket + "!%&wuliu#$*")
    wx.request({
      url: app.globalData.API_URL + '/api/fast/myorder/list', //接口地址
      data: {
        ticket: ticket,
        status: status,
        start: start,
        size: pageSize,
        key: key
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res.data);
        var result = res.data;
        for (var i = 0; i < result.data.list.length; i++) {
          result.data.list[i].createTime = util.formatTime(result.data.list[i].createTime, 'Y/M/D h:m:s');
        }
        if (result.code == 0) {
          if (status == 3) {
            that.setData({
              start0: result.data.nextStart,
              orderList0: result.data.list
            })
            if (result.data.list.length == 0) {
              that.setData({
                hidden0: false
              })
            }
          } else if (status == 4) {
            that.setData({
              start1: result.data.nextStart,
              orderList1: result.data.list
            })
            if (result.data.list.length == 0) {
              that.setData({
                hidden1: false
              })
            }
          } 

        } else {
          wx.showLoading({
            title: '加载我的运单 失败！ status=' + status,
          });
        }
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})