var Base64 = require('../../utils/base64.js').Base64;
var MD5 = require('../../utils/md5.min.js');
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'HAPBZ-6EI36-25XS4-MHFI2-AETBE-IXFB3' // 必填
});
var app = getApp();
Page({
  data: {
    result: {},
    focus: false,
    historySearch: [] ,
    userInfo:{},
    slider: [
      { picUrl: '../../images/index/u31.png' },
      { picUrl: '../../images/index/u33.png' },
      { picUrl: '../../images/index/u35.png' },
    ],
    swiperCurrent: 0,
  },
   swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    app.getUserInfo(function (userInfo) {
      console.log(userInfo);
      console.log(app.globalData.userInfo);   
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })

  }, 
  // 扫码二维码
  scanCode:function(e){
    //扫码
    console.log("扫码");
    wx.scanCode({
      success: function(res){
        console.log(res)
      },fail:function(e){
        console.log("扫码失败！")
      }
    })
    // wx.scanQRCode({
    //   needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    //   scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    //   success: function (res) {
    //     var result = res.resultStr;
    //     alert(result)//有时候弹出，有时候直接跳转
    //   }
    // });
  },
  //跳转到专人直达 
  directDelivery:function(e){
    var that = this;
    app.getUserInfo(function () {
     
          wx.navigateTo({
            url: '../send/send',
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
  //跳转到快递服务窗
  showMap:function(e){
    // wx.showModal({
    //   title: '提示',
    //   content: '请共同期待物流快递开通',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // });
    // var that = this
    // wx.chooseLocation({
    //   success: function (res) {
    //     // console.log(res)
    //     // that.setData({
    //     //   // hasLocation: true,
    //     //   location: formatLocation(res.longitude, res.latitude),
    //     //   locationAddress: res.address
    //     // })
    //   },fail:function(res){

    //   }
    // })
   

    // 调用接口
    demo.getSuggestion({
      keyword: '技术',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  
  },
  // 跳转到我的运单
  myOrderList:function(e){
    var that = this;
    app.getUserInfo(function () {
          wx.navigateTo({
            url: '../order/orderList/orderList' ,
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
  // 跳转到物流快递
  wuliukuaidi:function(e){
    wx.showModal({
      title: '提示',
      content: '为了呈现专业的物流快递服务，我们做好每一个细节。从运输方案设计到物品包装运输我们不负您所托;从小件物品到大件货物我们均为您妥善运输安全送达。因为专业，所以放心。敬请期待......',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  onShow:function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
    // this.showHistory();
  },
  // 手动输入订单号查询
  formSubmit: function (e) {
    let eorder = util.trim(e.detail.value.expressorder);

    if (!eorder) {
      wx.showModal({
        title: '提示',
        content: '快递单号不能为空！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            self.setData({
              focus: true
            })
          }
        }
      })
      return;
    }

    this.searchExpress(eorder);
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})
