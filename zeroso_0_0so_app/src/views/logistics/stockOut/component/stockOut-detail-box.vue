<template>
    <div class="stockOut-detail-box">
        <el-card class="margin-bottom-20">
            <h3 slot="header">箱</h3>
            <table style="width: 100%;text-align: left;">
                <thead>
                <th style="width: 20%;">托盘号</th>
                <th style="width: 80%;">箱号</th>
                </thead>
                <tbody>
                <template  v-if="detailForm.pallet_list">
                    <tr v-for="(pallet,$index) in detailForm.pallet_list" :key="$index">
                        <!--托盘箱-->
                        <td>
                            <span>{{pallet.pallet_name}}</span>
                            (<span>{{pallet.box_list ? pallet.box_list.length : ''}}</span>)
                        </td>
                        <td>
                        <el-tag size="medium" v-for="(box,boxIndex) in pallet.box_list" :key="boxIndex">
                            <a>{{box.box_name}}</a>
                            <el-tag type="warning" v-if="box.logistics_custom_type">{{box.logistics_custom_type}}</el-tag>
                        </el-tag>

                        </td>
                    </tr>
                </template>
                <tr v-if="detailForm.unpallet_box_list">
                    <!--散箱-->
                    <td>
                        <div> (<span>{{detailForm.unpallet_box_list.length}}</span>)</div>
                    </td>
                    <td>
                        <el-tag size="medium" v-for="(box,$index) in detailForm.unpallet_box_list" :key="$index">
                            <a>{{box.box_name}}</a>
                            <el-tag type="warning" v-if="box.logistics_custom_type">{{box.logistics_custom_type}}</el-tag>
                        </el-tag>

                    </td>
                </tr>
                </tbody>

            </table>
        </el-card>

        <el-card class="margin-bottom-20">
            <h3 slot="header">产品明细</h3>

            <el-table :data="detailForm.box_product_list" border>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="箱号" prop="outgoing_transfer_name" width="120px">
                    <template slot-scope="scope">
                        <router-link class="blue" :to="'/logistics/box/order/detail?id=' + scope.row.id">{{scope.row.box_name}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column label="销售公司" width="250px">
                    <template slot-scope="scope" v-if="scope.row.sale_company">
                        <p>{{scope.row.sale_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="客户" width="250px">
                    <template slot-scope="scope" v-if="scope.row.customer_company">
                        <p>{{scope.row.customer_company.company_name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <table class="table">
                            <thead>
                            <tr>
                                <th>品牌</th>
                                <th>型号</th>
                                <th>订货号</th>
                                <th>数量</th>
                                <th>单价</th>
                                <th>海关信息(状态)</th>
                            </tr>
                            </thead>
                        </table>
                    </template>
                    <template slot-scope="scope" v-if="scope.row.box_lines">
                        <table class="table">
                            <tbody>
                            <tr v-for="(line,lineIndex) in scope.row.box_lines" :key="lineIndex">
                                <td>
                                    <span v-if="line.product_info && line.product_info.brand">
                                        {{line.product_info.brand.name|defaultStr}}
                                    </span>
                                </td>
                                <td>
                                    <span v-if="line.product_info">{{line.product_info.product_name|defaultStr}}</span>
                                </td>
                                <td>
                                    <span v-if="line.product_info">{{line.product_info.product_order_no|defaultStr}}</span>
                                </td>
                                <td>
                                    <span>{{line.quantity}}</span>
                                </td>
                                <td>
                                    <span>{{line.price_unit | isoCurrency(scope.row.currency)}}</span>
                                </td>
                                <td>
                                    <router-link
                                            class="blue"
                                            target="_blank"
                                            v-if="line.product_info"
                                            :to="'/product/product/detail?id='+line.product_info.id">
                                        {{line.product_info.is_customs_info_complete?'完整':'不完整'}}
                                    </router-link>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    export default {
        props: ['detailForm'],
        data() {
            return {


            }
        },
        created() {

        },
        methods: {

        },
    }
</script>

<style lang="scss">
    .stockOut-detail-box{
        .table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
            th, td {
                width: 16.6666%;
                text-align: left;
                padding: 4px 10px;
            }

            th {
                border: none;
            }

            td {
                border: 1px solid #dddddd;
            }
        }
    }

</style>