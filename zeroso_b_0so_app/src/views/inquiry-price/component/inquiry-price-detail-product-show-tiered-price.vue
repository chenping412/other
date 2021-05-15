<template>
    <el-popover trigger="click" placement="left" width="350" @show="getProductPriceList" v-show="productPriceList && productPriceList.length>0">
        <span slot="reference" class="el-icon-info cursor-pointer"> </span>

        <div v-loading="loading">
            <el-table :data="productPriceList" border max-height="300px" size="mini">
                <el-table-column label="最小起订量" width="120px">
                    <template slot-scope="scope">
                        <p>{{scope.row.min_qty}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="未税单价">
                    <template slot-scope="scope">
                        <p>{{scope.row.price | isoCurrency(scope.row.currency)}}</p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-popover>
</template>

<script>

    export default {
        props: ['productLine', 'queryId','isAlreadyExpenseApproved','detailForm','productMinQty'],
        data() {
            return {
                loading: false,

                productPriceList:[],
            }
        },
        watch:{
            detailForm(){
                this.getProductPriceList();
            }
        },
        created() {
            this.getProductPriceList(true);
        },
        methods: {
            getProductPriceList(showMessage) {
                let self = this;
                self.productPriceList=[];
                if(self.productLine.product_id && self.productLine.prodcut_quotation.quote_supplier_id){
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations_products + '/' + self.productLine.product_id + '/'+self.productLine.prodcut_quotation.quote_supplier_id+'/tieredPrice',
                    type: 'GET',
                    success(data) {
                        self.loading = false;
                        let productPriceList=data;
                        let productMinQty = null;
                        if(productPriceList.length>0){
                            productMinQty = Infinity;
                            for(let k=0;k<productPriceList.length;k++){
                                productPriceList[k].priceCny = Number(productPriceList[k].price * (self.detailForm.currency_unit.exchange_rate||1)).myRound(2);
                                if(Number(productPriceList[k].min_qty) <= productMinQty){
                                    productMinQty = Number(productPriceList[k].min_qty);
                                }
                            }
                            if(productMinQty===Infinity) productMinQty = null;
                        }
                        self.productPriceList= productPriceList;
                        self.$emit('update:productMinQty',productMinQty);
                        if(showMessage && productMinQty && self.productLine.prodcut_quotation.quantity<productMinQty
                                && self.isAlreadyExpenseApproved && self.detailForm.inquiry_quote_state!=='CONTRACT_ENFORCED'
                                && !self.productLine.mark_as_deleted && self.productLine.product_quote_state !== 'INVALID' && self.productLine.product_quote_state !== 'REPLACED'){
                            self.$message({
                                duration:10000,
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                message: '<span style="line-height: 1.6em;">有产品数量小于最低起订量，请删除产品或增加数量！' +
                                        '<br>注意：需要所有型号都满足最低起订量才会整体报价！' +
                                        '<br>型号：'+self.productLine.product_name+
                                        '<br>订货号：'+self.productLine.product_order_no+'</span>',
                                type: 'warning'
                            });
                        }
                    }
                });
                }
            },
        }
    }
</script>

<style lang="scss">

</style>
