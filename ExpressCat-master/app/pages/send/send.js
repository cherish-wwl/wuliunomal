//index.js
var util = require('../../utils/util.js');
// 引用MD5加密
var md5 = require('../../utils/md5.js');
// 引用pingpp SDK
var pingpp = require('../../utils/pingpp.js');

var app = getApp();
Page({
  data: {
    dates: [
      "今天","明天","后天"
    ],
    chooseData:"",
    index2:0,
    datesDefault:"今天",
    timesDefault:"现在",
    // 寄件件数
    // input默认是1  
    // 寄件数量
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    times: [],
    timesQuan: [
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "24:00",
    ],
    
    nowTimes:[],
    controllTextarea:false,
    textareafocus:false,
    textareahidden:false,
    defaultTextarea:"给快递小哥说句话",
    showWeightModalStatus:false,
    initWeightText: "",
    initWeightidText: "",
    initWeightText2: "",
    showTypeModalStatus:false,
    initTypeText: "",
    initTypeidText:"",
    initTypeText2: "",
    currentChooseType:"文件票据",
    goodsType: [],
    goodsWeight: [
      "5公斤以下",
      "朕不知道"
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    isTime: false,
    date: "今天",
    time: "立即下单",
    chooseTime:"",

    fromWh: false,
    fromWhC: true,
    toWh: false,
    toWhC: true,
    expressName: "请选择",
    arr:"",
    toast:true,
    toastTxt:"",
    estimatefee:"￥13.00",
    feeH:true,
    hasContext:false,
    timeValues:[0,0],
    timeValue: [0,0],
    thingname:" ",
    other:" ",
  },
  onUnload: function () {
    console.log("dfadsfasd")
  },
  // 控制textarea
  controllTextarea:function(e){
    this.setData({
      controllTextarea: true,
      textareafocus: true,
      textareahidden: false
    })
  },
  changeAreatext:function(e){
    var text = e.detail.value;
    this.setData({
      defaultTextarea: text
    })
  },
  // textarea失去焦点事件；
  lostFocus:function(e){
    console.log(e.detail.value);
    var that = this;
    var text = e.detail.value;
    var   hasContext=true;
   
    if(text==null||text==""){
      text ="给快递小哥说句话";
      hasContext=false;
    }
    that.setData({
      controllTextarea: false,
      textareafocus: false,
      textareahidden: true,
      hasContext: hasContext,
      defaultTextarea:text
    })
  },
  // 预估重量
  bindWeightChange: function (e) {
    this.showModal();
    this.setData({
      showWeightModalStatus: true,
    })
  },
  chooseWeight:function(e){
    var text = e.currentTarget.dataset.weightvalue;
    console.log("选择重量:" + text);
    this.setData({
      initWeightText2: text,
    })
  },
  confirmWeight: function (e) {
    var text = this.data.initWeightText2;
    this.hideModal();
    this.setData({
      initWeightText: text,
    })
  },
  // 寄件类型
  bindTypeChange: function (e) {
    this.showModal();
    this.setData({
      showTypeModalStatus: true,
    })
  },
  chooseType: function (e) {
    console.log(e);
    var text = e.currentTarget.dataset.typevalue.name;
    var textid = e.currentTarget.dataset.typevalue.id;
    // console.log("选择类型:" + text);
    // console.log("选择类型id :" +textid);
    var typeData = this.data.goodsType
    for(var i=0;i<typeData.length;i++){
      if(typeData[i].id==textid){
        typeData[i].isActive=true;
      }else{
        typeData[i].isActive = false;
      }
    }
    this.setData({
      initTypeText2: text,
      initTypeidText: textid,
      goodsType:typeData,
    })
  },
  confirmType: function (e) {
    var text = this.data.initTypeText2;
    this.hideModal();
    this.setData({
      initTypeText: text,
    })
  },
  // 预约上门时间
  bindTimeChange:function(e){
   
    // 显示弹出框
    this.showModal();
    this.setData({
      isTime: true,
    })
  },
  bindTChange:function(e){
    console.log(e);
    var val = e.detail.value;
    var t = this.data.timeValues;
    var index;
    if (val[0] != t[0]) {
      // 日期变了
      //1. 若选择今天
      if(val[0]==0){
        // 加载时间
        this.loadingNowTime();
      }else{
        var timesQuan = this.data.timesQuan;
        this.setData({ 
          times: timesQuan
        })
      }
      // 2.存储 data 和time  
      index = val[0];
      console.log('日期变了');
      // console.log(this.data.dates)
      // console.log(this.data.dates[index])
      this.setData({
        chooseData: this.data.dates[index],
        date: this.data.dates[index],
        timeValues: val,
        timeValue: [val[0], 0]
      })
      return;
    }
    if (val[1] != t[1]) {
      // 时间变了
      index = val[1];
      console.log('时间变了');
      // console.log(this.data.times)
      // console.log(this.data.times[index])
      this.setData({
        chooseTime: this.data.times[index],
        time: this.data.times[index],
        timeValues: val,
        timeValue: [val[0], val[1]]
      })
      return;
    }
  },
  loadingNowTime:function(e){
    var getNowTime = new Date(Date.now());
    // console.log(getNowTime.getHours());
    var nowHour = getNowTime.getHours()+1
    var newTimes=["立即下单"];
    for (var i = nowHour;i<25;i++){
      newTimes.push(i+":00")
    }
    // console.log(newTimes);
    
    this.setData({
      nowTimes:newTimes,
      times: newTimes
    })
  },
  // 确定期望上门时间
  confirmTime: function (e) {
    // 显示弹出框
    this.hideModal();
    this.setData({
      isTime: false,
    })
  },

  //跳转到发货人地址页面
  sendAddress: function (e) {
    var that = this;
    app.getUserInfo(function () {    
      wx.navigateTo({
        url: '../address/deliver/deliverAddress/deliverAddress' ,
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
  //跳转到收货人地址页面
  receiverAddress: function (e) {
    var that = this;
    // console.log(addressid1)
    app.getUserInfo(function () {
      wx.navigateTo({
        url: '../address/receiver/receiverAddress/receiverAddress',
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
  //跳转到 发货人的新增地址页面
  fromW: function (e) {
    wx.navigateTo({
      url: '../address/addAddress/addAddress?addressType=1',
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
  //跳转到 收货人的新增地址页面
  toW: function (e) {
    wx.navigateTo({
      url: '../address/addAddress/addAddress?addressType=2',
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
  // 进入页面时加载。。。
  onLoad: function (options) {
    console.log(options);
   
  },
  //  显示页面时加载
  onShow: function () {
    console.log("onShow")
    var that = this;
    that.setData({
      textareahidden:true
    })
    wx.request({
      url: app.globalData.API_URL + '/api/express/goods/type',
      data: {
        ticket: app.globalData.ticket
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code ==0){
          var typeData=res.data.data;
           for(var i=0;i<typeData.length;i++){
              typeData[i].isActive=false;
           }
          that.setData({
            goodsType: typeData
          })
        }
      }
    })

    
    // 显示选择的寄件地址
    var currentPageX = getCurrentPages()[0].data;
    if (currentPageX.name) {
      // 后选中的
      that.setData({
        fromWh: currentPageX.fromWh,
        fromWhC: currentPageX.fromWhC,
        name: currentPageX.name,
        phone: currentPageX.phone,
        province: currentPageX.province,
        city: currentPageX.city,
        county: currentPageX.county,
        address: currentPageX.address,
        senderAreaId: currentPageX.countyId,
        
      })
      // return;
    }else{
      // 加载默认寄件地址 addressType:1
      wx.request({
        url: app.globalData.API_URL + '/api/address/myDetailList',
        data: {
          ticket: app.globalData.ticket,
          type: 1,
          addressType: 1
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);

          if (res.data.message == "获取成功") {
            if (res.data.data.length == 0) {
              return;
            }
            that.setData({
              fromWh: true,
              fromWhC: false,
              name: res.data.data[0].name,
              phone: res.data.data[0].phone,
              province: res.data.data[0].provinceName,
              city: res.data.data[0].cityName,
              county: res.data.data[0].areaName,
              address: res.data.data[0].areaDetail,
              senderAreaId: res.data.data[0].areaId,
              addressId: res.data.data[0].id
            })
          }

        }

      })

    }

   
   

    // 显示选择的收件地址
    if (currentPageX.name2) {
      // 后选中的
      that.setData({
        toWh: currentPageX.toWh,
        toWhC: currentPageX.toWhC,
        name2: currentPageX.name2,
        phone2: currentPageX.phone2,
        province2: currentPageX.province2,
        city2: currentPageX.city2,
        county2: currentPageX.county2,
        address2: currentPageX.address2,
        receiverAreaId: currentPageX.countyId2,
        expressName: currentPageX.expressName
      })
      // return;
    }else{
      // 加载默认收件地址 addressType:2
      wx.request({
        url: app.globalData.API_URL + '/api/address/myDetailList',
        data: {
          ticket: app.globalData.ticket,
          type: 1,
          addressType: 2
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);

          if (res.data.message == "获取成功") {
            if (res.data.data.length == 0) {
              return;
            }
            that.setData({
              toWh: true,
              toWhC: false,
              name2: res.data.data[0].name,
              phone2: res.data.data[0].phone,
              province2: res.data.data[0].provinceName,
              city2: res.data.data[0].cityName,
              county2: res.data.data[0].areaName,
              address2: res.data.data[0].areaDetail,
              receiverAreaId: res.data.data[0].areaId,
              addressId2: res.data.data[0].id
            })
          }

        }

      })
    }
    
 

    // 加载时间
    this.loadingNowTime();
    
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
      // showWeightModalStatus: true,

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
        showWeightModalStatus: false,
        isTime: false,
        showTypeModalStatus: false
      })
    }.bind(this), 200)
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 获取物品名称
  expressTap:function(e){
    var thingname = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      thingname: thingname
    });
     console.log(this.data.thingname);
  },
  // 转换为正式的时间格式
  getRealTime:function(data,time){
    var realdate;
    var realTime=time;
    var dd = new Date();
    if(data=="今天"){
      dd.setDate(dd.getDate() + 0);//获取AddDayCount天后的日期 
    }
    if (data == "明天") {
      dd.setDate(dd.getDate() + 1);//获取AddDayCount天后的日期 
    }
    if (data == "后天") {
      dd.setDate(dd.getDate() + 2);//获取AddDayCount天后的日期 
    }
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();
    realdate = y + "-" + m + "-" + d; 

    if (time == "立即下单") {
      realTime= dd.getHours()+":"+dd.getMinutes();
    }
    return realdate+" "+realTime;
  },
  // 确定下单
  confirmOrder: function (e) {
    console.log("确认下单")
    var that = this;
  
   
    // 发件人地址
    var senderName = that.data.name;
    var senderPhone = that.data.phone;
    var senderAddress = that.data.province + that.data.city + that.data.county + that.data.address;
    
    //收件人地址
    var receiverName = that.data.name2;
    var receiverPhone = that.data.phone2;
    var receiverAddress = that.data.province2 + that.data.city2 + that.data.county2 + that.data.address2;

    // var expectTim = that.data.date + that.data.time;
    // 哪一天+时间
    var expectTim =that.getRealTime(that.data.date,that.data.time);
    //寄件件数
    var count=that.data.num;
    // var express = that.data.expressName;
    // 寄件类型id和名称
    var goodstyp = that.data.initTypeText;
    var goodstypid= that.data.initTypeidText;
    // 预估重量
    var weight = that.data.initWeightText;
    console.log(weight);
    //备注
    var other = that.data.defaultTextarea;
    // 物品名称
    var thingname = that.data.thingname;
    if (senderName == undefined || senderPhone == undefined || senderAddress == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择发件地址"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    } else if (receiverName == undefined || receiverPhone == undefined || receiverAddress == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择收件地址"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    } else if (weight == "" || weight == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择预估重量"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    } else if (goodstypid == "" || goodstypid == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择寄件类型"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    }  else if (expectTim == "" || expectTim == undefined) {
      that.setData({
        toast: false,
        toastTxt: "请选择预约取货时间"
      })
      setTimeout(function () {
        that.setData({
          toast: true,
          toastTxt: ""
        })
      }, 1000)
      return
    }else {
      that.setData({
        feeH: false
      })
    }
    if (!(parseInt(count, 10) === count)){
        that.setData({
          toast: false,
          toastTxt: "请输入正确的寄件件数"
        })
        this.setData({
          num: 1
        });
        setTimeout(function () {
          that.setData({
            toast: true,
            toastTxt: ""
          })
        }, 1000)
        return;
    }
    console.log(weight);
    var paynow;
    // var goodsPrice=0;
    if(weight=="5公斤以下"){
      weight = 5;
      paynow=true;
      // goodsPrice=2500;
    }else{
      weight=0;
      paynow = false;
    }
    if (other == "给快递小哥说句话") {
      other = "";
    }
    console.log("开始下单");
    var receiverAreaId = that.data.receiverAreaId;
    var senderAreaId = that.data.senderAreaId;
    var keyConcent = "goodsName=" + thingname + "goodsNum=" + count+"goodsTypeId=" + goodstypid +
      "insurePrice=0" + "isInsure=0" + "pickupTime=" + expectTim+ "receiverAddress=" + receiverAddress +
      "receiverAreaId=" + receiverAreaId+"receiverLatitude=0" +"receiverLongitude=0"+
      "receiverName=" + receiverName + "receiverPhone=" + receiverPhone + "remark="+other+
      "senderAddress=" + senderAddress + "senderAreaId=" + senderAreaId+"senderLatitude=0"+
      "senderLongitude=0" + "senderName=" + senderName + "senderPhone=" + senderPhone + "ticket=" + app.globalData.ticket+
      "weight=" + weight + app.globalData.md5Key;
    console.log(keyConcent);
    app.getUserInfo(function () {
          wx.request({
            url: app.globalData.API_URL + '/api/fast/order/add',
            data: {
              ticket: app.globalData.ticket,
              //userId:"",   
              senderName: senderName,     
              senderPhone: senderPhone,   
              senderAddress: senderAddress,   
              senderAreaId: senderAreaId,
              // senderLongitude:0,   
              // senderLatitude:0,    

              receiverName: receiverName,   
              receiverPhone: receiverPhone,   
              receiverAddress: receiverAddress,  
              receiverAreaId: receiverAreaId, 
              // receiverLongitude: 0,  
              // receiverLatitude: 0,    

              pickupTime: expectTim,   
              goodsTypeId: goodstypid,   

              isInsure: 0,   
              insurePrice: 0,


              weight: weight,   
              goodsName: thingname,    
              goodsNum: count,  
              // goodsPrice: goodsPrice,

              remark: other,   

              key: md5.hexMD5(keyConcent) ,
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // success
              console.log(res);
              var result=res.data;
              if(result.code==0){
                // 下单成功
                if (paynow){
                  // 五公斤一下立即跳转到支付页面
                  app.getUserInfo(function () {
                    wx.navigateTo({
                      url: "../order/orderAmount/orderAmount?ticket="+app.globalData.ticket+"&orderNo="+result.data.waybillNo+"&price="+result.data.price+"&weight=5公斤以下",
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
                
                }else{
                  // 不知道重量的  给提示
                  wx.showModal({
                    title: '提示',
                    content: '下单成功！稍后快递员会与您联系，请确保手机联系畅通。',
                    showCancel: false,
                    success: function (res) {
                      //  console.log(res)
                      if (res.confirm) {
                        wx.navigateTo({
                          url: "../order/orderList/orderList",
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
                        wx.navigateTo({
                          url: "../order/orderList/orderList",
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
                      }      
                    }
                  });
                }

              }else{
                // 下单失败

              }
              // wx.navigateTo({
              //   url: '../order/orderList/orderList?openid=' + openid,
              //   success: function (res) {
              //     // success
              //   },
              //   fail: function () {
              //     // fail
              //   },
              //   complete: function () {
              //     // complete
              //   }
              // })
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
