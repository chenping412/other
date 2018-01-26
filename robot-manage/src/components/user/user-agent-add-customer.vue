<template>
  <div id="user-agent-add-customer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/user-index/user-agent' }">代理商</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user-index/user-agent/agent-detail?id='+id }">代理商详情</el-breadcrumb-item>
        <el-breadcrumb-item >添加客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add-user">
      <el-form :model="addUserForm" ref="addUserForm" :rules="addUserRules" label-width="100px" class="demo-ruleForm">

        <el-form-item label="客户账号" prop="uid" required>
          <el-input v-model="addUserForm.uid" size="small"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="username" required>
          <el-input v-model="addUserForm.username" size="small" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" required>
          <el-input v-model="addUserForm.newPwd" size="small"></el-input>
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
          <el-button type="primary" size="small" @click="addUser('addUserForm')">添加</el-button>
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
      var uid = function(rule, value, callback) {
        if (value == "") {
          callback(new Error("用户名不能为空"));
        } else if(value.length<6 || value.length>32){
          callback(new Error("用户名长度需在6-32位字符之间"));
        }
      };

      var newPwd = function(rule, value, callback) {
        if (value == "") {
          callback(new Error("请输入密码"));
        } else if(value.length<6 || value.length>32){
          callback(new Error("密码长度需在6-32位字符之间"));
        }else {
          if (this.addUserForm.confirmPwd != "") {
            this.$refs.addUserForm.validateField("confirmPwd");
          }
          callback();
        }
      };
      var confirmPwd = function(rule, value, callback){
        if (value == "") {
          callback(new Error("请再次输入密码"));
        } else if (value != this.addUserForm.newPwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        loginState: false,
        id:'',
        addUserForm: {
          username: "",
          uid: "",
          remark: "",
          newPwd: "",
          confirmPwd: ""
        },
        addUserRules: {
          username: [
            { required: true, message: '请输入代理商名称', trigger: 'blur' }
          ],
          uid: [
            {validator: uid, trigger: "blur"}
          ],
          newPwd: [
            {validator: newPwd, trigger: "blur"}
          ],
          confirmPwd: [
            {validator: confirmPwd, trigger: "blur"}
          ]
        },
        userListData: []
      };
    },
    created() {
      if(this.$route.query.id){
        this.id=this.$route.query.id;
      }
    },
    methods: {
      //添加用户
      addUser(formName) {
        var self = this;
        self.$refs[formName].validate(valid => {
          if (valid) {
            $.ajax({
              url: apiHost + "/member/add",
              type: "POST",
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                mobile: self.addUserForm.account,
                username: self.addUserForm.username,
                company: self.addUserForm.company,
                phone: self.addUserForm.phone,
                qq: self.addUserForm.qq,
                remark: self.addUserForm.remark,
                password: self.addUserForm.newPwd,
                status: self.addUserForm.status
              },
              success: function (data) {
                console.log(data);
                if (data.code == 0) {
                  self.showAddUser = false;
                  self.$message({
                    message: "添加成功",
                    type: "success"
                  });
                } else {
                  self.$message({
                    message: data.msg,
                    type: "error"
                  });
                }
              },
              error: function (XMLHttpRequest) {
                if (XMLHttpRequest.status == "9001") {
                  self.loginState = true;
                  setTimeout(function () {
                    location.href = backToLogin;
                    self.loginState = false;
                  }, 2000);
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
#user-agent-add-customer .add-user{
  width: 400px;
  margin-left: 100px;
  padding:30px 0;
}
</style>
