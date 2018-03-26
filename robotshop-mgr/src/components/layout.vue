<template>
  <div class="layout">
    <div class="header">
      <a class="logo">
        开发者平台
      </a>
      <ul class="userItem clearfix">
        <li class="account">
          <router-link :to="{path: '/user-info'}">账户信息</router-link>
        </li>
        <li class="logout"><a href="javascript:;" @click="logout">退出登录</a></li>
        <!--<li class="logout"><a href="http://192.168.1.108:8090/open-portal/ac/logout">退出登录</a></li>-->
      </ul>
      <span class="divider"></span>
      <ul class="nav">
        <li>
          <a href="../index.html">首页</a>
        </li>
        <li>
          <a href="../product.html">产品服务</a>
        </li>
        <li>
          <a href="../partner.html">成功案例</a>
        </li>
        <li>
          <a href="../contact.html">联系我们</a>
        </li>
      </ul>
    </div>
    <div class="sidebar">
      <ul>
        <li class="dosage">
          <router-link :to="{path: '/'}">API用量</router-link>
        </li>
        <!--<li class="order">-->
        <!--<router-link :to="{path: '/api-order'}">API订单</router-link>-->
        <!--</li>-->
        <li class="key">
          <router-link :to="{path: '/api-key'}">API密钥</router-link>
        </li>
        <!--<li class="list">-->
          <!--<router-link :to="{path: '/api-list'}">API白名单</router-link>-->
        <!--</li>-->
        <li class="introduce">
          <router-link :to="{path: '/api-introduce'}">API介绍</router-link>
        </li>
      </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    data() {
      return {
        apiHost: "",
        activeIndex2: '2',
      };
    },
    created: function () {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://robot.giiso.com"
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      logout() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/open-portal/auth/logout",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (res) {
            if (res.code == 0) {
              location.href = "../index.html"
            }
          }
        })
      }
    }
  }
</script>


<style lang="less" type="text/less">
  .layout {
    width: 100%;
    height: 100%;
    .el-button--primary {
      background-color: #4378e6;
      border-color: #4378E6;
    }
    .header {
      height: 54px;
      line-height: 54px;
      background-color: #fff;
      border-bottom: 1px solid #D9D9D9;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      padding: 0 43px 0 25px;
      .logo {
        display: block;
        float: left;
        height: 54px;
        line-height: 54px;
        padding-left: 85px;
        background: url(../assets/images/giiso-logo.png) left center no-repeat;
      }
      .userItem {
        float: right;
        li {
          float: left;
          a {
            display: block;
            font-size: 14px;
            padding: 0 20px;
            color: #555;
          }
        }
        li.account a {
          background: url(../assets/images/icon-uesr-info.png) left center no-repeat;
        }
        li.logout a {
          background: url(../assets/images/icon-log-out.png) left center no-repeat;
          color: #ff4444;
        }
      }
      .divider {
        display: block;
        width: 1px;
        height: 28px;
        float: right;
        margin-right: 42px;
        background-color: #d8d8d8;
        margin-top: 13px;
      }
      .nav {
        float: right;
        margin-right: 20px;
        li {
          float: left;
          a {
            display: block;
            font-size: 16px;
            color: #111;
            padding: 0 25px;
          }
        }
      }
    }
    .sidebar {
      position: fixed;
      width: 200px;
      min-height: 666px;
      background-color: #3a3d40;
      padding-top: 34px;
      top: 55px;
      bottom: 0;
      left: 0;
      & > ul {
        li {
          a {
            display: block;
            line-height: 50px;
            padding-left: 76px;
            color: #fff;
            font-size: 14px;
          }
        }
        li.dosage a {
          background: url(../assets/images/icon-data.png) 40px center no-repeat;
        }
        li.dosage a.router-link-exact-active {
          background-color: #477EF8;
          color: #fff;
        }
        li.order a {
          background: url(../assets/images/icon-order.png) 40px center no-repeat;
        }
        li.order a.router-link-exact-active {
          background-color: #477EF8;
          color: #fff;
        }
        li.key a {
          background: url(../assets/images/icon-key.png) 40px center no-repeat;
        }
        li.key a.router-link-exact-active {
          background-color: #477EF8;
          color: #fff;
        }
        li.list a {
          background: url(../assets/images/icon-white-list.png) 40px center no-repeat;
        }
        li.list a.router-link-exact-active {
          background-color: #477EF8;
          color: #fff;
        }
        li.introduce a {
          background: url(../assets/images/icon-intro.png) 40px center no-repeat;
        }
        li.introduce a.router-link-exact-active {
          background-color: #477EF8;
          color: #fff;
        }
      }
    }
    .main {
      padding-top: 55px;
      padding-left: 230px;
      padding-right: 30px;
      background-color: #fff;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }

  body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0;
    font-weight: normal;
    font-family: PingFang SC, Hiragino Sans GB, Microsoft Yahei, sans-serif;
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body {
    background-color: #fafafa;
  }

  a {
    text-decoration: none;
    color: #333;
  }

  img {
    border: none;
  }

  ol, ul, li, button {
    list-style: none;
    border: none
  }

  input, button, textarea {
    outline: none;
    font-family: PingFang SC, Hiragino Sans GB, Microsoft Yahei, sans-serif;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    *zoom: 1;
  }
</style>
