var app = getApp();
Page({
  data: { 
    userInfo:{},
    nickName:"",
    avatarUrl:"",
    gender:"",
    bindPhoneNum:"",
    toast:true
    },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.profileImageUrl,
        bindPhoneNum: app.globalData.userInfo.phone
      })
    })
  },
  //  修改名称
  changeNickName:function(e){
    this.setData({
      nickName: e.detail.value
    })
  }, 
  changeGender:function(e){
    var that= this;
    wx.showActionSheet({
      itemList: ['男', '女' ],
      success: function (res) {
        console.log(res.tapIndex)
        if(res.tapIndex==0){
          that.setData({
            gender: "男"
          })
        }else{
          that.setData({
            gender: "女"
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onShow: function () {
    // console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.gender==1){
      this.setData({
        gender: "男"
      })
    }else{
      this.setData({
        gender: "女"
      })
    }
    
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
  },
  // 绑定手机
  updataPhoneNum:function(e){
    var that = this;
    
        wx.navigateTo({
          userInfo:{},
          url: '../bindphone/bindphone?new=false&phone=' + that.data.bindPhoneNum,
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
  

  },
  // 保存用户信息
  saveUserInfo:function(e){
    var that = this;
    console.log(this.data.nickName)

    var nickName = that.data.nickName;
    var avatarUrl = that.data.avatarUrl;
    var gender=2;
    if (that.data.gender=="男"){gender=1;}
    
    var bindPhoneNum = that.data.bindPhoneNum;
    // 验证
    if (nickName == "" || nickName == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请输入昵称！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return;
    }
    wx.request({
      url: app.globalData.API_URL + "/api/account/userInfo/modify",
      data: {
        nickName: nickName,
        imgData: avatarUrl,
        gender: gender,
        bindPhoneNum: bindPhoneNum,
        ticket:app.globalData.ticket
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      }, // 设置请求的 header
      success: function (res) {

      }, fail: function (e) {

      }
    })
  }
   


})