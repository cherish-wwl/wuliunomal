
// pages/orderAmount/orderAmount.js
// 引用pingpp SDK
var pingpp = require('../../../utils/pingpp.js');
var app = getApp();
// 支付页
Page({
  data: {
    toast:true,
    massages:"等待快递员确定",
    confirmMsg:"待确认",
    realFee:"￥ 0.00",
    orderNo:''
  },  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
     console.log(options);
    // console.log(options.length);
    if(options.orderNo.length!=0){   
      this.setData({
        number: options.orderNo,
        price: options.price
      })     
    }
    if (options.price != "") {
      var realFee = this.returnFloat(options.price / 100);
      this.setData({
        confirmMsg: realFee,
        realFee: "￥ " + realFee,
        massages: options.weight
      })
    }  
  
  },
  onReady:function(options){
    // 页面渲染完成
    // console.log(options)
  },
  onShow: function (options){
    // 页面显示
    // console.log(options)
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 支付
  confirmAmount:function(){
    var that=this;
    if (that.data.confirmMsg == "待确认") {
      wx.showModal({
        title: '提示',
        content: '请您与快递员确认物品重量与价格！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return;
    }
   //调用ping++、发起支付
    wx.request({
      // url: app.globalData.API_URL + '/pay/payOrder',
      url: app.globalData.API_URL + '/v2/pay/wechat/prepay',
      data: {
        // ticket: app.globalData.ticket,
        // orderNo: that.data.number
        ticket: app.globalData.ticket,
        orderNo: that.data.number,
        productId:'test_id',
        clientType:'wx_lite'
      },
      async: false,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 0) {
          // 成功
          var charge = res.data.data;
          if(charge){
            wx.requestPayment(
              {
                'appid': charge.appid,
                'timeStamp': charge.timeStamp,
                'nonceStr': charge.nonce_str,
                'package': charge.package,
                'signType': charge.signType,
                'paySign': charge.paySign,
                'success': function (res) { 
                  wx.showLoading({
                    title: '正在传送支付订单中。。。',
                  });
                  //判断是否支付成功
                  wx.request({
                    url: app.globalData.API_URL + '/v2/pay/wechat/callback',
                    data: {
                      ticket: app.globalData.ticket,
                      orderNo: that.data.number
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res)
                      if (res.data.code == 0) {
                        if (res.data.data == true) {
                          // 为true代表此单已支付
                          wx.showModal({
                            title: '提示',
                            content: '支付成功！',
                            showCancel: false,
                            success: function (res) {
                              if (res.confirm) {
                                wx.navigateTo({
                                  url: "../orderList/orderList",
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
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          });
                        } else if (res.data.data == false) {
                          // 为false代表此单未支付
                          that.tenTimesBy3s(10);
                        }
                      } else {
                        wx.hideLoading()
                        wx.showModal({
                          title: '提示',
                          content: '网络错误：请重试！',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              // 返回上一个页面
                              wx.navigateBack({
                                delta: 1
                              })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        });
                        console.log("调用判断是否已经支付接口失败！" + res.data.message)
                      }
                    }
                  }) 

                },
                'fail': function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '支付失败！请重新尝试支付！',
                    success: function (res) {
                    }
                  });
                 },
                'complete': function (res) { 

                }
              })
            // pingpp.createPayment(charge, function (result, err) {
            //   if (result == "success") {
            //     wx.showLoading({
            //       title: '正在传送支付订单中。。。',
            //     });
            //     //判断是否支付成功
            //     wx.request({
            //       url: app.globalData.API_URL + '/pay/verifyPayment',
            //       data: {
            //         ticket: app.globalData.ticket,
            //         orderNo: that.data.number
            //       },
            //       method: 'POST',
            //       header: {
            //         'content-type': 'application/x-www-form-urlencoded'
            //       },
            //       success: function (res) {
            //         console.log(res)
            //         if (res.data.code == 0) {
            //           if (res.data.data == true) {
            //             // 为true代表此单已支付
            //             wx.showModal({
            //               title: '提示',
            //               content: '支付成功！',
            //               showCancel: false,
            //               success: function (res) {
            //                 if (res.confirm) {
            //                   wx.navigateTo({
            //                     url: "../orderList/orderList",
            //                     success: function (res) {
            //                       // success
            //                       //  console.log(res)
            //                     },
            //                     fail: function () {
            //                       // fail
            //                     },
            //                     complete: function () {
            //                       // complete
            //                     }
            //                   })
            //                 } else if (res.cancel) {
            //                   console.log('用户点击取消')
            //                 }
            //               }
            //             });
            //           } else if (res.data.data == false) {
            //             // 为false代表此单未支付
            //             that.tenTimesBy3s(10);
            //           }
            //         } else {
            //           wx.hideLoading()
            //           wx.showModal({
            //             title: '提示',
            //             content: '网络错误：请重试！',
            //             showCancel: false,
            //             success: function (res) {
            //               if (res.confirm) {
            //                 // 返回上一个页面
            //                 wx.navigateBack({
            //                   delta: 1
            //                 })
            //               } else if (res.cancel) {
            //                 console.log('用户点击取消')
            //               }
            //             }
            //           });
            //           console.log("调用判断是否已经支付接口失败！" + res.data.message)
            //         }
            //       }
            //     }) 
               
            //   } else {
            //     wx.showModal({
            //       title: '提示',
            //       content: '支付失败！请重新尝试支付！',
            //       success: function (res) {
            //       }
            //     });
            //     console.log(result + " " + err.msg + " " + err.extra);
            //   }
            // });
          }else{
            console.log("/pay/payOrder:charge为空")
          }        
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
  // 将价格变为两位小数
  returnFloat:function(value){
    var value= Math.round(parseFloat(value) * 100) / 100;
    var xsd= value.toString().split(".");
    if(xsd.length==1) {
      value = value.toString() + ".00";
      return value;
    }
    if(xsd.length>1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
      }
      return value;
    }
  },
  //每3秒调用一次:10次
  tenTimesBy3s: function(times) {
    var time = times;
    var that=this;
    if(time == 0) {
      wx.hideLoading();
      console.log("Time Out...");
      wx.showModal({
        title: '提示',
        content: '支付过程出现问题! 请与管理员联系！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return;
    }
    setTimeout(function () {
      console.log("执行调用verifyPayment" + time + "次");
      //判断是否支付成功
      wx.request({
        url: app.globalData.API_URL + '/pay/verifyPayment',
        data: {
          ticket: app.globalData.ticket,
          orderNo: that.data.number
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            if (res.data.data == true) {
              // 为true代表此单已支付
              wx.showModal({
                title: '提示',
                content: '支付成功！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: "../orderList/orderList",
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
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              });
            } else if (res.data.data == false) {
              // 为false代表此单未支付
              time = time - 1;
              that.tenTimesBy3s(time);
            }
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '网络错误：请重试！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 返回上一个页面
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
            console.log("调用判断是否已经支付接口失败！" + res.data.message)
          }
        }
      })   
   
    }
    , 3000)//每3秒调用一次

  }
})