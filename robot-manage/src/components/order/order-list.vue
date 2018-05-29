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
          <el-input v-model="searchForm.mobile" placeholder="账号或手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
          <el-select v-model="searchForm.type" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.typeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态:">
          <el-select v-model="searchForm.status" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.statusList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型:">
          <el-select v-model="searchForm.userType" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.userTypeList" :key="item.code" :label="item.name" :value="item.code">
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
          <el-button type="primary" size="small" @click="getListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="listData"
        style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.type == 1">试用订单</span>
            <span v-show="scope.row.type == 0">正式订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
        <el-table-column prop="username" label="账号" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
        <el-table-column prop="appName" label="应用" align="center"></el-table-column>
        <el-table-column prop="realAmount" label="订单金额" align="center"></el-table-column>
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.payType == 1">银行转账</span>
            <span v-show="scope.row.payType == 2">在线支付</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" align="center">
          <template slot-scope="scope">
            <span v-for="item in searchForm.statusList" v-show="scope.row.status == item.code">{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/home/order/list/detail', query: {id: scope.row.id}}">查看订单</router-link>
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
        mobile: "",
        type: "",
        typeList:[
          {
            name:'全部',
            code:''
          },
          {
            name:'正式订单',
            code:'0'
          },{
            name:'试用订单',
            code:'1'
          }
        ],
        status: "",
        statusList:[
          {
            name:'全部',
            code:''
          },{
            name:'未支付',
            code:'1'
          },{
            name:'已支付',
            code:'2'
          },{
            name:'已关闭',
            code:'3'
          },{
            name:'已取消',
            code:'4'
          }
        ],
        userType: "",
        userTypeList:[
          {
            name:'全部',
            code:''
          },{
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
      self.$http({
        url: apiHost + "/order/query",
        type: 'post',
        data: {
          mobile: self.searchForm.mobile,
          type: self.searchForm.type,
          status: self.searchForm.status,
          userType: self.searchForm.userType,
          startTime: startTime,
          endTime: endTime,
          pageNo: self.pageNo,
          pageSize: self.pageSize
        },
        success: function (data) {
          if (data.code == 0 && data.data && data.data.data) {
            self.listData = data.data.data;
            self.totalPage = data.data.totalRecord;
          } else {
            self.listData = [];
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
      self.pageNo = val;
      self.getListData();
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
                self.getListData();
                self.$message({
                  type: "success",
                  message: "关闭成功!"
                });
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
                  self.getListData();
                  self.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                }
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
