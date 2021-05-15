//前端写死 部分静态数据配置

export default {
    "currency": [
        {code: "CNY", label: "人民币"},
        {code: "EUR", label: "欧元"},
        {code: "USD", label: "美元"},
        {code: "HKD", label: "港币"},
        {code: "GBP", label: "英镑"},
        {code: "CHF", label: "瑞士法郎"},
        {code: "JPY", label: "日元"},
        {code: "AUD", label: "澳元"},
        {code: "DKK", label: "丹麦"},
        {code: "SEK", label: "瑞典克朗"},
        {code: "NOK", label: "挪威克朗"},
        {code: "TRY", label: "土耳其里拉"},
    ],
    "language": [
        {code: "zh_CN", label: "中文(简体)"},
        {code: "de_DE", label: "Deutsch"},
        {code: "en_US", label: "English"}
    ],
    "weightUnit": [
        {code: "g", label: "g"},
        {code: "kg", label: "kg"},
        {code: "lb", label: "lb"},
        {code: "oz", label: "oz"},
    ],
    "lengthUnit": [
        {code: "m", label: "m"},
        {code: "dm", label: "dm"},
        {code: "cm", label: "cm"},
        {code: "mm", label: "mm"},
        {code: "yd", label: "yd"},
        {code: "ft", label: "ft"},
        {code: "in", label: "in"},
    ],
    "paymentMethod": [
        {
            label: "30/70付款",
            code: "earnest_payment",
            system:"B",
        },
        {
            label: "预付全款",
            code: "advance_payment",
            system:"B",
        },
        {
            label: "开票后付款",
            code: "invoiced_payment",
            system:"B",
        },
        {
            label: "见票付款-有打款折扣",
            code: "invoiced_with_discount_payment",
            system:"0",
        },
        {
            label: "见票付款-无打款折扣",
            code: "invoiced_without_discount_payment",
            system:"0",
        },
        {
            label: "发货前全款",
            code: "advance_before_delivery_payment",
            system:"0",
        },
        {
            label: "下单预付",
            code: "advance_after_order_payment",
            system:"0",
        }
    ],
    "paymentType": [
        {
            label: "根据发票",
            code: "invoice",
        },
        {
            label: "根据订单",
            code: "order",
        },
        {
            label: "直接付款",
            code: "manual",
        }
    ],
    "companyType": [
        {
            label: "系统外",
            code: "public",
        },
        {
            label: "蓝钻",
            code: "little_v",
        },
        {
            label: "黄钻",
            code: "internal",
        }
    ],
    "supplierPickupMethod": [
        {
            label: "未确认",
            code: "unknown",
        }, {
            label: "供应商发货",
            code: "supplier_delivery",
        }, {
            label: "UPS上门取件",
            code: "ups_pickup",
        }, {
            label: "DHL上门取件",
            code: "dhl_pickup",
        },
    ],
    "gender": [
        {
            label: "男",
            code: "male",
        }, {
            label: "女",
            code: "female",
        }
    ],
    "partnerUserStatus": [
        {
            label: "在职",
            code: "in_service",
        }, {
            label: "离职",
            code: "leave",
        }, {
            label: "无效",
            code: "invalid",
        }
    ],
    "companyLevel": [
        {
            label: "无效",
            code: "no_such_company",
            className:"partner-level-tag-gray",
        }, {
            label: "不推荐",
            code: "not_recommend",
            className:"partner-level-tag-gray",
        }, {
            label: "未分级",
            code: "unknown",
            className: "partner-level-tag-lightgreen",
        }
    ],
    "partnerUserAction": [
        {
            label: "公开",
            code: "public",
        }, {
            label: "仅内部",
            code: "internal",
        }, {
            label: "不可见",
            code: "invisible",
        }
    ],
    "bankType": [
        {
            label: "公司账户",
            code: "public",
        }, {
            label: "个人账户",
            code: "private",
        },
    ],
    "brandPriceState": [
        {
            label: "无价格表",
            code: "no_price",
        }, {
            label: "有商城账号",
            code: "has_mall",
        }, {
            label: "有价格表",
            code: "has_price",
        },
    ],
    "brandSupplierPriceType": [
        {
            label: "无价格表",
            code: "none",
        },{
            label: "有商城",
            code: "eshop",
        },{
            label: "有价格表",
            code: "price_list",
        },
    ],
    "brandLever": [
        {
            label: "独家代理",
            code: "exclusive",
            className: 'brand-level-tag-orange'
        },  {
            label: "普通代理",
            code: "agency",
            className: 'brand-level-tag-green'
        },{
            label: "优质品牌",
            code: "dominant",
            className: 'brand-level-tag-lightgreen'
        },{
            label: "查价品牌",
            code: "pricelist",
            className: 'brand-level-tag-darkred'
        },{
            label: "询价品牌",
            code: "inquiry",
            className: 'brand-level-tag-red'
        },{
            label: "暂未分级",
            code: "unclassfied",
            className: 'brand-level-tag-brown'
        },{
            label: "非欧品牌",
            code: "non_eu",
            className: 'brand-level-tag-blue'
        },{
            label: "暂不报价",
            code: "unquote",
            className: 'brand-level-tag-black-gray'
        }, {
            label: "失效品牌",
            code: "inactive",
            className: 'brand-level-tag-black-gray'
        },{
            label: "错误品牌",
            code: "invalid",
            className: 'brand-level-tag-black-gray'
        },
    ],
    "brandLever2": [
        {
            label: "独家代理",
            code: "exclusive",
            className: 'brand-level-tag-orange'
        },  {
            label: "普通代理",
            code: "agency",
            className: 'brand-level-tag-green'
        },{
            label: "查价品牌",
            code: "pricelist",
            className: 'brand-level-tag-darkred'
        },{
            label: "询价品牌",
            code: "inquiry",
            className: 'brand-level-tag-red'
        },
    ],
    "brandAgencyState": [
        {
            label: "独家代理",
            code: "EXCLUSIVE",
        }, {
            label: "普通代理",
            code: "ORDINARY",
        }, {
            label: "非代理",
            code: "NONE",
        },
    ],
    "brandLevelTagOptType": [
        {
            label: "自动",
            code: "automation",
        }, {
            label: "手动",
            code: "manual",
        },
    ],
    "newBrandPublishState": [
        {
            label: "未发布",
            code: "draft",
            type:"info"
        }, {
            label: "待发布",
            code: "publishing",
            type:"warning"
        }, {
            label: "已发布",
            code: "published",
            type:"success"
        }, {
            label: "品牌+产品下架",
            code: "offline_brand_and_product",
            type:"danger"
        },{
            label: "仅品牌下架",
            code: "offline_brand",
            type:"danger"
        },
    ],
    "newBrandAuditState": [
        {
            label: "草稿",
            code: "draft",
            type:"info"
        }, {
            label: "待审核",
            code: "auditing",
            type:"warning"
        }, {
            label: "已审核",
            code: "audited",
            type:"success"
        },
    ],
    "newBrandIdentityRule": [
        {
            label: "型号",
            code: "type",
        }, {
            label: "订货号",
            code: "order_no",
        }, {
            label: "型号+订货号",
            code: "both",
        }, {
            label: "型号+产品系列",
            code: "product_series_type",
        }, {
            label: "订货号+产品系列",
            code: "product_series_order_no",
        }, {
            label: "型号+订货号+产品系列",
            code: "product_series_both",
        },
    ],
    "productState": [
        {
            label: "草稿",
            code: "draft",
        }, {
            label: "无效产品",
            code: "invalid",
            type:"info",
        }, {
            label: "已停产",
            code: "discontiuned",
            type:"info",
        }, {
            label: "被替代产品",
            code: "replaced",
            type:"info",
        }, {
            label: "已上架",
            code: "on_shelf",
            type:"success",
        }, {
            label: "已下架",
            code: "sold_out",
            type:"danger",
        },
    ],
    "productType": [
        {
            label: "3C",
            code: '1',
        }, {
            label: "OEM",
            code: '2',
        },
    ],
    "productDetailSource": [
        {
            label: "产品库",
            code: "product",
            className:"product-detail-source-tag-blue",
        },{
            label: "询报价单",
            code: "inquiry_quote_sheet",
            className:"product-detail-source-tag-blue",
        }, {
            label: "询价单",
            code: "inquiry_sheet",
            className:"product-detail-source-tag-yellow",
        }, {
            label: "价格表",
            code: "price_list",
            className:"product-detail-source-tag-green",
        }, {
            label: "商城",
            code: "e_shop",
            className:"product-detail-source-tag-brown",
        }, {
            label: "S系统",
            code: "s_system",
            className:"product-detail-source-tag-red",
        },
    ],
    "productCustomState": [
        {
            label: "无信息",
            code: "draft",
        }, {
            label: "已提交",
            code: "need_validate",
        }, {
            label: "已审核",
            code: "verified",
        },
    ],
    "productSource": [
        {
            label: "B系统用户录入",
            code: "b",
        }, {
            label: "E系统用户录入",
            code: "e",
        }, {
            label: "已发询价",
            code: "quote",
        }, {
            label: "已报价",
            code: "quoted",
        }, {
            label: "已签合同",
            code: "order",
        }, {
            label: "已执行合同",
            code: "contract",
        }, {
            label: "已入库",
            code: "incoming",
        }, {
            label: "已出库",
            code: "outgoing",
        }, {
            label: "价格表导入",
            code: "price_table",
        },
    ],
    "productPriceSource": [
        {
            label: "询价单",
            code: "inquiry_sheet",
        }, {
            label: "询报价单",
            code: "quote_sheet",
        }, {
            label: "价格表",
            code: "price_list",
        },{
            label: "商城",
            code: "e_shop",
        },{
            label: "S系统",
            code: "s_system",
        },
    ],
    "newProductProductCatalogState": [
        {
            label: "草稿",
            code: "draft",
            className:"new-product-price-state-tag-black-gray",
            actions:[
                {
                    name:"开始制表",
                    action:"start_tab",
                    type:"warning"
                },{
                    name:"延后制表",
                    action:"delay_tab",
                    type:"danger"
                },
            ]
        }, {
            label: "待制表",
            code: "to_be_tabulated",
            className:"new-product-price-state-tag-lightblue",
            actions:[
                {
                    name:"开始制表",
                    action:"start_tab",
                    type:"warning"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待重制",
            code: "redo_tabulate",
            className:"new-product-price-state-tag-blue",
            actions:[
                {
                    name:"开始制表",
                    action:"start_tab",
                    type:"warning"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "制表中",
            code: "tabulating",
            className:"new-product-price-state-tag-lightgreen",
            actions:[
                {
                    name:"完成制表",
                    action:"finish_tab",
                    type:"success"
                },{
                    name:"延后制表",
                    action:"delay_tab",
                    type:"danger"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待校对",
            code: "to_be_collated",
            className:"new-product-price-state-tag-brown",
            actions:[
                {
                    name:"开始校对",
                    action:"start_check",
                    type:"warning"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "校对中",
            code: "collating",
            className:"new-product-price-state-tag-orange",
            actions:[
                {
                    name:"完成校对",
                    action:"finish_check",
                    type:"success"
                },{
                    name:"校对拒绝",
                    action:"check_refuse",
                    type:"danger"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "导入中",
            code: "importing",
            className:"new-product-price-state-tag-red",
            actions:[]
        },{
            label: "导入失败",
            code: "import_failed",
            className:"new-product-price-state-tag-gray",
            actions:[
                {
                    name:"重新导入",
                    action:"reimport",
                    type:"warning"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待审核",
            code: "to_be_audited",
            className:"new-product-price-state-tag-darkblue",
            actions:[
                {
                    name:"开始审核",
                    action:"start_audit",
                    type:"warning"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "审核中",
            code: "auditing",
            className:"new-product-price-state-tag-darkred",
            actions:[
                {
                    name:"完成审核",
                    action:"finish_audit",
                    type:"success"
                },{
                    name:"回退",
                    action:"rollback",
                    type:"danger"
                },
            ]
        },{
            label: "已审核",
            code: "audited",
            className:"new-product-price-state-tag-green",
        },
    ],

    "newProductPriceState": [
        {
            label: "草稿",
            code: "draft",
            className:"new-product-price-state-tag-black-gray",
            actions:[
                {
                    name:"开始制表",
                    action:"price_list_start_tab",
                    type:"warning"
                },{
                    name:"延后制表",
                    action:"price_list_delay_tab",
                    type:"danger"
                },
            ]
        }, {
            label: "待制表",
            code: "to_be_tabulated",
            className:"new-product-price-state-tag-lightblue",
            actions:[
                {
                    name:"开始制表",
                    action:"price_list_start_tab",
                    type:"warning"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待重制",
            code: "redo_tabulate",
            className:"new-product-price-state-tag-blue",
            actions:[
                {
                    name:"开始制表",
                    action:"price_list_start_tab",
                    type:"warning"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "制表中",
            code: "tabulating",
            className:"new-product-price-state-tag-lightgreen",
            actions:[
                {
                    name:"完成制表",
                    action:"price_list_finish_tab",
                    type:"success"
                },{
                    name:"延后制表",
                    action:"price_list_delay_tab",
                    type:"danger"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待校对",
            code: "to_be_collated",
            className:"new-product-price-state-tag-brown",
            actions:[
                {
                    name:"开始校对",
                    action:"price_list_start_check",
                    type:"warning"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "校对中",
            code: "collating",
            className:"new-product-price-state-tag-orange",
            actions:[
                {
                    name:"完成校对",
                    action:"price_list_finish_check",
                    type:"success"
                },{
                    name:"校对拒绝",
                    action:"price_list_check_refuse",
                    type:"danger"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "导入中",
            code: "importing",
            className:"new-product-price-state-tag-red",
            actions:[]
        },{
            label: "导入失败",
            code: "import_failed",
            className:"new-product-price-state-tag-gray",
            actions:[
                {
                    name:"重新导入",
                    action:"price_list_reimport",
                    type:"warning"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "待审核",
            code: "to_be_audited",
            className:"new-product-price-state-tag-darkblue",
            actions:[
                {
                    name:"开始审核",
                    action:"price_list_start_audit",
                    type:"warning"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "审核中",
            code: "auditing",
            className:"new-product-price-state-tag-darkred",
            actions:[
                {
                    name:"完成审核",
                    action:"price_list_finish_audit",
                    type:"success"
                },{
                    name:"审核拒绝",
                    action:"price_list_audit_refuse",
                    type:"danger"
                },{
                    name:"回退",
                    action:"price_list_rollback",
                    type:"danger"
                },
            ]
        },{
            label: "已审核",
            code: "audited",
            className:"new-product-price-state-tag-green",
            actions:[
               {
                    name:"失效",
                    action:"price_list_expiry",
                    type:"danger"
                },{
                    name:"延期",
                    action:"price_list_postpone",
                    type:"success"
                },
            ]
        },
    ],
    "newProductTagsState": [
        {
            label: "待规范",
            code: "draft",
            className:"new-product-price-state-tag-orange",
            actions:[
                {
                    name:"开始规范",
                    action:"label_start_normal",
                    type:"warning"
                },
            ]
        }, {
            label: "规范中",
            code: "normalizing",
            className:"new-product-price-state-tag-lightblue",
            actions:[
                {
                    name:"通过并申请发布",
                    action:"label_start_publish",
                    type:"success"
                },{
                    name:"替代为规范标签",
                    action:"label_mark_normal",
                    type:"danger"
                },
            ]
        }, {
            label: "被替代",
            code: "normalized",
            className:"new-product-price-state-tag-black-gray",
            actions:[
                {
                    name:"重新替代规范标签",
                    action:"label_mark_normal",
                    type:"danger"
                },
            ]
        }, {
            label: "待发布",
            code: "publishing",
            className:"new-product-price-state-tag-darkblue",
            actions:[
                {
                    name:"通过发布",
                    action:"label_finish_publish",
                    type:"success"
                },{
                    name:"拒绝发布",
                    action:"label_refuse_publish",
                    type:"danger"
                },
            ]
        },{
            label: "已发布",
            code: "published",
            className:"new-product-price-state-tag-green",
            actions:[
                {
                    name:"重新发布",
                    action:"label_finish_publish",
                    type:"success"
                },
            ]
        },
    ],

    "wwwNewsState": [
        {
            label: "草稿",
            code: "draft",
            className:"new-product-price-state-tag-black-gray",
            actions:[
                {
                    name:"提交审核",
                    action:"commit_audit",
                    type:"warning"
                },
            ]
        }, {
            label: "待审核",
            code: "auditing",
            className:"new-product-price-state-tag-lightblue",
            actions:[
                {
                    name:"通过审核",
                    action:"audited",
                    type:"success"
                },{
                    name:"拒绝审核",
                    action:"audit_refuse",
                    type:"danger"
                },
            ]
        },{
            label: "审核通过",
            code: "audited",
            className:"new-product-price-state-tag-brown",
            actions:[
                {
                    name:"提交发布",
                    action:"commit_publish",
                    type:"warning"
                },
            ]
        },{
            label: "审核未通过",
            code: "audit_refuse",
            className:"new-product-price-state-tag-orange",
            actions:[
                {
                    name:"重新提交审核",
                    action:"commit_audit",
                    type:"warning"
                },
            ]
        },{
            label: "待发布",
            code: "publishing",
            className:"new-product-price-state-tag-darkblue",
            actions:[
                {
                    name:"通过发布",
                    action:"published",
                    type:"success"
                },{
                    name:"拒绝发布",
                    action:"refuse_publish",
                    type:"danger"
                },
            ]
        },{
            label: "已发布",
            code: "published",
            className:"new-product-price-state-tag-green",
            actions:[
                {
                    name:"下线",
                    action:"offline",
                    type:"danger"
                },
            ]
        },{
            label: "已拒绝发布",
            code: "refuse_publish",
            className:"new-product-price-state-tag-darkred",
            actions:[
                {
                    name:"重新提交发布",
                    action:"commit_publish",
                    type:"warning"
                },
            ]
        },{
            label: "已下线",
            code: "offline",
            className:"new-product-price-state-tag-gray",
            actions:[
                {
                    name:"重新发布",
                    action:"restore",
                    type:"warning"
                },
            ]
        },
    ],
    "wwwNewsType": [
        {
            label: "集团新闻",
            code: "internal",
        },{
            label: "行业动态",
            code: "business",
        },
    ],

    "orderInquiryPriority": [
        {
            label: "高",
            code: "high",
        }, {
            label: "中",
            code: "middle",
        }, {
            label: "低",
            code: "low",
        },
    ],
    "zerosoOrderStatus": [
        {
            label: "草稿",
            code: "draft",
        }, {
            label: "等待报价",
            code: "waiting_quote",
        }, {
            label: "已报价",
            code: "quoted",
        }, {
            label: "已签订合同",
            code: "mutually_confirm",
        }, {
            label: "开始执行合同",
            code: "contract_performed",
        }, {
            label: "已完结",
            code: "done",
        }, {
            label: "未开票",
            code: "no_invoice",
        }, {
            label: "部分开票",
            code: "partial",
        }, {
            label: "已开票",
            code: "invoice",
        }, {
            label: "已取消",
            code: "cancelled",
        },
    ],
    "order.statusAndAction": [
        {
            id: 0,
            status: {
                name: "草稿",
                value: "draft",
                actionName: "创建",
            },
            action: {
                name: "发送询价",
                value: "send_quote"
            }
        },
        {
            id: 10,
            status: {
                name: "等待报价",
                value: "waiting_quote",
                actionName: "发送询价",
            },
            action: {
                name: "已报价",
                value: "quoted"
            }
        }, {
            id: 20,
            status: {
                name: "已报价",
                value: "quoted",
                actionName: "报价",
            },
            action: {
                name: "签订合同",
                value: "confirm_contract"
            }
        }, {
            id: 50,
            status: {
                name: "已签订合同",
                value: "mutually_confirm",
                actionName: "签订",
            },
            action: {
                name: "执行合同",
                value: "performed_contract"
            }
        }, {
            id: 70,
            status: {
                name: "合同开始执行",
                value: "contract_performed",
                actionName: "执行",
            },
            action: {
                name: "完结",
                value: "finish_order"
            }
        }, {
            id: 100,
            status: {
                name: "已完结",
                value: "done",
                actionName: "完结",
            },
            action: {
                name: "",
                value: ""
            }
        }, {
            id: -100,
            status: {
                name: "已取消",
                value: "cancelled",
            },
            action: {
                name: "",
                value: ""
            }
        }
    ],

    "bankStatementLineReconsiled": [
        {
            label: "已核销",
            code: "yes",
        }, {
            label: "未核销",
            code: "no",
        }, {
            label: "可核销",
            code: "can",
        },
    ],
    "zerosoBillActionState": [
        {
            label: "创建",
            code: "create",
        }, {
            label: "草稿",
            code: "draft",
        }, {
            label: "已审核",
            code: "verifyed",
        }, {
            label: "已提交支付",
            code: "payed",
        }, {
            label: "正在支付",
            code: "pending",
        }, {
            label: "已支付",
            code: "acknowlaged",
        }, {
            label: "已核销",
            code: "reconsiled",
        }, {
            label: "支付失败",
            code: "failed",
        }, {
            label: "全部状态",
            code: "billAll",
        }, {
            label: "回退",
            code: "revert",
        }, {
            label: "取消",
            code: "canceled",
        },
    ],
    "zerosoInvoiceStatus": [
        {
            label: "取消",
            code: "canceled",
            tagType: 'disable'
        }, {
            label: "草稿",
            code: "draft",
            tagType: 'disable'
        }, {
            label: "已发送",
            code: "unconfirmed",
            tagType: ''
        }, {
            label: "已确认",
            code: "confirmed",
            tagType: ''
        }, {
            label: "已开票",
            code: "generated",
            tagType: ''
        }, {
            label: "已寄票",
            code: "sent",
            tagType: ''
        }, {
            label: "已签收",
            code: "received",
            tagType: 'success'
        }, {
            label: "已认证",
            code: "verified",
            tagType: ''
        }, {
            label: "非认证",
            code: "unverified",
            tagType: ''
        },
    ],
    "zerosoTaxType": [
        {
            label: "含税计价",
            code: "on_taxed",
        }, {
            label: "未税计价",
            code: "on_untaxed",
        },
    ],
    "templateProfessionType": [
        {
            label: "订单/客户和供应商",
            code: "to_customer_supplier",
        }, {
            label: "订单/客戶",
            code: "to_customer",
        },{
            label: "订单/供应商",
            code: "to_supplier",
        },{
            label: "仓库/出库",
            code: "packing_list",
        },{
            label: "财务/发票",
            code: "to_customer_invoice",
        },
    ],

    logisticsStatus: {
        waiting: '待入海外仓',
        partial: '部分入库',
        received: '已入库',
        exported: '已出口',
        imported: '已进口',
        delivery: '已出库',
        done: '已完结',
    },
    deliveryCompanies: [
        {
            code: 'sf_express',
            name: '顺丰',
            deliveryTypes: [{id: '1', name: '顺丰次日'}, {id: '2', name: '顺丰隔日'}, {id: '34', name: '顺丰即日'}, {
                id: '5',
                name: '顺丰次晨'
            }],
            displayFields: ['primary_mail_no', 'secondary_mail_no', 'customer_pay_code', 'delivery_type_id', 'insurance_price', 'package_total', 'payment_type']
        },
        {
            code: 'yt_express',
            name: '圆通',
            deliveryTypes: [{id: '1', name: '上门揽收'}, {id: '2', name: '次日达'}, {id: '4', name: '次晨达'}, {
                id: '8',
                name: '当日达'
            }, {
                id: '0',
                name: '自己联系'
            }],
            displayFields: ['item_name', 'primary_mail_no', 'delivery_type_id', 'insurance_price', 'package_total'],
        }
    ],
    deliveryPaymentTypes: [{id: 'sender_pay', name: '发货方付'}, {id: 'receiver_pay', name: '收货方付'}, {id: 'third_pay', name: '第三方付'}],
    deliveryTypes: [{id: '1', name: '顺丰次日'}, {id: '2', name: '顺丰隔日'}, {id: '34', name: '顺丰即日'}, {id: '5', name: '顺丰次晨'}, {id: '0', name: '自己联系'}],

    //公司简称
    mainCompanyAbbreviationCode: {
        1: "ZEROSO",
        2: "SDV实业",
        3: "HK",
        4: "SIVI",
        261: "普索",
        270: "深圳零欧智能工业有限公司",
        3967: "OBOR",
        9428: "ZNS",
        13639: "SDV实业(1)",
        13641: "SDV科技(1)",
        13643: "普索(1)",
        20985: "壹点",
    },
    "roundConfigName": [
        {
            label: "整数",
            code: 0,
        }, {
            label: "保留一位小数",
            code: 1,
        }, {
            label: "保留两位小数",
            code: 2,
        },
    ],

    "inquiryDeliveryMode": [
        {
            label: "直接发货",
            code: 'DIRECT',
        }, {
            label: "海外仓发货",
            code: 'OFFSHORE',
        }, {
            label: "国内仓发货",
            code: 'DEMOSTIC',
        },
    ],
    "inquirySheetState": [
        {
            label: "已创建",
            code: 'CREATED',
            className: 'inquiry-sheet-state-tag-create'
        }, {
            label: "已发询价",
            code: 'INQUIRY_SENT',
            className: 'inquiry-sheet-state-tag-lightblue'
        },  {
            label: "税费核准中",
            code: 'EXPENSE_EXAMINE',
            className: 'inquiry-sheet-state-tag-orange'
        }, {//状态逻辑调整后，已废弃 EXPENSE_APPROVED
            label: "已核准税费",
            code: 'EXPENSE_APPROVED',
            className: 'inquiry-sheet-state-tag-brown'
        }, {
            label: "已回询价",
            code: 'INQUIRY_REPLIED',
            className: 'inquiry-sheet-state-tag-blue'
        }, {
            label: "已发报价",
            code: 'QUOTATION_SENT',
            className: 'inquiry-sheet-state-tag-line-green'
        }, {
            label: "已发合同",
            code: 'CONTRACT_SENT',
            className: 'inquiry-sheet-state-tag-red'
        }, {
            label: "已签合同",
            code: 'CONTRACT_SIGNED',
            className: 'inquiry-sheet-state-tag-darkred'
        }, {
            label: "已执行合同",
            code: 'CONTRACT_ENFORCED',
            className: 'inquiry-sheet-state-tag-green'
        }, {
            label: "已取消",
            code: 'CANCELED',
            className: 'inquiry-sheet-state-tag-gray',
        },
    ],
    "supplierInquiryState": [
        {
            label: "草稿",
            code: 'DRAFT',
            className: 'inquiry-sheet-state-tag-create',
        }, {
            label: "已询价",
            code: 'INQUIRY_SENT',
            className: 'inquiry-sheet-state-tag-blue',
        }, {
            label: "已催价",
            code: 'INQUIRY_PUSHED',
            className: 'inquiry-sheet-state-tag-orange',
        }, {
            label: "已报价",
            code: 'QUOTED',
            className: 'inquiry-sheet-state-tag-green',
        }, {
            label: "不报价",
            code: 'QUOTE_REFUSED',
            className: 'inquiry-sheet-state-tag-gray',
        },
    ],

    //productQuotationCommentAll 包含已删除的，productQuotationComment 不包含已删除的，格式一致
    "productQuotationCommentAll": {
        1: {
            label: "标记为无效",
            children: [
                {
                    label: "产品信息不全，供应商无法识别型号或对方产品库无法找到该产品或需要发铭牌信息询价或需要确认参数。",
                    code: 1,
                }, {
                    label: "供应商要求必需带目标价询价。",
                    code: 2,
                }, {
                    label: "供应商要求必需带数量询价。",
                    code: 3,
                }, {
                    label: "产品正确，但是询错了品牌。",
                    code: 4,
                }, {
                    label: "需要填写客户终端信息。",
                    code: 5,
                }, {
                    label: "需要客户选型。",
                    code: 6,
                }, {
                    label: "其他",
                    code: 0,
                },
            ]
        },
        2: {
            label: "标记不报价",
            children: [
                {
                    label: "不给中国终端客户报价或不给中间商报价或只给终端报价。",
                    code: 1,
                }, {
                    label: "中国已有代理，要求找国内报价。或中国已有代理，价格保护不给报价。",
                    code: 2,
                }, {
                    label: "无法找到欧盟区欧元报价供应商。",
                    code: 3,
                }, {
                    label: "过了报价时效。",
                    code: 4,
                }, {
                    label: "其他",
                    code: 0,
                },
            ]
        }
    },
    "productQuotationComment": {
        1: {
            label: "标记为无效",
            children: [
                {
                    label: "产品信息不全，供应商无法识别型号或对方产品库无法找到该产品或需要发铭牌信息询价或需要确认参数。",
                    code: 1,
                }, {
                    label: "供应商要求必需带目标价询价。",
                    code: 2,
                }, {
                    label: "供应商要求必需带数量询价。",
                    code: 3,
                }, {
                    label: "产品正确，但是询错了品牌。",
                    code: 4,
                }, {
                    label: "需要填写客户终端信息。",
                    code: 5,
                }, {
                    label: "需要客户选型。",
                    code: 6,
                }, {
                    label: "其他",
                    code: 0,
                },
            ]
        },
        2: {
            label: "标记不报价",
            children: [
                {
                    label: "不给中国终端客户报价或不给中间商报价或只给终端报价。",
                    code: 1,
                }, {
                    label: "中国已有代理，要求找国内报价。或中国已有代理，价格保护不给报价。",
                    code: 2,
                }, {
                    label: "无法找到欧盟区欧元报价供应商。",
                    code: 3,
                }, {
                    label: "过了报价时效。",
                    code: 4,
                }, {
                    label: "其他",
                    code: 0,
                },
            ]
        }
    },
    messageTagList: [
        {
            label: "高",
            className:'mark-message-tag-blue',
            code: 1000,
        },
        {
            label: "中",
            className:'mark-message-tag-yellow',
            code: 100,
        },
        {
            label: "低",
            className:'mark-message-tag-green',
            code: 10,
        },
    ],

}