<template>
  <div id="index">
    <div class="main">
      <Header></Header>
      <MainTop></MainTop>
      <div class="main-content clearfix">
        <div class="aside">
          <ul>
            <li>
              <router-link :to="{path: '/index/article'}">我的文章</router-link>
            </li>
            <li>
              <router-link :to="{path: '/index/video'}">短视频</router-link>
            </li>
            <!--<li>-->
              <!--<a href="">直播</a>-->
            <!--</li>-->
          </ul>
        </div>
        <div class="detail">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../components/header.vue'
  import MainTop from '../components/main-top.vue'
  export default {
    components: {
      Header,
      MainTop,
    },
    data() {
      return {}
    },
  }
</script>

<style lang="scss">
  #index {

    .main {

      .main-content {
        width: 1100px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px;
        .aside {
          float: left;
          width: 160px;
          min-height: 600px;
          box-shadow: 3px 3px 5px #ddd;
          background-color: #f1f2f6;
          ul {
            li {
              a {
                display: block;
                line-height: 40px;
                padding-left: 40px;
                font-size: 14px;
                &.router-link-exact-active {
                  background-color: skyblue;
                  border-left: 2px solid #0074ea;
                  color: #fff;
                }
              }
            }
          }
        }
        .detail {
          float: left;
          width: 910px;
          margin-left: 10px;
          padding-left: 20px;
        }
      }
    }
  }
</style>
