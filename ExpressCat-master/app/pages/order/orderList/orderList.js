// pages/order/order.js
var app = getApp();
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js')
Page({
  data:{
    orderList0: [], 
    orderList1: [], 
    orderList2: [], 
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,  
    pageSize0:10,
    pageSize1:10,
    pageSize2:10,
    start0:0,
    start1:0,
    start2:0,
    hidden0:true,
    hidden1: true,
    hidden2: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
  
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
  //订单详情
  viewOrderD:function(e){
    console.log(e);
    var orderwaybillNo = e.currentTarget.dataset.waybillno;   
    var status = e.currentTarget.dataset.status;
    var pay = e.currentTarget.dataset.pay;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?waybillNo=' + orderwaybillNo + "&status=" + status+"&pay="+pay,
      success: function(res){
        // success
       
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '操作 失败！',
          duration: 2000
        })
      },
      complete: function() {
        // complete
      }
    })
              
  },
  // 取消订单
  cancelOrder:function(e){
    var that = this;
    var waybillNo = e.currentTarget.dataset.waybillno;
    var pay = e.currentTarget.dataset.pay;
    var ticket = app.globalData.ticket;
    if(pay==false){
      // 取消订单
      wx.showModal({
        title: '提示',
        content: '您确定要取消该订单吗？',
        success: function (res) {
          if (res.confirm) {
            var key = md5.hexMD5("ticket=" + ticket + "waybillNo=" + waybillNo + "!%&wuliu#$*")
            wx.request({
              url: app.globalData.API_URL + '/api/fast/order/cancel', //接口地址
              data: {
                ticket: ticket,
                waybillNo: waybillNo,
                key: key
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log(res.data);
                var result = res.data;
                if (result.code == 0) {
                  wx.showToast({
                    title: '成功取消订单！',
                    icon: 'success',
                    duration: 2000
                  })
                  that.getLists(ticket, 0, 0, 0);
                } else {
                  wx.showToast({
                    title: '取消订单 失败！',
                    duration: 2000
                  })
                }
                // that.setData({
                //   orderList: res.data.orderlist
                // })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }else{
      // 申请退款
      wx.showModal({
        title: '提示',
        content: '您确定要申请退款吗？',
        success: function (res) {
          if (res.confirm) {
            // var key = md5.hexMD5("ticket=" + ticket + "waybillNo=" + waybillNo + "!%&wuliu#$*")
            wx.request({
              url: app.globalData.API_URL + '/pay/refund', //接口地址
              data: {
                ticket: ticket,
                orderNo: waybillNo,
                // key: key
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log(res.data);
                var result = res.data;
                if (result.code == 0) {
                  wx.showModal({
                    title: '提示',
                    content: "成功申请退款！稍后客服会与您联系，请您耐心等候。。。",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {

                      } else if (res.cancel) {

                      }

                    }
                  })
                  that.getLists(ticket, 0, 0, 0);
                } else {
                  wx.showToast({
                    title: '申请退款失败！',
                    duration: 2000
                  })
                }
                // that.setData({
                //   orderList: res.data.orderlist
                // })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }
    
  
      
  },
  //催单
  advise:function(e){
   var waybillNo = e.currentTarget.dataset.waybillno;
   var ticket = app.globalData.ticket;
   var key = md5.hexMD5("ticket=" + ticket + "waybillNo=" + waybillNo + "!%&wuliu#$*")
   wx.request({
     url: app.globalData.API_URL + '/api/fast/order/reminder ', //接口地址
     data: {
       ticket: ticket,
       waybillNo: waybillNo,
       key: key
     },
     header: {
       'content-type': 'application/json'
     },
     method: "GET",
     success: function (res) {
       console.log(res.data);
       var result = res.data;
       if (result.code == 0) {
         if(result.data==true){
           wx.showToast({
             title: '催单 成功！',
             icon: 'success',
             duration: 2000
           })
         }else{
           wx.showModal({
             title: '提示',
             content: "催单失败！半个小时之内只能催单一次",
             showCancel: false,
             success: function (res) {
               if (res.confirm) {

               } else if (res.cancel) {

               }
             }
           })
         }
        
       } else {
         wx.showModal({
           title: '提示',
           content: result.message + "，请重试！",
           showCancel: false,
           success: function (res) {
             if (res.confirm) {

             } else if (res.cancel) {

             }
           }
         }) 
       }
     }, fail:function(){
       wx.showModal({
         title: '提示',
         content: "网络错误，请重试！",
         showCancel: false,
         success: function (res) {
           if (res.confirm) {

           } else if (res.cancel) {

           }
         }
       }) 
     }
   })   
 },
  // 服务评价
  ServiceEvaluation:function(e){
    var waybillNo = e.currentTarget.dataset.waybillno;
    var evaluate = e.currentTarget.dataset.evaluate;
    if (waybillNo || waybillNo != null || evaluate==false){
      wx.navigateTo({
        url: '../serviceEvaluate/serviceEvaluate?waybillNo=' + waybillNo,
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
    } else {
      console.log("服务评价===未拿到运单编号")
    }
  },
  // 投诉
  linkComplaints:function(e){
    var waybillNo = e.currentTarget.dataset.waybillno;
    if (waybillNo || waybillNo != null) {
      wx.navigateTo({
        url: '../../complaints/complaints?waybillNo='+waybillNo,
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
    }else{
      console.log("投诉===未拿到运单编号")
    }
  },
  // 立即支付
  orderAmount:function(e){
    var waybillNo = e.currentTarget.dataset.waybillno;
    var pay = e.currentTarget.dataset.pay;
    var weight = e.currentTarget.dataset.weight;
    var price = e.currentTarget.dataset.price;
    console.log(e)
    // if(weight&&price){
      if (weight == 5) {
        weight = "5公斤以下";
      } else if (weight == 0) {
        weight = "";
        price=""
      } else {
        weight = weight + "公斤";
      }
      if (pay == false&& waybillNo && waybillNo != null ) {
        wx.navigateTo({
          url: '../orderAmount/orderAmount?orderNo=' + waybillNo + "&price=" + price + "&weight=" + weight,
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
      } 
    // }else{
    //   console.log("未拿到价格  与重量！")
    // }
  
  },
  //加载更多
  loadingMore:function(e){ 
    var status = e.currentTarget.dataset.status;
    var ticket = app.globalData.ticket;
    var that=this;
    console.log(status);
    if(status==0){
      // 待取件
      var start0 = that.data.start0;
      if (start0!=-1){
        var pageSize0 = that.data.pageSize0;
        console.log(pageSize0);
        that.setData({
          pageSize0: pageSize0 + 10
        })
        that.getLists(ticket, 0, 0, that.data.pageSize0);
      
      } else {
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    }else if(status==1){
      // 运输中
      var start1 = that.data.start1;
      if (start1 != -1) {
        var pageSize1 = that.data.pageSize1;
        console.log(pageSize1);
        that.setData({
          pageSize1: pageSize1 + 10
        })
        that.getLists(ticket, 1, 0, that.data.pageSize1);
      } else {
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    }else if(status==2){
      // 已签收
      var start2 = that.data.start1;
      if (start2 != -1) {
        var pageSize2 = that.data.pageSize2
        console.log(pageSize2);
        that.setData({
          pageSize2: pageSize2 + 10
        })
        that.getLists(ticket, 2, 0, that.data.pageSize2);
      }else{
        wx.showToast({
          title: '没有数据了！',
          icon: "loading",
          duration: 1500
        })
      }
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  
    var that=this;
    app.getUserInfo(function () {
      var ticket = app.globalData.ticket;
      var pageSize0 = that.data.pageSize0;
      var pageSize1 = that.data.pageSize1;
      var pageSize2 = that.data.pageSize2;
      // getLists(ticket, status, start)
      // 获取待取货的列表
      that.getLists(ticket, 0, 0, pageSize0);
      // 获取待取货的列表
      that.getLists(ticket, 1, 0, pageSize1);
      // 获取待取货的列表
      that.getLists(ticket, 2, 0, pageSize2);
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
    console.log("页面关闭")
  },
  getLists: function (ticket, status, start, pageSize){
    var that=this
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
        for(var i=0;i<result.data.list.length;i++){
          result.data.list[i].createTime = util.formatTime(result.data.list[i].createTime, 'Y/M/D h:m:s');
        }
        if (result.code == 0) {
          if(status==0){
            that.setData({
              start0: result.data.nextStart,
              orderList0: result.data.list
            })
            if (result.data.list.length==0){
              that.setData({
                hidden0:false
              })
            }
          } else if (status == 1){
            that.setData({
              start1: result.data.nextStart,
              orderList1: result.data.list
            })
            if (result.data.list.length == 0) {
              that.setData({
                hidden1: false
              })
            }
          } else if (status == 2){
            that.setData({
              start2: result.data.nextStart,
              orderList2: result.data.list
            })
            if (result.data.list.length == 0) {
              that.setData({
                hidden2: false
              })
            }
          }
         
        } else {
          wx.showLoading({
            title: '加载我的运单 失败！ status='+status,
          });
        }
      }
    })   
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  }
})
