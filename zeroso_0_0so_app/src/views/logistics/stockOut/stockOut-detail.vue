<template>
    <div class="flex-box-column stockIn-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">库存 / 出库单列表</el-breadcrumb-item>
                    <el-breadcrumb-item>出库单详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-status">
                        <h3 class="inline-block margin-right-20">出库单：{{detailForm.outgoing_transfer_name}}</h3>

                        <el-popover placement="bottom-start">
                            <div slot="reference" class="inline-block cursor-pointer">
                                <el-tag>{{detailForm.state | logisticsV4StockOutState}}</el-tag>
                                <span class="margin-left-10"
                                      v-if="detailForm.state_times && detailForm.state_times.length>0">
                                    {{detailForm.state_times[detailForm.state_times.length-1].state_time | zerosoTimeFormat}}
                                </span>
                                <i class="el-icon-caret-bottom"
                                   v-if="detailForm.state_times && detailForm.state_times.length>0"></i>
                            </div>
                            <table v-if="detailForm.state_times && detailForm.state_times.length>0">
                                <tbody>
                                <tr v-for="(item,$index) in detailForm.state_times" :key="$index">
                                    <td>
                                        <el-tag>{{item.state_name | logisticsV4StockOutState}}</el-tag>
                                    </td>
                                    <td><span class="margin-left-10">{{item.state_time | zerosoTimeFormat}}</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </el-popover>


                        <email-message-count-button
                                class="margin-left-20"
                                :module_id="queryId"
                                module_name="outgoing_transfer"
                                subsystem="logistics">
                        </email-message-count-button>
                    </div>
                    <div class="detail-control clearfix">
                        <div class="control-btns" v-if="detailForm.id">

                            <SelectEmailTemplate
                                    class="margin-right-10"
                                    :stockOutData="detailForm"
                                    :accountCompanyId="$store.state.currentCompany.account_company_id"
                                    :module_id="queryId"
                                    module_name="outgoing_transfer"
                                    subsystem="logistics"
                                    profession_type="packing_list">
                            </SelectEmailTemplate>

                            <SelectReportTemplate
                                    class="margin-right-10"
                                    :reportData="detailForm"
                                    :accountCompanyId="$store.state.currentCompany.account_company_id"
                                    module_name="outgoing_transfer"
                                    subsystem="logistics"
                                    profession_type="outgoing_customs_clearance">
                            </SelectReportTemplate>

                            <stock-out-detail-export-xml
                                    class="margin-right-10"
                                    :stockOut="detailForm">
                            </stock-out-detail-export-xml>

                            <el-button type="primary" plain :disabled="detailForm.belong_to_company.country === detailForm.send_to_company.country" @click="createStockOutInvoice()">生成发票</el-button>


                            <span class="margin-left-10 margin-right-20">|</span>

                            <stock-out-detail-edit-delivery-info
                                    class="margin-right-10"
                                    :stockOut="detailForm"
                                    @update="init">
                            </stock-out-detail-edit-delivery-info>


                            <el-button
                                    type="primary"
                                    v-if="actionButton[detailForm.state]"
                                    @click="action(actionButton[detailForm.state])">
                                {{actionButton[detailForm.state]|logisticsV4StockOutState}}
                            </el-button>
                            
                            <el-button v-if="showRevert.indexOf(detailForm.state) > -1" @click="action('revert')">回退</el-button>
                        </div>
                        <DetailPagination apiKey="logistics_outgoing_transfers"
                                          :listApi="this.$api.order_outgoing_transfers + '/search'"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="180px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="8">
                            <el-form-item label="关联订单：">
                                <span class="form-border-bottom">
                                    <template v-for="(order,$index) in detailForm.orders">
                                        <router-link
                                                class="blue margin-right-10"
                                                :key="$index"
                                                :to="'/order/order/all/detail?id='+order.id">
                                            {{order.name}}
                                        </router-link>
                                    </template>
                                </span>
                            </el-form-item>
                            <el-form-item label="关联发票：">
                                <span class="form-border-bottom">
                                    <router-link
                                            class="blue"
                                            v-if="detailForm.invoice"
                                            :to="'/finance/invoice/customer/detail?id='+detailForm.invoice.id">
                                        {{detailForm.invoice.name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="创建时间：">
                                <span class="form-border-bottom">
                                    {{detailForm.create_time | zerosoCompanyTime}}
                                </span>
                            </el-form-item>
                            <el-form-item label="附件：">
                                <FileListShow
                                        ref="outgoing_transfer_file_show"
                                        :showDelete="true"
                                        :module_id="queryId"
                                        module_name="outgoing_transfer"
                                        subsystem="logistics">
                                </FileListShow>
                                <FileUpload
                                        :autoUpload="true"
                                        :showFileList="false"
                                        @uploadSuccess="$refs.outgoing_transfer_file_show.update()"
                                        :module_id="queryId"
                                        module_name="outgoing_transfer"
                                        subsystem="logistics">
                                </FileUpload>
                            </el-form-item>
                            <el-form-item>
                                <StockOutAdd title="编辑出库单" v-if="detailForm.id" :stockOutDetail="detailForm"
                                             @update="init" class="margin-right-10"></StockOutAdd>
                                <el-button v-if="showDelButton.indexOf(detailForm.state)>-1" @click="clickDelete">删除
                                </el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="额外重量：">
                                <span class="form-border-bottom">
                                    <span class="margin-right-20">{{detailForm.extra_weight ? detailForm.extra_weight + 'kg' : '---'}}</span>
                                    <stock-out-detail-edit-weight :detailForm="detailForm" @update="init"></stock-out-detail-edit-weight>
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="clearfix">
                            <div class="right">
                                <el-steps align-center>
                                    <el-step>
                                        <div style="padding:10px;width: 150px;line-height: 2em;" slot="title">
                                            {{detailForm.belong_to_company ? detailForm.belong_to_company.company_name :
                                            null}}
                                        </div>
                                    </el-step>
                                    <el-step>
                                        <div style="padding:10px;width: 150px;line-height: 2em;" slot="title">
                                            {{detailForm.send_to_company ? detailForm.send_to_company.company_name :
                                            null}}
                                        </div>
                                    </el-step>
                                </el-steps>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <stock-out-detail-address :detailForm="detailForm" @update="init"></stock-out-detail-address>

            <stock-out-detail-delivery-info v-if="detailForm.id" :detailForm="detailForm"></stock-out-detail-delivery-info>

            <stock-out-detail-box v-if="detailForm.id" :detailForm="detailForm"></stock-out-detail-box>

        </div>


    </div>
</template>

<script>

    import StockOutAdd from "./component/stockOut-add";
    import StockOutDetailEditWeight from "./component/stockOut-detail-edit-weight";
    import StockOutDetailAddress from "./component/stockOut-detail-address";
    import StockOutDetailDeliveryInfo from "./component/stockOut-detail-delivery-info";
    import StockOutDetailBox from "./component/stockOut-detail-box";
    import EmailMessageCountButton from "../../related-message/email-message-count-button";
    import StockOutDetailEditDeliveryInfo from "./component/stockOut-detail-edit-delivery-info";
    import StockOutDetailExportXml from "./component/stockOut-detail-export-xml";

    export default {
        components: {
            StockOutDetailExportXml,
            StockOutDetailEditDeliveryInfo,
            EmailMessageCountButton,
            StockOutDetailBox,
            StockOutDetailDeliveryInfo, StockOutDetailAddress, StockOutDetailEditWeight, StockOutAdd
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {},

                showDelButton: ['draft'],
                showRevert: ['cargo_send', 'info_send', 'delivery_confirmed', 'waiting'],

                actionButton: {},

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
            this.getExpressType();
        },
        methods: {
            init() {
                let self = this;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                }
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_outgoing_transfers + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (!data.msg.sale_company_id) {
                                data.msg.sale_company = data.msg.belong_to_company;
                                data.msg.sale_company_id = data.msg.belong_to_company_id;
                            }
                            self.detailForm = data.msg;

                            //流程按钮区分跨境 belong_to_company send_to_company
                            self.actionButton = (self.detailForm.belong_to_company.country === self.detailForm.send_to_company.country) ? {
                                draft: 'waiting',
                                waiting: 'delivery_confirmed',
                                delivery_confirmed: 'info_send',
                                info_send: 'cargo_send',
                                cargo_send: 'done'
                            } : {
                                draft: 'waiting',
                                waiting: 'cargo_send',
                                cargo_send: 'done'
                            };
                        }
                    }
                })
            },

            action(name) {
                let self = this;
                if (name === 'done') {
                    self.$confirm('此操作不能回退是否继续？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (action) {
                            if (action == 'confirm') {
                                self.actionUpdate(name)
                            }
                        }
                    })
                } else if (name === 'cargo_send') {
                    self.$confirm('是否确认已出库？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (action) {
                            if (action == 'confirm') {
                                self.actionUpdate(name)
                            }
                        }
                    })
                } else {
                    self.actionUpdate(name)
                }
            },

            actionUpdate(name) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_outgoing_transfers + '/' + self.queryId + '/action',
                    type: 'PUT',
                    data:{
                        outgoing_transfer_id: self.queryId,
                        name: name
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.init();
                    }
                })
            },

            clickDelete() {
                let self = this;
                self.$confirm('确定删除吗？该操作不可逆', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_outgoing_transfers + '/' + self.queryId,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.err_code.length === 0 && data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '删除成功！',
                                            type: 'success'
                                        });
                                        self.$router.push({
                                            path: self.parentQuery ? 'list?'+self.parentQuery : 'list',
                                        });
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '删除失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            },


            getExpressType() {
                let self = this;
                self.$http({
                    url: self.$api.order_outgoing_transfers + '/' + self.queryId + '/third_delivery/express_type',
                    type: 'GET',
                    success: function (data) {
                        if(data.msg){
                            let deliveryCompanies=[]
                            data.msg.forEach((item)=>{
                                deliveryCompanies.push({
                                    code: item[0],
                                    name: item[1],
                                })
                            });
                            self.$store.commit('setDeliveryCompanies',deliveryCompanies);
                        }
                    }
                })
            },

            createStockOutInvoice(){
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.type='siviToKj';
                this.$router.push({
                    path: '/logistics/stockOut/detail/invoice',
                    query:query
                });
            },

        }
    }
</script>

<style lang="scss">

</style>
