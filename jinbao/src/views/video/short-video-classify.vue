<template>
  <div id="integral-yewu">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">短视频管理</el-breadcrumb-item>
        <el-breadcrumb-item>短视频分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="integral-yewu-main">
      <div class="top clearfix">
        <el-button type="primary" size="small" class="btn">新增分类</el-button>
      </div>
      <div class="table-list">
        <el-table
          ref="multipleTable"
          :data="integralAccountList"
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
    </div>
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
        integralAccountList: [],
      }
    },
    created: function () {
      this.getIntegralAccountList();
    },
    methods: {
      //获取积分类型列表
      getIntegralAccountList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/point/item/list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.integralAccountList = data.data;
            }
          },
          error: function () {

          }
        })
      }
    }
  }
</script>

<style lang="less">
  #integral-yewu {
    .integral-yewu-main {
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
