<template>
    <div class="flex-box-column stockIn-list">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>仓库 / 入库列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">

                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>


        <div class="container-content flex-item-scroll">
            <div class="container-table">
            <el-table :data="listData" @row-click="openDetail" :row-class-name="tableRowClassName" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="订单号/orderNo" prop="order_name"></el-table-column>
                <el-table-column label="品牌/brand">
                    <template slot-scope="scope" v-if="scope.row.brand">
                        <p>{{scope.row.brand.name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="供应商/supplier">
                    <template slot-scope="scope" v-if="scope.row.supplier">
                        <p>{{scope.row.supplier.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="客户/customer">
                    <template slot-scope="scope" v-if="scope.row.customer">
                        <p>{{scope.row.customer.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="采购负责人/follower">
                    <template slot-scope="scope" v-if="scope.row.purchaser_in_charge">
                        <p>{{scope.row.purchaser_in_charge.name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="下单天数" prop="createDates" width="80px"></el-table-column>
                <el-table-column label="货期天数" prop="deliveryDates" width="80px"></el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="供应商预计发货/dueReceiveDate" field_name="forecast_received_date"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.forecast_received_date | zerosoCompanyDate | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="入库状态|L.Status">
                    <template slot-scope="scope">
                        {{scope.row.incoming_state|zersoLogisticsIncomingStatus}}
                    </template>
                </el-table-column>

                <el-table-column label="报关类型|Type">
                    <template slot-scope="scope" v-if="scope.row.logistics_custom_type">
                        <el-tag type="warning" effect="dark">{{scope.row.logistics_custom_type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="供应商付款状态/S.P.Status">
                    <template slot-scope="scope">
                        {{scope.row.supplier_receipt_state | zerosoOrderPaymentState}}
                    </template>
                </el-table-column>


            </el-table>
        </div>
        </div>

    </div>
</template>

<script>

    export default {
        components: {},
        props:['delivery_package_id'],
        data() {
            return {
                listApi: this.$api.order_incoming_transfers + '/search',
                filterKey:'logistics_incoming_transfers',
                filter: {},

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
                if(this.delivery_package_id) this.listApi= this.$api.order_delivery_packages + '/' + this.delivery_package_id + '/incoming_transfers/search';

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
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        key: self.filterKey,
                        id:self.delivery_package_id
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items) {
                            let listData = data.msg.items;
                            let nowTime = new Date().getTime();
                            for(let i=0;i<listData.length;i++){
                                if(listData[i].forecast_received_date && listData[i].supplier_contract_performed_time){
                                    let forecast_received_date = self.$moment(listData[i].forecast_received_date).valueOf()
                                    let supplier_contract_performed_time = self.$moment(listData[i].supplier_contract_performed_time).valueOf()
                                    listData[i].createDates=Math.ceil((nowTime-supplier_contract_performed_time)/1000/60/60/24+1);
                                    listData[i].deliveryDates=Math.ceil((forecast_received_date-supplier_contract_performed_time)/1000/60/60/24+1);
                                }
                            }
                            self.listData = listData;
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
                    delivery_package_id : this.delivery_package_id
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: '/logistics/stockIn/detail',
                    query: query
                });
            },


            tableRowClassName({row}){
                const forecastReceivedDate = new Date(row.forecast_received_date).getTime();
                if (forecastReceivedDate < new Date().getTime() && row.incoming_state !== 'received' && row.incoming_state !== 'done') {
                    return 'over-time';
                }
            }

        }
    }
</script>

<style lang="scss">
.stockIn-list{
    .over-time{
        td{
            background-color: #f2b4b4;
        }
    }
}
</style>
