<template>
  <div id="user-agent-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">代理商</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="代理商名称">
          <el-input v-model="searchForm.name" placeholder="代理商名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="代理商账号">
          <el-input v-model="searchForm.username" placeholder="代理商账号" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getUserListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add">
      <el-button type="primary" size="small" @click="openAddUser">添加代理商</el-button>
    </div>
    <div class="table">
      <el-table
        :data="userListData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="代理商名称"
          width=""
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="代理商账号"
          width="115"
          align="center">
        </el-table-column>
        <el-table-column
          prop="count"
          label="客户数量"
          align="center">
        </el-table-column>
        <el-table-column
          label="账户启用状态"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.status == 1">启用</span>
            <span v-show="scope.row.status == 0">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <router-link :to="{ path: '/home/user-index/user-agent/agent-detail', query: {id: scope.row.id}}">详情</router-link>
            <a href="javascript:;" v-if="scope.row.status == 0" @click="changeUserStatus(scope.row.id,1)">启用</a>
            <a href="javascript:;" v-if="scope.row.status == 1" @click="changeUserStatus(scope.row.id,0)">禁用</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalPage" background>
      </el-pagination>
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
        showAddUser: false,
        pageNum: 1,
        pageSize: 10,
        totalPage: 0,
        searchForm: {
          username: "",
          name: ""
        },
        userListData: []
      };
    },
    created() {
      var self = this;
      self.getUserListData();
    },
    methods: {
      //获取用户列表数据
      getUserListData() {
        var self = this;
        self.$http({
          url: apiHost + "/member/query",
          type: 'post',
          data: {
            type:1,
            username: self.searchForm.username,
            name: self.searchForm.name
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.data) {
              self.userListData = data.data.data;
              self.totalPage = data.data.totalRecord;
            } else {
              self.userListData = [];
            }
          }
        });
      },

      //分页处理
      handleCurrentChange(val) {
        var self = this;
        self.pageNum = val;
        self.getUserListData();
      },
      //打开添加用户model
      openAddUser() {
        this.$router.push('/home/user-index/user-agent/add')
      },

      //禁用和启用用户
      changeUserStatus(id,status) {
        var self = this;

        self.$confirm( status==1 ? '是否启用该用户？' : '是否禁用该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/member/update",
            type: 'post',
            data: {
              id: id,
              status: status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getUserListData();
              } else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            }
          });

        }).catch(function(){

        });
      }


    }
  };
</script>

<style>

</style>
