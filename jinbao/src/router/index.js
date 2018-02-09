import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login'
import Index from '../views/index'
import UserMgr from '../views/user-mgr'
import PowerMgr from '../views/power-mgr'
import FuncMgr from '../views/func-mgr'

import DakaList from '../views/daka/daka-list'

import NewsChannel from '../views/news/news-channel'
import NewsHots from '../views/news/news-hots'
import NewsZiDongCaiBianKu from '../views/news/news-zidongcaibianku'
import NewsDaKaGaoJianKu from '../views/news/news-dakagaojianku'
import NewsNeiBuGaoJianKu from '../views/news/news-neibugaojianku'
import WriteArticle from '../views/news/write-article.vue'
import NewsZiXunKu from '../views/news/news-zixunku'
import NewsSubject from '../views/news/news-subject'
import NewsAddSubject from '../views/news/add-subject.vue'

import IntegralType from '../views/integral/integral-type'
import IntegralAccount from '../views/integral/integral-account'
import IntegralYewu from '../views/integral/integral-yewu'

import UserList from '../views/user/user-list'

import MasterShortVideo from '../views/video/master-short-video.vue'
import MediaLibrary from '../views/video/media-library.vue'
import InnerShortVideo from '../views/video/inner-short-video.vue'
import ShortVideoClassify from '../views/video/short-video-classify.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/index',
      component: Index,
      redirect: "/index/user-mgr",
      children: [
        {
          path: '/index/user-mgr',
          component: UserMgr
        },
        {
          path: '/index/power-mgr',
          component: PowerMgr
        },
        {
          path: '/index/func-mgr',
          component: FuncMgr
        },
        {
          path: '/index/daka-list',
          component: DakaList
        },
        {
          path: '/index/news-channel',
          component: NewsChannel
        },
        {
          path: '/index/news-hots',
          component: NewsHots
        },
        {
          path: '/index/news-zidongcaibianku',
          component: NewsZiDongCaiBianKu
        },
        {
          path: '/index/news-dakagaojianku',
          component: NewsDaKaGaoJianKu
        },
        {
          path: '/index/news-neibugaojianku',
          component: NewsNeiBuGaoJianKu
        },
        {
          path: '/index/write-article',
          component: WriteArticle
        },
        {
          path: '/index/add-subject',
          component: NewsAddSubject
        },
        {
          path: '/index/news-zixunku',
          component: NewsZiXunKu
        },
        {
          path: '/index/news-subject',
          component: NewsSubject
        },

        {
          path: '/index/integral-type',
          component: IntegralType
        },
        {
          path: '/index/integral-account',
          component: IntegralAccount
        },
        {
          path: '/index/integral-yewu',
          component: IntegralYewu
        },

        {
          path: '/index/user-list',
          component: UserList
        },
        {
          path: '/index/master-short-video',
          component: MasterShortVideo
        },
        {
          path: '/index/media-library',
          component: MediaLibrary
        },
        {
          path: '/index/inner-short-video',
          component: InnerShortVideo
        },
        {
          path: '/index/short-video-classify',
          component: ShortVideoClassify
        },
      ]
    },
  ]
})
