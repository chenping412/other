<template>
  <div id="user">
    <div class="top">
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">功能类别</router-link>
        &gt;
        <span>个人信息</span>
      </div>
    </div>
    <div class="user-content">
      <ul>
        <li>
          <div class="li-left">账号</div>
          <div class="li-right">{{username}}</div>
        </li>
        <li>
          <div class="li-left">绑定手机号</div>
          <div class="li-right"></div>
        </li>
        <li>
          <div class="li-left">登录密码</div>
          <div class="li-right">
            ******
            <button @click="openModel">修改</button>
          </div>
        </li>
      </ul>
    </div>
    <el-dialog title="修改密码" :visible.sync="resetPassModelVisible" width="350px">
      <el-form :model="resetForm" ref="resetForm" :rules="resetFormRule" status-icon>
        <el-form-item prop="oldPassword">
          <el-input v-model="resetForm.oldPassword" auto-complete="off" size="small" placeholder="登录密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input v-model="resetForm.newPassword" auto-complete="off" size="small" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="resetForm.confirmPassword" auto-complete="off" size="small" placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button type="button" @click="resetPassModelVisible = false" class="btn left">取 消</button>
        <button type="button" @click="reset('resetForm')" class="btn right">确 定</button>
      </div>
    </el-dialog>
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
  import $ from "jquery";

  export default {
    data() {
      var validateOld = (rule, value, callback) => {
        if (value == "") {
          callback(new Error('请输入登录密码'));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入新密码'));
        }
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'));
        }
        if (this.resetForm.confirmPassword != '') {
          this.$refs.resetForm.validateField('confirmPassword');
        }
        callback();
      };
      var validatePass2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入新密码'));
          return;
        }
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'));
          return;
        }
        if (value != this.resetForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
          return;
        }
        callback();
      };
      return {
        resetPassModelVisible: false,
        loginState: false,
        username: "",
        resetForm: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
        resetFormRule: {
          oldPassword: [
            {validator: validateOld, trigger: 'blur'}
          ],
          newPassword: [
            {validator: validatePass, trigger: 'blur'}
          ],
          confirmPassword: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      //获取用户信息
      getUserInfo() {
        var self = this;
        $.ajax({
          // url: apiHost + "/industry-bulletin/user/info",
          url: apiHost + "/industry-bulletin/user/info",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.username = data.data.username
            }
          },
          error: function (error) {
            console.log(error.status)
            if (error.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "../login.html";
                self.loginState = false;
              }, 2000);
            }
          }
        })
      },
      openModel() {
        var self = this;
        self.resetPassModelVisible = true;
        self.$refs.resetForm.resetFields();
      },
      reset(formName) {
        var self = this;
        self.$refs[formName].validate(function(valid){
          if (valid) {
            $.ajax({
              url: apiHost + "/industry-bulletin/user/update_password",
              type: "POST",
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                pwd: self.resetForm.oldPassword,
                pwd2: self.resetForm.newPassword
              },
              success: function (data) {
                if (data.code == 0) {
                  self.resetPassModelVisible = false;
                  self.$message({
                    type: "success",
                    message: "修改成功"
                  })
                }else {
                  self.$message({
                    type: "warning",
                    message: "修改失败"
                  })
                }
              },
              error: function (error) {
                if (error.status == "9001") {
                  self.loginState = true;
                  setTimeout(function () {
                    location.href = "../login.html";
                    self.loginState = false;
                  }, 2000);
                }
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

  #user {
    .user-content {
      min-height: 650px;
      background-color: #fff;
      padding-top: 61px;
      ul {
        width: 350px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 135px;
        li {
          display: table;
          height: 33px;
          line-height: 33px;
          width: 100%;
          div {
            display: table-cell;
            width: 50%;
            font-size: 14px;
            color: #111111;
            &.li-left {
              text-align: right;
              padding-right: 30px;
            }
            &.li-right {
              text-align: left;
              padding-left: 30px;
              button {
                width: 60px;
                height: 25px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid #0074ea;
                color: #0074ea;
                float: right;
                cursor: pointer;
              }
              button:hover {
                background-color: #0074ea;
                color: #ffffff;
              }
            }
          }
        }
      }
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-dialog__header {
      padding: 18px 20px;
      border-bottom: 1px solid #ddd;
    }
    .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
    .el-dialog__footer {
      overflow: hidden;
      padding: 5px 20px 20px 20px;
      .btn {
        background-color: #0074ea;
        border: none;
        padding: 5px 30px;
        color: #ffffff;
        border-radius: 4px;
        font-size: 12px;
      }
      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .el-form-item__error {
      top: 90%;
    }
  }
</style>
