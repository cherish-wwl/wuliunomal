var app = getApp()
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../../images/order/normal.png',
    selectedSrc: '../../../images/order/selected.png',
    halfSrc: '../../../images/order/selected.png',
    // halfSrc: '../../../images/order/half.png',
    recipientKey: 0,//收件速度评分
    serviceKey: 0,//服务态度评分
    feeKey: 0,//费用合理评分
    impressionLists: [{ "selected": false, text: "服务态度好" }, 
      { "selected": false, text: "阳光帅气" }, { "selected": false, text: "收件速度快" },
      { "selected": false, text: "认真负责" }, { "selected": false, text: "合理收费" },
      { "selected": false, text: "风一样的汉子" }, { "selected": false, text: "贴心暖男" },
      { "selected": false, text: "微笑一哥" }],//印象列表
    checkedImpression:"",
    toast:"false",
    waybillNo:"",
    commentInfo:""
  },
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      waybillNo: options.waybillNo
    })
  },
  //点击收件速度右边,半颗星
  selectrecipientLeft: function (e) {
    var recipientKey = e.currentTarget.dataset.key
    // if (this.data.recipientKey == 0.5 && e.currentTarget.dataset.key == 0.5) {
    if (this.data.recipientKey == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      recipientKey = 0;
    }
    console.log("收件速度得" + recipientKey + "分")
    this.setData({
      recipientKey: recipientKey
    })

  },
  //点击收件速度左边,整颗星
  selectrecipientRight: function (e) {
    var recipientKey = e.currentTarget.dataset.key
    console.log("收件速度得" + recipientKey + "分")
    this.setData({
      recipientKey: recipientKey
    })
  },
   //点击服务态度右边,半颗星
  selectserviceLeft: function (e) {
    var serviceKey = e.currentTarget.dataset.key
    // if (this.data.serviceKey == 0.5 && e.currentTarget.dataset.key == 0.5) {
    if(this.data.serviceKey == 1 && e.currentTarget.dataset.key == 1){
      //只有一颗星的时候,再次点击,变为0颗
      serviceKey = 0;
    }
    console.log("服务态度得" + serviceKey + "分")
    this.setData({
      serviceKey: serviceKey
    })

  },
  //点击服务态度左边,整颗星
  selectserviceRight: function (e) {
    var serviceKey = e.currentTarget.dataset.key
    console.log("服务态度得" + serviceKey + "分")
    this.setData({
      serviceKey: serviceKey
    })
  },
  //点击费用合理右边,半颗星
  selectFeeLeft: function (e) {
    var feeKey = e.currentTarget.dataset.key
    // if (this.data.feeKey == 0.5 && e.currentTarget.dataset.key == 0.5) {
    if (this.data.feeKey == 1 && e.currentTarget.dataset.key == 1) {
      //只有一颗星的时候,再次点击,变为0颗
      feeKey = 0;
    }
    console.log("费用合理得" + feeKey + "分")
    this.setData({
      feeKey: feeKey
    })

  },
  //点击费用合理左边,整颗星
  selectFeeRight: function (e) {
    var feeKey = e.currentTarget.dataset.key
    console.log("费用合理得" + feeKey + "分")
    this.setData({
      feeKey: feeKey
    })
  },
  // 点击印象列表事件
  chooseImpression:function(e){
    var text = e.currentTarget.dataset.font;
    console.log("选择印象:" + text);
    var impressionData = this.data.impressionLists
    for (var i = 0; i < impressionData.length; i++) {
      if (impressionData[i].text == text) {
        if (impressionData[i].selected == true) {
          impressionData[i].selected = false;
        } else {
          impressionData[i].selected = true;
        }
      }
    }
    this.setData({
      impressionLists: impressionData
    })
  
  },
  // 获取补充内容
  getCommentInfo:function(e){
    console.log(e);
    var commentInfo = e.detail.value;
    this.setData({
      commentInfo: commentInfo
    })
  },
  // 提交服务评价
  confirmServiceEvaluate:function(e){
    console.log("提交服务评价")
    var checkedImpression =[];
    var getcheckedImpression = this.data.impressionLists;
    for(var i=0;i<getcheckedImpression.length;i++){
      if (getcheckedImpression[i].selected == true){
        checkedImpression.push(getcheckedImpression[i].text)
      }
    }
    
    var recipientKey = this.data.recipientKey;
    var serviceKey = this.data.serviceKey;
    var feeKey = this.data.feeKey;
    var commentInfo = this.data.commentInfo;
    var waybillNo = this.data.waybillNo;
    var that=this;
    if (recipientKey == "" || recipientKey == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请为收件速度打分"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    } else if (serviceKey == "" || serviceKey == undefined){
      that.setData({
        toast: false,
        toastTxt: "请为服务态度打分"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return

    } else if (feeKey == "" || feeKey == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请为收费合理打分"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return

    } else if (checkedImpression == "" || checkedImpression == undefined || checkedImpression.length==0) {
      that.setData({
        toast: false,
        toastTxt: "请选择对快递哥的影响"
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
       goods: recipientKey,
       express: serviceKey,
       courier: feeKey,
       impress: checkedImpression.join(","),
       commentInfo: commentInfo
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
           content: '感谢您的评论！',
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
           title: "评论 失败！，请重试",
           duration: 2000
         })
       }
     }
   })   

  }
})
