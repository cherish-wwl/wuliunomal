// pages/address/editAddress/editAddress.js
var app = getApp();
Page({
  data: {
    isHidden: true,
    provinces: [],
    defaultImg: "../../../../images/switch_close@3x.png",
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    name: "",
    phone: "",
    address: "",
    isDefault: false,
    options: "",
    index: 0
  },
  
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      this.setData({
        defaultType: 1,
      })
    } else {
      this.setData({
        defaultType: 0,
      })
    }
  },
  seeContraband: function (e) {
    wx.navigateTo({
      url: '../../../contraband/contraband',
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
  // 跳转到搜索详细地址页面
  searchMapPage: function (e) {
    wx.navigateTo({
      url: '../searchMap/searchMap?addressType=' + this.data.addressType,
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
  delSendAddress: function (e) {
    this.setData({
      isHidden: false
    })
  },
  delConfirm: function () {
    var that = this;
    app.getUserInfo(function () {
      wx.request({
        url: app.globalData.API_URL + '/api/address/delete', //接口地址
        data: {
          ticket: app.globalData.ticket,
          addressId: that.data.addressId,
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          that.setData({
            isHidden: true
          })
          wx.showToast({
            title: '删除成功',
            duration: 1000,
            success: function () {
              // wx.redirectTo({
              //   url: '../deliverAddress/deliverAddress?openid='+openid
              // })
              wx.navigateBack();
            }
          })
        }
      })

    })
  },
  delCancel: function () {
    this.setData({
      isHidden: true
    })
  },
  onLoad: function (options) {
    
    var address = options.address.split(" ")[0];
    var addedAddress = options.address.split(" ")[1]
    console.log("onLoad")
    console.log(options)
    this.setData({
      addressType: options.addressType,     
      name: options.name,
      phone: options.phone,
      countyId: options.areaId,
      address: address,
      addedAddress: addedAddress,
      defaultType: options.isDefault,
      addressId: options.addressid, 
    })
   
    if (options.isDefault==1){
     this.setData({
       isDefault:true,
     })
    }
 

  },
  onShow: function (options) {
    var that=this;
    var currentPageX = getCurrentPages()[0].data;
    console.log(currentPageX);
    if (currentPageX.adcode!="") {
      that.setData({
        address: currentPageX.address,
        countyId: currentPageX.adcode,
        addedAddress:''
      })
      currentPageX.adcode="";
    }
   
  },
  userNameInput: function (e) {
    this.data.name = e.detail.value;
  },
  phoneInput: function (e) {
    this.data.phone = e.detail.value;
  },
  addressInput: function (e) {
    this.data.addedAddress = e.detail.value;
  },
  saveAddress: function () {
    var that = this;
    app.getUserInfo(function () {
      var userName = that.data.name;
      var phone = that.data.phone;
      var address = that.data.address;
      var addedAddress = that.data.addedAddress
      var countyId = that.data.countyId;
      var defaultType = that.data.defaultType;
      var addressType = that.data.addressType;
      var addressId = that.data.addressId;
      // console.log(address)
      if (userName == "") {
        that.setData({
          toast: false,
          toastTxt: "请输入姓名"
        })
        setTimeout(function () {
          that.setData({
            toast: true,
            toastTxt: ""
          })
        }, 1000)

        return;
      }

      if (phone == "" || phone.length != 11) {
        
        that.setData({
          toast: false,
          toastTxt: "请输入11位手机号码"
        })
        setTimeout(function () {
          that.setData({
            toast: true,
            toastTxt: ""
          })
        }, 1000)

        return;
      }

     

      if (address == "") {

        that.setData({
          toast: false,
          toastTxt: "请选择地址"
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
        url: app.globalData.API_URL + '/api/address/modify', //接口地址
        data: {
          ticket: app.globalData.ticket,
          name: userName,
          phone: phone,
          areaId: countyId,
          idDefault: defaultType,
          areaDetail: address + " "+addedAddress,
          addressId: addressId,
          addressType: addressType
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          // console.log(res.data)
          if (res.data.message == "修改成功") {
            wx.showToast({
              title: '修改成功',
              duration: 1000,
              success: function () {
                // wx.redirectTo({
                //   url: '../deliverAddress/deliverAddress?openid='+openid
                // })
                wx.navigateBack()
              }
            })
          } else {
            wx.showToast({
              title: '操作失败！',
              duration: 1000,
              success: function () {
              }
            })
          }

        }
      })


    })
  },

})