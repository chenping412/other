<template>
  <div id="news-hots">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>热词管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="news-hots-main">
      <div class="top clearfix">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="请输入关键字">
            <el-input v-model="searchForm.keyword" placeholder="请输入关键字" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="" size="small">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" class="btn" @click="">新增</el-button>
        <el-button type="primary" size="small" class="btn">批量删除</el-button>
      </div>
      <div class="table-list">
        <el-table
          ref="multipleTable"
          :data="hotsList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="">
          <el-table-column
            align="center"
            type="selection"
            width="30">
          </el-table-column>
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            prop="channelName"
            label="热词名称"
            width="">
          </el-table-column>
          <el-table-column
            align="center"
            prop="nickName"
            label="来源"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="创建时间"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="130">
            <template slot-scope="scope">
              <span class="btn-text">展示</span>
              <span class="btn-text">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--新增热词-->
    <el-dialog
      title="修改"
      :visible.sync="addHotsVisible"
      width="30%">
      <el-form :model="addHotsForm" ref="addHotsForm" label-width="100px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="addHotsForm.user_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户别名" prop="nike_name">
          <el-input v-model="addHotsForm.nike_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addHotsForm.phone" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addHotsForm.email" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="管理员类型" prop="type">
          <el-select v-model="addHotsForm.type" placeholder="请选择" size="small">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="操作员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="addHotsForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addHotsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="add" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        searchForm: {
          keyword: ""
        },
        hotsList: [],
        addHotsVisible: false,
        addHotsForm: {

        },
      }
    },
    created: function () {
      this.getHotsList();
    },
    methods: {
      //获取频道列表数据
      getHotsList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/hotWord/list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.hotsList = data.data;
            }
          },
          error: function (err) {
          }
        })
      },
      add() {

      }
    }
  }
</script>

<style lang="less">
  #news-hots {
    .news-hots-main {
      .top {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        .demo-form-inline {
          float: right;
          .el-form-item {
            margin-bottom: 0;
          }
        }
        .btn {
          float: left;
          margin-top: 4px;
        }
      }
      .table-list {
        border-bottom: 1px solid #ddd;
        .btn-text {
          color: #0784ea;
          cursor: pointer;
        }
      }
    }
  }
</style>
