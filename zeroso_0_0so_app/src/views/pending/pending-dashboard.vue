<template>
    <div class="flex-box-column pending-dashboard">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>待处理</el-breadcrumb-item>
                    <el-breadcrumb-item>总览</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <el-card class="margin-bottom-20" v-loading="needToDoDetailLoading">
                <h3 slot="header">待处理总览</h3>
                <table class="table">
                    <thead>
                    <tr>
                        <th>业务员</th>
                        <th>邮件</th>
                        <th>大单跟进</th>
                        <th>已报价待追踪</th>
                        <th>待填报价</th>
                        <th>待发询价</th>
                        <th>待催报价</th>
                        <th>待下单</th>
                        <th>待催OC</th>
                        <th>待关联收款</th>
                        <th>待确认取消</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,$index) in needToDoDetail" :key="$index">
                        <td>
                            <span>{{item.name}}</span>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.undeal_mail"
                               @click="goList('undeal_mail',item.values.undeal_mail.filter)">
                                {{item.values.undeal_mail.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.big_order"
                               @click="goList('big_order',item.values.big_order.filter)">
                                {{item.values.big_order.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.need_feedback_little_order"
                               @click="goList('need_feedback_little_order',item.values.need_feedback_little_order.filter)">
                                {{item.values.need_feedback_little_order.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.waiting_quote"
                               @click="goList('waiting_quote',item.values.waiting_quote.filter)">
                                {{item.values.waiting_quote.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.is_need_quote"
                               @click="goList('is_need_quote',item.values.is_need_quote.filter)">
                                {{item.values.is_need_quote.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.waiting_supplier"
                               @click="goList('waiting_supplier',item.values.waiting_supplier.filter)">
                                {{item.values.waiting_supplier.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.waiting_perform"
                               @click="goList('waiting_perform',item.values.waiting_perform.filter)">
                                {{item.values.waiting_perform.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.waiting_oc"
                               @click="goList('waiting_oc',item.values.waiting_oc.filter)">
                                {{item.values.waiting_oc.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.need_relation"
                               @click="goList('need_relation',item.values.need_relation.filter)">
                                {{item.values.need_relation.count}}
                            </a>
                        </td>
                        <td>
                            <a class="blue cursor-pointer" v-if="item.values.request_cancel_state_my"
                               @click="goList('request_cancel_state_my',item.values.request_cancel_state_my.filter)">
                                {{item.values.request_cancel_state_my.count}}
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-card>


            <el-card class="margin-bottom-20" v-loading="businessInfoDetailLoading">
                <h3 slot="header">
                    <span class="margin-right-20">业绩总览</span>

                    <el-select v-model="selectMonth" @change="getBusinessInfoDetail">
                        <el-option
                                v-for="(item,$index) in monthsList"
                                :value="item[0]"
                                :label="item[0]"
                                :key="$index">
                        </el-option>
                    </el-select>
                </h3>
                <table class="table">
                    <thead>
                    <tr>
                        <th>业务员</th>
                        <th>本月询价数</th>
                        <th>本月成单数</th>
                        <th>本月成交金额</th>
                        <th>今日询价数</th>
                        <th>今日成单数</th>
                        <th>今日成交金额</th>
                        <th>跟进客户</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr  v-for="(item,$index) in businessInfoDetail" :key="$index">
                        <td><span>{{item.name}}</span></td>
                        <td><span v-if="item.values.month_quote">{{item.values.month_quote.count}}</span></td>
                        <td><span v-if="item.values.month_performed_total">{{item.values.month_performed_total.count}}</span></td>
                        <td><span v-if="item.values.month_performed_price">{{item.values.month_performed_price.count}}</span></td>
                        <td><span v-if="item.values.daily_quote">{{item.values.daily_quote.count}}</span></td>
                        <td><span v-if="item.values.daily_performed_total">{{item.values.daily_performed_total.count}}</span></td>
                        <td><span v-if="item.values.daily_performed_price">{{item.values.daily_performed_price.count}}</span></td>
                        <td><span v-if="item.values.follower_total">{{item.values.follower_total.count}}</span></td>
                    </tr>
                    </tbody>
                </table>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                needToDoDetail: [],
                needToDoDetailLoading: false,

                monthsList:[],
                selectMonth:null,
                businessInfoDetail: [],
                businessInfoDetailLoading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getNeedToDoDetail();
                this.getMonths();
            },
            getNeedToDoDetail() {
                let self = this;
                self.needToDoDetailLoading = true;
                self.$http({
                    url: self.$api.order_v4_panel_need_to_do,
                    success: function (data) {
                        self.needToDoDetailLoading = false;
                        self.needToDoDetail = data.msg || [];
                    }
                })
            },

            goList(field, filter) {
                let query = {
                    filter: filter.filter,
                    order_by: filter.order_by ? filter.order_by[0] : undefined,
                };
                let path = null;

                if (field === 'undeal_mail') {
                    path = '/email/waiting/list';
                } else if (field === 'need_relation') {
                    path = '/finance/bank-statement-line/need_inbound/list';
                } else {
                    path = '/order/order/all/list';
                }
                let routerData = this.$router.resolve({
                    path: path,
                    query: query
                });
                window.open(routerData.href)
            },



            getMonths() {
                let self = this;
                self.businessInfoDetailLoading = true;
                self.$http({
                    url: self.$api.order_v4_panel_months,
                    success: function (data) {
                        self.businessInfoDetailLoading = false;
                        self.monthsList = data.msg || [];
                        self.selectMonth = self.monthsList[0][0];
                        self.getBusinessInfoDetail();
                    }
                })
            },
            getBusinessInfoDetail() {
                let self = this;
                self.businessInfoDetailLoading = true;
                self.$http({
                    url: self.$api.order_v4_panel_business_info,
                    data: {
                        period: self.selectMonth
                    },
                    success: function (data) {
                        self.businessInfoDetailLoading = false;
                        self.businessInfoDetail = data.msg || [];
                    }
                })
            },


        }
    }
</script>

<style lang="scss">
    .pending-dashboard{
        .table {
            width: 100%;
            border-collapse: collapse;

            th, td {
                border: 1px solid #ebeef5;
                padding: 8px 10px;
                text-align: left;
                color: #606266;
            }

            th {
                background-color: #f2f6fc;
            }

            tr:hover td {
                background-color: #f5f7fa;
            }
        }
    }
</style>
