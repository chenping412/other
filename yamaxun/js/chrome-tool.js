var isDev = false

function sendMessageToPopup(message, callback) {
    chrome.extension.sendRequest(message, function(response) {
        if(callback) callback(response);
    });
}
function setCookie(key,val){
    window.localStorage[key] = val
}
function getCookie(key){
    return window.localStorage[key];
}

function getFullTime(day) {
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
}
function getSearchParams () {
    var str = location.search.slice(1)
    var res = {}
    if (!str) return res
    str.split("&").forEach(function (v, k, arr) {
        var param = v.split('=')
        res[param[0]] = param[1]
    })
    return res
}

var MyTools = {
    name: '我的工具箱',
    listData: [],
    orderItems: [],
    timeInterval: 1000,
    hostApi: 'https://sellercentral.amazon.com',
    listStart:1,
    listEnd:100,

    http: function (params) {
        var xhr = new XMLHttpRequest();
        var sendData = undefined
        if (params.type && params.type.toLowerCase() === 'post') {
            sendData = JSON.stringify(params.data)
        } else {
            if (params.data) {
                var search = params.url.indexOf('?') > -1 ? '&' : '?'
                for (var key in params.data) {
                    search += key + '=' + params.data[key] + '&'
                }
                params.url += search.slice(0, search.length - 1)
            }
        }
        xhr.open(params.type || "GET", params.url, true);
        xhr.setRequestHeader('accept', 'application/json')
        xhr.setRequestHeader('content-type', 'application/json')
        xhr.send(sendData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    params.success && params.success(JSON.parse(xhr.responseText))
                } else {
                    params.error && params.error()
                }
            }
        }
    },
    setChromeOrderList: function(orderItem){
        var chromeOrderList = []
        try {
            chromeOrderList = JSON.parse(getCookie('chromeOrderList'))
        } catch (e) {}
        chromeOrderList.unshift(orderItem)
        setCookie('chromeOrderList',JSON.stringify(chromeOrderList))
    },
    setDownloadProgress: function(loading,index,length){
        setCookie('chromeDownloadProgress',JSON.stringify({
            loading: loading,
            index: index,
            length: length
        }))
    },
    getParams: function (){
        var search = getSearchParams()
        search['sort'] = localStorage['MYO-SORT-ORDER-PREFERENCE'] ? localStorage['MYO-SORT-ORDER-PREFERENCE'].replace(/"/g,'') : 'order_date_asc'
        search['date-range'] = localStorage['MYO-DATE-RANGE-PREFERENCE'] ? localStorage['MYO-DATE-RANGE-PREFERENCE'].replace(/"/g,'') : 'last-365'
        var pathname = location.pathname
        if(pathname.indexOf('/orders-v3/ref')>-1) {
            search.orderStatus = 'unshipped'
            search.fulfillmentType = 'mfn'
        } else if(pathname.indexOf('/orders-v3/mfn/')>-1) {
            search.orderStatus = pathname.replace('/orders-v3/mfn/','')
            search.fulfillmentType = 'mfn'
        }
        search.limit = MyTools.listEnd - (MyTools.listStart-1)
        search.offset = MyTools.listStart - 1
        search.forceOrdersTableRefreshTrigger = false
        console.log(search)
        return search
    },
    getList: function (data){
        MyTools.timeInterval = data.timeInterval
        MyTools.listStart = data.listStart
        MyTools.listEnd = data.listEnd
        MyTools.http({
            url: isDev ? 'http://192.168.50.180:9091/hlapi/user/list' : MyTools.hostApi + '/orders-api/search',
            type: isDev ? 'POST' : 'GET',
            data: MyTools.getParams(),
            success: function (res) {
                console.log('list',res)
                if(isDev){
                    if(res.data){
                        MyTools.listData = res.data.records
                        MyTools.loopDownload(0)
                    }
                }else {
                    if(res.orders){
                        MyTools.listData = res.orders
                        MyTools.loopDownload(0)
                    }
                }
            }
        })
    },
    loopDownload: function (n) {
        if(MyTools.listData[n]){
            if(isDev) {
                MyTools.listData[n].amazonOrderId = MyTools.listData[n].id
            }
            MyTools.getDetail(MyTools.listData[n].amazonOrderId,function (state) {
                setTimeout(function (){
                    MyTools.loopDownload(n+1)
                },MyTools.timeInterval)
                MyTools.setDownloadProgress(true,n+1,MyTools.listData.length)
                MyTools.setChromeOrderList({
                    orderId: MyTools.listData[n].amazonOrderId,
                    state: state,
                    createTime: getFullTime()
                })
                sendMessageToPopup({
                    type:'popupFunction',
                    action: 'domInit',
                    data: n+1
                })
            })
        } else {
            MyTools.setDownloadProgress(false,MyTools.listData.length,MyTools.listData.length)
            sendMessageToPopup({
                type:'popupFunction',
                action: 'domInit',
                data:'下载完成'
            })
        }
    },

    getDetail: function (amazonOrderId,callback){
        if(isDev){
            location.href = 'http://192.168.50.180:9091/dist.rar'
            callback('success')
            return
        }
        MyTools.http({
            url: MyTools.hostApi + '/orders-api/order/' + amazonOrderId,
            type: 'GET',
            success: function (res) {
                console.log('detail',res)
                if(res.order && res.order.orderItems && res.order.orderItems.length>0){
                    MyTools.orderItems = res.order.orderItems
                    MyTools.loopGetDingzhi(0, callback)
                } else {
                    callback && callback('error')
                }
            },
            error: function () {
                callback && callback('error')
            }
        })
    },
    loopGetDingzhi: function (n,callback) {
        if(MyTools.orderItems[n]){
            MyTools.getDingzhi(MyTools.orderItems[n],function () {
                setTimeout(function (){
                    MyTools.loopGetDingzhi(n+1,callback)
                },MyTools.timeInterval / 2)
            })
        } else {
            callback && callback('success')
        }
    },
    getDingzhi: function (orderItem,callback){
        if(orderItem && orderItem.ItemCustomizations && orderItem.ItemCustomizations.CustomPageUrl){
            var CustomPageUrl = orderItem.ItemCustomizations.CustomPageUrl
            var search = CustomPageUrl.slice(CustomPageUrl.indexOf('?'))
            MyTools.http({
                url: MyTools.hostApi + '/gestalt/ajax/fulfillment/init' + search,
                type: 'GET',
                success: function (res) {
                    console.log('dingzhi',res)
                    window.open(res.fulfillmentData.customizationUrl)
                    // 压缩包默认名字是单号-订单商品编号
                    callback && callback()
                },
                error: function () {
                    callback && callback()
                }
            })
        }else {
            callback && callback()
        }
    },
}
console.log(MyTools)

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if(request && request.type === 'href') {
        if(request.href) window.open(request.href)
    } else if(request && request.type === 'toolFunction') {
        MyTools[request.action](request.data || {})
    } else if(request && request.type === 'setCookie') {
        setCookie(request.name, request.value)
        sendResponse()
    } else if(request && request.type === 'getCookie') {
        var obj = {}
        if(request.names){
            request.names.forEach(function (name){
                obj[name] = getCookie(name)
            })
        }
        sendResponse(obj)
    }
});
