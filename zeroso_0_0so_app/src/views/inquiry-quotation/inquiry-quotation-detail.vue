<template>
    <div class="flex-box-column inquiry-price-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">询报价单 / {{breadNameList[sheetType]}}</el-breadcrumb-item>
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
                        <el-tag type="danger" effect="dark" v-if="detailForm.has_pushed && detailForm.inquiry_quote_state==='EXPENSE_EXAMINE'">已催</el-tag>
                        <el-tag type="danger" effect="dark" v-if="detailForm.is_zeroso_created">0端创建</el-tag>

                        <router-link class="margin-left-20" target="_blank"  :to='{
                                path: "/inquiry-price/all/list",
                                query: {
                                    order_by: encodeURIComponent(JSON.stringify({
                                        "field_name":"CREATE_TIME",
                                        "by":"desc"
                                    })),
                                    filter: encodeURIComponent(JSON.stringify([
                                        ["brandId","=",detailForm.brand]
                                    ]))
                                }
                            }'>
                            <el-button size="mini">查询该品牌询价单</el-button>
                        </router-link>

                        <inquiry-quotation-detail-cancel
                                class="margin-left-20 inline-block"
                                v-if="detailForm.inquiry_quote_state!=='CANCELED' && detailForm.inquiry_quote_state!=='CONTRACT_ENFORCED'"
                                :queryId="queryId"
                                @update="init">
                        </inquiry-quotation-detail-cancel>

                        <email-message-count-button
                                class="margin-left-20"
                                v-if="detailForm.id"
                                ref="emailMessageCountButton1"
                                :hideEmail="true"
                                :quoteInquiryData="detailForm"
                                :brandId="detailForm.brand ? detailForm.brand.id : null"
                                :module_id="detailForm.id"
                                module_name="quote"
                                subsystem="inquiry">
                        </email-message-count-button>
                    </h3>
                    <div class="detail-control">
                        <div class="control-btns" v-if="detailForm.id && isAllowQuotation">
                            <SupplierInquiryState class="margin-right-20" :state="detailForm.inquriy_state"></SupplierInquiryState>

                            <el-button type="warning" size="mini" v-if="detailForm.inquriy_state==='DRAFT'" :disabled="hasEditAction"
                                       @click="changeInquiryState">提交询价
                            </el-button>
                            <el-button type="warning" size="mini" v-if="detailForm.inquriy_state==='INQUIRY_SENT'" :disabled="hasEditAction"
                                       @click="changeInquiryState">催价
                            </el-button>
                            <el-button type="warning" size="mini" v-if="detailForm.inquriy_state==='INQUIRY_PUSHED'" :disabled="hasEditAction"
                                       @click="changeInquiryState">再询价
                            </el-button>

                            <el-button type="success" size="mini" :disabled="hasEditAction"
                                       v-if="detailForm.inquriy_state==='INQUIRY_SENT' || detailForm.inquriy_state==='INQUIRY_PUSHED'"
                                       @click="changeQuotationState(true)">标记已报价
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="hasEditAction"
                                       v-if="detailForm.inquriy_state==='DRAFT' || detailForm.inquriy_state==='INQUIRY_SENT' || detailForm.inquriy_state==='INQUIRY_PUSHED'"
                                       @click="changeQuotationState(false)">标记不报价
                            </el-button>


                            <SelectEmailTemplateInquiry
                                    :errorMessage="$store.state.currentCompany.account_company_id !== 9428 ? '请使用 ZNS GmbH 员工账号进行此操作！' : !detailForm.inquiry_supplier_company.account_company_id ? '请先选择供应商！' : null"
                                    name="发送邮件"
                                    :quoteInquiryData="detailForm"
                                    :module_id="detailForm.id"
                                    :mastSelectProduct="true"
                                    module_name="quote_inquiry"
                                    subsystem="inquiry"
                                    size="mini"
                                    align="right"
                                    class="margin-left-20">
                            </SelectEmailTemplateInquiry>

                            <email-message-count-button
                                    class="margin-left-10"
                                    v-if="detailForm.id"
                                    ref="emailMessageCountButton"
                                    messageTitle="日志"
                                    :quoteInquiryData="detailForm"
                                    :brandId="detailForm.brand ? detailForm.brand.id : null"
                                    :module_id="detailForm.id"
                                    module_name="quote_inquiry"
                                    subsystem="inquiry">
                            </email-message-count-button>
                        </div>
                        <DetailPagination
                                v-if="queryId"
                                :listApi="$api.inquiry_v6_0_quotations"
                                :isNewSystem="true"
                                :noResellerCompanyId="true">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body clearfix" :model="detailForm" :rules="detailFormRule" ref="form" label-width="170px">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="品牌名" prop="brandName">
                                <div class="form-border-bottom">
                                    <router-link class="blue" target="_blank"
                                                 :to="'/product/brand/detail?id='+detailForm.brand.id">
                                        {{detailForm.brand.name}}
                                    </router-link>
                                    <span class="margin-left-20">
                                        <BrandLever :state="detailForm.brand.state" :hideUnknown="true"> </BrandLever>
                                        <span class="margin-left-20" v-if="detailForm.brand.country">国家：{{detailForm.brand.country | country}}</span>
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="联营公司供应商">
                                <div class="form-border-bottom clearfix">
                                    <router-link
                                            class="blue" target="_blank"
                                            v-if="detailForm.supplier && detailForm.supplier.company"
                                            :to="'/partner/detail?id='+detailForm.supplier.company.account_company_id">
                                        <span>{{detailForm.supplier.company.company_name}}</span>
                                        <span v-if="detailForm.supplier.user && detailForm.supplier.user.name">，{{detailForm.supplier.user.name}}</span>
                                        <CompanyType :type="detailForm.supplier.company.company_type"></CompanyType>
                                        <CompanyLever class="margin-left-5" :state="detailForm.supplier.company.state"></CompanyLever>
                                    </router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="联营公司">
                                <div class="form-border-bottom clearfix">
                                    <router-link
                                            class="blue" target="_blank"
                                            v-if="detailForm.reseller && detailForm.reseller.company"
                                            :to="'/partner/detail?id='+detailForm.reseller.company.account_company_id">
                                        <span>{{detailForm.reseller.company.company_name}}</span>
                                        <span v-if="detailForm.reseller.user && detailForm.reseller.user.name">，{{detailForm.reseller.user.name}}</span>
                                        <CompanyType :type="detailForm.reseller.company.company_type"></CompanyType>
                                        <CompanyLever class="margin-left-5" :state="detailForm.reseller.company.state"></CompanyLever>
                                    </router-link>

                                    <span v-if="detailForm.reseller_follower">
                                        （{{detailForm.reseller_follower.name}}）
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="发货方式">
                                <span class="form-border-bottom">{{detailForm.supplier.delivery_mode | inquiryDeliveryMode}}</span>
                            </el-form-item>
                            <el-form-item label="币种">
                                <span class="form-border-bottom">
                                    <span>{{detailForm.currency_unit.currency}}</span>
                                    <span class="margin-left-20" v-if="detailForm.currency_unit.exchange_rate && detailForm.currency_unit.exchange_rate!==1">
                                        锁定汇率：{{detailForm.currency_unit.exchange_rate}}
                                    </span>
                                </span>
                            </el-form-item>

                            <div class="el-form-gray el-form-margin-small el-form-item-right">
                                <el-form-item label="创建时间：">
                                    <span class="form-border-bottom">{{detailForm.created_time | zerosoCompanyTime}}</span>
                                </el-form-item>
                                <el-form-item label="修改时间：">
                                    <span class="form-border-bottom">{{detailForm.updated_time | zerosoCompanyTime}}</span>
                                </el-form-item>
                                <el-form-item label="状态变更时间：">
                                    <span class="form-border-bottom">{{detailForm.state_updated_time | zerosoCompanyTime}}</span>
                                </el-form-item>
                            </div>
                        </el-col>

                        <el-col :span="10">
                            <template v-if="isAllowQuotation">
                                <el-form-item label="供应商">
                                    <div class="clearfix" v-if="isEdit">
                                        <SelectPartnerCompanyOnly
                                                class="left"
                                                style="width: 60%;"
                                                :partnerId.sync="detailForm.inquirySupplierCompanyId"
                                                :partner="detailForm.inquiry_supplier_company"
                                                :option="detailForm.inquiry_supplier_company.account_company_id ? [detailForm.inquiry_supplier_company] : null"
                                                :recommendOption="recommendOption">
                                            <template slot="append">
                                                <el-button type="primary" @click="clickAddPartner">创建</el-button>
                                            </template>
                                        </SelectPartnerCompanyOnly>
                                        <div class="right">
                                            <el-button size="mini" type="success" @click="clickSaveSupplierAndFollower()">保存</el-button>
                                            <el-button size="mini" @click="clickCancelEdit">取消</el-button>
                                        </div>
                                    </div>
                                    <div v-else class="form-border-bottom clearfix">
                                        <router-link class="left blue" target="_blank"
                                                     :to="'/partner/detail?id='+detailForm.inquiry_supplier_company.account_company_id">
                                            <span>{{detailForm.inquiry_supplier_company.company_name}}</span>
                                            <CompanyLever class="margin-left-5" :state="detailForm.inquiry_supplier_company.state"></CompanyLever>
                                        </router-link>

                                        <span v-if="detailForm.inquiry_supplier_follower">
                                            （{{detailForm.inquiry_supplier_follower.name}}）
                                        </span>

                                        <el-button
                                                size="mini" class="right" type="primary"
                                                v-if="['DRAFT','INQUIRY_SENT','INQUIRY_PUSHED'].indexOf(detailForm.inquriy_state)>-1"
                                                @click="clickEdit">编辑
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="跟进人">
                                    <SelectLoginUser
                                            v-if="isEdit"
                                            :userId.sync="detailForm.follower_user.account_user_id"
                                            :option="detailForm.follower_user.account_user_id ? [{
                                            id:detailForm.follower_user.account_user_id,
                                            nick_name:detailForm.follower_user.name,
                                        }] : null">
                                    </SelectLoginUser>
                                    <div class="form-border-bottom" v-else>
                                        <span class="left">{{(detailForm.follower_user?detailForm.follower_user.name:'') | defaultStr}}</span>
                                        <el-button size="mini" class="right" type="primary"
                                                   v-if="!detailForm.follower_user.account_user_id && detailForm.id && ['DRAFT','INQUIRY_SENT','INQUIRY_PUSHED'].indexOf(detailForm.inquriy_state)>-1"
                                                   @click="clickSetFollowerToMe">
                                            指派给自己
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="供应商付款方式">
                                <span class="form-border-bottom">
                                    <span v-if="detailForm.inquiry_supplier_company">{{detailForm.inquiry_supplier_company.payment_method | paymentMethod}}</span>
                                </span>
                                </el-form-item>
                                <el-form-item label="已询供应商">
                                    <div class="form-border-bottom">
                                        <template  v-if="detailForm.has_inquiry_supplier_list && detailForm.has_inquiry_supplier_list.length>0">
                                            <p v-for="(item,$index) in detailForm.has_inquiry_supplier_list" :key="$index">
                                                <router-link class="blue" target="_blank" :to="'/partner/detail?id='+item.account_company_id">
                                                    {{item.company_name}}
                                                </router-link>
                                            </p>
                                        </template>
                                    </div>
                                </el-form-item>
                                <el-form-item label="推荐供应商">
                                    <div class="form-border-bottom">
                                        <template v-if="detailForm.recommend_supplier_list && detailForm.recommend_supplier_list.length>0">
                                            <p v-for="(item,$index) in detailForm.recommend_supplier_list" :key="$index">
                                                <router-link class="blue" target="_blank" :to="'/partner/detail?id='+item.account_company_id">
                                                    {{item.company_name}}
                                                </router-link>
                                            </p>
                                        </template>
                                    </div>
                                </el-form-item>
                                <div class="el-form-gray el-form-margin-small el-form-item-right">
                                    <el-form-item label="询价状态变更时间："  v-if="isAllowQuotation">
                                    <span class="form-border-bottom">
                                        {{detailForm.inquriy_state_change_time | zerosoCompanyTime}}
                                    </span>
                                    </el-form-item>
                                </div>
                            </template>
                        </el-col>

                    </el-row>
                </el-form>
            </div>



            <inquiryQuotationDetailProduct
                    ref="inquiryQuotationDetailProduct"
                    v-if="detailForm.id"
                    :queryId="queryId"
                    :detailForm="detailForm"
                    :isAlreadyExpenseApproved="isAlreadyExpenseApproved"
                    :isAlreadySignedContract="isAlreadySignedContract"
                    :isAllowQuotation="isAllowQuotation"
                    :hasEditAction.sync="hasEditAction"
                    :supplierListData="supplierListData"
                    :currency="currency"
                    :isZerosoCreated="isZerosoCreated"
                    @update="getDetailData">
            </inquiryQuotationDetailProduct>



            <el-card class="margin-bottom-20" v-if="detailForm.id">
                <h3  slot="header">处理日志</h3>
                <el-row type="flex" :gutter="40" style="margin:0">
                    <el-col :span="12">
                        <h4 class="margin-bottom-5">联营公司消息</h4>
                        <related-message-detail-content
                                :headerHidden="true"
                                height="350px"
                                :inquiryQuotationId="detailForm.id"
                                :sendBrandId="detailForm.brand.id"
                                :module_id="detailForm.id+''"
                                module_name="quote"
                                subsystem="inquiry"
                                @update="$refs.emailMessageCountButton1 ? $refs.emailMessageCountButton1.getMessageCount() : null">
                        </related-message-detail-content>
                    </el-col>
                    <el-col :span="12">
                        <h4 class="margin-bottom-5">日志</h4>
                        <related-message-detail-content
                                :headerHidden="true"
                                height="350px"
                                :inquiryId="detailForm.id"
                                :sendBrandId="detailForm.brand.id"
                                :module_id="detailForm.id+''"
                                module_name="quote_inquiry"
                                subsystem="inquiry"
                                @update="$refs.emailMessageCountButton ? $refs.emailMessageCountButton.getMessageCount() : null">
                        </related-message-detail-content>
                    </el-col>
                </el-row>
            </el-card>

            <el-card class="margin-bottom-20" v-if="queryId">
                <div slot="header" class="clearfix">
                    <h3 class="left">报价明细</h3>
                </div>
                <el-row class="el-form-item-right el-form-gray el-form-margin-small">
                    <el-form label-width="170px">
                        <el-col :span="10">

                            <el-form-item label="货物操作及包装费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.product_item_based_fees.handling_and_packing_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="海外出口报关费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.product_item_based_fees.overseas_customs_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="中国进口清关费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.product_item_based_fees.domestic_customs_clearance_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>

                            <el-form-item label="供货商提货费：">
                                <div class="form-border-bottom">
                                    <inquiry-quotation-detail-edit-supplier-pick-up-fees
                                            v-if="detailForm.inquiry_quote_state !== 'CONTRACT_ENFORCED'"
                                            :queryId="queryId"
                                            :detailForm="detailForm"
                                            @update="init">
                                    </inquiry-quotation-detail-edit-supplier-pick-up-fees>
                                    <span class="red" v-if="detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee">
                                        （
                                        自定义：{{detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee | formatMoney('EUR') | inquiryPriceNormalText}}，
                                        系统：{{detailForm.procurement_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees | formatMoney('EUR') | inquiryPriceNormalText}}
                                        ）
                                    </span>
                                    <span>
                                        {{(
                                        detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee && detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee > detailForm.procurement_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees ?
                                        detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee : detailForm.procurement_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees
                                        ) | formatMoney('EUR') | inquiryPriceNormalText}}
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="国际物流费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.product_weight_based_fees.international_logistics_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="国内物流费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.product_weight_based_fees.domestic_logistics_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>

                            <el-form-item label="海外仓储操作费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.optional_service_fees.oversee_storage_service_fee | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="中国仓储操作费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.optional_service_fees.domestic_storage_service_fee | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>

                            <el-form-item label="保险费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.extra_charges.insurance_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="换汇手续费：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.extra_charges.foreign_exchange_fees | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="附加费总计：">
                                    <span class="form-border-bottom">
                                        {{detailForm.procurement_price.additional_charges.extra_charges.extra_charges_total | formatMoney('EUR') | inquiryPriceNormalText}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="产品总价：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.total_products_price | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="增值税：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.additional_charges.extra_charges.value_add_tax | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="外币总价：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.grand_price | formatMoney('EUR') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="人民币总价：">
                                <span class="form-border-bottom">{{detailForm.procurement_price.grand_cny_price | formatMoney('CNY') | inquiryPriceNormalText}}</span>
                            </el-form-item>
                            <el-form-item label="优惠金额：">
                                <div class="form-border-bottom">
                                        <span class="red" v-if="detailForm.procurement_price.additional_charges.discount_amount || detailForm.procurement_price.additional_charges.discount_amount===0">
                                            {{detailForm.procurement_price.additional_charges.discount_amount>0 ? '-' : '+'}}
                                            {{detailForm.procurement_price.additional_charges.discount_amount | zerosoAbs | formatMoney('CNY')}}
                                        </span>
                                    <span v-else>无优惠</span>
                                </div>
                            </el-form-item>
                            <el-form-item v-if="detailForm.procurement_price.additional_charges.discount_amount">
                                优惠前总价：
                                <span class="delete">
                                       {{(detailForm.procurement_price.grand_cny_price+detailForm.procurement_price.additional_charges.discount_amount)  | formatMoney('CNY')}}
                                    </span>
                            </el-form-item>
                            <el-form-item label="优惠原因：" v-if="detailForm.inquiry_quotation_sheet_discount">
                                <div class="form-border-bottom">
                                    {{detailForm.inquiry_quotation_sheet_discount.discount_reason | defaultStr}}
                                </div>
                            </el-form-item>
                            <el-form-item v-if="detailForm.inquiry_quote_state !== 'CONTRACT_ENFORCED'">
                                <inquiry-quotation-detail-edit-discount-money :queryId="queryId" :detailForm="detailForm" @update="init"></inquiry-quotation-detail-edit-discount-money>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-button class="margin-left-10" v-if="isAlreadyExpenseApproved" size="mini" @click="clickPriceCalculator()">导入价格计算器</el-button>
                        </el-col>
                    </el-form>
                </el-row>
            </el-card>
        </div>

        <price-calculator ref="priceCalculator" :isImport="true"></price-calculator>

        <inquiry-price-detail-refused-quote
                ref="refusedQuote"
                @refusedQuoteSubmit="markRefusedQuoteSubmit">
        </inquiry-price-detail-refused-quote>

    </div>
</template>

<script>
    import inquiryQuotationDetailProduct from "./component/inquiry-quotation-detail-product";
    import OrderUtils from "../order/order-utils";
    import InquirySheetState from "./component/InquirySheetState";
    import InquiryQuotationDetailEditDiscountMoney from "./component/inquiry-quotation-detail-edit-discount-money";
    import InquiryQuotationDetailCancel from "./component/inquiry-quotation-detail-cancel";
    import EmailMessageCountButton from "../related-message/email-message-count-button";
    import PriceCalculator from "../user/priceCalculator";
    import SupplierInquiryState from "../inquiry-price/component/SupplierInquiryState";
    import RelatedMessageDetailContent from "../related-message/component/related-message-detail-content";
    import InquiryPriceDetailRefusedQuote from "../inquiry-price/component/inquiry-price-detail-refused-quote";
    import InquiryQuotationDetailEditSupplierPickUpFees
        from "./component/inquiry-quotation-detail-edit-supplier-pick-up-fees";

    export default {
        components: {
            InquiryQuotationDetailEditSupplierPickUpFees,
            InquiryPriceDetailRefusedQuote,
            RelatedMessageDetailContent,
            SupplierInquiryState,
            PriceCalculator,
            EmailMessageCountButton,
            InquiryQuotationDetailCancel,
            InquiryQuotationDetailEditDiscountMoney,
            InquirySheetState,
            inquiryQuotationDetailProduct,
        },
        data() {
            return {
                queryId: '',
                parentQuery: '',
                sheetType: undefined,
                breadNameList: {
                    DRAFT: '待询价',
                    INQUIRY_SENT: '已询价',
                    INQUIRY_SENT_TIMEOUT: '待催价',
                    INQUIRY_PUSHED: '已催价',
                    INQUIRY_REPLIED: '已报价',
                    CANCELED: '已取消',
                    CONTRACT_ENFORCED: '已下单',
                    ALL: '全部',
                },


                isEdit: false,
                detailForm: {},
                detailFormRule: {},


                supplierListData:[],
                recommendOption:[],
                supplierNormalSelectId:null,


                loading: false,
                hasEditAction: false,

                currency: 'EUR',
            }
        },
        computed: {
            isAlreadySignedContract() {//已签合同之后
                return ['CONTRACT_SIGNED', 'CONTRACT_ENFORCED'].indexOf(this.detailForm.inquiry_quote_state) > -1
            },
            isAlreadyExpenseApproved() {//已核准税费之后，新版状态为已回询价之后
                return ['EXPENSE_APPROVED','INQUIRY_REPLIED','QUOTATION_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'CONTRACT_ENFORCED'].indexOf(this.detailForm.inquiry_quote_state) > -1
            },
            isAllowQuotation() {//判断是否在当前询报价单上报价
                return this.detailForm.brand_quote_state === "none"
            },
            isZerosoCreated() {//判断是否在0端创建的询报价单，并且是当前角色创建的
                return this.detailForm.is_zeroso_created && this.detailForm.supplier.user.account_user_id === this.$store.state.currentCompany.user_id
            },
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


                self.detailForm = {
                    brandName: '',
                    "brand": {
                        "agency_state": "",
                        "country": "",
                        "id": "",
                        "name": "",
                        "state": ""
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
                    inquiry_supplier_company:{},
                    follower_user:{},
                };


                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                }
            },
            getDetailData(callback) {
                let self = this;
                self.isEdit = false;
                self.hasEditAction = false;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId,
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
                        if (!data.inquiry_supplier_company) data.inquiry_supplier_company = {};
                        data.inquirySupplierCompanyId = data.inquiry_supplier_company.account_company_id;
                        if (!data.follower_user) data.follower_user = {};

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

                        if (data.products) {
                            for (let i = 0; i < data.products.length; i++) {
                                data.products[i].productMinQty = null;
                                data.products[i].priceDescription = null;
                                data.products[i].brand_id = data.brand.id;
                                data.products[i].product_name = data.products[i].type_no;
                                data.products[i].product_order_no = data.products[i].order_no;
                                data.products[i].product_trade_name = data.products[i].type_name ? JSON.parse(JSON.stringify(data.products[i].type_name)) : {
                                    "chinese_name": "",
                                    "english_name": ""
                                };
                                delete data.products[i].type_name;
                                data.products[i].product_parameter = data.products[i].parameters;
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
                                }else if (!data.products[i].prodcut_quotation.procurement.total_price_with_tariff) {
                                    data.products[i].prodcut_quotation.procurement.total_price_with_tariff = null;
                                }
                                if (!data.products[i].prodcut_quotation.sales) {
                                    data.products[i].prodcut_quotation.sales = {
                                        "price": null,
                                        "tariff": null,
                                        "total_price_with_tariff": null,
                                    }
                                }else if (!data.products[i].prodcut_quotation.sales.total_price_with_tariff) {
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
                        if(callback) callback();
                        self.getSupplierListData();
                    },
                    error(data){
                        if(data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(300001)>-1){
                            self.$router.push('list');
                        }
                    }
                })
            },

            clickPriceCalculator(){
                let self = this;
                self.loading=true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/getCalcParams',
                    success: function (data) {
                        self.loading=false;
                        let productPriceMap = data;
                        let listData = [];
                        self.detailForm.products.forEach((item)=>{
                            if (item.product_quote_state!=='INVALID' && item.product_quote_state!=='REPLACED' && !item.mark_as_deleted && !item.mark_as_ccc && item.product_quote_state!=='QUOTE_REFUSED') {
                                let price = '';
                                let discount = '';
                                let supplier_payment_method = 'other';
                                if(productPriceMap[item.product_id]){
                                    if(productPriceMap[item.product_id].supplier_payment_method && ["invoiced_with_discount_payment","invoiced_without_discount_payment","advance_before_delivery_payment","advance_after_order_payment"].indexOf(productPriceMap[item.product_id].supplier_payment_method)>-1){
                                        supplier_payment_method = productPriceMap[item.product_id].supplier_payment_method;
                                    }
                                    let priceList = productPriceMap[item.product_id].tiered_price_list;
                                    for(let i=0;i<priceList.length;i++){
                                        if(item.prodcut_quotation.quantity >= priceList[i].min_qty){
                                            price = priceList[i].price;
                                            if(priceList[i].discount){
                                                discount = priceList[i].discount * 100;
                                            }else if(priceList[i].discount_serie && priceList[i].discount_serie.discount){
                                                discount = priceList[i].discount_serie.discount * 100;
                                            }else {
                                                discount = 0;
                                            }

                                        }
                                    }
                                }
                                listData.push({
                                    product_name:item.product_name,
                                    product_order_no:item.product_order_no,
                                    qty:item.prodcut_quotation.quantity,
                                    price:price,
                                    discount:discount,
                                    gross_weight: (!item.gross_weight || item.gross_weight==='0') && item.estimated_weight ? item.estimated_weight : item.gross_weight,
                                    tariff_rate:item.product_customs_info.tariff_rate || item.product_customs_info.tariff_rate===0 ? item.product_customs_info.tariff_rate : item.forecast_import_tariff,
                                    extra_import_tariff:item.extra_import_tariff,
                                    supplier_payment_method:supplier_payment_method
                                })
                            }
                        });
                        self.$refs.priceCalculator.clickShow({
                            exchange_rate:self.detailForm.currency_unit.exchange_rate,
                            delivery_mode:self.detailForm.supplier.delivery_mode,
                            discount_amount:self.detailForm.procurement_price.additional_charges.discount_amount,
                            custom_supply_take_delivery_fee:self.detailForm.procurement_price.additional_charges.custom_supply_take_delivery_fee,
                            listData:listData,
                        })
                    }
                });



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
            //保存供应商和跟进人
            clickSaveSupplierAndFollower(follower_id) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/essentials',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        "follower_id": follower_id || self.detailForm.follower_user.account_user_id,
                        "supplier_id": self.detailForm.inquirySupplierCompanyId,
                    },
                    success: function () {
                        self.loading = false;
                        self.isEdit = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.init();
                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.init()
            },
            //点击跟进人修改为自己
            clickSetFollowerToMe(){
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                self.$confirm('确认指派给自己吗？', '提示', {
                    confirmButtonText: '确定执行',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.getDetailData(()=>{
                                if (self.detailForm.follower_user && self.detailForm.follower_user.account_user_id) {
                                    self.$message({
                                        showClose: true,
                                        message: '当前询报价单已绑定跟进人为 '+self.detailForm.follower_user.name+'，无需指派！',
                                        type: 'error'
                                    });
                                    return
                                }
                                self.clickSaveSupplierAndFollower(self.$store.state.userInfo.id);
                            });

                        }
                    }
                });
            },

            //修改询价单状态
            changeInquiryState() {
                let self = this;
                if (!self.detailForm.follower_user || !self.detailForm.follower_user.account_user_id) {
                    self.$message({
                        showClose: true,
                        message: '请先绑定跟进人！',
                        type: 'error'
                    });
                    return
                }
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                if (self.detailForm.inquriy_state==='DRAFT') {
                    self.loading = true;
                    self.$refs.emailMessageCountButton.getMessageCount((messageCountData)=>{
                        self.loading = false;
                        if (messageCountData.mail===0 && messageCountData.message===0) {
                            self.$message({
                                showClose: true,
                                message: '当前询价单无相关邮件，并且无相关日志，不可变更为已询价，至少需要在日志中留言！',
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
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/state',
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
                    if (this.$refs.inquiryQuotationDetailProduct && this.$refs.inquiryQuotationDetailProduct.productListData) {
                        for(let i=0;i<this.$refs.inquiryQuotationDetailProduct.productListData.length;i++){
                            let productItem=this.$refs.inquiryQuotationDetailProduct.productListData[i];
                            console.log(productItem)
                            if (!(
                                    productItem.mark_as_deleted
                                    || (productItem.price_list && productItem.price_list.length>0)
                                    || productItem.product_quote_state==='INVALID'
                                    || productItem.product_quote_state==='REPLACED'
                                    || productItem.product_quote_state==='QUOTE_REFUSED'
                                    || (productItem.prodcut_quotation && productItem.prodcut_quotation.procurement && productItem.prodcut_quotation.procurement.price)
                                    || (productItem.productMinQty && productItem.prodcut_quotation.quantity<productItem.productMinQty)
                            )) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行产品未处理，除了已删除产品，其他产品必须选择：编辑价格、标记无效、标记替代、标记不报价！',
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
                            if (action === 'confirm') {
                                self.changeQuotationStateSubmit(true)
                            }
                        }
                    })
                } else {
                    if (this.detailForm.products) {
                        for(let i=0;i<this.detailForm.products.length;i++){
                            let productItem=this.detailForm.products[i]
                            if (
                                    (productItem.price_list && productItem.price_list.length>0)
                                    || productItem.product_quote_state==='INVALID'
                                    || productItem.product_quote_state==='REPLACED'
                            ) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行产品已处理为：填入价格、标记无效、标记替代，此单不能标记不报价，如果只是部分产品不报价，请在单行产品中标记不报价，然后整单标记已报价！',
                                    type: 'error'
                                });
                                return
                            }
                            if (
                                    productItem.prodcut_quotation && productItem.prodcut_quotation.procurement && productItem.prodcut_quotation.procurement.price
                            ) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行产品已有报价，此单不能标记不报价，如果只是部分产品不报价，请在单行产品中标记不报价，然后整单标记已报价！',
                                    type: 'error'
                                });
                                return
                            }
                        }
                    }
                    self.$refs.refusedQuote.init();
                }
            },
            changeQuotationStateSubmit(quotation,data) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/quotation',
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
                        self.markAsNotQuotationShow = false;
                        self.getDetailData();
                    }
                });
            },
            //标记不报价数据提交
            markRefusedQuoteSubmit(data){
                this.changeQuotationStateSubmit(false,data)
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













            goToOrderDetail(contract_no) {
                OrderUtils.goToOrderDetail(contract_no,true)
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
</style>
