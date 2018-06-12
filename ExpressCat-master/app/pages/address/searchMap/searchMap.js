// pages/address/searchMap/searchMap.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var util = require("../../../utils/util.js");
var qqmapsdk;
Page({
  data: {
    resData: [],
    areaIndex: "",
    area: [],
    initText: "北京市",
    searchDataNULL: true,
    showModalStatus:false
  },
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }

    });  
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3'//此处使用你自己申请的key
    });
    this.setData({
      addressType: options.addressType
    })
  },
  onShow: function () {
    var that = this;
    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' // 必填
    });

    // 调用接口
    demo.getCityList({
      success: function (res) {
       
        if (res.status == 0) {
          that.setData({
            area: res.result[0]
          })
        }
      },
      fail: function (res) {
       
      
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  enterSearchWord: function (e) {
    var searchWord = e.detail.value;
    console.log(searchWord);
    if (searchWord == "" || searchWord == null) {
      return;
    }
    var that = this;
    // 腾讯地图调用接口
    qqmapsdk.getSuggestion({
      keyword: that.data.initText + searchWord,
      page_size: 20,
      policy: 1,
      success: function (res) {
        console.log(res);
        var resData = res.data;
        if (resData.length == 0) {
          that.setData({
            searchDataNULL: false,
            resData: []
          })
          return;
        }
        for (var i = 0; i < resData.length; i++) {
          resData[i]._distance = util.formatDistance(resData[i]._distance);//转换一下距离的格式
        }
        that.setData({ resData: resData });
        that.setData({
          searchDataNULL: true,
        })
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          searchDataNULL: false,
          resData: []
        })
      },
      complete: function (res) {
 
  
      }
    })
  },
  navTo:function(e){
    console.log(e);
    var result=e.currentTarget.dataset.item;
    var that = this;
    var currentPageS = getCurrentPages()[0].data;  
    currentPageS.adcode = result.adcode;
    currentPageS.address = result.address;
    currentPageS.province = result.province;
    currentPageS.city = result.city;
    currentPageS.district = result.district;
    currentPageS.title = result.title;
    wx.navigateBack();
 
  },  
  bindChange: function (e) {
    this.showModal();
    this.setData({
      showModalStatus: true,
    })
  },
  chooseArea:function(e){
    var fullname=e.currentTarget.dataset.fullname;
    this.setData({
      initText: fullname
    })
    this.hideModal();
  },
  // 显示遮罩层
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),

    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  // 隐藏遮罩层
  hideModal: function () {

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

})
