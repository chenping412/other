<template>
  <div id="header">
    <div class="header">
      <div class="header-inner">
        <div class="logo">
          <dl>
            <dt><h1>全橙智媒 - 大咖平台</h1></dt>
            <dd><h2>我只在乎你</h2></dd>
          </dl>
        </div>
        <div class="logout">
          <el-button @click="logout">登出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {}
    },
    methods: {
      logout() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/user/login_out",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            uid: self.uid,
//            token: self.token,
            token: "84ca274813a44e30a61b6db5cbe5c07a",
            isTest: true,
          },
          success: function (data) {
            if (data.code == 0) {
              self.$router.push("/login");
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              setTimeout(function () {
                self.$router.push("/")
              }, 2000);
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  .header {
    width: 100%;
    height: 90px;
    background-color: skyblue;
    /*border-bottom: 1px solid #ccc;*/
    .header-inner {
      width: 1100px;
      margin-left: auto;
      margin-right: auto;
      .logo {
        float: left;
        dl {
          dt {
            h1 {
              font-size: 20px;
              color: #fff;
              line-height: 30px;
              margin-top: 15px;
            }
          }
          dd {
            h2 {
              font-size: 16px;
              color: #fff;
              line-height: 25px;
            }
          }
        }
      }
      .logout {
        float: right;
        line-height: 80px;
      }
    }
  }
</style>
