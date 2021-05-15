import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


import RouterView from './router-view'
import Home from '../views/home/Home'


export default new Router({
    routes: [
        {
            path: '/',
            redirect: "/home"
        },
        {
            path: '/login',
            component: require('../views/Login').default
        },
        {
            path: '/home',
            component: Home,
            redirect: {
                path: '/inquiry-price/OTHERS/list',
                query: {
                    order_by: encodeURIComponent(JSON.stringify({
                        "field_name": "CREATE_TIME",
                        "by": "desc"
                    }))
                }
            },
            children: [
                {
                    path: '/9001',
                    component: require('../views/9001').default
                },

                //询价管理
                {
                    path: '/inquiry-price/:sheetType',
                    component: RouterView,
                    children: [
                        {
                            path: 'list',
                            component: require('../views/inquiry-price/inquiry-price-list').default,
                        }, {
                            path: 'detail',
                            component: require('../views/inquiry-price/inquiry-price-detail').default,
                        },
                    ]
                },
                //询价池
                {
                    path: '/inquiry-price-pool/:poolType',
                    component: RouterView,
                    children: [
                        {
                            path: 'list',
                            component: require('../views/inquiry-price-pool/inquiry-price-pool-list').default,
                        }, {
                            path: 'detail',
                            component: require('../views/inquiry-price-pool/inquiry-price-pool-detail').default,
                        },
                    ]
                },
                //核准池
                {
                    path: '/approval-pool',
                    component: RouterView,
                    children: [
                        {
                            path: 'list',
                            component: require('../views/approval-pool/approval-pool-list').default,
                        },
                    ]
                },
                //询报价单
                {
                    path: '/inquiry-quotation/:sheetType',
                    component: RouterView,
                    children: [
                        {
                            path: 'list',
                            component: require('../views/inquiry-quotation/inquiry-quotation-list').default,
                        }, {
                            path: 'detail',
                            component: require('../views/inquiry-quotation/inquiry-quotation-detail').default,
                        }, {
                            path: 'create',
                            component: require('../views/inquiry-quotation/inquiry-quotation-create').default,
                        },
                    ]
                },


                //合作伙伴管理
                {
                    path: '/partner',
                    component: RouterView,
                    redirect: "/partner/list",
                    children: [
                        {
                            path: 'list',
                            component: require('../views/partner/partner-list').default,
                        }, {
                            path: 'detail',
                            component: require('../views/partner/partner-detail').default
                        },
                    ]
                },

                //产品库
                {
                    path: '/product',
                    component: RouterView,
                    redirect: "/product/brand/list",
                    children: [
                        //产品库-品牌管理
                        {
                            path: 'brand',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/product/brand/brand-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/product/brand/brand-detail').default
                                },
                            ]
                        },
                        //产品库-产品管理
                        {
                            path: 'product',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/product/product/product-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/product/product/product-detail').default
                                },
                            ]
                        },
                        //产品库-海关信息管理
                        {
                            path: 'customs-info',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/product/customs-info/customs-list').default,
                                },
                            ]
                        },
                        //产品库-海关信息管理
                        {
                            path: 'product-trade-name',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/product/product-trade-name/product-trade-name-list').default,
                                },
                            ]
                        },
                    ]
                },

                //新产品库
                {
                    path: '/new-product',
                    component: RouterView,
                    redirect: "/new-product/brand/list",
                    children: [
                        //新产品库-品牌管理
                        {
                            path: 'brand',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/brand/brand-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/new-product/brand/brand-detail').default
                                },
                            ]
                        },//新产品库-产品
                        {
                            path: 'product',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/product/product-list').default
                                }, {
                                    path: 'detail',
                                    component: require('../views/new-product/product/product-detail').default
                                },
                            ]
                        },
                        //产品目录管理
                        {
                            path: 'product-catalog',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/product-catalog/product-catalog-list').default,
                                },{
                                    path: 'detail',
                                    component: require('../views/new-product/product-catalog/product-catalog-detail').default,
                                },
                            ]
                        },
                        //产品价格管理
                        {
                            path: 'price',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/price/price-list').default,
                                },{
                                    path: 'detail',
                                    component: require('../views/new-product/price/price-detail').default,
                                },{
                                    path: 'sku-list',
                                    component: require('../views/new-product/price/sku-list').default,
                                },
                            ]
                        },
                        //新产品库-海关信息
                        {
                            path: 'customs',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/customs/customs-list').default,
                                },
                            ]
                        },
                        //新产品库-品名
                        {
                            path: 'trade-name',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/trade-name/trade-name-list').default,
                                },
                            ]
                        },
                        //新产品库-设置
                        {
                            path: 'setting/:tabIndex',
                            component: require('../views/new-product/setting/setting').default,
                        },
                        //标签管理
                        {
                            path: 'tags',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/new-product/tags/tags-list').default,
                                },{
                                    path: 'detail',
                                    component: require('../views/new-product/tags/tags-detail').default,
                                },
                            ]
                        },
                    ]
                },

                //订单模块
                {
                    path: '/order',
                    component: RouterView,
                    redirect: "/order/order/in_quote/list",
                    children: [
                        //订单-下单
                        {
                            path: 'order/:orderState',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/order/order-list').default,
                                }, {
                                    path: 'create',
                                    component: require('../views/order/order-create').default
                                },  {
                                    path: 'detail',
                                    component: require('../views/order/order-detail').default
                                }, {
                                    path: 'invoice',
                                    component: require('../views/order/invoice/order-detail-invoice').default
                                }, {
                                    path: 'receipt',
                                    component: require('../views/order/receipt/order-detail-receipt').default
                                }, {
                                    path: 'logistics',
                                    component: require('../views/order/logistics/order-detail-logistics').default
                                },
                            ]
                        },
                    ]
                },


                //财务模块
                {
                    path: '/finance',
                    component: RouterView,
                    redirect: "/finance/bank-statement/list",
                    children: [
                        //银行对账单
                        {
                            path: 'bank-statement',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/finance/bank-statement/bank-statement-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/finance/bank-statement/bank-statement-detail').default
                                },
                            ]
                        },
                        //未核销流水
                        {
                            path: 'bank-statement-line/:state',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/finance/bank-statement-line/bank-statement-line-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/finance/bank-statement-line/bank-statement-line-detail').default,
                                },
                            ]
                        },
                        //应付款项
                        {
                            path: 'prepaid',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/finance/prepaid/prepaid-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/finance/prepaid/prepaid-detail').default,
                                },
                            ]
                        },
                        //发票
                        {
                            path: 'invoice/:invoiceType',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/finance/invoice/invoice-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/finance/invoice/invoice-detail').default,
                                }, {
                                    path: 'custom-invoice',
                                    component: require('../views/finance/invoice/custom-invoice/invoice-custom-invoice').default,
                                }, {
                                    path: 'account-documents',
                                    component: require('../views/finance/invoice/account-documents/invoice-account-documents').default,
                                },
                            ]
                        },
                        //会计凭证
                        {
                            path: 'account-documents',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/finance/account-documents/account-documents-list').default,
                                }, {
                                    path: 'line-list',
                                    component: require('../views/finance/account-documents/account-documents-line-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/finance/account-documents/account-documents-detail').default,
                                }, {
                                    path: 'period',
                                    component: require('../views/finance/account-documents/account-documents-period').default,
                                },
                            ]
                        },
                        //科目一览表
                        {
                            path: 'account/list',
                            component: require('../views/finance/account/account-list').default,
                        },
                        //财务设置
                        {
                            path: 'setting/:tabIndex',
                            component: require('../views/finance/setting/setting').default,
                        },
                        //科目设置
                        {
                            path: 'subject-setting',
                            component: require('../views/finance/subject-setting/subject-setting').default,
                        },
                    ]
                },

                //邮箱
                {
                    path: '/email/:boxType',
                    component: RouterView,
                    children: [
                        {
                            path: 'list',
                            component: require('../views/email/email-list').default,
                        }, {
                            path: 'detail',
                            component: require('../views/email/emai-detail').default,
                        }, {
                            path: 'blacklist',
                            component: require('../views/email/blacklist/blacklist').default,
                        },
                    ]
                },
                //相关邮箱和站内信模块
                {
                    path: '/related',
                    component: RouterView,
                    children: [
                        {
                            path: 'email-list',
                            component: require('../views/email/related-email-list').default,
                        },{
                            path: 'message',
                            component: require('../views/related-message/related-message-detail').default,
                        },{
                            path: 'message-list/:messageType',
                            component: require('../views/related-message/related-message-list').default,
                        },{
                            path: 'message-tag-list-message',
                            component: require('../views/related-message/message-tag-list-message').default,
                        },
                    ]
                },
                //待处理
                {
                    path: '/pending',
                    component: RouterView,
                    children: [
                        {
                            path: 'dashboard',
                            component: require('../views/pending/pending-dashboard').default,
                        },
                    ]
                },

                //仓库
                {
                    path: '/logistics',
                    component: RouterView,
                    redirect: "/logistics/packages/list",
                    children: [
                        //快递签收
                        {
                            path: 'packages',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/packages/packages-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/packages/packages-detail').default
                                },
                            ]
                        },
                        //入库
                        {
                            path: 'stockIn',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/stockIn/stockIn-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/stockIn/stockIn-detail').default
                                },
                            ]
                        },
                        //调拨
                        {
                            path: 'transfers',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/transfers/transfers-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/transfers/transfers-detail').default
                                },
                            ]
                        },
                        //箱子:库存箱、订单箱
                        {
                            path: 'box/:boxState',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/box/box-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/box/box-detail').default
                                },
                            ]
                        },
                        //托盘
                        {
                            path: 'pallets',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/pallets/pallets-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/pallets/pallets-detail').default
                                },
                            ]
                        },
                        //出库
                        {
                            path: 'stockOut',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/logistics/stockOut/stockOut-list').default,
                                }, {
                                    path: 'detail',
                                    component: require('../views/logistics/stockOut/stockOut-detail').default
                                }, {
                                    path: 'detail/invoice',
                                    component: require('../views/logistics/stockOut/stockOut-detail-invoice').default
                                },
                            ]
                        },
                    ]
                },

                //设置
                {
                    path: '/setting',
                    component: RouterView,
                    children: [
                        {
                            path: 'template/:tabIndex',
                            component: require('../views/setting/template/setting-template').default,
                        },
                        {
                            path: 'logistics',
                            component: require('../views/setting/logistics/setting-logistics').default,
                        },{
                            path: 'order',
                            component: require('../views/setting/order/setting-order').default,
                        },{
                            path: 'zeroSoCompany',
                            component: require('../views/setting/zeroSoCompany/zeroSoCompany').default,
                        },{
                            path: 'user',
                            component: require('../views/setting/user/setting-user').default,
                        },
                        {
                            path: 'permission/:tabIndex',
                            component: require('../views/setting/permission/permission').default,
                        },
                    ]
                },

                //数据统计
                {
                    path: '/statistics',
                    component: require('../views/statistics/statistics').default
                },
                //账号管理
                {
                    path: '/user-base',
                    component: require('../views/user/user-base').default
                },

                //官网
                {
                    path: '/www',
                    component: RouterView,
                    children: [
                        {
                            path: 'contact-us/list',
                            component: require('../views/www/contact-us-list').default,
                        }, {
                            path: 'news',
                            component: RouterView,
                            children: [
                                {
                                    path: 'list',
                                    component: require('../views/www/news/news-list').default,
                                },{
                                    path: 'detail',
                                    component: require('../views/www/news/news-detail').default,
                                },
                            ]
                        },
                    ]
                },
            ]
        },
    ]
})
