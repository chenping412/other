<template>
    <div class="border-bottom margin-bottom-20">
        <el-form label-width="120px">
            <el-form-item label="产品价格：">
                <table class="table table-border">
                    <thead>
                    <tr>
                        <th>供应商</th>

                        <th>最小起订量</th>
                        <th>价格</th>
                        <th>折扣</th>
                        <th>折扣系列</th>
                        <th>货期</th>
                        <th>来源</th>
                        <th>独立销售</th>
                        <th>创建时间</th>
                        <th>过期时间</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody v-for="(parentItem,parentIndex) in productPriceList" :key="parentIndex">
                    <tr v-for="(item,$index) in parentItem.tiered_price_list" :key="$index">
                        <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                            <router-link
                                    class="blue"
                                    :to="'/partner/detail?id='+parentItem.vendor_company.account_company_id"
                                    v-if="parentItem.vendor_company.account_company_id">
                                {{parentItem.vendor_company ? parentItem.vendor_company.company_name : ''}}
                            </router-link>
                        </td>

                        <td>{{item.min_qty | defaultStr}}</td>
                        <td>{{item.price | isoCurrency(item.currency)}}</td>
                        <td>{{item.discount | tenthsToPercent}}</td>
                        <td>
                            <span v-if="item.discount_serie">
                                {{item.discount_serie.name}}
                                ({{item.discount_serie.discount | tenthsToPercent}})
                            </span>
                        </td>
                        <td>{{item.shipment_period | defaultStr}}</td>
                        <td>
                            <span>{{item.source | productPriceSource}}</span>
                            <template v-if="item.sheet_id">
                                <span>号：</span>
                                <router-link class="blue" v-if="item.source === 'inquiry_sheet'" :to="'/inquiry-price/all/detail?id='+ item.sheet_id">
                                    {{item.sheet_id}}
                                </router-link>
                                <router-link class="blue" v-if="item.source === 'quote_sheet'" :to="'/inquiry-quotation/ALL/detail?id='+ item.sheet_id">
                                    {{item.sheet_id}}
                                </router-link>
                            </template>
                        </td>
                        <td>{{item.unit_sellable ? '是' : '否'}}</td>
                        <td>{{item.create_time | zerosoCompanyTime}}</td>
                        <td>{{item.expire_time | zerosoCompanyDate}}</td>
                        <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                            {{item.price_description}}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="padding-top-10">
                    <el-popover placement="top-start" trigger="click">
                        <div class="product-detail scroll" style="max-height:600px;">
                            <table class="table table-border">
                                <thead>
                                <tr>
                                    <th>供应商</th>
                                    <th>最小起订量</th>
                                    <th>价格</th>
                                    <th>折扣</th>
                                    <th>折扣系列</th>
                                    <th>货期</th>
                                    <th>来源</th>
                                    <th>独立销售</th>
                                    <th>创建时间</th>
                                    <th>过期时间</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody v-for="(parentItem,parentIndex) in productHistoryPriceList" :key="parentIndex">
                                <tr v-for="(item,$index) in parentItem.tiered_price_list" :key="$index">
                                    <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                                        <router-link
                                                class="blue"
                                                :to="'/partner/detail?id='+parentItem.vendor_company.account_company_id"
                                                v-if="parentItem.vendor_company.account_company_id">
                                            {{parentItem.vendor_company ? parentItem.vendor_company.company_name : ''}}
                                        </router-link>
                                    </td>

                                    <td>{{item.min_qty | defaultStr}}</td>
                                    <td>
                                        <span :class="{'delete':item.isExpired}">{{item.price | isoCurrency(item.currency)}}</span>
                                    </td>
                                    <td>{{item.discount | tenthsToPercent}}</td>
                                    <td>
                                        <span v-if="item.discount_serie">
                                            {{item.discount_serie.name}}
                                            ({{item.discount_serie.discount | tenthsToPercent}})
                                        </span>
                                    </td>
                                    <td>{{item.shipment_period | defaultStr}}</td>
                                    <td>
                                        <span>{{item.source | productPriceSource}}</span>
                                        <template v-if="item.sheet_id">
                                            <span>号：</span>
                                            <router-link class="blue" v-if="item.source === 'inquiry_sheet'" :to="'/inquiry-price/all/detail?id='+ item.sheet_id">
                                                {{item.sheet_id}}
                                            </router-link>
                                            <router-link class="blue" v-if="item.source === 'quote_sheet'" :to="'/inquiry-quotation/ALL/detail?id='+ item.sheet_id">
                                                {{item.sheet_id}}
                                            </router-link>
                                        </template>
                                    </td>
                                    <td>{{item.unit_sellable ? '是' : '否'}}</td>
                                    <td>{{item.create_time | zerosoCompanyTime}}</td>
                                    <td>
                                        <span :class="{'red':item.isExpired}">{{item.expire_time | zerosoCompanyDate}}</span>
                                    </td>
                                    <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                                        {{item.price_description}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <el-button slot="reference" size="mini" type="primary" plain>
                            查看历史价格记录
                        </el-button>
                    </el-popover>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        props: ['queryId', 'detailForm'],
        data() {
            return {
                productPriceList: [],

                productHistoryPriceList: [],

                loading: false,
            }
        },
        watch: {
            queryId() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.getProductPriceList();
                this.getProductHistoryPriceList();
            },
            //获取产品价格表
            getProductPriceList() {
                let self = this;
                self.productPriceList = [];
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/price',
                    type: 'GET',
                    success: function (data) {
                        if (data.msg && data.msg.length > 0) {
                            self.productPriceList = data.msg;
                        }
                    }
                })
            },
            //获取产品价格历史记录
            getProductHistoryPriceList() {
                let self = this;
                self.productHistoryPriceList = [];
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/history_price',
                    type: 'GET',
                    success: function (data) {
                        if (data.msg && data.msg.length > 0) {
                            let productHistoryPriceList = data.msg;
                            for(let i=0;i<productHistoryPriceList.length;i++){
                                if(productHistoryPriceList[i].tiered_price_list){
                                    for(let k=0;k<productHistoryPriceList[i].tiered_price_list.length;k++){
                                        if(productHistoryPriceList[i].tiered_price_list[k].expire_time){
                                            let expireTime = new Date(productHistoryPriceList[i].tiered_price_list[k].expire_time + ' 23:59:59').getTime();
                                            let nowTime = new Date().getTime();
                                            if(expireTime < nowTime){
                                                productHistoryPriceList[i].tiered_price_list[k].isExpired = true;
                                            }
                                        }else {
                                            productHistoryPriceList[i].tiered_price_list[k].isExpired = true;
                                        }
                                    }
                                }
                            }
                            self.productHistoryPriceList = data.msg;
                        }
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>