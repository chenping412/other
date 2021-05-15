<template>
    <el-select
            v-model="selectValue"
            filterable
            remote
            :placeholder="placeholder || '检索海关编码'"
            :remote-method="remoteMethod"
            @change="selectChange"
            @clear="selectClear"
            clearable
            :loading="selectLoading">
        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.hs_code">
            <span>{{item.hs_code}} </span>
            <span> ({{item.country | country}})</span>
         </el-option>
    </el-select>
</template>

<script>
    /*选择中国海关编码组件*/
    export default {
        props: ['customs','customsId','option','placeholder'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            customsId(){
                this.selectValue = this.customsId;
            },
            customs(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.customsId) {
                    this.selectValue = this.customsId;
                }else if(this.customs && this.customs.id) {
                    this.selectValue = this.customs.id;
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
                        url: self.$api.new_product_basic_product_hs_q,
                        type: 'GET',
                        data: {
                            q:query || null
                        },
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg) {
                                self.selectOption = data.msg;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },
            selectChange(val){
                this.$emit('update:customsId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:customs',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.remoteMethod();
                this.$emit('update:customsId',null);
                this.$emit('update:customs',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">

</style>