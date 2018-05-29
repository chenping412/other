<template>
  <div id="formula-list" v-loading.fullscreen.lock="loading">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/formula' }">热词管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="control">
      <div class="item">
        <span>新增热词：</span>
        <div class="el-input el-input--small">
          <input v-model="hotword" @keyup.enter="addKeyword" type="text" autocomplete="off" class="el-input__inner">
        </div>
      </div>
      <el-button type="primary" size="small" @click="addKeyword">新增</el-button>

    </div>

    <div class="table">
      <el-table
        ref="multipleTable"
        :data="listData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="keyword" label="热词"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="deleteKeyword(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,50,100]"
        :page-size="pageSize"
        :current-page="pageNo"
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
        hotword: '',
        listData: [],

        multipleSelection: [],

        loading: false,
        pageNo: 1,
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
        self.listData =[];
        var startDate = '';
        var enDate = '';
        if (self.searchDate && self.searchDate.length > 1) {
          startDate = self.searchDate[0];
          enDate = self.searchDate[1];
        }
        self.loading = true;
        $.ajax({
          url: apiHost + '/analyzer/hotword/commonManage/list',
          data: {
            pageNo:self.pageNo,
            pageSize:self.pageSize
          },
          type: "POST",
          success: function (data) {
            self.loading = false;
            if (data.code == '0' && data.data && data.data.hotwords) {
              for (var i = 0; i < data.data.hotwords.length; i++) {
                data.data.hotwords[i].index = self.pageSize*(self.pageNo-1) + i + 1;
              }
              self.listData = data.data.hotwords;
              self.totalCount=data.data.totalNum;
            }else {
              if(self.pageNo>1){
                self.pageNo=self.pageNo-1;
                self.getListData();
              }
            }
          }
        })
      },


      addKeyword: function () {
        var self = this;
        if (self.hotword == '' || !self.hotword) {
          self.$alert('请输入新增热词！', '提示', {
            type: 'warning'
          });
          return false;
        }
        self.loading = true;
        $.ajax({
          url: apiHost + '/analyzer/hotword/common/add',
          data: {
            hotword: self.hotword,
            bizPlat: 'quanc'
          },
          type: "POST",
          success: function (data) {
            self.loading = false;
            if (data.code == '0') {
              self.getListData();
              self.hotword = '';
            } else {
              self.$message({
                type: 'error',
                message: data.msg
              });
            }
          }
        })
      },

      deleteKeyword: function (id) {
        var self = this;
        this.$confirm('您确定要删除该热词么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          self.loading = true;
          $.ajax({
            url: apiHost + '/analyzer/hotword/common/del',
            data: {
              id: id
            },
            type: "POST",
            success: function (data) {
              self.loading = false;
              if (data.code == '0') {
                self.getListData();
              } else {
                self.$message({
                  type: 'error',
                  message: data.msg
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
        this.pageNo = val;
        this.getListData();
      }
    }
  }
</script>

<style>

</style>
