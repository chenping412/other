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

                bBrandLever: [
                    {
                        label: "独家代理",
                        code: "exclusive",
                        className: 'brand-level-tag-brown'
                    },  {
                        label: "普通代理",
                        code: "agency",
                        className: 'brand-level-tag-green'
                    },
                ],
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
                if(this.$store.state.system==='B'){
                    this.bBrandLever.forEach((item)=>{
                        if(item.code === this.state){
                            this.item = item;
                        }
                    })
                }else {
                    this.$store.state.brandLever.forEach((item)=>{
                        if(item.code === this.state){
                            this.item = item;
                        }
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

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
            border-color: #bdc3c7!important;
            color: #000!important;
        }
        .brand-level-tag-blue {
            background: #3498db;
            border-color: #3498db;
        }

        .brand-level-tag-lightblue {
            background: #0cf;
            border-color: #0cf;
        }

        .brand-level-tag-gray {
            background: #bdc3c7;
            border-color: #bdc3c7;
        }

        .brand-level-tag-ligthgray {
            background: #ecf0f1;
            border-color: #ecf0f1;
        }

        .brand-level-tag-red {
            background: #e74c3c;
            border-color: #e74c3c;
        }

        .brand-level-tag-brown {
            background: #960;
            border-color: #960;
        }

        .brand-level-tag-orange {
            background: #e67e22;
            border-color: #e67e22;
        }

        .brand-level-tag-darkred {
            background: #c0392b;
            border-color: #c0392b;
        }

        .brand-level-tag-green {
            background: #093;
            border-color: #093;
        }

        .brand-level-tag-lightgreen {
            background: #2ecc71;
            border-color: #2ecc71;
        }

        .brand-level-tag-darkblue {
            background: #06c;
            border-color: #06c;
        }
</style>