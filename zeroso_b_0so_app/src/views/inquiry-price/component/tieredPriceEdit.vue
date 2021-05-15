<template>
    <table class="tiered-price-edit-table">
        <thead v-if="showHeader">
        <tr>
            <th>最小起订量</th>
            <th>面价(欧元)</th>
            <th>
                优惠折扣(%)
                <el-tooltip placement="top">
                    <i class="el-icon-question"></i>
                    <div slot="content" style="line-height: 1.5em">
                        <p>优惠折扣：指供应商可优惠的部分所占百分比，单位为 %</p>
                        <p>例如：原价100，优惠折扣25%，那么实际价格为 100 * (100% - 25%) = 75</p>
                        <p>注意：与之前填写 0~1 时，所指含义正好相反</p>
                    </div>
                </el-tooltip>
            </th>
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
                <InputNumber
                        v-if="isEditPrice"
                        :value.sync="priceRow.price"
                        placeholder="单位欧元">
                </InputNumber>
                <span v-else>{{priceRow.price |  isoCurrency(currency)}}</span>
            </td>
            <td>
                <InputNumber
                        v-if="isEditPrice"
                        :value.sync="priceRow.discountPercent"
                        :max="99"
                        :round="2"
                        placeholder="必填 0~99">
                </InputNumber>
                <span v-else>{{priceRow.discount | tenthsToPercent}}</span>
            </td>
            <td>
                <InputNumber
                        v-if="isEditPrice"
                        :value.sync="priceRow.shipment_period"
                        :integer="true"
                        :min="1"
                        placeholder="必填，单位为天">
                </InputNumber>
                <span v-else>{{priceRow.shipment_period}}</span>
            </td>
            <td>
                <el-date-picker
                        style="width: 100%;"
                        v-if="isEditPrice"
                        v-model="priceRow.expire_time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="有效期">
                </el-date-picker>
                <span v-else>{{priceRow.expire_time | zerosoCompanyDate}}</span>
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
            <td colspan="3"></td>
            <td>
                <InputNumber
                        :value.sync="scopeRow.shipment_period"
                        :integer="true"
                        placeholder="货期">
                    <template slot="append">
                        <span class="cursor-pointer blue" @click="setShipmentPeriod(scopeRow)">批量</span>
                    </template>
                </InputNumber>
            </td>
            <td class="price-date blue">
                <span @click="setExpireTime(1,scopeRow.price_list)">年底</span>
                <span @click="setExpireTime(2,scopeRow.price_list)">+1月</span>
                <span @click="setExpireTime(3,scopeRow.price_list)">+1年</span>
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
</template>

<script>
    export default {
        name: "tieredPriceEdit",
        props:['scopeRow','isEditPrice','showHeader'],
        data() {
            return {
                currency: 'EUR',
            }
        },
        methods:{
            clickAddPriceList(price_list) {
                price_list.push({
                    "discountPercent": '',
                    "expire_time": '',
                    "min_qty": '',
                    "price": '',
                    "shipment_period": '',
                });
            },
            clickDeletePriceList(priceRow, price_list) {
                price_list.splice(price_list.indexOf(priceRow), 1)
            },
            setExpireTime(type,price_list){
                if(price_list){
                    let expire_time='';
                    if(type===1){
                        expire_time = this.$moment().endOf('year').format('YYYY-MM-DD');
                    }else if(type===2){
                        expire_time = this.$moment().add(1,'months').format('YYYY-MM-DD');
                    }else if(type===3){
                        expire_time = this.$moment().add(1,'years').format('YYYY-MM-DD');
                    }
                    for(let i=0;i<price_list.length;i++){
                        price_list[i].expire_time = expire_time
                    }
                    price_list=JSON.parse(JSON.stringify(price_list));
                }
            },
            setShipmentPeriod(row){
                if(row.price_list && row.shipment_period){
                    for(let i=0;i<row.price_list.length;i++){
                        row.price_list[i].shipment_period = row.shipment_period
                    }
                    row.price_list=JSON.parse(JSON.stringify(row.price_list));
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
            padding: 4px 10px;
            text-align: left;
        }

        th {
            border: none !important;
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
            width: 50px;
        }
    }
    .inquiry-price-edit-price-btn {
        .price-date span {
            cursor: pointer;
            margin-right: 10px;
        }
    }
</style>