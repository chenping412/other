<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[orderState]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? (detailForm.name ? '订单详情：'+detailForm.name :'') : '创建订单'}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-10">{{detailForm.order_type === 'merged'?'合并单号':'订单编号'}}：</span>
                        <span class="margin-right-10">{{detailForm.name | defaultStr}}</span>
                        <!--                        <OrderInquiryPriority class="margin-right-10" :state="detailForm.inquiry_priority"></OrderInquiryPriority>-->
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
                                <el-form-item label="跟进人：">
                                    <span class="form-border-bottom">
                                        <template v-for="(item,$index) in detailForm.route_map">
                                            <span :key="$index"
                                                  v-if="item.account_company_id===$store.state.currentCompany.account_company_id">{{item.name}}</span>
                                        </template>
                                    </span>
                                </el-form-item>
                                <!--                                <el-form-item label="询报价单号：">-->
                                <!--                                    <span class="form-border-bottom">-->
                                <!--                                        <router-link class="blue" :to="'/inquiry-price/all/detail?id='+detailForm.id" target="_blank">-->
                                <!--                                            {{detailForm.id}}-->
                                <!--                                        </router-link>-->
                                <!--                                    </span>-->
                                <!--                                </el-form-item>-->
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
                        <el-col :span="6">
                            <div class="padding-bottom-20">
                                <el-button class="margin-right-20" type="warning" plain v-if="detailForm.name"
                                           @click="$router.push({
                                           path:'logistics',
                                           query:{
                                               orderName:detailForm.name,
                                               parentQuery:parentQuery || null,
                                           }
                                       })">
                                    物流日志
                                </el-button>
                            </div>
                            <div>
                                <email-message-count-button
                                        class="margin-right-20"
                                        v-if="detailForm.name"
                                        :hideEmail="!$store.state.permissionsMap['mail']"
                                        :orderDetail="detailForm"
                                        :brandId="detailForm.brand ? detailForm.brand.id : null"
                                        :module_id="detailForm.name"
                                        module_name="order"
                                        subsystem="platform">
                                </email-message-count-button>
<!--                                <el-button @click="clickEditOrderInquiryPriority()">修改订单属性</el-button>-->
                            </div>

                        </el-col>
                        <el-col :span="12" class="clearfix">
                            <order-detail-status-box class="right" :queryId="queryId"
                                                     :orderData="detailForm"></order-detail-status-box>
                        </el-col>
                    </el-row>
                </div>
            </div>

            <order-detail-company-line :queryId="queryId" :orderData="detailForm" :orderNodesMaps="orderNodesMaps"
                                       @updateInit="init"></order-detail-company-line>

            <order-detail-product :queryId="queryId" :orderData="detailForm" :orderNodesMaps="orderNodesMaps"
                                  @updateInit="init"></order-detail-product>

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
    import EmailMessageCountButton from "../related-email-message/email-message-count-button";

    export default {
        components: {
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
                let orderNodesMaps = {};
                if (detailForm.order_nodes) {
                    detailForm.order_nodes.forEach((item, $index) => {
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
                        if (item.account_company_id === self.$store.state.currentCompany.account_company_id) {
                            if ($index > 0) detailForm.order_nodes[$index - 1].isSupplier = true;
                            if ($index < detailForm.order_nodes.length - 1) detailForm.order_nodes[$index + 1].isCustomer = true;
                        }
                        orderNodesMaps[item.account_company_id] = item;
                    });
                }
                self.detailForm = detailForm;
                self.orderNodesMaps = orderNodesMaps;
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

        }
    }
</script>

<style lang="scss">


</style>
