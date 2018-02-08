// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from "element-ui"
import App from './App'
import router from './router'
Vue.use(ElementUI );

Vue.prototype.$apiHost = 'http://172.16.1.37:8081';

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
