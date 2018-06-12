// managerAddress.js
var app = getApp();
Page({
  data: {
    orderList: []
  
  }, 
  onLoad: function (options){
    var that = this;
    that.setData({
      status: options.status
    })
  },
  onShow: function (options) {
    console.log(options);
    var that = this;
    var status = that.data.status;
    if (status==0){
      // 加载寄件人地址列表
      wx.request({
        url: app.globalData.API_URL + '/api/address/myDetailList',
        data: {
          ticket: app.globalData.ticket,
          type: 0,
          addressType: 1
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
              orderList: res.data.data
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
    } else if(status==1){
      // 加载收件人地址列表
      wx.request({
        url: app.globalData.API_URL + '/api/address/myDetailList',
        data: {
          ticket: app.globalData.ticket,
          type: 0,
          addressType: 2
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
              orderList: res.data.data
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
    }
    
  },
  // 点击 编辑
  editDaddress: function (e) {
    var that = this;
    var i;

    var addressid = e.currentTarget.dataset.addid;

    var addressL = that.data.orderList;
    for (i = 0; i < addressL.length; i++) {
      if (addressL[i].id == addressid) {
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
    var url;
    if (that.data.status == 0) {
      url = "../editAddress/editAddress?addressType=1";
    } else {
      url = "../editAddress/editAddress?addressType=2"
    }
    app.getUserInfo(
      function () {
        wx.navigateTo({
          url: url+'&addressid=' + addressid + '&isDefault=' + isDefault + '&name=' + userName + '&phone=' + phone + '&prov=' + province + '&city=' + city + '&area=' + county + '&areaId=' + countyId + '&address=' + address + '',
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
  // 点击删除
  delConfirm: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.addid;
    var orderList = that.data.orderList;
    wx.showModal({
      title: '提示',
      content: "您确定要删除该地址吗",
      success: function (res) {
        if (res.confirm) {
          app.getUserInfo(function () {
            wx.request({
              url: app.globalData.API_URL + '/api/address/delete', //接口地址
              data: {
                ticket: app.globalData.ticket,
                addressId: orderId,
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                // console.log(res.data)
                if (res.data.code != 0) {
                  wx.showModal({
                    title: '提示',
                    content: "删除失败！请重试",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {                      
                      } else if (res.cancel) {
                      }
                    }
                  })
                }else{
                  wx.showToast({
                    title: '删除成功',
                    duration: 1000,
                    success: function () {
                      // wx.redirectTo({
                      //   url: 'managerAddress?status='+that.data.status
                      // })
                      for (var i = 0; i < orderList.length;i++){
                        if (orderList[i].id == orderId){
                          orderList.splice(i,1);
                        }
                      }
                      that.setData({
                        orderList: orderList
                      })
                    }
                  })
                }
             
              }
            })

          })
        } else if (res.cancel) {
          
        }

      }
    })

  },
  // 改变 默认地址
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var orderId = e.detail.value;
    if (!orderId || orderId==""){
        console.log("获取orderid 出错！")
        return;
    }
    var that = this;
    var orderList = that.data.orderList;
    
    var sendData = {};
    app.getUserInfo(function () {
      for (var i = 0; i < orderList.length; i++) {
        if (orderId == orderList[i].id) {
          if (sendData.idDefault == 1) {
            // 当前选中地址已经为默认地址
            return;
          }
          sendData.name = orderList[i].name;
          sendData.phone = orderList[i].phone;
          sendData.areaId = orderList[i].areaId;
          sendData.idDefault = 1;//1：默认地址
          sendData.areaDetail = orderList[i].areaDetail;
          sendData.addressId = orderList[i].id;
        
        }
      }
      sendData.ticket = app.globalData.ticket;
      sendData.addressType = that.data.status;//1:发货地址；0：收货地址
      wx.request({
        url: app.globalData.API_URL + '/api/address/modify', //接口地址
        data: sendData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          // console.log(res.data)
          if (res.data.code == "0") {
            console.log("默认地址修改成功！");
          } else {
            console.log("默认地址修改失败！");
          }

        }
      })


    })
  },
  // 新增地址
  addAddress: function (e) {
    var url;
    if(this.data.status==0){
      url ="../addAddress/addAddress?addressType=1";
    } else{
      url ="../addAddress/addAddress?addressType=2"
    }
    app.getUserInfo(function () {
      wx.navigateTo({
        url: url,
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
})