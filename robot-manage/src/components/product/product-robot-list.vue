<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/product' }">机器人列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="机器人名称:">
          <el-input v-model="searchForm.name" placeholder="请输入机器人名称" size="small"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchForm.status" placeholder="请选择状态" size="small">
            <el-option v-for="item in searchForm.statusList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="order_no" label="编号" align="center"></el-table-column>
        <el-table-column prop="order_no" label="机器人名称" align="center"></el-table-column>
        <el-table-column prop="order_no" label="服务数量" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/product/robot/detail', query: {id: scope.row.id}}">详情</router-link>
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
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      searchForm: {
        name: "",
        status: "",
        statusList:[
          {
            name:'已上线',
            code:'1'
          }, {
            name:'未上线',
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
    //获取订单列表数据
    getListData() {
      var self = this;
      var startTime = "";
      var endTime = "";
      if(self.searchForm.submitDate) {
        startTime = self.searchForm.submitDate[0];
        endTime = self.searchForm.submitDate[1];
      }
      $.ajax({
        url: apiHost + "/order/list",
        type: "POST",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        data: {
          mobile: self.searchForm.keyword,
          startTime: startTime,
          endTime: endTime,
          pageNum: self.pageNum,
          pageSize: self.pageSize
        },
        success: function(data) {
          console.log(data);
          if (data.code == 0) {
            if (data.data) {
              self.listData = data.data.data;
              self.pageNum = data.data.index;
              self.pageSize = data.data.size;
              self.totalPage = data.data.totalRecord;
            } else {
              self.listData = [];
            }
          }
        },
        error: function(XMLHttpRequest) {
          if (XMLHttpRequest.status == "9001") {
            self.loginState = true;
            setTimeout(function() {
              location.href = backToLogin;
              self.loginState = false;
            }, 2000);
          }
        }
      });
    },
    //分页处理
    handleCurrentChange(val) {
      var self = this;
      self.pageNum = val;
      self.getListData();
    }
  }
};
</script>

<style>

</style>
