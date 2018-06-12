// pages/address/deliverAddress/deliverAddress.js
var app = getApp();
Page({
  data: {
    addressList:""
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  
  },
  chooseAddress: function (e) {
    var that = this;
    var currentPageS=getCurrentPages()[0].data;
    currentPageS.fromWh=true;
    currentPageS.fromWhC=false;
    var i;

    var addressid = e.currentTarget.dataset.addressid;
    var addressL = that.data.addressList;
    for(i=0;i<addressL.length;i++){
      
      if(addressL[i].id == addressid){
        currentPageS.name=addressL[i].name;
        currentPageS.phone = addressL[i].phone;
        currentPageS.province = addressL[i].provinceName;
        currentPageS.city = addressL[i].cityName;
        currentPageS.county = addressL[i].areaName;
        currentPageS.address = addressL[i].areaDetail;
        currentPageS.addressid = addressL[i].id;
        currentPageS.countyId = addressL[i].areaId;
      }
    }
     wx.navigateBack();
  },
  editDaddress: function (e) {
    var that = this;
    var i;
    var addressid = e.currentTarget.dataset.addressid; 
    var addressL = that.data.addressList;
    for(i=0;i<addressL.length;i++){
      if (addressL[i].id == addressid){
        var userName = addressL[i].name;
        var phone = addressL[i].phone;
        var province = addressL[i].provinceName;
        var city = addressL[i].cityName;
        var county = addressL[i].areaName;
        var countyId = addressL[i].areaId;
        var address = addressL[i].areaDetail;
        var isDefault = addressL[i].isDefault
      }
    }

    app.getUserInfo(
      function () {
            // console.log(that.data.addressList)
          wx.navigateTo({
            url: '../../editAddress/editAddress?addressid=' + addressid + '&isDefault=' + isDefault + '&name=' + userName + '&phone=' + phone + '&areaId=' + countyId + '&address=' + address +'&addressType=1',
            success: function (res) {
              // success

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
  addAddress:function(e){
    app.getUserInfo(function () {
        wx.navigateTo({
          url: '../../addAddress/addAddress?addressType=1',
          success: function(res){
            // success
          //  console.log(res)
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    // console.log("onshow");
    var that = this;
    wx.request({
      url: app.globalData.API_URL + '/api/address/myDetailList',
      data: {
        ticket: app.globalData.ticket,
        type: 0,
        addressType:1
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
            addressList: res.data.data
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})

