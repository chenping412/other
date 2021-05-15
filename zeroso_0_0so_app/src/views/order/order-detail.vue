<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[orderState]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '订单详情：'+detailForm.name : '创建订单'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-10">{{detailForm.order_type === 'merged'?'合并单号':'订单编号'}}：</span>
                        <span class="margin-right-10">{{detailForm.name | defaultStr}}</span>
                        <OrderInquiryPriority class="margin-right-10"
                                              :state="detailForm.inquiry_priority"></OrderInquiryPriority>

                        <el-tag type="danger" effect="dark" v-if="detailForm.is_request_cancelled">申取</el-tag>
                        <el-tag type="danger" effect="dark" v-if="detailForm.order_base_state === 'cancelled'">取
                        </el-tag>

                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">

                        </div>
                        <DetailPagination :apiKey="'order_'+orderState" :listApi="searchListUrl"></DetailPagination>
                    </div>
                </div>

                <div class="detail-base-body">
                    <el-row type="flex" justify="space-between" :gutter="20">
                        <el-col :span="6">
                            <el-form label-width="120px">
                                <el-form-item label="品牌：">
                                    <div class="form-border-bottom" v-if="detailForm.brand">
                                        <router-link class="blue margin-right-10"
                                                     :to="'/product/brand/detail?id='+detailForm.brand.id"
                                                     target="_blank">
                                            {{detailForm.brand.name}}
                                        </router-link>
                                        <el-popover class="margin-right-20" title="备注" placement="bottom-start"
                                                    width="600"
                                                    v-if="detailForm.brand.comment">
                                            <i slot="reference"
                                               class="el-icon-tickets el-icon-normal cursor-pointer"></i>
                                            <div style="white-space: pre-wrap">
                                                {{detailForm.brand.comment}}
                                            </div>
                                        </el-popover>
                                        <BrandLever :state="detailForm.brand.state"></BrandLever>
                                    </div>
                                </el-form-item>
                                <el-form-item label="合并订单号：" v-if="detailForm.order_type !== 'merged'">
                                <span class="form-border-bottom">
                                    <router-link class="blue" :to="'detail?id='+detailForm.merge_order_id"
                                                 target="_blank">
                                         {{detailForm.merge_order_name}}
                                    </router-link>
                                </span>
                                </el-form-item>
                                <el-form-item label="物流状态：">
                                    <div class="form-border-bottom" v-if="detailForm.logistics_state_times">
                                        <el-popover placement="bottom-start" width="300">
                                            <div slot="reference" class="inline-block cursor-pointer"
                                                 v-if="detailForm.logistics_state_times.length>0">
                                                <el-tag>
                                                    {{detailForm.logistics_state_times[detailForm.logistics_state_times.length-1].state_name
                                                    | logisticsStatus}}
                                                </el-tag>
                                                <span>{{detailForm.logistics_state_times[detailForm.logistics_state_times.length-1].state_time | zerosoTimeFormat(8)}}</span>
                                                <i class="el-icon-caret-bottom"></i>
                                            </div>
                                            <table>
                                                <tbody>
                                                <tr v-for="(item,$index) in detailForm.logistics_state_times"
                                                    :key="$index">
                                                    <td>
                                                        <el-tag>{{item.state_name | logisticsStatus}}</el-tag>
                                                    </td>
                                                    <td><span class="margin-left-20">{{item.state_time | zerosoTimeFormat(8)}}</span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </el-popover>
                                    </div>
                                </el-form-item>
                                <el-form-item>
                                    <el-button class="margin-right-20" size="mini"
                                               v-if="detailForm.logistics_custom_type === 'sz' && detailForm.order_type !== 'merged'"
                                               @click="customTypeAction()">SZ
                                    </el-button>
                                    <el-button class="margin-right-20" size="mini"
                                               v-if="detailForm.logistics_custom_type === 'dg' && detailForm.order_type !== 'merged'"
                                               @click="customTypeAction()">DG
                                    </el-button>
                                    <logistics-type :isOrder="true" :type="detailForm.lw_logistics_custom_type"
                                                    :orderId="queryId" @update="init"></logistics-type>
                                </el-form-item>
                                <el-form-item label="原始订单：" v-if="detailForm.order_type === 'merged'">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th align="left">订单号</th>
                                            <th align="left">客户</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(item,$index) in detailForm.origin_orders" :key="$index">
                                            <td>
                                                <router-link class="blue margin-right-20" :to="'detail?id='+item.id"
                                                             target="_blank">
                                                    {{item.name}}
                                                </router-link>
                                            </td>
                                            <td>
                                            <span v-if="item.route_map && item.route_map.length>0">
                                                {{item.route_map[item.route_map.length-1].company_name}}
                                            </span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="8" class="clearfix">
                            <div class="padding-bottom-20">
                                <el-button type="warning" plain v-if="detailForm.name"
                                           @click="$router.push({
                                           path:'logistics',
                                           query:{
                                               orderName:detailForm.name,
                                               parentQuery:parentQuery || null,
                                           }
                                       })">物流日志
                                </el-button>

                                <order-detail-cancel-model
                                        class="margin-left-10 margin-right-10"
                                        v-if="showRequestCancel && detailForm.order_base_state!=='cancelled'"
                                        :detailForm="detailForm"
                                        @update="init">
                                    取消
                                </order-detail-cancel-model>

                                <el-button-group class="margin-left-10 margin-right-10" v-if="showWithDraw">
                                    <el-button plain @click="cancelChangeStatus('revert_cancel')">撤销取消</el-button>
                                    <el-button plain v-if="showConfirmCancel" @click="cancelChangeStatus('cancel')">确认取消</el-button>
                                </el-button-group>

                                <el-button plain v-if="showRestoreOrder" @click="cancelChangeStatus('revert_cancel')">恢复订单</el-button>

                                <el-button type="warning" plain
                                           v-if="detailForm.view_control && detailForm.view_control.transfer_button && detailForm.view_control.transfer_button!=='request_transfer'"
                                           @click="$router.push({path:'/logistics/stockIn/detail?id='+queryId})">入库
                                </el-button>

                                <el-button type="warning" plain
                                           v-if="detailForm.view_control && detailForm.view_control.transfer_button && detailForm.view_control.transfer_button==='request_transfer'"
                                           @click="$router.push({path:'/logistics/transfers/detail?id='+queryId})">现货调拨
                                </el-button>

                                <el-button class="margin-right-10" type="warning" plain
                                           @click="clickRelationStockOut">关联出库单
                                </el-button>

                                <el-button @click="clickEditOrderInquiryPriority()">修改订单属性</el-button>
                            </div>

                            <div>
                                <email-message-count-button
                                        class="margin-right-10"
                                        v-if="detailForm.name"
                                        :orderDetail="detailForm"
                                        :brandId="detailForm.brand ? detailForm.brand.id : null"
                                        :module_id="detailForm.name"
                                        module_name="order"
                                        subsystem="platform">
                                </email-message-count-button>

                                <SelectContractTemplateInquiry
                                        v-if="$store.state.currentCompany.account_company_id===39567"
                                        name="导出合同"
                                        :hasNoCustomer="true"
                                        :orderData="detailForm"
                                        alias_name="SalesOrder"
                                        class="margin-right-10">
                                </SelectContractTemplateInquiry>
                            </div>

                        </el-col>
                        <el-col :span="10" class="clearfix">
                            <order-detail-status-box class="right" :queryId="queryId"
                                                     :orderData="detailForm"></order-detail-status-box>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <order-detail-company-line
                    :queryId="queryId"
                    :orderData="detailForm"
                    :orderNodesMaps="orderNodesMaps"
                    @updateInit="init">
            </order-detail-company-line>

            <order-detail-product
                    ref="orderDetailProduct"
                    :queryId="queryId"
                    :orderData.sync="detailForm"
                    :orderNodesMaps="orderNodesMaps"
                    @updateInit="init">
            </order-detail-product>

        </div>


        <el-dialog title="修改订单属性" :visible.sync="editOrderInquiryPriorityDialogShow" width="450px"
                   :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editOrderInquiryPriority" label-width="100px">
                <el-form-item label="订单优先级：">
                    <el-select v-model="editOrderInquiryPriority.inquiry_priority">
                        <el-option v-for="item in $store.state.orderInquiryPriority"
                                   :value="item.code"
                                   :key="item.code"
                                   :label="item.label"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editOrderInquiryPrioritySave()">保 存</el-button>
                <el-button @click="editOrderInquiryPriorityDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>


    import OrderDetailStatusBox from "./component/order-detail-status-box";
    import OrderDetailCompanyLine from "./component/order-detail-company-line";
    import OrderDetailProduct from "./component/order-detail-product";
    import EmailMessageCountButton from "../related-message/email-message-count-button";
    import LogisticsType from "../logistics/stockIn/component/logisticsType";
    import OrderDetailCancelModel from "./component/order-detail-cancel-model";

    export default {
        components: {
            OrderDetailCancelModel,
            LogisticsType,
            EmailMessageCountButton,
            OrderDetailProduct,
            OrderDetailCompanyLine,
            OrderDetailStatusBox

        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                orderState: '',
                searchListUrl: this.$api.order_order_search,
                breadNameList: {
                    in_quote: '下单',
                    processing: '执行中订单',
                    done: '已完结订单',
                    cancelled: '已取消订单',
                    all: '全部订单',
                },


                detailForm: {},
                detailFormRule: {
                    /*customer_type: [
                        {required: true, message: '请选择客户性质！'}
                    ],*/
                },

                orderNodesMaps: {},


                editOrderInquiryPriority: {
                    inquiry_priority: '',
                },
                editOrderInquiryPriorityDialogShow: false,


                loading: false,


                showRequestCancel:false,
                showConfirmCancel:false,
                showWithDraw:false,
                showRestoreOrder:false,


            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if (this.$route.params.orderState) {
                    this.orderState = this.$route.params.orderState;
                    if (this.orderState !== 'all') {
                        this.searchListUrl = this.$api.order_order_search + '/' + this.orderState;
                    }
                }

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
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.getOrderNodeAction(data.msg);
                        }
                    },
                    error(data) {
                        if (data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40203) > -1) {
                            self.$router.back();
                        }
                    }
                })
            },
            getOrderNodeAction(detailForm) {
                let self = this;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/action',
                    success: function (data) {
                        self.loading = false;
                        self.setDetailFormKey(detailForm, data)
                    },
                    error() {
                        self.detailForm = detailForm;
                    }
                })
            },

            setDetailFormKey(detailForm, actionData) {
                let self = this;

                if (detailForm.order_nodes) {
                    let hasNodeIsContract=false;
                    self.orderNodesMaps = {};
                    detailForm.order_nodes.forEach((item, $index) => {
                        self.orderNodesMaps[item.account_company_id] = item;
                        if (actionData.msg && actionData.msg.node_control && actionData.msg.node_control[item.id]) {
                            item.action = actionData.msg.node_control[item.id]
                        } else {
                            item.action = {};
                        }

                        item.nodeInfoShow = false;
                        item.inEdit = false;
                        if ($index === 0 && item.account_company && item.account_company.company_type === 'internal') {
                            item.topInternalCompany = true;
                        }
                        if($index<detailForm.order_nodes.length-1 && (item.state==='contract_performed' || item.state==='done')){
                            hasNodeIsContract = true;
                        }
                    });

                    //只有零搜供应链、ZNS公司，并且除联营公司客户节点外，都为执行合同时，可以取消订单
                    self.showRequestCancel = [9428, 39567].indexOf(self.$store.state.currentCompany.account_company_id) > -1 && !hasNodeIsContract;
                }
                self.detailForm = detailForm;

                self.$nextTick(()=>{
                    self.$refs.orderDetailProduct.init();
                });

                if(actionData.msg && actionData.msg.cancel_control){
                    let cancel_control = actionData.msg.cancel_control;
                    // self.showRequestCancel = cancel_control.indexOf('request_cancel')>-1;
                    self.showConfirmCancel = cancel_control.indexOf('confirmed_cancel')>-1;
                    self.showWithDraw = cancel_control.indexOf('revert_cancel')>-1;
                    self.showRestoreOrder = cancel_control.indexOf('restore_order')>-1;
                }
            },


            clickEditOrderInquiryPriority() {
                this.editOrderInquiryPriorityDialogShow = true;
                this.editOrderInquiryPriority = {
                    order_id: this.queryId,
                    inquiry_priority: this.detailForm.inquiry_priority,
                }
            },
            editOrderInquiryPrioritySave() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/base_info',
                    type: 'PUT',
                    requestBody: true,
                    data: self.editOrderInquiryPriority,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.editOrderInquiryPriorityDialogShow = false;
                            self.init();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },

            cancelChangeStatus(status) {
                let self=this;
                let order_node_id = null;
                if (self.detailForm.order_nodes) {
                    self.detailForm.order_nodes.forEach((node) => {
                        if(node.account_company_id === self.$store.state.currentCompany.account_company_id){
                            order_node_id = node.id;
                        }
                    });
                }
                if (order_node_id) {
                    self.loading = true;
                    self.$http({
                        url: self.$api.order_order_orders + '/' + self.queryId + '/order_cancel_action',
                        type: 'PUT',
                        requestBody: true,
                        data: {
                            name: status,
                            order_id: self.queryId,
                            order_node_id: order_node_id,
                        },
                        success () {
                            self.loading = false;
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.init();
                        }
                    });
                }
            },
            

            clickRelationStockOut() {
                let routeData = this.$router.resolve({
                    path: '/logistics/stockOut/list',
                    query: {
                        filter: encodeURIComponent(JSON.stringify([
                            ['order_name', '=', this.detailForm.name]
                        ]))
                    }
                });
                window.open(routeData.href, '_blank');
            },

            customTypeAction() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/custom_type_action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        order_id: self.queryId,
                    },
                    success: function () {
                        self.loading = false;
                        self.init();
                    }
                })
            }

        }
    }
</script>

<style lang="scss">


</style>
