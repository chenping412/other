<template>
  <div id="product-index">
    <div class="sidebar">
      <h2><i class="el-icon-menu"></i> 产品管理</h2>
      <ul class="sidebar-nav">
        <li>
          <router-link :to="{path: '/home/product/robot'}">机器人列表</router-link>
          <router-link :to="{path: '/home/product/service'}">服务列表</router-link>
          <router-link :to="{path: '/home/product/package'}">套餐管理</router-link>
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
