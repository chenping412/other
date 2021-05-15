import Vue from "vue";
import $ from "jquery";
import Cookies from 'js-cookie'
import HostConfig from './host-config'
import store from "../vuex/store";

Vue.prototype.$utils = {
    setCookie: function (name, value) {
        return Cookies.set(name, value, {
            domain: HostConfig.domain
        })
    },
    getCookie: function (name) {
        return Cookies.get(name, {
            domain: HostConfig.domain
        })
    },
    removeCookie: function (name) {
        return Cookies.remove(name, {
            domain: HostConfig.domain
        })
    },
    objectArraySort(keyName,order) {
        return function (objectN, objectM) {
            let valueN = objectN[keyName]
            let valueM = objectM[keyName]
            if (valueN < valueM) {
                return order === 'descending' ? 1 : -1
            } else if (valueN > valueM) {
                return order === 'descending' ? -1 : 1
            } else {
                return 0
            }
        }
    },
    getFullTime(day) {
        let now = new Date();
        let yDay = now;
        if (day) yDay = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        let y = yDay.getFullYear();
        let M = yDay.getMonth() + 1;
        if (M < 10) M = "0" + M;
        let d = yDay.getDate();
        if (d < 10) d = "0" + d;
        let h = yDay.getHours();
        if (h < 10) h = "0" + h;
        let m = yDay.getMinutes();
        if (m < 10) m = "0" + m;
        let s = yDay.getSeconds();
        if (s < 10) s = "0" + s;
        return y + "-" + M + "-" + d + ' ' + h + ':' + m + ':' + s;
    },
    getDate(day) {
        let now = new Date();
        let yDay = now;
        if (day) yDay = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        let y = yDay.getFullYear();
        let M = yDay.getMonth() + 1;
        if (M < 10) M = "0" + M;
        let d = yDay.getDate();
        if (d < 10) d = "0" + d;
        return y + "-" + M + "-" + d;
    },
    //获取当月日期，第一天到最后一天
    getNowMonthDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var lastDate = new Date(year, month, 0).getDate();

        if (month < 10) month = "0" + month;
        if (lastDate < 10) lastDate = "0" + lastDate;

        var begin = year + "-" + month + "-01";
        var end = year + "-" + month + "-" + lastDate;
        return [begin, end];
    },

    //参数：金额，货币符号，保留几位小数，千位分隔符，小数分隔符
    formatMoney(money, symbol, places, thousand, decimal) {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "￥";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var number = money, negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },

    downloadFile(url, param) {
        let form = $("<form>");
        form.attr("id", "downloadform");
        form.attr("style", "display:none");
        form.attr("target", "_blank");
        form.attr("method", "post");
        form.attr("action", url);
        for (let key in param) {
            let input = $("<input>");
            input.attr("type", "hidden");
            input.attr("name", key);
            input.attr("value", param[key]);
            form.append(input);
        }
        $("body").append(form);
        form.submit();
        $("#downloadform").remove();
    },
    updateFile(params) {
        let formData = new FormData();
        formData.append("file", params.file);
        let request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open("POST", params.url);
        request.send(formData);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.response);
                if (request.status === 200) {
                    if (params.success) params.success(data);
                } else {
                    if (params.error) params.error(data);
                }
            }
        };
    },


    getObjKeys(obj) {
        var arr = [];

        function f(obj) {
            for (var fKey in obj) {
                if (typeof obj[fKey] === "object") {
                    f(obj[fKey]);
                } else {
                    arr.push({
                        key: fKey,
                        [fKey]: obj[fKey]
                    })
                }
            }
        }

        f(obj)
        return arr;
    },
    // 递归遍历字符。移除值为null的字段
    formatRemoveNullKey(data) {
        if (typeof data == 'string' || typeof data == 'number' || !data) {
            return data;
        }
        function f(obj) {
            for (let fKey in obj) {
                if (obj[fKey] && typeof obj[fKey] === "object") {
                    f(obj[fKey]);
                } else {
                    if (obj[fKey]===null) {
                        delete obj[fKey];
                    }
                }
            }
        }

        f(data);
        return data;
    },


    //整理查询条件格式filter
    formatSearchFilter(obj) {
        return !obj || obj.length===0 || JSON.stringify(obj) === "{}" ? undefined : obj;
    },
    //整理查询条件格式filter,新系统格式
    formatSearchFilterV6(list) {
        if (!list || list.length===0 || JSON.stringify(list) === "{}") return {};
        let filter = {};
        list.forEach((item)=>{
            if (Object.prototype.toString.call(item[2]) === '[object Object]') {
                filter[item[0]] = item[2].id || item[2].account_user_id || item[2].account_company_id;
            } else if (Object.prototype.toString.call(item[2]) === '[object Array]') {
                filter[item[0]] = JSON.stringify(item[2]);
            } else {
                filter[item[0]] = item[2];
            }
        });
        return filter;
    },
    //整理排序字段，新系统格式
    formatSearchSortV6(obj) {
        if (!obj) return {};
        return {
            'pageRequest.sortBy': obj.field_name,
            'pageRequest.sortOrder': obj.by ? obj.by.toUpperCase() : undefined,
        };
    },

    //将currentCompany 设置到所有请求接口的search参数上，统一封装函数
    setCurrentCompanyToSearchParam(url) {
        let currentCompany = {};
        if(store.state.currentCompany.account_company_id){
            currentCompany = store.state.currentCompany
        }else {
            if (localStorage.currentCompany) {
                try {
                    currentCompany = JSON.parse(localStorage.currentCompany);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        if(currentCompany.account_company_id){
            if (url.indexOf('?') > -1) {
                url = url + '&'
            } else {
                url = url + '?'
            }
            url = url + 'current_company_id=' + currentCompany.account_company_id
                    + '&current_user_id=' + currentCompany.user_id
        }
        return url;
    },

    //登录态无效时，跳转去钉钉扫码登录页方法
    goToDingDingLoginPage() {
        location.href = HostConfig.ssoHost + '/login?zeroso_url=' + encodeURIComponent(location.href)
    },


    //创建发票XML用于税控机对接
    createInvoiceXML (ids) {
        let url = Vue.prototype.$api.createInvoiceXML;
        url = `${url}?invoice_ids=${ids.toString()}&current_company_id=${store.state.currentCompany.account_company_id}&current_user_id=${store.state.currentCompany.user_id}`;
        window.open(url);
    }

}

//myRound函数，自定义 数学算法四舍五入，为何要自定义，原因如下
// 注意：toFixed方法使用的是银行家舍入规则，银行家舍入：所谓银行家舍入法，其实质是一种四舍六入五取偶（又称四舍六入五留双）法。
// 银行家舍入具体规则是：简单来说就是：四舍六入五考虑，五后非零就进一，五后为零看奇偶，五前为偶应舍去，五前为奇要进一。
Number.prototype.myRound = function (n) {
    if (!this || n===undefined) return this;
    return Math.round(this * (Math.pow(10, n))) / Math.pow(10, n);
};