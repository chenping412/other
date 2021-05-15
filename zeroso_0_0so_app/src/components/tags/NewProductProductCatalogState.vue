<template>
    <el-tag :size="size"
            v-if="item && item.code"
            effect="dark"
            :class="item.className">
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
                this.$store.state.newProductProductCatalogState.forEach((item)=>{
                    if(item.code === this.state){
                        this.item = item;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

        .new-product-price-state-tag {
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
        .new-product-price-state-tag-black-gray {
            background: #bdc3c7!important;
            border-color: #bdc3c7!important;
            color: #000!important;
        }
        .new-product-price-state-tag-blue {
            background: #3498db;
            border-color: #3498db;
        }

        .new-product-price-state-tag-lightblue {
            background: #0cf;
            border-color: #0cf;
        }

        .new-product-price-state-tag-gray {
            background: #bdc3c7;
            border-color: #bdc3c7;
        }

        .new-product-price-state-tag-ligthgray {
            background: #ecf0f1;
            border-color: #ecf0f1;
        }

        .new-product-price-state-tag-red {
            background: #e74c3c;
            border-color: #e74c3c;
        }

        .new-product-price-state-tag-brown {
            background: #960;
            border-color: #960;
        }

        .new-product-price-state-tag-orange {
            background: #e67e22;
            border-color: #e67e22;
        }

        .new-product-price-state-tag-darkred {
            background: #c0392b;
            border-color: #c0392b;
        }

        .new-product-price-state-tag-green {
            background: #093;
            border-color: #093;
        }

        .new-product-price-state-tag-lightgreen {
            background: #2ecc71;
            border-color: #2ecc71;
        }

        .new-product-price-state-tag-darkblue {
            background: #06c;
            border-color: #06c;
        }
</style>