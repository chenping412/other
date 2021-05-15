<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                :size="size"
                filterable
                remote
                :placeholder="placeholder || '请输入品牌关键词'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                popper-class="select-brand"
                clearable
                :disabled="disabled"
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
                <span class="col" v-html="replaceBolder(item.name,queryKeyword)"></span>
                <BrandLever class="right" style="margin-left: 10px;" :state="item.state"></BrandLever>
            </el-option>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['brand','brandId','option','placeholder','disabled','size'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],

                queryKeyword:'',
            }
        },
        watch:{
            brandId(){
                this.selectValue = this.brandId;
            },
            brand(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.brandId) {
                    this.selectValue = this.brandId;
                }else if(this.brand && this.brand.id) {
                    this.selectValue = this.brand.id;
                }else {
                    this.selectValue = '';
                }
                if(!this.selectOption || this.selectOption.length<=0){
                    if(this.option) {
                        this.selectOption = this.option;
                    }else {
                        this.selectOption = [];
                    }
                }
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.queryKeyword ='';
                    self.$http({
                        url: self.$api.product_brands_search,
                        type: 'GET',
                        data: {
                            brand_name:query || ''
                        },
                        success: function (data) {
                            self.queryKeyword=query;
                            self.selectLoading = false;
                            if (data.msg && data.msg.items) {
                                self.selectOption = data.msg.items;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },
            selectChange(val){
                this.$emit('update:brandId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:brand',{
                            id:item.id,
                            name:item.name,
                            state:item.state,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.selectOption = [];
                this.queryKeyword ='';
                this.$emit('update:brandId',null);
                this.$emit('update:brand',{});
                this.$emit('change',{});
            },


            replaceBolder(text, keyWord) {
                if (!text || !keyWord) return text;
                let text2 = text.toLowerCase().replace(/^\s+|\s+$/gm, '');
                let keyWord2 = keyWord.toLowerCase().replace(/^\s+|\s+$/gm, '');
                let index = text2.indexOf(keyWord2);
                if (index > -1) {
                    let start = index;
                    let end = index + keyWord2.length;
                    return text.slice(0, start) + '<b>' + text.slice(start, end) + '</b>' + text.slice(end)
                } else {
                    return text;
                }
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
    @import "src/assets/css/config";
    .select-brand{
        .col{
            b {
                color: $color-main;
            }
        }
    }
</style>