<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product/robot' }">机器人列表</el-breadcrumb-item>
        <el-breadcrumb-item>机器人详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <h3>机器人名称：采集机器人</h3>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="order_no" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="order_no" label="添加日期" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/order/list/detail', query: {id: scope.row.id}}">查看</router-link>
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
//      self.getListData();
    }
  }
};
</script>

<style>

</style>
