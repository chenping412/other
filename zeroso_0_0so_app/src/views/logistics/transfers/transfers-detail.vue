<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">库存 / 现货调拨</el-breadcrumb-item>
                    <el-breadcrumb-item>调拨单详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20" v-if="detailForm.name">
                            订单号：
                            <router-link class="blue" :to="'/order/order/all/detail?id='+detailForm.id">{{detailForm.name}}</router-link>
                        </span>
                        <el-tag v-if="detailForm.logistics_state">
                            {{detailForm.logistics_state|logisticsV4RequestState}}
                        </el-tag>
                        <el-tag type="warning" effect="dark" v-if="detailForm.logistics_custom_type">
                            {{detailForm.logistics_custom_type}}
                        </el-tag>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <el-button
                                    type="primary"
                                    :disabled="!hasWaitPackBox || detailForm.status == 'canceled' || detailForm.status == 'force_canceled'"
                                    @click="preBoxedUp">
                                装箱
                            </el-button>
                        </div>
                        <DetailPagination apiKey="logistics_request_transfers"
                                          :listApi="$api.order_request_transfers + '/search'"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="150px">
                    <el-row class="border-bottom padding-bottom-20 margin-bottom-20" :gutter="30">
                        <el-col :span="6">
                            <el-form-item label="品牌">
                                <span class="form-border-bottom">
                                    <router-link target="_blank" class="blue"
                                                 v-if="detailForm.brand && detailForm.brand.id"
                                                 :to="'/product/brand/detail?id='+detailForm.brand.id">
                                        {{detailForm.brand.name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span class="form-border-bottom">{{detailForm.create_time | zerosoCompanyTime}}</span>
                            </el-form-item>
                        </el-col>
                        <div class="right">
                            <order-detail-status-box isLogistics="true" :queryId="queryId" :orderData="detailForm"></order-detail-status-box>
                        </div>
                    </el-row>

                    <el-table :data="detailForm.order_products" v-if="detailForm.order_products" border>
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="型号">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                <router-link class="blue"
                                             :to="'/product/product/detail?id='+scope.row.product_info.id">
                                    {{scope.row.product_info.product_name}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="订货号">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                <router-link class="blue"
                                             :to="'/product/product/detail?id='+scope.row.product_info.id">
                                    {{scope.row.product_info.product_order_no}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="qty"></el-table-column>
                        <el-table-column label="应调" prop="should_request"></el-table-column>
                        <el-table-column label="待装箱" prop="wait_pack_box"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                               <transfers-detail-add-pre
                                       v-if="scope.row.should_request != 0 && scope.row.id"
                                       :transferId="queryId"
                                       :belongToCompanyId="detailForm.route_map && detailForm.route_map[0] ? detailForm.route_map[0].account_company_id : null"
                                       :transferLine="scope.row"
                                       @update="init">
                               </transfers-detail-add-pre>
                            </template>
                        </el-table-column>
                    </el-table>
                    <table class="margin-top-10" style="width: 100%;">
                        <tbody>
                        <tr v-for="(preLine,$index) in detailForm.pre_request_tansfer_line_list" :key="$index">
                            <td width="70%">
                                从
                                <span class="margin-left-10 margin-right-10 blue">{{preLine.box_line.box_name}}</span>
                                调拨了
                                <span class="margin-left-10 margin-right-10 blue">{{preLine.box_line.product_info.product_name}}</span>
                                <span class="margin-left-10 margin-right-10 blue">{{preLine.box_line.product_info.product_order_no}}</span>
                                共
                                <span class="margin-left-10 margin-right-10 blue">{{preLine.request_quantity}}</span> 件
                            </td>
                            <td width="15%">
                                <span>{{preLine.create_time | zerosoCompanyTime}}</span>
                            </td>
                            <td width="15%">
                                <el-tag v-if="preLine.status !== 'draft'"
                                        :type="preLine.status === 'done' ? 'danger' : null">
                                    {{preLine.status|logisticsV4TransferPreStatus}}
                                </el-tag>
                                <el-button v-if="preLine.status === 'draft'" @click="deletePreTransferLine(preLine.id)">
                                    撤 销
                                </el-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form>
            </div>


            <el-card class="margin-bottom-20" v-if="detailForm.package_boxes">
                <el-table :data="detailForm.package_boxes" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="箱 号">
                        <template slot-scope="scope" v-if="scope.row.box">
                            <router-link class="blue" target="_blank" :to="'/logistics/box/order/detail?id='+scope.row.box.id">
                                {{scope.row.box.box_name}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="所在仓库">
                        <template slot-scope="scope" v-if="scope.row.box && scope.row.box.belong_to_company">
                            {{scope.row.box.belong_to_company.company_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="销售公司">
                        <template slot-scope="scope" v-if="scope.row.box && scope.row.box.sale_company">
                            {{scope.row.box.sale_company.company_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <PrintBoxTag v-if="scope.row.box" :boxData="scope.row.box"></PrintBoxTag>

                            <el-button type="primary" size="mini" v-if="!scope.row.box" @click="updatePackedBoxes(scope.row.id,'confirm')">封箱</el-button>
                            <el-button size="mini" v-if="!scope.row.box" @click="updatePackedBoxes(scope.row.id, 'cancel')">取消</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.create_time|zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

        </div>
    </div>
</template>

<script>

    import OrderDetailStatusBox from "../../order/component/order-detail-status-box";
    import TransfersDetailAddPre from "./transfers-detail-add-pre";

    export default {
        components: {TransfersDetailAddPre, OrderDetailStatusBox},
        data() {
            return {
                queryId: '',
                parentQuery: '',

                detailForm: {},
                detailFormRule: {},

                hasWaitPackBox: false,


                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                }
            },
            getDetailData() {
                let self = this;
                self.hasWaitPackBox = false;
                self.loading = true;
                self.$http({
                    url: self.$api.order_request_transfers + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;

                            if (self.detailForm.order_products) {
                                self.detailForm.order_products.forEach(function (product) {
                                    if (product.wait_pack_box > 0) {
                                        self.hasWaitPackBox = true;
                                    }
                                });
                            }
                        }
                    }
                })
            },


            deletePreTransferLine(lineId) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_request_transfers + '/' + self.queryId + '/pre_request_lines/' + lineId,
                    type: 'DELETE',
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                })
            },

            preBoxedUp() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_request_transfers + '/' + self.queryId + '/packed_boxes',
                    type: 'POST',
                    data:{
                        request_transfer_id:self.queryId
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                })
            },

            //封箱和取消
            updatePackedBoxes(rowId, type) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_request_transfers + '/' + self.queryId + '/packed_boxes/'+rowId,
                    type: 'PUT',
                    data:{
                        request_transfer_id: self.queryId,
                        packed_box_id: rowId,
                        action: type,
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                })
            }

        }
    }
</script>

<style lang="scss">

</style>
