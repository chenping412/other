export default [
    {
        name: '待处理',
        icon: 'el-icon-s-ticket',
        badge:0,
        action:'submitCallback',
        children: [
            {
                name: '邮件',
                permissionsCode:['mail'],
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
                permissionsCode:['mail'],
                path: '/email/tag/list',
            },{
                name: '消息书签',
                path: '/related/message-tag-list-message',
            },
        ]
    },
    {
        name: '询报价单',
        icon: 'el-icon-phone',
        permissionsCode:['inquiry'],
        children: [
            {
                name: '跟进中',
                path: '/inquiry-price/OTHERS/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/OTHERS/list',
            },{
                name: '已执行',
                path: '/inquiry-price/CONTRACT_ENFORCED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/CONTRACT_ENFORCED/list',
            },{
                name: '已取消',
                path: '/inquiry-price/CANCELED/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/CANCELED/list',
            },{
                name: '所有',
                path: '/inquiry-price/all/list?order_by=%257B%2522field_name%2522%253A%2522CREATE_TIME%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/inquiry-price/all/list',
            },
        ]
    },

    {
        name: '订单',
        icon: 'el-icon-s-order',
        permissionsCode:['order'],
        children: [
            {
                name: '执行中',
                path: '/order/order/processing/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/processing/list',
            },{
                name: '已完结',
                path: '/order/order/done/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/done/list',
            },{
                name: '已取消',
                path: '/order/order/cancelled/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/cancelled/list',
            },{
                name: '全部订单',
                path: '/order/order/all/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/order/order/all/list',
            },{
                name: '收款记录',
                path: '/finance/bank-statement-line/need_inbound/list',
            },
        ]
    },

    {
        name: '产品库',
        icon: 'el-icon-s-goods',
        permissionsCode:['products'],
        children: [
            {
                name: '品牌',
                path: '/product/brand/list',

            },{
                name: '产品',
                path: '/product/product/list',

            },
        ]
    },
    {
        name: '合作伙伴',
        icon: 'el-icon-user-solid',
        permissionsCode:['partner'],
        path: '/partner/list',
    },{
        name: '公司设置',
        icon: 'el-icon-user-solid',
        permissionsCode:['SelfCompanySetting'],
        action:'goToSelfCompany',
        index:'/partner/detail',
    },
    {
        name: '邮箱',
        icon: 'el-icon-message',
        permissionsCode:['mail'],
        children: [
            {
                name: '写邮件',
                action:'clickWriteEmail',
                index:'clickWriteEmail',
            },{
                name: '待处理',
                path: '/email/waiting/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522asc%2522%257D',
                index: '/email/waiting/list',
            },{
                name: '收件箱',
                path: '/email/received/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/received/list',
            },{
                name: '发件箱',
                path: '/email/sending/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/sending/list',
            },{
                name: '已发送',
                path: '/email/sent/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/sent/list',
            },{
                name: '草稿',
                path: '/email/draft/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/draft/list',
            },{
                name: '已删除',
                path: '/email/deleted/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/deleted/list',
            },{
                name: '垃圾箱',
                path: '/email/junk/list?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/junk/list',
            },{
                name: '黑白名单',
                path: '/email/all/blacklist?order_by=%257B%2522field_name%2522%253A%2522create_time%2522%252C%2522by%2522%253A%2522desc%2522%257D',
                index: '/email/all/blacklist',
            },
        ]
    },
    {
        name: '财务',
        icon: 'el-icon-s-finance',
        permissionsCode:['accounting'],
        children: [
            {
                name: '银行对账单',
                path: '/finance/bank-statement/list',
            },{
                name: '未核销流水',
                path: '/finance/bank-statement-line/no_reconciled/list',
            },{
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
            },
        ]
    },
]