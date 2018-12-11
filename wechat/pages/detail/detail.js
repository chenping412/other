// pages/detail/detail.js
const util = require('../../utils/util.js')
const CryptoJS = require("../../utils/crypto-js.js");
const WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    id:'954',
    // newsId: 'BeEc6Lq_CZgWbb_GIS',
    newsId: 'vcByNMq_V2fZHf_GIS',//大咖id
    userInfo: {},
    newsData:{},
    article:'',

    commentList:[],
    nextPage:1,
    hasNoComment:false,
    noMoreComment:false
  },
  onLoad: function (options) {
    var self = this;

    if (options.newsId) {
      self.setData({
        newsId: options.newsId
      });
      console.log(this.data.newsId)
    }
    if (options.id) {
      self.setData({
        id: options.id
      });
    }
    
    app.login(function () {
      self.data.userInfo = app.globalData.userInfo;
      self.getNewsDetail();
      self.getCommentList(1);
    });
    

    
  },
  //获取新闻详情
  getNewsDetail: function () {
    var self = this;
    wx.showLoading();
    //签名校验
    var createTime = new Date().getTime();
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64)
    
    wx.request({
      url: util.apiHost + '/news/jdetail',
      data: {
        newsId: self.data.newsId,
        id: self.data.id,
      },
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'w_date': createTime,
        'signature': signature,
        'uid': self.data.userInfo.uid
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '0' && res.data.data) {
          res.data.data.time = util.formatTime(res.data.data.time);
          self.setData({
            newsData: res.data.data
          })
          WxParse.wxParse('article', 'html', res.data.data.article , self, 13);

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail:function(res){
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
    if(op == 1){
      self.data.nextPage = 1;
    }

    //签名校验
    var createTime = new Date().getTime();
    var signature = CryptoJS.HmacSHA1(createTime.toString(), self.data.userInfo.token).toString(CryptoJS.enc.Base64);

    wx.request({
      url: util.apiHost + '/news/comment/list',
      data: {
        newsId: self.data.newsId,
        op:op,
        pageNum:self.data.nextPage
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

          if (res.data.data.commentList && res.data.data.commentList.length>0) {
            var arr = [];
            if (op == 0) {
              arr = self.data.commentList.concat(res.data.data.commentList);
            } else {
              arr = res.data.data.commentList.concat(self.data.commentList);
            }
            self.setData({
              commentList: arr
            });
          
            self.data.nextPage = res.data.data.pageNum;
          }else{
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

        }else{
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
    })
  },

  //点击加载更多评论
  tapMoreComment: function () {
    this.getCommentList(0);
  },

  onReachBottom: function () {
    console.log('滚动到底');
    if (!this.data.noMoreComment && !this.data.hasNoComment){
      this.getCommentList(0);
    }
  
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  }

})