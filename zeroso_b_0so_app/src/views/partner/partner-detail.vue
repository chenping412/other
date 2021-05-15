<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">合作伙伴</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '伙伴详情' : '新增伙伴'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-10" :class="{'delete':detailForm.state=== 'no_such_company' || detailForm.state=== 'not_recommend'}">{{detailForm.name}}</span>
                        <CompanyType class="margin-right-10" :type="detailForm.company_type"></CompanyType>
                        <el-tag v-if="detailForm.customer_type">{{detailForm.customer_type}}</el-tag>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
<!--                                    <el-button type="warning" @click="clickManageEdit()">管理员编辑</el-button>-->
<!--                                    <el-button type="warning" @click="clickCompanyLeverEdit()">编辑公司等级</el-button>-->
                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                    <el-button type="danger" @click="clickDelete()">删除</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination apiKey="partner_all" :listApi="$api.partner_companies_search"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="125px">
                    <el-row :gutter="20">
                        <el-col :span="7">
                            <el-form-item label="公司类型：">
                                <span class="form-border-bottom">{{detailForm.company_type | companyType | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="合伙人等级：">
                                <el-tag type="warning" effect="dark" v-if="detailForm.state">{{detailForm.state | partnerLevel}}</el-tag>
                            </el-form-item>
                            <el-form-item label="网址：" prop="website">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.website"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.website | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="公司邮箱：" prop="email">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.email"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.email | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="国家：" prop="country">
                                <span class="form-border-bottom">{{detailForm.country | country | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="省：" prop="province">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.province" @change=" detailForm.city ? detailForm.city='' : null">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="(item,$index) in $store.state.static_resource.province"
                                            :key="$index"
                                            :label="$index"
                                            :value="$index">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.province | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="市：" prop="city">
                                <el-select v-if="(!queryId || isEdit)" v-model="detailForm.city">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.static_resource.province[detailForm.province]"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.city | defaultStr}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="常用支付方式：" prop="order_payment_method">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.order_payment_method">
                                    <el-option label="请选择" value=""></el-option>
                                    <template v-for="item in $store.state.paymentMethod">
                                        <el-option
                                                v-if="item.system === $store.state.system"
                                                :key="item.code"
                                                :label="item.label"
                                                :value="item.code">
                                        </el-option>
                                    </template>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.order_payment_method | paymentMethod | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="常用货币：" prop="currency">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.currency">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.currency"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.currency | currency | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="常用发货方式：" prop="order_supplier_pickup_method">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.order_supplier_pickup_method">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.supplierPickupMethod"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.order_supplier_pickup_method | supplierPickupMethod | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="公司超级管理员：">
                                <span v-if="detailForm.company_admin">{{detailForm.company_admin.nick_name | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="跟进人：">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.follower_id">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.all_internal_users"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <span class="form-border-bottom" v-else>{{(detailForm.follower ? detailForm.follower.name : '') | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="客户性质：" prop="customer_type">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.customer_type">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="(item) in $store.state.static_resource.customer_type"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.customer_type | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="语言：" prop="language">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.language">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.language"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.language | language | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="终端应用行业：" prop="customer_terminal_industry">
                                <el-select multiple v-if="!queryId || isEdit" v-model="detailForm.customer_terminal_industry">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.static_resource.customer_terminal_industry"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <div v-else>
                                    <el-tag v-for="item in detailForm.customer_terminal_industry" :key="item">{{item}}</el-tag>
                                </div>
                            </el-form-item>
                            <el-form-item label="预计采购时间：" prop="customer_purchase_month">
                                <el-select multiple v-if="!queryId || isEdit" v-model="detailForm.customer_purchase_month">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.static_resource.customer_purchase_month"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <div v-else>
                                    <el-tag v-for="item in detailForm.customer_purchase_month" :key="item">{{item}}</el-tag>
                                </div>
                            </el-form-item>
                            <el-form-item label="年采购量(万)：" prop="customer_annual_purchase_amount">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.customer_annual_purchase_amount"></InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.customer_annual_purchase_amount | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="付款通知邮箱：" prop="account_email">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.account_email"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.account_email | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="备注：" prop="comment">
                                <el-input type="textarea" v-if="!queryId || isEdit" v-model="detailForm.comment"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.comment | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
            </div>

            <el-tabs type="card" class="car-box" v-if="queryId">
                <el-tab-pane label="联系人" lazy>
                    <PartnerDetailPartnerUsers :queryId="queryId"></PartnerDetailPartnerUsers>
                </el-tab-pane>
                <el-tab-pane label="地址" lazy>
                    <PartnerDetailPartnerAddresses :queryId="queryId"></PartnerDetailPartnerAddresses>
                </el-tab-pane>
                <el-tab-pane label="工商信息" lazy>
                    <PartnerDetailBusinessInfo :queryId="queryId"></PartnerDetailBusinessInfo>
                </el-tab-pane>
                <el-tab-pane label="会计" lazy>
                    <PartnerDetailBankAccount :queryId="queryId" :companyDetail="detailForm" @updateDetail="getDetailData"></PartnerDetailBankAccount>
                </el-tab-pane>
            </el-tabs>

        </div>


        <el-dialog title="管理员编辑" :visible.sync="manageEditDialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="manageEditForm" label-width="110px">
                <el-form-item label="公司类型" prop="company_type">
                    <el-select v-model="manageEditForm.company_type">
                        <el-option
                                v-for="item in $store.state.companyType"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司超级管理员" prop="company_admin_id">
                    <SelectLoginUser
                            :userId.sync="manageEditForm.company_admin_id"
                            :user="manageEditForm.company_admin"
                            :option="manageEditForm.company_admin_id ? [manageEditForm.company_admin]:null"
                    ></SelectLoginUser>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="manageEditSave()">保 存</el-button>
                <el-button @click="manageEditDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="编辑公司等级" :visible.sync="companyLeverEditDialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="companyLeverEditForm" label-width="110px">
                <el-form-item label="公司等级" prop="state">
                    <el-select v-model="companyLeverEditForm.state">
                        <el-option
                                v-for="item in $store.state.partnerLevel"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="companyLeverEditSave()">保 存</el-button>
                <el-button @click="companyLeverEditDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import PartnerDetailPartnerUsers from "./component/partner-detail-partner-users";
    import PartnerDetailPartnerAddresses from "./component/partner-detail-partner-addresses";
    import PartnerDetailBusinessInfo from "./component/partner-detail-business_info";
    import PartnerDetailBankAccount from "./component/partner-detail-bank-account";

    export default {
        components: {
            PartnerDetailPartnerUsers,
            PartnerDetailPartnerAddresses,
            PartnerDetailBusinessInfo,
            PartnerDetailBankAccount,
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    /*customer_type: [
                        {required: true, message: '请选择客户性质！'}
                    ],*/
                },

                manageEditDialogShow: false,
                manageEditForm: {},
                selectLoading:false,

                companyLeverEditDialogShow: false,
                companyLeverEditForm: {},

                loading: false,


            }
        },
        watch: {
            '$route'() {
                this.init()
            }
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
                    self.detailForm = {
                        name: self.$route.query.name || '',
                        country: self.$route.query.country || '',
                        company_type: 'public',
                        order_payment_method: 'earnest_payment',
                        currency: 'CNY',
                        order_supplier_pickup_method: 'unknown',
                        follower_id: self.$store.state.currentCompany.user_id || '',
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            data.msg.follower_id = '';
                            self.detailForm = data.msg;
                        }
                    },
                    error(data){
                        if(data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40001)>-1){
                            self.$router.back();
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
                this.detailForm.follower_id = this.detailForm.follower ? this.detailForm.follower.id : '';
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        if (!self.detailForm.follower_id) self.detailForm.follower_id = null;
                        self.$http({
                            url: self.queryId ? self.$api.partner_companies_detail + '/' + self.queryId : self.$api.partner_companies_detail,
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.isEdit = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    if (!self.queryId && data.msg.account_company_id) {
                                        self.$router.push({
                                            path: '/partner/detail',
                                            query: {
                                                id: data.msg.account_company_id,
                                            }
                                        });
                                    }
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
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },


            clickManageEdit(){
                this.manageEditDialogShow=true;
                this.manageEditForm={
                    partnerId:this.detailForm.queryId,
                    company_type:this.detailForm.company_type,
                    company_admin_id:this.detailForm.company_admin ? this.detailForm.company_admin.id : null,
                    company_admin:this.detailForm.company_admin || null,
                    state:this.detailForm.state,
                };
            },
            manageEditSave(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/admin',
                    type: 'PUT',
                    requestBody: true,
                    data: self.manageEditForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.manageEditDialogShow = false;
                            self.getDetailData();
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



            clickCompanyLeverEdit(){
                this.companyLeverEditDialogShow=true;
                this.companyLeverEditForm={
                    account_company_id:this.queryId,
                    state:this.detailForm.state || 'unknown',
                };
            },
            companyLeverEditSave(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/do_action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        account_company_id:this.companyLeverEditForm.account_company_id,
                        name: 'set_' + this.companyLeverEditForm.state,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.companyLeverEditDialogShow = false;
                            self.getDetailData();
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

            //删除当前合作伙伴
            clickDelete(){
                let self = this;
                self.$confirm('确认删除该合作伙伴吗？请谨慎操作', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.partner_companies_detail + '/' + self.queryId,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '操作成功！',
                                            type: 'success'
                                        });
                                        self.$router.back();
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
