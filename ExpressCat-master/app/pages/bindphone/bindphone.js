var app = getApp();
var md5 = require('../../utils/md5.js')   
Page({
  data:{
    second: 60,
    selected: false,
    selected1: true,
    phone:"",//储存手机号
    verifyCode:"",//存储验证码
    newBind:"false",//是否隐藏手机一栏
    verifyOld:"",//旧手机验证是否通过的标志
    verifytype: "",//验证码类型：1-新增/更新手机  2-验证手机 
    toast:true
  },
  // 验证码倒计时
  getphone: function (e) {
    var that=this;
    var phone = that.data.phone;
    // console.log("sadd"+phone);
    // 验证
    if (phone == "" || phone == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请输入手机号！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }
    if (phone.length != 11) {

      that.setData({
        toast: false,
        toastTxt: "手机号长度有误！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      that.setData({
        toast: false,
        toastTxt: "手机号有误！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }

    this.setData({
      selected: true,
      selected1: false,
    });
    countdown(this);
    var gettype = 2; //2.更新手机号
    if (!this.data.newBind) {//新增/
      console.log("新增手机号");
      gettype=0
    }
    // console.log("phone="+phone+"type=" + gettype + app.globalData.md5Key)
    //请求服务器
    wx.request({
      url: app.globalData.API_URL + "/api/account/captcha/create",
      data: {
        phone: phone,
        type: gettype,
        key: md5.hexMD5("phone=" + phone + "type=" +gettype+ app.globalData.md5Key)
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {

        // success
        wx.hideToast();
        console.log(res)
    



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
  onLoad: function (options) {
    var that=this;
    console.log(options);
    if(options.new=="true"){
      // 绑定手机号：不隐藏手机号input框
      that.setData({
        newBind: false
      });
    }else{
      // 修改手机号:隐藏手机号input框
      that.setData({
        newBind: true,
        verifyOld: false,
        phone:options.phone
      });
    }
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  verifyCodeInput: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },
  // 保存、更新手机号
  updatePhone:function(e){
    var that = this;
    console.log(this.data.verifyCode)
    console.log(this.data.phone)
    var verifyCode =that.data.verifyCode;
    var phone = that.data.phone;
    // 验证
    if (phone=="" || phone == undefined) {
       that.setData({
        toast: false,
        toastTxt: "请输入手机号！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }
    if (phone.length != 11) {

      that.setData({
        toast: false,
        toastTxt: "手机号长度有误！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(phone)) {
      that.setData({
        toast: false,
        toastTxt: "手机号有误！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }


   
    if (verifyCode == "" || verifyCode == undefined) {
  
      that.setData({
        toast: false,
        toastTxt: "请输入验证码！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }
    if (!/^[0-9]*$/.test(verifyCode)) {

      that.setData({
        toast: false,
        toastTxt: "请输入正确的验证码！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }


   
    var openid = app.globalData.openId;
        if (!that.data.newBind) {//新增/
          console.log("新增手机号");
          var verifytype=0;
          BindPhone(phone, verifyCode, openid, verifytype);
       
        } else {//更新手机号
          console.log("验证原手机号");
          var verifytype = 2;
          
      
          updataPhone(phone, verifyCode, verifytype);
         
        }
     

   
  
  }
})
// 绑定新手机号
function BindPhone(phone, verifyCode, openid, verifytype){
  var that=this;
  //请求服务器
  wx.request({
    url: app.globalData.API_URL + "/api/account/wxCaptcha/verifyOrRegister",
    data: {
      code: verifyCode,
      phone: phone,
      openId: openid,
      userInfo: app.globalData.userInfo,
      type: verifytype,
      key: md5.hexMD5("code="+verifyCode+"phone=" + phone + "type=" + verifytype + app.globalData.md5Key)
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/json'
    }, // 设置请求的 header
    success: function (res) {
      
      console.log(res)
      if (res.data.code == 0) {//绑定成功
        console.log("绑定成功")
        app.globalData.userInfo = res.data.data;
        wx.setStorage({
          key: "bindPhoneNum",
          data: phone
        })
        app.globalData.bindPhoneNum = res.data.data.phone;
        app.globalData.userInfo.phone = res.data.data.phone;       
        app.globalData.ticket = res.data.data.ticket;
        wx.showModal({
          title: '提示',
          content: "成功绑定手机！",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              })
            }
            
          }
        })
      }else{
        console.log("绑定失败！")
        console.log(res.data.message);
        wx.showModal({
          title: '提示',
          content: res.data.message+"，请重试！",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              
            } else if (res.cancel) {
              
            }

          }
        })
      }
    }, fail: function (e) {
        console.log("绑定手机号失败!")
    }
  })
}

// 更新手机号
function updataPhone(phone, verifyCode, verifytype) {
    var result;
    //请求服务器
    wx.request({
      url: app.globalData.API_URL + "/api/account/captcha/verify",
      data: {
        code: verifyCode,
        phone: phone,
        ticket: app.globalData.ticket,
        type: verifytype,
        key: md5.hexMD5("code=" + verifyCode + "phone=" + phone + "ticket=" +"app.globalData.ticket"+"type=" + verifytype + app.globalData.md5Key)
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        result = res;
        console.log("更新成功")
        console.log(res)
        if (res.data.code == 0) {//更新成功
          app.globalData.userInfo = res.data.data;
          wx.setStorage({
            key: "bindPhoneNum",
            data: phone
          })
          app.globalData.bindPhoneNum = res.data.data.phone;
          app.globalData.userInfo.phone = res.data.data.phone;
          app.globalData.ticket = res.data.data.ticket;
        
          wx.showModal({
            title: '提示',
            content: "成功更新绑定手机！",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 返回上一个页面
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                // 返回上一个页面
                wx.navigateBack({
                  delta: 1
                })
              }

            }
          })
        }else{
          console.log(res.data.message);
          wx.showModal({
            title: '提示',
            content: res.data.message + "，请重试！",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }

            }
          }) 
        }
      }, fail: function (e) {
        console.log("绑定手机号失败!")
      }
    })

}
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}


