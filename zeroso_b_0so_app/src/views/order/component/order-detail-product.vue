<template>
    <div class="order-detail-product" v-loading="loading">
        <el-card class="margin-bottom-20" v-for="(originOrder,$index) in origin_orders" :key="$index">

            <div class="clearfix" v-if="originOrder.order_products">
                <el-table :data="originOrder.order_products" border :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                    <el-table-column label="型号/订货号">
                        <template slot-scope="scope">
                            <div v-if="originOrder.isEdit && scope.row.is_active">
                                <SelectProduct
                                        :disabled="!orderData.view_control.product_editable"
                                        :productId.sync="scope.row.product_id"
                                        :product.sync="scope.row.product"
                                        :option="scope.row.product_id ? [scope.row.product] : null"
                                        :validate.sync="scope.row.validate"
                                        :data="{brand_name: originOrder.brand?originOrder.brand.name:null}">
                                </SelectProduct>

                            </div>
                            <div v-else>
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product.id" target="_blank" v-if="scope.row.product">
                                    <p>{{scope.row.product.product_name | defaultStr}}</p>
                                    <p>{{scope.row.product.product_order_no | defaultStr}}</p>
                                </router-link>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="参数">
                        <template slot-scope="scope">
                            <p v-if="originOrder.isEdit && scope.row.is_active">
                                <el-input type="textarea"
                                          :rows="4"
                                          v-model="scope.row.product.product_parameter"
                                          :disabled="!orderData.view_control.product_editable"
                                          placeholder="参数">
                                </el-input>
                            </p>
                            <p v-else>{{scope.row.product.product_parameter | defaultStr}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="数量" align="right">
                        <template slot-scope="scope">
                            <p v-if="originOrder.isEdit && scope.row.is_active">
                                <InputNumber :value.sync="scope.row.qty" :integer="true" :disabled="!orderData.view_control.qty_editable" placeholder="数量"></InputNumber>
                            </p>
                            <p v-else>{{scope.row.qty | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="货期" align="right">
                        <template slot-scope="scope">
                            <p>{{(scope.row.order_lines[0] ? scope.row.order_lines[0].shipment_period : '') | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="500">
                        <template slot="header">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>未税单价</th>
                                    <th>含税单价</th>
                                    <th>含税总价</th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <table class="table" style="margin: 20px 0;" v-if="scope.row.order_lines">
                                <tbody>
                                <tr v-for="(line,$lineIndex) in scope.row.order_lines" :key="$lineIndex">
                                    <td>
                                        <div v-if="originOrder.isEdit && scope.row.is_active && $lineIndex===0">
                                            <InputNumber :value.sync="line.price_unit" :disabled="line.tax_method !== 'on_untaxed'">
                                                <template slot="append">{{orderNodesMaps[line.account_company_id].currency}}</template>
                                            </InputNumber>
                                        </div>
                                        <div v-else>
                                            {{(line.manual_price_unit || line.price_unit) | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="originOrder.isEdit && scope.row.is_active && $lineIndex===0">
                                            <InputNumber :value.sync="line.price_taxed_unit" :disabled="line.tax_method !== 'on_taxed'">
                                                <template slot="append">{{orderNodesMaps[line.account_company_id].currency}}</template>
                                            </InputNumber>
                                        </div>
                                        <span v-else>
                                            <span>{{(line.manual_price_taxed_unit || line.price_taxed_unit) | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}</span>
                                        </span>
                                    </td>
                                    <td>{{line.price_amount | zerosoAbs | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}</td>
                                </tr>
                                </tbody>
                            </table>

                            <div class="padding-top-10">
                                <FileListShow
                                        v-if="scope.row.id"
                                        :show-delete="originOrder.isEdit && scope.row.is_active"
                                        :module_id="scope.row.id"
                                        module_name="order_line"
                                        subsystem="platform"
                                        ref="order_line_show"
                                ></FileListShow>
                                <FileUpload
                                        v-if="originOrder.isEdit && scope.row.is_active && scope.row.id"
                                        :module_id="scope.row.id"
                                        module_name="order_line"
                                        subsystem="platform"
                                        ref="order_line"
                                ></FileUpload>
                            </div>

                            <div v-if="originOrder.isEdit" class="text-align-right">
                                <i class="el-icon-delete el-icon-normal cursor-pointer" title="删除" v-if="scope.row.is_active" @click="clickDeleteProduct(scope.row,originOrder.order_products)"></i>
                                <i class="el-icon-refresh-left el-icon-normal cursor-pointer" title="恢复" v-if="!scope.row.is_active" @click="scope.row.is_active=true"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-align-right padding-top-10"  v-if="originOrder.isEdit">
                    <el-button type="primary" @click="clickAdd(originOrder)">新增产品</el-button>
                </div>
            </div>

        </el-card>
    </div>
</template>

<script>

    export default {
        props: ['orderData', 'queryId','orderNodesMaps'],
        data() {
            return {

                origin_orders:[],

                route_map:[],


                loading: false,
            }
        },
        computed: {},
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
                if (this.orderData) {
                    let origin_orders=[];
                    if(this.orderData.order_type === "merged"){
                        origin_orders = this.orderData.origin_orders ? JSON.parse(JSON.stringify(this.orderData.origin_orders)) : [];
                    }else {
                        origin_orders = this.orderData ? [JSON.parse(JSON.stringify(this.orderData))] : [];
                    }
                    for(let i=0;i<origin_orders.length;i++){
                        origin_orders[i].isEdit=false;
                        if(origin_orders[i].order_products){
                            for(let k=0;k<origin_orders[i].order_products.length;k++){
                                origin_orders[i].order_products[k].validate=true;
                            }
                        }
                    }
                    this.origin_orders = origin_orders;


                    let route_map = this.orderData.route_map ? JSON.parse(JSON.stringify(this.orderData.route_map)) : [];
                    if(route_map.length<3) route_map.push({})
                    this.route_map = route_map
                }
            },



            //点击编辑
            clickEdit(originOrder){
                originOrder.isEdit=true;
            },
            //点击新增产品
            clickAdd(originOrder){
                originOrder.order_products.push({
                    product:{
                        brand:{},
                        product_trade_name:{},
                        product_customs_info:{},
                    },
                    is_active:true,
                    validate:true,
                })
            },
            //保存编辑
            clickSaveEdit(originOrder) {
                let self = this;
                let submitData={
                    order_id:originOrder.id,
                    brand_name: originOrder.brand.name,
                    order_products:[],
                };

                for(let i=0;i<originOrder.order_products.length;i++){
                    let row=originOrder.order_products[i];

                    if(!row.validate){
                        self.$message({
                            showClose: true,
                            message: '请选择产品型号或订货号',
                            type: 'error'
                        });
                        console.log(row)
                        return
                    }
                    if(!row.qty && row.qty!==0){
                        self.$message({
                            showClose: true,
                            message: '请填写数量',
                            type: 'error'
                        });
                        return
                    }

                    row.product.id=row.id;
                    row.product.is_active=row.is_active;
                    row.product.comment=row.comment;
                    row.product.forecast_import_tariff=row.forecast_import_tariff;
                    row.product.qty=row.qty;
                    if(row.order_lines && row.order_lines[0]){
                        row.product.shipment_period=row.order_lines[0].shipment_period;
                        row.product.price_unit=row.order_lines[0].price_unit;
                        row.product.price_taxed_unit=row.order_lines[0].price_taxed_unit;
                    }
                    submitData.order_products.push(row.product);
                }

                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/order_lines',
                    type: 'PUT',
                    requestBody: true,
                    data: submitData,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$refs.order_line.forEach((item)=>{
                                item.submitUpload && item.submitUpload(null,()=>{
                                    self.$refs.order_line_show.forEach((order_line_show)=>{
                                        order_line_show.update && order_line_show.update();
                                    });
                                });
                            });

                            setTimeout(()=>{
                                originOrder.isEdit = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.$emit('updateInit');
                            },300)
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },
            //取消编辑
            clickCancelEdit(originOrder) {
                originOrder.isEdit = false;
                this.$emit('updateInit');
            },
            //删除产品行
            clickDeleteProduct(row,order_products){
                let m=0;
                order_products.forEach((item)=>{
                    if(item.is_active) m++;
                });
                if(m<=1){
                    this.$message({
                        showClose: true,
                        message: '订单至少需要一个产品，不能删除！',
                        type: 'error'
                    });
                    return
                }
                if(row.id){
                    row.is_active=false;
                }else {
                    order_products.splice(order_products.indexOf(row),1);
                }
            },

            tableRowClassName({row}) {
                if(!row.is_active) return 'canceled-line'
            },





        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";
    .order-detail-product {
        min-height: 600px;
        padding-bottom: 100px;
        .cell{
            overflow: inherit !important;
            &>p{
                margin: 16px 0 !important;
            }
        }
        .table{
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
            th,td{
                border-right: none;
                width: 18%;
                text-align: center;
            }
            th{
                border-bottom: none;
            }
            td{
                padding: 8px;
                border-bottom: 1px solid #dddddd;
                border-top: 1px solid #dddddd;
                background-color: #ffffff !important;
                position: relative;
                white-space: nowrap;
            }
            td:last-child{
                border-right: 1px solid #dddddd;
            }
            td:first-child{
                padding: 0;
                border-left: 1px solid #dddddd;
            }
            .left-part{
                position: absolute;
                left: -1px;
                top: -21px;
                right: -1px;
                z-index: 10;
                td{
                    border: 1px solid #dddddd;
                    line-height: 39px;
                    background-color: #f5f5f5 !important;
                    &.active{
                        background-color: #ffffff !important;
                    }
                }
            }
        }
        .canceled-line{
            cursor: not-allowed;
            .cell{
                color: #CCCCCC;
            }
        }
    }
</style>
