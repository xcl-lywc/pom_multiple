import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'

//公用的一个默认Index页面
import Index from '../../workbench/article/page/Index.vue'

/****************** 展示台 - start **************************************************/
//文章管理
import ArticleIndex from './page/article/Index.vue' 
import Home from './page/article/Home.vue' 
import NewsList from './page/article/NewsList.vue' 
import NewsDetail from './page/article/NewsDetail.vue' 
import MultiStoreyNewsList from './page/article/MultiStoreyNewsList.vue' 
//组织架构
import Organizational from './page/organizational/Organizational.vue'

/****************** 展示台 - end ****************************************************/
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
    /******************** 前台展示路由 *********************/
    {
      path: '/home',
      name: 'ArticleIndex',
      component: ArticleIndex,
      navName: '文件文章',
      meta: {type: 'homenav-layout', showNav: true},
      children:[
        {path: '', name: 'Home', component: Home, navName: "文件文章", meta: {type: 'homenav-layout', showNav: true}},
        {path: 'newslist/:object', name: 'NewsList', component: NewsList, navName: "文章列表", meta: {type: 'homenav-layout', showNav: true}},
        {path: 'newsdetail/:id', name: 'NewsDetail', component: NewsDetail, navName: "文章详情", meta: {type: 'homenav-layout', showNav: true}},
        {path: 'multistoreynewslist/:id/:name', name: 'MultiStoreyNewsList', component: MultiStoreyNewsList, navName: "多级文章列表", meta: {type: 'homenav-layout', showNav: true}}          
      ],
    },
    {
      path: '/organizational',
      name: 'OrganizationalIndex',
      component: Index,
      navName: '组织架构',
      meta: {type: 'homenav-layout', showNav: true},
      children: [
        {path: '', name: 'Organizational', component: Organizational, navName: "组织架构", meta: {type: 'homenav-layout', showNav: true}},
      ] 
    },  
  ]
})
