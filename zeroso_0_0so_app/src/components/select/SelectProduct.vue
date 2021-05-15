<template>
    <div>
        <el-form :model="selectForm" :rules="selectFormRule" ref="selectForm" label-width="0">
            <el-form-item prop="product_name">
                <el-select
                        v-model="selectValue"
                        filterable
                        remote
                        placeholder="型号"
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
                               :label="item.product_name || ' '">
                        <span class="col">{{item.brand ? item.brand.name : ''}}</span>
                        <span class="col">{{item.product_name}}</span>
                        <span class="col">{{item.product_order_no}}</span>
                        <span class="col">
                            <el-tag :type="item.state==='verified'?'success' : 'warning'"
                                    v-if="item.state">
                                {{item.state | productState}}
                            </el-tag>
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="product_order_no">
                <el-select
                        v-model="selectValue"
                        filterable
                        remote
                        placeholder="订货号"
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
                               :label="item.product_order_no || ' '">
                        <span class="col">{{item.brand ? item.brand.name : ''}}</span>
                        <span class="col">{{item.product_name}}</span>
                        <span class="col">{{item.product_order_no}}</span>
                        <span class="col">
                            <el-tag :type="item.state==='verified'?'success' : 'warning'"
                                    v-if="item.state">
                                {{item.state | productState}}
                            </el-tag>
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        props: ['product','productId','option','data','validate','disabled'],
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
                if(!this.selectOption || this.selectOption.length<=0){
                    if(this.option) {
                        this.selectOption = this.option;
                    }else {
                        this.selectOption = [];
                    }
                }
                if(!this.disabled){
                    if(this.product){
                        this.validateSubmit(this.product.product_name,this.product.product_order_no)
                    }else {
                        this.validateSubmit('','')
                    }
                }
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    let data = self.data || {};
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.product_products_search,
                        type: 'GET',
                        data: {
                            name:query || '',
                            ...data || {},
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
                this.$emit('update:productId',val);
                this.selectOption.forEach((item)=>{
                    this.validateSubmit(item.product_name,item.product_order_no)
                    if(item.id === val){
                        this.$emit('update:product',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.selectForm={
                    product_name:'',
                    product_order_no:'',
                };
                this.selectOption = [];
                this.$emit('update:productId',null);
                this.$emit('update:product',{brand:{}});
                this.$emit('change',{brand:{}});
                this.validateSubmit('','')
            },

            validateSubmit(product_name,product_order_no,callback){
                this.selectForm={
                    product_name:product_name,
                    product_order_no:product_order_no,
                };
                this.$nextTick(()=>{
                    this.$refs.selectForm.validate((valid)=>{
                        if (valid) {
                            this.$emit('update:validate',true);
                            if(callback) callback(true)
                        } else {
                            this.$emit('update:validate',false);
                            if(callback) callback(false)
                        }
                    })
                });
            },
        },
    }
</script>

<style lang="scss">
.select-product{
    .col{
        display: inline-block;
        width: 190px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .option-header{
        display: flex;
        white-space: nowrap;
        padding: 5px 20px;
        font-weight: bolder;
    }
}
</style>