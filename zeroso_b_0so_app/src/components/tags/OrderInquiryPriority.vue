<template>
    <el-tag
            v-if="state"
            effect="dark"
            :type="state=='high'?'danger':state=='middle'?'warning':null">
        {{item.label}}
    </el-tag>
</template>

<script>
    export default {
        props: ['state'],
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
                this.$store.state.orderInquiryPriority.forEach((item)=>{
                    if(item.code === this.state){
                        this.item = item;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .brand-lever-component {
        vertical-align: middle;
        display: inline-block;
        .brand-level-tag {
            height: 24px;
            padding: 0 8px;
            line-height: 22px;
            display: inline-block;
            font-size: 12px;
            color: #00b9bc;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            white-space: nowrap;
        }
        .brand-level-tag-black-gray {
            background: #bdc3c7!important;
            color: #000!important;
        }
        .brand-level-tag-blue {
            background: #3498db;
        }

        .brand-level-tag-lightblue {
            background: #0cf;
        }

        .brand-level-tag-gray {
            background: #bdc3c7;
        }

        .brand-level-tag-ligthgray {
            background: #ecf0f1;
        }

        .brand-level-tag-red {
            background: #e74c3c;
        }

        .brand-level-tag-brown {
            background: #960;
        }

        .brand-level-tag-orange {
            background: #e67e22;
        }

        .brand-level-tag-darkred {
            background: #c0392b;
        }

        .brand-level-tag-green {
            background: #093;
        }

        .brand-level-tag-lightgreen {
            background: #2ecc71;
        }

        .brand-level-tag-darkblue {
            background: #06c;
        }
    }
</style>