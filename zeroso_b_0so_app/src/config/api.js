import Vue from 'vue'
import HostConfig from './host-config'


Vue.prototype.$api = {
  //登录页
    account_login : HostConfig.partnerHost + '/account/login',
    account_logout : HostConfig.partnerHost + '/account/logout',
    account_get_verify_code : HostConfig.partnerHost + '/account/get_verify_code',
    account_current_user : HostConfig.partnerHost + '/v5/account/login/current_user',



    //订单系统
    order_order_search : HostConfig.orderHost + '/v4/order/search',
    order_order_accurate_search : HostConfig.orderHost + '/v4/order/accurate_search',
    order_order_orders : HostConfig.orderHost + '/v4/order/orders',
    order_order_inquiry_orders : HostConfig.orderHost + '/v4/order/inquiry_orders',
    order_boxes_location : HostConfig.orderHost + '/boxes/location',
    order_order_order_lines : HostConfig.orderHost + '/v4/order/order_lines',
    order_order_util_get_order_id_by_order_name : HostConfig.orderHost + '/v4/order/util/get_order_id_by_order_name',
    order_order_accounting_waiting_invoice : HostConfig.orderHost + '/v4/order/accounting/waiting_invoice',

    order_route_log : HostConfig.orderHost + '/route_log',
    order_delivery_packages : HostConfig.orderHost + '/delivery_packages',
    order_incoming_transfers : HostConfig.orderHost + '/incoming_transfers',
    order_request_transfers : HostConfig.orderHost + '/request_transfers',
    order_boxes_box_lines_search : HostConfig.orderHost + '/boxes/box_lines/search',
    order_boxes : HostConfig.orderHost + '/boxes',
    order_boxes_available_boxes : HostConfig.orderHost + '/boxes/available_boxes',
    order_boxes_export_order_box_excel : HostConfig.orderHost + '/boxes/export_order_box_excel',
    order_pallets : HostConfig.orderHost + '/pallets',
    order_pallets_available_pallets : HostConfig.orderHost + '/pallets/available_pallets',
    order_outgoing_transfers : HostConfig.orderHost + '/outgoing_transfers',
    order_third_delivery_trace_log : HostConfig.orderHost + '/third_delivery/trace_log',

    order_v4_order_order_report : HostConfig.orderHost + '/v4/order/order_report',
    order_v4_panel_need_to_do : HostConfig.orderHost + '/v4/panel/need_to_do',
    order_v4_panel_business_info : HostConfig.orderHost + '/v4/panel/business_info',
    order_v4_panel_months : HostConfig.orderHost + '/v4/panel/months',


    //合作伙伴系统
    partner_companies_search : HostConfig.partnerHost + '/v4/partner/companies/search',
    partner_search : HostConfig.partnerHost + '/v4/partner/search',
    partner_companies_detail : HostConfig.partnerHost + '/v4/partner/companies',
    partner_companies_v2 : HostConfig.partnerHost + '/v2/partner/companies',
    partner_companies_v5 : HostConfig.partnerHost + '/v5/partner/companies',
    partner_relation_companies_v2 : HostConfig.partnerHost + '/v2/partner/relation/companies',
    partner_all_internal_users : HostConfig.partnerHost + '/v4/self/all_internal/users',
    partner_companies_accurate_search : HostConfig.partnerHost + '/v4/partner/companies/accurate_search',
    partner_self_user_filters : HostConfig.partnerHost + '/v2/self/user/filters',
    partner_brands_v2 : HostConfig.partnerHost + '/v2/partner/brands',
    partner_relation_v2 : HostConfig.partnerHost + '/v2/partner/relation',
    partner_relation_brands_v2 : HostConfig.partnerHost + '/v2/partner/relation/brands',
    partner_zeroso_company : HostConfig.partnerHost + '/v5/zeroso_company',
    partner_internal_companies : HostConfig.partnerHost + '/v5/partner/internal_companies',
    //个人相关
    self_my_password: HostConfig.partnerHost+'/v2/self/my/password',
    partner_v5_self_my_info: HostConfig.partnerHost+'/v5/self/my_info',
    partner_v2_self_company: HostConfig.partnerHost+'/v2/self/company',
    login_user_fuzzy_search: HostConfig.partnerHost+'/v5/login_user/fuzzy_search',
    partner_account_login_current_user: HostConfig.partnerHost+'/v5/account/login/current_user',
    partner_self_defaults_third_delivery: HostConfig.partnerHost+'/v2/self/settings/defaults/third_delivery',
    partner_v2_self_settings_defaults_accounting : HostConfig.partnerHost + '/v2/self/settings/defaults/accounting',
    partner_v2_self_settings_defaults_platform : HostConfig.partnerHost + '/v2/self/settings/defaults/platform',
    partner_v5_zeroso_company : HostConfig.partnerHost + '/v5/zeroso_company',
    partner_v5_login_user: HostConfig.partnerHost + '/v5/login_user',
    partner_v2_self_permission_group: HostConfig.partnerHost + '/v2/self/permission/group',
    partner_v2_self_permission_permission: HostConfig.partnerHost + '/v2/self/permission/permission',
    partner_v2_self_permission_user: HostConfig.partnerHost + '/v2/self/permission/user',
    partner_v2_self_settings_defaults: HostConfig.partnerHost + '/v2/self/settings/defaults',
    partner_v4_self_multi_users: HostConfig.partnerHost + '/v4/self/multi/users',



    //银行相关
    bank_account_account_user : HostConfig.accountingHost + '/v4/bank_account/account_user',
    bank_account_bank_codes : HostConfig.accountingHost + '/v4/bank_account/bank_codes',
    bank_account_partner : HostConfig.accountingHost + '/v4/bank_account/partner',
    bank_account_update : HostConfig.accountingHost + '/bank_account',
    bank_bank_statement : HostConfig.accountingHost + '/bank_statement',
    bank_bank_statement_line : HostConfig.accountingHost + '/bank_statement_line',
    bank_bank_statement_line_v4 : HostConfig.accountingHost + '/v4/bank_statement_line',
    bank_self_bank_account : HostConfig.accountingHost + '/v4/self/bank_account',
    bank_payment_need_outbound : HostConfig.accountingHost + '/v4/payment/need_outbound',
    bank_payment_manual_outbound : HostConfig.accountingHost + '/v4/payment/manual/outbound',
    bank_bank_statement_relation : HostConfig.accountingHost + '/v4/bank_statement_relation',
    bank_customer_invoice_search : HostConfig.accountingHost + '/v4/customer/invoice_search',
    bank_supplier_invoice_search : HostConfig.accountingHost + '/v4/supplier/invoice_search',
    bank_invoices : HostConfig.accountingHost + '/invoices',
    bank_invoice : HostConfig.accountingHost + '/invoice',
    bank_invoices_v4 : HostConfig.accountingHost + '/v4/invoices',
    bank_invoice_v4 : HostConfig.accountingHost + '/v4/invoice',
    bank_v4_invoice_batch_make_delivery : HostConfig.accountingHost + '/v4/invoice/batch_make_delivery',
    bank_payment_invoice : HostConfig.accountingHost + '/v4/payment/invoice',
    bank_invoices_query_invoice : HostConfig.accountingHost + '/v4/invoices/query_invoice',
    bank_invoices_generate_by_order : HostConfig.accountingHost + '/v4/invoice/generate_by_order',
    bank_payment : HostConfig.accountingHost + '/v4/payment',
    bank_statement_relation_order_remaining_money : HostConfig.accountingHost + '/v4/bank_statement_relation/order/remaining_money',
    createInvoiceXML : HostConfig.accountingHost + '/v4/invoice/create_invoice_xml',
    bank_v4_invoice_generate_by_box_line : HostConfig.accountingHost + '/v4/invoice/generate_by_box_line',
    bank_account : HostConfig.accountingHost + '/account',
    bank_v4_account_move : HostConfig.accountingHost + '/v4/account_move',
    bank_v4_account_move_line : HostConfig.accountingHost + '/v4/account_move_line',
    bank_v4_account_move_line_export_excel : HostConfig.accountingHost + '/v4/account_move_line/export_excel',
    bank_v4_account_fiscalyear : HostConfig.accountingHost + '/account_fiscalyear',
    bank_account_period : HostConfig.accountingHost + '/account_period',
    bank_v4_account_period : HostConfig.accountingHost + '/v4/account_period',
    bank_account_type : HostConfig.accountingHost + '/account_type',
    bank_v4_config_basic_info : HostConfig.accountingHost + '/v4/config/basic_info',
    bank_v4_config_third_info : HostConfig.accountingHost + '/v4/config/third_info',
    bank_currency_exchange_rate : HostConfig.accountingHost + '/currency/exchange_rate',



    //文件系统相关
    file_unique_file: HostConfig.fileHost + '/file/unique_file',//该接口上传，会先删除旧文件
    file_files_list: HostConfig.fileHost + '/file/files',//该接口上传，会累加，不会删除旧文件
    file_file: HostConfig.fileHost + '/file/file',//访问文件路径
    file_report_template_download: HostConfig.fileHost + '/report/template/download',//访问文件路径
    file_mail_templates: HostConfig.fileHost + '/mail/templates',//邮件模板列表
    file_report_templates_search: HostConfig.fileHost + '/report/templates/search',//合同模板列表
    file_report_template_generate: HostConfig.fileHost + '/report/template/generate',//生成报告模板文件

    //品牌、产品相关
    product_brands_search: HostConfig.productHost + '/brands/search',
    product_common_search_brand: HostConfig.productHost + '/common_search/brand',
    product_products_brands: HostConfig.productHost + '/products/brands',
    product_brand_v5 : HostConfig.productHost + '/v5/brand',
    product_product_manage_product : HostConfig.productHost + '/product_manage/product',
    product_common_search_product: HostConfig.productHost + '/common_search/product',
    product_products_search: HostConfig.productHost + '/products/search',
    product_ad_brands_user_v5: HostConfig.productHost + '/v5/ad_brands/user',
    product_ad_brands_relation_v5: HostConfig.productHost + '/v5/ad_brands/relation',
    //海关信息管理
    product_product_manage_product_customs_info : HostConfig.productHost + '/product_manage/product_customs_info',
    product_common_search_customs_info: HostConfig.productHost + '/common_search/customs_info',
    //品名查询
    product_product_manage_product_trade_name : HostConfig.productHost + '/product_manage/product_trade_name',
    product_common_search_product_trade_name : HostConfig.productHost + '/common_search/product_trade_name',
    //产品价格
    product_import : HostConfig.productHost + '/import',
    product_import_price : HostConfig.productHost + '/import/price',
    product_dict_comment_type : HostConfig.productHost + '/dict/comment_type',


    //邮件系统
    message_v5 : HostConfig.messageHost + '/v5',
    message_self_address_v3 : HostConfig.messageHost + '/v3/self/address',
    message_mail_v3 : HostConfig.messageHost + '/v3/mail',
    message_mail_search_filter_v3 : HostConfig.messageHost + '/v3/mail/search_filter',
    message_mail_email_search_v3 : HostConfig.messageHost + '/v3/mail/email_search',
    message_email_address_info_v4 : HostConfig.messageHost + '/v4/email_address/info',
    message_mail_address_white_black_v4 : HostConfig.messageHost + '/v4/mail/address/white_black',
    message_mail_address_white_black_v5 : HostConfig.messageHost + '/v5/mail/address/white_black',
    message_v3_mail_order_detail_message_count : HostConfig.messageHost + '/v3/mail/order_detail_message_count',
    message_v3_mail_module : HostConfig.messageHost + '/v3/mail/module',
    message_v4_multi_self_address : HostConfig.messageHost + '/v4/multi/self/address',
    message_v4_message: HostConfig.messageHost + '/v4/message',
    message_v4_message_order : HostConfig.messageHost + '/v4/message/order',
    message_v4_message_mark_deal : HostConfig.messageHost + '/v4/message/mark_deal',
    message_v4_message_mark_read : HostConfig.messageHost + '/v4/message/mark_read',
    message_v4_message_relation : HostConfig.messageHost + '/v4/message/relation',
    message_v4_message_search_filter : HostConfig.messageHost + '/v4/message/search_filter',
    message_book_mark_messages : HostConfig.messageHost + '/book_mark',
    message_book_mark_messages_search : HostConfig.messageHost + '/book_mark/messages/search',
    message_book_mark_mails_search : HostConfig.messageHost + '/book_mark/mails/search',


    //物流系统
    logistics_third_delivery_routes : HostConfig.logisticsHost + '/third_delivery/routes',




    //询盘中心
    inquiry_v6_quotations: HostConfig.inquiryHost+'/v6/quotations',
    inquiry_v6_pool: HostConfig.inquiryHost+'/v6/pool',
    inquiry_v6_pool_quotations: HostConfig.inquiryHost+'/v6/pool/quotations',
    inquiry_v6_brand_inquiries: HostConfig.inquiryHost+'/v6/brand-inquiries',
    inquiry_v6_brand_inquiries_inquiries: HostConfig.inquiryHost+'/v6/brand-inquiries/inquiries',
    inquiry_v6_verify_products: HostConfig.inquiryHost+'/v6/verify/products',
    inquiry_v6_verify: HostConfig.inquiryHost+'/v6/verify',
    inquiry_v6_quotations_products: HostConfig.inquiryHost+'/v6/quotations/products',
    inquiry_v6_quotations_getCalcParams: HostConfig.inquiryHost+'/v6/quotations/getCalcParams',



};
