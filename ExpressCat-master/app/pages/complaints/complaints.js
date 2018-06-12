var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    areaIndex: "",
    area: [
      "送货态度差",
      "快递延迟送货时间",
      "物品被损坏",
      "无法联系到快递员",
      "包装破损",
      "未按规定时间取货"
    ],
    initText: "请选择",
    waybillNo:"",
    sugguest:"",
    toast: "false",
  },
  
  onLoad: function (options) {
    this.setData({
      waybillNo: options.waybillNo
    })
    wx.setNavigationBarTitle({
      title: '意见与投诉',
    });
  }, 
  bindPickerChange: function (e) {
    console.log(e);
    var count = e.detail.value;
    var area = this.data.area;
    this.setData({
      areaIndex: count,
      initText:area[count]
    })
  },
  getSugguests:function(e){
    var sugguest =e.detail.value;
    this.setData({
      sugguest: sugguest
    })
  },
  onShow: function (options) {
    console.log("onShow")
  },
  submitComplaints:function(e){
    // 验证
    var that =this;
    var count = this.data.areaIndex;
    var area = this.data.area;
    var sugguest = this.data.sugguest;
    var waybillNo = this.data.waybillNo;

    if (count == "" || count == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择投诉类型！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    } else if (sugguest == "" || sugguest == undefined){
      that.setData({
        toast: false,
        toastTxt: "请填写意见或备注！"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    }
    wx.request({
      url: app.globalData.API_URL + '/api/advise/add', //接口地址
      data: {
        ticket: app.globalData.ticket,
        waybillNo: waybillNo,
        advise: sugguest,
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
            content: '感谢您的投诉和意见，我们会尽快给您回复！',
            success: function (res) {
              if (res.confirm) {
                // 返回上一个页面
                wx.navigateBack({
                  delta: 1
                })
                //  console.log('用户点击确定')
              } else if (res.cancel) {
                // 返回上一个页面
                wx.navigateBack({
                  delta: 1
                })
                //  console.log('用户点击取消')
              }
            }
          });
        } else {
          wx.showToast({
            title: "投诉或意见 失败！请重试",
            duration: 2000
          })
        }
      }
    })   
  }
})