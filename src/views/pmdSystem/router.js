import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue' 
import Index from './page/Index.vue' 
/*************** 组织 ****************/
import Apply from './page/org/Apply.vue'  
import Investigate from './page/org/Investigate.vue'

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
      meta: {type: 'blank-layout', showNav: true}
    }, 
    {
      path:      '/org',
      name:      'OrgIndex',
      component:  Index,
      navName:   '入党积极分子',
      meta: {type: 'orgnav-layout', showNav: true},
      children: [
        {path: 'apply', name: 'Apply', component: Apply, navName: "入党申请", meta: {type: 'orgnav-layout', showNav: true}},
        {path: 'investigate', name: 'Investigate', component: Investigate, navName: "党员考察", meta: {type: 'orgnav-layout', showNav: true}},
      ],
    },  
  ]
})
