<template>
    <div class="order-detail-product-price-get_calc_param">
        <el-popover popper-class="popper-order-detail-product-price-get_calc_param" placement="left" @show="popoverShow">
            <div slot="reference" class="cursor-pointer">
                <slot></slot>
                <i class="el-icon-info"></i>
            </div>
            <div class="calc-param-content order-price-detail" v-loading="loading">
                <div class="calculator">
                    <ul class="list-head">
                        <li class="symbol">
                            (
                        </li>
                        <li class="parameter cursor-pointer" :class="{'parameter-selected':selectedIndex === 1}" @mouseover="selected(1)">
                            <p>摊余供应商单价</p>
                            <span>{{calcParamForm.supplier_spread_unit_price | isoCurrency(calcParamForm.supplier_currency)}}</span>
                        </li>
                        <li class="symbol">
                            ×
                        </li>
                        <li class="parameter">
                            <p>汇率</p>
                            <span>{{calcParamForm.exchange_rate}}</span>
                        </li>
                        <li class="symbol">
                            +
                        </li>
                        <li class="parameter cursor-pointer" :class="{'parameter-selected':selectedIndex === 2}" @mouseover="selected(2)">
                            <p>运费</p>
                            <span>{{calcParamForm.shipping_cost | isoCurrency(calcParamForm.currency)}}</span>
                        </li>
                        <li class="symbol">
                            +
                        </li>
                        <li class="parameter cursor-pointer" :class="{'parameter-selected':selectedIndex === 3}" @mouseover="selected(3)">
                            <p>清关仓库费</p>
                            <span>{{calcParamForm.storage_fee | isoCurrency(calcParamForm.currency)}}</span>
                        </li>
                        <li class="symbol">
                            )
                        </li>
                        <li class="symbol">
                            ×
                        </li>
                        <li class="parameter cursor-pointer" :class="{'parameter-selected':selectedIndex === 4}" @mouseover="selected(4)">
                            <p>多项费率</p>
                            <span>{{calcParamForm.multiple_rates | percent}}</span>
                        </li>

                        <li class="symbol">
                            =
                        </li>
                        <li class="parameter">
                            <p>估算含税单价</p>
                            <span class="red">{{calcParamForm.forecast_taxed_unit_price | isoCurrency(calcParamForm.currency)}}</span>
                        </li>
                        <li class="parameter">
                            <p>预付全款优惠&nbsp;{{calcParamForm.discount_rate| percent}}</p>
                            <span class="red">{{calcParamForm.discount_taxed_unit_price | isoCurrency(calcParamForm.currency)}}</span>
                        </li>
                        <li class="parameter">
                            <p>最终未税单价</p>
                            <span class="red">{{calcParamForm.forecast_unit_price | isoCurrency(calcParamForm.currency)}}</span>
                        </li>

                    </ul>
                    <div class="body">
                        <!--供应商费用-->
                        <ul v-if="selectedIndex===1" class="list-body">
                            <li>
                                <p>供应商单价</p>
                                <span>{{calcParamForm.detail_supplier_spread_unit_price.supplier_unit_price|isoCurrency(calcParamForm.supplier_currency)}}</span>
                            </li>
                            <li class="symbol">
                                ×
                            </li>
                            <li class="symbol">
                                (&nbsp;&nbsp;1
                            </li>
                            <li class="symbol">
                                +
                            </li>
                            <li>
                                <p>运费包装费</p>
                                <span>{{calcParamForm.detail_supplier_spread_unit_price.package_fee|isoCurrency(calcParamForm.supplier_currency)}}</span>
                            </li>
                            <li class="symbol">/</li>
                            <li>
                                <p>采购单总额(不含运费包装费和附加费)</p>
                                <span>{{calcParamForm.detail_supplier_spread_unit_price.no_package_fee_total_amount|isoCurrency(calcParamForm.supplier_currency)}}</span>
                            </li>
                            <li class="symbol">)</li>
                        </ul>
                        <!--运费-->
                        <ul v-if="selectedIndex===2" class="list-body">
                            <li>
                                <p>重量(KG)</p>
                                <span>{{calcParamForm.detail_shipping_cost.weight}}</span>
                            </li>
                            <li class="symbol">
                                ×&nbsp;&nbsp;(
                            </li>
                            <li>
                                <p>供应商运费({{calcParamForm.currency}}/KG)</p>
                                <span>{{calcParamForm.detail_shipping_cost.supplier_shipping_cost|isoCurrency(calcParamForm.currency)}}</span>
                            </li>
                            <li class="symbol">+</li>
                            <li>
                                <p>发货运费({{calcParamForm.currency}}/KG)</p>
                                <span>{{calcParamForm.detail_shipping_cost.deliver_shipping_cost|isoCurrency(calcParamForm.currency)}}</span>
                            </li>
                            <li class="symbol">
                                )
                            </li>
                        </ul>
                        <ul v-if="selectedIndex===3" class="list-body">

                            <li class="symbol">
                                (
                            </li>
                            <li>
                                <p>清关费({{calcParamForm.currency}}/项)</p>
                                <span>{{calcParamForm.detail_storage_fee.customs_clearance_fees|isoCurrency(calcParamForm.currency)}}</span>
                            </li>
                            <li class="symbol">+</li>
                            <li><p>仓库操作费({{calcParamForm.currency}}/项)</p>
                                <span>{{calcParamForm.detail_storage_fee.storage_management_fee|isoCurrency(calcParamForm.currency)}}</span>
                            </li>
                            <li class="symbol">
                                )&nbsp;&nbsp;/
                            </li>
                            <li>
                                <p>数量</p>
                                <span>{{calcParamForm.detail_storage_fee.quantity}}</span>
                            </li>
                        </ul>
                        <ul v-if="selectedIndex===4" class="list-body">
                            <li>
                                <p>保险费率</p>
                                <span>{{calcParamForm.detail_multiple_rates.insurance_rate|percent}}</span>
                            </li>
                            <li class="symbol">
                                ×
                            </li>
                            <li>
                                <p>服务费率</p>
                                <span>{{calcParamForm.detail_multiple_rates.service_rate|percent}}</span>
                            </li>
                            <li class="symbol">
                                ×
                            </li>
                            <li>
                                <p>换汇费率</p>
                                <span>{{calcParamForm.detail_multiple_rates.exchange_currency_rate|percent}}</span>
                            </li>
                            <li class="symbol">
                                ×
                            </li>
                            <li>
                                <p>关税率</p>
                                <span>{{calcParamForm.detail_multiple_rates.import_tariff|percent}}</span>
                            </li>
                            <li class="symbol">
                                ×
                            </li>
                            <li>
                                <p>增值税率</p>
                                <span>{{calcParamForm.detail_multiple_rates.vat_rate|percent}}</span>
                            </li>
                        </ul>
                        <div class="text-align-right">
                            <i class="el-icon-tickets el-icon-normal cursor-pointer" style="font-size: 30px;" @click="getOrderPriceHistoryList()"></i>
                        </div>
                    </div>

                </div>
            </div>
        </el-popover>


        <el-dialog title="价格记录" :visible.sync="dialogShow" width="1200px" fullscreen :close-on-click-modal="false" :append-to-body="true" v-loading="loading">
            <el-table :data="orderPriceHistoryList" border size="mini">
                <el-table-column prop="operation_time" label="日期">
                    <template slot-scope="scope">
                        <span v-if="scope.row.current_params_name">{{scope.row.current_params_name}}</span>
                        <span v-else>{{scope.row.create_time | zerosoTimeFormat(8)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state|zerosoOrderStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="计算后单价">
                    <template slot-scope="scope">
                        {{scope.row.final_untaxed_unit_price|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量"></el-table-column>
                <el-table-column prop="exchange_rate" label="汇率"></el-table-column>
                <el-table-column label="增值税率">
                    <template slot-scope="scope">
                        {{scope.row.vat_rate|percent}}
                    </template>
                </el-table-column>
                <el-table-column label="服务费率">
                    <template slot-scope="scope">
                        {{scope.row.service_rate | percent}}
                    </template>
                </el-table-column>
                <el-table-column label="付款方式">
                    <template slot-scope="scope">
                        {{scope.row.payment_method | paymentMethod}}
                    </template>
                </el-table-column>
                <el-table-column prop="round_digit" label="圆整位数"></el-table-column>
                <el-table-column label="预付全款优惠率">
                    <template slot-scope="scope">
                        {{scope.row.discount_rate | percent}}
                    </template>
                </el-table-column>
                <el-table-column label="最上游未税单价">
                    <template slot-scope="scope">
                        {{scope.row.supplier_unit_price|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="最上游附加费用">
                    <template slot-scope="scope">
                        {{scope.row.package_fee|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="最上游未税金额">
                    <template slot-scope="scope">
                        {{scope.row.supplier_untaxed_amount|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column prop="net_weight" label="净重(KG)"></el-table-column>
                <el-table-column prop="gross_weight" label="毛重(KG)"></el-table-column>
                <el-table-column label="产品关税">
                    <template slot-scope="scope">
                        {{scope.row.actual_import_tariff | percent}}
                    </template>
                </el-table-column>
                <el-table-column prop="forecast_import_tariff" label="预估关税"></el-table-column>
                <el-table-column label="供应商运费">
                    <template slot-scope="scope">
                        {{scope.row.supplier_shipping_cost|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="发货运费">
                    <template slot-scope="scope">
                        {{scope.row.deliver_shipping_cost|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="仓库操作费">
                    <template slot-scope="scope">
                        {{scope.row.storage_management_fee|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="清关费">
                    <template slot-scope="scope">
                        {{scope.row.customs_clearance_fees|isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="保险费">
                    <template slot-scope="scope">
                        {{scope.row.insurance_rate | percent}}
                    </template>
                </el-table-column>
                <el-table-column label="换汇费">
                    <template slot-scope="scope">
                        {{scope.row.default_exchange_currency_rate | percent}}
                    </template>
                </el-table-column>

            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        props:['queryId','orderLineId','orderData'],
        data() {
            return {
                loading:false,
                calcParamForm:{},
                isGetData:false,
                selectedIndex:0,

                dialogShow:false,
                orderPriceHistoryList:[],
            }
        },
        computed:{

        },
        watch: {
            'orderLineId'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {

            },
            popoverShow(){
              console.log('popoverShow')
                if(!this.isGetData) this.get_calc_param();
            },

            get_calc_param(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/order_lines/'+ self.orderLineId +'/get_calc_param',
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.isGetData=true;
                            self.calcParamForm=data.msg;
                            self.selected(1);
                        }
                    }
                })
            },

            selected(index){
                this.selectedIndex=index;
            },

            getOrderPriceHistoryList(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/order_price_history/'+ self.orderLineId,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.history_params) {
                            self.dialogShow=true;
                            if(data.msg.current_params){
                                data.msg.current_params.current_params_name = '参考';
                                data.msg.history_params.unshift(data.msg.current_params);
                            }
                            self.orderPriceHistoryList = data.msg.history_params
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    @import "./../../../assets/css/config";
    .order-detail-product-price-get_calc_param{
        .cursor-pointer:hover{
            color: $color-main;
        }
    }
    .popper-order-detail-product-price-get_calc_param{
        .calc-param-content{
            min-height: 150px;
        }
        .order-price-detail {
            display: block; }
        .order-price-detail .calculator {
            color: #999999;
            font-size: 14px;
            display: block;
            background: white;
            padding-top: 10px;
            padding-bottom: 10px; }
        .order-price-detail .calculator p {
            height: 18px;
        }
        .order-price-detail .calculator .list-head {
            margin: 0;
            padding-top: 2px;
            border: 0;
            width: 100%;
            list-style: none;
            display: inline-block;
            background: $color-background;
            padding-left: 0; }
        .order-price-detail .calculator .list-head li {
            display: inline-block;
            text-align: center;
            padding: 10px;
            vertical-align: middle;
        }
        .order-price-detail .calculator .list-head .symbol {
            width: 20px;
            padding: 0 !important;
            line-height: 40px;
            vertical-align: middle; }
        .order-price-detail .calculator .body {
            padding: 0;
        }
        .order-price-detail .calculator .body .list-body {
            margin: 0;
            padding-left: 20px;
            min-width: 600px;
            list-style: none;
        }
        .order-price-detail .calculator .body .list-body li {
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        }
        .order-price-detail .calculator .body .list-body .symbol {
            width: 5%;
            line-height: 65px; }
        .order-price-detail .calculator .parameter-selected {
            background: white !important; }
        .order-price-detail .calculator .red {
            color: #d12e28; }
        .order-price-detail .calculator:hover {
            display: block; }
        .order-price-detail:hover .calculator {
            display: block; }
        .order-price-detail .open-log {
            cursor: pointer;
            font-size: 24px; }
        .order-price-detail .open-log:hover {
            color: #0b93d5; }

    }
</style>
