import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'
import OrgBriefIntroduction from './page/OrgBriefIntroduction.vue' 
import OrganizationStructure from './page/OrganizationStructure.vue' 
import GroupLeadership from './page/GroupLeadership.vue' 
import MembershipRoster from './page/MembershipRoster.vue' 

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
      path:      '/organizationstructure',
      name:      'OrganizationStructure',
      component:  OrganizationStructure,
      navName:   '组织结构',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path:      '/orgbriefintroduction/:id',
      name:      'OrgBriefIntroduction',
      component:  OrgBriefIntroduction,
      navName:   '组织简介',
      meta: {type: 'nav-layout', showNav: true}
    }, 
    {
      path:      '/groupleadership',
      name:      'GroupLeadership',
      component:  GroupLeadership,
      navName:   '班子管理',
      meta: {type: 'nav-layout', showNav: true}
    }, 
    {
      path:      '/membershiproster',
      name:      'MembershipRoster',
      component:  MembershipRoster,
      navName:   '成员名册',
      meta: {type: 'nav-layout', showNav: true}
    }, 
  ]
})
