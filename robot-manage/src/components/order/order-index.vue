<template>
  <div id="order-index">
    <div class="sidebar">
      <h2><i class="el-icon-menu"></i> 订单管理</h2>
      <ul class="sidebar-nav">
        <li>
          <router-link :to="{path: '/order/list'}">订单列表</router-link>
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
