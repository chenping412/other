<template>
  <el-form :model="form" :rules="rule" ref="form" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">机器人商店运营后台</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="form.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="form.pwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item >
      <el-button type="primary" style="width: 100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  export default {
    data() {
      return {
        logining: false,
        form: {
          username: 'lihp',
          pwd: '123456'
        },
        rule: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      login() {
        var self=this;
        this.$refs.form.validate(function(valid) {
          if (valid) {
            self.logining = true;
            self.$http({
              type: 'post',
              url: apiHost + "/auth/login",
              data: {
                "username": self.form.username,
                "pwd": MD5(self.form.pwd)
              },
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              success:function(data){
                self.logining = false;
                if (data.code == "0" && data.data == true) {
                  self.$router.push('/home')
                } else {
                  self.$message({
                    message: '用户名或者密码错误，请重新输入!',
                    type: "error"
                  });
                }
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })

      }
    }
  }

</script>

<style>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  }
  .login-container .title {
    margin: 0px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  .login-container .remember {
    margin: 0px 0px 35px 0px;
  }
</style>
