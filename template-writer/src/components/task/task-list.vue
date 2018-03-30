<template>
  <div id="task-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/task' }">任务管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="control">
      <div class="item">
        <router-link class="btn" to="/task/add">新增</router-link>
      </div>
      <div class="item">
        <span>任务名称：</span>
        <el-input v-model="searchTitle" size="small"></el-input>
      </div>
      <div class="item">
        <span>状态：</span>
        <el-select v-model="searchStatus" size="small">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
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
        <el-table-column prop="title" label="任务名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">启用</span>
            <span v-if="scope.row.status == 1">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="clickDetailShow(scope.row)">文章列表</a>
            <router-link :to=" '/template/add?id='+scope.row.id ">修改</router-link>
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

    <el-dialog title="预览" class="detail-show" :visible.sync="detailShow" width="800px">
      <div class="mid">
        <h2>{{detail.title}}</h2>
        <h5>{{detail.createTime}}</h5>
        <div v-html="detail.article"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="detailShow = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        searchDate: [],
        searchTitle: '',
        searchText: '',
        searchStatus: '',
        listData: [],
        multipleSelection: [],
        detailShow: false,
        detail: {},

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
        $.ajax({
          url: apiHost + '/task/list',
          data: {
            keyword: self.searchTitle,
            status: self.searchStatus,
            pageNo: self.pageNum,
            pageSize: self.pageSize
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for (var i = 0; i < data.data.data.length; i++) {
                data.data.data[i].index = (self.pageNum - 1) * self.pageSize + i + 1;
              }

              self.listData = data.data.data
              self.totalCount = data.data.totalRecord
            }


          }
        })
      },

      //预览
      clickDetailShow: function (row) {
        var self = this;
        $.ajax({
          url: apiHost + '/writer/templateid_writer',
          data: {
            id: row.id
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data) {
              self.detail = row;
              self.detail.article = data.data;
              self.detailShow = true;
            }else {
              self.$message({
                type: 'error',
                message: '预览失败！'
              });
            }
          },
          error:function(data){
            self.$message({
              type: 'error',
              message: '预览失败！'
            });
          }
        });

      },
      deleteData: function (id) {
        var self = this;
        this.$confirm('您确定要删除任务么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + '/template/delete',
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
