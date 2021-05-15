<template>
    <div>
        <table class="tiered-price-edit-table">
            <thead class="head" v-if="showHeader">
            <tr>
                <th>最小起订量</th>
                <th>面价(欧元)</th>
                <th class="col-discount">
                    <div>
                        优惠折扣(%)
                    </div>
                    <div>
                        折扣系列(选一项)
                    </div>
                </th>
                <th>独立销售</th>
                <th>货期(天)</th>
                <th>有效期</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(priceRow,$index) in scopeRow.price_list" :key="$index">
                <td>
                    <InputNumber
                            v-if="isEditPrice"
                            :value.sync="priceRow.min_qty"
                            :integer="true"
                            :min="1"
                            placeholder="必填,最小填 1">
                    </InputNumber>
                    <span v-else>{{priceRow.min_qty}}</span>
                </td>
                <td>
                    <div v-if="isEditPrice" style="position: relative;">
                        <InputNumber
                                :value.sync="priceRow.price"
                                :round="2"
                                placeholder="单位欧元">
                        </InputNumber>
                        <span class="red computed-row-total-price">
                         {{computedRowTotalPrice(priceRow)}}
                    </span>
                    </div>
                    <span v-else>{{priceRow.price |  isoCurrency(currency)}}</span>
                </td>
                <td class="col-discount">
                    <div v-if="isEditPrice">
                        <InputNumber
                                style="width: 50%"
                                :value.sync="priceRow.discountPercent"
                                :max="99"
                                :round="2"
                                :clearable="true"
                                placeholder="优惠折扣0~99">
                        </InputNumber>
                        <el-select
                                style="width: 50%"
                                v-model="priceRow.discount_serie_id"
                                clearable
                                placeholder="折扣系列">
                            <el-option
                                    v-for="item in selectSupplierDiscountSeriesList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name">
                                <span>{{item.name}}</span>
                                <span> ({{item.discount | tenthsToPercent}})</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        <div>{{priceRow.discount | tenthsToPercent | defaultStr}}</div>
                         <div v-if="priceRow.discount_serie">
                             <span>{{priceRow.discount_serie.name}}</span>
                             <span>({{priceRow.discount_serie.discount | tenthsToPercent}})</span>
                         </div>
                    </div>
                </td>
                <td>
                    <div v-if="isEditPrice">
                        <el-select v-model="priceRow.unit_sellable" placeholder="独立销售">
                            <el-option :value="true" label="是"></el-option>
                            <el-option :value="false" label="否"></el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        {{priceRow.unit_sellable ? '是' : '否'}}
                    </div>
                </td>
                <td>
                    <div v-if="isEditPrice">
                        <InputNumber
                                :value.sync="priceRow.shipment_period"
                                :integer="true"
                                :min="1"
                                :clearable="true"
                                placeholder="必填，单位天">
                        </InputNumber>
                    </div>
                    <div v-else>
                        <div>{{priceRow.shipment_period | defaultStr}}</div>
                    </div>
                </td>
                <td>
                    <div v-if="isEditPrice">
                        <el-date-picker
                                style="width: 100%;"
                                v-if="isEditPrice"
                                v-model="priceRow.expire_time"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                placeholder="必填，有效期">
                        </el-date-picker>
                    </div>
                    <div v-else>
                        <div>{{priceRow.expire_time | zerosoCompanyDate}}</div>
                    </div>
                </td>
                <td>
                <span class="el-icon-remove-outline el-icon-normal red cursor-pointer"
                      title="删除"
                      v-if="isEditPrice"
                      @click="clickDeletePriceList(priceRow,scopeRow.price_list)">
                </span>
                </td>
            </tr>

            <tr class="inquiry-price-edit-price-btn" v-if="isEditPrice">
                <td colspan="4">
                    <el-input
                            v-if="scopeRow.price_list.length>0"
                            type="textarea"
                            v-model="priceDescriptionAll"
                            placeholder="报价备注">
                    </el-input>
                </td>
                <td>
                    <InputNumber
                            :value.sync="batchShipmentPeriod"
                            :integer="true"
                            placeholder="货期,批量"
                            :clearable="true"
                            @change="setShipmentPeriod(scopeRow)">
                    </InputNumber>
                </td>
                <td>
                    <el-date-picker
                            style="width: 100%;"
                            v-model="batchExpireTime"
                            size="mini"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            placeholder="有效期,批量"
                            @change="setExpireTime(scopeRow)">
                    </el-date-picker>
                    <InputNumber
                            :value.sync="batchNnWeekAgo"
                            size="mini"
                            :integer="true"
                            placeholder="n周后,批量"
                            :clearable="true"
                            @change="setNnWeekAgo(scopeRow)">
                    </InputNumber>
                </td>
                <td>
                 <span class="el-icon-circle-plus-outline el-icon-normal cursor-pointer blue"
                       title="添加行"
                       @click="clickAddPriceList(scopeRow.price_list)">
                 </span>
                </td>
            </tr>

            </tbody>
        </table>
        <div v-if="!isEditPrice && priceDescriptionAll">报价备注：{{priceDescriptionAll}}</div>
    </div>
