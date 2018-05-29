<template>
  <div id="product-package-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="商品名称:">
          <el-input v-model="searchForm.name" placeholder="商品名称" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add">
      <el-button type="primary" size="small" @click="openAdd">添加商品</el-button>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
        <el-table-column label="可接入类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">API</span>
            <span v-if="scope.row.type == '2'">SDK</span>
            <span v-if="scope.row.type == '3'">API+SDK</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center" width="165">
          <template slot-scope="scope">
            <p>使用时长:{{scope.row.period}}天</p>
            <p>每日调用上限：{{scope.row.times}}</p>
            <p>每秒并发量：{{scope.row.concurrency}}</p>
            <p>超额计费：{{scope.row.extraFee}}元/1000次</p>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center"></el-table-column>
        <el-table-column prop="salesVol" label="销量" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">上架</span>
            <span v-if="scope.row.status == 1">下架</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <router-link :to="{ path: '/home/product/package/detail', query: {id: scope.row.id}}">详情</router-link>
            <router-link :to="{ path: '/home/product/package/add', query: {id: scope.row.id}}">编辑</router-link>
            <a href="javascript:;" v-if="scope.row.status == 1" @click="changeStatus(scope.row.id,0)">上架</a>
            <a href="javascript:;" v-if="scope.row.status == 0" @click="changeStatus(scope.row.id,1)">下架</a>
            <a href="javascript:;" @click="deleteProduct(scope.row.id)">删除</a>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalPage" background>
      </el-pagination>
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
        pageNo: 1,
        pageSize: 10,
        totalPage: 0,
        searchForm: {
          name: "",
        },
        listData: []
      };
    },
    created() {
      var self = this;
      self.getListData();
    },
    methods: {
      //获取列表数据
      getListData() {
        var self = this;
        self.$http({
          url: apiHost + "/goods/query",
          data: {
            name: self.searchForm.name,
            pageNo: self.pageNo,
            pageSize: self.pageSize
          },
          success: function (data) {
            if (data.code == 0) {
              if (data.data && data.data.data) {
                self.listData = data.data.data;
                self.totalPage = data.data.totalRecord;
              }else {
                self.listData = [];
                self.totalPage = 0;
              }
            }
          }
        });
      },
      //分页处理
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getListData();
      },
      //打开添加商品
      openAdd() {
        this.$router.push('/home/product/package/add')
      },

      //禁用和启用用户
      changeStatus(id,status) {
        var self = this;
        self.$confirm( status==1 ? '是否下架该商品？' : '是否上架该商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/goods/update",
            type: 'post',
            data: {
              id: id,
              status: status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getListData();
                self.$message({
                  message: '操作成功！',
                  type: "success"
                });
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
      },
      //删除商品
      deleteProduct(id) {
        var self = this;
        self.$confirm( '是否删除该商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/goods/update",
            type: 'post',
            data: {
              id: id,
              isDelete: 1
            },
            success: function (data) {
              if (data.code == 0) {
                self.getListData();
                self.$message({
                  message: '操作成功！',
                  type: "success"
                });
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
