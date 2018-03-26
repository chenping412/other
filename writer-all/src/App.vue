<template>
  <div id="app">
    <div class="header">
      <div class="header-content clearfix">
        <div class="logo">
          <router-link :to="{ path: '/' }" tag="a">
            写作机器人
          </router-link>
        </div>
        <div class="user">
          <span>{{username}}</span>
          <div class="logout">
            <router-link :to="{path: '/user'}" tag="p" class="account">账户</router-link>
            <p @click="logout" class="out">退出账号</p>
          </div>
        </div>
      </div>
    </div>
    <div class="shade"></div>
    <div class="main clearfix">
      <router-view/>
    </div>
    <div class="model" v-show="loginState">
      <div class="content">
        <a href="javascript:;">
          <b>!</b>
          登陆过期，请重新登陆。
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery"
  import Clipboard from 'clipboard';

  export default {
    data() {
      return {
        isLogoutShow: false,
        loginState: false,
        username: "",
      }
    },
    created() {
      this.getUserInfo();
    },
    mounted() {
      this.copy();
    },
    methods: {
      //复制
      copy: function () {
        var self = this;
        this.clipboard = new Clipboard('.js-copy');
        //复制成功执行的回调，可选
        this.clipboard.on('success', function (e) {
          if(e.text == "false"){
            self.$alert('请完成文章写作后，再进行一键复制', '提示', {
              type:'warning'
            });
          }else if(e.text == "false-title"){
            self.$alert('请输入标题后，再进行一键复制', '提示', {
              type: 'warning'
            });
          }else if(e.text == "false-author"){
            self.$alert('请输入作者后，再进行一键复制', '提示', {
              type: 'warning'
            });
          }else if(e.text == "false-time"){
            self.$alert('请输入文章时间后，再进行一键复制', '提示', {
              type: 'warning'
            });
          }else if(e.text == "false-content"){
            self.$alert('请输入文章内容后，再进行一键复制', '提示', {
              type: 'warning'
            });
          }else {
            self.$alert('已将文章内容复制到粘贴板', '提示', {
              type:'success'
            });
          }
        });
        //复制失败执行的回调，可选
        this.clipboard.on('error', function (e) {
          self.$alert('复制失败，您的浏览器不支持', '提示', {
            type:'warning'
          });
        });
      },
      //退出
      logout() {
        var self = this;
        $.ajax({
          url: apiHost + "/industry-bulletin//auth/logout",
          type: "POST",
           xhrFields: {
             withCredentials: true
           },
           crossDomain: true,
          data: {},
          success: function (data) {
            if (data.code == 0) {
              location.href = "../login.html"
            }
          }
        })
      },
      //获取用户信息
      getUserInfo() {
        var self = this;
        var timerUser = setTimeout(function () {
          self.loginState = true;
          setTimeout(function () {
            location.href = "../login.html";
            self.loginState = false;
          }, 2000);
        },5000);

        $.ajax({
          url: apiHost + "/industry-bulletin/user/info",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (data) {
            clearTimeout(timerUser);
            if (data.code == 0) {
              self.username = data.data.username
            }
          },
          error: function (XMLHttpRequest) {
            clearTimeout(timerUser);
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "../login.html";
                self.loginState = false;
              }, 2000);
            }
          },
        })
      }
    }
  }
</script>

