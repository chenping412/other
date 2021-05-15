<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>{{breadNameList[orderState]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="'order_'+orderState" :allowFilterFieldsUrl="searchListUrl"
                           :groupConfig="groupConfig"
                           @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="$router.push('/order/order/all/create')">创建订单</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" @row-click="openDetail" :row-class-name="tableRowClassName" stripe border
                      v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="品牌" field_name="brand"></ButtonSort>
                        <ButtonSort label="订单号" field_name="name"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{(scope.row.brand?scope.row.brand.name:'') | defaultStr}}</p>
                        <p>{{scope.row.name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <p v-if="scope.row.brand">
                            <BrandLever :state="scope.row.brand.state"></BrandLever>
                        </p>
                        <p>
                            <OrderInquiryPriority :state="scope.row.inquiry_priority"></OrderInquiryPriority>
                            <el-tag type="danger" effect="dark" v-if="scope.row.is_request_cancelled">申取</el-tag>
                            <el-tag type="danger" effect="dark" v-if="scope.row.order_base_state === 'cancelled'">取
                            </el-tag>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column width="250">
                    <template slot="header">
                        <ButtonSort label="上游公司" field_name="supplier_company"></ButtonSort>
                        <ButtonSort label="下游公司" field_name="customer_company"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.supplier">
                                <span>{{scope.row.supplier.company_name | mainCompanyAbbreviationCode(scope.row.supplier.account_company_id)}}</span>
                                <CompanyType :type="scope.row.supplier.company_type"></CompanyType>
                                <span v-if="scope.row.supplier_user">，{{scope.row.supplier_user.name}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </div>
                        <div>
                            <p v-if="scope.row.customer">
                                <span>{{scope.row.customer.company_name | mainCompanyAbbreviationCode(scope.row.customer.account_company_id)}}</span>
                                <CompanyType :type="scope.row.customer.company_type"></CompanyType>
                                <span v-if="scope.row.customer_user">，{{scope.row.customer_user.name}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="上游订单状态" field_name="supplier_state"></ButtonSort>
                        <ButtonSort label="下游订单状态" field_name="customer_state"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_state | zerosoOrderStatus|defaultStr}}</p>
                        <p>{{scope.row.customer_state | zerosoOrderStatus|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <p>上游付款状态</p>
                        <p>下游收款状态</p>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.outbound_state|zerosoOrderPaymentState|defaultStr}}</p>
                        <p>{{scope.row.inbound_state|zerosoOrderReceiptState|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <p>上游发票状态</p>
                        <p>下游发票状态</p>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_invoice_state|zerosoOrderInvoiceState|defaultStr}}</p>
                        <p>{{scope.row.customer_invoice_state|zerosoOrderInvoiceState|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <p>物流状态</p>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.logistics_state|logisticsStatus|defaultStr}}</p>
                        <p>{{scope.row.logistics_time | zerosoCompanyTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="上游未税金额" field_name="supplier_untaxed_amount"></ButtonSort>
                        <ButtonSort label="下游未税金额" field_name="customer_untaxed_amount"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_untaxed_amount |
                            isoCurrency(scope.row.supplier_currency)|defaultStr}}</p>
                        <p>{{scope.row.customer_untaxed_amount |
                            isoCurrency(scope.row.customer_currency)|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="上游总额" field_name="supplier_total_amount"></ButtonSort>
                        <ButtonSort label="下游总额" field_name="customer_total_amount"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_total_amount | isoCurrency(scope.row.supplier_currency)|defaultStr}}</p>
                        <p>{{scope.row.customer_total_amount | isoCurrency(scope.row.customer_currency)|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="创建时间" field_name="create_time"></ButtonSort>
                        <ButtonSort label="修改时间" field_name="write_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.create_time | zerosoTimeFormat(8) | defaultStr}}</p>
                        <p>{{scope.row.write_time | zerosoTimeFormat(8) | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column width="160px">
                    <template slot="header">
                        <ButtonSort label="上游状态发生时间" field_name="supplier_state_time"></ButtonSort>
                        <ButtonSort label="下游状态发生时间" field_name="customer_state_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_state_time | zerosoTimeFormat(8) | defaultStr}}</p>
                        <p>{{scope.row.customer_state_time | zerosoTimeFormat(8) | defaultStr}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {
                orderState: '',
                searchListUrl: this.$api.order_order_search,
                breadNameList: {
                    in_quote: '下单',
                    processing: '执行中订单',
                    done: '已完结订单',
                    cancelled: '已取消订单',
                    all: '全部订单',
                },

                filter: {},
                order_by: undefined,

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                listDataSelection: [],

                loading: false,

                //分组列表配置
                groupConfig: [
                    {
                        title: [
                            {
                                title: '组名',
                            },
                        ],
                        dataIndex: 'value',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '上游未税总额',
                            },
                        ],
                        dataIndex: 'supplier_untaxed_amount',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '上游含税总额',
                            },
                        ],
                        dataIndex: 'supplier_total_amount',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '下游未税总额',
                            },
                        ],
                        dataIndex: 'customer_untaxed_amount',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '下游含税总额',
                            },
                        ],
                        dataIndex: 'customer_total_amount',
                        edit: false
                    },
                ],
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
                if (this.$route.params.orderState) {
                    this.orderState = this.$route.params.orderState;
                    if (this.orderState !== 'all') {
                        this.searchListUrl = this.$api.order_order_search + '/' + this.orderState;
                    }else {
                        this.searchListUrl = this.$api.order_order_search
                    }
                }
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : undefined;
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();


            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.searchListUrl,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "order_" + self.orderState
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            openDetail(row) {
                let query = {
                    id: row && row.id ? row.id : undefined,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },


            tableRowClassName({row}) {
                if (row.order_base_state === 'cancelled') {
                    return 'order-cancelled';
                }
                return '';
            },
        }
    }
</script>

<style lang="scss">
    .order-cancelled {
        color: #999999;
        td {
            background-color: #dddddd !important;
        }
    }
</style>
