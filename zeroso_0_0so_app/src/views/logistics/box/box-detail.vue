<template>
    <div class="flex-box-column stockIn-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">库存 / {{boxState==='order'?'订单箱':'库存箱'}}</el-breadcrumb-item>
                    <el-breadcrumb-item>箱详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20">{{detailForm.box_name}}</span>
                        <el-tag v-if="detailForm.state">
                            {{detailForm.state|logisticsV4BoxState}}
                        </el-tag>
                        <el-tag type="warning" effect="dark" v-if="detailForm.box_type">
                            {{detailForm.box_type|logisticsV4BoxType}}
                        </el-tag>
                        <el-tag type="warning" effect="dark" v-if="detailForm.logistics_custom_type">
                            {{detailForm.logistics_custom_type}}
                        </el-tag>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <el-button
                                    type="danger"
                                    class="margin-right-10"
                                    v-if="detailForm.box_type==='stock' && $store.state.permissionsMap['StockBoxManageNeed']"
                                    @click="deleteStockBox">
                                删除库存箱
                            </el-button>

                            <box-detail-move
                                    class="margin-right-10"
                                    v-if="detailForm.id && $store.state.permissionsMap['AdminNeed']"
                                    :detailForm="detailForm"
                                    @update="init">
                            </box-detail-move>

                            <PrintBoxTag class="margin-right-10" v-if="detailForm.id" :boxData="detailForm"></PrintBoxTag>

                            <box-add :boxDetail="detailForm" title="编辑" @update="init" v-if="$store.state.permissionsMap['StockBoxManageNeed'] || detailForm.box_type==='order'"></box-add>

                        </div>
                        <DetailPagination :apiKey="filterKey" :listApi="listApi"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="120px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="8">
                            <el-form-item label="关联订单">
                                <span class="form-border-bottom">
                                    <router-link class="blue"
                                                 v-if="detailForm.order_id"
                                                 :to="'/order/order/all/detail?id='+detailForm.order_id">
                                        {{detailForm.order_name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="所在托盘">
                                <span class="form-border-bottom">
                                    <router-link
                                            class="blue"
                                            v-if="detailForm.pallet"
                                            :to="'/logistics/pallets/detail?id='+detailForm.pallet.id">
                                        {{detailForm.pallet.pallet_name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="品牌">
                                <span class="form-border-bottom">
                                    <router-link class="blue" v-if="detailForm.brand && detailForm.brand.id"
                                                 :to="'/product/brand/detail?id='+detailForm.brand.id">
                                        {{detailForm.brand.name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="出库单">
                                <span class="form-border-bottom">
                                    <router-link
                                            class="blue"
                                            v-if="detailForm.transfer_order"
                                            :to="'/logistics/stockOut/detail?id='+detailForm.transfer_order.id">
                                        {{detailForm.transfer_order.name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所在仓">
                                <span class="form-border-bottom">
                                    <el-popover placement="bottom-start">
                                        <div slot="reference" class="inline-block cursor-pointer">
                                            <div v-if="detailForm.belong_to_company">
                                                <el-tag>
                                                {{detailForm.belong_to_company.company_name | mainCompanyAbbreviationCode(detailForm.belong_to_company.account_company_id)}}
                                                </el-tag>
                                                <span class="margin-left-10">
                                                    {{detailForm.belong_to_company.state_time | zerosoTimeFormat}}
                                                </span>
                                                <i class="el-icon-caret-bottom" v-if="detailForm.belong_to_company_times && detailForm.belong_to_company_times.length>0"></i>
                                            </div>
                                        </div>
                                        <table v-if="detailForm.belong_to_company_times && detailForm.belong_to_company_times.length>0">
                                            <tbody>
                                            <tr v-for="(item,$index) in detailForm.belong_to_company_times" :key="$index">
                                                <td><el-tag>{{item.belong_to_company.company_name | mainCompanyAbbreviationCode(item.belong_to_company.account_company_id)}}</el-tag></td>
                                                <td><span class="margin-left-10">{{item.state_time | zerosoTimeFormat}}</span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </el-popover>
                                </span>
                            </el-form-item>
                            <el-form-item label="销售公司">
                                <span class="form-border-bottom">
                                    {{detailForm.sale_company ? detailForm.sale_company.company_name : null}}
                                </span>
                            </el-form-item>
                            <el-form-item label="毛重（kg）">
                                <span class="form-border-bottom">
                                    {{detailForm.weight | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="客户">
                                <span class="form-border-bottom">
                                    <router-link
                                            class="blue"
                                            v-if="detailForm.customer_company"
                                            :to="'/partner/detail?id='+detailForm.customer_company.account_company_id">
                                        {{detailForm.customer_company.company_name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-table :data="detailForm.box_lines" v-if="detailForm.box_lines" border>
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="型号">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_info.id">
                                    {{scope.row.product_info.product_name}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="订货号">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_info.id">
                                    {{scope.row.product_info.product_order_no}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="净重(kg)">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                {{scope.row.product_info.net_weight}}
                            </template>
                        </el-table-column>
                        <el-table-column label="毛重(kg)">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                {{scope.row.product_info.gross_weight}}
                            </template>
                        </el-table-column>
                        <el-table-column label="海关信息">
                            <template slot-scope="scope" v-if="scope.row.product_info">
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_info.id">
                                    {{scope.row.product_info.is_customs_info_complete ? '完整' : '不完整'}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" prop="quantity"></el-table-column>
                    </el-table>
                </el-form>
            </div>

        </div>





    </div>
</template>

<script>

    import BoxDetailMove from "./box-detail-move";
    import BoxAdd from "./box-add";
    export default {
        components: {BoxAdd, BoxDetailMove},
        data() {
            return {
                queryId: '',
                isEdit: false,

                parentQuery: '',
                listApi: null,
                filterKey:null,
                boxState:null,


                detailForm: {},
                detailFormRule: {
                    delivery_mail_no: [
                        {required: true, message: '请输入运单号/trackId！'}
                    ],
                },


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
                this.boxState = this.$route.params.boxState;
                this.listApi = this.$api.order_boxes + '/search/' + this.boxState;
                this.filterKey = 'logistics_boxes_' + this.boxState;


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
                self.loading = true;
                self.$http({
                    url: self.$api.order_boxes + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            let detailForm = data.msg;
                            if(detailForm.belong_to_company_times && detailForm.belong_to_company_times.length>0){
                                detailForm.belong_to_company_times.sort(function(a,b) {
                                    return b.state_time>=a.state_time ? 1 : -1;
                                })
                                detailForm.belong_to_company_times.forEach((item)=>{
                                    if(item.belong_to_company.account_company_id === detailForm.belong_to_company.account_company_id){
                                        detailForm.belong_to_company.state_time = item.state_time;
                                    }
                                })
                            }
                            self.detailForm = detailForm;
                            self.detailForm.customTag = self.$store.state.currentUser.codes[self.detailForm.belong_to_company.account_company_id] + '-' + (self.detailForm.logistics_custom_type ? self.detailForm.logistics_custom_type.toUpperCase() : '')
                        }
                    }
                })
            },


            //删除库存箱
            deleteStockBox(){
                let self = this;
                self.$confirm('确定删除吗？该操作不可逆', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_boxes + '/' + self.queryId,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.err_code.length === 0 && data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '删除成功！',
                                            type: 'success'
                                        });
                                        self.$router.push({
                                            path: 'list',
                                        });
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '删除失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">

</style>
