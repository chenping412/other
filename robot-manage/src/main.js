// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUi from 'element-ui'
import App from './App'
import router from './router'
import $ from "jquery";

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入子模块
require('echarts/lib/chart/line');
require('echarts/lib/chart/pie');
require('echarts/lib/component/markLine');
require('echarts/lib/component/tooltip');

Vue.config.productionTip = false;
Vue.use(ElementUi)

Vue.prototype.$ = $;
Vue.prototype.$http = function(param){
  $.ajax({
    url: param.url || '',
    type: param.type || 'POST',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    data: param.data || {},
    success: function(data) {
      if(param.success) param.success(data);
    },
    error: function(data) {
      if(param.error) param.error(data);
      if (data.status == "9001") {
        location.href=location.pathname;
      }
    }
  });
};


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
