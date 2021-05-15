import Vue from 'vue'
import $ from 'jquery'

window.$ = $
Vue.prototype.$ = $;

function errorMessageTip(msg){
    let keyList = Vue.prototype.$utils.getObjKeys(msg);
    let error_message_list = []
    for(let i=0;i<keyList.length;i++){
        if(keyList[i].error_message){
            error_message_list.push(keyList[i].error_message)
        }
    }
    if(error_message_list.length>0){
        let str = '';
        error_message_list.forEach((item,index)=>{
            str += '<p style="line-height: 20px;"><pre>'+ (index+1) + '、' + item + '</pre></p>';
        });
        Vue.prototype.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: str,
            type: 'error'
        });
    }else {
        Vue.prototype.$message({
            showClose: true,
            message: '服务器错误，请联系管理员！',
            type: 'error'
        });
    }
}


Vue.prototype.$http = function (param) {
    let self = this;
    if (!param.data) param.data = {};
    if (!param.url) param.url = '';
    if(param.type==='GET' || !param.type) param.requestBody = false;
    param.url = Vue.prototype.$utils.setCurrentCompanyToSearchParam(param.url,param.data);
    return $.ajax({
        url: param.url,
        type: param.type || 'GET',
        traditional: param.traditional || false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: param.requestBody!==false ? {'Content-Type': 'application/json'} : {},
        data: param.requestBody!==false ? JSON.stringify(param.data) : param.data,
        success: function (data) {
            if(data.msg && ((data.error_code && data.error_code.length>0) || (data.err_code && data.err_code.length>0)) ){
                errorMessageTip(data.msg)
                if (self.loading) self.loading = false;
            }else {
                if (param.success) param.success(data);
            }
        },
        error: function (data) {
            if (param.error) param.error(data);
            if (self.loading) self.loading = false;
            if(param.onErrorMessage) return false;
            if (data.status === 401) {
                console.log('登录失效');
                //未登录时，自动跳转到钉钉扫码登录页面
                Vue.prototype.$utils.goToDingDingLoginPage();
            }else if (data.status === 0 && data.statusText==='abort') {
                console.log('主动撤销接口调用：'+param.url);
            }else if(data.responseJSON && data.responseJSON.msg){
                //error_message提示处理程序
                if(data.responseJSON.msg.need_confirm){
                    Vue.prototype.$confirm('<pre>'+data.responseJSON.msg.error_message+'</pre>', '错误提示', {
                        confirmButtonText: '确认',
                        type: 'error',
                        dangerouslyUseHTMLString:true,
                        showCancelButton:false,
                    })
                }else if(data.responseJSON.msg.callback_link && data.responseJSON.msg.need_choice ){
                    Vue.prototype.$confirm('<pre>'+data.responseJSON.msg.error_message+'</pre>', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString:true
                    }).then(() => {
                        Vue.prototype.$http({
                            url: data.responseJSON.msg.callback_link,
                            type:data.responseJSON.msg.callback_method,
                            success: function () {
                                Vue.prototype.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });
                            }
                        })
                    }).catch(() => {

                    });
                }else {
                    errorMessageTip(data.responseJSON.msg)
                }
            }else {
                Vue.prototype.$message({
                    showClose: true,
                    message: data.status + ' ' + data.statusText + ' 请联系管理员！',
                    type: 'error'
                });
            }
            console.log(data)
        }
    });
};
