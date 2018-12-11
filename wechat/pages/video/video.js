// pages/video/video.js
const util = require('../../utils/util.js')
const CryptoJS = require("../../utils/crypto-js.js");

//获取应用实例
const app = getApp()

Page({
  data: {
    id: '18',
    videoId: '50cb251ca61442d3a155eebd83872d53',
    dakaId:'27',
    userInfo: {},
    info:{
      title:'',
      headImgUrl:'',
      nickName:'',
      time:'',
      videoUrl: 'http://dev-news.giiso.com/wap/sample/video/ABCABC.mp4',
      // videoUrl:''
    },
    commentList: [],
    nextPage: 1,
    hasNoComment: false,
    noMoreComment: false,
    loading: true
  },
  onLoad: function (options) {
    var self = this;

    if (options.id) {
      self.setData({
        id: options.id
      });
    }

    app.login(function () {
      self.data.userInfo = app.globalData.userInfo;
      console.log(self.data.id, self.data.newsId, self.data.userInfo);
      self.getNewsDetail();
      self.getCommentList(1);
    });

  },

  //获取视频详情
  getNewsDetail: function () {
    var self = this;
    self.setData({
      loading:true
    })
    wx.showLoading();
    //签名校验
    var createTime = new Date().getTime();
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64)

    wx.request({
      // url: 'http://172.16.25.12:9091/quanc-daka/daka/video/get_play_info',
      url:util.apiHost+'/news/video/detail',
      data: {
        channelId:'0',
        id: self.data.id,
        videoId: self.data.videoId,
        dakaId: self.data.dakaId
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'w_date': createTime,
        'signature': signature,
        'uid': self.data.userInfo.uid
      },
      success: function (res) {
        self.setData({
          loading: false
        })
        wx.hideLoading();
        if (res.data.code == '0' && res.data.data) {
          self.setData({
            info:{
              title: res.data.data.videoMeta.title,
              headImgUrl: res.data.data.headImgUrl,
              nickName: res.data.data.nickName,
              time: '',
              videoUrl: res.data.data.videoUrl
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: "服务器异常",
          icon: 'none'
        })
      }
    })
  },
  
  //获取评论列表
  getCommentList: function (op) {
    var self = this;
    if (op == 1) {
      self.data.nextPage = 1;
    }

    //签名校验
    var createTime = new Date().getTime();
    console.log(op,self.data.userInfo.token, createTime.toString());
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64)
    console.log(signature);

    wx.request({
      url: util.apiHost + '/news/video/comment/list',
      data: {
        id: parseFloat(self.data.videoId),
        op: op,
        pageNum: self.data.nextPage
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'w_date': createTime,
        'signature': signature,
        'uid': self.data.userInfo.uid
      },
      success: function (res) {
        if (res.data.code == '0' && res.data.data) {

          if (res.data.data.videoCommentList && res.data.data.videoCommentList.length > 0) {
            var arr = [];
            if (op == 0) {
              arr = self.data.commentList.concat(res.data.data.videoCommentList);
            } else {
              arr = res.data.data.videoCommentList.concat(self.data.commentList);
            }
            self.setData({
              commentList: arr
            });

            self.data.nextPage = res.data.data.pageNum;
          } else {
            if (op == 0) {
              self.setData({
                noMoreComment: true
              })
            } else {
              self.setData({
                hasNoComment: true
              })
            }
          }

        }
      }
    })
  },

  //点击加载更多评论
  tapMoreComment: function () {
    this.getCommentList(0);
  },

  onReachBottom: function () {
    console.log('滚动到底');
    if (!this.data.noMoreComment && !this.data.hasNoComment) {
      this.getCommentList(0);
    }

  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  }

})