<template>
    <div>
        <el-select
                v-model="selectValue"
                :size="size"
                filterable
                remote
                :placeholder="placeholder || '型号、订货号'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :disabled="disabled"
                popper-class="select-product"
                :loading="selectLoading">

            <div class="option-header">
                <span class="col">品牌</span>
                <span class="col">型号</span>
                <span class="col">订货号</span>
                <span class="col">状态</span>
            </div>
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="labelOnlyShowProductName ? item.product_name : labelOnlyShowProductOrderNo ? item.product_order_no : (item.product_name||'')+'，'+(item.product_order_no||'')"
                       :disabled="disabledInvalidProduct && (item.is_valid === 0 || item.is_replaced === 1 || item.is_3C === 1)"
                       :class="{'is_valid':disabledInvalidProduct && (item.is_valid === 0 || item.is_replaced === 1 || item.is_3C === 1)}">
                    <span class="col">{{item.brand_name}}</span>
                    <span class="col" v-html="replaceBolder(item.product_name,queryKeyword)"></span>
                    <span class="col" v-html="replaceBolder(item.product_order_no,queryKeyword)"></span>
                    <span class="col">
                        <el-tag type="warning" v-if="item.is_valid !== 0 && item.is_replaced !== 1 && item.is_3C !== 1 && item.state">{{item.state | productState}}</el-tag>
                        <el-tag type="info" v-if="item.is_valid === 0">无效产品</el-tag>
                        <el-tag type="info" v-if="item.is_replaced === 1">被替代产品</el-tag>
                        <el-tag type="danger" v-if="item.is_3C === 1">3C产品</el-tag>
                    </span>

            </el-option>
        </el-select>

    </div>
</template>

<script>
    export default {
        props: ['product','productId','option','data','disabled','placeholder','size','isSelectAllProductInfo','disabledInvalidProduct','isProductChangeInt','labelOnlyShowProductName','labelOnlyShowProductOrderNo'],
        data() {
            let self=this;
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],

                selectForm:{
                    product_name:'',
                    product_order_no:'',
                },
                selectFormRule:{
                    product_name: [
                        {required: true, validator(rule, value, callback){
                            if (!self.selectForm.product_name && !self.selectForm.product_order_no) {
                                callback(new Error('型号、订货号至少填写一个！'));
                            } else {
                                callback();
                            }
                        }, trigger: 'change'}
                    ],
                    product_order_no: [
                        {required: true, validator(rule, value, callback){
                            if (!self.selectForm.product_name && !self.selectForm.product_order_no) {
                                callback(new Error('型号、订货号至少填写一个！'));
                            } else {
                                callback();
                            }
                        }, trigger: 'change'}
                    ],
                },

                queryKeyword:'',
            }
        },
        watch:{
            productId(val){
                this.selectValue = val;
            },
            product(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.productId) {
                    this.selectValue = this.productId;
                }else if(this.product && this.product.id) {
                    this.selectValue = this.product.id;
                }else {
                    this.selectValue = '';
                }

                if(this.isProductChangeInt){
                    this.selectOption = this.option || [];
                }else {
                    if(!this.selectOption || this.selectOption.length<=0){
                        this.selectOption = this.option || [];
                    }
                }
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.queryKeyword ='';
                    let data = self.data || {};
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.product_products_search,
                        type: 'GET',
                        data: {
                            name:query || '',
                            ...data,
                        },
                        success: function (data) {
                            self.queryKeyword=query;
                            self.selectLoading = false;
                            if (data.msg && data.msg.items) {
                                for(let i=0;i<data.msg.items.length;i++){
                                    data.msg.items[i].brand_name=data.msg.items[i].brand ? data.msg.items[i].brand.name : '';
                                }
                                self.selectOption = data.msg.items;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },

            selectChange(val){
                this.$emit('update:productId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:product',this.isSelectAllProductInfo ? item : {
                            id:item.id,
                            brand_name:item.brand_name,
                            product_name:item.product_name,
                            product_order_no:item.product_order_no,
                            state:item.state,
                            is_valid:item.is_valid,
                            is_replaced:item.is_replaced,
                            is_3C:item.is_3C,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.selectForm={
                    product_name:'',
                    product_order_no:'',
                };
                this.queryKeyword ='';
                this.selectOption = [];
                this.$emit('update:productId',null);
                this.$emit('update:product',{});
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
    @import "src/assets/css/config";
.select-product{
    .col{
        display: inline-block;
        width: 190px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        b {
            color: $color-main;
        }
    }
    .selected{
        .col b{
            color: #ffffff;
        }
    }
    .option-header{
        display: flex;
        white-space: nowrap;
        padding: 5px 20px;
        font-weight: bolder;
    }
    .is_valid{
        background-color: #dddddd !important;
        color: #999999;
        cursor: not-allowed;
    }
}
</style>