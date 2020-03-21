import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'
import ItemBank from './page/ItemBank.vue'
import TestPaper from './page/TestPaper.vue'
import Exam from './page/Exam.vue'
import AssessmentTotal from './page/AssessmentTotal.vue'

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
      path:      '/exam_itembank',
      name:      'ItemBank',
      component:  ItemBank,
      navName:   '题库',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/exam_testpaper',
      name:      'TestPaper',
      component:  TestPaper,
      navName:   '试卷库',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/exam_exam',
      name:      'Exam',
      component:  Exam,
      navName:   '考试',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/exam_assessmenttotal',
      name:      'AssessmentTotal',
      component:  AssessmentTotal,
      navName:   '考核统计',
      meta: {type: 'nav-layout', showNav: true}
    },
  ]
})
