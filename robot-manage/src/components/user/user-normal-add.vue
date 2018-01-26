<template>
  <div id="user-normal-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item >添加用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add-user">
      <el-form :model="addUserForm" ref="addUserForm" :rules="addUserRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户类型" required>
          <el-select v-model="addUserForm.userType" placeholder="请选择" size="small">
            <el-option v-for="item in addUserForm.userTypeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="addUserForm.username" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" required>
          <el-input v-model="addUserForm.phone" size="small"></el-input>
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
      var username = (rule, value, callback) => {
        if (value == "") {
          callback(new Error("用户名不能为空"));
        } else if(value.length<6 || value.length>32){
          callback(new Error("用户名长度需在6-32位字符之间"));
        }
      };
      var phone = (rule, value, callback) => {
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error("手机号码格式错误"));
        } else {
          callback();
        }
      };
      var newPwd = (rule, value, callback) => {
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
      var confirmPwd = (rule, value, callback) => {
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
        addUserForm: {
          userType:'2',
          userTypeList:[{
              name:'手动注册',
              code:'2'
            },{
              name:'大客户',
              code:'3'
            },{
              name:'杭州前方',
              code:'4'
            },{
              name:'U传播',
              code:'5'
            }
          ],
          account: "",
          username: "",
          company: "",
          phone: "",
          qq: "",
          remark: "",
          newPwd: "",
          confirmPwd: "",
          status: ""
        },
        addUserRules: {
          username: [
            {validator: username, trigger: "blur"}
          ],
          phone: [
            {validator: phone, trigger: "blur"}
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
#user-normal-add .add-user{
  width: 400px;
  margin-left: 100px;
  padding:30px 0;
}
</style>
