<template>
    <div class="flex-box-column inquiry-price-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">询报价单</el-breadcrumb-item>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">{{breadNameList[sheetType]}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '详情' : '创建询报价单'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span class="margin-right-20">单号：{{detailForm.id}}</span>
                        <span class="margin-right-20" v-if="detailForm.contract_no_list">
                            订单编号：
                            <a class="cursor-pointer blue margin-right-10"
                               v-for="item in detailForm.contract_no_list"
                               :key="item"
                               @click="goToOrderDetail(item)">
                                {{item}}
                            </a>
                        </span>
                        <InquirySheetState :state="detailForm.inquiry_quote_state"></InquirySheetState>

                        <el-tag type="danger" effect="dark"
                                v-if="detailForm.has_pushed && detailForm.inquiry_quote_state==='EXPENSE_EXAMINE'">已催
                        </el-tag>


                        <email-message-count-button
                                class="margin-left-20"
                                v-if="detailForm.id && supplierIs0soCompany"
                                :hideEmail="true"
                                :inquiryQuotationData="detailForm"
                                :brandId="detailForm.brand ? detailForm.brand.id : null"
                                :module_id="detailForm.id"
                                module_name="quote"
                                subsystem="inquiry">
                        </email-message-count-button>
                    </h3>
                    <div class="detail-control">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId && detailForm.inquiry_quote_state">
                                <div v-if="!isEdit">

                                    <el-button type="warning"
                                               :disabled="hasEditAction"
                                               v-if="detailForm.inquiry_quote_state==='CREATED' && !supplierIsInternalButNotOsoCompany"
                                               @click="updateState('/inquiry')">发送询价
                                    </el-button>

                                    <el-button type="warning"
                                               :disabled="hasEditAction"
                                               v-if="detailForm.inquiry_quote_state==='EXPENSE_EXAMINE' && supplierIs0soCompany && !detailForm.has_pushed"
                                               @click="pushInquiry()">
                                        催询价
                                    </el-button>

                                    <template v-if="!hasNoCustomer && !customerIsInternal">
                                        <el-button type="warning"
                                                   :disabled="hasEditAction"
                                                   v-if="['EXPENSE_APPROVED','INQUIRY_REPLIED'].indexOf(detailForm.inquiry_quote_state)>-1"
                                                   @click="updateState('/quotation','PUT')">发送报价
                                        </el-button>
                                        <el-button type="warning"
                                                   :disabled="hasEditAction"
                                                   v-if="detailForm.inquiry_quote_state==='QUOTATION_SENT'"
                                                   @click="changeContractState('sent')">发送合同
                                        </el-button>
                                        <el-button type="warning"
                                                   :disabled="hasEditAction"
                                                   v-if="detailForm.inquiry_quote_state==='CONTRACT_SENT'"
                                                   @click="changeContractState('signed')">签订合同
                                        </el-button>
                                    </template>

                                    <inquiry-price-detail-enforced-contract
                                            v-if="(!hasNoCustomer&&!customerIsInternal&&detailForm.inquiry_quote_state==='CONTRACT_SIGNED') ||
                                            (hasNoCustomer&&['EXPENSE_APPROVED','INQUIRY_REPLIED','QUOTATION_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED'].indexOf(detailForm.inquiry_quote_state)>-1)"
                                            class="margin-left-10 margin-right-10"
                                            :queryId="queryId"
                                            :detailForm="detailForm"
                                            :supplierIs0soCompany="supplierIs0soCompany"
                                            :hasNoSupplier="hasNoSupplier"
                                            :hasNoCustomer="hasNoCustomer"
                                            :hasEditAction="hasEditAction"
                                            @update="getDetailData">执行合同
                                    </inquiry-price-detail-enforced-contract>


                                    <el-button type="danger" plain
                                               :disabled="hasEditAction"
                                               v-if="detailForm.inquiry_quote_state==='CREATED'"
                                               @click="deleteInquiry()">删除
                                    </el-button>
                                    <el-button type="danger" plain
                                               :disabled="hasEditAction"
                                               v-if="detailForm.inquiry_quote_state!=='CANCELED' && detailForm.inquiry_quote_state!=='CREATED' && detailForm.inquiry_quote_state!=='CONTRACT_ENFORCED'"
                                               @click="cancelInquiry()">取消
                                    </el-button>
                                    <el-button type="success" plain
                                               v-if="detailForm.inquiry_quote_state==='CANCELED'"
                                               @click="recoverInquiry()">恢复
                                    </el-button>


                                    <template
                                            v-if="supplierIs0soCompany && !hasNoCustomer && canExportContractReportState.indexOf(detailForm.inquiry_quote_state)>-1">
                                        <SelectContractTemplateInquiry
                                                name="导出报价单"
                                                :inquiryData="detailForm"
                                                alias_name="Quotation"
                                                reportType="inquiryReport"
                                                class="margin-left-10 margin-right-10">
                                        </SelectContractTemplateInquiry>
                                        <SelectContractTemplateInquiry
                                                name="导出合同"
                                                :inquiryData="detailForm"
                                                alias_name="SalesOrder"
                                                reportType="contractReport"
                                                class="margin-right-10">
                                        </SelectContractTemplateInquiry>
                                    </template>

                                    <el-button type="primary"
                                               v-if="detailForm.inquiry_quote_state!=='CANCELED' && menuHasPartner"
                                               :disabled="hasEditAction" @click="isEdit=true">编辑
                                    </el-button>

                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination v-if="queryId" :listApi="$api.inquiry_v6_quotations"
                                          :isNewSystem="true"></DetailPagination>
                    </div>
                </div>

                <div class="detail-base-body clearfix">
                    <el-row type="flex" justify="space-between">

                        <el-col :span="9">
                            <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="160px">
                                <el-form-item label="品牌名" prop="brandName">
                                    <div v-if="!queryId">
                                        <AutoCompleteBrand
                                                ref="AutoCompleteBrand"
                                                :brandId="detailForm.brand.id"
                                                :brandName.sync="detailForm.brandName"
                                                @select="brandSelect"
                                                style="width: 50%">
                                        </AutoCompleteBrand>
                                        <span class="right">
                                        <BrandLever :state="detailForm.brand.state" :hideUnknown="true"> </BrandLever>
                                        <span class="margin-left-20" v-if="detailForm.brand.country">国家：{{detailForm.brand.country | country}}</span>
                                    </span>
                                    </div>
                                    <div v-else class="form-border-bottom">
                                        <span>{{detailForm.brand.name}}</span>
                                        <span class="right">
                                        <BrandLever :state="detailForm.brand.state" :hideUnknown="true"> </BrandLever>
                                        <span class="margin-left-20" v-if="detailForm.brand.country">国家：{{detailForm.brand.country | country}}</span>
                                    </span>
                                    </div>
                                </el-form-item>

                                <div v-if="menuHasPartner">
                                    <el-form-item label="联营公司供应商" class="has-no-required-icon"
                                                  prop="supplier.company.account_company_id">
                                        <SelectPartner
                                                ref="selectSupplier"
                                                v-if="!queryId || (isEdit && !isAlreadySignedContract && detailForm.supplier.company.company_type!=='internal')"
                                                :companyId="detailForm.supplier.company.account_company_id"
                                                :partnerId="detailForm.supplier.user.account_user_id"
                                                :partner="detailForm.supplier.company.account_company_id ? {
                                                    account_user_id:detailForm.supplier.user.account_user_id,
                                                    name:detailForm.supplier.user.name,
                                                    company_name:detailForm.supplier.company.company_name,
                                                    account_company_id:detailForm.supplier.company.account_company_id,
                                                    company_type:detailForm.supplier.company.company_type,
                                                } : null"
                                                :option="detailForm.supplier.company.account_company_id ? [{
                                                    account_user_id:detailForm.supplier.user.account_user_id,
                                                    name:detailForm.supplier.user.name,
                                                    company_name:detailForm.supplier.company.company_name,
                                                    account_company_id:detailForm.supplier.company.account_company_id,
                                                    company_type:detailForm.supplier.company.company_type,
                                                }] : null"
                                                @change="supplierChange">
                                            <template slot="append">
                                                <el-button type="primary" @click="clickAddPartner">新增</el-button>
                                            </template>
                                        </SelectPartner>
                                        <div v-else class="form-border-bottom">
                                            <router-link class="blue" target="_blank"
                                                         v-if="detailForm.supplier.company.account_company_id"
                                                         :to="'/partner/detail?id='+detailForm.supplier.company.account_company_id">
                                                <span>{{detailForm.supplier.company.company_name}}</span>
                                                <span v-if="detailForm.supplier.user.name">，{{detailForm.supplier.user.name}}</span>
                                            </router-link>
                                            <CompanyType :type="detailForm.supplier.company.company_type"></CompanyType>
                                        </div>
                                    </el-form-item>
                                    <!--<el-form-item label="零搜发货方式" v-show="supplierIs0soCompany">
                                        <el-select v-if="!queryId || (isEdit && !isAlreadySignedContract)"
                                                   v-model="detailForm.supplier.delivery_mode">
                                            <el-option v-for="item in supplierDeliveryModeList"
                                                       :key="item.code"
                                                       :value="item.code"
                                                       :label="item.label">
                                            </el-option>
                                        </el-select>
                                        <span v-else class="form-border-bottom">{{detailForm.supplier.delivery_mode | inquiryDeliveryMode}}</span>
                                    </el-form-item>-->
                                    <el-form-item label="联营公司客户" class="has-no-required-icon"
                                                  prop="customer.company.account_company_id">
                                        <SelectPartner
                                                v-if="!queryId || (isEdit && !isAlreadySignedContract && detailForm.customer.company.company_type!=='internal')"
                                                :companyId="detailForm.customer.company.account_company_id"
                                                :partnerId="detailForm.customer.user.account_user_id"
                                                :option="detailForm.customer.company.account_company_id ? [{
                                            account_user_id:detailForm.customer.user.account_user_id,
                                            name:detailForm.customer.user.name,
                                            company_name:detailForm.customer.company.company_name,
                                            account_company_id:detailForm.customer.company.account_company_id,
                                        }] : null"
                                                :autoGetNormal="true"
                                                @change="customerChange">
                                            <template slot="append">
                                                <el-button type="primary" @click="clickAddPartner">新增</el-button>
                                            </template>
                                        </SelectPartner>
                                        <div v-else class="form-border-bottom">
                                            <router-link class="blue" target="_blank"
                                                         v-if="detailForm.customer.company.account_company_id"
                                                         :to="'/partner/detail?id='+detailForm.customer.company.account_company_id">
                                                <span>{{detailForm.customer.company.company_name}}</span>
                                                <span v-if="detailForm.customer.user.name">，{{detailForm.customer.user.name}}</span>
                                            </router-link>
                                            <CompanyType :type="detailForm.customer.company.company_type"></CompanyType>
                                        </div>
                                    </el-form-item>
                                    <!--<el-form-item label="联营公司发货方式" v-show="supplierIs0soCompany">
                                        <el-select v-if="!queryId || (isEdit && !isAlreadySignedContract)"
                                                   v-model="detailForm.customer.delivery_mode">
                                            <el-option v-for="item in $store.state.inquiryDeliveryMode"
                                                       :key="item.code"
                                                       :value="item.code"
                                                       :label="item.label">
                                            </el-option>
                                        </el-select>
                                        <span v-else class="form-border-bottom">{{detailForm.customer.delivery_mode | inquiryDeliveryMode}}</span>
                                    </el-form-item>-->
                                    <el-form-item label="联营公司客户询价单号" prop="supplier">
                                        <el-input v-if="!queryId || (isEdit && !isAlreadySignedContract)"
                                                  v-model="detailForm.customer.inquiry_input.customer_inquiry_no"></el-input>
                                        <span v-else class="form-border-bottom">{{detailForm.customer.inquiry_input.customer_inquiry_no | defaultStr}}</span>
                                    </el-form-item>
                                    <el-form-item label="联营公司客户备注" prop="supplier">
                                        <el-input type="textarea" :rows="5" :maxlength="10000" show-word-limit
                                                  v-if="!queryId || (isEdit && !isAlreadySignedContract)"
                                                  v-model="detailForm.customer.inquiry_input.customer_remarks"></el-input>
                                        <span v-else class="form-border-bottom">{{detailForm.customer.inquiry_input.customer_remarks | defaultStr}}</span>
                                    </el-form-item>
                                </div>

                                <el-form-item label="币种">
                                <span class="form-border-bottom">
                                    {{detailForm.currency_unit.currency}}
                                </span>
                                </el-form-item>

                                <div v-if="menuHasPartner">
                                    <el-form-item label="询价单附件" prop="supplier">
                                        <FileListShow :fileList.sync="attached_quote_sheet_list"
                                                      :showDelete="!queryId || isEdit"></FileListShow>
                                        <FileUpload
                                                v-if="!queryId || isEdit"
                                                :autoUpload="true"
                                                @uploadSuccess="attachedQuoteSheetUploadSuccess"
                                                :show-file-list="false"
                                                module_id="0"
                                                module_name="order_node_offer"
                                                subsystem="file">
                                        </FileUpload>
                                    </el-form-item>
                                    <el-form-item label="合同附件" prop="supplier">
                                        <FileListShow :fileList.sync="attached_contract_list"
                                                      :showDelete="!queryId || isEdit"></FileListShow>
                                        <FileUpload
                                                v-if="!queryId || isEdit"
                                                :autoUpload="true"
                                                @uploadSuccess="attachedContractUploadSuccess"
                                                :show-file-list="false"
                                                module_id="0"
                                                module_name="order_node_oc"
                                                subsystem="file">
                                        </FileUpload>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-col>


                        <el-col :span="14" class="el-form-item-right el-form-gray el-form-margin-small" v-if="queryId">
                            <el-form label-width="110px">
                                <el-row type="flex" justify="end">
                                    <el-col :span="12">
                                        <el-form-item>
                                            <template slot="label">
                                                <h3>采购价格 </h3>
                                            </template>
                                        </el-form-item>

                                        <div v-if="!supplierIs0soCompany">
                                            <el-form-item label="产品总价">
                                                <span class="form-border-bottom">{{detailForm.procurement_price.total_products_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                            </el-form-item>
                                        </div>

                                        <div v-if="supplierIs0soCompany">
                                            <div v-if="detailForm.procurement_price.additional_charges.extra_charges.value_add_cny_tax">
                                                <el-form-item label="产品总价">
                                                    <span class="form-border-bottom">{{detailForm.procurement_price.total_cny_products_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                                </el-form-item>
                                                <el-form-item label="增值税">
                                                    <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.extra_charges.value_add_cny_tax | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                                </el-form-item>
                                            </div>
                                            <el-form-item label="人民币总价">
                                                <div class="form-border-bottom" style="text-align: left;"
                                                     v-if="isAlreadyExpenseApproved">
                                                    <el-radio-group
                                                            class="check-supplier-delivery-model-radio"
                                                            v-model="detailForm.supplier.delivery_mode"
                                                            @change="newPartnerSupplierDeliveryModeChange">
                                                        <el-radio label="DIRECT"
                                                                  v-if="!isAlreadySignedContract || detailForm.supplier.delivery_mode==='DIRECT'"
                                                                  :class="{'active':detailForm.supplier.delivery_mode==='DIRECT'}">
                                                            <b>{{(detailForm.supplier.delivery_mode==='DIRECT' ? detailForm.procurement_price.grand_cny_price : detailForm.procurement_price.direct_grand_cny_price)
                                                                |formatMoney('CNY') | inquiryPriceNormalText}}</b>
                                                            <span>直接发货，100%预付全款</span>
                                                        </el-radio>
                                                        <el-radio label="OFFSHORE"
                                                                  v-if="!isAlreadySignedContract || detailForm.supplier.delivery_mode==='OFFSHORE'"
                                                                  :class="{'active':detailForm.supplier.delivery_mode==='OFFSHORE'}">
                                                            <b>{{(detailForm.supplier.delivery_mode==='OFFSHORE' ? detailForm.procurement_price.grand_cny_price : detailForm.procurement_price.offshore_grand_cny_price)
                                                                |formatMoney('CNY') | inquiryPriceNormalText}}</b>
                                                            <span>海外仓发货，30%预付款，货到海外仓付清尾款</span>
                                                        </el-radio>
                                                        <el-radio label="DEMOSTIC"
                                                                  v-if="!isAlreadySignedContract || detailForm.supplier.delivery_mode==='DEMOSTIC'"
                                                                  :class="{'active':detailForm.supplier.delivery_mode==='DEMOSTIC'}">
                                                            <b>{{(detailForm.supplier.delivery_mode==='DEMOSTIC' ? detailForm.procurement_price.grand_cny_price : detailForm.procurement_price.demostic_grand_cny_price)
                                                                |formatMoney('CNY') | inquiryPriceNormalText}}</b>
                                                            <span>国内仓发货，30%预付款，货到国内仓付清尾款</span>
                                                        </el-radio>
                                                    </el-radio-group>
                                                </div>
                                                <span class="form-border-bottom" v-if="!isAlreadyExpenseApproved">
                                                    {{detailForm.procurement_price.grand_cny_price | formatMoney('CNY') | inquiryPriceNormalText}}
                                                </span>
                                            </el-form-item>
                                            <div v-if="detailForm.procurement_price.additional_charges.discount_amount">
                                                <el-form-item label="采购价优惠金额">
                                                    <div class="form-border-bottom">
                                                        <span class="red">
                                                            {{detailForm.procurement_price.additional_charges.discount_amount>0 ? '-' : '+'}}
                                                            {{detailForm.procurement_price.additional_charges.discount_amount | zerosoAbs | formatMoney('CNY')}}
                                                        </span>
                                                    </div>
                                                </el-form-item>
                                                <el-form-item>
                                                    <span>优惠前总价</span>
                                                    <span class="delete">
                                                   {{(detailForm.procurement_price.grand_cny_price+detailForm.procurement_price.additional_charges.discount_amount)  | formatMoney('CNY')}}
                                                </span>
                                                </el-form-item>
                                            </div>
                                            <p style="font-size: 12px;color: #999999;text-align: left;padding-left: 110px;padding-top: 5px;"
                                               v-if="isAlreadyExpenseApproved && detailForm.inquiry_quote_state!=='CONTRACT_ENFORCED'">
                                                注意：自“已回询价”起，该报价有效期为7天，未执行合同将自动取消
                                            </p>
                                        </div>
                                    </el-col>
                                    <el-col :span="12" v-if="menuHasPartner">
                                        <el-form-item>
                                            <template slot="label">
                                                <h3>销售价格 </h3>
                                            </template>
                                        </el-form-item>
                                        <div v-if="!supplierIs0soCompany">
                                            <el-form-item label="产品总价">
                                                <span class="form-border-bottom">{{detailForm.sales_price.total_products_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                            </el-form-item>
                                        </div>
                                        <div v-if="supplierIs0soCompany">
                                            <div v-if="detailForm.sales_price.additional_charges.extra_charges.value_add_cny_tax">
                                                <el-form-item label="产品总价">
                                                    <span class="form-border-bottom">{{detailForm.sales_price.total_cny_products_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                                </el-form-item>
                                                <el-form-item label="增值税">
                                                    <span class="form-border-bottom">{{detailForm.sales_price.additional_charges.extra_charges.value_add_cny_tax | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                                </el-form-item>
                                            </div>
                                            <el-form-item label="人民币总价">
                                                <span class="form-border-bottom">{{detailForm.sales_price.grand_cny_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>

                                <el-row type="flex" justify="end">
                                    <el-col :span="12">
                                        <div class="padding-top-20 padding-bottom-20">
                                            <el-form-item label="创建时间">
                                                <span class="form-border-bottom">{{detailForm.created_time | zerosoCompanyTime}}</span>
                                            </el-form-item>
                                            <el-form-item label="修改时间">
                                                <span class="form-border-bottom">{{detailForm.updated_time | zerosoCompanyTime}}</span>
                                            </el-form-item>
                                            <el-form-item label="状态变更时间">
                                                <span class="form-border-bottom">{{detailForm.state_updated_time | zerosoCompanyTime}}</span>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>

                            </el-form>
                        </el-col>

                    </el-row>
                </div>
            </div>


            <inquiryPriceDetailProduct
                    ref="inquiryPriceDetailProduct"
                    :queryId="queryId"
                    :detailForm="detailForm"
                    :isAlreadyExpenseApproved="isAlreadyExpenseApproved"
                    :isAlreadySignedContract="isAlreadySignedContract"
                    :supplierIs0soCompany="supplierIs0soCompany"
                    :hasEditAction.sync="hasEditAction"
                    :hasNoCustomer="hasNoCustomer"
                    :hasNoSupplier="hasNoSupplier"
                    :supplierIsInternalButNotOsoCompany="supplierIsInternalButNotOsoCompany"
                    :customerIsInternal="customerIsInternal"
                    :menuHasPartner="menuHasPartner"
                    @update="getDetailData">
            </inquiryPriceDetailProduct>

        </div>


    </div>
</template>

<script>
    import Vue from 'vue'
    import inquiryPriceDetailProduct from "./component/inquiry-price-detail-product";
    import InquiryPriceDetailEnforcedContract from "./component/inquiry-price-detail-enforced-contract";
    import OrderUtils from "../order/order-utils";
    import InquirySheetState from "./component/InquirySheetState";
    import EmailMessageCountButton from "../related-email-message/email-message-count-button";

    export default {
        components: {
            EmailMessageCountButton,
            InquirySheetState,
            InquiryPriceDetailEnforcedContract,
            inquiryPriceDetailProduct,
        },
        data() {
            let self = this;
            return {
                queryId: '',
                parentQuery: '',

                isEdit: false,
                detailForm: {},
                detailFormRule: {
                    brandName: [
                        {required: true, message: '请输入品牌！'}
                    ],
                    'supplier.company.account_company_id': [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.detailForm.supplier.company.account_company_id && !self.detailForm.customer.company.account_company_id) {
                                    callback(new Error('供应商与客户，至少需要填写一项！'));
                                } else if (self.detailForm.customer.company.account_company_id === self.detailForm.supplier.company.account_company_id) {
                                    callback(new Error('供应商与客户，不能是同一个公司！'));
                                } else if (self.detailForm.supplier.company.company_type === 'internal' && self.detailForm.customer.company.company_type === 'internal') {
                                    callback(new Error('供应商和客户不能同时是联营公司或零搜集团！'));
                                } else if (self.detailForm.supplier.company.account_company_id === self.$store.state.currentCompany.account_company_id) {
                                    callback(new Error('供应商不能是自己公司！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    'customer.company.account_company_id': [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.detailForm.supplier.company.account_company_id && !self.detailForm.customer.company.account_company_id) {
                                    callback(new Error('供应商与客户，至少需要填写一项！'));
                                } else if (self.detailForm.customer.company.account_company_id === self.detailForm.supplier.company.account_company_id) {
                                    callback(new Error('供应商与客户，不能是同一个公司！'));
                                } else if (self.detailForm.supplier.company.company_type === 'internal' && self.detailForm.customer.company.company_type === 'internal') {
                                    callback(new Error('供应商和客户不能同时是联营公司或零搜集团！'));
                                } else if (self.detailForm.customer.company.account_company_id === self.$store.state.currentCompany.account_company_id) {
                                    callback(new Error('客户不能是自己公司！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },
                attached_quote_sheet_list: [],
                attached_contract_list: [],

                oldSupplier: {},

                canExportContractReportState: ['EXPENSE_APPROVED', 'INQUIRY_REPLIED', 'QUOTATION_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'CONTRACT_ENFORCED'],

                sheetType: undefined,
                breadNameList: {
                    OTHERS: '跟进中',
                    CONTRACT_ENFORCED: '已执行',
                    CANCELED: '已取消',
                    all: '所有',
                },

                loading: false,

                supplierDeliveryModeList: this.$store.state.inquiryDeliveryMode,

                hasEditAction: false,

            }
        },
        computed: {
            supplierIs0soCompany() {//供应商是零搜
                return !!(
                        this.detailForm.supplier
                        && this.detailForm.supplier.company
                        && this.detailForm.supplier.company.account_company_id
                        && this.$store.state.zerosoCompany[this.detailForm.supplier.company.account_company_id]
                );
            },
            hasNoSupplier() {//无供应商
                return !this.detailForm.supplier || !this.detailForm.supplier.company || !this.detailForm.supplier.company.account_company_id
            },
            hasNoCustomer() {//无客户
                return !this.detailForm.customer || !this.detailForm.customer.company || !this.detailForm.customer.company.account_company_id
            },
            isAlreadySignedContract() {//已签合同之后
                return ['CONTRACT_SIGNED', 'CONTRACT_ENFORCED'].indexOf(this.detailForm.inquiry_quote_state) > -1
            },
            isAlreadyExpenseApproved() {//已核准税费之后，新版状态为已回询价之后
                return ['EXPENSE_APPROVED', 'INQUIRY_REPLIED', 'QUOTATION_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'CONTRACT_ENFORCED'].indexOf(this.detailForm.inquiry_quote_state) > -1
            },
            supplierIsInternalButNotOsoCompany() {//供应商是其他联营公司，并且不是零搜
                return !!(
                        this.detailForm.supplier
                        && this.detailForm.supplier.company
                        && this.detailForm.supplier.company.account_company_id
                        && this.detailForm.supplier.company.company_type === 'internal'
                        && !this.$store.state.zerosoCompany[this.detailForm.supplier.company.account_company_id]
                );
            },
            customerIsInternal() {//客户是联营公司
                return !!(
                        this.detailForm.customer
                        && this.detailForm.customer.company
                        && this.detailForm.customer.company.account_company_id
                        && this.detailForm.customer.company.company_type === 'internal'
                );
            },
            menuHasPartner() { //B系统根据Bmenu菜单配置，判断是否有合作伙伴菜单
                return !!this.$store.state.permissionsMap['partner']
            },
        },
        watch: {
            isEdit(val) {
                this.hasEditAction = val;
            },
            hasNoCustomer(val) {
                if (!val) {
                    this.detailForm.customer.delivery_mode = "DEMOSTIC";
                }
            },
            'detailForm.customer.delivery_mode'(val) {
                if (val === 'DIRECT') {
                    this.supplierDeliveryModeList = [
                        {
                            label: "直接发货",
                            code: 'DIRECT',
                        },
                    ]
                } else if (val === 'OFFSHORE') {
                    this.supplierDeliveryModeList = [
                        {
                            label: "直接发货",
                            code: 'DIRECT',
                        }, {
                            label: "海外仓发货",
                            code: 'OFFSHORE',
                        },
                    ]
                } else {
                    this.supplierDeliveryModeList = this.$store.state.inquiryDeliveryMode;
                }

                let isCheck = false;
                this.supplierDeliveryModeList.forEach((item) => {
                    if (item.code === this.detailForm.supplier.delivery_mode) {
                        isCheck = true;
                    }
                });
                if (!isCheck) this.detailForm.supplier.delivery_mode = 'DIRECT';
            },
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
            this.brandLeverFilter = Vue.filter('brandLever');
        },
        methods: {
            init() {
                let self = this;
                self.detailForm = {
                    brandName: '',
                    "brand": {
                        "agency_state": "",
                        "country": "",
                        "id": "",
                        "name": "",
                        "state": "",
                        "all_products_included": ""
                    },
                    "supplier": {
                        "company": {
                            "account_company_id": "",
                            "company_name": "",
                            "company_type": ""
                        },
                        "delivery_mode": "DIRECT",
                        "user": {
                            "account_user_id": "",
                            "name": ""
                        }
                    },
                    "customer": {
                        "company": {
                            "account_company_id": "",
                            "company_name": "",
                            "company_type": ""
                        },
                        "delivery_mode": "DIRECT",
                        "inquiry_input": {
                            "customer_attachments": {
                                "attached_contract": "",
                                "attached_quote_sheet": ""
                            },
                            "customer_inquiry_no": "",
                            "customer_remarks": ""
                        },
                        "user": {
                            "account_user_id": "",
                            "name": ""
                        }
                    },
                    "currency_unit": {
                        "currency": "EUR",
                        "exchange_rate": ""
                    },
                    "procurement_price": {
                        "additional_charges": {
                            "extra_charges": {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            },
                            "optional_service_fees": {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            },
                            "product_item_based_fees": {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            },
                            "product_weight_based_fees": {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        },
                        "grand_price": null,
                        "total_products_price": null,
                    },
                    "sales_price": {
                        "additional_charges": {
                            "extra_charges": {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            },
                            "optional_service_fees": {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            },
                            "product_item_based_fees": {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            },
                            "product_weight_based_fees": {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        },
                        "grand_price": null,
                        "total_products_price": null,
                    },
                };
                self.attached_quote_sheet_list = [];
                self.attached_contract_list = [];

                self.sheetType = self.$route.params.sheetType;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = null;
                    //创建询报价单，默认选择
                    self.detailForm.supplier.company = {
                        account_company_id: 1,
                        company_name: "零搜科技（深圳）有限公司",
                        company_type: "internal",
                    };
                    self.detailForm.supplier.user = {
                        "account_user_id": "",
                        "name": ""
                    };
                    self.detailForm.supplier.delivery_mode = "DIRECT";
                    self.detailForm.customer.delivery_mode = "DEMOSTIC";
                }
            },
            getDetailData() {
                let self = this;
                self.$nextTick(() => {
                    self.$refs.form.clearValidate();
                });
                self.isEdit = false;
                self.hasEditAction = false;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        if (!data.brand) data.brand = {};
                        data.brandName = data.brand.name;
                        if (data.contract_no) {
                            data.contract_no_list = data.contract_no.split(',');
                        }
                        if (!data.supplier) {
                            data.supplier = {
                                "company": {
                                    "account_company_id": "",
                                    "company_name": "",
                                    "company_type": ""
                                },
                                "delivery_mode": "",
                                "user": {
                                    "account_user_id": "",
                                    "name": ""
                                }
                            }
                        }
                        if (!data.supplier.company) data.supplier.company = {};
                        if (!data.supplier.user) data.supplier.user = {};
                        if (!data.customer) {
                            data.customer = {
                                "company": {
                                    "account_company_id": "",
                                    "company_name": "",
                                    "company_type": ""
                                },
                                "delivery_mode": "",
                                "user": {
                                    "account_user_id": "",
                                    "name": ""
                                }
                            }
                        } else if (!data.customer.inquiry_input) {
                            data.customer.inquiry_input = {
                                "customer_attachments": {
                                    "attached_contract": "",
                                    "attached_quote_sheet": ""
                                },
                                "customer_inquiry_no": "",
                                "customer_remarks": ""
                            }
                        } else if (!data.customer.inquiry_input.customer_attachments) {
                            data.customer.inquiry_input.customer_attachments = {
                                "attached_contract": "",
                                "attached_quote_sheet": ""
                            }
                        }
                        if (!data.customer.company) data.customer.company = {};
                        if (!data.customer.user) data.customer.user = {};

                        if (!data.currency_unit) {
                            data.currency_unit = {
                                "currency": "EUR",
                                "exchange_rate": ""
                            }
                        }
                        if (!data.procurement_price.additional_charges) data.procurement_price.additional_charges = {}
                        if (!data.procurement_price.additional_charges.extra_charges) {
                            data.procurement_price.additional_charges.extra_charges = {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            }
                        }
                        if (!data.procurement_price.additional_charges.optional_service_fees) {
                            data.procurement_price.additional_charges.optional_service_fees = {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            }
                        }
                        if (!data.procurement_price.additional_charges.product_item_based_fees) {
                            data.procurement_price.additional_charges.product_item_based_fees = {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            }
                        }
                        if (!data.procurement_price.additional_charges.product_weight_based_fees) {
                            data.procurement_price.additional_charges.product_weight_based_fees = {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        }
                        if (!data.sales_price.additional_charges) data.sales_price.additional_charges = {};
                        if (!data.sales_price.additional_charges.extra_charges) {
                            data.sales_price.additional_charges.extra_charges = {
                                "foreign_exchange_fees": null,
                                "insurance_fees": null,
                                "value_add_tax": null,
                            }
                        }
                        if (!data.sales_price.additional_charges.optional_service_fees) {
                            data.sales_price.additional_charges.optional_service_fees = {
                                "domestic_storage_service_fee": null,
                                "oversee_storage_service_fee": null,
                            }
                        }
                        if (!data.sales_price.additional_charges.product_item_based_fees) {
                            data.sales_price.additional_charges.product_item_based_fees = {
                                "domestic_customs_clearance_fees": null,
                                "handling_and_packing_fees": null,
                                "overseas_customs_fees": null,
                            }
                        }
                        if (!data.sales_price.additional_charges.product_weight_based_fees) {
                            data.sales_price.additional_charges.product_weight_based_fees = {
                                "domestic_logistics_fees": null,
                                "international_logistics_fees": null,
                                "supplier_pick_up_fees": null,
                            }
                        }


                        //附加费总计计算
                        data.procurement_price.additional_charges.extra_charges.extra_charges_total =
                                ((data.procurement_price.additional_charges.product_item_based_fees.handling_and_packing_fees || 0)
                                        + (data.procurement_price.additional_charges.product_item_based_fees.overseas_customs_fees || 0)
                                        + (data.procurement_price.additional_charges.product_item_based_fees.domestic_customs_clearance_fees || 0)
                                        + (data.procurement_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees || 0)
                                        + (data.procurement_price.additional_charges.product_weight_based_fees.international_logistics_fees || 0)
                                        + (data.procurement_price.additional_charges.product_weight_based_fees.domestic_logistics_fees || 0)
                                        + (data.procurement_price.additional_charges.optional_service_fees.oversee_storage_service_fee || 0)
                                        + (data.procurement_price.additional_charges.optional_service_fees.domestic_storage_service_fee || 0)
                                        + (data.procurement_price.additional_charges.extra_charges.insurance_fees || 0)
                                        + (data.procurement_price.additional_charges.extra_charges.foreign_exchange_fees || 0)) || null;
                        data.sales_price.additional_charges.extra_charges.extra_charges_total =
                                ((data.sales_price.additional_charges.product_item_based_fees.handling_and_packing_fees || 0)
                                        + (data.sales_price.additional_charges.product_item_based_fees.overseas_customs_fees || 0)
                                        + (data.sales_price.additional_charges.product_item_based_fees.domestic_customs_clearance_fees || 0)
                                        + (data.sales_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees || 0)
                                        + (data.sales_price.additional_charges.product_weight_based_fees.international_logistics_fees || 0)
                                        + (data.sales_price.additional_charges.product_weight_based_fees.domestic_logistics_fees || 0)
                                        + (data.sales_price.additional_charges.optional_service_fees.oversee_storage_service_fee || 0)
                                        + (data.sales_price.additional_charges.optional_service_fees.domestic_storage_service_fee || 0)
                                        + (data.sales_price.additional_charges.extra_charges.insurance_fees || 0)
                                        + (data.sales_price.additional_charges.extra_charges.foreign_exchange_fees || 0)) || null;


                        if (data.products) {
                            for (let i = 0; i < data.products.length; i++) {
                                data.products[i].productMinQty = null;
                                data.products[i].brand_id = data.brand.id;
                                data.products[i].product_name = data.products[i].type_no;
                                delete data.products[i].type_no;
                                data.products[i].product_order_no = data.products[i].order_no;
                                delete data.products[i].order_no;
                                data.products[i].product_trade_name = data.products[i].type_name ? JSON.parse(JSON.stringify(data.products[i].type_name)) : {
                                    "chinese_name": "",
                                    "english_name": ""
                                };
                                delete data.products[i].type_name;
                                data.products[i].product_parameter = data.products[i].parameters;
                                delete data.products[i].parameters;
                                data.products[i].origin_of_country = data.products[i].country_of_origin;
                                delete data.products[i].country_of_origin;
                                data.products[i].product_customs_info = data.products[i].customs ? JSON.parse(JSON.stringify(data.products[i].customs)) : {
                                    "cn_description": "",
                                    "code": "",
                                    "tariff_rate": null,
                                };
                                delete data.products[i].customs;

                                if (!data.products[i].prodcut_quotation.procurement) {
                                    data.products[i].prodcut_quotation.procurement = {
                                        "price": null,
                                        "tariff": null,
                                        "total_price_with_tariff": null,
                                    }
                                } else if (!data.products[i].prodcut_quotation.procurement.total_price_with_tariff) {
                                    data.products[i].prodcut_quotation.procurement.total_price_with_tariff = null;
                                }
                                if (!data.products[i].prodcut_quotation.sales) {
                                    data.products[i].prodcut_quotation.sales = {
                                        "price": null,
                                        "tariff": null,
                                        "total_price_with_tariff": null,
                                    }
                                } else if (!data.products[i].prodcut_quotation.sales.total_price_with_tariff) {
                                    data.products[i].prodcut_quotation.sales.total_price_with_tariff = null;
                                }
                                data.products[i].file_id_list = [];
                                if (data.products[i].attachments && data.products[i].attachments.file_id_list) {
                                    data.products[i].attachments.file_id_list.forEach((fileItem) => {
                                        data.products[i].file_id_list.push(JSON.parse(fileItem))
                                    })
                                }
                                data.products[i].isEdit = false;
                            }
                        }


                        self.detailForm = data;
                        self.oldSupplier = JSON.parse(JSON.stringify(self.detailForm.supplier));

                        try {
                            self.attached_quote_sheet_list = JSON.parse(self.detailForm.customer.inquiry_input.customer_attachments.attached_quote_sheet);
                        } catch (e) {
                            console.log(e)
                        }
                        try {
                            self.attached_contract_list = JSON.parse(self.detailForm.customer.inquiry_input.customer_attachments.attached_contract);
                        } catch (e) {
                            console.log(e)
                        }
                    },
                    error(data) {
                        if (data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(300001) > -1) {
                            self.$router.push('list');
                        }
                    }
                })
            },
            brandSelect(item) {
                this.detailForm.brand = {
                    id: item.id,
                    name: item.name,
                    country: item.country,
                    state: item.state,
                    all_products_included: item.all_products_included,
                    agency_state: !item.state ? 'NONE' : item.state === 'agency' ? 'EXCLUSIVE' : 'ORDINARY',
                };
                //“非欧品牌”，“暂不报价” “失效品牌”，“错误品牌” 做特殊提示
                if (item.state && (
                        (['non_eu', 'unquote'].indexOf(item.state) > -1 && (!this.$store.state.settingsDefaults.partner || this.$store.state.settingsDefaults.partner.customer_type!=="ERP" || this.supplierIs0soCompany))
                        || ['inactive', 'invalid'].indexOf(item.state) > -1)) {
                    if (['inactive', 'invalid'].indexOf(item.state) > -1 && item.correct_brand) {
                        this.$confirm(
                                '<p>该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b>，是否选择正确品牌？</p>' +
                                '<p>备注：'+(item.last_history&&item.last_history.comment?item.last_history.comment:'')+'</p>'+
                                '<p>正确品牌：<b>'+item.correct_brand.name+'</b></p>',
                                '提示', {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: '选择正确品牌',
                                    cancelButtonText: '取消',
                                    type: 'error'
                                }).then(() => {
                            this.detailForm.brand = {
                                id: item.correct_brand.id,
                                name: item.correct_brand.name,
                                country: item.correct_brand.country,
                                state: item.correct_brand.state,
                                all_products_included: item.correct_brand.all_products_included,
                                agency_state: !item.correct_brand.state ? 'NONE' : item.correct_brand.state === 'agency' ? 'EXCLUSIVE' : 'ORDINARY',
                            };
                            this.$nextTick(() => {
                                this.detailForm.brandName = item.correct_brand.name;
                                this.$refs.inquiryPriceDetailProduct.init();
                            })
                        }).catch(() => {
                            this.detailForm.brand = {
                                id: '',
                                name: '',
                                country: '',
                                state: '',
                                all_products_included: '',
                                agency_state: '',
                            };
                            this.$nextTick(() => {
                                this.detailForm.brandName = '';
                                this.$refs.inquiryPriceDetailProduct.init();
                            })
                        });
                    } else {
                        if (
                                item.state
                                && ['non_eu', 'unquote'].indexOf(item.state) > -1
                                && this.$store.state.settingsDefaults.partner
                                && this.$store.state.settingsDefaults.partner.customer_type==="ERP"
                                && this.supplierIs0soCompany
                        ) {
                            this.$message({
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                message: '<p style="margin-bottom: 5px;">该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b></p>' +
                                        '<p>注意：当品牌为“暂不报价”、“非欧品牌”时，不支持向零搜科技询价，请更换为其他供应商，或更换其他品牌！</p>',
                                type: 'error'
                            });
                        }else {
                            this.$message({
                                showClose: true,
                                dangerouslyUseHTMLString: true,
                                duration:5000,
                                message: '<p STYLE="margin-bottom: 5px;">该品牌为 <b>' + this.brandLeverFilter(item.state) + '</b>，不支持询价，请选择其他品牌！</p>' +
                                        '<p>备注：'+(item.last_history&&item.last_history.comment?item.last_history.comment:'')+'</p>',
                                type: 'error'
                            });
                        }
                        this.detailForm.brand = {
                            id: '',
                            name: '',
                            country: '',
                            state: '',
                            all_products_included: '',
                            agency_state: '',
                        };
                        this.$nextTick(() => {
                            this.detailForm.brandName = '';
                            this.$refs.inquiryPriceDetailProduct.init();
                        })
                    }
                }

                this.$refs.inquiryPriceDetailProduct.init();
            },
            supplierChange(value, item) {

                //当编辑询价单场景下，当前供应商不是零搜集团，则不可以将供应商修改为零搜集团
                if (this.queryId && !this.supplierIs0soCompany && this.$store.state.zerosoCompany[item.account_company_id]) {
                    this.$message({
                        showClose: true,
                        message: '当前供应商是非零搜集团，目前业务暂不支持将供应商修改为零搜集团！',
                        type: 'error'
                    });
                    this.$refs.selectSupplier.setInit(this.detailForm.supplier.company.account_company_id, [
                        {
                            account_user_id: this.detailForm.supplier.user.account_user_id,
                            name: this.detailForm.supplier.user.name,
                            company_name: this.detailForm.supplier.company.company_name,
                            account_company_id: this.detailForm.supplier.company.account_company_id,
                            company_type: this.detailForm.supplier.company.company_type,
                        }
                    ]);
                    return
                }


                this.detailForm.supplier.company = {
                    "account_company_id": item.account_company_id,
                    "company_name": item.company_name,
                    "company_type": item.company_type,
                };
                this.detailForm.supplier.user = {
                    "account_user_id": item.account_user_id,
                    "name": item.name,
                };
                if (this.detailForm.supplier.company.account_company_id && this.$store.state.zerosoCompany[this.detailForm.supplier.company.account_company_id]) {
                    //供应商是零搜集团
                    this.detailForm.supplier.delivery_mode = "DIRECT";
                    this.detailForm.customer.delivery_mode = "DEMOSTIC";

                    //当选择零搜集团公司时，切换到零搜科技
                    this.detailForm.supplier.company = {
                        account_company_id: 1,
                        company_name: "零搜科技（深圳）有限公司",
                        company_type: "internal",
                    };
                    this.detailForm.supplier.user = {
                        "account_user_id": "",
                        "name": ""
                    };
                    this.$refs.selectSupplier.setInit(null, [{
                        company_name: this.detailForm.supplier.company.company_name,
                        account_company_id: this.detailForm.supplier.company.account_company_id,
                        company_type: this.detailForm.supplier.company.company_type,
                        account_user_id: '',
                        name: '',
                    }]);

                    this.detailForm.currency_unit.currency = 'EUR';
                    this.detailForm.currency_unit.exchange_rate = null;
                } else {
                    //供应商不是零搜集团
                    this.detailForm.supplier.delivery_mode = "DIRECT";
                    this.detailForm.customer.delivery_mode = "DIRECT";

                    this.detailForm.currency_unit.currency = 'CNY';
                    this.detailForm.currency_unit.exchange_rate = 1;
                }
                this.$refs.form.validateField(['supplier.company.account_company_id', 'customer.company.account_company_id']);

                if (this.queryId) {
                    this.$refs.inquiryPriceDetailProduct.supplierChange();
                }
            },
            customerChange(value, item) {
                this.detailForm.customer.company = {
                    "account_company_id": item.account_company_id,
                    "company_name": item.company_name,
                    "company_type": item.company_type,
                };
                this.detailForm.customer.user = {
                    "account_user_id": item.account_user_id,
                    "name": item.name,
                };
                this.$refs.form.validateField(['supplier.company.account_company_id', 'customer.company.account_company_id']);
            },
            attachedQuoteSheetUploadSuccess(data) {
                if (data.msg && data.msg.items) {
                    this.attached_quote_sheet_list.push(data.msg.items);
                }
            },
            attachedContractUploadSuccess(data) {
                if (data.msg && data.msg.items) {
                    this.attached_contract_list.push(data.msg.items);
                }
            },
            //保存信息
            clickSaveDate() {
                let self = this;

                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let requestDataForm = JSON.parse(JSON.stringify(self.detailForm));
                        if (!self.queryId) {
                            if (
                                    requestDataForm.brand.state
                                    && ['non_eu', 'unquote'].indexOf(requestDataForm.brand.state) > -1
                                    && self.$store.state.settingsDefaults.partner
                                    && self.$store.state.settingsDefaults.partner.customer_type==="ERP"
                                    && self.supplierIs0soCompany
                            ) {
                                self.$message({
                                    showClose: true,
                                    dangerouslyUseHTMLString: true,
                                    message: '<p style="margin-bottom: 5px;">该品牌为 <b>' + self.brandLeverFilter(requestDataForm.brand.state) + '</b></p>' +
                                            '<p>注意：当品牌为“暂不报价”、“非欧品牌”时，不支持向零搜科技询价，请更换为其他供应商</p>',
                                    type: 'error'
                                });
                                return
                            }
                            requestDataForm.account_company_rank = self.$store.state.settingsDefaults.partner && self.$store.state.settingsDefaults.partner.customer_type
                                    ? self.$store.state.settingsDefaults.partner.customer_type : 'PROCUREMENT';

                            let productListData = self.$refs.inquiryPriceDetailProduct.productListData;
                            if (productListData.length === 0) {
                                self.$message({
                                    showClose: true,
                                    message: '至少必须添加1个产品信息！',
                                    type: 'error'
                                });
                                return
                            }
                            for (let i = 0; i < productListData.length; i++) {
                                if (!productListData[i].product_name) {
                                    self.$message({
                                        showClose: true,
                                        message: '部分产品信息不完整：缺少型号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                                        type: 'error'
                                    });
                                    return
                                }
                                if (!productListData[i].product_order_no) {
                                    self.$message({
                                        showClose: true,
                                        message: '部分产品信息不完整：缺少订货号！型号和订货号都是必填，若该产品只有型号或订货号，则型号和订货号填相同内容！',
                                        type: 'error'
                                    });
                                    return
                                }
                                if (!productListData[i].prodcut_quotation.quantity || productListData[i].prodcut_quotation.quantity === '0') {
                                    self.$message({
                                        showClose: true,
                                        message: '部分产品信息不完整：缺少数量！',
                                        type: 'error'
                                    });
                                    return
                                }
                            }
                            requestDataForm.products = JSON.parse(JSON.stringify(productListData));
                        }
                        if (requestDataForm.products) {
                            requestDataForm.products.forEach((product_item) => {
                                product_item.attachments.file_id_list = [];
                                for (let i = 0; i < product_item.file_id_list.length; i++) {
                                    product_item.attachments.file_id_list.push(JSON.stringify(product_item.file_id_list[i]));
                                }
                                product_item.file_id_list = undefined;
                                product_item.isEdit = undefined;
                            })
                        }

                        if (requestDataForm.id) requestDataForm.sheet_id = requestDataForm.id;
                        requestDataForm.customer.inquiry_input.customer_attachments.attached_quote_sheet = JSON.stringify(self.attached_quote_sheet_list);
                        requestDataForm.customer.inquiry_input.customer_attachments.attached_contract = JSON.stringify(self.attached_contract_list);

                        self.loading = true;
                        self.$http({
                            url: !self.queryId ? self.$api.inquiry_v6_quotations : self.$api.inquiry_v6_quotations + '/' + self.queryId + '/essential',
                            type: !self.queryId ? 'POST' : 'PUT',
                            requestBody: true,
                            data: requestDataForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.sheet_id) {
                                    self.isEdit = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    if (!self.queryId) {
                                        let query = JSON.parse(JSON.stringify(self.$route.query));
                                        query.id = data.sheet_id
                                        self.$router.push({
                                            path: 'detail',
                                            query: query
                                        });
                                    } else {
                                        self.getDetailData();
                                    }
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: data.errorMsg + '',
                                        type: 'error'
                                    });
                                }
                            }
                        });

                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },


            //删除询价
            deleteInquiry() {
                let self = this;
                self.$confirm('确认删除吗？删除后将不可恢复', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.cancelInquiry(true);
                        }
                    }
                })
            },
            //取消询价
            cancelInquiry(isDelete) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId,
                    type: 'DELETE',
                    success: function () {
                        self.loading = false;
                        self.$message({
                            type: 'success',
                            message: '操作成功！',
                            showClose: 'true'
                        });
                        if (isDelete) {
                            self.$router.back();
                        } else {
                            self.getDetailData();
                        }
                    }
                })
            },

            //恢复
            recoverInquiry() {
                this.updateState('', 'PUT')
            },
            //更新状态
            updateState(path, type, data) {
                let self = this;
                if (path) {
                    let checkProductState = this.checkProductState();
                    if (!checkProductState) return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId + path,
                    type: type || 'POST',
                    requestBody: true,
                    data: data,
                    success: function () {
                        self.loading = false;
                        self.$message({
                            type: 'success',
                            message: '操作成功！',
                            showClose: 'true'
                        });
                        self.getDetailData();
                    }
                })
            },
            //更改合同状态
            changeContractState(contract_command_type) {
                this.updateState('/contract', 'PUT', {
                    contract_command_type: contract_command_type.toLowerCase()
                })
            },

            checkProductState() {
                let validProductNumber = 0;
                for (let i = 0; i < this.detailForm.products.length; i++) {
                    if (!this.detailForm.products[i].mark_as_deleted && this.detailForm.products[i].mark_as_ccc) {
                        this.$message({
                            showClose: true,
                            message: '不能包含3C产品，请修改或删除该产品！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!this.detailForm.products[i].mark_as_deleted && this.detailForm.products[i].product_quote_state === 'QUOTE_REFUSED') {
                        this.$message({
                            showClose: true,
                            message: '不能包含不报价产品，请修改或删除该产品！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!this.detailForm.products[i].mark_as_deleted && this.detailForm.products[i].product_quote_state === 'EXPIRE') {
                        this.$message({
                            showClose: true,
                            message: '部分产品 供应商报价 已过期,请删除或更新价格！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!this.detailForm.products[i].mark_as_deleted && this.detailForm.products[i].product_quote_state !== 'INVALID' && this.detailForm.products[i].product_quote_state !== 'REPLACED') {
                        if (this.detailForm.products[i].productMinQty && this.detailForm.products[i].prodcut_quotation.quantity < this.detailForm.products[i].productMinQty) {
                            this.$message({
                                showClose: true,
                                message: '有产品数量小于最低起订量，请修改数量后在执行操作！',
                                type: 'error'
                            });
                            return false
                        }
                        validProductNumber++;
                    }
                }
                if (validProductNumber === 0) {
                    this.$message({
                        showClose: true,
                        message: '无有效产品，不能继续操作，请添加有效产品！',
                        type: 'error'
                    });
                    return false
                }
                return true
            },


            //催询价
            pushInquiry() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations + '/' + self.queryId + '/push',
                    type: 'POST',
                    success: function () {
                        self.loading = false;
                        self.$message({
                            type: 'success',
                            message: '操作成功！',
                            showClose: 'true'
                        });
                        self.getDetailData();
                    }
                })
            },


            newPartnerSupplierDeliveryModeChange() {
                this.clickSaveDate();
            },


            goToOrderDetail(contract_no) {
                OrderUtils.goToOrderDetail(contract_no, true)
            },

            clickAddPartner() {
                window.open('#/partner/list?showAdd=true')
            },

        }
    }
</script>

<style lang="scss">
    .inquiry-price-detail {
        .el-form-margin-small {
            .el-form-item {
                margin-bottom: 0;
            }
        }
    }

    .check-supplier-delivery-model-radio {
        .el-radio {
            display: block;
            margin: 10px 0;
            line-height: 18px;

            .el-radio__input {
                float: left;
                margin-top: 2px;
            }

            .el-radio__label {
                display: block;
                padding-left: 20px;
                white-space: normal;

                b {
                    margin-right: 5px;
                }
            }

            &.is-checked .el-radio__label {
                color: #00b9bc;
            }
        }

    }
</style>
