import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'

import Introduce_Inner from './page/taskInner/Introduce.vue'//介绍
import TaskList_Inner from './page/taskInner/TaskList.vue'//任务列表
import TaskReport_Inner from './page/taskInner/TaskReport.vue'//任务报道
import TaskDetail_Inner from './page/taskInner/TaskDetail.vue'//任务详情
import TaskCreate_Inner from './page/taskInner/TaskCreate.vue'//创建任务

import Introduce_Up from './page/taskUp/Introduce.vue'//介绍
import TaskList_Up from './page/taskUp/TaskList.vue'//任务列表
import TaskReport_Up from './page/taskUp/TaskReport.vue'//任务报道
import TaskDetail_Up from './page/taskUp/TaskDetail.vue'//任务详情
import TaskCreate_Up from './page/taskUp/TaskCreate.vue'//创建任务

import Introduce_Down from './page/taskDown/Introduce.vue'//介绍
import TaskList_Down from './page/taskDown/TaskList.vue'//任务列表
import TaskReport_Down from './page/taskDown/TaskReport.vue'//任务报道
import TaskDetail_Down from './page/taskDown/TaskDetail.vue'//任务详情
import TaskCreate_Down from './page/taskDown/TaskCreate.vue'//创建任务

import OA_System from './page/OASystem.vue'//OA系统

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
    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    //class分类：inner---内部任务；up---上级任务；down---下级任务
    //showMenu菜单：是否展示在菜单上
    //type布局类型：nav-layout和blank-layout  
    //inner Inner==============================================================
    {
      path:      '/introduce_inner',
      name:      'Introduce_Inner',
      component:  Introduce_Inner,
      navName:   '介绍',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'inner'}
    },
    {
      path:      '/tasklist_inner',
      name:      'TaskList_Inner',
      component:  TaskList_Inner,
      navName:   '任务列表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'inner'}
    },
    {
      path:      '/taskdetail_inner',
      name:      'TaskDetail_Inner',
      component:  TaskDetail_Inner,
      navName:   '任务详情',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'inner'}
    },
    {
      path:      '/taskcreate_inner',
      name:      'TaskCreate_Inner',
      component:  TaskCreate_Inner,
      navName:   '创建任务',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'inner'}
    },
    {
      path:      '/taskreport_inner',
      name:      'TaskReport_Inner',
      component:  TaskReport_Inner,
      navName:   '任务报表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'inner'}
    },

    //up Up==============================================================
    {
      path:      '/introduce_up',
      name:      'Introduce_Up',
      component:  Introduce_Up,
      navName:   '介绍',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'up'}
    },
    {
      path:      '/tasklist_up',
      name:      'TaskList_Up',
      component:  TaskList_Up,
      navName:   '任务列表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'up'}
    },
    {
      path:      '/taskdetail_up',
      name:      'TaskDetail_Up',
      component:  TaskDetail_Up,
      navName:   '任务详情',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'up'}
    },
    // {
    //   path:      '/taskcreate_up',
    //   name:      'TaskCreate_Up',
    //   component:  TaskCreate_Up,
    //   navName:   '创建任务',
    //   meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'up'}
    // },
    {
      path:      '/taskreport_up',
      name:      'TaskReport_Up',
      component:  TaskReport_Up,
      navName:   '任务报表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'up'}
    },

    //down Down==============================================================
    {
      path:      '/introduce_down',
      name:      'Introduce_Down',
      component:  Introduce_Down,
      navName:   '介绍',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'down'}
    },
    {
      path:      '/tasklist_down',
      name:      'TaskList_Down',
      component:  TaskList_Down,
      navName:   '任务列表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'down'}
    },
    {
      path:      '/taskdetail_down',
      name:      'TaskDetail_Down',
      component:  TaskDetail_Down,
      navName:   '任务详情',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'down'}
    },
    {
      path:      '/taskcreate_down',
      name:      'TaskCreate_Down',
      component:  TaskCreate_Down,
      navName:   '创建任务',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'down'}
    },
    {
      path:      '/taskreport_down',
      name:      'TaskReport_Down',
      component:  TaskReport_Down,
      navName:   '任务报表',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'down'}
    },

    //OA系统==============================================================
    {
      path:      '/oa_system',
      name:      'OA_System',
      component:  OA_System,
      navName:   'oa系统',
      meta: {type: 'nav-layout', showNav: true, showMenu: true, class: 'oa'}
    },
  ]
})
