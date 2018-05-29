<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/product' }">机器人列表</el-breadcrumb-item>
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
        <el-table-column prop="index" label="编号" align="center"></el-table-column>
        <el-table-column prop="name" label="机器人名称" align="center"></el-table-column>
        <el-table-column prop="count" label="服务数量" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-for="item in searchForm.statusList" v-show="scope.row.status == item.code">{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/home/product/robot/detail', query: {id: scope.row.id , name:scope.row.name}}">详情</router-link>
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
      pageSize: 20,
      totalPage: 0,
      searchForm: {
        name: "",
        status: "",
        statusList:[
          {
            name:'全部',
            code:''
          }, {
            name:'已上线',
            code:'0'
          }, {
            name:'未上线',
            code:'1'
          }
        ]
      },
      listData: []
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    //获取列表数据
    getListData() {
      var self = this;
      self.$http({
        url: apiHost + "/robot/query",
        type: 'post',
        data: {
          name: self.searchForm.name,
          status: self.searchForm.status,
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
          }else {
            self.listData =[];
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
