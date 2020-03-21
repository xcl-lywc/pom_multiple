import Vue from 'vue'
import Router from 'vue-router'
import ArticleIndex from '../workbench/article/page/Index.vue'
import ArticleNewType from '../workbench/article/page/NewType.vue'
import Login from './Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL, 
  routes: [ 
    {
      path: '*',
      redirect: '/login', 
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      navName: '登录',
      meta: {type: 'blank-layout'}
    },
    {
      path: '/articleindex',
      name: 'ArticleIndex',
      component: ArticleIndex,
      navName: '文件文章',
      meta: {type: 'nav-layout', showNav: true},
      children: [
        {path: 'newtype', name: 'ArticleNewType', component: ArticleNewType, navName: "文章分类", meta: {type: 'nav-layout', showNav: true}}
      ] 
    }
  ]
})
