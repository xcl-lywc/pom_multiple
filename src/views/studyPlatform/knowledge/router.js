import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'

import Index from './page/Index.vue'

import SubjectListIndex from './page/subjectList/Index.vue'
import SubjectList from './page/subjectList/SubjectList.vue'
import SubjectDetail from './page/subjectList/SubjectDetail.vue'

import SubjectKnowledgeTree from './page/SubjectKnowledgeTree.vue'
import CreateSubject from './page/CreateSubject.vue'
import SubjectTotal from './page/SubjectTotal.vue'

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
      path: '/knowledge_subjectlist',
      // name: 'SubjectListIndex',
      component: SubjectListIndex,
      navName: '学科管理',
      meta: {type: 'nav-layout', showNav: true},
      children:[
        {path: '', name: 'SubjectList', component: SubjectList, navName: "学科管理", meta: {type: 'nav-layout', showNav: true}},
        {path: 'subjectdetail/:id', name: 'SubjectDetail', component: SubjectDetail, navName: "学科详情", meta: {type: 'nav-layout', showNav: true}},
      ],
    }, 
    {
      path:      '/knowledge_subjectknowledgetree',
      name:      'SubjectKnowledgeTree',
      component:  SubjectKnowledgeTree,
      navName:   '学科知识树',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/knowledge_createsubject',
      name:      'CreateSubject',
      component:  CreateSubject,
      navName:   '创建学科',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/knowledge_subjecttotal',
      name:      'SubjectTotal',
      component:  SubjectTotal,
      navName:   '学科资源统计',
      meta: {type: 'nav-layout', showNav: true}
    },
  ]
})
