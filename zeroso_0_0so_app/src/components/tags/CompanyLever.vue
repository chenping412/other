<template>
    <span>
        <el-tag style="margin: 0" :size="size" v-if="item && item.code" effect="dark" :class="item.className">{{item.label}}</el-tag>
    </span>
</template>

<script>
    export default {
        props: ['state','size'],
        data() {
            return {
                item:{},
            }
        },
        watch:{
          state(){
              this.init();
          }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.item={};
                this.$store.state.companyLevel.forEach((item)=>{
                    if(item.code === this.state){
                        this.item = item;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/css/config";
        .partner-level-tag-gray {
            background: #9e9e9e;
            border-color: #9e9e9e;
        }
        .partner-level-tag-lightgreen {
            background: $color-main;
            border-color: $color-main;
        }
</style>