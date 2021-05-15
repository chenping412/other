<template>
    <div class="order-detail-company-line-node-info" v-loading="loading">
        <el-card style="overflow: inherit;">
            <h3 slot="header" class="blue">
                <span>
                    {{node.account_company.company_name | mainCompanyAbbreviationCode(node.account_company.account_company_id)}}
                    <CompanyType :type="node.account_company.company_type"></CompanyType>
                </span>
                <span class="margin-left-20 margin-right-20">---</span>
                <span v-if="nextNode.account_company">
                    {{nextNode.account_company.company_name | mainCompanyAbbreviationCode(nextNode.account_company.account_company_id)}}
                    <CompanyType :type="nextNode.account_company.company_type"></CompanyType>
                </span>
            </h3>
            <div class="padding-bottom-20">
                <div class="padding-bottom-10" v-if="orderData.order_base_state!=='cancelled'">
                    <div v-if="!isEdit">
<!--                        <el-button type="warning"-->
<!--                                   v-if="node.action.next_step"-->
<!--                                   @click="updateNodeState(node.action.next_step)"-->
<!--                                   :disabled="(orderData.merge_order_id && node.topInternalCompany) || (node.state==='contract_performed' && $store.state.permissionWhiteList.buttonList['zero-button-order-stateDone'].disable!==false)">-->
<!--                            {{node.action.next_step | zerosoOrderNodeActions}}-->
<!--                        </el-button>-->
<!--                        <el-button type="primary" plain-->
<!--                                   v-if="node.action.revert"-->
<!--                                   @click="updateNodeState('revert')"-->
<!--                                   :disabled="orderData.merge_order_id && node.topInternalCompany">-->
<!--                            回退-->
<!--                        </el-button>-->

                        <SelectEmailTemplate
                                class="margin-left-10"
                                :accountCompanyId="node.account_company_id"
                                :nextAccountCompanyId="nextNode.account_company_id"
                                :orderData="orderData"
                                :module_id="orderData.name"
                                module_name="order"
                                subsystem="platform"
                                profession_type="to_customer_supplier">
                        </SelectEmailTemplate>

<!--                        <SelectReportTemplate-->
<!--                                v-if="($index === 0 && node.account_company.company_type!=='internal') || ($index === orderData.order_nodes.length - 2 && nextNode.account_company.company_type!=='internal')"-->
<!--                                class="margin-left-10 margin-right-10"-->
<!--                                :accountCompanyId="node.account_company_id"-->
<!--                                :nextAccountCompanyId="nextNode.account_company_id"-->
<!--                                :reportData="orderData"-->
<!--                                module_name="order"-->
<!--                                subsystem="platform"-->
<!--                                profession_type="to_customer_supplier">-->
<!--                        </SelectReportTemplate>-->


