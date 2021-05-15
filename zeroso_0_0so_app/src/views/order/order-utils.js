import Vue from "vue";
import Router from './../../router/index'

export default {
    goToOrderDetail(name,blank) {
        let self = Vue.prototype;
        self.$http({
            url: self.$api.order_order_util_get_order_id_by_order_name + '/' + name,
            success: function (data) {
                if (data.err_code.length === 0 && data.msg && data.msg.order_id) {
                    if(!blank){
                        Router.push({
                            path:'/order/order/all/detail',
                            query:{
                                id:data.msg.order_id
                            }
                        })
                    }else {
                        let routerData = Router.resolve({
                            path:'/order/order/all/detail',
                            query:{
                                id:data.msg.order_id
                            }
                        });
                        window.open(routerData.href)
                    }

                }
            }
        })
    },
}