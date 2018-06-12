var app = getApp()
Page({
  data: { 
    idImg:null,
    userInfo: {},
    name:null,
    idNumbers:null,
  },
  onLoad:function(e){
    wx.setNavigationBarTitle({
      title: '实名认证',
    });
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(userInfo);
      that.setData({
        userInfo: userInfo
      })
    })
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          idImg: res.tempFilePaths[0],
        })
      }
    })
  },
  nameInputEvent:function(e){
    console.log(e);
    this.setData({
      name: e.detail.value
    })
    
  },
  listenerID:function(e){
    console.log(e);
    this.setData({
      idNumbers: e.detail.value
    })
  },
  submitAuthentication:function(e){

    console.log(this.data);
  }
})