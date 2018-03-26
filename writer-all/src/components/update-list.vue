<template>
  <div id="update-list">
    <div class="top">
      <div class="breadcrumb">
        <router-link :to="{ path: '/index?index='+menuIndex }">报告写作</router-link>
        &gt;
        <router-link :to="{ path: '/classify?index='+menuIndex }">行业简报信息页</router-link>
        &gt;
        <span>选择修改简报分类</span>
      </div>
    </div>
    <div class="update-list">
      <div class="list-header">
        <div class="left">
          已选择 <span>{{"(" + count + ")"}}</span>
        </div>
        <div class="right">
          <router-link :to="{ path: '/content?index='+menuIndex, query: { id: id } }" tag="button">重新生成简报</router-link>
        </div>
      </div>
      <div class="list-main">
        <div class="table">
          <el-table
            :data="updataList"
            style="width: 100%">
            <el-table-column
              align="center"
              prop="className"
              label="分类"
              width="">
            </el-table-column>
            <el-table-column
              align="center"
              prop="use"
              label="已选择"
              width="180">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="已选择文章标题"
              width="500">
              <template slot-scope="scope">
                <p v-for="(list, index) in scope.row.contents" v-show="list.status == 1" style="text-align: left">
                  {{ list.title }}</p>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <router-link :to="{ path: '/update-detail?index='+menuIndex, query: { id: id, classId: scope.row.classId }}"
                             tag="span" style="color: #0874ea; cursor: pointer">修改
                </router-link>
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
        updataList: [],
        id: "",
        tradeId: "",
        contentIds: "",
        count: "",
        loginState: false,
        loadingShow: false,
        menuIndex: 0,
      }
    },
    created() {
      if(this.$route.query.index){
        this.menuIndex=this.$route.query.index;
      }

      var self = this;
      self.id = self.$route.query.id;
      if (self.$route.query.contentIds) {
        self.tradeId = self.$route.query.tradeId;
        self.contentIds = self.$route.query.contentIds;
        self.updateReport();
      } else {
        self.createReport();
      }
    },
    methods: {
      //获取生成的报表
      createReport() {
        var self = this;
        // var loadingInstance =Loading.service();
        self.loadingShow = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/content/tradeList",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.id,
//            id: "7",
          },
          success: function (data) {
            if (data.code == 0) {
              // loadingInstance.close();
              self.loadingShow = false;
              self.updataList = data.data.data;
              self.getCount();
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "../login.html";
                self.loginState = false;
              }, 2000);
            }
          }
        })
      },
      //获取已选择数字
      getCount() {
        var self = this;
        var num = 0;
        self.updataList.map(item => {
          item.contents.map(list => {
            if (list.status == 1) {
              num++;
            }
          })
        })
        self.count = num;
      },
      updateReport() {
        var self = this;
        // var loadingInstance =Loading.service();
        self.loadingShow = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/content/update",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.id,
            classId: self.tradeId,
            contentIds: self.contentIds,
          },
          success: function (data) {
            if (data.code == 0) {
              // loadingInstance.close();
              self.loadingShow = false;
              self.updataList = data.data.data;
              self.getCount();
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "../login.html";
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
    background-color: #fff;
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
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    background-color: #fff;
    color: #0874ea;
    border: 1px solid #0874ea;
  }

  #update-list .update-list .list-header .right button:hover {
    background-color: #0874ea;
    color: #fff;
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
