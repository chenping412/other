<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/product/service' }">服务列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="服务名称:">
          <el-input v-model="searchForm.name" placeholder="请输入服务名称" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="index" label="编号" align="center"></el-table-column>
        <el-table-column prop="name" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="catalogName" label="所属机器人" align="center"></el-table-column>
        <el-table-column prop="goodsNumber" label="商品数量" align="center"></el-table-column>
        <el-table-column  label="状态" align="center">
          <template slot-scope="scope">
            <span  v-show="scope.row.status == 1">未上线</span>
            <span  v-show="scope.row.status == 0">已上线</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/home/product/service/detail', query: {id: scope.row.id}}">详情</router-link>
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
      pageNo: 1,
      pageSize: 10,
      totalPage: 0,
      searchForm: {
        name: ""
      },
      listData: []
    };
  },
  created() {
    if (this.$route.query.name) {
      this.searchForm.name = this.$route.query.name;
    }
    this.getListData();
  },
  methods: {
    //获取列表数据
    getListData() {
      var self = this;
      self.$http({
        url: apiHost + "/api/query",
        type: 'post',
        data: {
          name: self.searchForm.name,
          pageNo: self.pageNo,
          pageSize: self.pageSize
        },
        success: function (data) {
          if (data.code == 0 && data.data && data.data.data) {
            self.totalPage = data.data.totalRecord;
            var arr = data.data.data;
            for(var i=0;i<arr.length;i++){
              arr[i].index=(self.pageNo-1)*self.pageSize+i+1;
            }
            self.listData = arr;
          }
        }
      });
    },
    //分页处理
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getListData();
    }
  }
};
</script>

<style>

</style>
