//index.js
const util = require('../../utils/util.js')
const CryptoJS = require("../../utils/crypto-js.js");

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    newsList: [],
    lastCreateTime: '0',
    noMoreNews: false
  },
  onLoad: function () {
    var self = this;
    app.login(function () {
      self.data.userInfo = app.globalData.userInfo;
      wx.showLoading();
      self.getListData(1, true);
    });

  },
  onPullDownRefresh: function () {
    console.log('下拉');
    wx.showNavigationBarLoading();
    this.getListData(1);
  },
  onReachBottom: function () {
    console.log('滚动到底');
    wx.showNavigationBarLoading();
    this.getListData(0);
  },

  //获取新闻列表
  getListData: function (op, isFirst) {
    var self = this;
    var lastCreateTime = 0;
    if (op == 0) {
      if (self.data.newsList.length > 0) {
        lastCreateTime = self.data.newsList[self.data.newsList.length - 1].createTime;
      }else{
        lastCreateTime = new Date().getTime();
      }
    }
    self.setData({
      noMoreNews: false
    })

    //签名校验
    var createTime = new Date().getTime();
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64);

    wx.request({
      url: util.apiHost + '/news/wechat/tj/list',
      data: {
        op: op,
        createTime: lastCreateTime
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'w_date': createTime,
        'signature': signature,
        'uid': self.data.userInfo.uid
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == '0' && res.data.data) {
          if (res.data.data.tjList && res.data.data.tjList.length > 0) {
            for (var i = 0; i < res.data.data.tjList.length; i++) {
              res.data.data.tjList[i].time = util.formatTime(res.data.data.tjList[i].time);
              res.data.data.tjList[i].createTime = res.data.data.createTime
            }

            var arr = [];
            if (op == 0) {
              arr = self.data.newsList.concat(res.data.data.tjList);
            } else {
              arr = res.data.data.tjList.concat(self.data.newsList);
            }
            self.setData({
              newsList: arr
            })
            
            wx.setStorageSync('newsList', self.data.newsList.slice(0, 100));
          } else {
            self.setData({
              noMoreNews: true
            });
            
          }
          
          if (isFirst && res.data.data.tjList.length < 10) {
            var newsList = res.data.data.tjList.concat(wx.getStorageSync('newsList'));

            self.setData({
              newsList: newsList
            })
          } else if (self.data.newsList.length < 7) {
            // self.getListData(0);
          }


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        wx.showToast({
          title: "服务器异常",
          icon: 'none'
        })
      }
    })
  },

  //点击叉不感兴趣
  closeNews: function (event) {
    var nid = event.currentTarget.dataset.nid || '';
    console.log(nid);
    var arr = this.data.newsList;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].nid == nid) {
        arr.splice(i, 1);
        break;
      }
    }
    this.setData({
      newsList: arr
    });

    var self = this;
    //签名校验
    var createTime = new Date().getTime();
    console.log(self.data.userInfo.token, createTime.toString());
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64)
    console.log(signature);

    wx.request({
      url: util.apiHost + '/news/uninterested',
      data: {
        newsId: nid
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'w_date': createTime,
        'signature': signature,
        'uid': self.data.userInfo.uid
      },
      success: function (res) {

      }
    })


  },

  //图片加载失败时
  imgError: function (event) {
    var nid = event.currentTarget.dataset.nid;
    console.log(nid);
    if (nid) {
      var arr = this.data.newsList
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].nid == nid) {
          arr[i].hide = true;
          this.setData({
            newsList: arr
          })
        }
      }
    }

  },

  //打开详情页
  openDetail: function (event) {
    var mediatype = event.currentTarget.dataset.mediatype || 1;
    var url = event.currentTarget.dataset.url || '';
    var search = url.split("?")[1] || '';
    if (mediatype == '2') {
      wx.navigateTo({
        url: '/pages/video/video?' + search
      })
    } else {
      wx.navigateTo({
        url: '/pages/detail/detail?' + search
      })
    }

  },

  onShareAppMessage: function () {
    // return custom share data when user share.
  }
})
