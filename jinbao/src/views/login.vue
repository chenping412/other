<template>
  <div id='login' @keyup.enter='login'>
    <div class="login-box">
      <div class="title">晶报</div>
      <el-input v-model="username" placeholder="请输入登陆账号"></el-input>
      <el-input v-model="password" type="password" placeholder="请输入登陆密码"></el-input>
      <el-button @click='login'>登陆</el-button>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        var self = this;
        console.log(self.apiHost)
        if (self.username != '' && self.password != '') {
          $.ajax({
            url: self.apiHost + "/manage/user/login",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              username: self.username,
              pwd: self.password,
            },
            success: function (data) {
              if (data.code == 0 && data.data.isLogin == true) {
                self.$router.push("/index")
              }
            }
          })
        } else {
          self.$message({
            message: '账号和密码不能为空',
            type: 'warning',
            showClose: true,
          });
        }
      },
    }
  }
</script>
<style lang='less'>
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
      width: 300px;
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
