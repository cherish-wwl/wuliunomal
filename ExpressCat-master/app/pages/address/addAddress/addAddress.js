// pages/address/addAddress/addAddress.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultSize: "default",
    loading: false,
    plain: false,
    disabled: false,
    defaultImg: "../../../../images/switch_close@3x.png",
    defaultType: 0,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',

    condition: false,

    userName: "",
    phone: "",
    address: "",

    toast: true,
    detailAddress:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    console.log(options);
    this.setData({
      addressType: options.addressType
    })
  },
  // 是否默认
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
      url: '../../contraband/contraband',
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
    var that=this;
    wx.navigateTo({
      url: '../searchMap/searchMap?addressType=' + this.data.addressType ,
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
  userNameInput: function (e) {
    this.data.userName = e.detail.value;
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
      var userName = that.data.userName;
      var phone = that.data.phone;
      // var province = that.data.province;
      // var city = that.data.city;
      // var county = that.data.county;
      var address = that.data.address;
      var countyId = that.data.countyId;
      var defaultType = that.data.defaultType;
      var addedAddress = that.data.addedAddress
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
          toastTxt: "请填写详细地址"
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
        url: app.globalData.API_URL + '/api/address/add', //接口地址
        data: {
          ticket: app.globalData.ticket,
          name: userName,
          phone: phone,
          areaId: countyId,
          idDefault: defaultType,
          areaDetail: address +" "+addedAddress,   
          addressType: that.data.addressType
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          // console.log(res.data)
          if (res.data.message == "添加成功") {
            wx.showToast({
              title: '创建成功',
              duration: 1000,
              success: function () {
                var currentPageS = getCurrentPages()[0].data;
                currentPageS.fromWh = true;
                currentPageS.fromWhC = false;
                currentPageS.name = userName;
                currentPageS.phone = phone;
                currentPageS.address = address;
                currentPageS.countyId = countyId;
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
  onShow: function (options) {
    console.log("onShow");

    console.log(this.data.addressType);
    var that=this;
    // 显示选择的寄件地址
    var currentPageX = getCurrentPages()[0].data;
    if (currentPageX.adcode != "") {
      that.setData({
        address: currentPageX.address,
        countyId: currentPageX.adcode
      })
      currentPageX.adcode = "";
    }
  },

 
})