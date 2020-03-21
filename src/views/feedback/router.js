import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from './components/HelloWorld'

import Login from './Login.vue'
import Home from './page/Home.vue'
import Feedback from './page/Feedback.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: 'ui.html#',
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    //登录
    {
      path: '/login',
      name: 'Login',
      navName: '登录',
      component: Login,
      meta: {
        showNav: false
      },
    },
    //首页
    {
      path: '/home',
      name: 'Home',
      navName: '首页',
      component: Home,
      meta: {
        showNav: true
      },
    },
    {
      path: '/feed_back/:id',
      name: 'Feedback',
      navName: '新建反馈',
      component: Feedback,
      meta: {
        showNav: true
      }
    },
  ]
})
