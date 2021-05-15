<template>
    <div>
        <el-form :model="selectProduct" :rules="selectProductRule" ref="selectProduct" label-width="0">
            <el-form-item prop="product_name">
                <AutoCompleteProduct
                        :productName.sync="selectProduct.product_name"
                        :productOrderNo.sync="selectProduct.product_order_no"
                        :product.sync="selectProduct.product"
                        :data="{brand_name: brand ? brand.name : undefined}"
                        @select="productSelect"
                        :notSearch="!brand || !brand.name"
                        :disabled="disabled"
                        valueKey="product_name">
                </AutoCompleteProduct>
            </el-form-item>
            <el-form-item prop="product_order_no">
                <AutoCompleteProduct
                        :productName.sync="selectProduct.product_name"
                        :productOrderNo.sync="selectProduct.product_order_no"
                        :product.sync="selectProduct.product"
                        :data="{brand_name: brand ? brand.name : undefined}"
                        @select="productSelect"
                        :notSearch="!brand || !brand.name"
                        :disabled="disabled"
                        valueKey="product_order_no">
                </AutoCompleteProduct>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: ['product','productId','brand','validate','disabled'],
        data() {
            let self=this;
            return {

                selectLoading:false,

                selectProduct:{
                    product_name:'',
                    product_order_no:'',
                    product:null
                },
                selectProductRule:{
                    product_name: [
                        {required: true, validator(rule, value, callback){
                            if (!self.selectProduct.product_name && !self.selectProduct.product_order_no) {
                                callback(new Error('型号、订货号至少填写一个！'));
                            } else {
                                callback();
                            }
                        }, trigger: 'change'}
                    ],
                    product_order_no: [
                        {required: true, validator(rule, value, callback){
                            if (!self.selectProduct.product_name && !self.selectProduct.product_order_no) {
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
            product(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.product){
                    this.selectProduct.product = this.product;
                }else {
                    this.selectProduct = {
                        product_name:'',
                        product_order_no:'',
                        product:null
                    }
                }
                if(this.product){
                    this.validateSubmit(this.product.product_name,this.product.product_order_no)
                }else {
                    this.validateSubmit('','')
                }
            },
            productSelect(){
                if(this.selectProduct.product && this.selectProduct.product.id){
                    this.$emit('update:productId',this.selectProduct.product.id);
                    this.$emit('update:product',this.selectProduct.product);
                }else {
                    this.$emit('update:productId',null);
                    this.$emit('update:product',{
                        product_name: this.selectProduct.product_name,
                        product_order_no: this.selectProduct.product_order_no,
                    });
                }
            },

            validateSubmit(product_name,product_order_no,callback){
                this.selectProduct={
                    product_name:product_name,
                    product_order_no:product_order_no,
                };
                this.$nextTick(()=>{
                    this.$refs.selectProduct.validate((valid)=>{
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

</style>