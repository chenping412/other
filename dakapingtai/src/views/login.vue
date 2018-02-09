<template>
  <div id='login' @keyup.enter='login'>
    <div class="login-box">
      <el-row>
        <el-col :span="24">
          <div class="title">全橙智媒 - 大咖平台</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input v-model="mobile" placeholder="请输入手机号账号"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-input v-model="checkCode" placeholder="请输入验证码"></el-input>

        </el-col>
        <el-col :span="10">
          <el-button type="parimary" @click="getAuthCode">获取验证码</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button @click='login'>登陆</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        mobile: '',
        checkCode: ''
      }
    },
    methods: {
      //获取验证码
      getAuthCode() {
        var self = this;
        $.ajax({
          url: self.apiHost + "",
          type: "post",
          data: {},
          sucess: function () {

          },
          error: function () {

          }
        })
      },
      //登录
      login() {
        var self = this;
        if (self.mobile == '' || self.checkCode == '') {
          self.$message({
            message: '账号和密码不能为空',
            type: 'warning',
            showClose: true,
          });
          return;
        }
        $.ajax({
          url: self.apiHost + "/daka/user/login",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            mobile: self.mobile,
            checkCode: self.checkCode,
          },
          success: function (data) {
            if (data.code == 0) {
              localStorage.userInfo = JSON.stringify({
                uid: data.data.uid,
                token: data.data.token,
              })
              self.$router.push("/index")
            }
          },
          error: function () {

          }
        })
      }
    },
  }
</script>
<style lang='scss'>
  #login {
    width: 100%;
    height: 100%;
    background: #2f4d69;
  }

  .login-box {
    width: 300px;
    margin: auto;
    text-align: center;
    position: absolute;
    top: 25%;
    bottom: 0;
    left: 0;
    right: 0;
    .title {
      font-size: 28px;
      color: #ffffff;
      margin-bottom: 25px;
    }
    .el-input {
      height: 40px;
      /*width: 300px;*/
      margin-bottom: 10px;
    }
    .el-input input {
      height: 40px;
    }
    .el-button--default {
      width: 300px;
      height: 40px;
      margin-top: 10px;
      background-color: #619ac5;
      border: 0;
      color: #ffffff;
      box-shadow: 0 0 3px #333;
      font-size: 16px;
      letter-spacing: 8px;
    }

  }
</style>
