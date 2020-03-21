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

/******************* 工作台 - start *******************************************************/
// 文章管理
import WArticleNewType from '../../workbench/article/page/NewType.vue'
import WArticleNewSpecial from '../../workbench/article/page/NewSpecial.vue'
import WArticleHome from '../../workbench/article/page/Home.vue'
import WArticleUploadArticle from '../../workbench/article/page/UploadArticle.vue'
import WArticleNewsError from '../../workbench/article/page/NewsError.vue'
import WArticleNewsComment from '../../workbench/article/page/NewsComment.vue'
// 组织架构 
import WOrganizationalStructureOrgBriefIntroduction from '../../workbench/organizationalStructure/page/OrgBriefIntroduction.vue' 
import WOrganizationalStructureOrganizationStructure from '../../workbench/organizationalStructure/page/OrganizationStructure.vue' 
import WOrganizationalStructureGroupLeadership from '../../workbench/organizationalStructure/page/GroupLeadership.vue' 
import WOrganizationalStructureMembershipRoster from '../../workbench/organizationalStructure/page/MembershipRoster.vue' 

/******************* 工作台 - end *********************************************************/

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
    /******************** 工作台路由 *********************/
    {
      path: '/warticleindex',
      name: 'WArticleIndex',
      component: Index,
      navName: '文件文章',
      meta: {type: 'orgnav-layout', showNav: true},
      children: [ 
        {path: '', name: 'WArticleHome', component: WArticleHome, navName: '首页设置',meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'newtype', name: 'WArticleNewType', component: WArticleNewType, navName: '文章分类', meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'newspecial', name: 'WArticleNewSpecial', component: WArticleNewSpecial, navName: '文章专题', meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'uploadarticle', name: 'WArticleUploadArticle', component: WArticleUploadArticle, navName: '文章上传', meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'newserror', name: 'WArticleNewsError', component: WArticleNewsError, navName: '文章报错', meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'newscomment', name: 'WArticleNewsComment', component: WArticleNewsComment,navName: '文章评论', meta: {type: 'orgnav-layout', showNav: true}},  
      ] 
    }, 
    {
      path: '/worganizationalstructureorgindex',
      name: 'WOrganizationalStructureOrgIndex',
      component: Index,
      navName: '组织架构',
      meta: {type: 'orgnav-layout', showNav: true},
      children: [ 
        {path: '', name: 'WOrganizationalStructureOrgBriefIntroduction', component: WOrganizationalStructureOrgBriefIntroduction, navName: '组织简介',meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'worganizationalstructureorganizationStructure', name: 'WOrganizationalStructureOrganizationStructure', component: WOrganizationalStructureOrganizationStructure, navName: '组织结构',meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'worganizationalstructuregroupLeadership', name: 'WOrganizationalStructureGroupLeadership', component: WOrganizationalStructureGroupLeadership, navName: '班子管理',meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'worganizationalstructuremembershipRoster', name: 'WOrganizationalStructureMembershipRoster', component: WOrganizationalStructureMembershipRoster, navName: '成员名册',meta: {type: 'orgnav-layout', showNav: true}}, 
      ] 
    },
  ]
})
