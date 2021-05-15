<template>
    <div class="order-detail-status-box" v-if="order_node_states.length>0" v-loading="loading">
        <ul class="status-list clearfix">
            <template v-for="(chainNode,$index) in order_node_states">
                <li :key="$index" v-if="$index<order_node_states.length-1">
                    <el-button type="text"
                               :disabled="($index !== currentIndex && $index !== currentIndex - 1)
                               || (orderData.merge_order_id && !mainCompanyAbbreviationCode[chainNode.account_company_id])
                               || ($index===0 && chainNode.company_type !== 'internal' && chainNode.state !== 'contract_performed' && chainNode.state !== 'done')"
                               :class="{'blue': chainNode.invoice_state==='partial', 'green': chainNode.invoice_state==='invoice'}"
                               @click="goInvoiceDetail(chainNode, $index, chainNode.invoice_state)"
                    >{{chainNode.invoice_state | zerosoOrderInvoiceState}}
                    </el-button>

                    <el-button type="text"
                               :disabled="($index !== currentIndex && $index !== currentIndex - 1)
                               || (orderData.merge_order_id && !mainCompanyAbbreviationCode[chainNode.account_company_id])
                               || ($index===0 && chainNode.company_type !== 'internal' && chainNode.state !== 'contract_performed' && chainNode.state !== 'done')"
                               :class="{'blue': chainNode.inbound_state==='partial', 'green': chainNode.inbound_state==='receipt'}"
                               @click="goReceipt(chainNode, $index)"
                    >{{chainNode.inbound_state | zerosoOrderReceiptState}}
                    </el-button>

                    <el-button type="text"
                               :disabled="($index !== currentIndex && $index !== currentIndex - 1)
                               || (orderData.merge_order_id && !mainCompanyAbbreviationCode[chainNode.account_company_id])
                               || ($index===0 && chainNode.company_type !== 'internal' && chainNode.state !== 'contract_performed' && chainNode.state !== 'done')"
                               :class="{'blue': chainNode.outbound_state==='partial', 'green': chainNode.outbound_state==='receipt'}"
                               @click="goReceipt(chainNode, $index)"
                    >{{chainNode.outbound_state | zerosoOrderPaymentState}}
                    </el-button>
                </li>
            </template>
        </ul>


        <el-steps class="steps" :active="currentIndex" finish-status="wait" process-status="finish" align-center>
            <template v-for="(chainNode,$index) in order_node_states">
                <el-step :key="$index">
                    <template slot="title">
                        <p v-if="$index===0">
                            <span v-if="chainNode.company_type !== 'internal'">供应商</span>
                            <span v-else>{{chainNode.account_company.company_name | mainCompanyAbbreviationCode(chainNode.account_company_id)}}</span>
                        </p>
                        <p v-if="$index>0 && $index<order_node_states.length-1">
                            {{chainNode.account_company.company_name |
                            mainCompanyAbbreviationCode(chainNode.account_company_id)}}
                        </p>
                        <p v-if="$index===order_node_states.length-1">
                            <span v-if="chainNode.company_type !== 'internal'">客户</span>
                            <span v-else>{{chainNode.account_company.company_name | mainCompanyAbbreviationCode(chainNode.account_company_id)}}</span>
                        </p>
                    </template>
                    <template slot="description">
                        <img class="step-box"
                             v-if="chainNode.company_type !== 'internal' && $index===0 && ['waiting','partial'].indexOf(orderData.logistics_state)>-1"
                             src="../../../assets/images/box.png">
                        <el-popover v-if="boxesLogistics[chainNode.account_company_id]" placement="bottom" width="500"
                                    trigger="hover">
                            <span class="step-box" slot="reference">
                                <img v-if="boxesLogistics[chainNode.account_company_id].length === 1"
                                     src="../../../assets/images/box.png">
                                <img v-if="boxesLogistics[chainNode.account_company_id].length > 1"
                                     src="../../../assets/images/boxes.png">
                            </span>
                            <div class="scroll" style="max-height:400px;">
                                <el-button type="primary" size="mini" class="right margin-10"
                                           v-if="isShowStockOutButton(boxesLogistics[chainNode.account_company_id])"
                                           @click="clickStockOutAdd(boxesLogistics[chainNode.account_company_id])">出库
                                </el-button>

                                <div class="padding-10"
                                     v-for="(box,$index) in boxesLogistics[chainNode.account_company_id]" :key="$index">
                                    <div class="padding-bottom-10">
                                        <span class="mr5">箱号：</span>
                                        <router-link class="blue" :to="'/logistics/box/order/detail?id='+box.id">
                                            {{box.box_name}}
                                        </router-link>

                                        <el-tag>{{box.state |logisticsV4BoxState}}</el-tag>
                                        <span class="margin-left-20">品牌：{{box.box_lines[0].product_info.brand.name}}</span>
                                    </div>
                                    <table class="table" style="line-height: 28px;">
                                        <thead>
                                        <tr>
                                            <th>型号</th>
                                            <th>订货号</th>
                                            <th>数量</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(line,$index) in box.box_lines" :key="$index">
                                            <td>{{line.product_info ? line.product_info.product_name : ''}}</td>
                                            <td>{{line.product_info ? line.product_info.product_order_no : ''}}</td>
                                            <td>{{line.quantity}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </el-popover>
                    </template>
                </el-step>
            </template>
        </el-steps>


        <el-dialog title="订单相关发票" :visible.sync="orderInvoiceListShow" width="700px" :close-on-click-modal="false"
                   v-loading="loading">
            <div class="padding-bottom-20">
                <router-link class="blue margin-right-20" target="_blank"
                             v-for="(invoice,$index) in orderInvoiceList"
                             :key="$index"
                             :to="'/finance/invoice/'+invoiceType+'/detail?id='+invoice.id"
                             :class="{red:invoice.invoice_type_name === 'red'}">
                    <span>{{invoice.invoice_number}}</span>
                    <el-tag :type="invoice.status == 'canceled' ? 'info' : null">
                        {{invoice.status|zerosoInvoiceStatus}}
                    </el-tag>
                </router-link>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="orderInvoiceListShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <stock-out-add ref="stockOutAdd" :buttonHidden="true"></stock-out-add>

    </div>
</template>

<script>


    import StockOutAdd from "../../logistics/stockOut/component/stockOut-add";

    export default {
        components: {StockOutAdd},
        props: ['orderData', 'queryId', 'isLogistics'],
        data() {
            return {
                route_map: [],
                order_node_states: [],

                currentIndex: -1,
                boxesLogistics: {},

                orderInvoiceListShow: false,
                orderInvoiceList: [],
                invoiceType: '',

                loading: false,
            }
        },
        computed: {
            mainCompanyAbbreviationCode() {
                return this.$store.state.mainCompanyAbbreviationCode
            }
        },
        watch: {
            'orderData'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.orderData.route_map) {
                    this.getBoxesLogistics();

                    let route_map = this.orderData.route_map ? JSON.parse(JSON.stringify(this.orderData.route_map)) : [];
                    let order_node_states = this.orderData.order_node_states ? JSON.parse(JSON.stringify(this.orderData.order_node_states)) : [];
                    for (let i = 0; i < order_node_states.length; i++) {
                        order_node_states[i].account_company = {};
                        for (let k = 0; k < route_map.length; k++) {
                            if (order_node_states[i].account_company_id === route_map[k].account_company_id) {
                                order_node_states[i].account_company = route_map[k];
                            }
                        }
                    }

                    this.route_map = route_map;

                    this.order_node_states = order_node_states;

                    this.$nextTick(() => {
                        this.order_node_states.forEach((item, $index) => {
                            if (this.$store.state.currentCompany.account_company_id === item.account_company_id) {
                                this.currentIndex = $index;
                            }
                        })
                    })
                } else {
                    this.route_map = [];
                    this.order_node_states = [];
                }
            },
            getBoxesLogistics() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.order_boxes_location + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.boxesLogistics = data.msg;
                        }
                    }
                })
            },

            goInvoiceDetail(chainNode, index, invoiceState) {
                let self = this;
                let invoiceType = '';
                if (index === self.currentIndex - 1) {
                    invoiceType = 'supplier'
                } else if (index === self.currentIndex) {
                    invoiceType = 'customer'
                }

                //当发票已经完成的时候，点击进入发票逻辑
                if (invoiceState === 'invoice') {
                    self.$http({
                        url: self.$api.bank_invoices_query_invoice,
                        type: 'POST',
                        requestBody: true,
                        data: {
                            from_company_id: chainNode.account_company_id,
                            order_names: [self.orderData.name]
                        },
                        success: function (data) {
                            if (data.err_code.length === 0 && data.msg) {
                                self.orderInvoiceList = data.msg[self.orderData.name].items;
                                if (self.orderInvoiceList.length === 1) {
                                    let routerData = self.$router.resolve({
                                        path: '/finance/invoice/' + invoiceType + '/detail',
                                        query: {
                                            id: self.orderInvoiceList[0].id,
                                            invoiceType: invoiceType,
                                        }
                                    });
                                    window.open(routerData.href);
                                } else {
                                    self.orderInvoiceListShow = true;
                                    self.invoiceType = invoiceType;
                                }
                            }
                        }
                    });
                    return false
                } else {
                    if (index === 0 && !self.$store.state.currentUser.codes[self.orderData.route_map[0].account_company_id]) {
                        //当最上游供应商发票时,校验财务信息是否齐全。
                        let partner;
                        let bankAccount;
                        let partnerPromise = new Promise((resolve, reject) => {
                            self.$http({
                                url: self.$api.partner_companies_detail + '/' + self.orderData.route_map[0].account_company_id,
                                success(data) {
                                    partner = data.msg;
                                    resolve(data)
                                },error(){
                                    reject()
                                }
                            })
                        });
                        let accountPromise = new Promise((resolve, reject) => {
                            self.$http({
                                url: self.$api.bank_account_partner + '/' + self.orderData.route_map[0].account_company_id,
                                success(data) {
                                    bankAccount = data.msg.items;
                                    resolve(data)
                                },error(){
                                    reject()
                                }
                            })
                        });
                        let promiseList = [accountPromise, partnerPromise];

                        Promise.all(promiseList).then(function () {
                            if (!(partner && bankAccount && bankAccount.length >= 1)) {
                                self.$confirm('供应商信息不完整,至少填写一条供应商银行账户信息。是否继续开发票？', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(()=> {
                                    self.goInvoice(chainNode, invoiceType);
                                }).catch(()=>{

                                })
                            } else {
                                //当存在一条或一条以上的银行账户条目时,必须存在一条满足 iban 和主账号为真的条目 财务信息才算全
                                let state = false;
                                bankAccount.forEach(function (line) {
                                    if (line.is_iban && line.is_primary) {
                                        state = true
                                    }
                                });
                                if (!state) {
                                    self.$confirm('供应商信息不完整，请填写供应商银行信息中的iban和主账号。是否继续开发票？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(()=> {
                                        self.goInvoice(chainNode, invoiceType);
                                    }).catch(()=>{

                                    })
                                } else {
                                    self.goInvoice(chainNode, invoiceType);
                                }
                            }
                        })

                    } else {
                        self.goInvoice(chainNode, invoiceType);
                    }
                }

            },
            goInvoice(chainNode, invoiceType) {
                if (invoiceType === 'supplier') {
                    this.$router.push({
                        path: this.isLogistics ? '/order/order/all/invoice' : 'invoice',
                        query: {
                            id: this.queryId,
                            fromCompanyId: chainNode.account_company_id,
                            toCompanyId: this.order_node_states[this.currentIndex].account_company_id,
                            invoiceType: invoiceType,
                        }
                    });
                } else if (invoiceType === 'customer') {
                    this.$router.push({
                        path: this.isLogistics ? '/order/order/all/invoice' : 'invoice',
                        query: {
                            id: this.queryId,
                            fromCompanyId: chainNode.account_company_id,
                            toCompanyId: this.order_node_states[this.currentIndex + 1].account_company_id,
                            invoiceType: invoiceType,
                        }
                    });
                }
            },

            goReceipt(chainNode, index) {
                this.$router.push({
                    path: this.isLogistics ? '/order/order/all/receipt' : 'receipt',
                    query: {
                        id: this.queryId,
                        accountCompanyId: chainNode.account_company_id,
                        partnerCompanyId: this.order_node_states[index + 1].account_company_id,
                    }
                });
            },


            //点击出库
            clickStockOutAdd(boxes) {
                let self = this;
                let boxDetail = {};
                if (boxes.length > 0) {
                    boxDetail = boxes[0];
                }
                let stockOutAddForm = {
                    belong_to_company_id: boxDetail.belong_to_company ? boxDetail.belong_to_company.account_company_id : null,
                    sale_company_id: boxDetail.sale_company ? boxDetail.sale_company.account_company_id : null,
                    send_to_company_id: boxDetail.customer_company ? boxDetail.customer_company.account_company_id : null,
                    send_to_company: boxDetail.customer_company,
                };
                self.$refs.stockOutAdd.boxAddStockOut(stockOutAddForm, boxes);
            },
            isShowStockOutButton(boxes) {
                let result = false;
                boxes.forEach(function (box) {
                    if (box.state === 'in_stock') result = true
                });
                return result
            }

        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .order-detail-status-box {
        .status-list {
            padding: 0 52px;

            li {
                float: left;
                width: 90px;
                border: 1px solid $color-border;
                margin: 0 7px;
                text-align: center;

                button {
                    width: 100%;
                    margin: 5px 0;
                    padding: 2px 0;
                    font-size: 14px;
                    color: #666666;

                    &:disabled {
                        color: #dddddd !important;
                    }

                    &.blue {
                        color: $color-link;
                        font-weight: bolder;
                    }

                    &.green {
                        color: $color-success;
                        font-weight: bolder;
                    }
                }
            }
        }

        .steps {
            padding-top: 40px;

            .el-step__title {
                font-size: 14px;
                line-height: 22px;
                padding: 8px 0;

                &.is-finish {
                    font-weight: bolder;
                }
            }

            .el-step {
                position: relative;

                .step-box {
                    position: absolute;
                    left: 50%;
                    top: -35px;
                    transform: translateX(-50%);
                    cursor: pointer;
                }
            }
        }

    }

    .table {
        td, th {
            padding: 2px 10px;
        }
    }
</style>
