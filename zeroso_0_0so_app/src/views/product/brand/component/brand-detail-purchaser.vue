<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="采购公司名称">
                <template slot-scope="scope">
                    <router-link v-if="scope.row.account_company" :to="'/partner/detail?id='+scope.row.account_company.account_company_id" target="_blank">
                        <span>{{scope.row.account_company.company_name}}</span>
                        <span v-if="scope.row.account_user && scope.row.account_user.name">，{{scope.row.account_user.name}}</span>
                    </router-link>
                    <el-tag v-if="scope.row.is_default">推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="scope" v-if="scope.row.account_company">
                    <span>{{scope.row.account_company.comment | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="个人备注">
                <template slot-scope="scope" v-if="scope.row.account_user">
                    <span>{{scope.row.account_user.comment | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column width="280px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="clickDelete(scope.row.id)">删除</el-button>
                    <el-button type="warning" size="mini" plain v-if="!scope.row.is_default" @click="setDefault(scope.row.id)">设为推荐</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增采购公司</el-button>
        </div>

        <el-dialog title="采购公司操作" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="采购公司名称" prop="customerId">
                    <SelectPartner
                            :partnerId.sync="addForm.account_user_id"
                            :companyId.sync="addForm.account_company_id"
                            :partner="addForm"
                            :option="addForm.relation_id ? [addForm] : null">
                    </SelectPartner>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,

                listData: [],

                dialogShow: false,
                addForm: {},
                addFormRule: {
                    company: [
                        {required: true, message: '请输入采购公司！'}
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
                    url: self.$api.partner_relation_brands_v2 + '/' + self.queryId + '/purchaser',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        }
                    }
                })
            },

            //新建地址
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    brand_id: this.queryId,
                    account_company_id: '',
                    account_user_id: '',
                };
            },
            //编辑地址
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = {
                    relation_id:item.id,
                    account_company_id: item.account_company.account_company_id,
                    company_name: item.account_company.company_name,
                    account_user_id: item.account_user ? item.account_user.account_user_id : null,
                    name: item.account_user ? item.account_user.name : null,
                };
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                console.log(this.addForm)
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.relation_id ? self.$api.partner_brands_v2 + '/' + self.addForm.relation_id : self.$api.partner_relation_brands_v2 + '/' + self.queryId + '/purchaser',
                            type: self.addForm.relation_id ? 'PUT' : 'POST',
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
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },





            //更新某些字段
            setDefault(id){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_brands_v2 + '/' + id + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        relation_id:id,
                        name: "set_default"
                    },
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
                self.$confirm('是否删除该采购公司？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.partner_relation_v2 + '/' + id,
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
