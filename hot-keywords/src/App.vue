<template>
  <div id="app">
    <div class="header">
      <div class="logo">热词管理工具</div>
      <div class="user">
        <span>欢迎您，admin</span>
      </div>
    </div>
    <div class="main">
      <div class="menu">
        <el-menu :default-active="active" active-text-color="#409EFF" router>
          <el-menu-item index="/hot-keywords">
            <i class="el-icon-star-on"></i>
            <span slot="title">热词管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="content-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        active:'/'
      }
    },
    created() {
      var self=this;
      self.menuActive();
      self.$router.afterEach(function () {
        self.menuActive();
      })
    },
    methods: {
      menuActive:function(){
        var path=this.$route.path.split('/');
        if(path[1]) this.active='/'+path[1];
      }
    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    min-width: 1100px;
    position: relative;
    font-size: 14px;
    color: #333333;
  }
  #app .header {
    width: 100%;
    height: 60px;
    background-color: #409EFF;
    color: #ffffff;
  }
  #app .header .logo{
    float: left;
    font-size: 20px;
    line-height: 60px;
    padding:0 0 0 20px;
  }
  #app .header .user{
    float: right;
    line-height: 60px;
    padding:0 40px 0 0;
  }
  #app .main{
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  #app .main .menu{
    position: absolute;
    left: 0;
    top:0;
    width: 200px;
    height: 100%;
    background-color: #eef1f6;
    border-right: solid 1px #e6e6e6;
  }
  #app .main .content-container{
    position: absolute;
    left: 200px;
    top:0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 20px;
  }
  #app .content-container .breadcrumb{

  }
  #app .content-container .control{
    background: #eef1f6;
    padding: 10px 10px 0;
    margin: 10px 0;
  }
  #app .content-container .control:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  #app .content-container .control .item{
    display: inline-block;
    line-height: 36px;
    padding-bottom: 10px;
    margin-right: 20px;
  }
  #app .content-container .control .item .el-input{
    width: 150px;
  }
  #app .content-container .table{
    border: 1px solid #dfe6ec;
  }
  #app .content-container .pagination{
    padding: 10px;
  }
  #app .content-container .pagination:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  #app .content-container .pagination .el-pagination{
    float: right;
  }

  #app .content-container .example{
    width: 350px;
    padding-left: 40px;
  }
  #app .content-container .example .el-input{
    width: 250px;
  }
  #app .content-container .example .pagination{
    padding:10px 0;
  }
  #app .content-container .example .el-pagination__editor{
    width: 50px;
  }
  #app .content-container .example .el-pagination__jump{
    margin-left: 5px;
  }
  #app .content-container .example .list li{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
  #app .content-container .example .list li:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  #app .content-container .example .list li .title{
    font-size: 16px;
    margin-bottom: 5px;
  }
  #app .content-container .example .list li .title a{
    font-size: 14px;
  }
  #app .content-container .example .list li p.hide{
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    max-height: 60px;
  }
  #app .content-container .example .list li a{
    float: right;
    color: #409EFF;
  }

  #app .btn {
    display: inline-block;
    font-size: 12px;
    border-radius: 3px;
    padding: 10px 16px;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    font-weight: 500;
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
  }
  #app .btn:focus, #app .btn:hover {
    background: #66b1ff;
    border-color: #66b1ff;
  }
  #app table a {
    display: inline-block;
    color: #409EFF;
    margin: 2px;
    line-height: 18px;
  }
  #app  .pre{
    display: none;
  }
  #app .prefix{
    position: relative;
  }
  #app .prefix .pre{
    display: block;
    position: absolute;
    left: 18px;
    top:0;
    z-index: 99;
  }
  #app .prefix .el-input__inner{
    padding-left: 35px;
  }

  /*elementUI样式覆盖*/
  #app .el-menu{
    background-color: #eef1f6;
    border-right: 0;
  }
  #app .el-menu-item.is-active{
    background-color: #d1dbe5;
  }
  #app .el-table .cell{
    text-align: center;
  }
  #app .el-table th {
    background-color: #eef1f6;
  }
  #app .el-table td, .el-table th{
    padding: 8px 0;
  }



</style>
