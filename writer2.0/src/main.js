// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUi from "element-ui"
import './element-css/index.css'
import App from './App'
import router from './router'
import $ from "jquery";


Vue.config.productionTip = false;

Vue.use(ElementUi, { size: 'small' });

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
        //location.href=location.pathname;
      }
    }
  });
};

Vue.prototype.library={
  contactShow:false,
  seeMoreSHow:true,
};

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
