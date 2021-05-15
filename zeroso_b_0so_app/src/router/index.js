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
                                },
                            ]
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
                            component: require('../views/related-email-message/related-email-list').default,
                        },{
                            path: 'message',
                            component: require('../views/related-email-message/related-message-detail').default,
                        },{
                            path: 'message-list/:messageType',
                            component: require('../views/related-email-message/related-message-list').default,
                        },{
                            path: 'message-tag-list-message',
                            component: require('../views/related-email-message/message-tag-list-message').default,
                        },
                    ]
                },

                //账号管理
                {
                    path: '/user-base',
                    component: require('../views/user/user-base').default
                },
            ]
        }
    ]
})
