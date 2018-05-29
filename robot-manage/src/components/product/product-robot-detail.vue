<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home/product/robot' }">机器人列表</el-breadcrumb-item>
        <el-breadcrumb-item>机器人详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <h3>机器人名称：{{name}}</h3>
    </div>
    <div class="table">
      <el-table :data="listData" style="width: 100%">
        <el-table-column prop="name" label="服务名称" align="center"></el-table-column>
        <el-table-column label="可接入类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">API</span>
            <span v-if="scope.row.type == 1">SDK</span>
            <span v-if="scope.row.type == 2">API+SDK</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加日期" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path: '/home/product/service', query: {name: scope.row.name}}">查看</router-link>
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
      id:'',
      name:'',
      pageNo: 1,
      pageSize: 10,
      totalPage: 0,
      listData: []
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();
    }
    if (this.$route.query.name) {
      this.name = this.$route.query.name;
    }
  },
  methods: {
    //获取列表数据
    getListData() {
      var self = this;
      self.$http({
        url: apiHost + "/api/query",
        type: 'post',
        data: {
          catalogId: self.id,
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
