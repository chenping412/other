<template>
    <div class="order-detail-product" v-loading="loading">
        <el-card class="margin-bottom-20" v-for="(originOrder,$index) in origin_orders" :key="$index">
            <div slot="header" class="clearfix">
                <h3 class="left">
                    <span class="margin-right-20" v-if="orderData.order_type !== 'merged'">产品明细</span>
                    <span v-if="orderData.order_type === 'merged'" class="margin-right-20">客户：{{originOrder.route_map[originOrder.route_map.length - 1].company_name}}</span>
                    <span v-if="orderData.order_type === 'merged'" class="margin-right-20">{{originOrder.name}}</span>

                    <span class="margin-right-20" v-if="originOrder.brand">
                        <span>品牌：</span>
                        <router-link class="blue margin-right-10" :to="'/product/brand/detail?id='+originOrder.brand.id"
                                     target="_blank">
                            {{originOrder.brand.name}}
                        </router-link>
                        <el-popover class="margin-right-20" title="备注" placement="bottom-start" width="600"
                                    v-if="originOrder.brand.comment">
                            <i slot="reference" class="el-icon-tickets el-icon-normal cursor-pointer"></i>
                            <div style="white-space: pre-wrap">
                                {{originOrder.brand.comment}}
                            </div>
                        </el-popover>
                        <BrandLever :state="originOrder.brand.state"></BrandLever>
                    </span>

                    <span v-if="orderData.order_type === 'merged'" class="margin-right-20">状态：{{originOrder.order_base_state | zerosoOrderNodeStatus}}</span>
                </h3>
                <div class="right" v-if="!isCreate">
                    <div v-if="!originOrder.isEdit">
                        <el-button type="primary" @click="clickEdit(originOrder)">编辑</el-button>
                    </div>
                    <div v-else>
                        <el-button type="success" @click="clickSaveEdit(originOrder)">保存</el-button>
                        <el-button type="primary" plain @click="clickCancelEdit(originOrder)">取消</el-button>
                    </div>
                </div>
            </div>

            <div class="clearfix" v-if="originOrder.order_products">
                <el-table :data="originOrder.order_products" border :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column width="80">
                        <template slot-scope="scope">
                            <p v-if="scope.row.product">
                                <router-link :to="'/product/product/detail?id='+scope.row.product.id" target="_blank">
                                    <el-tag :type="scope.row.product.state==='verified'?'success' : 'warning'">
                                        {{scope.row.product.state | productState | defaultStr}}
                                    </el-tag>
                                </router-link>
                            </p>
                            <p v-if="scope.row.product">
                                <router-link :to="'/product/product/detail?id='+scope.row.product.id" target="_blank">
                                    <el-tag :type="scope.row.product.custom_status==='verified'?'success' : null">
                                        {{scope.row.product.custom_status | productCustomState | defaultStr}}
                                    </el-tag>
                                </router-link>
                            </p>
                            <p>
                                <el-tag :type="scope.row.logistics_state==='done'?'success' : 'warning'">
                                    {{scope.row.logistics_state | logisticsStatus | defaultStr}}
                                </el-tag>
                            </p>
                        </template>
                    </el-table-column>

                    <el-table-column label="型号/订货号/参数" width="220">
                        <template slot-scope="scope">
                            <template v-if="(originOrder.isEdit && scope.row.is_active) || isCreate">
                                <order-detail-product-select-product
                                        :disabled="!orderData.view_control.product_editable && !isCreate"
                                        :productId.sync="scope.row.product_id"
                                        :product.sync="scope.row.product"
                                        :brand="originOrder.brand"
                                        :validate.sync="scope.row.validate">
                                </order-detail-product-select-product>
                                <p>
                                    <el-input type="textarea"
                                              :rows="4"
                                              v-model="scope.row.product.product_parameter"
                                              :disabled="!orderData.view_control.product_editable && !isCreate"
                                              placeholder="参数">
                                    </el-input>
                                </p>
                            </template>
                            <template v-else>
                                <p>
                                    <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product.id"
                                                 target="_blank">
                                        {{scope.row.product.product_name | defaultStr}}
                                    </router-link>
                                </p>
                                <p>
                                    <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product.id"
                                                 target="_blank">
                                        {{scope.row.product.product_order_no | defaultStr}}
                                    </router-link>
                                </p>
                                <p>
                                    <el-tooltip effect="light" placement="top">
                                        <span class="nowrap">{{scope.row.product.product_parameter}}</span>
                                        <pre slot="content" class="scroll" style="max-height: 500px;" v-html="scope.row.product.product_parameter"></pre>
                                    </el-tooltip>
                                </p>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="中文品名/英文品名/备注" width="180">
                        <template slot-scope="scope">
                            <p>
                                {{(scope.row.product.product_trade_name?scope.row.product.product_trade_name.product_cn_name:'')
                                | defaultStr}}</p>
                            <p>
                                {{(scope.row.product.product_trade_name?scope.row.product.product_trade_name.product_en_name:'')
                                | defaultStr}}</p>

                            <p v-if="(originOrder.isEdit && scope.row.is_active) || isCreate">
                                <el-input type="textarea"
                                          :rows="4"
                                          v-model="scope.row.comment"
                                          :disabled="!orderData.view_control.comment_editable && !isCreate"
                                          placeholder="备注">
                                </el-input>
                            </p>
                            <p v-else>{{scope.row.comment | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="净重/毛重/原产地" width="150">
                        <template slot-scope="scope">
                            <template v-if="(originOrder.isEdit && scope.row.is_active) || isCreate">
                                <p>
                                    <InputNumber :value.sync="scope.row.product.net_weight" placeholder="净重"
                                                 :disabled="!orderData.view_control.weight_editable && !isCreate">
                                        <template slot="append">kg</template>
                                    </InputNumber>
                                </p>
                                <p>
                                    <InputNumber :value.sync="scope.row.product.gross_weight" placeholder="毛重"
                                                 :disabled="!orderData.view_control.weight_editable && !isCreate">
                                        <template slot="append">kg</template>
                                    </InputNumber>
                                </p>
                            </template>
                            <template v-else>
                                <p>{{scope.row.product.net_weight | defaultStr}}kg</p>
                                <p>{{scope.row.product.gross_weight | defaultStr}}kg</p>
                            </template>
                            <p>{{scope.row.product.origin_of_country | country | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="中国海关编码/关税/预估关税" width="200">
                        <template slot-scope="scope">
                            <p>
                                {{(scope.row.product.product_customs_info?scope.row.product.product_customs_info.customs_cn_code:'')
                                | defaultStr}}</p>
                            <p>
                                <span>{{(scope.row.product.product_customs_info?scope.row.product.product_customs_info.import_cn_tariffs:'') | percent | defaultStr}}</span>
                                <span class="red" v-if="scope.row.product.extra_import_cn_tariffs"> + {{scope.row.product.extra_import_cn_tariffs}}%</span>
                            </p>
                            <p v-if="(originOrder.isEdit && scope.row.is_active) || isCreate">
                                <InputNumber :value.sync="scope.row.forecast_import_tariff" placeholder="预估关税"
                                             :disabled="!orderData.view_control.comment_editable && !isCreate">
                                    <template slot="append">%</template>
                                </InputNumber>
                            </p>
                            <p v-else>{{scope.row.forecast_import_tariff | percent | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="100" align="right">
                        <template slot-scope="scope">
                            <p v-if="(originOrder.isEdit && scope.row.is_active) || isCreate">
                                <InputNumber :value.sync="scope.row.qty"
                                             :integer="true"
                                             :disabled="!orderData.view_control.qty_editable && !isCreate"
                                             placeholder="数量">
                                </InputNumber>
                            </p>
                            <p v-else>{{scope.row.qty | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>货期</th>
                                    <th>未税单价</th>
                                    <th>未税总价</th>
                                    <th>含税单价</th>
                                    <th>含税总价</th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <table class="table" style="margin: 20px 0;" v-if="scope.row.order_lines && !isCreate">
                                <tbody>
                                <tr v-for="(line,$lineIndex) in scope.row.order_lines" :key="$lineIndex">
                                    <td :rowspan="scope.row.order_lines.length" v-if="$lineIndex===0">
                                        <table class="table left-part">
                                            <tbody>
                                            <tr v-for="(chainNode,$index) in route_map" :key="$index">
                                                <td :class="{'active':chainNode.account_company_id===$store.state.currentCompany.account_company_id}">
                                                    <span class="nowrap" v-if="$index===0">
                                                        <span v-if="$store.state.mainCompanyAbbreviationCode[chainNode.account_company_id]">
                                                            {{chainNode.company_name | mainCompanyAbbreviationCode(chainNode.account_company_id)}}
                                                        </span>
                                                        <span>供应商</span>
                                                    </span>
                                                    <span class="nowrap" v-if="$index>0 && $index<route_map.length-1">
                                                        {{chainNode.company_name | mainCompanyAbbreviationCode(chainNode.account_company_id)}}
                                                    </span>
                                                    <span class="nowrap" v-if="$index===route_map.length-1">
                                                        <span v-if="$store.state.mainCompanyAbbreviationCode[chainNode.account_company_id]">
                                                            {{chainNode.company_name | mainCompanyAbbreviationCode(chainNode.account_company_id)}}
                                                        </span>
                                                        <span v-else>客户</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td>
                                        <div v-if="$lineIndex===0 || $lineIndex===scope.row.order_lines.length-1">
                                            <div v-if="originOrder.isEdit && scope.row.is_active && $lineIndex===0">
                                                <InputNumber :value.sync="line.shipment_period"
                                                             :integer="true"></InputNumber>
                                            </div>
                                            <span v-else>{{line.shipment_period | defaultStr}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="originOrder.isEdit && scope.row.is_active && $lineIndex===0">
                                            <InputNumber :value.sync="line.price_unit"
                                                         :disabled="line.tax_method !== 'on_untaxed'"></InputNumber>
                                        </div>
                                        <div v-else>
                                            <span>{{(line.manual_price_unit || line.price_unit) | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}</span>
                                        </div>
                                    </td>
                                    <td>{{line.price_untaxed_amount | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}</td>
                                    <td>
                                        <div v-if="originOrder.isEdit && scope.row.is_active && $lineIndex===0">
                                            <InputNumber :value.sync="line.price_taxed_unit"
                                                         :disabled="line.tax_method !== 'on_taxed'"></InputNumber>
                                        </div>
                                        <span v-else>
                                            <span>{{(line.manual_price_taxed_unit || line.price_taxed_unit) | isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}</span>

                                            <order-detail-product-edit-price
                                                    v-if="$lineIndex===scope.row.order_lines.length-1 && !$store.state.mainCompanyAbbreviationCode[orderData.route_map[orderData.route_map.length - 1].account_company_id] && !originOrder.isEdit && line.tax_method === 'on_taxed'"
                                                    :queryId="queryId" :orderData="orderData" :orderLine="line"
                                                    :orderNodesMaps="orderNodesMaps"
                                                    @updateInit="$emit('updateInit')">
                                            </order-detail-product-edit-price>
                                        </span>
                                    </td>
                                    <td>{{line.price_amount | zerosoAbs |
                                        isoCurrency(orderNodesMaps[line.account_company_id].currency) | defaultStr}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>

                            <div class="padding-top-10">
                                <FileListShow
                                        v-if="scope.row.id"
                                        :show-delete="originOrder.isEdit && scope.row.is_active"
                                        :updateFileList.sync="scope.row.updateFileList"
                                        :module_id="scope.row.id"
                                        module_name="order_line"
                                        subsystem="platform"
                                        ref="order_line_show">
                                </FileListShow>
                                <FileUpload
                                        v-if="originOrder.isEdit && scope.row.is_active && scope.row.id"
                                        :updateFileList="scope.row.updateFileList"
                                        :file-name-prefix="originOrder.brand?originOrder.brand.name+'-'+(scope.$index+1)+'-':null"
                                        :module_id="scope.row.id"
                                        module_name="order_line"
                                        subsystem="platform"
                                        ref="order_line">
                                </FileUpload>
                            </div>

                            <div v-if="originOrder.isEdit" class="text-align-right">
                                <i class="el-icon-delete el-icon-normal cursor-pointer" title="删除"
                                   v-if="scope.row.is_active"
                                   @click="clickDeleteProduct(scope.row,originOrder.order_products)"></i>
                                <i class="el-icon-refresh-left el-icon-normal cursor-pointer" title="恢复"
                                   v-if="!scope.row.is_active" @click="scope.row.is_active=true"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-align-right padding-top-10" v-if="originOrder.isEdit || isCreate">
                    <el-button type="primary" @click="clickAdd(originOrder)">新增产品</el-button>
                </div>
            </div>

        </el-card>
    </div>
</template>

<script>

    import OrderDetailProductEditPrice from "./order-detail-product-edit-price";
    import OrderDetailProductSelectProduct from "./order-detail-product-select-product";

    export default {
        components: {
            OrderDetailProductSelectProduct,
            OrderDetailProductEditPrice
        },
        props: ['orderData', 'queryId', 'orderNodesMaps', 'isCreate'],
        data() {
            return {

                origin_orders: [],

                route_map: [],


                loading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.orderData) {
                    let origin_orders = [];
                    if (this.orderData.order_type === "merged") {
                        origin_orders = this.orderData.origin_orders ? JSON.parse(JSON.stringify(this.orderData.origin_orders)) : [];
                    } else {
                        origin_orders = this.orderData ? [JSON.parse(JSON.stringify(this.orderData))] : [];
                    }
                    for (let i = 0; i < origin_orders.length; i++) {
                        origin_orders[i].isEdit = false;
                        if (origin_orders[i].order_products) {
                            for (let k = 0; k < origin_orders[i].order_products.length; k++) {
                                origin_orders[i].order_products[k].validate = true;
                                origin_orders[i].order_products[k].updateFileList = [];
                            }
                        }
                        if(this.isCreate && origin_orders[i].order_products.length===0){
                            this.clickAdd(origin_orders[i])
                        }
                    }
                    this.origin_orders = origin_orders;

                    let route_map = this.orderData.route_map ? JSON.parse(JSON.stringify(this.orderData.route_map)) : [];
                    if (route_map.length < 3) route_map.push({})
                    this.route_map = route_map
                }
            },


            //点击编辑
            clickEdit(originOrder) {
                originOrder.isEdit = true;
                this.$nextTick(() => {
                    this.$refs.order_line_show.forEach((order_line_show) => {
                        order_line_show.setUpdateFileList && order_line_show.setUpdateFileList();
                    });
                })
            },
            //点击新增产品
            clickAdd(originOrder) {
                originOrder.order_products.push({
                    product: {
                        brand: {},
                        product_trade_name: {},
                        product_customs_info: {},
                    },
                    is_active: true,
                    validate: true,
                    qty:1,
                })
            },
            //保存编辑
            clickSaveEdit(originOrder) {
                let self = this;
                let submitData = {
                    order_id: originOrder.id,
                    brand_name: originOrder.brand.name,
                    order_products: [],
                };

                for (let i = 0; i < originOrder.order_products.length; i++) {
                    let row = originOrder.order_products[i];

                    if (!row.validate) {
                        self.$message({
                            showClose: true,
                            message: '请选择产品型号或订货号',
                            type: 'error'
                        });
                        return
                    }
                    if (!row.qty && row.qty !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写数量',
                            type: 'error'
                        });
                        return
                    }

                    row.product.id = row.id;
                    row.product.is_active = row.is_active;
                    row.product.comment = row.comment;
                    row.product.forecast_import_tariff = row.forecast_import_tariff;
                    row.product.qty = row.qty;
                    row.product.weight = row.gross_weight;
                    if (row.order_lines && row.order_lines[0]) {
                        row.product.shipment_period = row.order_lines[0].shipment_period;
                        row.product.price_unit = row.order_lines[0].price_unit;
                        row.product.price_taxed_unit = row.order_lines[0].price_taxed_unit;
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
                            self.$refs.order_line.forEach((item) => {
                                item.submitUpload && item.submitUpload(null, () => {
                                    self.$refs.order_line_show.forEach((order_line_show) => {
                                        order_line_show.update && order_line_show.update();
                                    });
                                });
                            });

                            setTimeout(() => {
                                originOrder.isEdit = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.$emit('updateInit');
                            }, 300)
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
            clickDeleteProduct(row, order_products) {
                let m = 0;
                order_products.forEach((item) => {
                    if (item.is_active) m++;
                });
                if (m <= 1) {
                    this.$message({
                        showClose: true,
                        message: '订单至少需要一个产品，不能删除！',
                        type: 'error'
                    });
                    return
                }
                if (row.id) {
                    row.is_active = false;
                } else {
                    order_products.splice(order_products.indexOf(row), 1);
                }
            },

            tableRowClassName({row}) {
                if (!row.is_active) return 'canceled-line'
            },


        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .order-detail-product {
        min-height: 600px;
        padding-bottom: 100px;

        .cell {
            overflow: inherit !important;

            & > p {
                margin: 16px 0 !important;
            }
        }

        .table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;

            th, td {
                border-right: none;
                width: 18%;
                text-align: center;
            }

            th {
                border-bottom: none;
            }

            td {
                padding: 8px;
                border-bottom: 1px solid #dddddd;
                border-top: 1px solid #dddddd;
                background-color: #ffffff !important;
                position: relative;
                white-space: nowrap;
            }

            td:last-child {
                border-right: 1px solid #dddddd;
            }

            th:first-child,
            td:first-child {
                width: 28%;
            }

            td:first-child {
                padding: 0;
            }

            .left-part {
                position: absolute;
                left: -1px;
                top: -21px;
                right: -1px;
                z-index: 10;

                td {
                    border: 1px solid #dddddd;
                    line-height: 39px;
                    background-color: #f5f5f5 !important;

                    &.active {
                        background-color: #ffffff !important;
                    }
                }
            }
        }

        .canceled-line {
            cursor: not-allowed;

            .cell {
                color: #CCCCCC;
            }
        }
    }
</style>
