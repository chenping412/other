<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="供应商名称" width="300px">
                <template slot-scope="scope" v-if="scope.row.supplier_company">
                    <router-link v-if="scope.row.account_company_id" :to="'/partner/detail?id='+scope.row.account_company_id" target="_blank">
                        <span>{{scope.row.supplier_company.company_name | defaultStr}}</span>
                    </router-link>
                    <el-tag v-if="scope.row.is_default">推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="国家" width="140px">
                <template slot-scope="scope" v-if="scope.row.supplier_company">
                        <span>{{scope.row.supplier_company.country | country | defaultStr}}</span>
                        <isEuCountry :country="scope.row.supplier_company.country"></isEuCountry>
                </template>
            </el-table-column>
            <el-table-column label="常用付款方式">
                <template slot-scope="scope" v-if="scope.row.supplier_company">
                    <span>{{scope.row.supplier_company.payment_method | paymentMethod | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="查价方式">
                <template slot-scope="scope">
                    <span>{{scope.row.quick_quote | brandSupplierPriceType | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="产品系列" width="350px">
                <template  slot-scope="scope">
                    <brand-detail-supplier-edit-product-discount-series
                            :brandUid="queryId"
                            :brandSupplierRow="scope.row"
                            @update="init()">
                    </brand-detail-supplier-edit-product-discount-series>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="comment"></el-table-column>
            <el-table-column label="绑定日期">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time | zerosoCompanyTime | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="280px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="clickDelete(scope.row.id)">删除</el-button>
                    <el-button type="warning" size="mini" plain v-if="!scope.row.is_default" @click="setDefault(scope.row.id)">设为推荐</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增供应商</el-button>
            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="供应商操作" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="供应商名称" prop="account_company_id">
                    <SelectPartnerCompanyOnly
                            :disabled="!!addForm.id"
                            :partnerId.sync="addForm.account_company_id"
                            :partner="addForm.account_company"
                            :option="addForm.id ? [addForm.account_company] : null">
                    </SelectPartnerCompanyOnly>
                </el-form-item>
                <el-form-item label="查价方式"  prop="quick_quote">
                    <el-select v-model="addForm.quick_quote">
                        <el-option
                                v-for="item in $store.state.brandSupplierPriceType"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注"  prop="comment">
                    <el-input type="textarea" rows="6" v-model="addForm.comment"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveData()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import BrandDetailSupplierEditProductDiscountSeries from "./brand-detail-supplier-edit-product-discount-series";
    export default {
        components: {BrandDetailSupplierEditProductDiscountSeries},
        props: ['queryId'],
        data() {
            return {
                loading: false,

                listData: [],

                dialogShow: false,
                addForm: {},
                addFormRule: {
                    account_company_id: [
                        {required: true, message: '请选择供应商！'}
                    ],
                    quick_quote: [
                        {required: true, message: '请选择查价方式！'}
                    ],
                },

            }
        },
        watch: {
            queryId () {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/supplier/list',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },

            //新建
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    brand_uid: this.queryId,
                    account_company_id: '',
                    quick_quote: '',
                    comment: '',
                };
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = {
                    id:item.id,
                    comment: item.comment,
                    quick_quote: item.quick_quote,
                    account_company_id: item.account_company_id,
                    account_company: item.supplier_company,
                };
            },
            //保存
            clickSaveData() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.addForm.id ? self.$api.new_product_basic_product_brand + '/' + self.queryId + '/supplier/' + self.addForm.id : self.$api.new_product_basic_product_brand + '/' + self.queryId + '/supplier',
                    type: self.addForm.id ? 'PUT' : 'POST',
                    requestBody: true,
                    data: self.addForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.dialogShow = false;
                            self.getListData();
                        }
                    }
                });
            },





            //更新某些字段
            setDefault(id){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/supplier/' + id + '/recommend',
                    type: 'PUT',
                    requestBody: true,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.getListData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '操作失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },

            //删除
            clickDelete(id){
                let self = this;
                self.$confirm('是否删除该供应商？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/supplier/' + id,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '操作成功！',
                                            type: 'success'
                                        });
                                        self.getListData();
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '操作失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            },


        }
    }
</script>

<style lang="scss">

</style>
