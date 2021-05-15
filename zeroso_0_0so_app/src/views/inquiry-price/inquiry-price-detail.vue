<template>
    <div class="flex-box-column inquiry-price-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">询价单</el-breadcrumb-item>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[sheetType]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '询价单详情' : '新增询价单'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>


        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">

                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span class="margin-right-20">单号：{{detailForm.id}}</span>
                        <SupplierInquiryState :state="detailForm.state"></SupplierInquiryState>

                        <email-message-count-button
                                class="margin-left-20"
                                v-if="detailForm.id"
                                ref="emailMessageCountButton"
                                :inquiryData="detailForm"
                                :brandId="detailForm.brand ? detailForm.brand.id : null"
                                :module_id="detailForm.id"
                                module_name="inquiry_pool"
                                subsystem="inquiry">
                        </email-message-count-button>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns margin-right-20" v-if="detailForm.id">
                            <div v-if="!isEdit">
                                <el-button type="warning" v-if="detailForm.state==='DRAFT'" :disabled="hasEditAction"
                                           @click="changeInquiryState">提交询价
                                </el-button>
                                <el-button type="warning" v-if="detailForm.state==='INQUIRY_SENT'" :disabled="hasEditAction"
                                           @click="changeInquiryState">催价
                                </el-button>
                                <el-button type="warning" v-if="detailForm.state==='INQUIRY_PUSHED'" :disabled="hasEditAction"
                                           @click="changeInquiryState">再询价
                                </el-button>

                                <el-button type="success" :disabled="hasEditAction"
                                           v-if="detailForm.state==='INQUIRY_SENT' || detailForm.state==='INQUIRY_PUSHED'"
                                           @click="changeQuotationState(true)">标记已报价
                                </el-button>
                                <el-button type="danger" :disabled="hasEditAction"
                                           v-if="detailForm.state==='DRAFT' || detailForm.state==='INQUIRY_SENT' || detailForm.state==='INQUIRY_PUSHED'"
                                           @click="changeQuotationState(false)">标记不报价
                                </el-button>

                                <SelectEmailTemplateInquiry
                                        :errorMessage="$store.state.currentCompany.account_company_id !== 9428 ? '请使用 ZNS GmbH 员工账号进行此操作！' : !detailForm.supplier_company.account_company_id ? '请先选择供应商！' : null"
                                        name="发送邮件"
                                        :inquiryData="detailForm"
                                        :module_id="detailForm.id"
                                        :mastSelectProduct="true"
                                        module_name="inquiry_pool"
                                        subsystem="inquiry"
                                        class="margin-left-20 margin-right-20">
                                </SelectEmailTemplateInquiry>

                                <el-button type="primary" :disabled="hasEditAction" @click="clickEdit">编辑</el-button>
                            </div>
                            <div v-if="isEdit">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                            </div>
                        </div>
                        <DetailPagination v-if="queryId && currentUserId" :listApi="$api.inquiry_v6_pool_quotations"
                                          is-new-system="true"></DetailPagination>
                    </div>
                </div>


                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="150px">
                    <el-row type="flex" justify="space-between">
                        <el-col :span="10">
                            <el-form-item label="品牌：">
                                <div class="form-border-bottom">
                                    <router-link class="blue margin-right-20" target="_blank"
                                                 :to="'/product/brand/detail?id='+detailForm.brand.id">
                                        {{detailForm.brand.name}}
                                    </router-link>
                                    <span class="margin-right-10">{{detailForm.brand.country | country}}</span>
                                    <isEuCountry :country="detailForm.brand.country"></isEuCountry>

                                    <BrandLever :state="detailForm.brand.state" :hideUnknown="true"> </BrandLever>
                                </div>
                            </el-form-item>

                            <el-form-item label="供应商：">
                                <SelectPartnerCompanyOnly
                                        v-if="isEdit"
                                        :partnerId.sync="detailForm.supplierCompanyId"
                                        :partner="detailForm.supplier_company"
                                        :option="detailForm.supplier_company.account_company_id ? [detailForm.supplier_company] : null"
                                        :recommendOption="recommendOption">
                                    <template slot="append">
                                        <el-button type="primary" @click="clickAddPartner">创建</el-button>
                                    </template>
                                </SelectPartnerCompanyOnly>
                                <div v-else class="form-border-bottom">
                                    <router-link class="blue" target="_blank"
                                                 :to="'/partner/detail?id='+detailForm.supplier_company.account_company_id">
                                        <span>{{detailForm.supplier_company.company_name}}</span>
                                        <span v-if="detailForm.supplier_company.name">，{{detailForm.supplier_company.name}}</span>
                                    </router-link>
                                    <CompanyType :type="detailForm.supplier_company.company_type"></CompanyType>
                                    <CompanyLever class="margin-left-5" :state="detailForm.supplier_company.state"></CompanyLever>
                                </div>
                            </el-form-item>
                            <el-form-item label="供应商付款方式">
                                <span class="form-border-bottom">
                                    <span v-if="detailForm.supplier_company">{{detailForm.supplier_company.payment_method | paymentMethod}}</span>
                                </span>
                            </el-form-item>
                            <el-form-item label="历史绑定供应商：" v-if="detailForm.has_inquiry_supplier_list && detailForm.has_inquiry_supplier_list.length>0">
                                <div class="form-border-bottom">
                                    <p v-for="(item,$index) in detailForm.has_inquiry_supplier_list" :key="$index">
                                        <router-link class="blue" target="_blank" :to="'/partner/detail?id='+item.account_company_id">
                                            {{item.company_name}}
                                        </router-link>
                                    </p>
                                </div>
                            </el-form-item>

                            <el-form-item label="跟进人：" prop="follower_user.account_user_id">
                                <SelectLoginUser
                                        v-if="isEdit"
                                        :userId.sync="detailForm.follower_user.account_user_id"
                                        :option="detailForm.follower_user.account_user_id ? [{
                                            id:detailForm.follower_user.account_user_id,
                                            nick_name:detailForm.follower_user.name,
                                        }] : null">
                                </SelectLoginUser>
                                <span v-else class="form-border-bottom">{{detailForm.follower_user.name}}</span>
                            </el-form-item>
                            <el-form-item label="币种：" prop="currency">
                                <span class="form-border-bottom">{{currency}}</span>
                            </el-form-item>
                            <el-form-item label="已报价供应商参考：" v-if="detailForm.recommend_supplier_list && detailForm.recommend_supplier_list.length>0">
                                <div class="form-border-bottom">
                                    <p v-for="(item,$index) in detailForm.recommend_supplier_list" :key="$index">
                                        <router-link class="blue" target="_blank" :to="'/partner/detail?id='+item.account_company_id">
                                            {{item.company_name}}
                                        </router-link>
                                    </p>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" class="el-form-gray el-form-margin-small el-form-item-right" v-if="queryId">
                            <el-form-item label="创建时间：">
                                <span class="form-border-bottom">{{detailForm.created_time | zerosoCompanyTime}}</span>
                            </el-form-item>
                            <el-form-item label="修改时间：">
                                <span class="form-border-bottom">{{detailForm.updated_time | zerosoCompanyTime}}</span>
                            </el-form-item>
                            <el-form-item label="状态变更时间：">
                                <span class="form-border-bottom">{{detailForm.state_updated_time | zerosoCompanyTime}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <inquiryPriceDetailProduct
                    style="margin-bottom: 100px;"
                    :queryId="queryId"
                    :detailForm="detailForm"
                    :hasEditAction.sync="hasEditAction"
                    :currency="currency"
                    :supplierListData="supplierListData"
                    :supplierNormalSelectId="supplierNormalSelectId"
                    @update="getDetailData">
            </inquiryPriceDetailProduct>
        </div>

        <inquiry-price-detail-refused-quote
                ref="refusedQuote"
                @refusedQuoteSubmit="markRefusedQuoteSubmit">
        </inquiry-price-detail-refused-quote>

    </div>
</template>

<script>
    import inquiryPriceDetailProduct from "./component/inquiry-price-detail-product";
    import EmailMessageCountButton from "../related-message/email-message-count-button";
    import SupplierInquiryState from "./component/SupplierInquiryState";
    import InquiryPriceDetailRefusedQuote from "./component/inquiry-price-detail-refused-quote";

    export default {
        components: {
            InquiryPriceDetailRefusedQuote,
            SupplierInquiryState,
            EmailMessageCountButton,
            inquiryPriceDetailProduct,
        },
        data() {
            return {
                queryId: '',
                parentQuery: '',
                currentUserId: undefined,

                sheetType: undefined,
                breadNameList: {
                    OTHERS: '跟进中',
                    QUOTE_REFUSED: '无报价',
                    QUOTED: '已报价',
                    all: '所有',
                },

                isEdit: false,
                detailForm: {
                    brand: {},
                    follower_user: {},
                    supplier_company: {},
                },
                detailFormRule: {
                    'follower_user.account_user_id': [
                        {required: true, message: '请选择跟进人！'}
                    ],
                },

                currency: 'EUR',
                isRecommendSupplier: false,


                supplierListData:[],
                recommendOption:[],
                supplierNormalSelectId:null,
                
                
                loading: false,

                hasEditAction: false,

            }
        },
        watch: {
            isEdit(val) {
                this.hasEditAction = val;
            },
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
                this.sheetType = this.$route.params.sheetType;
                self.currentUserId = self.$route.query.currentUserId;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                }
            },

            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.hasEditAction = false;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool_quotations + '/' + self.queryId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        if (!data.follower_user) data.follower_user = {};
                        if (!data.supplier_company) data.supplier_company = {};
                        data.supplierCompanyId = data.supplier_company.account_company_id;
                        self.detailForm = data;
                        self.getSupplierListData();
                    },
                    error(data) {
                        if (data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(300001) > -1) {
                            self.$router.push('list');
                        }
                    }
                })
            },
            //获取当前品牌绑定的供应商
            getSupplierListData() {
                let self = this;
                self.$http({
                    url: self.$api.product_brand_v5 + '/' + self.detailForm.brand.id + '/suppliers',
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg && data.msg) {
                            let supplierListData = data.msg;
                            if(supplierListData[0]) self.supplierNormalSelectId = supplierListData[0].company_info_with_follower.account_company_id;
                            self.recommendOption = [];
                            for (let i = 0; i < supplierListData.length; i++) {
                                self.recommendOption.push(supplierListData[i].company_info_with_follower);
                                if (supplierListData[i].is_default && supplierListData[i].company_info_with_follower) {
                                    self.supplierNormalSelectId = supplierListData[i].company_info_with_follower.account_company_id;
                                }
                            }

                            if(self.detailForm.recommend_supplier_list && self.detailForm.recommend_supplier_list.length>0){
                                let recommend_supplier_list = self.detailForm.recommend_supplier_list;
                                for(let i=0;i<recommend_supplier_list.length;i++){
                                    let isHas=false;
                                    for(let k=0;k<supplierListData.length;k++){
                                        if(recommend_supplier_list[i].account_company_id === supplierListData[k].company_info_with_follower.account_company_id){
                                            isHas = true;
                                        }
                                    }
                                    if(!isHas){
                                        supplierListData.push({
                                            company_info_with_follower:recommend_supplier_list[i]
                                        })
                                    }
                                }
                            }
                            if(self.detailForm.has_inquiry_supplier_list && self.detailForm.has_inquiry_supplier_list.length>0){
                                for(let i=0;i<self.detailForm.has_inquiry_supplier_list.length;i++){
                                    let hasSame=false;
                                    for(let k=0;k<supplierListData.length;k++){
                                        if(self.detailForm.has_inquiry_supplier_list[i].account_company_id===supplierListData[k].company_info_with_follower.account_company_id){
                                            hasSame = true;
                                        }
                                    }
                                    if(!hasSame){
                                        supplierListData.push({
                                            company_info_with_follower:self.detailForm.has_inquiry_supplier_list[i]
                                        })
                                    }
                                }
                            }

                            self.supplierListData = supplierListData;
                        }
                    }
                })
            },



            clickEdit() {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                self.isEdit = true;
            },

            //保存信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId + '/essentials',
                            type: 'PUT',
                            requestBody: true,
                            data: {
                                "follower_id": self.detailForm.follower_user.account_user_id,
                                "supplier_id": self.detailForm.supplierCompanyId,
                            },
                            success: function () {
                                self.loading = false;
                                self.isEdit = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.getDetailData();
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
                this.init()
            },


            //修改询价单状态
            changeInquiryState() {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                if (self.detailForm.state==='DRAFT') {
                    self.loading = true;
                    self.$refs.emailMessageCountButton.getMessageCount((messageCountData)=>{
                        self.loading = false;
                        if (messageCountData.mail===0 && messageCountData.message===0) {
                            self.$message({
                                showClose: true,
                                message: '当前询价单无相关邮件，并且无相关站内信消息，不可变更为已询价，至少需要在消息中留言！',
                                type: 'error'
                            });
                        }else {
                            self.changeInquiryStateSubmit();
                        }
                    })
                }else {
                    self.changeInquiryStateSubmit();
                }
            },
            changeInquiryStateSubmit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId,
                    type: 'PUT',
                    requestBody: true,
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                });
            },

            //修改询价单状态
            changeQuotationState(isQuoted) {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                if (isQuoted) {
                    if (this.detailForm.products) {
                        for(let i=0;i<this.detailForm.products.length;i++){
                            if (!this.detailForm.products[i].is_quote) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行产品未提交报价，标记已报价之前，所有产品必须提交报价！',
                                    type: 'error'
                                });
                                return
                            }
                        }
                    }
                    self.$confirm('请注意：标记已报价之前，请确认产品价格是否已完整填写，并且务必核查正确性，执行该操作后将不可更改！', '提示', {
                        confirmButtonText: '确定执行',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (action) {
                            if (action == 'confirm') {
                                self.changeQuotationStateSubmit(true)
                            }
                        }
                    })
                } else {
                    self.$refs.refusedQuote.init()
                }
            },


            changeQuotationStateSubmit(quotation,data) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.queryId + '/quotation',
                    type: 'PUT',
                    requestBody: true,
                    data:{
                        quoted:quotation,
                        ...data
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
                });
            },
            //标记不报价数据提交
            markRefusedQuoteSubmit(data){
                this.changeQuotationStateSubmit(false,data)
            },


            clickAddPartner() {
                window.open('#/partner/list?showAdd=true')
            },
        }
    }
</script>

<style lang="scss">
</style>
