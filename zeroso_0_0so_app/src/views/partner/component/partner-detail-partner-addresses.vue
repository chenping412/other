<template>
    <div class="partner-detail-partner-addresses clearfix" v-loading="loading">

        <el-table :data="listData" :show-header="false" border>
            <el-table-column>
                <template slot-scope="scope">
                    <el-form class="el-form-margin-small" label-width="110px" >
                        <el-form-item label="国家：">{{scope.row.country | country}}</el-form-item>
                        <el-form-item label="地区：">{{scope.row.province}}，{{scope.row.city}}，{{scope.row.district}}</el-form-item>
                        <el-form-item label="详细地址：">{{scope.row.street | defaultStr}}</el-form-item>
                    </el-form>
                    <p>
                        <i class="blue el-icon el-icon-view" v-if="scope.row.visibility ==='public'"></i>
                        <i class="lightblue el-icon el-icon-s-custom" v-if="scope.row.has_linked_login_account"></i>
                        <i class="yellow el-icon el-icon-s-opportunity" v-if="scope.row.is_self_maintain"></i>
                    </p>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-form class="el-form-margin-small" label-width="110px" >
                        <el-form-item label="联系人：">{{scope.row.name | defaultStr}}</el-form-item>
                        <el-form-item label="联系方式：">{{scope.row.phone | defaultStr}}</el-form-item>
                        <el-form-item label="邮编：">{{scope.row.zip | defaultStr}}</el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column width="150px">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.is_primary_company_address">默认公司地址</el-tag>
                    <el-tag type="warning" v-if="scope.row.is_primary_shipment_address">默认收货地址</el-tag>
                    <el-tag type="danger" v-if="scope.row.is_primary_invoice_address">默认收发票地址</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="200px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.is_active" @click="clickDelete(scope.row.id,'set_deleted')">删除地址</el-button>
                    <el-button size="mini" v-if="!scope.row.is_active" @click="updateDelete(scope.row.id,'set_active')">恢复地址</el-button>
                    <el-button type="success" size="mini" plain v-if="!scope.row.is_primary_company_address" @click="updateKey(scope.row,'is_primary_company_address',true)">设为默认公司地址</el-button>
                    <el-button type="warning" size="mini" plain v-if="!scope.row.is_primary_shipment_address" @click="updateKey(scope.row,'is_primary_shipment_address',true)">设为默认收货地址</el-button>
                    <el-button type="danger" size="mini" plain v-if="!scope.row.is_primary_invoice_address" @click="updateKey(scope.row,'is_primary_invoice_address',true)">设为默认收发票地址</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增公司地址</el-button>
        </div>


        <el-dialog title="地址操作" :visible.sync="dialogShow" width="700px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form class="clearfix" :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                    <el-form-item label="联系人" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="addForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="国家" prop="country">
                        <el-select v-model="addForm.country">
                            <el-option
                                    v-for="item in $store.state.country"
                                    :key="item.code2"
                                    :value="item.code2"
                                    :label="item.chinese_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="省">
                        <el-input v-model="addForm.province"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input v-model="addForm.city"></el-input>
                    </el-form-item>
                    <el-form-item label="区">
                        <el-input v-model="addForm.district"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="street">
                        <el-input type="textarea" v-model="addForm.street"></el-input>
                    </el-form-item>
                    <el-form-item label="邮编">
                        <el-input v-model="addForm.zip"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <p><el-checkbox v-model="addForm.is_primary_company_address">默认公司地址</el-checkbox></p>
                        <p><el-checkbox v-model="addForm.is_primary_shipment_address">默认收货地址</el-checkbox></p>
                        <p><el-checkbox v-model="addForm.is_primary_invoice_address">默认收发票地址</el-checkbox></p>
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
                    phone: [
                        {required: true, message: '请输入联系方式！'}
                    ],
                    country: [
                        {required: true, message: '请选择国家！'}
                    ],
                    street: [
                        {required: true, message: '请输入详细地址！'}
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
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_addresses',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },


            //新建地址
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    type: "company",
                    partnerId: this.queryId,
                }
            },
            //编辑地址
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(item));
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                console.log(this.addForm)
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_addresses' + (self.addForm.id ? '/' + self.addForm.id : ''),
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
            updateKey(item,key,value){
                let self = this;
                let updateForm = JSON.parse(JSON.stringify(item));
                updateForm[key] = value;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_addresses/' + updateForm.id,
                    type: 'PUT',
                    requestBody: true,
                    data: updateForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.dialogShow = false;
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

            //删除和恢复删除
            clickDelete(id,name){
                let self = this;
                self.$confirm('确认删除该地址吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.updateDelete(id,name)
                        }
                    }
                })
            },
            updateDelete(id,name){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_addresses/' + id + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        account_company_id: self.queryId,
                        account_address_id: id,
                        name: name,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.dialogShow = false;
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


        }
    }
</script>

<style lang="scss">
    .partner-detail-partner-addresses {
        padding-bottom: 100px;
    }

</style>
