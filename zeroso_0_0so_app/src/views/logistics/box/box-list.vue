<template>
    <div class="flex-box-column stockIn-list">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>库存 / {{boxState==='order'?'订单箱':'库存箱'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" class="margin-right-10" v-if="boxState==='order'"
                               @click="exportStockList">导出库存表
                    </el-button>
                    <box-add class="margin-right-10" title="新建箱" v-if="$store.state.permissionsMap['StockBoxManageNeed']"></box-add>
                    <pallets-add class="margin-right-10" title="新建托盘"></pallets-add>
                    <stock-out-add title="新建出库单"></stock-out-add>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>


        <div class="container-content flex-item-scroll" v-loading="loading">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" border v-if="!loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="箱号" prop="name"></el-table-column>
                    <el-table-column label="品牌">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <p>{{scope.row.brand.name | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="所在仓" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.belong_to_company">
                            {{scope.row.belong_to_company.company_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column width="140px" v-if="boxState==='order'">
                        <template v-slot:header>
                            <ButtonSort label="入库时间" field_name="belong_to_company_time"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.belong_to_company_time | zerosoCompanyTime | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="下一节点" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.send_to_company">
                            {{scope.row.send_to_company.company_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售公司" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.sale_company">
                            {{scope.row.sale_company.company_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="客户" show-overflow-tooltip>
                        <template slot-scope="scope" v-if="scope.row.customer_company">
                            {{scope.row.customer_company.company_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="所在托盘">
                        <template slot-scope="scope" v-if="scope.row.pallet">
                            <p>{{scope.row.pallet.pallet_name | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="所在出库单">
                        <template slot-scope="scope" v-if="scope.row.transfer_order">
                            <p>{{scope.row.transfer_order.name | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户付款状态">
                        <template slot-scope="scope">
                            <p>{{scope.row.customer_receipt_state|zerosoOrderPaymentState | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户发票状态">
                        <template slot-scope="scope">
                            <p>{{scope.row.customer_invoice_state|zerosoOrderInvoiceState | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="报关类型">
                        <template slot-scope="scope" v-if="scope.row.logistics_custom_type">
                            <el-tag type="warning" effect="dark">{{scope.row.logistics_custom_type}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="箱状态">
                        <template slot-scope="scope">
                            {{scope.row.state|logisticsV4BoxState | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="箱类型" v-if="boxState==='stock'">
                        <template slot-scope="scope">
                            {{scope.row.type|logisticsV4BoxType | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="boxState==='order'">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"
                                       v-if="['in_transfer', 'transfered', 'done'].indexOf(scope.row.state) < 0"
                                       @click.native.stop="clickStockOutAdd(scope.row)">出库
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <stock-out-add ref="stockOutAdd" :buttonHidden="true"></stock-out-add>

    </div>
</template>

<script>

    import BoxAdd from "./box-add";
    import StockOutAdd from "../stockOut/component/stockOut-add";
    import PalletsAdd from "../pallets/pallets-add";

    export default {
        components: {PalletsAdd, StockOutAdd, BoxAdd},
        data() {
            return {
                listApi: null,
                filterKey: null,
                filter: {},
                boxState: null,

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.boxState = this.$route.params.boxState;
                this.listApi = this.$api.order_boxes + '/search/' + this.boxState;
                this.filterKey = 'logistics_boxes_' + this.boxState;

                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
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
                    url: self.listApi,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        key: self.filterKey,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items) {
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

            //导出库存表
            exportStockList() {
                let self = this;
                let q = window.encodeURIComponent(JSON.stringify({
                    page: self.pageNum,
                    per_page: self.pageSize,
                    filter: self.$utils.formatSearchFilter(self.filter),
                    order_by: self.order_by,
                    key: self.filterKey,
                }));
                let url = self.$api.order_boxes_export_order_box_excel;
                url = `${url}?q=${q}&current_company_id=${self.$store.state.currentCompany.account_company_id}&current_user_id=${self.$store.state.currentCompany.user_id}`;
                window.open(url);
            },


            //点击出库
            clickStockOutAdd(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_boxes + '/' + row.id,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            let boxDetail = data.msg;
                            let stockOutAddForm = {
                                belong_to_company_id: boxDetail.belong_to_company ? boxDetail.belong_to_company.account_company_id : null,
                                sale_company_id: boxDetail.sale_company ? boxDetail.sale_company.account_company_id : null,
                                send_to_company_id: boxDetail.customer_company ? boxDetail.customer_company.account_company_id : null,
                                send_to_company: boxDetail.customer_company,
                            };
                            self.$refs.stockOutAdd.boxAddStockOut(stockOutAddForm, [boxDetail]);
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">

</style>
