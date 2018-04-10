<template>
  <div id="user-index">
    <div class="sidebar">
      <h2><i class="el-icon-menu"></i> 用户管理</h2>
      <ul class="sidebar-nav">
        <li>
          <router-link :to="{path: '/home/user-index/user-normal'}">普通用户</router-link>
          <router-link :to="{path: '/home/user-index/user-agent'}">代理商</router-link>
        </li>
      </ul>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>

</style>