</template>

<script>
    export default {
        name: "tieredPriceEdit",
        props: ['scopeRow', 'isEditPrice', 'showHeader', 'brandId', 'supplierId'],
        data() {
            let self = this;
            return {
                currency: 'EUR',
                productDiscountSeriesListAll: [],
                selectSupplierDiscountSeriesList: [],

                batchShipmentPeriod:'',
                batchExpireTime:'',
                batchNnWeekAgo:'',

                pickerOptions: {
                    shortcuts: [{
                        text: '1个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(1, 'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '2个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(2, 'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '3个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(3, 'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '6个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(6, 'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '1年后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(1, 'years').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '年底',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().endOf('year').format('YYYY-MM-DD'));
                        }
                    }]
                },

                priceDescriptionAll: null,
            }
        },
        watch: {
            isEditPrice(val) {
                if (val) {
                    this.getProductDiscountSeriesList();
                }
            },
            supplierId() {
                this.computeSelectSupplierDiscountSeriesList()
            },
            'scopeRow.price_list'() {
                this.setPriceDescriptionAll()
            },
            priceDescriptionAll(val) {
                if (this.scopeRow && this.scopeRow.price_list) {
                    for (let i = 0; i < this.scopeRow.price_list.length; i++) {
                        this.scopeRow.price_list[i].price_description = val;
                    }
                }
            }
        },
        created() {
            this.setPriceDescriptionAll();
            if (this.isEditPrice) {
                this.getProductDiscountSeriesList();
            }
        },
        methods: {
            setPriceDescriptionAll() {
                this.priceDescriptionAll = null;
                if (this.scopeRow && this.scopeRow.price_list) {
                    for (let i = 0; i < this.scopeRow.price_list.length; i++) {
                        if (this.scopeRow.price_list[i].price_description) {
                            this.priceDescriptionAll = this.scopeRow.price_list[i].price_description;
                            break
                        }
                    }
                }
            },
            getProductDiscountSeriesList() {
                let self = this;
                self.productDiscountSeriesList = [];
                if (self.brandId) {
                    self.$http({
                        url: self.$api.product_v5 + '/' + self.brandId + '/brand_suppliers/discount_series',
                        success: function (data) {
                            if (data.msg) {
                                self.productDiscountSeriesListAll = data.msg;
                                self.computeSelectSupplierDiscountSeriesList()
                            }
                        }
                    });
                }
            },
            computeSelectSupplierDiscountSeriesList() {
                console.log('供应商变化，选择折扣系列列表')
                this.selectSupplierDiscountSeriesList = [];
                if (this.supplierId) {
                    this.productDiscountSeriesListAll.forEach((item) => {
                        if (item.account_company_id === this.supplierId) {
                            this.selectSupplierDiscountSeriesList = item.discount_series;
                        }
                    })
                }
                if (this.scopeRow.price_list) {
                    for (let i = 0; i < this.scopeRow.price_list.length; i++) {
                        if (this.scopeRow.price_list[i].discount_serie_id) {
                            let selectInList = false;
                            this.selectSupplierDiscountSeriesList.forEach((item) => {
                                if (item.id === this.scopeRow.price_list[i].discount_serie_id) {
                                    selectInList = true;
                                }
                            })
                            if (!selectInList) {
                                this.scopeRow.price_list[i].discount_serie_id = ''
                            }
                        }
                    }
                    this.scopeRow.price_list = JSON.parse(JSON.stringify(this.scopeRow.price_list));
                }
                this.setPriceDescriptionAll()
            },
            clickAddPriceList(price_list) {
                price_list.push({
                    "discountPercent": '',
                    "expire_time": '',
                    "min_qty": '',
                    "price": '',
                    "shipment_period": '',
                    "discount_serie_id": '',
                    "unit_sellable": true,
                    "governance_state": true,
                    "price_description": this.priceDescriptionAll || '',
                });
            },
            clickDeletePriceList(priceRow, price_list) {
                price_list.splice(price_list.indexOf(priceRow), 1)
            },

            setShipmentPeriod(row) {
                if (row.price_list && this.batchShipmentPeriod) {
                    for (let i = 0; i < row.price_list.length; i++) {
                        row.price_list[i].shipment_period = this.batchShipmentPeriod
                    }
                    row.price_list = JSON.parse(JSON.stringify(row.price_list));
                }
            },
            setExpireTime(row) {
                if (row.price_list && this.batchExpireTime) {
                    for (let i = 0; i < row.price_list.length; i++) {
                        row.price_list[i].expire_time = this.batchExpireTime
                    }
                    row.price_list = JSON.parse(JSON.stringify(row.price_list));
                }
            },
            setNnWeekAgo(row){
                if(this.batchNnWeekAgo && this.batchNnWeekAgo>0){
                    this.batchExpireTime = this.$moment().add(this.batchNnWeekAgo, 'week').format('YYYY-MM-DD');
                    this.setExpireTime(row);
                }
            },

            computedRowTotalPrice(priceRow) {
                let num = 0;
                if(priceRow.min_qty && priceRow.price){
                    if (priceRow.discountPercent || priceRow.discountPercent === 0) {
                        num = Number(Number(priceRow.min_qty) * Number(priceRow.price) * (100 - Number(priceRow.discountPercent)) / 100).myRound(2)
                    }else if(priceRow.discount_serie_id){
                        let discount = 0;
                        this.selectSupplierDiscountSeriesList.forEach((item)=>{
                            if(item.id === priceRow.discount_serie_id){
                                discount = item.discount
                            }
                        });
                        num = Number(Number(priceRow.min_qty) * Number(priceRow.price) * (1 - discount)).myRound(2)
                    }
                }

                return num || ''
            },

            discountChange(priceRow, type) {
                if (type === 'discountPercent') {
                    priceRow.discount_serie_id = "";
                } else {
                    priceRow.discountPercent = "";
                }
            },
        }
    }
</script>

<style lang="scss">
    .tiered-price-edit-table {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;

        th, td {
            width: 18%;
            padding: 3px;
            text-align: left;
        }

        th {
            line-height: 1.4em;
            border: none;
        }

        .head th {
            border: 1px solid #dddddd;
            padding: 5px;
        }

        td {
            border: 1px solid #dddddd;
            background-color: #ffffff !important;

            & > span {
                display: inline-block;
                min-height: 16px;
            }
        }

        th:last-child,
        td:last-child {
            width: 40px;
        }
        th.col-discount,
        td.col-discount {
            width: 28%;
        }

        .computed-row-total-price {
            position: absolute;
            right: 5px;
            line-height: 32px;
            font-size: 12px;
        }

        .el-input__inner {
            padding: 0 5px;
        }

        .el-input__prefix {
            display: none;
        }
    }

    .inquiry-price-edit-price-btn {
        .price-date span {
            cursor: pointer;
            margin-right: 10px;
        }
    }
</style>