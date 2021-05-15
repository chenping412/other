<template>
    <div class="partner-detail-brands clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column prop="name" label="品牌">
                <template slot-scope="scope">
                    <span v-if="scope.row.brand">{{scope.row.brand.name}}</span>
                    <el-tag v-if="scope.row.is_default">推荐</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="品牌备注">
                <template slot-scope="scope">
                    <span v-if="scope.row.brand">{{scope.row.brand.comment}}</span>
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
            <el-button type="primary" @click="clickAdd()">新增品牌</el-button>
        </div>

        <el-dialog title="品牌操作" :visible.sync="dialogShow" width="700px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                    <el-form-item label="品牌" prop="brand_id">
                        <SelectBrand :brandId.sync="addForm.brand_id" :brand="addForm.id ? addForm : null" :option="addForm.id ? [addForm] : null"></SelectBrand>
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
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
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
                    url: self.$api.partner_relation_companies_v2 + '/' + self.queryId + '/brands',
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
                    account_company_id: this.queryId,
                    brand_id:'',
                    name:'',
                }
            },
            //编辑地址
            clickEdit(item) {
                this.dialogShow = true;
                if(item.brand){
                    this.addForm = {
                        id:item.id,
                        relation_id:item.id,
                        brand_id:item.brand.id,
                        name:item.brand.name,
                    };
                }
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                console.log(this.addForm)
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.partner_brands_v2 + '/' + self.addForm.id : self.$api.partner_relation_companies_v2 + '/' + self.queryId + '/brands',
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
                self.$confirm('是否解除与该品牌关联？', '提示', {
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
    .partner-detail-brands {
        padding-bottom: 100px;
    }

</style>
