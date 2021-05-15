export default [
    {
        name: '待处理',
        icon: 'el-icon-s-ticket',
        badge:0,
        action:'submitCallback',
        children: [
            /*{
                name: '总览',
                path: '/pending/dashboard',
            },*/
            {
                name: '邮件',
                badge:0,
                callback:'pendingEmailCallback',
                action:'pendingEmailCallback',
                path: '/email/waiting/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522asc%2522%257D',
                index: '/email/waiting/list',
            },{
                name: '消息',
                badge:0,
                callback:'pendingMessageCallback',
                action:'pendingMessageAction',
                index: '/related/message-list/waiting',
            },{
                name: '邮件书签',
                path: '/email/tag/list',
            },{
                name: '消息书签',
                path: '/related/message-tag-list-message',
            },
        ]
    },
    {
        name: '询价单',
        icon: 'el-icon-phone',
        children: [
            {
                name: '跟进中',
                path: '/inquiry-price/OTHERS/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/OTHERS/list',
            }, {
                name: '不报价',
                path: '/inquiry-price/QUOTE_REFUSED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/QUOTE_REFUSED/list',
            }, {
                name: '已报价',
                path: '/inquiry-price/QUOTED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/QUOTED/list',
            }, {
                name: '所有',
                path: '/inquiry-price/all/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/all/list',
            },
        ]
    },
    {
        name: '询价池',
        icon: 'el-icon-data-analysis',
        children: [
            {
                name: '无价格表',
                path: '/inquiry-price-pool/NO_PRICE/list',
            }, {
                name: '有商城',
                path: '/inquiry-price-pool/HAS_MALL/list',
            }, {
                name: '有价格表',
                path: '/inquiry-price-pool/HAS_PRICE/list',
            },
        ]
    },
    {
        name: '核准池',
        icon: 'el-icon-guide',
        path: '/approval-pool/list',
    },
    {
        name: '询报价单',
        icon: 'el-icon-goods',
        children: [
            {
                name: '待询价',
                path: '/inquiry-quotation/DRAFT/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/DRAFT/list',
            },{
                name: '已询价',
                path: '/inquiry-quotation/INQUIRY_SENT/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/INQUIRY_SENT/list',
            },{
                name: '待催价',
                path: '/inquiry-quotation/INQUIRY_SENT_TIMEOUT/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/INQUIRY_SENT_TIMEOUT/list',
            },{
                name: '已催价',
                path: '/inquiry-quotation/INQUIRY_PUSHED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/INQUIRY_PUSHED/list',
            },{
                name: '已报价',
                path: '/inquiry-quotation/INQUIRY_REPLIED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/INQUIRY_REPLIED/list',
            },{
                name: '已取消',
                path: '/inquiry-quotation/CANCELED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/CANCELED/list',
            },{
                name: '已下单',
                path: '/inquiry-quotation/CONTRACT_ENFORCED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/CONTRACT_ENFORCED/list',
            },{
                name: '全部',
                path: '/inquiry-quotation/ALL/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-quotation/ALL/list',
            },
        ]
    },

    {
        name: '订单',
        icon: 'el-icon-s-order',
        children: [
            {
                name: '执行中订单',
                path: '/order/order/processing/list?order_by=%257B%2522field_name%2522%253A%2522write_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/processing/list',
            }, {
                name: '已完结订单',
                path: '/order/order/done/list?order_by=%257B%2522field_name%2522%253A%2522write_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/done/list',
            }, {
                name: '已取消订单',
                path: '/order/order/cancelled/list?order_by=%257B%2522field_name%2522%253A%2522write_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/cancelled/list',
            }, {
                name: '全部订单',
                path: '/order/order/all/list?order_by=%257B%2522field_name%2522%253A%2522write_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/all/list',
            }, {
                name: '收款记录',
                path: '/finance/bank-statement-line/need_inbound/list',
            },
        ]
    },

    {
        name: '产品库',
        icon: 'el-icon-s-goods',
        children: [
            {
                name: '品牌',
                path: '/product/brand/list',

            }, {
                name: '产品',
                path: '/product/product/list',

            }, {
                name: '海关信息',
                path: '/product/customs-info/list',

            }, {
                name: '品名信息',
                path: '/product/product-trade-name/list',

            },
        ]
    },
    {
        name: '产品中心',
        icon: 'el-icon-s-goods',
        children: [
            {
                name: '品牌管理',
                path: '/new-product/brand/list',
            },{
                name: '产品管理',
                children: [
                    {
                        name: '产品目录管理',
                        path: '/new-product/product-catalog/list',
                    },/*{
                        name: '产品列表',
                        path: '/new-product/product/list',
                    },*/{
                        name: '设置',
                        path: '/new-product/setting/additional-key',
                    },
                ]
            },{
                name: '商品管理',
                children: [
                    {
                        name: '价格表管理',
                        path: '/new-product/price/list',
                    }, /*{
                        name: '价格列表',
                        path: '/new-product/price/sku-list',
                    },*/
                ]
            }, {
                name: '海关信息',
                path: '/new-product/customs/list',
            }, {
                name: '增值税品名',
                path: '/new-product/trade-name/list',
            }, {
                name: '标签管理',
                path: '/new-product/tags/list',
            },
        ]
    },
    {
        name: '合作伙伴',
        icon: 'el-icon-user-solid',
        path: '/partner/list',
    },
    {
        name: '邮箱',
        icon: 'el-icon-message',
        children: [
            {
                name: '写邮件',
                action: 'clickWriteEmail',
                index: 'clickWriteEmail',
            }, {
                name: '收件箱',
                path: '/email/received/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/received/list',
            }, {
                name: '发件箱',
                path: '/email/sending/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/sending/list',
            }, {
                name: '已发送',
                path: '/email/sent/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/sent/list',
            }, {
                name: '草稿',
                path: '/email/draft/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/draft/list',
            }, {
                name: '已删除',
                path: '/email/deleted/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/deleted/list',
            }, {
                name: '垃圾箱',
                path: '/email/junk/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/junk/list',
            }, {
                name: '所有',
                path: '/email/all/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/all/list',
            },  {
                name: '黑白名单',
                path: '/email/all/blacklist?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/all/blacklist',
            },
        ]
    },
    {
        name: '仓库',
        icon: 'el-icon-s-shop',
        children: [
            {
                name: '快递签收',
                path: '/logistics/packages/list?filter=%255B%255B%2522state%2522%252C%2522%253D%2522%252C%2522normal%2522%255D%255D&order_by=%257B%2522field_name%2522%253A%2522partner_company%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/logistics/packages/list',
            }, {
                name: '入库',
                path: '/logistics/stockIn/list?filter=%255B%255B%2522state%2522%252C%2522%253D%2522%252C%2522normal%2522%255D%255D&order_by=%257B%2522field_name%2522%253A%2522forecast_received_date%2522%252C%2522by%2522%253A%2522asc%2522%257D',
                index: '/logistics/stockIn/list',
            }, {
                name: '调拨',
                path: '/logistics/transfers/list',
            }, {
                name: '订单箱',
                path: '/logistics/box/order/list?filter=%255B%255B%2522box_state%2522%252C%2522%253D%2522%252C%2522default%2522%255D%255D&order_by=%257B%2522field_name%2522%253A%2522belong_to_company_time%2522%252C%2522by%2522%253A%2522asc%2522%257D',
                index: '/logistics/box/order/list',
            }, {
                name: '库存箱',
                path: '/logistics/box/stock/list',
            }, {
                name: '托盘',
                path: '/logistics/pallets/list?filter=%255B%255B%2522state%2522%252C%2522%253D%2522%252C%2522default%2522%255D%255D',
                index: '/logistics/pallets/list',
            }, {
                name: '出库',
                path: '/logistics/stockOut/list',
                index: '/logistics/stockOut/list',
            },
        ]
    },
    {
        name: '财务',
        icon: 'el-icon-s-finance',
        permissionsCode: ['AccountingNeed', 'AdminNeed', 'BookMoneyAdminNeed'],
        children: [
            {
                name: '银行对账单',
                path: '/finance/bank-statement/list',
            }, {
                name: '未核销流水',
                path: '/finance/bank-statement-line/no_reconciled/list',
            }, {
                name: '应付款项',
                path: '/finance/prepaid/list?filter=%255B%255B%2522status%2522%252C%2522%253D%2522%252C%2522normal%2522%255D%255D',
                index: '/finance/prepaid/list',
            }, {
                name: '客户发票',
                path: '/finance/invoice/customer/list?order_by=%257B%2522field_name%2522%253A%2522customer_company%2522%252C%2522by%2522%253A%2522desc%2522%257D&filter=%255B%255B%2522invoice_status%2522%252C%2522%253D%2522%252C%2522normal%2522%255D%255D&pageNum=1',
                index: '/finance/invoice/customer/list',
            }, {
                name: '供应商发票',
                path: '/finance/invoice/supplier/list?order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D&filter=%255B%255B%2522invoice_status%2522%252C%2522%253D%2522%252C%2522normal%2522%255D%255D&pageNum=1',
                index: '/finance/invoice/supplier/list',
            }, {
                name: '会计凭证区间',
                path: '/finance/account-documents/period',
            }, {
                name: '会计凭证列表',
                path: '/finance/account-documents/list?order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/finance/account-documents/list',
            }, {
                name: '会计凭证行列表',
                path: '/finance/account-documents/line-list?order_by=%257B%2522field_name%2522%253A%2522invoice_date%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/finance/account-documents/line-list',
            }, {
                name: '科目一览表',
                path: '/finance/account/list',
            }, {
                name: '财务设置',
                path: '/finance/setting/base',
            }, {
                name: '科目设置',
                path: '/finance/subject-setting',
            },
        ]
    },
    {
        name: '官网',
        icon: 'el-icon-s-finance',
        children: [
            {
                name: '联系我们',
                path: '/www/contact-us/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/www/contact-us/list',
            }, {
                name: '新闻管理',
                path: '/www/news/list',
                index: '/www/news/list',
            },
        ]
    },


]