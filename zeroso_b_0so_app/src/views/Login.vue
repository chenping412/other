<template>
  <div id="login">
    <div class="login-container">
      <h3 class="title">
        <img src="./../assets/images/zeroso_logo.png" style="width:200px;height:74px">
      </h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="0px">
        <el-form-item prop="email">
          <el-input prefix-icon="el-icon-user" v-model="ruleForm.email" @keyup.enter.native="handleSubmit" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="ruleForm.password" @keyup.enter.native="handleSubmit" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="verify_code">
          <el-input prefix-icon="el-icon-key" v-model="ruleForm.verify_code" @keyup.enter.native="handleSubmit" placeholder="请输入验证码" style="width: 320px;"></el-input>
          <el-button class="code-btn" type="danger" :disabled="codeDisabled" :loading="codeLoading" @click="getCode">{{codeText}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" size="default" :loading="loading" @click="handleSubmit">
            {{loading?'登录中':'登录'}}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        Copyright © 2020 零 搜 0so.com All Rights Reserved
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loading: false,
        ruleForm: {
          email: '',
          password: '',
          verify_code:'',
        },
        rules: {
          email: [
            {required: true, message: '请输入账号', trigger: 'submit'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'submit'}
          ],
          verify_code: [
            {required: true, message: '请输入验证码', trigger: 'submit'}
          ]
        },

        codeLoading:false,
        codeText:'获取验证码',
        codeDisabled:true,

      };
    },
    watch:{
      'ruleForm.email'(){
        if(this.ruleForm.email && /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{1,4})$/.test(this.ruleForm.email) && this.ruleForm.password){
          this.codeDisabled = false;
        }else {
          this.codeDisabled = true;
        }
      },'ruleForm.password'(){
        if(this.ruleForm.email && /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{1,4})$/.test(this.ruleForm.email) && this.ruleForm.password){
          this.codeDisabled = false;
        }else {
          this.codeDisabled = true;
        }
      },
    },
    created() {
      let self = this;
      self.getUserInfo();
    },
    methods: {
      //获取用户信息
      getUserInfo() {
        let self = this;
        self.$http({
          url: self.$api.account_login,
          success: function (data) {
            if (data.msg && data.msg.login) {
              self.$router.push('/home');
            }else {
              //未登录时，自动跳转到钉钉扫码登录页面
              self.$utils.goToDingDingLoginPage();
            }
          }
        })
      },


      getCode(){
        let self = this;
        self.codeLoading = true;
        self.codeText= '发送中';
        self.$http({
          url: self.$api.account_get_verify_code,
          data: {
            email: self.ruleForm.email,
            password: self.ruleForm.password
          },
          success(data) {
            self.codeLoading =false;
            if (data && data.err_code.length === 0) {
              self.$message({
                showClose: true,
                message: '验证码发送成功！',
                type: 'success'
              });
              self.codeDisabled = true;
              let m = 60;
              self.codeText= m+'s';
              if(self.timer) clearInterval(self.timer)
              setInterval(()=>{
                m--;
                self.codeText= m+'s';
                if(m<=0){
                  self.codeDisabled = false;
                  self.codeText= '获取验证码';
                }
              },1000)
            } else {
              self.codeText= '获取验证码';
              self.$message({
                showClose: true,
                message: '发送错误',
                type: 'error'
              });
            }
          },
          error(){
            self.codeLoading =false;
            self.codeText= '获取验证码';
            self.$message({
              showClose: true,
              message: '服务器错误',
              type: 'error'
            });
          }
        })
      },

      handleSubmit() {
        let self = this;
        self.$refs.ruleForm.validate(function (valid) {
          if (valid) {
            self.loading = true;
            self.$http({
              url: self.$api.account_login,
              type: 'POST',
              data: {
                email: self.ruleForm.email,
                password: self.ruleForm.password,
                verify_code: self.ruleForm.verify_code.replace(/ /g,''),
              },
              success: function (data) {
                if (data.msg && data.msg.login) {
                  self.loading = false;
                  self.$router.push('/home');
                } else {
                  self.loading = false;
                  self.$message({
                    showClose: true,
                    message: '登录失败！',
                    type: 'error'
                  });
                }
              },
            })

          } else {
            console.log('error submit!!');
          }
        });
      },
    }
  }

</script>

<style lang="scss">
  #login {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #f0f2f5 url(../assets/images/background.png) no-repeat 50%;
    .login-container {
      position: absolute;
      top: 20%;
      left: 50%;
      width: 450px;
      transform: translateX(-50%);
      .title {
        font-size: 28px;
        color: #ffffff;
        font-weight: bolder;
        margin-bottom: 30px;
        text-align: center;
      }
      .el-form {
        .el-form-item{
          margin-bottom: 24px;
        }
        .el-input{
          width: 100%;
        }
        .el-input__inner {
          background-color: #ffffff;
          border: 1px solid #c9cdd6;
          height: 48px;
          padding-left: 40px;
          font-size: 16px;
        }
        .el-input__prefix{
          font-size: 18px;
          left: 10px;
        }
        .code-btn{
          height: 46px;
          width: 120px;
          float: right;
        }
        .el-form-item__error{
          left: 42px;
        }
        .code-btn{
          height: 48px;
          width: 120px;
          float: right;
        }
        .el-form-item__error{
          left: 32px;
        }
        .btn {
          height:48px;
          width: 100%;
        }
      }
    }
  }

  .footer{
     display:flex;
     margin-top:50px;
     justify-content:center;
  }

</style>
