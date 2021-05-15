<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>{{breadNameList[orderState]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="'order_'+orderState" :allowFilterFieldsUrl="searchListUrl" :groupConfig="groupConfig" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
<!--                    <el-button type="primary" @click="openDetail()">创建订单</el-button>-->
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="品牌" field_name="brand"></ButtonSort>
                        <ButtonSort label="订单号" field_name="name"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{(scope.row.brand?scope.row.brand.name:'') | defaultStr}}</p>
                        <p>
                            <span>{{scope.row.name | defaultStr}}</span>
                            <el-tag type="danger" effect="dark" v-if="scope.row.is_request_cancelled">申取</el-tag>
                            <el-tag type="danger" effect="dark" v-if="scope.row.order_base_state === 'cancelled'">取</el-tag>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column width="300">
                    <template slot="header">
                        <ButtonSort label="供应商" field_name="supplier_company"></ButtonSort>
                        <ButtonSort label="客户" field_name="customer_company"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.supplier && scope.row.supplier.company_name">
                                <span>{{scope.row.supplier.company_name | mainCompanyAbbreviationCode(scope.row.supplier.account_company_id)}}</span>
                                <CompanyType :type="scope.row.supplier.company_type"></CompanyType>
                                <span v-if="scope.row.supplier_user && scope.row.supplier_user.name">，{{scope.row.supplier_user.name}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </div>
                        <div>
                            <p v-if="scope.row.customer && scope.row.customer.company_name">
                                <span>{{scope.row.customer.company_name | mainCompanyAbbreviationCode(scope.row.customer.account_company_id)}}</span>
                                <CompanyType :type="scope.row.customer.company_type"></CompanyType>
                                <span v-if="scope.row.customer_user && scope.row.customer_user.name">，{{scope.row.customer_user.name}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="客户订单状态" field_name="customer_state"></ButtonSort>
                        <ButtonSort label="状态更新时间" field_name="customer_state_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.customer_state | zerosoOrderStatus|defaultStr}}</p>
                        <p>{{scope.row.customer_state_time | zerosoTimeFormat(8) | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <p>财务状态</p>
                        <p>物流状态</p>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.customer_finance_state | zerosoFinanceState|defaultStr}}</p>
                        <p>
                            <span>{{scope.row.logistics_state | logisticsStatus|defaultStr}}</span>
                            <span class="margin-left-10">{{scope.row.logistics_time | zerosoCompanyTime}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="供应商未税金额" field_name="supplier_untaxed_amount"></ButtonSort>
                        <ButtonSort label="客户未税金额" field_name="customer_untaxed_amount"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.supplier_untaxed_amount | isoCurrency(scope.row.supplier_currency)|defaultStr}}</p>
                        <p>{{scope.row.customer_untaxed_amount | isoCurrency(scope.row.customer_currency)|defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="供应商总额" field_name="supplier_total_amount"></ButtonSort>
                        <ButtonSort label="客户总额" field_name="customer_total_amount"></ButtonSort>
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
            </el-table>
        </div>

    </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {

                orderState:'',
                searchListUrl:this.$api.order_order_search,
                breadNameList:{
                    in_quote:'下单',
                    processing:'执行中订单',
                    done:'已完结订单',
                    cancelled:'已取消订单',
                    all:'全部订单',
                },

                filter: {},
                order_by:undefined,

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
        computed:{
            menuHasPartner() { //B系统根据Bmenu菜单配置，判断是否有合作伙伴菜单
                return !!this.$store.state.permissionsMap['partner']
            },
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
                if(this.$route.params.orderState){
                    this.orderState = this.$route.params.orderState;
                    if(this.orderState!=='all'){
                        this.searchListUrl = this.$api.order_order_search + '/' + this.orderState;
                    }else {
                        this.searchListUrl = this.$api.order_order_search;
                    }
                }
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : [];
                if(!this.menuHasPartner) {
                    this.filter.push(['is_new_account','=',!this.menuHasPartner]);
                }
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
                    requestBody:true,
                    data: {
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "order_"+self.orderState
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
                    id : row && row.id ? row.id : undefined,
                };
                if(!this.menuHasPartner) {
                    let routeQuery = JSON.parse(JSON.stringify(this.$route.query));
                    routeQuery.filter = encodeURIComponent(JSON.stringify(this.filter));
                    let routerData=this.$router.resolve({
                        path: this.$route.path,
                        query: routeQuery
                    });
                    let fullPath = routerData.href;
                    if (fullPath.split('?')[1]) query.parentQuery = fullPath.split('?')[1];
                }else {
                    if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                }
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },



        }
    }
</script>

<style>

</style>
