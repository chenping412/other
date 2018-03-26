<template>
  <div id="classify">
    <div class="top">
      <!--<h2>选择生成简报信息</h2>-->
      <div class="breadcrumb">
        <router-link :to="{ path: '/index?index='+menuIndex }">报告写作</router-link>
        &gt;
        <span>生成简报</span>
      </div>
    </div>
    <div class="build">
      <div class="date clearfix">
        <div class="start">
          <span class="label">开始日期</span>
          <el-date-picker
            @change="startDateChange"
            v-model="startDate"
            type="date"
            :clearable=false
            :editable=false
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="end">
          <span class="label">结束日期</span>
          <el-date-picker
            @change="endDateChange"
            v-model="endDate"
            type="date"
            :clearable=false
            :editable=false
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="check">
        <div class="all-check clearfix">
          <div class="all-check-left">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="CheckAllChange">全选
            </el-checkbox>
          </div>
          <div class="all-check-right">已选择<span>{{ "(" + checkTrades.length + ")" }}</span></div>
        </div>
        <div class="check-list">
          <el-checkbox-group v-model="checkTrades" @change="checkTradesChange">
            <el-checkbox v-for="trade in allTrades" :label="trade.classId" :key="trade.id">{{trade.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="btn">
        <button type="button" @click="createReport">生成简报</button>
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
        startDate: "",
        endDate: "",
        checkAll: false,
        checkTrades: [],
        allTrades: [],
        isIndeterminate: true,
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
      self.startDate = new Date(new Date().getTime()-3*24*60*60*1000);
      self.endDate = new Date();
      self.getTradesData();
    },
    methods: {
      //获取行业类别
      getTradesData() {
        var self = this;
        // var loadingInstance = Loading.service();
        self.loadingShow = true;
        self.allTrades = [];
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/trade/list",
          type: "post",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (data) {
            if (data.code == '0') {
              // loadingInstance.close();
              self.loadingShow = false;
              self.allTrades = data.data;
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
      //全选
      CheckAllChange(val) {
        var self = this;
        self.checkTrades = [];
        if (val) {
          self.allTrades.map(item => {
            self.checkTrades.push(item.classId)
          })
        }
        else {
          self.checkTrades = [];
        }
        self.isIndeterminate = false;
      },
      checkTradesChange(value) {
        console.log(value)
        let checkedCount = value.length;
        this.checkAll = checkedCount == this.allTrades.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allTrades.length;
      },
      //获取生成报表生成报表
      createReport() {
        var self = this;
        if (self.checkTrades.length == 0) {
          self.$notify({
            title: '提示',
            message: '请至少选择一项行业类别',
            type: 'warning',
            offset: 300
          });
          return false
        }
        var ids = self.checkTrades.toString();
        var st = self.formatDate(self.startDate);
        var et = self.formatDate(self.endDate);
        self.$router.push({path: '/content?index='+self.menuIndex, query: {classId: ids, sdate: st, edate: et}})
      },
      //开始日期选择
      startDateChange(val) {
        var self = this;
        var nt = new Date().getTime()
        var st = val.getTime();
        if (nt - st > 365 * 24 * 60 * 60 * 1000) {
          self.$notify({
            title: '提示',
            message: '开始日期不能选择一年之前',
            type: 'warning',
            offset: 300
          });
          self.startDate = new Date(new Date().getTime()-3*24*60*60*1000);
        }
      },
      //结束日期选择
      endDateChange(val) {
        var self = this;
        var st = self.startDate.getTime();
        var et = val.getTime();
        if (et - st > 30 * 24 * 60 * 60 * 1000 || et - st < 0) {
          self.$notify({
            title: '提示',
            message: '从开始日期到结束日期，最少一天，最多31天',
            type: 'warning',
            offset: 300
          });
          self.endDate = new Date();
        }
      },
      //日期格式化
      formatDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #classify .build {
    padding-left: 52px;
    padding-right: 52px;
    background-color: #fff;
    padding-bottom: 40px;
    padding-top: 61px;
  }

  #classify .build .date {
    border-bottom: 1px solid #e6e6e6;
    padding: 13px 0;
  }

  #classify .build .date .start, #classify .build .date .end {
    float: left;
  }

  #classify .build .date .start {
    margin-right: 30px;
  }

  #classify .build .date .label {
    font-size: 13px;
    color: #666;
    margin-right: 15px;
  }

  #classify .build .date .el-input__inner {
    height: 30px;
  }

  #classify .build .date .el-input__icon {
    line-height: 30px;
  }

  #classify .build .check .all-check {
    line-height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #e6e6e6;
  }

  #classify .build .check .all-check .all-check-left {
    float: left;
  }

  #classify .build .check .all-check .all-check-right {
    float: left;
    font-size: 13px;
    color: #666666;
    margin-left: 35px;
  }

  #classify .build .check .all-check .all-check-right span {
    color: #ff2041;
    margin-left: 7px;
  }

  #classify .build .check .check-list {
    overflow: hidden;
  }

  #classify .build .check .check-list .el-checkbox {
    width: 20%;
    margin: 0;
    padding: 20px 0;
    position: relative;
  }

  #classify .build .check .check-list .el-checkbox:after {
    display: block;
    content: "";
    width: 500%;
    height: 1px;
    background-color: #e6e6e6;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  #classify .build .btn {
    text-align: center;
    margin-top: 30px;
  }

  #classify .build .btn button {
    width: 150px;
    height: 30px;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    margin-left: 20px;
    background-color: #0874ea;
  }
</style>
