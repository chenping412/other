<template>
  <div id="app">
    <div class="header">
      <div class="header-content clearfix">
        <h1>机器人商店运营后台</h1>
        <div class="logout">
          <span class="user-name">欢迎您</span>
          <el-button type="primary" size="small" @click="logout">退出</el-button>
        </div>
        <ul class="nav clearfix">
          <li>
            <router-link :to="{path: '/user-index'}" tag="a">用户管理</router-link>
          </li>
          <li>
            <router-link :to="{path: '/order'}" tag="a">订单列表</router-link>
          </li>
          <li>
            <router-link :to="{path: '/product'}" tag="a">产品管理</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="main clearfix">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  export default {
    data() {
      return {};
    },
    methods: {
      logout() {
        var self = this;
        $.ajax({
          url: apiHost + "/auth/logout",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (msg) {
            location.href = backToLogin;
          }
        });
      }
    }
  };
</script>

<style>
  #app {
    font-size: 14px;
  }

  #app .header {
    width: 100%;
    background-color: #409EFF;
    color: #fff;
  }

  #app .header-content {
    width: 1100px;
    margin-left: auto;
    margin-right: auto;
  }

  #app .header-content h1 {
    float: left;
    font-size: 20px;
    line-height: 56px;
  }

  #app .header-content .nav {
    float: right;
  }

  #app .header-content .logout {
    float: right;
    margin-top: 14px;
    margin-left: 40px;
  }

  #app .header-content .logout .user-name {
    margin-right: 15px;
    font-size: 14px;
  }

  #app .header-content .nav li {
    float: left;
  }

  #app .header-content .nav li a {
    display: block;
    line-height: 60px;
    font-size: 14px;
    padding: 0 25px;
    color: #fff;
  }

  #app .header-content .nav li a.router-link-exact-active,
  #app .header-content .nav li a.router-link-active {
    /* border-bottom: 2px solid #3363f9; */
    color: #409EFF;
    background-color: #fff;
  }

  #app .main {
    width: 1100px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 12px;
    margin-bottom: 150px;
  }

  #app .main .main-content {
    float: right;
    width: 933px;
    min-height: 600px;
    background-color: #fff;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding-bottom: 50px;
  }

  #app .main .sidebar {
    float: left;
    width: 160px;
    min-height: 650px;
    background-color: #ffffff;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }

  #app .main .main-content .breadcrumb {
    padding: 18px 0 18px 18px;
    box-shadow: 0 4px 5px #f5f5f5;
    margin-bottom: 5px;
    background-color: #fff;
  }

  #app .model {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99999999;
  }

  #app .pagination {
    float: right;
    margin-top: 15px;
    padding-right: 15px;
  }

  #app .model .content {
    width: 260px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -130px;
    background-color: #fff;
    border-radius: 4px;
  }

  #app .model .content a {
    display: block;
    text-align: center;
    line-height: 20px;
    margin-top: 20px;
  }

  #app .model .content a b {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    color: #f44444;
    border: 1px solid #f44444;
    margin-right: 10px;
  }

  #app .btn {
    display: inline-block;
    font-size: 12px;
    border-radius: 3px;
    padding: 9px 15px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    font-weight: 500;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  #app .padding20 {
    padding: 10px 20px;
  }

  #app .box {
    box-shadow: 0 4px 5px #f5f5f5;
    margin-bottom: 20px;
    padding: 15px 20px 0;
  }

  #app .div-row {
    box-shadow: 0 4px 5px #f5f5f5;
    margin-bottom: 20px;
    padding: 10px 20px 20px;
  }

  #app .div-row h3 {
    font-size: 14px;
    margin: 15px 0;
  }

  #app .div-row .top {
    margin: 15px 0;
    line-height: 32px;
  }

  #app .div-row .top h3 {
    margin: 0;
  }

  #app .add {
    padding-left: 18px;
    margin-bottom: 18px;
    margin-top: 18px;
  }

  #app .sidebar h2 {
    line-height: 50px;
    font-size: 16px;
    color: #111111;
    padding-left: 20px;
  }

  #app .sidebar-nav li a {
    display: block;
    line-height: 40px;
    padding-left: 38px;
    font-size: 14px;
    color: #111;
    border-left: 2px solid transparent;
  }

  #app .main .sidebar .sidebar-nav li a.router-link-exact-active,
  #app .main .sidebar .sidebar-nav li a.router-link-active {
    background-color: #eee;
    border-left: 2px solid #409EFF;
  }

  #app .el-select {
    width: 100%;
  }

  #app .el-form-item {
    margin-bottom: 15px;
  }

  #app .el-form-item__error {
    padding-top: 0;
  }

  #app .el-card__header {
    line-height: 32px;
  }

  #app table a {
    display: inline-block;
    color: #409EFF;
    margin: 2px;
    line-height: 18px;
  }

  #app .el-table thead th {
    background: #f5f7fa;
    border-top: 1px solid #ebeef5;
  }

  #app .el-table {
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
  }

  #app .el-table .el-table__body-wrapper .cell {
    padding: 0 5px;
    font-size: 12px;
    line-height: 20px;
  }

  #app .el-dialog {
    padding-bottom: 10px;
  }

  #app .el-dialog__title {
    font-size: 14px;
  }

  #app .el-dialog__body {
    padding: 10px 20px;
  }

  #app .info-table {
    width: 100%;
    border-collapse: collapse;
  }

  #app .info-table td {
    padding: 12px;
    border: 1px solid #ebeef5;
  }

  #app .info-table .col1 {
    background-color: #f5f7fa;
    width: 150px;
  }

  #echarts, .echarts {
    height: 400px;
  }
</style>
