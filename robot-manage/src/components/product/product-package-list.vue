<template>
  <div id="product-package-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>套餐管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="套餐名称：">
          <el-input v-model="searchForm.name" placeholder="套餐名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="searchForm.type" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.typeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add">
      <el-button type="primary" size="small" @click="openAdd">添加套餐</el-button>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="id" label="套餐编号" align="center"></el-table-column>
        <el-table-column prop="id" label="套餐名称" align="center"></el-table-column>
        <el-table-column prop="id" label="类型" align="center"></el-table-column>
        <el-table-column prop="id" label="规格数量" align="center"></el-table-column>
        <el-table-column prop="id" label="单价" align="center"></el-table-column>
        <el-table-column prop="id" label="销量" align="center"></el-table-column>
        <el-table-column prop="id" label="创建日期" align="center"></el-table-column>
        <el-table-column prop="id" label="状态" align="center"></el-table-column>

        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <router-link :to="{ path: '/product/package/detail', query: {id: scope.row.id}}">详情</router-link>
            <a href="javascript:;" v-if="scope.row.status != 0" @click="changeStatus(scope.row.id,0)">上架</a>
            <a href="javascript:;" v-if="scope.row.status == 0" @click="changeStatus(scope.row.id,-1)">下架</a>
            <a href="javascript:;" @click="changeStatus(scope.row.id,-1)">删除</a>
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
          name: "",
          type:'',
          typeList:[
            {
              name:'全部',
              code:''
            },{
              name:'正式',
              code:'1'
            },{
              name:'试用',
              code:'2'
            }
          ]
        },
        listData: []
      };
    },
    created() {
      var self = this;
      self.getListData();
    },
    methods: {
      //获取用户列表数据
      getListData() {
        var self = this;
        var startTime = "";
        var endTime = "";
        if (self.searchForm.registerDate) {
          startTime = self.searchForm.registerDate[0];
          endTime = self.searchForm.registerDate[1];
        }
        $.ajax({
          url: apiHost + "/member/list",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            keyword: self.searchForm.user,
            startTime: startTime,
            endTime: endTime,
            pageNum: self.pageNum,
            pageSize: self.pageSize
          },
          success: function (data) {
            console.log(data);
            if (data.code == 0) {
              self.listData = data.data.data;
              self.pageNum = data.data.index;
              self.pageSize = data.data.size;
              self.totalPage = data.data.totalRecord;
            } else {
              self.listData = [];
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
      },
      //日期选择
      registerDateChange(val) {
        var self = this;
        console.log(val);
        self.searchForm.registerDate = val;
      },
      //分页处理
      handleCurrentChange(val) {
        var self = this;
        self.pageNum = val;
        self.getListData();
      },
      //打开添加用户model
      openAdd() {
        this.$router.push('/product/package/add')
      },

      //禁用和启用用户
      changeStatus(id,status) {
        var self = this;
        self.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleteUser(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除用户
      deleteUser(id) {
        var self = this;
        $.ajax({
          url: apiHost + "/member/delete",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              self.getListData();
              self.$message({
                type: 'success',
                message: '删除成功!'
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
    }
  };
</script>

<style>

</style>
