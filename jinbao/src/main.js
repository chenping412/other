// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUi from 'element-ui'
import jquery from 'jquery'
import App from './App'
import router from './router'

Vue.config.productionTip = false;
Vue.use(ElementUi)


Vue.prototype.apiHost = "http://172.16.25.12:9091/quanc-oms"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
