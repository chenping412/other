<template>
    <span>
        <el-tag v-if="state" effect="dark" :class="item.className">{{item.label}}</el-tag>
    </span>
</template>

<script>
  export default {
    props: ['state'],
    data() {
      return {
        item: {},
      }
    },
    watch: {
      state() {
        this.init();
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.$store.state.supplierInquiryState.forEach((item) => {
          if (item.code === this.state) {
            this.item = item;
          }
        })
      }
    },
  }
</script>

<style lang="scss" scoped>

  .inquiry-sheet-state-tag-create {
    background: #03CDC0;
    border-color: #03CDC0;
  }

  .inquiry-sheet-state-tag-blue {
    background: #3498db;
    border-color: #3498db;
  }

  .inquiry-sheet-state-tag-orange {
    background: #e67e22;
    border-color: #e67e22;
  }
  .inquiry-sheet-state-tag-green {
    background: #67C23A;
    border-color: #67C23A;
  }

  .inquiry-sheet-state-tag-gray {
    background: #bdc3c7;
    border-color: #bdc3c7;
  }


</style>