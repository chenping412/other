<template>
    <el-tag :size="size"
            v-if="item && item.code"
            :type="item.type"
            effect="dark">
        {{item.label}}
    </el-tag>
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
                this.$store.state.newBrandAuditState.forEach((item)=>{
                    if(item.code === this.state){
                        this.item = item;
                    }
                })
            }
        },
    }
</script>
