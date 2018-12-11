//app.js
const util = require('utils/util.js')

App({
  globalData: {
    userInfo: null,
  },
  onLaunch: function () {
    console.log(util.apiHost)
  },
  login:function(success){
    var self=this;
    if (self.globalData.userInfo != null){
      if (success) success();
    }else{
      var uuid = wx.getStorageSync('uuid');
      console.log(uuid)
      if (!uuid || uuid=='') {
        uuid = self.generateUUID();
        wx.setStorageSync('uuid', uuid);
      }
      wx.request({
        url: util.apiHost + '/login/by_visitor',
        data: {
          vid: uuid
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == '0') {
            self.globalData.userInfo = res.data.data;
            if (success) success();
          }
        },
        fail:function(res){
          wx.showToast({
            title: "服务器异常",
            icon: 'none'
          })
        }
      })
    }
  },
  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
})