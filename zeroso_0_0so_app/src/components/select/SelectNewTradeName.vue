<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                filterable
                remote
                :placeholder="placeholder || '中文报关品名'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="item.chinese_name">
                <span>{{item.chinese_name}} </span>
                <span> ({{item.english_name}})</span>
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
        props: ['tradeName','tradeNameId','option','placeholder'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            tradeNameId(){
                this.selectValue = this.tradeNameId;
            },
            tradeName(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.tradeNameId) {
                    this.selectValue = this.tradeNameId;
                }else if(this.tradeName && this.tradeName.id) {
                    this.selectValue = this.tradeName.id;
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
                        url: self.$api.new_product_basic_product_vat_q,
                        type: 'GET',
                        data: {
                            q:query || null
                        },
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg && data.msg) {
                                self.selectOption = data.msg;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },
            selectChange(val){
                this.$emit('update:tradeNameId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:tradeName',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.remoteMethod();
                this.$emit('update:tradeNameId',null);
                this.$emit('update:tradeName',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>