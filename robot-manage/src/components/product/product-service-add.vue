<template>
  <div id="product-service-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/product/service' }">服务列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/service/detail?id='+parentId }">服务详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{id=='' ? '添加规格' : '编辑规格'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add">
      <el-form :model="formData" ref="formData" :rules="addRules" label-width="200px" class="demo-ruleForm">

        <el-form-item label="服务：" prop="service" required>
          <el-cascader :options="serviceOptions" v-model="formData.service"></el-cascader>
        </el-form-item>
        <el-form-item label="类型：" prop="type" required>
          <el-radio v-model="formData.type" label="1">正式</el-radio>
          <el-radio v-model="formData.type" label="2">试用</el-radio>
        </el-form-item>
        <el-form-item label="规格名称：" prop="name" required>
          <el-input v-model="formData.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="使用时长(天)：" prop="dateNum" required>
          <el-input-number v-model="formData.dateNum" controls-position="right" :min="0" :max="9999" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="每日调用上限(次)：" prop="useNum" required>
          <el-input-number v-model="formData.useNum" controls-position="right" :min="0" :max="999999" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="单价(元)：" prop="price" required v-if="formData.type=='1'">
          <el-input v-model="formData.price" type="number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="超额计费(元/1000次)：" prop="overBudget" required required v-if="formData.type=='1'">
          <el-input v-model="formData.overBudget" type="number" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="addUser('formData')">添加</el-button>
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
      return {
        loginState: false,
        id: '',
        parentId: '',
        formData: {
          service: [],
          type: "1",
          name: "",
          dateNum: "",
          useNum: "",
          price: "",
          overBudget: ""
        },
        serviceOptions: [
          {
            value: '1',
            label: '采集机器人',
            children: [
              {
                value: '1-1',
                label: '资讯搜索1'
              },{
                value: '1-2',
                label: '资讯搜索2'
              },{
                value: '1-3',
                label: '资讯搜索3'
              }
            ]
          },
          {
            value: '2',
            label: '写作机器人',
            children: [
              {
                value: '2-1',
                label: '写作聚合1'
              },{
                value: '2-2',
                label: '写作聚合2'
              },{
                value: '2-3',
                label: '写作聚合3'
              }
            ]
          },
        ],
        addRules: {
          service: [
            {required: true, message: '请选择服务'}
          ],
        },
        userListData: []
      };
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      }
      if (this.$route.query.parentId) {
        this.parentId = this.$route.query.parentId;
      }
      console.log(this.id)
    },
    methods: {
      //添加用户
      addUser(formName) {
        var self = this;
        self.$refs[formName].validate(function (valid) {
          if (valid) {
            $.ajax({
              url: apiHost + "/member/add",
              type: "POST",
              xhrFields: {
                withCredentials: true
              },
              crossDomain: true,
              data: {
                mobile: self.formData.account,
                username: self.formData.username,
                company: self.formData.company,
                phone: self.formData.phone,
                qq: self.formData.qq,
                remark: self.formData.remark,
                password: self.formData.newPwd,
                status: self.formData.status
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
  #product-service-add .add {
    width: 400px;
    margin-left: 100px;
    padding: 30px 0;
  }
</style>
