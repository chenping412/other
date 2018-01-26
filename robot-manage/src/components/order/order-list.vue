<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/order' }">订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="账号:">
          <el-input v-model="searchForm.uid" placeholder="账号或手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
          <el-select v-model="searchForm.orderType" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.orderTypeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.orderStatusList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型:">
          <el-select v-model="searchForm.idType" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.idTypeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchForm.submitDate"
            size="small"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="submitDateChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getOrderListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="orderListData"
        style="width: 100%">
        <el-table-column
          prop="order_no"
          label="订单编号"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          label="订单类型"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.type == 1">试用订单</span>
            <span v-show="scope.row.type == 2">正式订单</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="提交时间"
          width="160"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="账号"
          width="110"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="115"
          align="center">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="订单金额"
          align="center">
        </el-table-column>
        <el-table-column
          label="支付方式"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.pay_type == 1">银行转账</span>
            <span v-show="scope.row.pay_type == 2">在线支付</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="订单状态"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.status == 1">未支付</span>
            <span v-show="scope.row.status == 2">已支付</span>
            <span v-show="scope.row.status == 3">已关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <router-link :to="{path: '/order/list/detail', query: {id: scope.row.id}}">查看订单</router-link>
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
        uid: "",
        orderType: "",
        orderTypeList:[
          {
            name:'试用订单',
            code:'1'
          }, {
            name:'正式订单',
            code:'2'
          }
        ],
        orderStatus: "",
        orderStatusList:[
          {
            name:'未支付',
            code:'0'
          },{
            name:'已支付',
            code:'1'
          }
        ],
        idType: "",
        idTypeList:[
          {
            name:'普通用户',
            code:'0'
          }, {
            name:'代理商客户',
            code:'1'
          }, {
            name:'大客户',
            code:'2'
          }
        ],
        submitDate: ""
      },
      orderListData: []
    };
  },
  created() {
    var self = this;
    self.getOrderListData();
  },
  methods: {
    //获取订单列表数据
    getOrderListData() {
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
              self.orderListData = data.data.data;
              self.pageNum = data.data.index;
              self.pageSize = data.data.size;
              self.totalPage = data.data.totalRecord;
            } else {
              self.orderListData = [];
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
    //日期选择
    submitDateChange(val) {
      var self = this;
      self.searchForm.submitDate = val;
    },
    //分页处理
    handleCurrentChange(val) {
      var self = this;
      self.pageNum = val;
      self.getOrderListData();
    },
    //修改订单状态
    updateOrder(id) {
      var self = this;
      self
        .$confirm("此操作将改变该文件状态, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          $.ajax({
            url: apiHost + "/order/update",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              orderId: id,
              status: "3"
            },
            success: function(data) {
              console.log(data);
              if (data.code == 0) {
                self.getOrderListData();
                self.$message({
                  type: "success",
                  message: "关闭成功!"
                });
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
        })
        .catch(() => {
          self.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //删除订单
    removeOrder(id) {
      var self = this;
      self
        .$confirm("此操作将删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          $.ajax({
            url: apiHost + "/order/delete",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              orderId: id
            },
            success: function(data) {
              if (data.code == 0) {
                if (data.data.status == true) {
                  self.getOrderListData();
                  self.$message({
                    type: "success",
                    message: "删除成功!"
                  });
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>

</style>
