<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[orderState]}}</el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <span class="el-breadcrumb__inner is-link" @click="$router.back()">
                            {{orderDetail.name ? '订单详情：'+orderDetail.name :''}}
                        </span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item> {{invoiceType === 'customer' ? '客户发票':'供应商发票'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">


            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20">{{invoiceType === 'customer' ? '开发票':'收发票'}}</span>
                        <span class="margin-right-10">{{partnerCompany.name}}</span>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <span class="margin-right-20">
                                计税方式：
                                <span class="blue">{{currentNode.tax_method | zerosoTaxType}}</span>
                            </span>
                            <span class="margin-right-20">
                                未税总额：
                                <span class="blue">{{checkedTotalMoney.amountUntaxed | isoCurrency(currentNode.currency)}}</span>
                            </span>
                            <span class="margin-right-20">
                                税额：
                                <span class="blue">{{checkedTotalMoney.amountTax | isoCurrency(currentNode.currency)}}</span>
                            </span>
                            <span class="margin-right-20">
                                含税总额：
                                <span class="blue">{{checkedTotalMoney.amountTotal | isoCurrency(currentNode.currency)}}</span>
                            </span>

                            <el-button type="primary" v-if="invoiceType==='customer'" @click="createInvoice()">生成发票</el-button>
                            <el-button type="primary" v-if="invoiceType==='supplier'" @click="createInvoice()">录入发票</el-button>
                            <el-button type="primary" plain @click="$router.back()">取消</el-button>
                        </div>
                    </div>
                </div>
            </div>


            <el-card class="margin-bottom-20" v-if="isShowInvoice">
                <h3 slot="header" class="clearfix">已选</h3>
                <el-table :data="checkedInvoice" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="订单编号">
                        <template slot-scope="scope">
                            {{scope.row.order_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="货物或应用劳务名称">
                        <template slot-scope="scope">
                            {{scope.row.product_type_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="型号">
                        <template slot-scope="scope">
                            {{scope.row.product_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号">
                        <template slot-scope="scope">
                            {{scope.row.product_order_no | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌">
                        <template slot-scope="scope">
                            {{scope.row.brand_name | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            {{scope.row.invoice_qty | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="未税单价">
                        <template slot-scope="scope">
                            <span>{{scope.row.price | isoCurrency(scope.row.currency)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="含税单价">
                        <template slot-scope="scope">
                            <span>{{scope.row.price_taxed | isoCurrency(scope.row.currency)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="未税总价">
                        <template slot-scope="scope">
                            <span>{{scope.row.total_price | isoCurrency(scope.row.currency)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="含税总价">
                        <template slot-scope="scope">
                            <span>{{scope.row.total_price_taxed | isoCurrency(scope.row.currency)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="税额">
                        <template slot-scope="scope">
                            <span>{{scope.row.total_tax | isoCurrency(scope.row.currency)}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column width="55">
                        <template slot-scope="scope">
                            <i class="el-icon-error el-icon-normal cursor-pointer red" @click="deleteProductRow(scope.row.id)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>


            <el-card class="margin-bottom-20" v-if="isShowInvoice">
                <div class="order-control-search clearfix">
                    <div class="item">
                        <h3>订单总览</h3>
                    </div>
                    <div class="item">
                        <el-input v-model="searchForm.order_name" clearable></el-input>
                    </div>
                    <div class="item">
                        <el-button type="primary" @click="getAccountingWaitingInvoice">确定</el-button>
                    </div>
                    <div class="item">
                        <el-select v-model="searchForm.logistics_state" @change="getAccountingWaitingInvoice">
                            <el-option v-for="item in selectLogisticsV4State"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </div><div class="item">
                        <el-select v-model="searchForm.inbound_state" @change="getAccountingWaitingInvoice">
                            <el-option v-for="item in selectInboundState"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </div><div class="item">
                        <el-select v-model="searchForm.payment_method" @change="getAccountingWaitingInvoice">
                            <el-option v-for="item in selectPaymentMethod"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </div><div class="item">
                        <el-select v-model="searchForm.supplier_invoice_state" @change="getAccountingWaitingInvoice">
                            <el-option v-for="item in selectSupplierInvoiceState"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="right">
                        <el-button type="primary" @click="getAccountingWaitingInvoice">刷新数据</el-button>
                    </div>
                </div>

                <div class="padding-20">
                    <a href="javascript:;" class="margin-right-20 blue" v-for="(item,$index) in accountingWaitingInvoice" :key="$index">{{item.name}}</a>
                </div>
            </el-card>

            <template v-for="(orderNode,$index) in accountingWaitingInvoice">
                <el-card class="margin-bottom-20" :key="$index" v-if="isShowInvoice">
                    <div slot="header" class="clearfix">
                        <h3 class="left">
                            <span class="margin-right-20">
                                订单号：
                                <router-link class="blue" :to="'detail?id='+orderNode.order_base_id" target="_blank">{{orderNode.name}}</router-link>
                            </span>
                            <span class="margin-right-20">税率：{{orderNode.tax_rate | percent}}</span>

                            <el-tag v-if="invoiceType==='customer'">{{orderNode.inbound_state|zerosoOrderReceiptState}}</el-tag>
                            <el-tag v-if="invoiceType==='customer'">{{orderNode.payment_method|paymentMethod}}</el-tag>
                            <el-tag v-if="invoiceType==='customer'">{{orderNode.supplier_invoice_state|zerosoOrderInvoiceState}}</el-tag>

                            <el-tag v-if="invoiceType==='supplier'">{{orderNode.outbound_state|zerosoOrderPaymentState}}</el-tag>
                        </h3>
                        <div class="right">
                            <el-button type="primary" @click="addProductAll(orderNode)">批量添加</el-button>
                        </div>
                    </div>

                    <el-table :data="orderNode.order_lines" v-if="orderNode.order_lines" border :row-class-name="tableRowClassName">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="到货状态">
                            <template slot-scope="scope">
                                <el-tag type="warning">{{scope.row.logistics_state | logisticsStatus}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="货物或应用劳务名称" width="160">
                            <template slot-scope="scope">
                                <span v-if="(scope.row.checked && invoiceType === 'supplier') || invoiceType === 'customer'">
                                    <span v-if="scope.row.product_type_name">{{scope.row.product_type_name}}</span>
                                    <router-link v-else :to="'/product/product/detail?id='+scope.row.product_id" target="_blank">无品名，点击去编辑</router-link>
                                </span>
                                <el-input v-else v-model="scope.row.product_type_name" :disabled="scope.row.qty==scope.row.invoiced_qty"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格参考" width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.copyProductName | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格型号" width="250">
                            <template slot-scope="scope">
                                <span v-if="scope.row.checked">{{scope.row.product_name | defaultStr}}</span>
                                <el-input v-else type="textarea" :rows="4" v-model="scope.row.product_name" :disabled="scope.row.qty==scope.row.invoiced_qty"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量/已开数量/供应商已开数量">
                            <template slot-scope="scope">
                                <span>{{invoiceType === 'customer'?[scope.row.qty, scope.row.invoiced_qty,scope.row.supplier_invoiced_qty].join(' / '):[scope.row.qty, scope.row.invoiced_qty].join(' / ')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="待开数量">
                            <template slot-scope="scope">
                                <span v-if="scope.row.checked">{{scope.row.waitQty | defaultStr}}</span>
                                <InputNumber v-else :value.sync="scope.row.waitQty" :disabled="scope.row.qty==scope.row.invoiced_qty" @input.native="changeWaitQty(scope.row,orderNode)"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column label="发票未税单价">
                            <template slot-scope="scope">
                                <span v-if="scope.row.checked || currentNode.tax_method !== 'on_untaxed'">{{scope.row.invoicePrice | isoCurrency(currentNode.currency)}}</span>
                                <InputNumber v-else :value.sync="scope.row.invoicePrice" :disabled="scope.row.qty==scope.row.invoiced_qty" @input.native="changeInvoicePrice(scope.row,orderNode)"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column label="发票含税单价">
                            <template slot-scope="scope">
                                <span v-if="scope.row.checked || currentNode.tax_method !== 'on_taxed'">{{scope.row.invoicePriceTax | isoCurrency(currentNode.currency)}}</span>
                                <InputNumber v-else :value.sync="scope.row.invoicePriceTax" :disabled="scope.row.qty==scope.row.invoiced_qty" @input.native="changeInvoicePriceTaxed(scope.row,orderNode)"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column label="发票含税总价">
                            <template slot-scope="scope">
                                <span>{{scope.row.totalTaxed | isoCurrency(orderNode.currency)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单未税单价">
                            <template slot-scope="scope">
                                <span>{{scope.row.price | isoCurrency(orderNode.currency)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单含税单价">
                            <template slot-scope="scope">
                                <span>{{scope.row.price_taxed | isoCurrency(orderNode.currency)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="55">
                            <template slot-scope="scope">
                                <i v-if="!scope.row.checked" class="el-icon-circle-plus el-icon-normal cursor-pointer" @click="addProductRow(scope.row,orderNode)"></i>
                                <i v-else class="el-icon-success el-icon-normal cursor-pointer green" @click="deleteProductRow(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </template>

            <el-card class="margin-bottom-20">
                <h3 slot="header" class="clearfix">相关发票</h3>
                <el-table :data="queryInvoiceList" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="订单编号" width="400">
                        <template slot-scope="scope">
                            <span class="blue">{{scope.row.order_name | defaultStr}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发票号">
                        <template slot-scope="scope">
                            <p v-if="scope.row.items && scope.row.items.length>0">
                                <router-link class="blue margin-right-20" target="_blank"
                                             v-for="(invoice,$index) in scope.row.items"
                                              :key="$index"
                                             :to="'/finance/invoice/'+invoiceType+'/detail?id='+invoice.id"
                                             :class="{red:invoice.invoice_type_name === 'red'}">
                                    <span>{{invoice.invoice_number}}</span>
                                    <el-tag :type="invoice.status == 'canceled' ? 'info' : null">
                                        {{invoice.status|zerosoInvoiceStatus}}
                                    </el-tag>
                                </router-link>
                            </p>
                            <span v-else>{{'' | defaultStr}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>


        </div>


    </div>
</template>

<script>


    export default {
        components: {

        },
        data() {
            return {
                queryId: '',
                parentQuery: '',

                orderState:'',
                breadNameList:{
                    in_quote:'下单',
                    processing:'执行中订单',
                    done:'已完结订单',
                    cancelled:'已取消订单',
                    all:'全部订单',
                },
                invoiceType:'',
                fromCompanyId:'',
                toCompanyId:'',

                orderDetail: {},
                currentNode: {},

                partnerCompany:{},


                searchForm:{
                    order_name:'',
                    logistics_state:'',
                    inbound_state:'',
                    payment_method:'',
                    supplier_invoice_state:'',
                },
                selectLogisticsV4State : [
                    {name: '全部', value: undefined},
                    {name: '待入库', value: 'waiting'},
                    {name: '部分入库', value: 'partial'},
                    {name: '已入库', value: 'received'},
                    {name: '已出口', value: 'exported'},
                    {name: '已进口', value: 'imported'},
                    {name: '已出库', value: 'delivery'},
                    {name: '已完结', value: 'done'},
                ],
                selectInboundState : [
                    {name: '全部', value: undefined},
                    {name: '未收款', value: 'no_receipt'},
                    {name: '部分收款', value: 'partial'},
                    {name: '已收款', value: 'receipt'},
                ],
                selectPaymentMethod : [
                    {name: '发货前付款', value: 'before_delivery'},
                    {name: '开票后付款', value: 'after_invoice'},
                ],
                selectSupplierInvoiceState : [
                    {name: '未开票', value: 'no_invoice'},
                    {name: '部分开票', value: 'partial'},
                    {name: '已开票', value: 'invoice'},
                ],









                accountingWaitingInvoice:[],
                checkedInvoice:[],
                checkedTotalMoney: {},
                tax_rate : '',
                currency : '',

                queryInvoiceList:[],

                isShowInvoice: false,

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
                this.orderState = this.$route.params.orderState;
                self.parentQuery = self.$route.query.parentQuery;

                self.invoiceType = self.$route.query.invoiceType;
                self.fromCompanyId = self.$route.query.fromCompanyId;
                self.toCompanyId = self.$route.query.toCompanyId;

                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.orderDetail = {

                    };
                }


                self.isShowInvoice = !this.$store.state.mainCompanyAbbreviationCode[self.fromCompanyId] || self.fromCompanyId.toString() === this.$store.state.currentCompany.account_company_id.toString();
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.orderDetail = data.msg;
                            self.orderDetail.order_nodes.forEach((item)=>{
                                if(item.account_company_id===self.$store.state.currentCompany.account_company_id){
                                    self.currentNode=item;
                                }
                            });
                        }
                        self.getPartnerCompany();
                    }
                })
            },
            getPartnerCompany() {
                let self = this;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + (self.invoiceType === 'customer' ? self.toCompanyId : self.fromCompanyId),
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.partnerCompany = data.msg;
                        }
                        self.searchForm={
                            order_name:self.orderDetail.name,
                            logistics_state:self.partnerCompany.company_type === 'internal' ? 'imported' : 'done',
                            payment_method:'before_delivery',
                            supplier_invoice_state: self.invoiceType ==='customer' ?'invoice' : undefined,
                            inbound_state:self.invoiceType ==='customer' ? undefined : undefined,
                        };
                        self.getAccountingWaitingInvoice();
                    }
                })
            },


            getAccountingWaitingInvoice() {
                let self = this;
                self.loading=true;
                self.$http({
                    url: self.$api.order_order_accounting_waiting_invoice,
                    data:{
                        from_company_id: self.fromCompanyId,
                        to_company_id: self.toCompanyId,
                        is_need_invoice: true,
                        no_page: true,
                        order_name: self.searchForm.order_name,
                        logistics_state: self.searchForm.logistics_state,
                        payment_method: self.searchForm.payment_method,
                        supplier_invoice_state: self.searchForm.supplier_invoice_state,
                        inbound_state: self.searchForm.inbound_state,
                        tax_method: self.currentNode.tax_method,
                    },
                    success: function (data) {
                        self.loading=false;
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            let accountingWaitingInvoice = data.msg.items;
                            for(let i=0;i<accountingWaitingInvoice.length;i++){
                                for(let k=0;k<accountingWaitingInvoice[i].order_lines.length;k++){
                                    let line = accountingWaitingInvoice[i].order_lines[k];
                                    if(!line.product_name) line.product_name = line.product_order_no;
                                    line.copyProductName = line.product_name;
                                    line.invoicePrice = line.price;
                                    line.invoicePriceTax = line.price_taxed;
                                    line.waitQty = line.qty - line.invoiced_qty;
                                    self.changeWaitQty(line, accountingWaitingInvoice[i])
                                    line.checked = false;
                                    if(self.checkedInvoice.length>0){
                                        self.checkedInvoice.forEach((item)=>{
                                            if(item.id === line.id){
                                                line.checked = true;
                                            }
                                        })
                                    }
                                }
                            }
                            self.accountingWaitingInvoice = accountingWaitingInvoice;
                            self.getQueryInvoice();
                        }
                    }
                })
            },


            getQueryInvoice() {
                let self = this;
                let order_name=[];
                self.accountingWaitingInvoice.forEach((item)=>{
                    order_name.push(item.name);
                })
                self.loading=true;
                self.$http({
                    url: self.$api.bank_invoices_query_invoice,
                    type:'POST',
                    requestBody: true,
                    data:{
                        from_company_id: self.fromCompanyId,
                        order_names: order_name,
                    },
                    success: function (data) {
                        self.loading=false;
                        if (data.err_code.length === 0 && data.msg) {
                            let queryInvoiceList = [];
                            for(let key in data.msg){
                                queryInvoiceList.push({
                                    order_name:key,
                                    items:data.msg[key].items
                                })
                            }
                            self.queryInvoiceList = queryInvoiceList;
                        }
                    }
                })
            },









            changeInvoicePrice (line, order) {
                let taxRate = Number(order.tax_rate) || 0;
                line.invoicePriceTax = this.zerosoRound(Number(line.invoicePrice) * (1 + taxRate / 100), 15);
                line.totalUntaxed = this.zerosoRound(Number(line.invoicePrice) * line.waitQty, 15);
                line.taxTotal = this.zerosoRound(Number(line.totalUntaxed) * (taxRate / 100), 2);
                line.totalTaxed = this.zerosoRound(Number(line.invoicePriceTax) * line.waitQty, 2);
            },

            changeInvoicePriceTaxed(line, order) {
                let taxRate = Number(order.tax_rate) || 0;
                line.invoicePrice = this.zerosoRound(Number(line.invoicePriceTax) / (1 + taxRate / 100), 2);
                line.totalUntaxed = this.zerosoRound(Number(line.invoicePrice) * line.waitQty, 2);
                line.taxTotal = this.zerosoRound(Number(line.totalUntaxed) * (taxRate / 100), 2);
                line.totalTaxed = this.zerosoRound(Number(line.totalUntaxed) + Number(line.taxTotal), 2);
            },
            changeWaitQty(line, order) {
                if (this.currentNode.tax_method === 'on_taxed') {
                    this.changeInvoicePriceTaxed(line, order)
                } else {
                    this.changeInvoicePrice(line, order)
                }
            },
            zerosoRound(value, number){
                return this.$options.filters['zerosoRound'](value, number)
            },
            addProductAll(order){
                order.order_lines.forEach((item)=>{
                    if(!item.checked){
                        this.addProductRow(item,order)
                    }
                })
            },
            addProductRow(line, order) {
                let self=this;
                if (self.invoiceType === 'customer' && !line.product_type_name) {
                    self.$message({
                        showClose: true,
                        message: '该产品没有在产品库录入品名，无法开票！',
                        type: 'error'
                    });
                    return false;
                }
                if (!Number(line.waitQty)) {
                    self.$message({
                        showClose: true,
                        message: '无法添加开票数量为0的行！',
                        type: 'error'
                    });
                    return false;
                }
                if(self.checkedInvoice.length===0){
                    self.tax_rate = order.tax_rate;
                    self.currency = order.currency;
                }
                if (self.tax_rate !== order.tax_rate) {
                    self.$message({
                        showClose: true,
                        message: '当前的订单行税率与已选订单税率不等无法放在一起开发票！',
                        type: 'error'
                    });
                    return false
                }

                if (self.currency !== order.currency) {
                    self.$message({
                        showClose: true,
                        message: '当前的订单行币种与已选币种不一致无法放在一起开票！',
                        type: 'error'
                    });
                    return false;
                }

                line.checked = !line.checked;
                self.checkedInvoice.push({
                    id: line.id,
                    order_line_id: line.id,
                    order_id: order.id,
                    order_name: order.name,
                    invoice_qty: line.waitQty,
                    quantity: line.waitQty,
                    price: line.invoicePrice,
                    price_taxed: line.invoicePriceTax,
                    product_order_no: line.product_order_no,
                    product_name: line.product_name,
                    product_type_name: line.product_type_name,
                    product_parameters: line.product_parameters,
                    brand_name: line.brand_name,
                    currency: order.currency,
                    total_price: line.totalUntaxed,
                    total_price_taxed: line.totalTaxed,
                    total_tax: line.taxTotal,
                });
                this.calculateSelectedTotal();
            },
            deleteProductRow(id) {
                for(let i=0;i<this.accountingWaitingInvoice.length;i++){
                    for(let k=0;k<this.accountingWaitingInvoice[i].order_lines.length;k++){
                        if(this.accountingWaitingInvoice[i].order_lines[k].id === id){
                            this.accountingWaitingInvoice[i].order_lines[k].checked = false;
                            break
                        }
                    }
                }
                for(let k=0;k<this.checkedInvoice.length;k++){
                    if(this.checkedInvoice[k].id === id){
                        this.checkedInvoice.splice(k,1);
                        break
                    }
                }
                this.calculateSelectedTotal();
            },
            calculateSelectedTotal() {
                let self=this;
                let total = {
                    amountUntaxed: 0,
                    amountTax: 0,
                    amountTotal: 0,
                };

                if (self.checkedInvoice.length > 0) {
                    if (self.currentNode.tax_method === 'on_untaxed') {
                        self.checkedInvoice.forEach(function (line) {
                            total.amountUntaxed += Number(line.total_price);
                        });
                        total.amountTax = total.amountUntaxed * (self.tax_rate / 100);
                        total.amountTotal = total.amountUntaxed + total.amountTax;
                    } else {
                        self.checkedInvoice.forEach(function (line) {
                            total.amountUntaxed += Number(line.total_price);
                            total.amountTax += Number(line.total_tax);
                        });
                        total.amountTotal = total.amountTax + total.amountUntaxed
                    }
                    self.checkedTotalMoney=total
                } else {
                    self.checkedTotalMoney = {
                        amountUntaxed: null,
                        amountTax: null,
                        amountTotal: null,
                    }
                }
            },


            //生成发票
            createInvoice() {
                let self = this;
                if (!self.checkedInvoice.length) {
                    self.$message({
                        showClose: true,
                        message: '请选择产品行！',
                        type: 'error'
                    });
                    return
                }
                function invoiceData(invoiceLines) {
                    /*生成发票数据格式过滤*/
                    let orders = {};
                    let result = [];
                    invoiceLines.forEach((line) =>{
                        if (orders[line.order_id]) {
                            orders[line.order_id].push(line)
                        } else {
                            orders[line.order_id] = [line]
                        }
                    });
                    for(let key in orders){
                        result.push({order_id: key, invoice_lines: orders[key]})
                    }
                    return result
                }
                self.$http({
                    url: self.$api.bank_invoices_generate_by_order,
                    type:'POST',
                    requestBody: true,
                    data:{
                        orders: invoiceData(self.checkedInvoice),
                        type: self.invoiceType,
                        tax_method: self.currentNode.tax_method,
                        from_company_id: self.fromCompanyId,
                        to_company_id: self.toCompanyId,
                        invoice_number: null,
                        invoice_date: null,
                        tax_rate: self.orderDetail.tax_rate || 0,
                        total: '',
                        total_taxed: '',
                    },
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg && data.msg.id) {
                            self.$router.push({
                                path: '/finance/invoice/'+self.invoiceType+'/detail',
                                query: {
                                    id:data.msg.id
                                }
                            });
                        }
                    }
                });
            },

            tableRowClassName({row}) {
                if(row.qty==row.invoiced_qty) return 'canceled-line'
            },


        }
    }
</script>

<style lang="scss">
.order-control-search{
    line-height: 32px;
    .item{
        float: left;
        margin: 0 16px 0 0;
        .el-input{
            width: 180px;
        }
    }
}
.canceled-line{
    cursor: not-allowed;
    .cell{
        color: #CCCCCC;
    }
}
</style>
