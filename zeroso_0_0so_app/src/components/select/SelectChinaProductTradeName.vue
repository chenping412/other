<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                filterable
                remote
                :disabled="disabled"
                :placeholder="placeholder || '中文报关品名'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="item.product_cn_name">
             </el-option>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    /*选择中国海关编码组件*/
    export default {
        props: ['productTradeName','productTradeNameId','option','placeholder','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            productTradeNameId(){
                this.selectValue = this.productTradeNameId;
            },
            productTradeName(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.productTradeNameId) {
                    this.selectValue = this.productTradeNameId;
                }else if(this.productTradeName && this.productTradeName.id) {
                    this.selectValue = this.productTradeName.id;
                }else {
                    this.selectValue = '';
                }
                if(!this.selectOption || this.selectOption.length<=0){
                    if(this.option) {
                        this.selectOption = this.option;
                    }else {
                        this.remoteMethod();
                    }
                }
            },
            setInit(id,option){
                this.selectValue = id;
                this.selectOption = option;
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.product_product_manage_product_trade_name,
                        type: 'GET',
                        data: {
                            product_cn_name:query || null
                        },
                        success: function (data) {
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
                this.$emit('update:productTradeNameId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:productTradeName',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.remoteMethod();
                this.$emit('update:productTradeNameId',null);
                this.$emit('update:productTradeName',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>