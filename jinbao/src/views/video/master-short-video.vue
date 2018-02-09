<template>
  <div id="master-short-video">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">短视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>大咖短视频</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="daka-exmine-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待发布" name="dairenzheng">
          <div class="top clearfix">
            <el-form :inline="true" :model="searchForm_1" class="demo-form-inline">
              <el-form-item label="请输入关键字">
                <el-input v-model="searchForm_1.keyword" placeholder="请输入关键字" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="" size="small">查询</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn">批量发布</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="dakaList_1"
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
                prop="cardUrl"
                label="手持证件照"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="姓名"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="nikeName"
                label="昵称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="mobile"
                label="手机号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="cardId"
                label="身份证号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="description"
                label="申请简介"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="申请时间"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <span class="btn-text">编辑</span>
                  <span class="btn-text">通过</span>
                  <span class="btn-text">不通过</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="未通过" name="yitongguo">
          <div class="top clearfix">
            <el-form :inline="true" :model="searchForm_2" class="demo-form-inline">
              <el-form-item label="请输入关键字">
                <el-input v-model="searchForm_2.keyword" placeholder="请输入关键字" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="" size="small">查询</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn">批量删除</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="dakaList_2"
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
                prop="headimgUrl"
                label="头像"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="nickName"
                label="昵称"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="articleCount"
                label="文章数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="trendsCount"
                label="动态数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="shortVideoCount"
                label="短视频数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="直播数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="fansCount"
                label="粉丝数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="moneyCount"
                label="被打赏金额"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="status"
                label="置顶状态"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="通过时间"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="130">
                <template slot-scope="scope">
                  <span class="btn-text">置顶</span>
                  <span class="btn-text">编辑</span>
                  <span class="btn-text">设置</span>
                  <span class="btn-text">屏蔽大咖身份</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        activeName: "dairenzheng",
        searchForm_1: {
          keyword: ""
        },
        searchForm_2: {
          keyword: ""
        },
        dakaList_1: [],
        dakaList_2: [],
      }
    },
    created: function () {
      this.getDakaList_1();
      this.getDakaList_2();
    },
    methods: {
      //获取申请审批列表数据
      getDakaList_1() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/dk/user/uncertified_list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.dakaList_1 = data.data;
            }
          },
          error: function () {

          }
        })
      },
      //获取已通过列表数据
      getDakaList_2() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/dk/user/daka_manage_list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.dakaList_2 = data.data;
            }
          },
          error: function (err) {

          }
        })
      }
    }
  }
</script>

<style lang="less">
  #master-short-video {
    .daka-exmine-main {
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
