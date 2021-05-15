<template>
    <div class="inline-block">
        <el-button type="danger" @click="clickEdit">快递下单</el-button>

        <el-dialog title="快递下单" :visible.sync="dialogShow" width="800px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收货公司:">
                            <span v-if="stockOut.send_to_company">{{stockOut.send_to_company.company_name}}</span>
                        </el-form-item>
                        <el-form-item label="快递公司:">
                            <el-select v-model="addForm.delivery_company">
                                <el-option
                                        v-for="(item,$index) in $store.state.deliveryCompanies"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="月结账号:">
                            <InputNumber :value.sync="addForm.customer_pay_code" :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="快递母单号:">
                            <InputNumber :value.sync="addForm.primary_mail_no" :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="快递子单号:">
                            <div v-if="addForm.secondary_mail_no">
                                <p v-for="(item,$index) in addForm.secondary_mail_no" :key="$index">
                                    <InputNumber :value.sync="addForm.secondary_mail_no[$index]" :integer="true" style="width: 200px"></InputNumber>
                                    <el-button size="mini" @click="deleteSecondaryMailNo($index)">删除</el-button>
                                </p>
                                <el-button size="mini" type="primary" @click="addSecondaryMailNo">添加</el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="快递类型:" v-if="addForm.delivery_company==='sf_express'">
                            <el-select v-model="addForm.delivery_type_id">
                                <el-option
                                        v-for="(item,$index) in $store.state.deliveryTypes"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="保价金额:">
                            <InputNumber :value.sync="addForm.insurance_price"></InputNumber>
                        </el-form-item>
                        <el-form-item label="包裹数量:">
                            <InputNumber :value.sync="addForm.package_total" :min="1" :integer="true"></InputNumber>
                        </el-form-item>
                        <el-form-item label="支付类型:">
                            <el-select v-model="addForm.payment_type">
                                <el-option
                                        v-for="(item,$index) in $store.state.deliveryPaymentTypes"
                                        :key="$index"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="clickDelete()">撤 销</el-button>

                <el-button
                        type="primary"
                        :disabled="addForm.delivery_company!== 'sf_express'"
                        @click="clickSaveDate(true)">
                    {{addForm.primary_mail_no?'重新下单':'下单'}}
                </el-button>
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>

                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['stockOut'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    outgoing_transfer_id:'',
                    delivery_company:'sf_express',
                    customer_pay_code:'',
                    primary_mail_no:'',
                    secondary_mail_no:[],
                    delivery_type_id:'1',
                    insurance_price:'',
                    package_total:'1',
                    payment_type:'sender_pay',
                },
                addFormRule: {
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
                    ],
                },


            }
        },
        created() {

        },
        methods: {
            clickEdit() {
                if(this.stockOut.delivery_info){
                    this.addForm = {
                        outgoing_transfer_id:this.stockOut.id,
                        ...this.stockOut.delivery_info
                    }
                }else {
                    this.addForm = {
                        outgoing_transfer_id:this.stockOut.id,
                        delivery_company:'sf_express',
                        customer_pay_code:'',
                        primary_mail_no:'',
                        secondary_mail_no:[],
                        delivery_type_id:'1',
                        insurance_price:'',
                        package_total:'1',
                        payment_type:'sender_pay',
                    }
                }
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },

            addSecondaryMailNo(){
                if(!this.addForm.secondary_mail_no) this.addForm.secondary_mail_no=[];
                this.addForm.secondary_mail_no.push('');
            },
            deleteSecondaryMailNo($index){
                this.addForm.secondary_mail_no.splice($index,1);
            },


            clickSaveDate(makeOrder) {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(self.addForm.delivery_company!=='sf_express'){
                            self.addForm.delivery_type_id=null;
                        }
                        let url=self.$api.order_outgoing_transfers + '/' + self.addForm.outgoing_transfer_id + '/third_delivery';
                        if(makeOrder) url=self.$api.order_outgoing_transfers + '/' + self.addForm.outgoing_transfer_id + '/third_delivery/action';
                        self.loading = true;
                        self.$http({
                            url: url,
                            type: makeOrder?'POST':'PUT',
                            requestBody: true,
                            data: self.addForm,
                            success () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                                self.dialogShow = false;
                                self.$emit('update')
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },


            clickDelete() {
                let self = this;
                self.$confirm('确定撤销吗？该操作不可逆', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_outgoing_transfers + '/' + self.addForm.outgoing_transfer_id + '/third_delivery/cancel_action',
                                type: 'PUT',
                                requestBody: true,
                                data:{
                                    outgoing_transfer_id: self.addForm.outgoing_transfer_id
                                },
                                success () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    self.$emit('update')
                                }
                            })
                        }
                    }
                })
            },


        },
    }
</script>

<style lang="scss" scoped>

</style>