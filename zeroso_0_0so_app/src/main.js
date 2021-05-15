import Vue from 'vue'
import ElementUI from "element-ui"
import './assets/css/element.scss';
import App from './App.vue'
import router from './router/index'
import store from './vuex/store'
import './assets/css/style.scss'
import './config/jquery.js'
import './config/utils.js'
import './config/api.js'
import './config/moment.js'
import './filter/filter.js'
import './assets/icons/index.js'

Vue.use(ElementUI,{size:'small'});

import VueCropper from 'vue-cropper'
Vue.use(VueCropper);

import './components/components.js'


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
