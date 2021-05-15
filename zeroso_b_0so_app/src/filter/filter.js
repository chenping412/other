import Vue from 'vue'
import store from '../vuex/store'
import moment from "moment";
import 'moment-timezone'
import Decimal from 'decimal.js';

//字段为空时，默认横线
Vue.filter('defaultStr', function (value) {
    return value === 0 || value ? value : '---';
})

//公司类型
Vue.filter('companyType', function (value) {
    let str = '';
    store.state.companyType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
});

//支付方式
Vue.filter('paymentMethod', function (value) {
    let str = '';
    store.state.paymentMethod.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoPaymentMailTemplate', function (value) {
    let payment = {
        earnest_payment: "30%(<span style=\"font-size: 14px\">三七付</span>)",
        advance_payment: "100%(<span style=\"font-size: 14px\">全款</span>)",
        invoiced_payment: '开票后付款',
        invoiced_with_discount_payment: '见票付款-有打款折扣',
        invoiced_without_discount_payment: '见票付款-无打款折扣',
        advance_before_delivery_payment: '发货前全款',
        advance_after_order_payment: '下单预付',
    };
    return payment[value] || value;
})
Vue.filter('paymentType', function (value) {
    let str = '';
    store.state.paymentType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//发货方式
Vue.filter('supplierPickupMethod', function (value) {
    let str = '';
    store.state.supplierPickupMethod.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('inquiryDeliveryMode', function (value) {
    let str = '';
    store.state.inquiryDeliveryMode.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('inquirySheetState', function (value) {
    let str = '';
    store.state.inquirySheetState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('supplierInquiryState', function (value) {
    let str = '';
    store.state.supplierInquiryState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('inquiryPriceNormalText', function (value) {
    return value || value===0 || value==='0' ? value : '待确认';
})



//货币
Vue.filter('currency', function (value) {
    let str = '';
    store.state.currency.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

Vue.filter('countryToCurrency', function (value) {
    let str = '';
    store.state.country.forEach((item) => {
        if (item.code2 == value && item.currency) {
            str = item.currency;
        }
    });
    return str ? str : 'CNY';
})
Vue.filter('countryToIsoCurrency', function (value,param) {
    let str = '';
    store.state.country.forEach((item) => {
        if (item.code2 == param && item.currency) {
            str = formatMoney(value,item.currency);
        }
    });
    return str ? str : formatMoney(value,'CNY');
})

//货币单位代码格式化
Vue.filter('isoCurrency', function (value, param) {
    let str = '';
    if (param) {
        if (store.state.isoCurrency[param] && (value || value=='0')) {
            str = Vue.prototype.$utils.formatMoney(value,store.state.isoCurrency[param].symbol)
        }
    } else if (store.state.isoCurrency[value]) {
        str = store.state.isoCurrency[value].symbol
    }
    return str || value;
})
Vue.filter('isoCurrencyDe', function (value, param) {
    let str = '';
    if (store.state.isoCurrency[param] && value) {
        str = Vue.prototype.$utils.formatMoney(value,store.state.isoCurrency[param].symbol,2,'.',',')
    }
    return str || value;
})
let formatMoney = Vue.filter('formatMoney', function (value, param) {
    let str = '';
    if (store.state.isoCurrency[param] && (value || value=='0')) {
        str = Vue.prototype.$utils.formatMoney(value,store.state.isoCurrency[param].symbol)
    }
    return str || value;
})


//语言
Vue.filter('language', function (value) {
    let str = '';
    store.state.language.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})


//国家
Vue.filter('country', function (value) {
    let str = '';
    store.state.country.forEach((item) => {
        if (item.code2 == value) {
            str = item.chinese_name;
        }
    });
    return str ? str : value;
})

//性别
Vue.filter('gender', function (value) {
    let str = '';
    store.state.gender.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//联系人状态
Vue.filter('partnerUserStatus', function (value) {
    let str = '';
    store.state.partnerUserStatus.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//合作伙伴等级
Vue.filter('partnerLevel', function (value) {
    let str = '';
    store.state.partnerLevel.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//合作伙伴联系人可见状态
Vue.filter('partnerUserAction', function (value) {
    let str = '';
    store.state.partnerUserAction.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//银行账户类型
Vue.filter('bankType', function (value) {
    let str = '';
    store.state.bankType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//价格表状态
Vue.filter('brandPriceState', function (value) {
    let str = '';
    store.state.brandPriceState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('brandSupplierPriceType', function (value) {
    let str = '';
    store.state.brandSupplierPriceType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//品牌等级
Vue.filter('brandLever', function (value) {
    let str = '';
    store.state.brandLever.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('brandAgencyState', function (value) {
    let str = '';
    store.state.brandAgencyState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//品牌等级打标类型
Vue.filter('brandLevelTagOptType', function (value) {
    let str = '';
    store.state.brandLevelTagOptType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//产品状态
Vue.filter('productState', function (value) {
    let str = '';
    store.state.productState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('templateProfessionType', function (value) {
    let str = '';
    store.state.templateProfessionType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//产品海关信息状态
Vue.filter('productCustomState', function (value) {
    let str = '';
    store.state.productCustomState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

//产品来源
Vue.filter('productSource', function (value) {
    let str = '';
    store.state.productSource.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('productPriceSource', function (value) {
    let str = '';
    store.state.productPriceSource.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})


//银行对账单核销状态
Vue.filter('bankStatementLineReconsiled', function (value) {
    let str = '';
    store.state.bankStatementLineReconsiled.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
//银行对账单核销状态
Vue.filter('zerosoBillActionState', function (value) {
    let str = '';
    store.state.zerosoBillActionState.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})

Vue.filter('zerosoPaidState', function (value) {
    const result = {
        'no_paid': '未支付',
        'is_paid': '已支付',
        'apply_pay': '已申请支付',
    };
    return result[value] || value
})
Vue.filter('zerosoInvoiceStatus', function (value) {
    let str = '';
    store.state.zerosoInvoiceStatus.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoOrderStatus', function (value) {
    let str = '';
    store.state.zerosoOrderStatus.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoOrderInvoiceState', function (value) {
    if (value === 'invoice') return '已开票';
    if (value === 'no_invoice') return '未开票';
    if (value === 'partial') return '部分开票';
    return value
})
Vue.filter('supplierInvoiceState', function (value) {
    let result = {
        'invoice': '供应商:已开票',
        'no_invoice': '供应商:未开票',
        'partial': '供应商:部分开票'
    };
    return result[value] || '无'
})
Vue.filter('zerosoOrderReceiptState', function (value) {
    if (value === 'receipt') return '已收款';
    if (value === 'partial') return '部分收款';
    if (value === 'no_receipt') return '未收款';
    return value
})
Vue.filter('zerosoOrderPaymentState', function (value) {
    if (value === 'receipt') return '已付款';
    if (value === 'partial') return '部分付款';
    if (value === 'no_receipt') return '未付款';
    return value
})


Vue.filter('zerosoTaxType', function (value) {
    let str = '';
    store.state.zerosoTaxType.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoOrderStateActions', function (value) {
    let str = '';
    store.state['order.statusAndAction'].forEach((item) => {
        if (item.status.value == value && item.status.actionName) {
            str = item.status.actionName;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoOrderNodeStatus', function (value) {
    let str = '';
    store.state['order.statusAndAction'].forEach((item) => {
        if (item.status.value == value && item.status.name) {
            str = item.status.name;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoOrderNodeActions', function (value) {
    let str = '';
    store.state['order.statusAndAction'].forEach((item) => {
        if (item.action.value == value && item.action.name) {
            str = item.action.name;
        }
    });
    return str ? str : value;
})
Vue.filter('logisticsV4DeliveryCompany', function (value) {
    let str = '';
    store.state.deliveryCompanies.forEach((item) => {
        if (item.code == value) {
            str = item.name;
        }
    });
    return str ? str : value;
})
Vue.filter('deliveryPaymentTypes', function (value) {
    let str = '';
    store.state.deliveryPaymentTypes.forEach((item) => {
        if (item.id == value) {
            str = item.name;
        }
    });
    return str ? str : value;
})
Vue.filter('deliveryTypes', function (value) {
    let str = '';
    store.state.deliveryTypes.forEach((item) => {
        if (item.id == value) {
            str = item.name;
        }
    });
    return str ? str : value;
})
Vue.filter('zerosoFinanceState', function (value) {
    let result = {
        inbound_receipt: '已收款',
        inbound_partial: '部分收款',
        inbound_no_receipt: '未收款',
        outbound_receipt: '已付款',
        outbound_partial: '部分付款',
        outbound_no_receipt: '未付款',
        invoice_invoice: '已开票',
        invoice_partial: '部分开票',
        invoice_no_invoice: '未开票',
    };
    return result[value] || value
})
Vue.filter('zerosoAccountMoveState', function (value) {
    let result = {
        draft: '已制单',
        checked: '已复核',
        verified: '已记账',
    };
    return result[value] || value
})


Vue.filter('mainCompanyAbbreviationCode', function (value, param) {
    let str = '';
    if (param && store.state.mainCompanyAbbreviationCode[param]) {
        str = store.state.mainCompanyAbbreviationCode[param]
    }
    return str ? str : value;
})

Vue.filter('zerosoInvoiceAddress', function (obj) {
    let str = '';
    if (obj) {
        if (obj.name) str += obj.name + '，';
        if (obj.phone) str += obj.phone + '，';
        if (obj.country) {
            let country = obj.country;
            store.state.country.forEach((item) => {
                if (item.code2 == obj.country) {
                    country = item.chinese_name;
                }
            });
            str += country + '，';
        }
        if (obj.province) str += obj.province;
        if (obj.city) str += obj.city;
        if (obj.district) str += obj.district;
        if (obj.street) str += obj.street + '，';
        if (obj.zip) str += obj.zip + '，';
        str = str.slice(0, str.length - 1);
    }
    return str;
})
Vue.filter('zerosoTaxCodeStatus', function (value) {
    let result = {
        'no_product': '没有对应产品',
        'no_trade_name': '没有对应品名',
        'no_tax_code': '没有纳税编码'
    };
    return result[value] || value
})
Vue.filter('logisticsStatus', function (value) {
    return store.state.logisticsStatus[value] || value
})
Vue.filter('logisticsV4BoxState', function (value) {
    const map = {
        in_stock: "库存中",
        in_pallet: "托盘中",
        in_transfer: "出库单中",
        transfered: "已出库",
        done: "完成",
    };
    return map[value] || value;
})
Vue.filter('mailState', function (value) {
    let map = {
        received: '已收件',
        send: '待发送',
        retry_send: '重新发送',
        send_success: '已发送',
        send_fail: '发送失败',
        partial_fail: '部分失败',
        delete: '已删除',
        draft: '草稿',
        outgoing: '正在发送',
        junk: '垃圾邮件',
    };
    return map[value] || value
})
Vue.filter('logisticsV4PackgeState', function (value) {
    let map = {
        draft: "草稿/draft",
        received: "已签收/received",
        abnormal: "验货异常/Cargo Bad",
        returned: "已退回/returns",
        canceled: "已取消/canceled",
        done: "已完成/done",
    };
    return map[value] || value
})
Vue.filter('zersoLogisticsIncomingStatus', function (value) {
    let map = {
        draft: "草稿/draft",
        waiting: "待入库/toReceive",
        partial: "部分入库/someReceived",
        confirmed: "已确定/confirmed",
        done: "已完结/done",
        force_canceled: "强制完结/forcedDone",
        canceled: "取消/canceled",
        received: "已入库/Received"
    };
    return map[value] || value
})
Vue.filter('logisticsV4RequestState', function (value) {
    let map = {
        waiting: '未调拨',
        partial: '部分调拨',
        received: '已调拨',
        done: '已完结'
    };
    return map[value] || value
})
Vue.filter('logisticsV4TransferPreStatus', function (value) {
    let map = {
        done: '已封箱',
        in_pre_box: '已装箱',
        draft: '计划调拨'
    };
    return map[value] || value
})
Vue.filter('logisticsV4BoxType', function (value) {
    let map = {
        order: "订单箱",
        stock: "库存箱",
    };
    return map[value] || value
})
Vue.filter('logisticsV4PalletState', function (value) {
    let map = {
        in_stock: "库存中",
        in_transfer: "出库单中",
        archive: '已封托盘',
        transfered: "已出库",
        done: "完成",
    };
    return map[value] || value
})
Vue.filter('logisticsV4StockOutState', function (value) {
    let map = {
        draft: '草稿',
        waiting: '待出库',
        info_send: '已通知客户',
        delivery_confirmed: '已快递下单',
        cargo_send: '已出库',
        done: '已完成'
    };
    return map[value] || value
})
Vue.filter('orderDeliveryMethod', function (value) {
    let map = {
        direct_delivery: '直接发货',
        foreign_delivery: '海外仓发货',
        domestic_delivery: '国内仓发货',
        unknown: '未确定',
    };
    return map[value] || value
})

Vue.filter('productQuotationCommentType', function (value) {
    return store.state.productQuotationCommentAll[value] ? store.state.productQuotationCommentAll[value].label : value;
})
Vue.filter('productQuotationComment', function (value,commentType,comment) {
    let str = '';
    if(value === 0 || value === '0'){
        str = comment
    }else if(commentType && store.state.productQuotationCommentAll[commentType]){
        store.state.productQuotationCommentAll[commentType].children.forEach((item) => {
            if (item.code == value) {
                str = item.label;
            }
        });
    }
    return str ? str : value;
});


//数字+%
Vue.filter('percent', function (value) {
    if (value || value === 0) {
        return value + '%'
    }
    return value
})
//小数转化百分数
Vue.filter('tenthsToPercent', function (value) {
    let str = '';
    if (value || value === 0) {
        str = Math.round(value * 10000) / 100;
        str = str + '%'
    }
    return str
})
Vue.filter('roundConfigName', function (value) {
    let str = '';
    store.state.roundConfigName.forEach((item) => {
        if (item.code == value) {
            str = item.label;
        }
    });
    return str ? str : value;
})


//零搜时间格式化，去掉T，保留时分秒
Vue.filter('zerosoTimeFormat', function (value) {
    return zerosoCompanyTime(value)
});
//零搜日期格式化，去掉T，仅保留日期
Vue.filter('zerosoDateFormat', function (value) {
    return zerosoCompanyTime(value, "YYYY-MM-DD")
});
Vue.filter('zerosoEuroTime', function (dateTime) {
    let thisTimeZone = store.state.currentUser.timezone || "Asia/Shanghai";
    if (!(/\+00:00$/.test(dateTime)) && /T/.test(dateTime)) {
        dateTime = dateTime + '+00:00'
    }
    return moment.tz(dateTime, thisTimeZone).format('DD.MM.YYYY')
});
let zerosoCompanyTime = Vue.filter('zerosoCompanyTime', function (dateTime, dateFormat) {
    if (!dateTime) return '';
    dateFormat = dateFormat || 'YYYY-MM-DD HH:mm';

    let thisTimeZone = store.state.currentUser.timezone || "Asia/Shanghai";
    if (!(/\+00:00$/.test(dateTime)) && /T/.test(dateTime)) {
        dateTime = dateTime + '+00:00'
    }
    return moment.tz(dateTime, thisTimeZone).format(dateFormat);
});
Vue.filter('zerosoCompanyDate', function (dateTime) {
    return zerosoCompanyTime(dateTime, "YYYY-MM-DD")
});


//取绝对值
Vue.filter('zerosoAbs', function (value) {
    let str = '';
    if (value) {
        if (value < 0) {
            str = Math.abs(value).toFixed(2);
        } else {
            str = (value * 1).toFixed(2);
        }
    } else if (value === 0) {
        str = '0.00';
    }
    return str || value;
});
Vue.filter('zerosoRound', function (value, number) {
    if (value) {
        return new Decimal(value).toFixed(number || number === 0 ? number : 2)
    } else {
        return value
    }
});


Vue.filter('zerosoDigitUppercase', function (n) {
    let fraction = ['角', '分'];
    let digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    let unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    let head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    let s = '';
    for (let k = 0; k < fraction.length; k++) {
        s += (digit[Math.floor(shiftRight(n, 1 + k)) % 10] + fraction[k]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = '';
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(shiftLeft(n, 1));
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');


    // 向右移位
    function shiftRight(number, digit) {
        digit = parseInt(digit, 10);
        let value = number.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + digit) : digit))
    }

    // 向左移位
    function shiftLeft(number, digit) {
        digit = parseInt(digit, 10);
        let value = number.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - digit) : -digit))
    }

});
