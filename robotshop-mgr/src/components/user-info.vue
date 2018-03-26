<template>
  <div id="user-info">
    <div class="breadcrumb">
      <a href="javascript:;">账户信息</a>
    </div>
    <div class="content-box">
      <div class="title">
        <h3>账户资料</h3>
        <ul>
          <li class="clearfix">
            <div class="boxname">邮箱地址 : </div>
            <div class="boxvalue"></div>
          </li>
          <li class="clearfix">
            <div class="boxname">登录密码 : </div>
            <div class="boxvalue">
              ******
              <a href="javascript:;" @click="resetPasswordModelShow=true">修改密码</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content-box">
      <div class="title">
        <h3>
          个人资料
          <a href="javascript:;" @click="resetUserInfoModelShow=true">修改</a>
        </h3>
        <ul>
          <li class="clearfix">
            <div class="boxname">真实姓名 : </div>
            <div class="boxvalue">{{resetUserInfo.userName}}</div>
          </li>
          <li class="clearfix">
            <div class="boxname">公司名称 : </div>
            <div class="boxvalue">
              {{resetUserInfo.companyName}}
            </div>
          </li>
          <li class="clearfix">
            <div class="boxname"> &nbsp;QQ号码 : </div>
            <div class="boxvalue">
              {{resetUserInfo.qqNumber}}
            </div>
          </li>
          <li class="clearfix">
            <div class="boxname">联系电话 : </div>
            <div class="boxvalue">
              {{resetUserInfo.phoneNumber}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      title="修改个人资料"
      :visible.sync="resetUserInfoModelShow"
      size="tiny">
      <el-form :model="resetUserInfo" :rules="resetUserInfoRules" ref="resetUserInfo" label-width="80px"
               label-position="left">
        <el-form-item label="真实姓名" prop="userName">
          <el-input type="text" v-model="resetUserInfo.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName">
          <el-input type="text" v-model="resetUserInfo.companyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ 号码" prop="qqNumber">
          <el-input type="text" v-model="resetUserInfo.qqNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input type="text" v-model="resetUserInfo.phoneNumber" auto-complete="off" readonly=true></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetUserInfoModelShow=false">取消</el-button>
          <el-button type="primary" @click="resetUserInfoSubmit('resetUserInfo')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="resetPasswordModelShow"
      size="tiny">
      <el-form :model="resetPassword" :rules="resetPasswordRules" ref="resetPassword" label-width="80px">
        <el-form-item label="登陆密码" prop="oldPass">
          <el-input type="password" v-model="resetPassword.oldPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="resetPassword.newPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="resetPassword.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetPasswordModelShow=false">取消</el-button>
          <el-button type="primary" @click="resetPasswordSubmit('resetPassword')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  //  import { MessageBox } from 'element-ui';
  var md5 = require('md5');

  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.resetPassword.checkPass !== '') {
            this.$refs.resetPassword.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请再次输入新密码'));
        } else if (value != this.resetPassword.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        apiHost: "",
        loginState: false,
        resetPasswordModelShow: false,
        resetUserInfoModelShow: false,
        resetPassword: {
          oldPass: "",
          newPass: "",
          checkPass: ""
        },
        resetPasswordRules: {
          oldPass: [
            {required: true, message: '请输入旧密码', trigger: 'blur'},
            {min: 6, message: '长度至少 6 个字符', trigger: 'blur'}
          ],
          newPass: [
            {validator: validatePass, trigger: 'blur'},
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {min: 6, message: '长度至少 6 个字符', trigger: 'blur'},
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'},
            {required: true, message: '请再次输入密码', trigger: 'blur'},
            {min: 6, message: '长度至少 6 个字符', trigger: 'blur'},
          ]

        },
        resetUserInfo: {
          userName: "",
          companyName: "",
          qqNumber: "",
          phoneNumber: ""
        },
        resetUserInfoRules: {}
      }

    },
    created: function () {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://robot.giiso.com"
      }
      this.getUserInfo();
    },
    methods: {
      //修改密码
      resetPasswordSubmit(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
            if (valid) {
              $.ajax({
                url: self.apiHost + "/open-portal/member/password/check",
                type: "POST",
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  password: md5(self.resetPassword.oldPass),
                },
                success: function (msg) {
                  if (msg.code == 0) {
                    if (msg.data.status == true) {
                      $.ajax({
                        url: self.apiHost + "/open-portal/member/password/update",
                        type: "POST",
                        xhrFields: {
                          withCredentials: true
                        },
                        crossDomain: true,
                        data: {
                          password: md5(self.resetPassword.newPass),
                        },
                        success: function (data) {
                          if (data.code == 0 && data.data.status == true) {
                            self.resetPasswordModelShow = false;
                            self.$alert('恭喜你，密码修改成功！', '提示', {
                              confirmButtonText: '确定'
                            });
                          } else {
                            self.$alert('出现错误，密码修改失败，请重新输入！', '提示', {
                              confirmButtonText: '确定'
                            });
                          }
                        },
                      })
                    }
                  } else {
                    self.$alert(msg.msg + "请重新输入", '提示', {
                      confirmButtonText: '确定'
                    });
                  }
                },
                error: function (XMLHttpRequest) {
                  if (XMLHttpRequest.status == "9001") {
                    self.loginState = true;
                    setTimeout(function () {
                      location.href = "/";
                      self.loginState = false;
                    }, 2000)
                  }
                }
              })
            }
          }
        )
      },

      //修改用户信息
      resetUserInfoSubmit(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
            if (valid) {
              $.ajax({
                url: self.apiHost + "/open-portal/member/update",
                type: "POST",
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  contractName: self.resetUserInfo.userName,
                  mobile: self.resetUserInfo.phoneNumber,
                  qq: self.resetUserInfo.qqNumber,
                  company: self.resetUserInfo.companyName,
                },
                success: function (msg) {
                  if (msg.code == 0) {
                    self.resetUserInfoModelShow = false;
                    self.$alert('恭喜你，修改成功！', '提示', {
                      confirmButtonText: '确定'
                    });
                  }else {
                    self.$alert("出现错误，需改失败", '提示', {
                      confirmButtonText: '确定'
                    });
                  }
                },
                error: function (XMLHttpRequest) {
                  if (XMLHttpRequest.status == "9001") {
                    self.loginState = true;
                    setTimeout(function () {
                      location.href = "/";
                      self.loginState = false;
                    }, 2000)
                  }
                }
              })
            }
          }
        )
      },

      //获取用户详情信息
      getUserInfo() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/open-portal/member/detail",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (data) {
            if (data.code == 0) {
              if (data.data.mobile) {
                self.resetUserInfo.phoneNumber = data.data.mobile;
              }
              if (data.data.contract_name) {
                self.resetUserInfo.userName = data.data.contract_name;
              }
              if (data.data.qq) {
                self.resetUserInfo.qqNumber = data.data.qq;
              }
              if (data.data.company) {
                self.resetUserInfo.companyName = data.data.company;
              }
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              }, 2000)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">
  #user-info {
    .breadcrumb {
      margin: 52px 0 21px 0;
      a {
        display: block;
        line-height: 30px;
        color: #141414;
        font-size: 24px;
      }
    }

    .content-box {
      margin-bottom: 10px;
      .title {
        padding: 30px 0 30px 30px;
        background: #F5F6F8;
        h3 {
          font-size: 14px;
          color: #111;
          line-height: 20px;
          margin-bottom: 12px;
          a {
            color: #4378E6;
            margin-left: 10px;
          }
        }
        ul {
          width: 195px;
          li {
            line-height: 30px;
            font-size: 14px;
            color: #555;
            .boxname {
              float: left;
              /*text-align: right;*/
              width: 70px;
            }
            .boxvalue {
              float: left;
              text-align: left;
              width: 113px;
              a {
                color: #4378E6;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }

    .el-dialog {
      width: 400px;
      .el-dialog__header {
        padding: 20px;
        border-bottom: 1px solid #ddd;
      }
      .el-dialog__body {
        padding-top: 30px;
      }
    }
  }
</style>
