<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
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
            </div>
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="labelOnlyShowProductName ? item.type : labelOnlyShowProductOrderNo ? item.article_number : (item.type||'')+'，'+(item.article_number||'')">
                    <span class="col">{{item.brand_name}}</span>
                    <span class="col" v-html="replaceBolder(item.type,queryKeyword)"></span>
                    <span class="col" v-html="replaceBolder(item.article_number,queryKeyword)"></span>
            </el-option>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['product','productUid','brandUid','option','data','disabled','placeholder','size','isSelectAllProductInfo','disabledInvalidProduct','isProductChangeInt','labelOnlyShowProductName','labelOnlyShowProductOrderNo'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],

                queryKeyword:'',
            }
        },
        watch:{
            productUid(val){
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
                if(this.productUid) {
                    this.selectValue = this.productUid;
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
                        url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/product/list',
                        type: 'POST',
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
                this.$emit('update:productUid',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:product',this.isSelectAllProductInfo ? item : {
                            id:item.id,
                            uid:item.uid,
                            brand_name:item.brand_name,
                            type:item.type,
                            article_number:item.article_number,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.queryKeyword ='';
                this.selectOption = [];
                this.$emit('update:productUid',null);
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
    @import "select-template-components";
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