<template>
  <div id="news-subject">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>专题管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="news-subject-main">
      <el-tabs v-model="activeName" @tab-click="">
        <el-tab-pane label="待发布" name="waitPublic">
          <div class="top clearfix">
            <el-form :inline="true" :model="waitPublicSearchForm" class="demo-form-inline">
              <el-form-item>
                <el-input v-model="waitPublicSearchForm.keyword" placeholder="请输入关键字" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="" size="small">查询</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn" @click="$router.push('/index/add-subject')">新增专题</el-button>
            <el-button type="primary" size="small" class="btn">批量删除</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="waitPublicList"
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
                prop="imageUrl"
                label="图片"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="专题名称"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="channelIds"
                label="频道"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="mobile"
                label="资讯数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createName"
                label="创建人"
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
                width="150">
                <template slot-scope="scope">
                  <span class="btn-text">编辑</span>
                  <span class="btn-text">发布</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已发布" name="hasPublic">
          <div class="top clearfix">
            <el-form :inline="true" :model="waitPublicSearchForm" class="demo-form-inline">
              <el-form-item label="请输入关键字">
                <el-input v-model="waitPublicSearchForm.keyword" placeholder="请输入关键字" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="" size="small">查询</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn-remove">批量下架</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="hasPublicList"
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
        <el-tab-pane label="已下架" name="hasSoldOut">
          <div class="top clearfix">
            <el-form :inline="true" :model="hasSoldOutSearchForm" class="demo-form-inline">
              <el-form-item label="请输入关键字">
                <el-input v-model="hasSoldOutSearchForm.keyword" placeholder="请输入关键字" size="small"></el-input>
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
              :data="hasSoldOutList"
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
      </el-tabs>

    </div>

  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        activeName: "waitPublic",
        waitPublicSearchForm: {
          keyword: ""
        },
        waitPublicSearchForm: {
          keyword: ""
        },
        hasSoldOutSearchForm: {
          keyword: ""
        },
        waitPublicList: [],
        hasPublicList: [],
        hasSoldOutList: [],
      }
    },
    created: function () {
      this.getWaitPublicList();
      this.getHasPublicList();
      this.getHasSoldOutList();
    },
    methods: {
      //获取待发布列表数据
      getWaitPublicList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/special_topic/list",
          type: "post",
          data: {
            status: "0"
          },
          success: function (data) {
            if (data.code == 0) {
              self.waitPublicList = data.data;
            }
          },
          error: function () {

          }
        })
      },
      //获取已发布列表数据
      getHasPublicList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/special_topic/list",
          type: "post",
          data: {
            status: "1"
          },
          success: function (data) {
            if (data.code == 0) {
              self.hasPublicList = data.data;
            }
          },
          error: function (err) {

          }
        })
      },
      //获取已下架列表数据
      getHasSoldOutList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/special_topic/list",
          type: "post",
          data: {
            status: "2"
          },
          success: function (data) {
            if (data.code == 0) {
              self.hasSoldOutList = data.data;
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
  #news-subject {
    .news-subject-main {
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
