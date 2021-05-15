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
                clearable
                :disabled="disabled"
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.uid"
                       :value="item.uid"
                       :label="item.name">
                <span v-if="item.name">{{item.name}}</span>
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
        props: ['brand','brandUid','option','placeholder','disabled','size'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            brandUid(){
                this.selectValue = this.brandUid;
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
                if(this.brandUid) {
                    this.selectValue = this.brandUid;
                }else if(this.brand && this.brand.uid) {
                    this.selectValue = this.brand.uid;
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
                if(query){
                    if(this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(()=>{
                        self.selectLoading=true;
                        self.$http({
                            url: self.$api.new_product_basic_product_brand_q,
                            type: 'GET',
                            data:{
                              q:query
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
                }else {
                    self.selectOption = [];
                    self.selectLoading = false;
                }
            },
            selectChange(val){
                this.$emit('update:brandUid',val);
                this.selectOption.forEach((item)=>{
                    if(item.uid === val){
                        this.$emit('update:brand',{
                            uid:item.uid,
                            name:item.name,
                            state:item.state,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.selectOption = [];
                this.$emit('update:brandUid',null);
                this.$emit('update:brand',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>