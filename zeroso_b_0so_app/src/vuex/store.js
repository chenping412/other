import Vue from 'vue'
import Vuex from 'vuex'

import dataConfig from './dataConfig'
import static_resource from "./static_resource";
import isoCurrency from './isoCurrency'
import country from './country'
import permissionWhiteList from './permissionWhiteList'
import systemConfig from './systemConfig'

Vue.use(Vuex);

// 创建 store 实例
export default new Vuex.Store({
    state: {
        isCollapse: false,
        layoutMode: 'horizontal',
        // layoutMode:'vertical',

        userInfo: {},
        permissions: [],
        permissionsMap: {},//权限数组转化为对象格式，方便用 permissionsMap['perm'] 语法做判断是否有perm权限
        currentUser: {},//当前用户

        currentCompany: {},//当前选择公司
        currentCompanyList: [],//当前登录用户所属公司
        settingsDefaults:{},//当前公司配置


        //组件初始化统一配置数据
        dateRangeOptions: {
            shortcuts: [{
                text: '全部',
                onClick(picker) {
                    picker.$emit('pick', ['', '']);
                }
            }, {
                text: '今日',
                onClick(picker) {
                    let start = new Date();
                    start.setTime(start.getTime());
                    picker.$emit('pick', [start, start]);
                }
            }, {
                text: '昨日',
                onClick(picker) {
                    let start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', [start, start]);
                }
            }, {
                text: '最近7天',
                onClick(picker) {
                    let end = new Date();
                    let start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近30天',
                onClick(picker) {
                    let end = new Date();
                    let start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近180天',
                onClick(picker) {
                    let end = new Date();
                    let start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 179);
                    picker.$emit('pick', [start, end]);
                }
            }]
        },
        paginationPageSize: 50,
        paginationPageSizes: [20, 50, 100, 200, 500],
        paginationLayOut: 'total, sizes,prev, pager, next,jumper',

        //业务数据配置------------------
        ...dataConfig,
        ...static_resource,
        ...isoCurrency,
        ...country,
        ...permissionWhiteList,
        ...systemConfig,
        //-----------------------------

        all_internal_users: [],//所有内部成员列表

        bank_codes: [],//所有银行列表

        //零搜集团下属公司列表
        zerosoCompany: {},

    },
    getters: {},
    mutations: {
        setUserInfo(state, data) {
            localStorage.userInfo = JSON.stringify(data);
            state.userInfo = data
        },
        setPermissionInfo(state, data) {
            state.permissionInfo = data
        },
        setCurrentCompany(state, data) {
            localStorage.currentCompany = JSON.stringify(data);
            state.currentCompany = data
        },
        setCurrentCompanyList(state, data) {
            let arrB = [];
            let arr0 = [];
            data.forEach((item) => {
                if (state.zerosoCompany[item.account_company_id]) {
                    arr0.push(item)
                } else {
                    arrB.push(item)
                }
            });

            //允许该用户下的所有公司登陆名单,此处是登录账号id白名单
            // 林露 310 ；郑少贤 441 ; 明灿 448 ；彭明霞 380; 陈弢Virgil 342 ;
            let canLoginLoginId = [310, 441, 448,380, 342, 132];

            if (state.system === 'B') {
                localStorage.currentCompanyList = JSON.stringify(arrB);
                state.currentCompanyList = arrB
            } else {
                if (canLoginLoginId.indexOf(state.userInfo.id) > -1) {
                    localStorage.currentCompanyList = JSON.stringify(data);
                    state.currentCompanyList = data
                } else {
                    localStorage.currentCompanyList = JSON.stringify(arr0);
                    state.currentCompanyList = arr0
                }
            }
            if (state.currentCompanyList.length > 0) {
                let isCurrentCompany = false;
                if (localStorage.currentCompany) {
                    state.currentCompany = JSON.parse(localStorage.currentCompany);
                    state.currentCompanyList.forEach((item) => {
                        if (item.user_id === state.currentCompany.user_id) {
                            isCurrentCompany = true;
                            localStorage.currentCompany = JSON.stringify(item);
                            state.currentCompany = item;
                        }
                    });
                }
                if (!isCurrentCompany) {
                    localStorage.currentCompany = JSON.stringify(state.currentCompanyList[0]);
                    state.currentCompany = state.currentCompanyList[0];
                }
            } else {
                state.currentCompany = {};
            }
        },
        setIsCollapse(state, data) {
            state.isCollapse = data
        },
        setLayoutMode(state, data) {
            state.layoutMode = data
        },
        set_all_internal_users(state, data) {
            state.all_internal_users = data
        },
        set_bank_codes(state, data) {
            state.bank_codes = data
        },
        set_zeroso_company(state, data) {
            state.zerosoCompany = data;
        },
        setDeliveryCompanies(state, data) {
            state.deliveryCompanies = data;
        },
        setSettingsDefaults(state, data) {
            state.settingsDefaults = data;
        },
        setProductQuotationComment(state, data) {
            let productQuotationCommentAll = {};
            let productQuotationComment = {};
            for (let i = 0; i < data.length; i++) {
                productQuotationCommentAll[data[i].value] = {
                    label: data[i].label,
                    children: []
                };
                if (!data[i].deleted) {
                    productQuotationComment[data[i].value] = {
                        label: data[i].label,
                        children: []
                    }
                }
                if (data[i].childrenMap && data[i].childrenMap.comment_no) {
                    for (let k = 0; k < data[i].childrenMap.comment_no.length; k++) {
                        if (!data[i].deleted) {
                            productQuotationCommentAll[data[i].value].children.push({
                                label: data[i].childrenMap.comment_no[k].label,
                                code: Number(data[i].childrenMap.comment_no[k].value),
                            });
                            if (!data[i].childrenMap.comment_no[k].deleted) {
                                productQuotationComment[data[i].value].children.push({
                                    label: data[i].childrenMap.comment_no[k].label,
                                    code: Number(data[i].childrenMap.comment_no[k].value),
                                });
                            }
                        }
                    }
                }
            }

            state.productQuotationCommentAll = productQuotationCommentAll;
            state.productQuotationComment = productQuotationComment;
        },
        setAccountLoginCurrentUser(state, data) {
            state.currentUser = data;
            if (data.static_resource) state.static_resource = data.static_resource;
            if (data.codes) state.mainCompanyAbbreviationCode = data.codes;
            if (data.permissions) {
                state.permissions = data.permissions;
                let permissionsMap = {};
                data.permissions.forEach((item) => {
                    permissionsMap[item.id] = item;
                });
                state.permissionsMap = permissionsMap;
                console.log(permissionsMap)
            }
        },
    },
    actions: {
        storeInit(context, account_login_data) {
            return new Promise((resolve, reject) => {
                context.dispatch('get_zeroso_company').then(() => {
                    if (account_login_data) {
                        context.commit('setUserInfo', account_login_data.msg.login_user);
                        context.commit('setCurrentCompanyList', account_login_data.msg.allow_users);
                    }
                    if (context.state.currentCompanyList.length > 0) {
                        context.dispatch('getAccountLoginCurrentUser').then(() => {
                            context.dispatch('get_partner_all_internal_users');
                            context.dispatch('get_bank_codes');
                            context.dispatch('getProductQuotationComment');
                            resolve();
                        });
                    } else {
                        reject();
                    }
                });
            })
        },
        //获取用户在不同公司中的相关信息
        getAccountLoginCurrentUser(context) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$http({
                    url: Vue.prototype.$api.partner_account_login_current_user + "/" + context.state.currentCompany.user_id,
                    success(data) {
                        if (data.err_code.length === 0 && data.msg) {
                            if (context.state.system === 'B') {
                                context.dispatch('getSelfDefaultsBMenu', data.msg).then(() => {
                                    resolve()
                                });
                            } else {
                                context.commit('setAccountLoginCurrentUser', data.msg);
                                resolve()
                            }
                        }
                    }, error() {
                        reject()
                    }
                })
            })
        },
        getSelfDefaultsBMenu(context, userResult) {
            return new Promise((resolve, reject) => {
                let settingsDefaults={};
                let bMenuPermissions = {
                    "inquiry": true,
                    "order": true,
                    "partner": false,
                    "products": false,
                    "accounting": false,
                    "mail": false
                };

                function setBMenuPermissions() {
                    for (let key in bMenuPermissions) {
                        if (bMenuPermissions[key]) {
                            userResult.permissions.push({
                                id: key,
                                name: key,
                            })
                        }
                    }
                    if (!bMenuPermissions.partner) {
                        userResult.permissions.push({
                            id: 'SelfCompanySetting',
                            name: '公司设置',
                        })
                    }
                    context.commit('setAccountLoginCurrentUser', userResult);
                    resolve();
                }

                Vue.prototype.$http({
                    url: Vue.prototype.$api.partner_v2_self_settings_defaults,
                    success(data) {
                        if (data.msg) {
                            settingsDefaults = data.msg;
                            if(data.msg.bmenu){
                                bMenuPermissions = data.msg.bmenu;
                            }
                        }
                        context.commit('setSettingsDefaults', settingsDefaults);
                        setBMenuPermissions()
                    }, error() {
                        context.commit('setSettingsDefaults', settingsDefaults);
                        setBMenuPermissions();
                        reject()
                    }
                });
            })
        },
        //获取公司所有用户列表
        get_partner_all_internal_users(context) {
            Vue.prototype.$http({
                url: Vue.prototype.$api.partner_all_internal_users,
                success: function (data) {
                    if (data.err_code.length === 0 && data.msg) {
                        context.commit('set_all_internal_users', data.msg);
                    }
                }
            })
        },
        //获取公司所有用户列表
        get_bank_codes(context) {
            Vue.prototype.$http({
                url: Vue.prototype.$api.bank_account_bank_codes,
                success: function (data) {
                    if (data.err_code.length === 0 && data.msg) {
                        context.commit('set_bank_codes', data.msg);
                    }
                }
            })
        },
        //获取产品报价备注配置
        getProductQuotationComment(context) {
            Vue.prototype.$http({
                url: Vue.prototype.$api.product_dict_comment_type,
                success: function (data) {
                    if (data.err_code.length === 0 && data.msg) {
                        context.commit('setProductQuotationComment', data.msg);
                    }
                }
            })
        },


        //获取零搜集团所有下属公司
        get_zeroso_company(context) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$http({
                    url: Vue.prototype.$api.partner_zeroso_company,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            let obj = {};
                            data.msg.items.forEach((item) => {
                                obj[item.account_company.account_company_id] = item.account_company
                            });
                            context.commit('set_zeroso_company', obj);
                        }
                        resolve(data)
                    }, error(data) {
                        reject(data)
                    }
                })
            })
        },
    },


})
