<template>
  <div id="user-agent-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/user-index/user-agent' }">代理商</el-breadcrumb-item>
        <el-breadcrumb-item>添加代理商</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add-user">
      <el-form :model="addUserForm" ref="addUserForm" :rules="addUserRules" label-width="100px" class="demo-ruleForm">

        <el-form-item label="代理商账号" prop="username" required>
          <el-input v-model="addUserForm.username" size="small"></el-input>
        </el-form-item>
        <el-form-item label="代理商名称" prop="name" required>
          <el-input v-model="addUserForm.name" size="small" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" required>
          <el-input v-model="addUserForm.password" size="small"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd" required>
          <el-input v-model="addUserForm.confirmPwd" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="addUserForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="addUser()">添加</el-button>
        </el-form-item>
      </el-form>
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
  import $ from "jquery";

  export default {
    data() {
      var self = this;
      var username = function (rule, value, callback) {
        if (value == "") {
          callback(new Error("代理商账号不能为空"));
        } else if (value.length < 6 || value.length > 32) {
          callback(new Error("代理商账号长度需在6-32位字符之间"));
        }else {
          callback();
        }
      };

      var password = function (rule, value, callback) {
        if (value == "") {
          callback(new Error("请输入密码"));
        } else if (value.length < 6 || value.length > 32) {
          callback(new Error("密码长度需在6-32位字符之间"));
        } else {
          if (self.addUserForm.confirmPwd != "") {
            self.$refs.addUserForm.validateField("confirmPwd");
          }
          callback();
        }
      };
      var confirmPwd = function (rule, value, callback) {
        if (value == "") {
          callback(new Error("请再次输入密码"));
        } else if (value != self.addUserForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        loginState: false,
        addUserForm: {
          name: "",
          username: "",
          remark: "",
          password: "",
          confirmPwd: ""
        },
        addUserRules: {
          name: [
            {required: true, message: '请输入代理商名称', trigger: 'blur'}
          ],
          username: [
            {validator: username, trigger: "blur"}
          ],
          password: [
            {validator: password, trigger: "blur"}
          ],
          confirmPwd: [
            {validator: confirmPwd, trigger: "blur"}
          ]
        },
        userListData: []
      };
    },
    created() {

    },
    methods: {
      //添加用户
      addUser() {
        var self = this;
        self.$refs.addUserForm.validate(function (valid) {
          console.log(valid)
          if (valid) {
            self.$http({
              url: apiHost + "/member/add",
              type: 'post',
              data: {
                type: 1,
                name: self.addUserForm.name,
                username: self.addUserForm.username,
                password: self.addUserForm.password,
                remark: self.addUserForm.remark
              },
              success: function (data) {
                if (data.code == '0') {
                  self.$confirm('添加成功，点击确认跳转至用户列表', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                  }).then(function () {
                    self.$router.push('/home/user-index/user-normal');
                  }).catch(function () {
                    self.addUserForm.name = '';
                    self.addUserForm.username = '';
                    self.addUserForm.remark = '';
                    self.addUserForm.password = '';
                    self.addUserForm.confirmPwd = '';
                  });
                } else {
                  self.$alert(data.msg, '提示', {
                    confirmButtonText: '确定',
                    type: 'error'
                  });
                }
              }
            });
          }
        });
      }
    }
  };
</script>

<style>
  #user-agent-add .add-user {
    width: 400px;
    margin-left: 100px;
    padding: 30px 0;
  }
</style>
