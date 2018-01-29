<template>
  <div id="index">
    <div class="aside-menu">
      <ul>
        <li>
          <router-link :to="{ path: '/index/write' }">写作类</router-link>
        </li>
        <li>
          <router-link :to="{ path: '/index/resource' }">整合类</router-link>
        </li>
        <li>
          <router-link :to="{ path: '/index/data' }">报告类</router-link>
        </li>
      </ul>
    </div>
    <div class="index-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    }
  }
</script>

<style>
  #index {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }

  #index .aside-menu {
    float: left;
    width: 165px;
    height: 650px;
    background-color: #fff;
    box-shadow: 3px 6px 6px #ebebeb;
  }

  #index .aside-menu ul li a {
    display: block;
    line-height: 45px;
    font-size: 14px;
    color: #333333;
    text-align: center;
  }

  #index .aside-menu ul li a.router-link-exact-active {
    color: #0874ea;
    background-color: #f5f5f5;
    border-left: 2px solid #0784ea;
  }

  #index .index-main {
    width: 898px;
    float: right;
  }
</style>
