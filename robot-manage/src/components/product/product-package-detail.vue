<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/home/product/package' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <h3 class="left">基本信息</h3>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="col1">商品名称：</td>
          <td>{{baseInfo.name}}</td>
          <td class="col1">商品编号：</td>
          <td>{{baseInfo.apiId}}</td>
        </tr>
        <tr>
          <td class="col1">销量：</td>
          <td>{{baseInfo.apiId}}</td>
          <td class="col1">创建时间：</td>
          <td>{{baseInfo.apiId}}</td>
        </tr>
        <tr>
          <td class="col1">可接入类型：</td>
          <td>
            <span v-if="baseInfo.type == '1'">API</span>
            <span v-if="baseInfo.type == '2'">SDK</span>
            <span v-if="baseInfo.type == '3'">API+SDK</span>
          </td>
          <td class="col1">价格：</td>
          <td>¥{{baseInfo.apiId}}</td>
        </tr>
        <tr>
          <td class="col1">规格：</td>
          <td>
            <p>使用时长:{{baseInfo.period}}天</p>
            <p>每日调用上限：{{baseInfo.times}}</p>
            <p>每秒并发量：{{baseInfo.concurrency}}</p>
            <p>超额计费：{{baseInfo.extraFee}}元/1000次</p>
          </td>
          <td class="col1"></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>



  </div>
</template>

<script>
export default {
  data() {
    return {
      id:'',
      baseInfo:{}
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getProductDetail();
    }
  },
  methods: {
    //获取商品详情
    getProductDetail:function(){
      var self = this;
      self.$http({
        url: apiHost + "/goods/detail",
        data: {
          id:self.id
        },
        success: function (data) {
          if (data.code == 0 && data.data) {
            self.baseInfo=data.data;
          }
        }
      });
    }

  }
};
</script>

<style>

</style>
