import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login.vue'
import Index from './page/Index.vue'
import Home from './page/Home.vue' 
import MettingList from './page/MettingList.vue' 
import CreateMetting from './page/CreateMetting.vue'
import EditMetting from './page/EditMetting.vue' 
import MettingDetail from './page/MettingDetail.vue' 

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
      path:      '/metting',
      name:      'MettingIndex',
      component:  Index,
      navName:   '会议',
      meta: {type: 'nav-layout', showNav: true},
      children: [
        {path: '',name: 'Home', component: Home, navName: '会议', meta: {type: 'nav-layout', showNav: true},},
        {path: 'list',name: 'MettingList', component: MettingList, navName: '会议列表', meta: {type: 'nav-layout', showNav: true},},
        {path: 'create',name: 'CreateMetting', component: CreateMetting, navName: '创建会议', meta: {type: 'nav-layout', showNav: true},},
        {path: 'edit/:mettingid',name: 'EditMetting', component: EditMetting, navName: '编辑会议', meta: {type: 'nav-layout', showNav: false},},
        {path: 'detail/:mettingid',name: 'MettingDetail', component: MettingDetail, navName: '会议详情', meta: {type: 'nav-layout', showNav: false},}
      ],
    }, 
    {
      path: '/shenqing',
      name: 'Login',
      component: Login,
      navName:   '申请',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path: '/shenqing',
      name: 'Login',
      component: Login,
      navName:   '任务',
      meta: {type: 'nav-layout', showNav: true}
    },
    {
      path: '/shenqing',
      name: 'Login',
      component: Login,
      navName:   '大屏',
      meta: {type: 'nav-layout', showNav: true}
    },  
  ]
})
