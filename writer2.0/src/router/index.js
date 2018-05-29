import Vue from 'vue'
import Router from 'vue-router'


//组件模块
import HotNews from './../components/hotnews/hot-news.vue'
import Stock from './../components/stock/stock.vue'
import Business from './../components/business/business.vue'
import Report from './../components/report/report.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/hot-news"
    },
    {
      path: '/hot-news',
      component: HotNews
    },{
      path: '/stock',
      component: Stock
    },{
      path: '/business',
      component: Business
    },{
      path: '/report',
      component: Report
    },
  ]
})
