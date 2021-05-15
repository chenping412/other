<template>
    <div class="flex-box-column stockIn-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">库存 / 托盘列表</el-breadcrumb-item>
                    <el-breadcrumb-item>托盘详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20">{{detailForm.pallet_name}}</span>
                        <el-tag v-if="detailForm.state">
                            {{detailForm.state|logisticsV4PalletState}}
                        </el-tag>
                        <el-tag type="warning" effect="dark" v-if="detailForm.logistics_custom_type">
                            {{detailForm.logistics_custom_type}}
                        </el-tag>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <el-button type="warning" v-if="detailForm.state === 'in_stock'" @click="action('pack')">标记为已封</el-button>
                            <el-button type="warning" v-if="detailForm.state === 'archive'" @click="action('unpack')">标记为未封</el-button>

                            <PrintPalletTag v-if="detailForm.id && detailForm.state !== 'in_stock'" :palletData="detailForm"></PrintPalletTag>

                        </div>
                        <DetailPagination apiKey="logistics_pallets" :listApi="this.$api.order_pallets + '/search'"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="180px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="8">

                            <el-form-item label="所在仓：">
                                <span class="form-border-bottom">
                                    {{(detailForm.belong_to_company?detailForm.belong_to_company.company_name:null) | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="出库单：">
                                <span class="form-border-bottom">
                                    <router-link
                                            class="blue"
                                            v-if="detailForm.internal_transfer"
                                            :to="'/logistics/stockOut/detail?id='+detailForm.internal_transfer.id">
                                        {{detailForm.internal_transfer.name}}
                                    </router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="长*宽*高（mm）：">
                                <span class="form-border-bottom">
                                    {{(detailForm.length || '---') + ' * ' + (detailForm.width || '---') + ' * ' + (detailForm.height || '---')}}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发货至：">
                                <span class="form-border-bottom">
                                    {{(detailForm.send_to_company ? detailForm.send_to_company.company_name : null) | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="毛重（kg）：">
                                <span class="form-border-bottom">
                                    {{detailForm.weight | defaultStr}}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>


            <el-card>
                <h3 slot="header">箱号</h3>
                <div class="padding-bottom-10" v-if="detailForm.box_list">
                    <template v-for="(box,$index) in detailForm.box_list">
                        <el-popover placement="bottom-start" trigger="hover" width="500" :key="$index">
                            <div slot="reference" class="inline-block cursor-pointer margin-5">
                                <router-link class="blue" :to="'/logistics/box/order/detail?id='+box.id">
                                    <el-tag size="medium">
                                        <span style="display:inline-block;min-width: 120px;text-align: center;">{{box.box_name}}</span>
                                    </el-tag>
                                </router-link>
                            </div>
                            <div style="line-height: 2.5em;">
                                <el-row :gutter="30">
                                    <el-col :span="12">
                                        <span>箱号：</span>
                                        <router-link class="blue" :to="'/logistics/box/order/detail?id='+box.id">
                                            {{box.box_name}}
                                        </router-link>
                                    </el-col>
                                    <el-col :span="12">
                                        <span>品牌：</span>
                                        <router-link target="_blank" class="blue"
                                                     v-if="box.brand && box.brand.id"
                                                     :to="'/product/brand/detail?id='+box.brand.id">
                                            {{box.brand.name}}
                                        </router-link>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <span>长*宽*高（mm）：</span>
                                        <span>{{(box.length || '---') + ' * ' + (box.width || '---') + ' * ' + (box.height || '---')}}</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <span>毛重（kg）：</span>
                                        <span>{{box.weight | defaultStr}}</span>
                                    </el-col>
                                </el-row>
                                <table v-if="box.box_lines" style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th>型号</th>
                                        <th>订货号</th>
                                        <th>数量</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item,$index) in box.box_lines" :key="$index">
                                        <td>
                                            {{item.product_info.product_name | defaultStr}}
                                        </td>
                                        <td>
                                            {{item.product_info.product_order_no | defaultStr}}
                                        </td>
                                        <td>
                                            {{item.quantity | defaultStr}}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                        </el-popover>


                    </template>

                </div>

                <div class="padding-10">
                    <pallets-add title="编辑" class="margin-right-20" v-if="detailForm.state==='in_stock'" :palletsDetail="detailForm" @update="init"> </pallets-add>
                    <el-button type="danger" v-if="detailForm.state==='in_stock'" @click="deletePallet()">删除</el-button>
                </div>

            </el-card>


        </div>


    </div>
</template>

<script>

    import PalletsAdd from "./pallets-add";
    export default {
        components: {PalletsAdd},
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {

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
                    url: self.$api.order_pallets + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            self.detailForm.customTag = self.$store.state.currentUser.codes[self.detailForm.belong_to_company.account_company_id] + '-' + (self.detailForm.logistics_custom_type && self.detailForm.logistics_custom_type.toUpperCase())
                        }
                    }
                })
            },

            action(name) {
                let self=this;
                if (name === 'pack' && !(self.detailForm.length && self.detailForm.width && self.detailForm.height && self.detailForm.weight && self.detailForm.box_list.length)) {
                    self.$message({
                        showClose: true,
                        message: '只有在填写，长宽高、重量、放入箱子后才能封箱！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.order_pallets + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody:true,
                    data:{
                        pallet_id: self.queryId,
                        name: name
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.getDetailData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '操作失败！',
                                type: 'error'
                            });
                        }
                    }
                })
            },

            deletePallet() {
                let self = this;
                self.$confirm('确定删除吗？该操作不可逆', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.order_pallets + '/' + self.queryId,
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
                                            path: self.parentQuery ? 'list?'+self.parentQuery : 'list',
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
            }


        }
    }
</script>

<style lang="scss">

</style>
