import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/login.vue'
import Index from '../views/index.vue'

import Article from '../views/article.vue'
import WriteArticle from '../views/write-article.vue'

import Video from '../views/video.vue'
import UploadVideo from '../views/upload-video.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/index',
      component: Index,
      redirect: '/index/article',
      children: [
        {
          path: '/index/article',
          component: Article
        },
        {
          path: '/index/video',
          component: Video
        }
      ]
    },
    {
      path: '/write-article',
      component: WriteArticle
    },
    {
      path: '/upload-video',
      component: UploadVideo
    },
  ]
})
