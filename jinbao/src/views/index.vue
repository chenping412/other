<template>
  <div id="index">
    <div class="header">
      <h1 class="header-log">GIISO - 晶报</h1>
      <div class="user">
        <el-dropdown>
          <span class="el-dropdown-link">
            智搜
            <img src="../assets/images/user_icon.jpg" alt="">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户</el-dropdown-item>
            <el-dropdown-item>修改资料</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="aside">
      <!--<el-menu-->
        <!--:default-active="activeIndex"-->
        <!--:unique-opened="true"-->
        <!--class="el-menu-vertical-demo">-->
        <!--<el-submenu :index="list.id+''" v-for="list in menuList">-->
          <!--<template slot="title">-->
            <!--<i class="el-icon-location"></i>-->
            <!--<span>{{list.name}}</span>-->
          <!--</template>-->
          <!--<el-menu-item-group>-->
            <!--<template slot="title"></template>-->
            <!--<el-menu-item v-for="item in list.data" :index="item.parent_id + '-' + item.id">{{item.name}}</el-menu-item>-->
          <!--</el-menu-item-group>-->
        <!--</el-submenu>-->
      <!--</el-menu>-->
      <el-menu
        :default-active="activeIndex"
        :unique-opened="true"
        :router="true"
        class="el-menu-vertical-demo">
        <el-submenu :index="list.id +''" v-for="list in menuList" :key="list.id">
          <template slot="title">
            <span>{{list.name}}</span>
          </template>
          <el-menu-item-group v-if="list.data && list.data.length>0">
            <!--<template slot="title">{{list.name}}</template>-->
            <el-menu-item :index="item.parent_id+'-'+ item.id" v-for="item in list.data" :key="item.id"
                          @click="matchRouter(item.name)">{{item.name}}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        activeIndex: "1-3",
        menuList: [],
      }
    },
    created() {
      this.getMenuList();
      this.activeIndex = location.hash.slice(1);
      console.log(this.activeIndex)
    },
    mounted: function () {},
    methods: {
      //获取菜单树
      getMenuList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/get_menu_list",
          type: "post",
          data: {
            user_id: 1
          },
          success: function (data) {
            if (data.code == 0) {
              self.menuList = data.data;
              self.$nextTick(function () {
                self.activeIndex = '1-4'
              })
            }
          },
          error: function () {
          }
        })
      },
      //路由匹配
      matchRouter(val) {
        if (val == "用户管理") {
          this.$router.push('/index/user-mgr')
        }
        if (val == "权限管理") {
          this.$router.push('/index/power-mgr')
        }
        if (val == "功能管理") {
          this.$router.push('/index/func-mgr')
        }


        if (val == "大咖列表") {
          this.$router.push('/index/daka-list')
        }
        if (val == "普通频道") {
          this.$router.push('/index/news-channel')
        }
        if (val == "热词管理") {
          this.$router.push('/index/news-hots')
        }
        if (val == "自动采编库") {
          this.$router.push('/index/news-zidongcaibianku')
        }
        if (val == "大咖稿件库") {
          this.$router.push('/index/news-dakagaojianku')
        }
        if (val == "内部稿件库") {
          this.$router.push('/index/news-neibugaojianku')
        }
        if (val == "资讯库") {
          this.$router.push('/index/news-zixunku')
        }
        if (val == "专题管理") {
          this.$router.push('/index/news-subject')
        }
        if (val == "积分类型") {
          this.$router.push('/index/integral-type')
        }
        if (val == "积分账户") {
          this.$router.push('/index/integral-account')
        }
        if (val == "积分业务") {
          this.$router.push('/index/integral-yewu')
        }
        if (val == "用户列表") {
          this.$router.push('/index/user-list')
        }
        if (val == "大咖短视频") {
          this.$router.push('/index/master-short-video')
        }
        if (val == "媒体库") {
          this.$router.push('/index/media-library')
        }
        if (val == "内部短视频") {
          this.$router.push('/index/inner-short-video')
        }
        if (val == "短视频分类") {
          this.$router.push('/index/short-video-classify')
        }
      }
    }
  }
</script>

<style lang="less">
  #index {
    width: 100%;
    height: 100%;
    .header {
      width: 100%;
      height: 60px;
      background-color: #20a0ff;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      h1 {
        float: left;
        line-height: 60px;
        width: 190px;
        font-size: 22px;
        padding: 0 20px;
        color: #fff;
        border-right: 1px solid rgba(238, 241, 146, 0.3);
      }
      .user {
        float: right;
        line-height: 60px;
        margin-right: 35px;
        /*background: url("../assets/images/user_icon.jpg") right center no-repeat;*/
        /*background-size: 40px 40px;*/
        color: #ffffff;
        span {
          display: block;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
          img {
            width: 40px;
            height: 40px;
            margin-top: 10px;
            float: right;
            margin-left: 15px;
          }
        }

      }
    }
    .aside {
      position: fixed;
      top: 60px;
      bottom: 0;
      left: 0;
      width: 230px;
      background-color: #eef1f6;
      z-index: 999;
      .menu-parent {
        & > li > a {
          display: block;
          line-height: 50px;
          color: #48576a;
          font-size: 14px;
          padding: 0 40px;
          position: relative;
        }
        & > li > ul {
          background-color: #fff;
          & > li > a {
            display: block;
            line-height: 50px;
            color: #48576a;
            font-size: 14px;
            padding: 0 40px;
            &:hover {
              background-color: #f1f2f6;
            }
            &.active {
              color: #20a0ff
            }
          }
        }
      }
    }
    .main {
      background-color: #fff;
      padding-top: 70px;
      padding-left: 250px;
      padding-right: 20px;
      .breadcrumb {
        padding: 15px 0;
        border-bottom: 1px solid #ddd;
      }
    }
  }
</style>
