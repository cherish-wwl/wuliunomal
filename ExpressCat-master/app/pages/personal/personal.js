var app = getApp()
Page({
  data: {
    userInfo: {},
  },
  // 加载页面时加载
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  },
  // 修改个人信息
  modifyPersonInfo:function(){
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
      wx.navigateTo({
        url: '../mine/mine',
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
  onShow: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
    // this.setData({
    //   expressList: []
    // })
   // this.showMyExpress();
  },
  // 关于我们
  showAboutUsMsg:function(e){
    app.getUserInfo(function () {
      wx.navigateTo({
        url: '../about/about',
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
  // 实名认证
  realNameAuthentication:function(e){
    // console.log(e);
    app.getUserInfo(function () {
      wx.navigateTo({
        url: '../authentication/authentication',
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
  // 意见与投诉
  complaintsMsg:function(e){
    // console.log(e);
    app.getUserInfo(function () {
      wx.navigateTo({
        url: '../complaints/complaints',
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
  // 运单详情
  orderDetailView:function(e){
    var that = this;
    app.getUserInfo(function () {
      wx.navigateTo({
        // url: '../order/orderList/orderList',
        url: '../order/orderDetailView/orderDetailView',
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
    // var that = this;
    // app.getUserInfo(function () {
    //       wx.navigateTo({
    //         url: '../order/orderDetailView/orderDetailView',
    //         success: function (res) {
    //           // success
    //           //  console.log(res)
    //         },
    //         fail: function () {
    //           // fail
    //         },
    //         complete: function () {
    //           // complete
    //         }
    //       })
        
    //   })
  
  },
  managerAddress:function(e){
    app.getUserInfo(function () {
      var that = this;
      wx.navigateTo({
        url: '../address/manager/manager',
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
  }  
})