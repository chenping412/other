<template>
    <div>
        <el-card class="margin-bottom-20">
            <h3 slot="header">地址</h3>
            <el-form label-width="180px">
                <el-row>
                    <el-col :span="10">
                        <el-form-item>
                            <el-tag type="warning" effect="dark" slot="label">销售公司</el-tag>
                            <el-button type="primary" v-if="detailForm.sale_company && detailForm.state !== 'done'" @click="clickEdit(detailForm.sale_company,true)">编辑</el-button>
                        </el-form-item>
                        <el-form-item label="销售公司：">
                            <span class="form-border-bottom">
                                <router-link class="blue"
                                             v-if="detailForm.sale_company"
                                             :to="'/partner/detail?id='+detailForm.sale_company.account_company_id">
                                    {{detailForm.sale_company.company_name}}
                                </router-link>
                            </span>
                        </el-form-item>
                        <el-form-item label="寄件人：">
                            <span class="form-border-bottom">
                                {{(detailForm.from_address?detailForm.from_address.name:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            <span class="form-border-bottom">
                                {{(detailForm.from_address?detailForm.from_address.phone:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="邮编：">
                            <span class="form-border-bottom">
                                {{(detailForm.from_address?detailForm.from_address.zip:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="详细地址：">
                            <span class="form-border-bottom">
                                <span v-if="detailForm.from_address">
                                    <span v-text="detailForm.from_address.province?detailForm.from_address.province+',':''"></span>
                                    <span v-text="detailForm.from_address.city?detailForm.from_address.city+',':''"></span>
                                    <span v-text="detailForm.from_address.district?detailForm.from_address.district+',':''"></span>
                                    <span v-text="detailForm.from_address.street?detailForm.from_address.street:''"></span>
                                </span>
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-tag type="warning" effect="dark" slot="label">收货公司</el-tag>
                            <el-button type="primary" v-if="detailForm.send_to_company && detailForm.state !== 'done'" @click="clickEdit(detailForm.send_to_company,false)">编辑</el-button>
                        </el-form-item>
                        <el-form-item label="收货公司：">
                            <span class="form-border-bottom">
                                <router-link class="blue"
                                             v-if="detailForm.send_to_company"
                                             :to="'/partner/detail?id='+detailForm.send_to_company.account_company_id">
                                    {{detailForm.send_to_company.company_name}}
                                </router-link>
                            </span>
                        </el-form-item>
                        <el-form-item label="收件人：">
                            <span class="form-border-bottom">
                                {{(detailForm.to_address?detailForm.to_address.name:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="联系方式：">
                            <span class="form-border-bottom">
                                {{(detailForm.to_address?detailForm.to_address.phone:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="邮编：">
                            <span class="form-border-bottom">
                                {{(detailForm.to_address?detailForm.to_address.zip:null) | defaultStr}}
                            </span>
                        </el-form-item>
                        <el-form-item label="详细地址：">
                            <span class="form-border-bottom">
                                <span v-if="detailForm.to_address">
                                    <span v-text="detailForm.to_address.province?detailForm.to_address.province+',':''"></span>
                                    <span v-text="detailForm.to_address.city?detailForm.to_address.city+',':''"></span>
                                    <span v-text="detailForm.to_address.district?detailForm.to_address.district+',':''"></span>
                                    <span v-text="detailForm.to_address.street?detailForm.to_address.street:''"></span>
                                </span>
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-dialog title="地址选择" :visible.sync="dialogShow" width="1000px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-table :data="addressList" highlight-current-row @current-change="handleCurrentChange" height="550px">
                <el-table-column>
                    <template v-slot:header>{{editCompanyIsSaleCompany?'销售公司':'收货公司'}}</template>
                    <template>{{editCompany.company_name}}</template>
                </el-table-column>
                <el-table-column>
                    <template v-slot:header>{{editCompanyIsSaleCompany?'寄件人':'收件人'}}</template>
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="联系方式" prop="phone"></el-table-column>
                <el-table-column label="邮编" prop="zip"></el-table-column>
                <el-table-column label="地址" width="300px">
                    <template slot-scope="scope">
                        <span v-text="scope.row.province?scope.row.province+',':''"></span>
                        <span v-text="scope.row.city?scope.row.city+',':''"></span>
                        <span v-text="scope.row.district?scope.row.district+',':''"></span>
                        <span v-text="scope.row.street?scope.row.street:''"></span>
                    </template>
                </el-table-column>
                <el-table-column label="默认标记">
                    <template slot-scope="scope">
                        <el-tag type="info" v-if="scope.row.is_primary_company_address">公司</el-tag>
                        <el-tag type="primary" v-if="scope.row.is_primary_invoice_address">发票</el-tag>
                        <el-tag type="danger" v-if="scope.row.is_primary_shipment_address">收货</el-tag>
                    </template>
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="!selectAddressId" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['detailForm'],
        data() {
            return {
                loading: false,
                dialogShow: false,


                editCompanyIsSaleCompany:true,
                editCompany: {},
                addressList: [],
                selectAddressId: null,

            }
        },
        created() {

        },
        methods: {
            clickEdit(company,editCompanyIsSaleCompany) {
                this.editCompany = company;
                this.editCompanyIsSaleCompany = editCompanyIsSaleCompany;
                this.dialogShow = true;
                this.getSelectBoxList();
            },
            //获取不发货的箱
            getSelectBoxList() {
                let self = this;
                self.addressList = [];
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.editCompany.account_company_id + '/other_partner_addresses',
                    type: 'GET',
                    data: {
                        sale_company_id: self.detailForm.sale_company_id
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.addressList = data.msg;
                        }
                    }
                })
            },
            handleCurrentChange(val) {
                this.selectAddressId = val ? val.id : null;
            },

            clickSaveDate() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_outgoing_transfers + '/' + self.detailForm.id + '/address',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        from_address_id: self.editCompanyIsSaleCompany ? self.selectAddressId : undefined,
                        to_address_id: !self.editCompanyIsSaleCompany ? self.selectAddressId : undefined,
                        outgoing_transfer_id: self.detailForm.id,
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
                            self.$emit('update')
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


        },
    }
</script>

<style lang="scss" scoped>

</style>