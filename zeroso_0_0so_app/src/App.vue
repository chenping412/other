<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  export default {
    name: 'app',
    components: {
    },
    created() {
      this.copy();
    },
    methods: {
      copy(){
        let self = this;
        let clipboard = new Clipboard('.clipboard-button');

        //复制成功执行的回调，可选
        clipboard.on('success', function() {
          self.$message({
            showClose: true,
            message: '复制成功!',
            type: 'success'
          });
        });

        //复制失败执行的回调，可选
        clipboard.on('error', function() {
          self.$message({
            showClose: true,
            message: '复制失败，可能浏览器不支持!',
            type: 'error'
          });
        });
      }
    }
  }

</script>

<style>

</style>
