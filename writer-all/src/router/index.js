import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index'
import Classify from '../components/classify.vue'
import Content from '../components/content.vue'
import UpdateList from '../components/update-list.vue'
import UpdateDetail from '../components/update-detail.vue'

import WriteRobot from '../components/write-robot'
import StockComment from '../components/stock-comment'

import AiPager from '../components/aipager'

import Resource from '../components/resource'
import Write from '../components/write'
import Data from '../components/data'

import User from '../components/user'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/index"
    },
    {
      path: '/index',
      component: Index,
      redirect: "/index/write",
      children: [
        {
          path: '/index/resource',
          component: Resource
        },
        {
          path: '/index/write',
          component: Write
        },
        {
          path: '/index/data',
          component: Data
        }
      ]
    },
    {
      path: '/classify',
      component: Classify
    },
    {
      path: '/content',
      component: Content
    },
    {
      path: '/update-list',
      component: UpdateList
    },
    {
      path: '/update-detail',
      component: UpdateDetail
    },
    {
      path: '/write-robot',
      component: WriteRobot
    },{
      path: '/stock-comment',
      component: StockComment
    },
    {
      path: '/ai-pager',
      component: AiPager
    },
    {
      path: '/user',
      component: User
    },
  ]
})
