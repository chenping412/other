<template>
  <div id="user-normal-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item >添加用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add-user">
      <el-form :model="addUserForm" ref="addUserForm" :rules="addUserRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户渠道" required>
          <el-select v-model="addUserForm.channel" placeholder="请选择" size="small">
            <el-option v-for="item in addUserForm.channelList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="addUserForm.username" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" required>
          <el-input v-model="addUserForm.mobile" size="small"></el-input>
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

  </div>
</template>

<script>

  export default {
    data() {
      var self=this;
      var username = function(rule, value, callback){
        if (value == "") {
          callback(new Error("用户名不能为空"));
        } else if(value.length<6 || value.length>32){
          callback(new Error("用户名长度需在6-32位字符之间"));
        }else {
          callback();
        }
      };
      var mobile = function(rule, value, callback){
        if (value == "") {
          callback(new Error("手机号不能为空"));
        } else if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error("手机号码格式错误"));
        } else {
          callback();
        }
      };
      var password = function(rule, value, callback){
        if (value == "") {
          callback(new Error("请输入密码"));
        } else if(value.length<6 || value.length>32){
          callback(new Error("密码长度需在6-32位字符之间"));
        }else {
          callback();
        }
      };
      var confirmPwd = function(rule, value, callback){
        if (value == "") {
          callback(new Error("请再次输入密码"));
        }else if (value != self.addUserForm.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        loginState: false,
        addUserForm: {
          channel:'0',
          channelList:[
            {
              name:'官网注册',
              code:'0'
            },{
              name:'手动注册',
              code:'1'
            },{
              name:'大客户',
              code:'2'
            },{
              name:'杭州前方',
              code:'3'
            },{
              name:'U传播',
              code:'4'
            }
          ],
          username: "",
          mobile: "",
          remark: "",
          password: "",
          confirmPwd: ""
        },
        addUserRules: {
          username: [
            {validator: username, trigger: "blur"}
          ],
          mobile: [
            {validator: mobile, trigger: "blur"}
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
        self.$refs.addUserForm.validate(function(valid){
          if (valid) {
            self.$http({
              url: apiHost + "/member/add",
              type: 'post',
              data: {
                type:0,
                channel:self.addUserForm.channel,
                username: self.addUserForm.username,
                mobile: self.addUserForm.mobile,
                password: self.addUserForm.password,
                remark: self.addUserForm.remark
              },
              success: function (data) {
                console.log(data)
                if (data.code == '0') {
                  self.$confirm('添加成功，点击确认跳转至用户列表', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                  }).then(function(){
                    self.$router.push('/home/user-index/user-normal');
                  }).catch(function(){
                    self.addUserForm.username='';
                    self.addUserForm.mobile='';
                    self.addUserForm.remark='';
                    self.addUserForm.password='';
                    self.addUserForm.confirmPwd='';
                    self.addUserForm.channel='0';
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
#user-normal-add .add-user{
  width: 400px;
  margin-left: 100px;
  padding:30px 0;
}
</style>
