<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/product/package' }">套餐管理</el-breadcrumb-item>
        <el-breadcrumb-item>套餐详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <h3 class="left">基本信息</h3>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="col1">套餐名称：</td>
          <td>采集机器人入门-年包</td>
          <td class="col1">套餐编号：</td>
          <td>1123123</td>
        </tr>
        <tr>
          <td class="col1">销量：</td>
          <td>100</td>
          <td class="col1">创建时间：</td>
          <td>2018-1-1423:22:22</td>
        </tr>
        <tr>
          <td class="col1">套餐类型：</td>
          <td>正式</td>
          <td class="col1">价格：</td>
          <td>¥100000.00</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="div-row">
      <el-table :data="listData" border style="width: 100%">
        <el-table-column prop="order_no" label="规格编号" align="center"></el-table-column>
        <el-table-column prop="order_no" label="机器人" align="center"></el-table-column>
        <el-table-column prop="order_no" label="服务" align="center"></el-table-column>
        <el-table-column prop="order_no" label="规格名称" align="center"></el-table-column>
        <el-table-column prop="order_no" label="类型" align="center"></el-table-column>
        <el-table-column prop="order_no" label="规格属性" align="center"></el-table-column>
      </el-table>
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
    }

  }
};
</script>

<style>

</style>
