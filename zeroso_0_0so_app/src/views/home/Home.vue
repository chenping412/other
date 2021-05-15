<template>
  <div id="home" :class="{'menu-collapse':isCollapse,'home-menu-vertical':layoutMode==='vertical' }">

    <!--顶部栏-->
    <HomeHeader :isRouterAlive="isRouterAlive"/>
    <div class="clearfix" style="position: relative;">

      <HomeMenu v-if="layoutMode === 'vertical'"/>

      <!--右侧内容区-->
      <div class="content-container" id="content-container">
        <div class="content-container-inner">
          <transition name="router-fade" mode="out-in">
            <router-view v-if="isRouterAlive"/>
          </transition>
        </div>
      </div>
      <el-backtop></el-backtop>

    </div>
    <!--左侧菜单栏-->

  </div>
</template>

<script>
  import HomeMenu from "./HomeMenu";
  import HomeHeader from "./HomeHeader";
  import Vue from "vue";

  export default {
    components:{
      HomeMenu,
      HomeHeader
    },
    provide (){
      return {
        reload:this.reload,
        getUserInfo:this.getUserInfo,
      }
    },
    data() {
      return {
        isRouterAlive:false,
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo;
      },
      isCollapse() {
        return this.$store.state.isCollapse;
      },
      layoutMode() {
        return this.$store.state.layoutMode
      },
    },
    created() {
      let self = this;
      self.getUserInfo();

      self.$router.afterEach(() => {
        self.$nextTick(()=>{
          document.body.scrollTop=document.documentElement.scrollTop=0;
        })
      });
    },
    methods: {

      //获取用户信息
      getUserInfo() {
        let self = this;
        self.$http({
          url: self.$api.account_login,
          success: function (data) {
            if (data.msg && data.msg.login) {
              //初始化一些全局数据
              self.$store.dispatch('storeInit',data).then(()=>{
                self.isRouterAlive=true;
              }).catch(()=>{
                console.log('当前登录账号无绑定公司，或者绑定公司无权限登录该系统！');
                Vue.prototype.$message({
                  showClose: true,
                  message: '当前登录账号无绑定公司，或者绑定公司无权限登录该系统！',
                  type: 'error'
                });
              });
            }else {
              //未登录时，自动跳转到钉钉扫码登录页面
              self.$utils.goToDingDingLoginPage();
            }
          }
        })
      },

      reload () {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "./../../assets/css/config";
  #home {
    min-height: 100%;
    &.home-menu-vertical{
      .content-container{
        margin-left: 200px;
      }
      &.menu-collapse{
        .content-container{
          margin-left: 64px;
        }
      }
    }
    .content-container {
      box-sizing: border-box;
      transition: all 0.2s;
      padding:16px;
      .control-bread {
        padding: 0 5px;
        margin-bottom: 6px;
        margin-top: -10px;
        .el-breadcrumb {
          font-size: 14px;
          line-height: 26px;
          min-height: 26px;
        }
      }
      .container-control{
        .control-search {
          padding: 16px 16px 0;
          background-color: #ffffff;
          margin: 0 0 16px;
          border-radius: 4px;
          -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
          box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
          &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
          }
          .item {
            float: left;
            margin-bottom: 16px;
            margin-right: 16px;
            &>span{
              margin-right: 5px;
              vertical-align: middle;
              line-height: 32px;
            }
            .el-input, .el-select {
              width: 150px;
            }
            .el-date-editor {
              width: 296px;
            }
          }
          .right{
            margin-bottom: 16px;
          }
        }
        .table-control{
          padding: 16px;
          background-color: #ffffff;
          border-radius: 4px 4px 0 0;
          box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        }
        .control-btns{
          float: left;
          .control-batch,
          .control-sort{
            margin-left: 15px;
          }
          .control-sort{
            width: 150px;
          }
        }
        .control-data{
          padding: 16px;
          background-color: #ffffff;
          border-radius: 4px 4px 0 0;
          box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
          margin-bottom: 16px;
        }
      }
      .pagination{
        white-space: nowrap;
        .el-pagination{
          display: inline-block;
          vertical-align: middle;
          padding-right: 0;
        }
      }
      .detail-base-info{
        margin: 0 0 16px;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        .detail-base-title{
          padding: 16px;
          background-color: #ffffff;
          border-bottom: 1px solid #E4E7ED;
          line-height: 31px;
          min-height: 32px;
          &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
          }
          .detail-status{
            float: left;
            span{
              vertical-align: middle;
            }
          }
          .detail-control{
            float: right;
            .control-btns{
              display: inline-block;
              line-height: 31px;
              vertical-align: middle;
            }
            .control-btns+.detail-pagination{
              margin-left: 30px;
            }
          }
        }
        .detail-base-body{
          padding: 16px;
        }
      }

      .car-box{
        background-color: #ffffff;
        margin: 0 0 16px;
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      }
      .container-table{
        background-color: #ffffff;
        padding:0 16px 16px;
        border-radius:0 0 4px 4px;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        min-height: 200px;
      }
    }

    .el-backtop{
      border:1px solid $color-main;
    }
  }

</style>
