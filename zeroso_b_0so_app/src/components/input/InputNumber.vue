<template>
  <el-input type="number" :min="minNumber" v-model="number" :placeholder="placeholder"
            :disabled="disabled"
            :clearable="clearable"
            @clear="clickClear"
            @input="numberChange">
    <template slot="append">
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script>
  export default {
    props: ['value', 'min', 'max', 'minus', 'placeholder', 'clearable', 'integer', 'disabled', 'round'],
    data() {
      return {
        number: '',
        minNumber: this.minus ? -Infinity : 0,
      }
    },
    watch: {
      value() {
        this.init()
      },
      number(val) {
        if (val === '' || !val) {
          this.updateValue(val);
        } else if (this.integer && !(/^-?\d+$/.test(val))) {
          this.number = parseInt(val)
        } else if (val < this.minNumber) {
          this.number = this.minNumber;
        } else if (this.max && val * 1 > this.max) {
          this.number = this.max;
        } else if (this.round && val.toString().indexOf('.') > -1 && (val.toString().length - val.toString().indexOf('.') -1) > Number(this.round)){
            this.number = Math.floor(val * (Math.pow(10, this.round))) / Math.pow(10, this.round);
        }else {
          this.$emit('update:value', val);
        }
      },
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.number = this.value;
        if (this.min) this.minNumber = this.min * 1;
      },
      clickClear() {
        this.$emit('clear', this.number);
      },
      numberChange(val) {
        this.updateValue(val)
        this.$emit('change', val)
      },
      updateValue(val){
        if(val==='') val = undefined;
        this.$emit('update:value', val);
      },
    },
  }
</script>

<style lang="scss">

</style>