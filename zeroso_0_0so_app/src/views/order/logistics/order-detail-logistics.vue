<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[orderState]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <span class="el-breadcrumb__inner is-link" @click="$router.back()">
                            {{orderName ? '订单详情：'+orderName :''}}
                        </span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>物流日志</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card class="margin-bottom-20">
                <div slot="header">
                    <h3 class="inline-block">到货信息</h3>
                    <span class="margin-left-20">品牌: {{orderBrandName}}</span>
                    <span class="margin-left-20">订单号: {{orderName}}</span>
                </div>
                <el-table :data="remaining_order_lines" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号" prop="product_name"></el-table-column>
                    <el-table-column label="订货号" prop="product_order_no"></el-table-column>
                    <el-table-column label="数量" prop="purchase_quantity"></el-table-column>
                    <el-table-column label="待收货数量" prop="remaining_quantity"></el-table-column>
                </el-table>
            </el-card>

            <el-card class="margin-bottom-20" v-if="third_delivery_numbers.length>0">
                <h3 slot="header">快递信息</h3>
                <div>
                    <el-radio-group v-model="third_delivery_numbers_checked" size="small">
                        <el-radio-button v-for="(item,$index) in third_delivery_numbers" :key="$index"
                                         :label="item"></el-radio-button>
                    </el-radio-group>

                    <div class="padding-top-10" v-if="third_delivery_numbers_checked && deliveryLogs && deliveryLogs.length>0">
                        <el-table :data="deliveryLogs" border v-loading="deliveryLogsLoading">
                            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                            <el-table-column label="时间" prop="create_time">
                                <template slot-scope="scope">
                                    {{scope.row.create_time | zerosoCompanyTime}}
                                </template>
                            </el-table-column>
                            <el-table-column label="地点" prop="location"></el-table-column>
                            <el-table-column label="状态" prop="remark"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-card>

            <template v-for="(boxItem,$index) in boxes">
                <el-card class="margin-bottom-20" :key="$index">
                    <h3 slot="header">
                        <span>箱号：</span>
                        <el-popover trigger="hover" placement="bottom-start" width="700">
                            <span slot="reference" class="blue cursor-pointer">{{boxItem.box_name}}</span>
                            <el-table :data="boxItem.box_lines" border>
                                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                                <el-table-column label="型号">
                                    <template slot-scope="scope" v-if="scope.row.product_info">
                                        {{scope.row.product_info.product_name}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="订货号">
                                    <template slot-scope="scope" v-if="scope.row.product_info">
                                        {{scope.row.product_info.product_order_no}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="数量" prop="quantity" width="120"></el-table-column>
                            </el-table>
                        </el-popover>
                    </h3>
                    <div style="padding-left: 50px;" v-if="boxItem.logs && boxItem.logs.length>0">
                        <div class="box-log-line font-weight-bold clearfix"
                             style="padding-bottom: 10px;margin: 0 0 20px 30px;">
                            <p class="box-log-line-col">时间</p>
                            <p class="box-log-line-col">状态</p>
                            <p class="box-log-line-col box-log-line-col2">地点和追踪进度</p>
                        </div>
                        <el-timeline>
                            <el-timeline-item
                                    v-for="(logLine, $index) in boxItem.logs"
                                    :key="$index"
                                    :hide-timestamp="true"
                                    :type="$index===0?'success':null"
                                    :timestamp="logLine.create_time">
                                <div class="box-log-line clearfix" :class="{'blue font-weight-bold':$index===0}">
                                    <p class="box-log-line-col">{{logLine.create_time | zerosoCompanyTime}}</p>
                                    <p class="box-log-line-col">{{logLine.action | logisticsActionName}}</p>
                                    <p class="box-log-line-col box-log-line-col2">{{logLine |zerosoLocationAndSchedule}}</p>
                                </div>
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>
            </template>

        </div>
    </div>
</template>

<script>
    import Vue from "vue";

    let zerosoCompanyTime = Vue.filter('zerosoCompanyTime');
    export default {
        data() {
            return {
                orderName: '',
                parentQuery: '',

                orderState: '',
                breadNameList: {
                    in_quote: '下单',
                    processing: '执行中订单',
                    done: '已完结订单',
                    cancelled: '已取消订单',
                    all: '全部订单',
                },

                orderBrandName: '',
                remaining_order_lines: [],


                third_delivery_numbers: [],
                third_delivery_numbers_checked: '',
                deliveryLogs: [],
                deliveryLogsLoading: false,

                boxes: [],


                loading: false,
            }
        },
        watch: {
            third_delivery_numbers_checked(val) {
                this.getThirdDeliveryNumbersDetail(val);
            },
            '$route'() {
                this.init()
            }
        },
        filters: {
            logisticsActionName(action) {
                let actions = {
                    incoming_transfer: '已入库',
                    outgoing_transfer: '已出库',
                    request_transfer: '已调拨',
                    box_split: '已分箱',
                    put_in_pallet: '已装托盘',
                    internal_transfer_out: '已转运出库',
                    temp_docking: '中转信息',
                    internal_transfer_in: '已转运入库',
                    internal_transfer: '转运',
                };
                return actions[action] || action;
            },
            zerosoLocationAndSchedule(log) {
                let toCountry;
                let toCompany;
                let fromCountry;
                let fromCompany;
                const country = {
                    DE: "德国",
                    CN: "中国",
                    HK: "香港"
                };
                let result;
                if (log.from_company) {
                    fromCompany = log.from_company.company_name;
                    fromCountry = country[log.from_company.country];
                } else {
                    fromCompany = '';
                    fromCountry = '';
                }

                if (log.to_company) {
                    toCompany = log.to_company.company_name;
                    toCountry = country[log.to_company.country];
                } else {
                    toCompany = '';
                    toCountry = '';
                }

                switch (log.action) {
                        // 入库
                    case "incoming_transfer":
                        result = `[${toCountry}] ${toCompany} 仓库 已入库`;
                        break;
                        //出库
                    case "outgoing_transfer":
                        result = `[${fromCountry}] ${fromCompany} 仓库 已出库`;
                        break;
                        //调拨
                    case "request_transfer":
                        result = `[${toCountry}] ${toCompany} 仓库 已入库`;
                        break;
                        //分箱
                    case "box_split":
                        result = `[${fromCountry}] ${fromCompany} 重新打包`;
                        break;
                        //已装箱
                    case "put_in_pallet":
                        if (log.additional_info.plan_info) {
                            result = `准备从 [${fromCountry}] ${fromCompany} 发往 [${toCountry}]${toCompany}, 预计发货时间 ${zerosoCompanyTime(log.additional_info.plan_info.plan_leave_date)}`;
                        } else {
                            result = `准备从 [${fromCountry}] ${fromCompany} 发往 [${toCountry}] ${toCompany}`;
                        }
                        break;
                        //转运出库(废弃)
                    case "internal_transfer":
                        result = `[${fromCountry}] ${fromCompany} 发往 [${toCountry}] ${toCompany}`;
                        break;
                        //已出库
                    case "internal_transfer_out":
                        result = `已从 [${fromCountry}] ${fromCompany} 仓库 出库, 正在发往 [${toCountry}] ${toCompany}`;
                        break;
                        //中转信息
                    case "temp_docking":
                        result = `${zerosoCompanyTime(log.additional_info.temp_docking_info.arrive_date)} 中途停靠 [${country[log.additional_info.temp_docking_info.location] || log.additional_info.temp_docking_info.location}],
                        预计 ${zerosoCompanyTime(log.additional_info.temp_docking_info.leave_date)} 发往 [${country[log.additional_info.temp_docking_info.delivery_to] || log.additional_info.temp_docking_info.delivery_to}]`;
                        break;
                        //转运入库
                    case "internal_transfer_in":
                        result = `[${toCountry}] ${toCompany} 仓库 已入库, 来自 [${fromCountry}] ${fromCompany}`;
                        break;
                    default:
                        result = ``;
                        break;
                }
                return result;
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                this.orderState = this.$route.params.orderState;
                self.parentQuery = self.$route.query.parentQuery;

                if (self.$route.query.orderName) {
                    self.orderName = self.$route.query.orderName;
                    self.getDetailData();
                }
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_route_log,
                    data: {
                        order_id: self.orderName
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg[0]) {
                            if (data.msg[0].remaining_order_lines) {
                                self.remaining_order_lines = data.msg[0].remaining_order_lines;
                                if (self.remaining_order_lines[0]) {
                                    self.orderBrandName = self.remaining_order_lines[0].brand_name
                                }
                            }
                            if (data.msg[0].third_delivery_numbers) {
                                self.third_delivery_numbers = data.msg[0].third_delivery_numbers;
                                if (self.third_delivery_numbers.length > 0) {
                                    self.third_delivery_numbers_checked=self.third_delivery_numbers[0];
                                }
                            }
                            if (data.msg[0].boxes) self.boxes = data.msg[0].boxes;
                        }
                    }
                })
            },


            getThirdDeliveryNumbersDetail(number) {
                let self = this;
                self.deliveryLogs = [];
                console.log(number)
                // self.deliveryLogsLoading = true;
                // self.$http({
                //     url: self.$api.logistics_third_delivery_routes,
                //     data: {
                //         delivery_request_code: 'sf_express',
                //         mail_no: number,
                //     },
                //     success: function (data) {
                //         self.deliveryLogsLoading = false;
                //         if (data.err_code.length === 0 && data.msg && data.msg.items) {
                //             self.deliveryLogs = data.msg.items;
                //         }
                //     }, error() {
                //         self.deliveryLogsLoading = false;
                //     }
                // })
            },

        }
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";

    .box-log-line {
        border-bottom: 1px solid $color-border;
        padding: 0 0 10px;
        line-height: 24px;

        .box-log-line-col {
            float: left;
            width: 20%;
            padding: 0 15px;
            box-sizing: border-box;
        }

        .box-log-line-col2 {
            width: 60%;
        }
    }
</style>
