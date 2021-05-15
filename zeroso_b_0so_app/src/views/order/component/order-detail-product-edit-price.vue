<template>
    <el-popover popper-class="popper-order-detail-product-edit-price"
                v-model="popover"
                trigger="manual"
                placement="bottom-end"
                width="300">
        <i slot="reference" class="el-icon-edit el-icon-normal cursor-pointer" @click="popoverShow"></i>
        <div class="calc-param-content order-price-detail" v-loading="loading">
            <p class="padding-top-10 margin-bottom-10">手填含税单价:</p>
            <p class="padding-bottom-20">
                <InputNumber :value.sync="manual_price_taxed_unit"></InputNumber>
            </p>
            <p class="margin-bottom-10">自动计算金额:</p>
            <p class="margin-bottom-10">未税单价:{{orderLine.auto_price_unit  | isoCurrency(orderNodesMaps[orderLine.account_company_id].currency) | defaultStr}}</p>
            <p class="margin-bottom-20">含税单价:{{orderLine.auto_price_taxed_unit  | isoCurrency(orderNodesMaps[orderLine.account_company_id].currency) | defaultStr}}</p>
            <div class="margin-bottom-10">
                <el-button size="mini" type="primary" @click="clickSaveEdit">提交</el-button>
                <el-button size="mini" @click="popover=false">取消</el-button>
            </div>
        </div>
    </el-popover>
</template>

<script>

    export default {
        props:['queryId','orderLine','orderData','orderNodesMaps'],
        data() {
            return {
                loading:false,

                popover:false,
                manual_price_taxed_unit:'',
            }
        },
        created() {

        },
        methods: {
            popoverShow(){
                this.manual_price_taxed_unit=this.orderLine.manual_price_taxed_unit || this.orderLine.price_taxed_unit;
                this.popover=true;
            },
            //保存编辑
            clickSaveEdit() {
                let self = this;
                if(!self.manual_price_taxed_unit){
                    self.$message({
                        showClose: true,
                        message: '请输入含税单价',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_order_lines + '/' + self.orderLine.id + '/manual',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        order_line: self.orderLine.id ,
                        manual_price_taxed_unit: self.manual_price_taxed_unit,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.popover=false;
                            self.$message({
                                showClose: true,
                                message: '修改成功！',
                                type: 'success'
                            });
                            self.$emit('updateInit');
                        } else {
                            self.$message({
                                showClose: true,
                                message: '修改失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    .popper-order-detail-product-edit-price{

    }
</style>