<style>
  html{
    min-height: 101%;
  }
  body{
    overflow: auto !important;
  }
  .model-white {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 99999999;
  }

  .model-white img {
    display: block;
    width: 32px;
    height: 32px;
    position: absolute;
    left: 50%;
    top: 30%;
    margin-left: -16px;
  }

  .model {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99999999;
  }

  .pagination {
    float: right;
    margin-top: 15px;
    padding-right: 15px;
  }

  .model .content {
    width: 260px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -130px;
    background-color: #fff;
    border-radius: 4px;
  }

  .model .content a {
    display: block;
    text-align: center;
    line-height: 20px;
    margin-top: 20px;
  }

  .model .content a b {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    color: #f44444;
    border: 1px solid #f44444;
    margin-right: 10px;
  }

  .header {
    width: 100%;
    height: 90px;
    /*background: linear-gradient(to right, #0774ea, #54d6de);*/
    background: url('assets/images/header-bj.png') no-repeat center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1100;
  }

  .header .header-content {
    width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }

  .header .header-content .logo {
    float: left;
  }

  .header .header-content a {
    display: block;
    height: 90px;
    line-height: 95px;
    padding-left: 95px;
    background: url("assets/images/logo.png") left center no-repeat;
    color: #ffffff;
    font-size: 22px;
  }

  .header .header-content .user {
    float: right;
    width: 126px;
    height: 40px;
    padding:25px 0 27px 55px;
    background: url("./assets/images/user.png") left center no-repeat;
    position: relative;
    z-index: 999;
    cursor: pointer;
  }

  .header .header-content .user b {
    display: block;
    position: absolute;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 15px;
    background-color: #ff2041;
    color: #fff;
    top: 3px;
    left: 33px;
    font-size: 12px;
    font-weight: normal;

  }

  .header .header-content .user span {
    line-height: 41px;
    color: #fff;
    font-size: 16px;
    display: block;
    padding-right: 30px;
    background: url("./assets/images/arrow.png") right 17px no-repeat;
  }

  .header .header-content .user .logout {
    width: 100%;
    /*height: 54px;*/
    line-height: 54px;
    border: 1px solid #e6e6e6;
    border-top: 0;
    position: absolute;
    top: 90px;
    left: 0;
    background-color: #fff;
    color: #646464;
    font-size: 14px;
    z-index: 999999;
    display: none;
  }
  .header .header-content .user:hover .logout{
    display: block;
  }

  .header .header-content .user .logout p {
    padding-left: 86px;
    background-repeat: no-repeat;
    background-position: 43px center;
    background-size: 21px 22px;
    cursor: pointer;
  }

  .header .header-content .user .logout p.out {
    background-image: url("assets/images/logout.png");
  }

  .header .header-content .user .logout p.account {
    background-image: url("assets/images/account_icon.png");
  }

  .header .header-content .user .logout p:hover {
    background-color: #f1f2f6;
  }

  .shade {
    position: fixed;
    top: 90px;
    left: 0;
    width: 100%;
    height: 15px;
    background-color: #f5f5f5;
    z-index: 1100;
    display: none;
  }

  .main {
    width: 1074px;
    margin-left: auto;
    margin-right: auto;
    /*margin-top: 15px;*/
    /*background-color: #fff;*/
    /*min-height: 650px;*/
    /*box-shadow: 3px 6px 6px #ebebeb;*/
    border-radius: 6px;
    padding-top: 105px;
  }

  .main .top {
    height: 60px;
    padding-left: 52px;
    padding-right: 52px;
    border-bottom: 1px solid #e6e6e6;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    background-color: #fff;
    position: fixed;
    top: 105px;
    width: 970px;
    z-index: 99;
  }

  .main .top-else {
    height: 60px;
    padding-left: 52px;
    padding-right: 52px;
    border-bottom: 1px solid #e6e6e6;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    background-color: #fff;
  }

  .main .top .breadcrumb, .main .top-else .breadcrumb {
    float: left;
    line-height: 60px;
  }

  .main .top .breadcrumb a, .main .top-else .breadcrumb a {
    color: #0874ea;
    font-size: 14px;
    margin-right: 5px;
  }

  .main .top .breadcrumb span, .main .top-else .breadcrumb span {
    color: #131313;
    font-size: 14px;
    margin-right: 5px;
  }

  .main .top h2, .main .top-else h2 {
    font-size: 14px;
    color: #131313;
    line-height: 60px;
    float: left;

  }

  .el-tooltip__popper{
    width: 310px;
  }
  #app .el-loading-mask{
    z-index: 1009;
    background-color: rgba(255,255,255,.7);
  }
</style>
