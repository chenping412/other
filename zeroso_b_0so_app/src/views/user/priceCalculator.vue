<template>
    <div class="inline-block">
        <div @click="clickShow()">
            <slot></slot>
        </div>

        <el-dialog :title="title || '价格计算器'"
                   :visible.sync="dialogShow" width="90%" top="30px"
                   :close-on-click-modal="false" append-to-body v-loading="loading">
            <el-form :model="formData" :rules="formDataRule" ref="listDataRef" label-width="0px">
                <el-table :data="formData.listData" border v-loading="loading" size="mini">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号/订货号" v-if="isImport">
                        <template slot-scope="scope">
                            <p>{{scope.row.product_name}}</p>
                            <p>{{scope.row.product_order_no}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listData.'+scope.$index+'.qty'" :rules="formDataRule.qty">
                                <InputNumber
                                        :value.sync="scope.row.qty"
                                        :integer="true"
                                        :min="1"
                                        placeholder="数量"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="面价(EUR)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listData.'+scope.$index+'.price'" :rules="formDataRule.price">
                                <InputNumber
                                        :value.sync="scope.row.price"
                                        placeholder="面价，单位欧元"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="折扣(%)">
                        <template slot-scope="scope">
                            <el-form-item>
                                <InputNumber
                                        :value.sync="scope.row.discount"
                                        :max="99"
                                        placeholder="0~99，默认为 0"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="毛重(kg)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listData.'+scope.$index+'.gross_weight'"
                                          :rules="formDataRule.gross_weight">
                                <InputNumber
                                        :value.sync="scope.row.gross_weight"
                                        placeholder="必填"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="关税(%)">
                        <template slot-scope="scope">
                            <el-form-item :prop="'listData.'+scope.$index+'.tariff_rate'"
                                          :rules="formDataRule.tariff_rate">
                                <InputNumber
                                        :value.sync="scope.row.tariff_rate"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="额外关税(%)">
                        <template slot-scope="scope">
                            <el-form-item>
                                <InputNumber
                                        :value.sync="scope.row.extra_import_tariff"
                                        placeholder="非必填"
                                        @change="saveLocalStorage">
                                </InputNumber>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商付款方式">
                        <template slot-scope="scope">
                            <el-form-item>
                                <el-select v-model="scope.row.supplier_payment_method" @change="saveLocalStorage">
                                    <template v-for="item in paymentMethod">
                                        <el-option
                                                :key="item.code"
                                                :label="item.label"
                                                :value="item.code">
                                        </el-option>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="EUR不含关税单价">
                        <template slot-scope="scope">
                            {{scope.row.price_without_tariff | formatMoney('EUR')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="CNY含税单价">
                        <template slot-scope="scope">
                            {{scope.row.cny_price_with_tariff | formatMoney('CNY')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="CNY含税总价">
                        <template slot-scope="scope">
                            {{scope.row.total_cny_price_with_tariff | formatMoney('CNY')}}
                        </template>
                    </el-table-column>
                    <el-table-column width="80px">
                        <template slot-scope="scope">
                            <span class="el-icon-remove-outline el-icon-normal red cursor-pointer"
                                  @click="clickDeleteRow(scope.row)">
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

            <el-row>
                <el-col :span="8" class="el-form-item-right el-form-margin-small">
                    <el-form label-width="180px" class="padding-top-10">
                        <el-form-item label="产品总价：">
                            <span class="form-border-bottom">{{formData.procurement_price.total_products_price | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="货物操作及包装费：">
                            <span class="form-border-bottom">{{formData.procurement_price.handling_and_packing_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="海外出口报关费：">
                            <span class="form-border-bottom">{{formData.procurement_price.overseas_customs_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="中国进口清关费：">
                            <span class="form-border-bottom">{{formData.procurement_price.domestic_customs_clearance_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="供货商提货费：">
                            <span class="form-border-bottom">{{formData.procurement_price.supplier_pick_up_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="国际物流费：">
                            <span class="form-border-bottom">{{formData.procurement_price.international_logistics_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="国内物流费：">
                            <span class="form-border-bottom">{{formData.procurement_price.domestic_logistics_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="海外仓储操作费：">
                            <span class="form-border-bottom">{{formData.procurement_price.oversee_storage_service_fee | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="中国仓储操作费：">
                            <span class="form-border-bottom">{{formData.procurement_price.domestic_storage_service_fee | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="保险费：">
                            <span class="form-border-bottom">{{formData.procurement_price.insurance_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="换汇手续费：">
                            <span class="form-border-bottom">{{formData.procurement_price.foreign_exchange_fees | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="附加费总计：">
                            <span class="form-border-bottom">{{formData.procurement_price.extra_charges_total | formatMoney('EUR')}}</span>
                        </el-form-item>
                        <el-form-item label="增值税：">
                            <span class="form-border-bottom">{{formData.procurement_price.value_add_tax | formatMoney('EUR')}}</span>
                        </el-form-item>

                        <el-form-item label="人民币总价：">
                            <b class="form-border-bottom red">{{formData.procurement_price.grand_cny_price | formatMoney('CNY')}}</b>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10">
                    <el-form :model="formData" :rules="formDataRule" ref="formDataRef" label-width="150px" class="padding-top-10">
                        <el-form-item label="汇率" prop="exchange_rate">
                            <InputNumber
                                    style="width:30%;"
                                    :value.sync="formData.exchange_rate"
                                    @change="saveLocalStorage">
                            </InputNumber>
                            <span class="margin-left-10 margin-right-10">当天汇率：{{todayExchangeRate}}</span>
                            <el-button size="mini" type="primary" @click="clickUseTodayExchangeRate()">使用当天汇率</el-button>
                        </el-form-item>
                        <el-form-item label="发货方式">
                            <el-select v-model="formData.delivery_mode" @change="saveLocalStorage">
                                <el-option v-for="item in $store.state.inquiryDeliveryMode"
                                           :key="item.code"
                                           :value="item.code"
                                           :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="优惠金额">
                            <InputNumber
                                    :value.sync="formData.discount_amount"
                                    @change="saveLocalStorage">
                                <template slot="append">￥</template>
                            </InputNumber>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="clickSubmit">计算价格</el-button>
                        </el-form-item>
                        <div class="red" style="padding-left: 150px;" v-if="isImport">
                            <p style="margin-bottom: 5px;">导入询报价单进行计算时，需注意一下几点：</p>
                            <p style="margin-bottom: 5px;">1，产品的面价、折扣、毛重、关税、额外关税，供应商付款方式，这些基础数据均为当前最新数据，并不是给此询报价单报价时的数据，因为这些数据有可能会修改，因而无法得知当时给询报价单报价时的数据</p>
                            <p style="margin-bottom: 5px;">2，当导入询报价单时，汇率默认使用当前询报价单锁定的汇率</p>
                            <p style="margin-bottom: 5px;">3，因此使用模拟计算器计算的结果，有可能与询报价单不一致，属正常现象</p>
                            <p style="margin-bottom: 5px;">4，当发现最新计算结果与当前询报价单不一致时，可提醒联营公司更新价格</p>
                        </div>
                    </el-form>
                </el-col>
                <el-col :span="6">
                    <div class="right padding-10">
                        <el-button size="mini" type="primary" @click="clickAddRow">添加行</el-button>
                    </div>
                </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['title','autoSave','isImport'],
        data() {
            return {
                loading: false,
                dialogShow: false,

                todayExchangeRate:'',

                paymentMethod: [
                    {
                        label: "见票付款-有打款折扣",
                        code: "invoiced_with_discount_payment",
                    }, {
                        label: "见票付款-无打款折扣",
                        code: "invoiced_without_discount_payment",
                    }, {
                        label: "发货前全款",
                        code: "advance_before_delivery_payment",
                    }, {
                        label: "下单预付",
                        code: "advance_after_order_payment",
                    }, {
                        label: "其他",
                        code: "other",
                    },
                ],
                payment_cost_config: {
                    invoiced_with_discount_payment: 0,
                    invoiced_without_discount_payment: 1,
                    advance_before_delivery_payment: 2,
                    advance_after_order_payment: 3,
                    other: 0,
                },

                formData: {
                    exchange_rate: '',
                    delivery_mode: 'DIRECT',
                    discount_amount: '',
                    listData: [],
                    procurement_price: {},
                    sales_price: {},
                },
                formDataRule: {
                    exchange_rate: [
                        {required: true, message: '请输入汇率！'}
                    ], qty: [
                        {required: true, message: '请输入数量！'}
                    ], price: [
                        {required: true, message: '请输入面价！'}
                    ], gross_weight: [
                        {required: true, message: '请输入毛重！'}
                    ], tariff_rate: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value !== 0) {
                                    callback(new Error('请输入关税！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },


            }
        },
        watch: {},
        created() {

        },
        methods: {
            clickShow(priceCalculatorData) {
                this.dialogShow=true;
                if(this.autoSave){
                    if (localStorage.priceCalculatorFormData) {
                        this.formData = JSON.parse(localStorage.priceCalculatorFormData)
                    }
                }else {
                    this.formData.exchange_rate = priceCalculatorData.exchange_rate;
                    this.formData.delivery_mode = priceCalculatorData.delivery_mode;
                    this.formData.discount_amount = priceCalculatorData.discount_amount;
                    this.formData.listData = priceCalculatorData.listData;
                    this.$nextTick(()=>{
                        this.clickSubmit();
                    });
                }
                this.getExchangeRate();
            },
            saveLocalStorage() {
                if(this.autoSave) {
                    localStorage.priceCalculatorFormData = JSON.stringify(this.formData);
                }
            },
            getExchangeRate() {
                let self = this;
                self.loading=true;
                self.$http({
                    url: self.$api.bank_currency_exchange_rate,
                    data: {
                        origin_currency: 'CNY'
                    },
                    success: function (data) {
                        self.loading=false;
                        let listData = data.msg.items;
                        listData.forEach((item) => {
                            if (item.name === 'EUR/CNY') {
                                self.todayExchangeRate = Number(item.rate).myRound(4);
                            }
                        })
                    }
                });
            },
            clickUseTodayExchangeRate(){
                this.formData.exchange_rate = this.todayExchangeRate;
                this.saveLocalStorage();
            },
            clickAddRow() {
                this.formData.listData.push({
                    qty: 1,
                    price: '',
                    discount: '',
                    gross_weight: '',
                    tariff_rate: '',
                    extra_import_tariff: '',
                    supplier_payment_method: 'invoiced_with_discount_payment',
                });
                this.saveLocalStorage();
            },
            clickDeleteRow(row) {
                this.formData.listData.splice(this.formData.listData.indexOf(row), 1);
                this.saveLocalStorage();
            },

            clickSubmit() {
                let self = this;
                self.$refs.listDataRef.validate((valid) => {
                    if (self.formData.listData.length === 0) {
                        self.$message({
                            showClose: true,
                            message: '没有添加价格行！',
                            type: 'error'
                        });
                        return
                    }
                    if (valid) {
                        self.$refs.formDataRef.validate((valid) => {
                            if (valid) {
                                let formData = JSON.parse(JSON.stringify(self.formData));
                                formData.procurement_price = {};
                                formData.sales_price = {};
                                formData.procurement_price.total_products_price = 0;
                                formData.totalWeight = 0;
                                for (let i = 0; i < formData.listData.length; i++) {
                                    self.calculateProcurementPrice(formData.listData[i]);
                                    formData.procurement_price.total_products_price += formData.listData[i].total_price_with_tariff;
                                    formData.totalWeight += Number(formData.listData[i].gross_weight * formData.listData[i].qty);
                                }
                                self.handling_and_packing_fees(formData);
                                self.overseas_customs_fees(formData);
                                self.domestic_customs_clearance_fees(formData);
                                self.supplier_pick_up_fees(formData);
                                self.international_logistics_fees(formData);
                                self.domestic_logistics_fees(formData);
                                self.oversee_storage_service_fee(formData);
                                self.domestic_storage_service_fee(formData);
                                self.attachedIntermediateFee(formData);
                                self.insurance_fees(formData);
                                self.foreign_exchange_fees(formData);
                                self.extra_charges_total(formData);
                                self.value_add_tax(formData);
                                self.grand_cny_price(formData);
                                self.formData = formData;
                                console.log(formData)
                                self.saveLocalStorage();
                            }
                        });
                    }
                });
            },
            //计算每行产品欧元 未税单价、不含关税总价
            calculateProcurementPrice(item) {
                item.price_without_tariff = Number(item.price * (1 - (item.discount || 0) / 100) * (1 + (1 + this.payment_cost_config[item.supplier_payment_method]) / 100)).myRound(2);
                let tariffRate = Number(item.tariff_rate);
                if (item.extra_import_tariff) {
                    tariffRate += Number(item.extra_import_tariff);
                }
                item.total_price_with_tariff = Number((Number(item.price_without_tariff * (1 + tariffRate / 100)).myRound(2)) * item.qty).myRound(2);
            },


            //货物操作和包装费
            handling_and_packing_fees(formData) {
                formData.procurement_price.handling_and_packing_fees = 5;
                if (formData.listData.length > 3) {
                    formData.procurement_price.handling_and_packing_fees += formData.listData.length - 3
                }
            },
            //海外出口报关费
            overseas_customs_fees(formData) {
                formData.procurement_price.overseas_customs_fees = 5;
                if (formData.listData.length > 3) {
                    formData.procurement_price.overseas_customs_fees += formData.listData.length - 3
                }
            },
            //中国进口清关费
            domestic_customs_clearance_fees(formData) {
                formData.procurement_price.domestic_customs_clearance_fees = 5;
                if (formData.listData.length > 3) {
                    formData.procurement_price.domestic_customs_clearance_fees += formData.listData.length - 3
                }
            },
            //供货商提货费
            supplier_pick_up_fees(formData) {
                formData.procurement_price.supplier_pick_up_fees = 10;
                if (formData.totalWeight > 1) {
                    formData.procurement_price.supplier_pick_up_fees += (formData.totalWeight - 1) * 2
                }
            },
            //国际物流费
            international_logistics_fees(formData) {
                formData.procurement_price.international_logistics_fees = 5;
                if (formData.totalWeight > 1) {
                    formData.procurement_price.international_logistics_fees += (formData.totalWeight - 1) * 2
                }
            },
            //国内物流费
            domestic_logistics_fees(formData) {
                formData.procurement_price.domestic_logistics_fees = 2;
                if (formData.totalWeight > 1) {
                    formData.procurement_price.domestic_logistics_fees += formData.totalWeight - 1
                }
            },
            //海外仓储操作费
            oversee_storage_service_fee(formData) {
                formData.procurement_price.oversee_storage_service_fee = 0;
                if (formData.delivery_mode === 'OFFSHORE' || formData.delivery_mode === 'DEMOSTIC') {
                    formData.procurement_price.oversee_storage_service_fee = Number(formData.procurement_price.total_products_price * 2 / 100).myRound(2);
                }

            },
            //中国仓储操作费
            domestic_storage_service_fee(formData) {
                formData.procurement_price.domestic_storage_service_fee = 0;
                if (formData.delivery_mode === 'DEMOSTIC') {
                    formData.procurement_price.domestic_storage_service_fee = Number(formData.procurement_price.total_products_price * 2 / 100).myRound(2);
                }
            },
            //附加中间费
            attachedIntermediateFee(formData) {
                formData.procurement_price.attachedIntermediateFee =
                        Number(formData.procurement_price.handling_and_packing_fees
                                + formData.procurement_price.overseas_customs_fees
                                + formData.procurement_price.domestic_customs_clearance_fees
                                + formData.procurement_price.supplier_pick_up_fees
                                + formData.procurement_price.international_logistics_fees
                                + formData.procurement_price.domestic_logistics_fees
                                + formData.procurement_price.oversee_storage_service_fee
                                + formData.procurement_price.domestic_storage_service_fee).myRound(2)
            },
            //保险费
            insurance_fees(formData) {
                formData.procurement_price.insurance_fees = Number((formData.procurement_price.total_products_price + formData.procurement_price.attachedIntermediateFee) * 0.27 / 100).myRound(2);
            },
            //换汇手续费
            foreign_exchange_fees(formData) {
                formData.procurement_price.foreign_exchange_fees = Number((formData.procurement_price.total_products_price + formData.procurement_price.attachedIntermediateFee) * 1 / 100).myRound(2);
            },
            //附加费总计
            extra_charges_total(formData) {
                formData.procurement_price.extra_charges_total =
                        Number(formData.procurement_price.attachedIntermediateFee
                                + formData.procurement_price.insurance_fees
                                + formData.procurement_price.foreign_exchange_fees).myRound(2)
            },
            //增值税
            value_add_tax(formData) {
                let value_add_tax = 0;
                for (let i = 0; i < formData.listData.length; i++) {
                    value_add_tax += Number(formData.listData[i].total_price_with_tariff * 0.13).myRound(2);
                }
                value_add_tax += Number(formData.procurement_price.extra_charges_total * 0.13).myRound(2);
                formData.procurement_price.value_add_tax = value_add_tax.myRound(2);
            },
            //人民币总价
            grand_cny_price(formData) {
                let grand_cny_price = 0;
                for (let i = 0; i < formData.listData.length; i++) {
                    let item = formData.listData[i];
                    let tariffRate = Number(item.tariff_rate);
                    if (item.extra_import_tariff) {
                        tariffRate += Number(item.extra_import_tariff);
                    }
                    let price_with_tariff_1 = item.price_without_tariff * (1 + tariffRate / 100);
                    let extra_charges_total = formData.procurement_price.extra_charges_total;
                    if(formData.discount_amount){
                        extra_charges_total = extra_charges_total - formData.discount_amount/formData.exchange_rate/1.13;
                    }
                    let price_with_tariff_2 = price_with_tariff_1 * (1 + extra_charges_total / formData.procurement_price.total_products_price);
                    item.cny_price_with_tariff = Number(price_with_tariff_2 * 1.13 * formData.exchange_rate).myRound(2);
                    item.total_cny_price_with_tariff = Number(item.cny_price_with_tariff * item.qty).myRound(2);
                    grand_cny_price += item.total_cny_price_with_tariff;
                }
                formData.procurement_price.grand_cny_price = grand_cny_price.myRound(2);
            },

        },
    }
</script>
