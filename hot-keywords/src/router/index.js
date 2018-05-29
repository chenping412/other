import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import RouterView from '../components/router-view'
import HotKeywords from '../components/hot-keywords.vue'



export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/hot-keywords"
    },
    {
      path: '/hot-keywords',
      component: RouterView,
      children:[
        {
          path: '',
          component: HotKeywords
        }
      ]
    }
  ]
})