<!--                        <el-button type="primary" plain-->
<!--                                   v-if="orderData.view_control && orderData.view_control.current_company_order_type === 'zeroso'"-->
<!--                                   @click="refreshNodePrice()"-->
<!--                                   :disabled="!node.action.editable">-->
<!--                            刷新金额-->
<!--                        </el-button>-->
<!--                        <el-button type="primary" plain-->
<!--                                   @click="clickEdit()"-->
<!--                                   :disabled="!node.action.editable">-->
<!--                            编辑-->
<!--                        </el-button>-->

                    </div>
                    <div v-if="isEdit">
                        <el-button type="success" @click="clickSaveDate()">保存</el-button>
                        <el-button type="primary" plain @click="isEdit=false">取消</el-button>
                    </div>
                </div>

                <el-form :model="nodeForm" :rules="nodeFormRule" ref="nodeForm" label-width="120px" class="el-form-margin-small">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="货币：">
                                <el-select v-if="isEdit" v-model="nodeForm.currency" :popper-append-to-body="false">
                                    <el-option
                                            v-for="item in $store.state.currency"
                                            :key="item.code"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{node.currency|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="附加费：">
                                <InputNumber :value.sync="nodeForm.extra_fee" v-if="isEdit"></InputNumber>
                                <span class="form-border-bottom" v-else>{{node.extra_fee|isoCurrency(node.currency)|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="毛利率：">
                                <span class="form-border-bottom">{{(node.gross_profit_margin ? node.gross_profit_margin + '%' : '') | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="未税金额：">
                                <span class="form-border-bottom">{{node.untaxed_amount|isoCurrency(node.currency)|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="含税总额：">
                                <span class="form-border-bottom">{{node.total_amount|isoCurrency(node.currency)|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="税率：">
                                <InputNumber :value.sync="nodeForm.tax_rate" v-if="isEdit">
                                    <template slot="append">%</template>
                                </InputNumber>
                                <span class="form-border-bottom" v-else>{{(node.tax_rate ? node.tax_rate + '%' : '') | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="服务费率：">
                                <InputNumber :value.sync="nodeForm.service_rate" v-if="isEdit">
                                    <template slot="append">%</template>
                                </InputNumber>
                                <span class="form-border-bottom" v-else>{{(node.service_rate ? node.service_rate + '%' : '') | defaultStr}}</span>
                            </el-form-item>
<!--                            <el-form-item label="真实服务费率：">-->
<!--                                <span class="form-border-bottom">{{(node.actual_service_rate ? node.actual_service_rate + '%' : '') | defaultStr}}</span>-->
<!--                            </el-form-item>-->
                            <el-form-item label="付款方式：">
                                <el-select v-if="isEdit" v-model="nodeForm.payment_method" :popper-append-to-body="false">
                                    <el-option
                                            v-for="item in $store.state.paymentMethod"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{node.payment_method | paymentMethod | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="预付全款优惠率：">
                                <span class="form-border-bottom">{{(node.prepayment_discount_rate ? node.prepayment_discount_rate + '%' : '') | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="圆整方式：">
                                <el-select v-if="isEdit" v-model="nodeForm.round_taxed_price" :popper-append-to-body="false">
                                    <el-option
                                            v-for="item in $store.state.roundConfigName"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{node.round_taxed_price | roundConfigName}}</span>
                            </el-form-item>
                            <el-form-item label="汇率：">
                                <span class="form-border-bottom">{{node.exchange_rate|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="计税方式：">
                                <el-select v-if="isEdit" v-model="nodeForm.tax_method" :popper-append-to-body="false">
                                    <el-option
                                            v-for="item in $store.state.zerosoTaxType"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{node.tax_method | zerosoTaxType | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="询报价单号：">
                                <el-input v-if="isEdit" v-model="nodeForm.node_info.offer_num"></el-input>
                                <span class="form-border-bottom" v-else>{{(node.node_info ? node.node_info.offer_num : '') | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="询报价附件：">
                                <FileListShow
                                    :module_id="node.id"
                                    module_name="order_node_offer"
                                    subsystem="platform"
                                    ref="order_node_offer_show"
                                ></FileListShow>
                                <FileUpload
                                        v-if="isEdit"
                                        :module_id="node.id"
                                        module_name="order_node_offer"
                                        subsystem="platform"
                                        ref="order_node_offer"
                                ></FileUpload>
                            </el-form-item>
                            <el-form-item label="订单备注：">
                                <el-input v-if="isEdit" v-model="nodeForm.node_info.comment"></el-input>
                                <span class="form-border-bottom" v-else>{{(node.node_info ? node.node_info.comment : '') | defaultStr}}</span>
                            </el-form-item>

                            <el-form-item label="询盘系统询报价单号">
                                <span class="form-border-bottom">{{node.inquiry_num | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="合同号：">
                                <el-input v-if="isEdit" v-model="nodeForm.node_info.oc_num"></el-input>
                                <span class="form-border-bottom" v-else>{{(node.node_info ? node.node_info.oc_num : '') | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="合同附件：">
                                <FileListShow
                                        :module_id="node.id"
                                        module_name="order_node_oc"
                                        subsystem="platform"
                                        ref="order_node_oc_show"
                                ></FileListShow>
                                <FileUpload
                                        v-if="isEdit"
                                        :module_id="node.id"
                                        module_name="order_node_oc"
                                        subsystem="platform"
                                        ref="order_node_oc"
                                ></FileUpload>
                            </el-form-item>
                            <el-form-item label="发货方式：">
                                <el-select v-if="isEdit" v-model="nodeForm.supplier_pickup_method" :popper-append-to-body="false">
                                    <el-option
                                            v-for="item in $store.state.supplierPickupMethod"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{node.supplier_pickup_method | supplierPickupMethod}}</span>
                            </el-form-item>
                            <el-form-item label="询报价单发货方式">
                                <span class="form-border-bottom">{{node.delivery_method | orderDeliveryMethod | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>

    export default {
        props:['queryId','node','$index','nextNode','orderData'],
        data() {
            return {
                isEdit:false,
                nodeForm:{},
                nodeFormRule: {
                    /*customer_type: [
                        {required: true, message: '请选择客户性质！'}
                    ],*/
                },

                loading:false,
            }
        },
        computed:{

        },
        watch: {
            'node'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {

            },
            //更新合同节点状态
            updateNodeState(action){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data:{
                        order_node_id: self.node.id,
                        order_id: self.queryId,
                        name: action,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                type: 'success',
                                message: '操作成功！',
                                showClose: 'true'
                            });
                            self.$emit('updateInit');
                        }
                    }
                })
            },

            //刷新金额
            refreshNodePrice(){
                let self = this;
                self.$confirm('确认刷新本节点金额？刷新会按照最上游供应商最新的价格和最新汇率重新计算本单金额，此操作不可逆，请谨慎处理！', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_order_orders + '/' + self.queryId + '/' + self.node.id + '/refresh_node_price',
                                type: 'PUT',
                                requestBody: true,
                                data:{
                                    node_id: self.node.id,
                                    order_id: self.queryId,
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功！',
                                            showClose: 'true'
                                        });
                                        self.$emit('updateInit');
                                    }
                                }
                            })

                        }
                    }
                })
            },



            clickEdit(){
                this.isEdit=true;
                this.nodeForm = JSON.parse(JSON.stringify(this.node));
                this.nodeForm.order_id= this.queryId;
                this.nodeForm.order_node_id= this.node.id;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.nodeForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.order_order_orders + '/' + self.queryId + '/info',
                            type: 'PUT',
                            requestBody: true,
                            data: self.nodeForm,
                            success: function (data) {
                                if (data.msg) {
                                    self.$refs.order_node_offer.submitUpload(null,()=>{
                                        self.$refs.order_node_offer_show.update();

                                        self.$refs.order_node_oc.submitUpload(null,()=>{
                                            self.$refs.order_node_oc_show.update();

                                            self.loading = false;
                                            self.isEdit = false;
                                            self.$message({
                                                showClose: true,
                                                message: '保存成功！',
                                                type: 'success'
                                            });
                                            self.$emit('updateInit');
                                        });
                                    });
                                } else {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },

        }
    }
</script>

<style lang="scss">
.order-detail-company-line-node-info{
    position: absolute;
    top: 40px;
    right: 0;
    z-index: 99;
    width: 800px;
    .el-card{
        border-color: #dddddd;
    }
    .el-form-item__label{
        white-space: pre-wrap;
    }
}
</style>
