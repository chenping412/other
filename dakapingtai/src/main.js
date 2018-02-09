// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUi from 'element-ui'

Vue.use(ElementUi)

Vue.config.productionTip = false;

Vue.prototype.apiHost = "http://172.16.25.12:9091/quanc-daka"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
