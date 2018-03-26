import Vue from 'vue'
import Router from 'vue-router'

import ApiDosage from '../components/api-dosage'
import ApiOrder from '../components/api-order'
import ApiKey from '../components/api-key'
import ApiList from '../components/api-list'
import ApiIntroduce from '../components/api-introduce'
import UserInfo from '../components/user-info'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: ApiDosage
    },
    // {
    //   path: '/api-order',
    //   component: ApiOrder
    // },
    {
      path: '/api-key',
      component: ApiKey
    },
    {
      path: '/api-list',
      component: ApiList
    },
    {
      path: '/api-introduce',
      component: ApiIntroduce
    },
    {
      path: '/user-info',
      component: UserInfo
    }
  ]
})
