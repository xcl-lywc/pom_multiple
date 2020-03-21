import Vue from 'vue'
import Router from 'vue-router'


import Login from './Login.vue'
import Register from './Register.vue'

//公用的一个默认Index页面
import Index from './page/Index.vue'
import Home from './page/home/Home.vue'
import NoticeList from './page/home/NoticeList.vue'
import NoticeDetail from './page/home/NoticeDetail.vue'
import AffairList from './page/home/AffairList.vue'
import ChatDialogue from './page/home/ChatDialogue.vue'
//党建系统
import PartyBuildingSystem from './page/PartyBuildingSystem.vue'
//行政系统
import AdministrationSystem from './page/AdministrationSystem.vue'
//纪委系统
import DisciplineInspectionCommissionSystem from './page/DisciplineInspectionCommissionSystem.vue'
//工会系统
import LabourUnionSystem from './page/LabourUnionSystem.vue'
//团组系统
import GroupSystem from './page/GroupSystem.vue'
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
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {type: 'blank-layout', showNav: true}
    },
    {
      path: '/home',
      name: 'HomeIndex',
      component: Index,
      navName:   '首页',
      meta: {type: 'homenav-layout', showNav: true},
      children: [
        {
          path: '',
          name: 'Home',
          component: Home,
          navName:   '首页',
          meta: {type: 'homenav-layout', showNav: true}
        }, 
        {
          path: 'noticelist',
          name: 'NoticeList',
          component: NoticeList,
          navName:   '通知列表',
          meta: {type: 'homenav-layout', showNav: true}
        }, 
        {
          path: 'noticedetail/:id',
          name: 'NoticeDetail',
          component: NoticeDetail,
          navName:   '通知详情',
          meta: {type: 'homenav-layout', showNav: true}
        },
        {
          path: 'affairlist',
          name: 'AffairList',
          component: AffairList,
          navName:   '工作列表',
          meta: {type: 'homenav-layout', showNav: true}
        }, 
        {
          path: 'chatdialogue',
          name: 'ChatDialogue',
          component: ChatDialogue,
          navName:   '聊天对话',
          meta: {type: 'homenav-layout', showNav: true}
        }, 
      ]
    }, 
    {
      path: '/partybuildingsystem', 
      name: 'PartyBuildingSystem',
      component: PartyBuildingSystem,
      navName:   '党建系统',
      meta: {type: 'homenav-layout', showNav: true},
      children: []
    },
    {
      path: '/administrationsystem', 
      name: 'AdministrationSystem',
      component: AdministrationSystem,
      navName:   '行政系统',
      meta: {type: 'homenav-layout', showNav: true},
      children: []
    },
    {
      path: '/disciplineinspectioncommissionsystem', 
      name: 'DisciplineInspectionCommissionSystem',
      component: DisciplineInspectionCommissionSystem,
      navName:   '纪委系统',
      meta: {type: 'homenav-layout', showNav: true},
      children: []
    },
    {
      path: '/labourunionsystem', 
      name: 'LabourUnionSystem',
      component: LabourUnionSystem,
      navName:   '工会系统',
      meta: {type: 'homenav-layout', showNav: true},
      children: []
    },
    {
      path: '/groupsystem', 
      name: 'GroupSystem',
      component: GroupSystem,
      navName:   '团组系统',
      meta: {type: 'homenav-layout', showNav: true},
      children: []
    },
  ]
})
