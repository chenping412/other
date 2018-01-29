<template>
  <div id="update-list">
    <div class="top">
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">首页</router-link>
        &gt;
        <router-link :to="{ path: '/classify' }">行业简报信息页</router-link>
        &gt;
        <span>选择简报文章</span>
      </div>
    </div>
    <div class="update-list">
      <div class="list-header">
        <div class="left">
          已选择 <span>{{"(" + count + ")"}}</span>
        </div>
        <div class="right">
          <router-link :to="{ path: '/update-list', query: {id: id} }" tag="button">返回</router-link>
          <button type="button" @click="save">保存</button>
        </div>
      </div>
      <div class="list-main">
        <div class="table">
          <el-table
            :data="updateReportList"
            style="width: 100%">
            <el-table-column
              align="center"
              label="选择"
              width="100">
              <template slot-scope="scope">
                <el-checkbox :checked="scope.row.status == 1"
                             @change="scope.row.status = scope.row.status == '0' ? '1' : '0'; getCount()"></el-checkbox>
                <!--<el-checkbox v-model="checkedId" :key=""></el-checkbox>-->
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="title"
              label="标题"
              width="200">
            </el-table-column>
            <el-table-column
              align="center"
              prop="source"
              label="来源"
              width="">
            </el-table-column>
            <el-table-column
              align="center"
              prop="time"
              label="时间"
              width="">
            </el-table-column>
            <el-table-column
              align="center"
              prop="summary"
              label="摘要"
              width="400">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank" style="color: #0774ea;">查看详情</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="model-white" v-show="loadingShow">
      <img src="../assets/images/loading.gif" alt="">
    </div>
    <div class="model" v-show="loginState">
      <div class="content">
        <a href="javascript:;">
          <b>!</b>
          登陆过期，请重新登陆。
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery"
  import {Loading} from 'element-ui';

  export default {
    data() {
      return {
        updateReportList: [],
        count: "",
        loginState: false,
        loadingShow: false,
      }
    },
    created() {
      var self = this;
      self.id = self.$route.query.id;
      self.classId = self.$route.query.classId;
      self.updateReport();
    },
    watch: {
      count: function (newCount) {
        if (newCount > 6) {
          this.$alert('每个分类最大选择数量为6篇', '提示', {
            confirmButtonText: '确定'
          });
        }
      }
    },
    mounted() {
      var self = this;

    },
    methods: {
      getCount() {
        var self = this;
        var num = 0;
        self.updateReportList.map(item => {
          if (item.status == 1) {
            num += 1;
          }
        })
        self.count = num;
      },
      save() {
        var self = this;
        var arr = [];
        self.updateReportList.map(item => {
          if (item.status == 1) {
            arr.push(item.id)
          }
        })
        if (arr.length == 0) {
          self.$message({
            showClose: true,
            message: '请至少选择1篇文章',
            type: 'warning',
            center: true
          });
        } else {
          self.$router.push({
            path: "/update-list",
            query: {id: self.id, tradeId: self.classId, contentIds: arr.toString()}
          })
        }
      },
      //获取生成的报表
      updateReport() {
        var self = this;
        // var loadingInstance = Loading.service();
        self.loadingShow = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/content/tradeClassList",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.id,
            classId: self.classId,
          },
          success: function (data) {
            if (data.code == 0) {
              // loadingInstance.close();
              self.loadingShow = false;
              self.updateReportList = data.data.data[0].contents
              self.count = data.data.data[0].use.slice(0, data.data.data[0].use.indexOf("/"))
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "./login.html";
                self.loginState = false;
              }, 2000);
            }
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #update-list .update-list {
    padding-top: 61px;
    padding-bottom: 60px;
    margin-bottom: 60px;
  }

  #update-list .update-list .list-header {
    padding: 0 50px;
    height: 58px;
    line-height: 58px;
  }

  #update-list .update-list .list-header .left {
    float: left;
    font-size: 13px;
    color: #666666;
  }

  #update-list .update-list .list-header .left span {
    color: #ff2041;
  }

  #update-list .update-list .list-header .right {
    float: right;
  }

  #update-list .update-list .list-header .right button {
    width: 150px;
    height: 30px;
    color: #0874ea;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    margin-left: 20px;
    background-color: #fff;
    border: 1px solid #0874ea;
  }

  #update-list .update-list .list-header .right button:hover {
    background-color: #0874ea;
    color: #ffffff;
  }

  #update-list .update-list .list-main {
    /*position: relative;*/
    /*padding-top: 48px;*/
    /*background-color: #f5f5f5;*/
  }

  #update-list .update-list .list-main .table {
    width: 1074px;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 50px;*/
  }

  #update-list .update-list .list-main .table .el-table__header-wrapper {
    background-color: #f5f5f5;
  }

  #update-list .update-list .list-main .table .el-table th {
    background-color: #f5f5f5;
    border: none;
  }

  #update-list .update-list .list-main .table .el-table th > .cell {
    color: #323232;
    font-size: 14px;
  }

  #update-list .update-list .list-main .table .el-table {
    font-size: 12px;
    color: #646464;
  }

</style>
