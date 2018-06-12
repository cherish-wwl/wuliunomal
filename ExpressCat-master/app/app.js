//app.js
var md5 = require('utils/md5.js')    
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.ticket != null || that.globalData.ticket) {
      // 用户已登陆
      typeof cb == "function" && cb(this.globalData.ticket)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
              //发起网络请求
              var code = res.code;
              wx.getUserInfo({
                success: function (res) {
                  // 用户授权
                  console.log("调用app.js");
                  console.log(res);
                  that.globalData.userInfo= res.userInfo;
              
                 
                  that.Login(code, res.userInfo);          
                },
                fail: function () {
                  // 调用微信弹窗接口
                  wx.showModal({
                    title: '警告',
                    content: '您点击了拒绝授权，将无法正常使用物來物往的功能体验。请点击右上角“...关于物來物往...设置...用户信息”，或者删除小程序重新进入。',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                }
              })
         
           } else {
             console.log('获取用户登录态失败！' + res.errMsg)
          }

        }, fail:function(res){
          console.log(res)
        }
      })
    }
  },
  Login: function (code, userInfo){ 
   var that = this 
  //  console.log('code=' + code);
    //创建一个dialog
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 10000
    });
  
    //请求服务器
    wx.request({
      url: that.globalData.API_URL +"/api/weixin/getCode",
      data: {
        code: code,
        // key: md5.hexMD5("code=" + code + that.globalData.md5Key)
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        // console.log(res.data.data.status)
        if (res.data.message =="成功"){
          that.globalData.openId = res.data.data.openId;
          if (res.data.data.status == 0) {
            // 绑定手机号
            wx.navigateTo({
              url: '../bindphone/bindphone?new=true',
              success: function (res) {
                // success
              },
              fail: function (res) {
                console.log('跳转到绑定到手机页面失败！' + res.errMsg)
              },
              complete: function () {
                // complete
              }
            })
            return;
          }else{
            //存储用户基础信息 
            that.globalData.userInfo = res.data.data.account;
            // that.globalData.userInfo = that.globalData.userInfoTemp;
            //  console.log(res.data.data.account.ticket)
             that.globalData.ticket = res.data.data.account.ticket;
             that.globalData.bindPhoneNum = res.data.data.account.phone;
          }
          console.log('服务器返回' + res.data);
        }
        wx.hideToast();
      },
      fail: function () {
        // fail
         wx.hideToast();
      },
      complete: function () {
        // complete
      }
    })
  },
  globalData:{
    userInfo:null,
    bindPhoneNum:null,
    // API_URL:"http://101.200.151.26:8080/wuliu",
    // API_URL:"https://api.oglvip.com/wuliu",
    API_URL: "http://123.57.133.62:8280/wuliu",
    ticket: null,
    md5Key:"!%&wuliu#$*",
    openId: null
  }
})
