import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'
import NewType from './page/NewType.vue'
import NewSpecial from './page/NewSpecial.vue'
import Home from './page/Home.vue'
import UploadArticle from './page/UploadArticle.vue'
import NewsError from './page/NewsError.vue'
import NewsComment from './page/NewsComment.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: 'index.html#',
  routes: [
    {
      path: '*',
      redirect: '/login', 
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {type: 'blank-layout', showNav: true}
    },
    {
      path:      '/home',
      name:      'Home',
      component:  Home,
      navName:   '首页设置',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/newtype',
      name:      'NewType',
      component:  NewType,
      navName:   '文章分类',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/newspecial',
      name:      'NewSpecial',
      component:  NewSpecial,
      navName:   '文章专题',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/uploadarticle',
      name:      'UploadArticle',
      component:  UploadArticle,
      navName:   '文章上传',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/newserror',
      name:      'NewsError',
      component:  NewsError,
      navName:   '文章报错',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/newscomment',
      name:      'NewsComment',
      component:  NewsComment,
      navName:   '文章评论',
      meta: {type: 'nav-layout', showNav: true}
    },  
  ]
})
