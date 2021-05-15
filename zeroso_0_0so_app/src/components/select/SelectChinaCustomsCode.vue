<template>
    <el-select
            v-model="selectValue"
            filterable
            remote
            :disabled="disabled"
            :placeholder="placeholder || '中国海关编码'"
            :remote-method="remoteMethod"
            @change="selectChange"
            @clear="selectClear"
            clearable
            :loading="selectLoading">
        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.customs_cn_code">
         </el-option>
    </el-select>
</template>

<script>
    /*选择中国海关编码组件*/
    export default {
        props: ['customsCode','customsCodeId','option','placeholder','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            customsCodeId(){
                this.selectValue = this.customsCodeId;
            },
            customsCode(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.customsCodeId) {
                    this.selectValue = this.customsCodeId;
                }else if(this.customsCode && this.customsCode.id) {
                    this.selectValue = this.customsCode.id;
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
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.product_product_manage_product_customs_info,
                        type: 'GET',
                        data: {
                            page:1,
                            per_page:30,
                            customs_cn_code:query || null
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
                this.$emit('update:customsCodeId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:customsCode',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.remoteMethod();
                this.$emit('update:customsCodeId',null);
                this.$emit('update:customsCode',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">

</style>