import Vue from "vue";
import store from "../../vuex/store";

let isoCurrencyFun = Vue.filter('isoCurrency');
let isoCurrencyDeFun = Vue.filter('isoCurrencyDe');
let zerosoCompanyTime = Vue.filter('zerosoCompanyTime');
let zerosoCompanyDate = Vue.filter('zerosoCompanyDate');
let zerosoEuroTime = Vue.filter('zerosoEuroTime');
let paymentMethod = Vue.filter('paymentMethod');
let zerosoPaymentMailTemplate = Vue.filter('zerosoPaymentMailTemplate');
let zerosoRound = Vue.filter('zerosoRound');
let zerosoDigitUppercase = Vue.filter('zerosoDigitUppercase');
let formatMoney = Vue.filter('formatMoney');
let logisticsV4DeliveryCompany = Vue.filter('logisticsV4DeliveryCompany');
let zerosoCountry = Vue.filter('country');

let reportService = {

    //B端，询报价单合同和报价，生成模板数据整理
    setInquiryReport(template, data, reportType, callback) {
        let self = this;
        let currentTime = Vue.prototype.$moment().format('YYYY-MM-DD HH:mm');
        let inquiryData = JSON.parse(JSON.stringify(data));

        let isAlreadyExpenseApproved = ['EXPENSE_APPROVED', 'INQUIRY_REPLIED', 'QUOTATION_SENT', 'CONTRACT_SENT', 'CONTRACT_SIGNED', 'CONTRACT_ENFORCED'].indexOf(inquiryData.inquiry_quote_state) > -1;

        let result = {
            id: template.id.toString(),
            file_name: template.file_name + '_' + inquiryData.id,
        };

        //甲方 客户
        let partyA = {
            account_company_id: inquiryData.customer.company ? inquiryData.customer.company.account_company_id : '',
            account_company: inquiryData.customer.company,
            account_user_id: inquiryData.customer.user ? inquiryData.customer.user.account_user_id : '',
            account_user: inquiryData.customer.user,
        };
        //乙方 当前公司
        let currentCompany = JSON.parse(JSON.stringify(store.state.currentCompany));
        currentCompany.account_user_id = currentCompany.user_id;
        let partyB = {
            account_company_id: currentCompany.account_company_id,
            account_company: currentCompany,
            account_user_id: currentCompany.account_user_id,
            account_user: currentCompany,
        };

        function setInquiryReportFormatMoney(money) {
            if (money || money === 0 || money === '0') {
                return formatMoney(money, inquiryData.currency_unit.currency)
            } else {
                return '待确认'
            }
        }


        //组装产品行数据
        let order_lines = [];
        if (inquiryData.products) {
            inquiryData.products.forEach((item) => {
                if (!item.mark_as_deleted && item.product_quote_state !== 'INVALID' && item.product_quote_state !== 'REPLACED') {
                    let without_tariff_purchase_unit_price, with_tariff_purchase_unit_price, with_tariff_total_price;

                    if (isAlreadyExpenseApproved) {
                        //当已核准之后，并且是旧单子，包含有单独的增值税额，需要把增值税均摊到产品价格之上
                        if (inquiryData.sales_price.additional_charges.extra_charges.value_add_cny_tax && inquiryData.sales_price.additional_charges.extra_charges.value_add_cny_tax !== 0) {
                            let productPriceWithTariffWithTax = (Number(item.prodcut_quotation.sales.total_cny_price_with_tariff) / item.prodcut_quotation.quantity * 1.13).myRound(2);
                            without_tariff_purchase_unit_price = setInquiryReportFormatMoney(item.prodcut_quotation.sales.cny_price_with_tariff);
                            with_tariff_purchase_unit_price = setInquiryReportFormatMoney(productPriceWithTariffWithTax);
                            with_tariff_total_price = setInquiryReportFormatMoney((productPriceWithTariffWithTax * item.prodcut_quotation.quantity).myRound(2));
                        } else {
                            without_tariff_purchase_unit_price = setInquiryReportFormatMoney(item.prodcut_quotation.sales.cny_price_with_tariff);
                            with_tariff_purchase_unit_price = setInquiryReportFormatMoney(Number(item.prodcut_quotation.sales.total_cny_price_with_tariff) / item.prodcut_quotation.quantity);
                            with_tariff_total_price = setInquiryReportFormatMoney(item.prodcut_quotation.sales.total_cny_price_with_tariff);
                        }
                    } else {
                        without_tariff_purchase_unit_price = setInquiryReportFormatMoney(item.prodcut_quotation.sales.price);
                        with_tariff_purchase_unit_price = setInquiryReportFormatMoney(Number(item.prodcut_quotation.sales.total_price_with_tariff) / item.prodcut_quotation.quantity);
                        with_tariff_total_price = setInquiryReportFormatMoney(item.prodcut_quotation.sales.total_price_with_tariff);
                    }

                    let tariff_ratio = '待确认';
                    if (item.prodcut_quotation.sales.tariff || item.prodcut_quotation.sales.tariff === 0) {
                        tariff_ratio = (Number(item.prodcut_quotation.sales.tariff) + (Number(item.prodcut_quotation.sales.extra_import_tariff) || 0)) + '%';
                    }

                    order_lines.push({
                        tariff_ratio: tariff_ratio,// 关税税率
                        without_tariff_purchase_unit_price: without_tariff_purchase_unit_price,//  未税单价
                        with_tariff_purchase_unit_price: with_tariff_purchase_unit_price,// 含税产品单价
                        with_tariff_total_price: with_tariff_total_price,// 含税总价

                        shipment_period_week: item.prodcut_quotation.shipment_period || '',
                        qty: item.prodcut_quotation.quantity || '',
                        product: {
                            brand_id: inquiryData.brand.id,
                            brand_name: inquiryData.brand.name,
                            brand: {
                                id: inquiryData.brand.id,
                                name: inquiryData.brand.name,
                            },
                            product_id: item.product_id,
                            product_name: item.product_name || '',
                            product_order_no: item.product_order_no || '',
                            product_parameter: item.product_parameter || '',
                            product_trade_name: {
                                product_cn_name: item.product_trade_name.chinese_name || '',
                            },
                        }
                    })
                }
            })
        }


        //生成订单打印数据
        let firstPayRate = 0.3;
        let domestic_total_price = inquiryData.sales_price.grand_cny_price;//人民币总价,只有核准税费之后才有

        let product_total_price = null;//产品总价
        let attached_total_fee = null;//附加费
        let value_added_tax = null;//增值税
        let foreign_storage_opr_fee = null;
        let domestic_storage_opr_fee = null;

        if (isAlreadyExpenseApproved) {
            product_total_price = setInquiryReportFormatMoney(inquiryData.sales_price.total_cny_products_price);
            attached_total_fee = setInquiryReportFormatMoney(0);
            value_added_tax = setInquiryReportFormatMoney(inquiryData.sales_price.additional_charges.extra_charges.value_add_cny_tax);

            foreign_storage_opr_fee = setInquiryReportFormatMoney(0);
            domestic_storage_opr_fee = setInquiryReportFormatMoney(0);
        } else {
            product_total_price = setInquiryReportFormatMoney(inquiryData.sales_price.total_products_price);
            attached_total_fee = ((inquiryData.sales_price.additional_charges.product_item_based_fees.handling_and_packing_fees || 0)
                    + (inquiryData.sales_price.additional_charges.product_item_based_fees.overseas_customs_fees || 0)
                    + (inquiryData.sales_price.additional_charges.product_item_based_fees.domestic_customs_clearance_fees || 0)
                    + (inquiryData.sales_price.additional_charges.product_weight_based_fees.supplier_pick_up_fees || 0)
                    + (inquiryData.sales_price.additional_charges.product_weight_based_fees.international_logistics_fees || 0)
                    + (inquiryData.sales_price.additional_charges.product_weight_based_fees.domestic_logistics_fees || 0)
                    + (inquiryData.sales_price.additional_charges.extra_charges.insurance_fees || 0)
                    + (inquiryData.sales_price.additional_charges.extra_charges.foreign_exchange_fees || 0)) || null;
            attached_total_fee = setInquiryReportFormatMoney(attached_total_fee)
            value_added_tax = setInquiryReportFormatMoney(inquiryData.sales_price.additional_charges.extra_charges.value_add_tax);

            foreign_storage_opr_fee = setInquiryReportFormatMoney(inquiryData.sales_price.additional_charges.optional_service_fees.oversee_storage_service_fee)
            domestic_storage_opr_fee = setInquiryReportFormatMoney(inquiryData.sales_price.additional_charges.optional_service_fees.domestic_storage_service_fee)
        }

        result.data = {
            name: inquiryData.id,//合同编号
            order_name: inquiryData.id,//合同编号

            product_total_price: product_total_price, //'产品总价'
            foreign_storage_opr_fee: foreign_storage_opr_fee, //'海外仓储操作费'
            domestic_storage_opr_fee: domestic_storage_opr_fee, //'中国仓储操作费'
            attached_total_fee: attached_total_fee, // '附加费总计'
            value_added_tax: value_added_tax, // '增值税'
            cur_custom_exchange_rate: inquiryData.currency_unit.exchange_rate || '待确认', // '本月海关汇率'

            domestic_total_price: domestic_total_price ? formatMoney(domestic_total_price, 'CNY') : '待确认', // '人民币总价',
            domestic_total_price_cn: domestic_total_price ? zerosoDigitUppercase(domestic_total_price) : '待确认', // '人民币总价中文格式'
            first_pay_amount: domestic_total_price ? formatMoney((domestic_total_price * firstPayRate).myRound(2), 'CNY') : '待确认', // '首付金额'
            last_pay_amount: domestic_total_price ? formatMoney((domestic_total_price - (domestic_total_price * firstPayRate).myRound(2)), 'CNY') : '待确认', // '尾款金额'

            deliver_type: inquiryData.customer.delivery_mode === 'DEMOSTIC' ? 3 : inquiryData.customer.delivery_mode === 'OFFSHORE' ? 2 : 1, //发货方式

            report_create_date: zerosoCompanyDate(currentTime),
            report_create_time: zerosoCompanyTime(currentTime),
            report_create_time_euro: zerosoEuroTime(currentTime),
            order_quoted_time: zerosoCompanyTime(currentTime),
            brand: inquiryData.brand,
            currency: inquiryData.currency_unit.currency,
            total_amount: domestic_total_price ? formatMoney(domestic_total_price, 'CNY') : '待确认',
            total_amount_cn: domestic_total_price ? formatMoney(domestic_total_price, 'CNY') : '待确认',
            tax_text: '(a+b)',
            currentCompany: store.state.currentCompany,
            currentUser: store.state.currentUser,

            party_a: partyA ? partyA : null,
            party_b: partyB ? partyB : null,
            order_lines: order_lines
        };


        let resultPromise = [];


        //获取甲方地址信息
        if (partyA.account_company_id) {
            resultPromise.push(self.getPartnerAddresses(partyA.account_company_id).then(function (addressA) {
                result.data.party_a.address = self.setPartnerAddress(addressA.msg)
            }));
            //获取甲方公司信息
            resultPromise.push(self.getPartnerInfo(partyA.account_company_id).then(function (partnerA) {
                result.data.party_a.account_company.bank_account = partnerA.msg.bank_account || '';
                result.data.party_a.account_company.bank_name = partnerA.msg.bank_name || '';
                result.data.party_a.account_company.invoice_address = partnerA.msg.invoice_address || '';
                result.data.party_a.account_company.invoice_phone = partnerA.msg.invoice_phone || '';
                result.data.party_a.account_company.taxpayer_code = partnerA.msg.taxpayer_code || '';
                result.data.party_a.account_company.website = partnerA.msg.website || '';
                result.data.party_a.account_company.email = partnerA.msg.email || '';
                result.data.party_a.follower = partnerA.msg.follower || {};
            }))
            //获取甲方用户信息
            resultPromise.push(self.getPartnerUser(partyA.account_company_id).then(function (userData) {
                if (userData.msg) {
                    userData.msg.forEach((item) => {
                        if (result.data.party_a.account_user_id == item.id) {
                            result.data.party_a.account_user = item;
                        }
                    })
                }
            }))
        }
        //获取乙方地址信息
        if (partyB.account_company_id) {
            resultPromise.push(self.getPartnerAddresses(partyB.account_company_id).then(function (addressB) {
                result.data.party_b.address = self.setPartnerAddress(addressB.msg)
            }));
            //获取乙方公司信息
            resultPromise.push(self.getPartnerInfo(partyB.account_company_id).then(function (partnerB) {
                result.data.party_b.account_company.bank_account = partnerB.msg.bank_account || '';
                result.data.party_b.account_company.bank_name = partnerB.msg.bank_name || '';
                result.data.party_b.account_company.invoice_address = partnerB.msg.invoice_address || '';
                result.data.party_b.account_company.invoice_phone = partnerB.msg.invoice_phone || '';
                result.data.party_b.account_company.taxpayer_code = partnerB.msg.taxpayer_code || '';
                result.data.party_b.account_company.website = partnerB.msg.website || '';
                result.data.party_b.account_company.email = partnerB.msg.email || '';
                result.data.party_b.follower = partnerB.msg.follower || {};
            }))
            //获取乙方用户信息
            resultPromise.push(self.getPartnerUser(partyB.account_company_id).then(function (userData) {
                if (userData.msg) {
                    userData.msg.forEach((item) => {
                        if (result.data.party_b.account_user_id == item.id) {
                            result.data.party_b.account_user = item;
                        }
                    })
                }
            }))
        }

        Promise.all(resultPromise).then(function () {
            result = self.formatPrintData(result);
            callback && callback(result);
        });
    },


    //0端询价单，发送邮件，生成模板
    setInquiryEmail(template, data, selectProductList, callback) {
        let self = this;
        let currentTime = Vue.prototype.$moment().format('YYYY-MM-DD HH:mm');
        let inquiryData = JSON.parse(JSON.stringify(data));

        let result = {
            id: template.id.toString(),
            file_name: template.name + '_' + inquiryData.id,
        };
        let currentCompany = JSON.parse(JSON.stringify(store.state.currentCompany));
        currentCompany.account_user_id = currentCompany.user_id;

        //当前公司
        let partyA = {
            account_company_id: currentCompany.account_company_id,
            account_company: currentCompany,
            account_user_id: currentCompany.account_user_id,
            account_user: currentCompany,

        };
        //供应商
        let partyB = {
            account_company_id: inquiryData.supplier_company.account_company_id,
            account_company: inquiryData.supplier_company,
            account_user_id: '',
            account_user: {},
            address: {},
            email: '',
        };

        //组装产品行数据
        let order_lines = [];
        if (selectProductList) {
            selectProductList.forEach((item) => {
                if (item.valid) {
                    order_lines.push({
                        qty: '',
                        product: {
                            brand_id: inquiryData.brand.id,
                            brand_name: inquiryData.brand.name,
                            brand: {
                                id: inquiryData.brand.id,
                                name: inquiryData.brand.name,
                            },
                            product_id: item.product_id,
                            product_name: item.type_no || '',
                            product_order_no: item.order_no || '',
                            product_parameter: item.parameters || '',
                        }
                    })
                }
            })
        }


        //生成订单打印数据
        result.data = {
            name: inquiryData.id,
            order_name: inquiryData.id,

            report_create_date: zerosoCompanyDate(currentTime),
            report_create_time: zerosoCompanyTime(currentTime),
            report_create_time_euro: zerosoEuroTime(currentTime),
            order_quoted_time: zerosoCompanyTime(currentTime),
            brand: inquiryData.brand,
            currentCompany: store.state.currentCompany,
            currentUser: store.state.currentUser,

            party_a: partyA ? partyA : null,
            party_b: partyB ? partyB : null,

            order_lines: order_lines
        };


        let resultPromise = [];

        if (partyB.account_company_id) {
            resultPromise.push(self.getPartnerAddresses(partyB.account_company_id).then(function (addressB) {
                result.data.party_b.address = self.setPartnerAddress(addressB.msg)
            }));
            //获取供应商公司信息
            resultPromise.push(self.getPartnerInfo(partyB.account_company_id).then(function (partnerB) {
                result.data.party_b.account_company.bank_account = partnerB.msg.bank_account || '';
                result.data.party_b.account_company.bank_name = partnerB.msg.bank_name || '';
                result.data.party_b.account_company.invoice_address = partnerB.msg.invoice_address || '';
                result.data.party_b.account_company.invoice_phone = partnerB.msg.invoice_phone || '';
                result.data.party_b.account_company.taxpayer_code = partnerB.msg.taxpayer_code || '';
                result.data.party_b.account_company.website = partnerB.msg.website || '';
                result.data.party_b.account_company.email = partnerB.msg.email || '';
                result.data.party_b.email = partnerB.msg.email || '';
                result.data.party_b.follower = partnerB.msg.follower || {};
            }))

            //获取当前公司用户信息
            resultPromise.push(self.getPartnerUser(partyB.account_company_id).then(function (userData) {
                if (userData.msg) {
                    if (userData.msg.length > 0) {
                        result.data.party_b.account_user_id = userData.msg[0].account_user_id;
                        result.data.party_b.account_user = userData.msg[0];
                        if (userData.msg[0].email) {
                            if (!result.data.party_b.email) result.data.party_b.email = userData.msg[0].email;
                            if (!result.data.party_b.account_company.email) result.data.party_b.account_company.email = userData.msg[0].email;
                        }

                    }
                }
            }))

        }

        Promise.all(resultPromise).then(function () {
            result = self.formatPrintData(result);
            callback && callback(result);
        }).catch(function () {
            result = self.formatPrintData(result);
            callback && callback(result);
        });
    },

    /**
     * @description 构建大订单打印数据
     * @param {object} template 模板信息
     * @param {object} data 订单数据
     * @param {string} accountCompanyId 订单
     * @return {boolean}
     */
    bigOrderReport(template, data, accountCompanyId, callback) {
        let self = this;

        let currentTime = Vue.prototype.$moment().format('YYYY-MM-DD HH:mm');
        let order = JSON.parse(JSON.stringify(data));
        let result = {
            id: template.id.toString(),
            file_name: template.file_name ? template.file_name + '_' + order.name : order.name,
        };
        let partyA = {};
        let partyB = {};
        let order_mutually_confirm_time = null;
        let order_quoted_time = null;

        if (order && order.order_nodes) {
            order.order_nodes.forEach(function (node, index) {
                if (node.account_company_id === accountCompanyId) {
                    partyB = node;
                    partyB.email = partyB.account_user && partyB.account_user.email ? partyB.account_user.email : partyB.account_company.email;

                    partyA = order.order_nodes[index + 1];
                    partyA.email = partyA.account_user && partyA.account_user.email ? partyA.account_user.email : partyA.account_company.email
                }
            });
        }

        function orderLines(lines, partyBCompanyId, currency) {
            let result = [];

            lines.forEach(function (line) {
                let data = {};
                if (line.is_active) {
                    data.product = line.product;
                    data.qty = line.qty;
                    line.order_lines.forEach(function (orderLine) {
                        if (orderLine.account_company_id === partyBCompanyId) {
                            data.price_amount = isoCurrencyFun(orderLine.price_amount, currency);
                            data.price_taxed_unit = isoCurrencyFun(orderLine.price_taxed_unit, currency);
                            data.price_unit = isoCurrencyFun(orderLine.price_unit, currency);
                            data.price_unit_de = isoCurrencyDeFun(orderLine.price_unit, currency);
                            data.price_untaxed_amount = isoCurrencyFun(orderLine.price_untaxed_amount, currency);
                            data.shipment_period = orderLine.shipment_period;
                            data.shipment_period_week = (parseInt(orderLine.shipment_period / 7) + 1).toString() + ' ~ ' + (parseInt(orderLine.shipment_period / 7) + 3).toString();
                            data.order_node_id = orderLine.order_node_id;
                        }
                    });
                    result.push(data)
                }
            });
            return result
        }

        if (partyB.node_state_time) {
            partyB.node_state_time.forEach(function (line) {
                if (line.state_name === 'mutually_confirm') {
                    order_mutually_confirm_time = zerosoCompanyTime(line.state_time)
                }
                if (line.state_name === 'quoted') {
                    order_quoted_time = zerosoCompanyTime(line.state_time)
                }
            });
        }

        //生成订单打印数据
        result.data = {
            report_create_date: zerosoCompanyDate(currentTime),
            report_create_time: zerosoCompanyTime(currentTime),
            report_create_time_euro: zerosoEuroTime(currentTime),
            order_create_time: zerosoEuroTime(order.create_time),
            order_mutually_confirm_time: order_mutually_confirm_time,
            order_quoted_time: order_quoted_time,
            order_name: order.name,
            brand: order.brand,
            party_a: partyA ? partyA : null,
            party_b: partyB ? partyB : null,
            waiting_quote_date: getStateTime('waiting_quote'),
            mutually_confirm_date: getStateTime('mutually_confirm'),
            currency: partyB.currency,
            extra_fee: isoCurrencyFun(partyB.extra_fee, partyB.currency),
            exchange_rate: partyB.exchange_rate,
            payment_method: paymentMethod(partyB.payment_method),
            payment_method_mail_template: zerosoPaymentMailTemplate(partyB.payment_method),
            round_taxed_price: isoCurrencyFun(partyB.round_taxed_price, partyB.currency),
            tax_rate: partyB.tax_rate,
            total_amount: isoCurrencyFun(partyB.total_amount, partyB.currency),
            total_amount_97: isoCurrencyFun(zerosoRound(partyB.total_amount * 0.97, 2), partyB.currency),
            total_amount_cn: zerosoDigitUppercase(partyB.total_amount),
            tax_text: '(含' + partyB.tax_rate + '%增值税，含运费)',
            untaxed_amount: isoCurrencyFun(partyB.untaxed_amount, partyB.currency),
            currentCompany: store.state.currentCompany,
            currentUser: store.state.currentUser,
        };

        function getStateTime(state) {
            let result = '';
            partyB.node_state_time.forEach(function (line) {
                if (line.state_name === state) {
                    result = zerosoEuroTime(line.state_time)
                }
            });
            return result
        }

        if (template.name && /确认下单|Bestellung|Purchase/.test(template.name) && !partyB.node_info.offer_num) {
            partyB.node_info.offer_num = '';
            Vue.prototype.$message({
                showClose: true,
                message: '该订单未填写供应商的报价单号。',
                type: 'warning'
            });
        }

        // if (!result.data.party_a.account_user_id && data.order_type !== 'merged') {
        //     Vue.prototype.$message({
        //         showClose: true,
        //         message: '客户公司未选择联系人请填写后再生成邮件模板。',
        //         type: 'error'
        //     });
        //     return false
        // }

        //仕达威专属字段
        const sdvPayment = {
            earnest_payment: "甲方应于本合同签署后3日内向乙方支付合同总金额的30%作为预付款，乙方收到预付款后执行订单，乙方收到仓库到货通知后方告知甲方，甲方应于收到通知后3日内向乙方支付余款，乙方收到余款后，安排报关发货。",
            advance_payment: "甲方应于本合同签署后3日内向乙方支付合同总金额的100%作为预付款，乙方收到预付款后执行订单。",
            invoiced_payment: '乙方收到货和发票后，甲方3个工作日内根据发票金额付清全款。'
        };

        result.data.payment_method_sdv = sdvPayment[partyB.payment_method];

        //生成订单行数据需要考虑 合并订单的情况
        if (order.order_type === 'merged') {
            result.data.order_lines = [];
            order.origin_orders.forEach(function (order) {
                result.data.order_lines = result.data.order_lines.concat(orderLines(order.order_products, partyB.account_company_id, partyB.currency))
            });
        } else {
            result.data.order_lines = orderLines(order.order_products, partyB.account_company_id, partyB.currency)
        }

        let resultPromise = [];

        /**
         * @description 获取地址信息，当公司默认地址存在时取公司默认地址，如公司默认地址不存在时取默认发货地址，都不存在时返回空
         * @param {array} addresses 合作伙伴地址列表
         * @return {*}
         */


        //获取甲方地址信息
        if (partyA.account_company_id) {
            resultPromise.push(self.getPartnerAddresses(partyA.account_company_id).then(function (addressA) {
                result.data.party_a.address = self.setPartnerAddress(addressA.msg)
            }));

            //获取甲方公司信息
            resultPromise.push(self.getPartnerInfo(partyA.account_company_id).then(function (partnerA) {
                result.data.party_a.account_company.bank_account = partnerA.msg.bank_account;
                result.data.party_a.account_company.bank_name = partnerA.msg.bank_name;
                result.data.party_a.account_company.invoice_address = partnerA.msg.invoice_address;
                result.data.party_a.account_company.invoice_phone = partnerA.msg.invoice_phone;
                result.data.party_a.account_company.taxpayer_code = partnerA.msg.taxpayer_code;
                result.data.party_a.follower = partnerA.msg.follower || {};
            }))
        }
        //获取乙方地址信息
        if (partyB.account_company_id) {
            resultPromise.push(self.getPartnerAddresses(partyB.account_company_id).then(function (addressB) {
                result.data.party_b.address = self.setPartnerAddress(addressB.msg)
            }));
        }

        if (partyA.account_company_id && partyB.account_company_id && partyB.payment_method === 'earnest_payment') {
            resultPromise.push(self.getAccountingRemainingMoney({
                order_name: order.name,
                supplier_company_id: partyB.account_company_id,
                customer_company_id: partyA.account_company_id
            }).then(function (remainingMoney) {
                result.data.remaining_money = isoCurrencyFun(remainingMoney.msg.remaining_money, partyB.currency);
            }))
        } else {
            result.data.remaining_money = '<span style="color: red">未知</span>'
        }

        //获取订单报价单附件
        if (template.name && /谈折扣|确认价格/.test(template.name)) {
            resultPromise.push(self.getFile({
                subsystem: "platform",
                module_name: "order_node_offer",
                module_id: partyB.id
            }).then(function (file) {
                result.data.offer_file_id = file[0] && file[0].id
            }));
        }
        //获取订单OC附件
        if (template.name && /催货/.test(template.name)) {
            resultPromise.push(self.getFile({
                subsystem: "platform",
                module_name: "order_node_oc",
                module_id: partyB.id
            }).then(function (file) {
                result.data.oc_file_id = file[0] && file[0].id
            }))
        }

        Promise.all(resultPromise).then(function () {
            result = self.formatPrintData(result);
            callback && callback(result);
        });
    },


    //出库单邮件模板数据整理
    stockOutReport(template, data, callback) {
        let self = this;

        let currentTime = new Date().getTime();
        let templateData = {
            id: template.id.toString(),
            file_name: template.fileName ? template.fileName + '_' + data.outgoing_transfer_name : data.outgoing_transfer_name,

            data: {
                report_create_time: zerosoCompanyTime(currentTime),
                report_create_time_euro: zerosoEuroTime(currentTime),
                owner: store.state.currentUser.company,
                currentUser: store.state.currentUser,
                currentCompany: store.state.currentCompany,
                internal_transfer_name: data.outgoing_transfer_name,
                received_from_company: data.belong_to_company,
                belong_to_company: data.belong_to_company,
                sale_company: data.sale_company,
                belong_to_company_address: data.from_address,
                send_to_company: data.send_to_company,
                send_to_company_address: data.to_address,
                orders: data.orders,
                delivery_info: data.delivery_info,
            }
        };

        if (data.delivery_info) {
            templateData.data.delivery_info = {
                delivery_company_cn: logisticsV4DeliveryCompany(data.delivery_info.delivery_company),
                primary_mail_no: data.delivery_info.primary_mail_no,
            };
            if (data.delivery_info.secondary_mail_no && data.delivery_info.secondary_mail_no.length) {
                templateData.data.delivery_info.primary_mail_no += ',' + data.delivery_info.secondary_mail_no.toString()
            }

        }


        let boxLines = [];
        let totalPrice = 0;
        let totalNetWeight = 0;
        let totalGrossWeight = 0;
        let weightCoefficient = 0;
        let grossWeightTotal = 0;
        data.box_product_list.forEach(function (box) {
            box.box_lines.forEach(function (line) {
                grossWeightTotal += Number(zerosoRound(line.product_info.gross_weight * line.quantity, 3))
            })
        });

        weightCoefficient = Number(data.extra_weight) / grossWeightTotal + 1;


        //生成需要打印的箱行数据
        data.box_product_list.forEach(function (box) {
            box.box_lines.forEach(function (line, index) {
                let newLine = {};
                let customsInfo = line.product_info.product_customs_info;
                let productTradeName = line.product_info.product_trade_name;

                newLine.final_company = line.belong_to_company;
                newLine.unit_price = zerosoRound(Number(line.price_unit), 2);
                newLine.unit_price_de = Number(zerosoRound(Number(line.price_unit), 2)).toLocaleString("es-ES", {minimumFractionDigits: 2});
                newLine.value = zerosoRound(zerosoRound(Number(line.price_unit), 2) * (line.quantity || 0), 2) || 0;
                newLine.value_de = Number(zerosoRound(zerosoRound(Number(line.price_unit), 2) * (line.quantity || 0), 2)).toLocaleString("es-ES", {minimumFractionDigits: 2}) || 0;
                newLine.gross_weight = zerosoRound(line.product_info.gross_weight * line.quantity * weightCoefficient, 3) || 0;
                newLine.net_weight_amount = zerosoRound(line.product_info.net_weight * line.quantity, 3) || 0;
                newLine.cost_price = line.unit_price || null;
                newLine.product_name = line.product_info.product_name || null;
                newLine.product_order_no = line.product_info.product_order_no || null;
                newLine.brand_name = line.product_info.brand.name || null;
                newLine.net_weight = line.product_info.net_weight || null;
                newLine.weight = line.product_info.gross_weight || null;
                newLine.quantity = line.quantity;
                newLine.box_name = box.box_name;
                newLine.order_name = box.order_name;
                newLine.oc_num = box.oc_num || null;
                newLine.product_cn_name = line.product_info.product_trade_name ? line.product_info.product_trade_name.product_cn_name : null;
                newLine.product_en_name = line.product_info.product_trade_name ? line.product_info.product_trade_name.product_en_name : null;
                newLine.currency = box.currency;
                newLine.final_company = box.sale_company ? box.sale_company.company_name : null;


                //TODO 海关信息获取
                newLine.origin_country = zerosoCountry(line.product_info.origin_of_country) || null;

                newLine.outgoing_hs_code = customsInfo ? customsInfo.customs_de_code : null;
                newLine.outgoing_product_type_name = productTradeName ? productTradeName.product_de_name : null;
                newLine.outgoing_hs_code_description = customsInfo ? customsInfo.customs_de_description : null;
                newLine.outgoing_tariff = null;

                newLine.incoming_hs_code = customsInfo ? customsInfo.customs_cn_code : null;
                newLine.incoming_hs_code_description = customsInfo ? customsInfo.customs_cn_description : null;
                newLine.incoming_product_type_name = productTradeName ? productTradeName.product_cn_name : null;
                newLine.incoming_tariff = customsInfo ? customsInfo.import_cn_tariffs : null;
                newLine.sequence = index + 1;
                newLine.product_cn_customs_description = line.product_info.product_cn_customs_description;


                totalPrice = totalPrice + Number(newLine.value);
                totalNetWeight += (line.product_info.net_weight * line.quantity);
                totalGrossWeight += (line.product_info.gross_weight * line.quantity);

                boxLines.push(newLine)
            })
        });

        templateData.data.box_lines = boxLines;
        templateData.data.total_price = zerosoRound(totalPrice, 2);
        templateData.data.total_price_de = Number(zerosoRound(totalPrice, 2)).toLocaleString("es-ES", {minimumFractionDigits: 2});
        templateData.data.total_net_weight = zerosoRound(totalNetWeight, 3);
        templateData.data.total_gross_weight = zerosoRound(totalGrossWeight + Number(data.extra_weight), 3);
        templateData.data.total_box_qty = data.box_product_list.length;


        let resultPromise = [];
        //获取当前公司的信息，填充到 owner 字段，包括整理一个公司地址companyAddress
        resultPromise.push(self.getMyCompanyInfo().then(function (result) {
            let companyAddress = null;
            if (result.msg.account_addresses && result.msg.account_addresses.length > 0) {
                companyAddress = result.msg.account_addresses[0];
                result.msg.account_addresses.forEach((item) => {
                    if (item.is_primary) {
                        companyAddress = item;
                    }
                })
            }
            templateData.data.owner = result.msg;
            templateData.data.owner.companyAddress = companyAddress;
        }));


        Promise.all(resultPromise).then(function () {
            templateData = self.formatPrintData(templateData);
            callback && callback(templateData);
        }).catch(function () {
            templateData = self.formatPrintData(templateData);
            callback && callback(templateData);
        });

    },

    invoiceReport(template, data, callback) {
        let self=this;
        let result;
        let currentTime = new Date().getTime();
        result = {
            id: template.id.toString(),
            file_name: template.name ? template.name + '_' + data.invoice_number : data.invoice_number,
            data: {}
        };

        let orderList = [];
        data.reference.forEach(function (order) {
            if (!/合/.test(order.name)) {
                orderList.push(order.name)
            }
        });

        data.invoice_lines.forEach(function (line) {
            line.price_amount = zerosoRound(line.quantity * line.price, 2);
            line.price_amount_de = Number(zerosoRound(line.quantity * line.price, 2)).toLocaleString("es-ES", {minimumFractionDigits: 2});
            line.price_de = Number(line.price).toLocaleString("es-ES", {minimumFractionDigits: 2});
            line.quantity_de = parseInt(line.quantity)
        });

        result.data.invoice_number = data.invoice_number || '';
        result.data.orders_name = orderList.length ? orderList.toString() : '';
        result.data.express_company = data.delivery_info ? '顺丰' : '';
        result.data.express_number = data.delivery_info ? data.delivery_info.base_info.primary_mail_no : '';
        result.data.customer_company_name = data.customer_company_name || '';
        result.data.total_taxed = data.total_taxed || '';
        result.data.total = data.total || '';
        result.data.total_untaxed = zerosoRound(data.total_taxed - data.total, 2);
        result.data.tax_rate = data.tax_rate || '';
        result.data.invoice_lines = data.invoice_lines || [];
        result.data.box_lines = data.invoice_lines || [];
        result.data.invoice_date = data.invoice_date || '';
        result.data.invoice_date_de = zerosoEuroTime(result.data.invoice_date);
        result.data.report_create_time_de = zerosoEuroTime(currentTime);

        result.data.total_taxed_de = Number(result.data.total_taxed).toLocaleString("es-ES", {minimumFractionDigits: 2});
        result.data.total_de = Number(result.data.total).toLocaleString("es-ES", {minimumFractionDigits: 2});
        result.data.total_untaxed_de = Number(result.data.total_untaxed).toLocaleString("es-ES", {minimumFractionDigits: 2});
        result.data.currentCompany = store.state.currentCompany;
        result.data.currentUser = store.state.currentUser;

        result = self.formatPrintData(result);
        if (callback) callback(result);
    },

    // 递归遍历字符。字段不能为 undefined和null，默认设置为空字符串
    formatPrintData(data) {
        if (typeof data == 'string' || typeof data == 'number' || !data) {
            return data;
        }
        function f(obj) {
            for (let fKey in obj) {
                if (obj[fKey] && typeof obj[fKey] === "object") {
                    f(obj[fKey]);
                } else {
                    if (obj[fKey]===null || obj[fKey]===undefined) {
                        obj[fKey] = '';
                    }
                }
            }
        }

        f(data);
        return data;
    },

    getMyCompanyInfo() {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.partner_v2_self_company,
                success(data) {
                    resolve(data)
                }, error(data) {
                    reject(data)
                }
            })
        })
    },


    setPartnerAddress(addresses) {
        let result = null;
        addresses.forEach(function (address) {
            if (address.is_primary_shipment_address) {
                result = address
            }
        });
        if (!result) {
            addresses.forEach(function (address) {
                if (address.is_primary_company_address) {
                    result = address
                }
            });
        }
        return result || addresses[0] || {
            city: "",
            country: "",
            district: "",
            name: "",
            phone: "",
            province: "",
            street: "",
            zip: "",
        }
    },
    getPartnerAddresses(partnerId) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.partner_companies_detail + '/' + partnerId + '/partner_addresses',
                success(data) {
                    resolve(data)
                }, error(data) {
                    reject(data)
                }
            })
        })
    },
    getPartnerInfo(partnerId) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.partner_companies_detail + '/' + partnerId,
                success(data) {
                    resolve(data)
                }, error(data) {
                    reject(data)
                }
            })
        })
    },
    getPartnerUser(partnerId) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.partner_companies_detail + '/' + partnerId + '/partner_users',
                success(data) {
                    resolve(data)
                }, error(data) {
                    reject(data)
                }
            })
        })
    },
    getAccountingRemainingMoney(data) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.bank_statement_relation_order_remaining_money,
                data: data,
                success(data) {
                    resolve(data)
                }, error(data) {
                    reject(data)
                }
            })
        })
    },
    getFile(data) {
        return new Promise((resolve, reject) => {
            Vue.prototype.$http({
                url: Vue.prototype.$api.file_files_list,
                data: data,
                success(data) {
                    if(data.msg && data.msg.items){
                        resolve(data.msg.items)
                    }
                }, error(data) {
                    reject(data)
                }
            })
        })
    },


};

export default reportService