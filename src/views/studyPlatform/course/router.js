import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'


import Index from './page/Index.vue'

import CourseLearnIndex from './page/courseLearn/Index.vue'
import CourseLearn from './page/courseLearn/CourseLearn.vue'
import CourseDetail from './page/courseLearn/CourseDetail.vue'
import LearnPartyClass from './page/courseLearn/LearnPartyClass.vue'

import CourseManage from './page/CourseManage.vue'
import CourseOrder from './page/CourseOrder.vue'
import CourseLearnTotal from './page/CourseLearnTotal.vue'

import BPMN from './components/BPMN.vue'
import BPMNModel from './components/BPMNModel.vue'
import BPMNViewer from './components/BPMNViewer.vue'

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
    {
      path: '/course_courselearn',
      // name: 'CourseLearnIndex',
      component: CourseLearnIndex,
      navName: '课程学习',
      meta: {type: 'nav-layout', showNav: true},
      children:[
        {path: '', name: 'CourseLearn', component: CourseLearn, navName: "课程学习", meta: {type: 'nav-layout', showNav: true}},
        {path: 'coursedetail/:id', name: 'CourseDetail', component: CourseDetail, navName: "课程详情", meta: {type: 'nav-layout', showNav: true}},
        {path: 'learnpartyclass/:detailId/:learnId', name: 'LearnPartyClass', component: LearnPartyClass, navName: "党课学习", meta: {type: 'nav-layout', showNav: true}},
      ],
    }, 
    {
      path:      '/course_courseorder',
      name:      'CourseOrder',
      component:  CourseOrder,
      navName:   '课程订单',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/course_coursemanage',
      name:      'CourseManage',
      component:  CourseManage,
      navName:   '课程管理',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/course_courselearntotal',
      name:      'CourseLearnTotal',
      component:  CourseLearnTotal,
      navName:   '课程学习统计',
      meta: {type: 'nav-layout', showNav: true}
    },

    {
      path:      '/bpmn',
      name:      'BPMN',
      component:  BPMN,
      navName:   'BPMN',
      meta: {type: 'blank-layout', showNav: true}
    },
    {
      path:      '/bpmnViewer',
      name:      'BPMNViewer',
      component:  BPMNViewer,
      navName:   'BPMNViewer',
      meta: {type: 'blank-layout', showNav: true}
    },
    {
      path:      '/bpmnModel',
      name:      'BPMNModel',
      component:  BPMNModel,
      navName:   'BPMNModel',
      meta: {type: 'blank-layout', showNav: true}
    },
  ]
})
