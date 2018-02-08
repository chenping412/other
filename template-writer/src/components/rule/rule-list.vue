<template>
  <div id="rule-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">规则管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="control">
      <div class="item">
        <router-link class="btn" to="/rule/add">新增</router-link>
      </div>
      <div class="item">
        <span>时间：</span>
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <div class="item">
        <span>规则名称：</span>
        <el-input v-model="searchName" size="small"></el-input>
      </div>
      <div class="item">
        <span>描述：</span>
        <el-input v-model="searchText" size="small"></el-input>
      </div>
      <div class="item">
        <span>代码：</span>
        <el-input v-model="searchCode" size="small"></el-input>
      </div>
      <el-button type="primary" size="small" @click="getListData">搜索</el-button>

    </div>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="code" label="代码" width="100"></el-table-column>
        <el-table-column prop="name" label="规则名称"></el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="录入时间"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <router-link :to=" '/rule/add?id='+scope.row.id ">修改</router-link>
            <a href="javascript:;" @click="deleteData(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <!--<el-button type="danger" size="small">批量删除</el-button>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,50,100]"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper" background>
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        searchDate: [],
        searchName: '',
        searchText: '',
        searchCode: '',
        listData: [],
        multipleSelection: [],

        pageNum: 1,
        pageSize: 20,
        totalCount: 0
      }
    },
    created: function () {
      this.getListData();
    },
    methods: {
      //获取表格数据
      getListData: function () {
        var self = this;
        var startDate = '';
        var enDate = '';
        if (self.searchDate && self.searchDate.length > 1) {
          startDate = self.searchDate[0];
          enDate = self.searchDate[1];
        }
        $.ajax({
          url: apiHost + '/rule/list',
          data: {
            code: self.searchCode,
            name: self.searchName,
            description: self.searchText,
            start_date: startDate,
            end_date: enDate,
            pageNo: self.pageNum,
            pageSize: self.pageSize
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for(var i=0;i<data.data.data.length;i++){
                data.data.data[i].index=(self.pageNum-1)*self.pageSize+i+1;
              }

              self.listData = data.data.data
              self.totalCount = data.data.totalRecord
            }


          }
        })
      },

      deleteData: function (id) {
        var self = this;
        this.$confirm('您确定要删除规则么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + '/rule/delete',
            data: {
              id: id
            },
            type: "GET",
            success: function (data) {
              console.log(data)
              if (data.code == '0') {
                self.getListData();
              } else {
                self.$message({
                  type: 'error',
                  message: '删除失败！'
                });
              }
            }
          })
        }).catch(function () {

        });
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getListData();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getListData();
      }
    }
  }
</script>

<style>

</style>
