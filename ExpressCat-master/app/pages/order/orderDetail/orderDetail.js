// pages/orderDetail/orderDetail.js

// 待接单/待取件页面
// 注：默认是待接单页面
var app=getApp();
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
Page({
  data:{
    orderinfo: {},
    // expressList:[],
    getH: true,// 待取件
    osH: true, // 已签收
    trainH: true,//运输中
    pay:false
  },
  cancelOrder: function (e) {
    var that=this;
    that.setData({
      isCancel:!that.data.isCancel,
      cancelR:that.data.cancelList[0]
    })
  },
  bindChange: function (e) {
    var that=this;
    var val = e.detail.value
    that.setData({
      cancelR: that.data.cancelList[val]
    })
  },
  confirmC:function(e){
    var that=this;
    that.setData({
      isCancel:!that.data.isCancel,
      cancelH:false,
      osH:true,
      ordersH:true,
      getH:true,
      status:"已取消"
    })
    
  },
  close:function(e){
    var that=this;
    that.setData({
      isCancel:!that.data.isCancel
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    var orderwaybillNo = options.waybillNo;
    var pay = options.pay;
    that.setData({
      pay:pay
    })
    
    console.log(orderwaybillNo +"------------orderwaybillNo")
    console.log(options)
    app.getUserInfo(function(){
      var ticket=app.globalData.ticket;
      var key = md5.hexMD5("ticket=" + ticket + "waybillNo=" + orderwaybillNo + "!%&wuliu#$*")
      wx.request({
        url: app.globalData.API_URL +'/api/fast/order/detail', //接口地址
        data: {
          waybillNo: orderwaybillNo,
          ticket: ticket,
          key:key
        },
        header: {
            'content-type': 'application/json'
        },
        method:"GET",
        success: function(res) {
          console.log(res.data)
          if(res.data.code==0){
            res.data.data.pickupTime = util.formatTime(res.data.data.pickupTime, 'Y/M/D h:m:s')
            that.setData({
              orderinfo: res.data.data,
            })
            if (res.data.data.status == 0||res.data.data.status == 1 || res.data.data.status == 2){
              that.setData({
                status: res.data.data.statusDesc,
                getH: false,// 待取件  
              })
            } else if (res.data.data.status == 3){
              that.setData({
                  status: "运输中",
                  trainH: false,//运输中            
              })

            } else if (res.data.data.status == 4){
              that.setData({
                  status: "已签收",
                  osH: false, // 已签收              
              })
            }
          }
        }
      })   
    });
    
  },
  // 取消订单
  cancelOrder: function (e) {
    var that = this;
    var waybillNo = e.currentTarget.dataset.waybillno;
    var pay = e.currentTarget.dataset.pay;
    var ticket = app.globalData.ticket;
    if (pay == false || pay == "false") {
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
                 
                } else {
                  wx.showToast({
                    title: '取消订单 失败！',
                    duration: 2000
                  })
                }
             
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    } else {
      // 申请退款
      wx.showModal({
        title: '提示',
        content: '您确定要申请退款吗？',
        success: function (res) {
          if (res.confirm) {
          
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
                 
                } else {
                  wx.showToast({
                    title: '申请退款失败！',
                    duration: 2000
                  })
                }
               
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
  advise: function (e) {
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
          if (result.data == true) {
            wx.showToast({
              title: '催单 成功！',
              icon: 'success',
              duration: 2000
            })
          } else {
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
      }
    })
  },
  // 服务评价
  ServiceEvaluation: function (e) {
    var waybillNo = e.currentTarget.dataset.waybillno;
    var evaluate = e.currentTarget.dataset.evaluate;
    if (waybillNo || waybillNo != null || evaluate == false) {
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
  linkComplaints: function (e) {
    var waybillNo = e.currentTarget.dataset.waybillno;
    if (waybillNo || waybillNo != null) {
      wx.navigateTo({
        url: '../../complaints/complaints?waybillNo=' + waybillNo,
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
      console.log("投诉===未拿到运单编号")
    }
  },
  // 立即支付
  orderAmount: function (e) {
    var waybillNo = e.currentTarget.dataset.waybillno;
    var pay = this.data.pay;
    var that=this;
    if (waybillNo || waybillNo != null || pay == false) {
      var weight=""
      if (that.data.orderinfo.weight==5){
        weight = "5公斤以下";
      }else if (that.data.orderinfo.weight ==0) {
        weight = "";
        price="";
      }else{
        weight = that.data.orderinfo.weight+"公斤";
      }
      
      wx.navigateTo({
        url: '../orderAmount/orderAmount?orderNo=' + waybillNo + "&price=" + that.data.orderinfo.price+"&weight="+weight,
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
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})