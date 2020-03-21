import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引用全局通用的css、js
import '../../assets/styles/common.less'
import commonJS from '../../plugins/common.js'
Vue.prototype.common = commonJS;
//引用该文件夹（模块）下的css、js
import './assets/style/common.less'//反馈系统模块通用css
import feedbackCommonJS from './plugins/common.js'
Vue.prototype.feedbackCommon = feedbackCommonJS;//反馈系统模块通用js

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import 'font-awesome/css/font-awesome.css'
import qs from 'qs'
//引入js-md5
import md5 from 'js-md5';
window.md5Js = md5
Vue.prototype.md5 = md5;
//引入markdown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

Vue.config.productionTip = false

// 全局引入axios 并配置
import axios from 'axios'
Vue.prototype.axios = axios;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

/******************axios拦截器****************/
//request 拦截

//response 拦截
Vue.prototype.axios.interceptors.response.use(function (response) {
  //请求成功的拦截  
  if (response.config.responseType != "blob") {  //非文件类型不进行处理
    if (response.data.meta.code == "401") {
      // 抛出未登录异常, 并定时跳转至登录页
      setTimeout(() => {
        window.location.href = window.location.origin + "/#/login"
      }, 1500)
      return Promise.reject("未登陆或登陆信息失效!")
    } else if (response.data.meta.code != 0) {
      // 抛出请求失败的异常
      return Promise.reject(response.data.meta.message)
    } else {
      // 无异常直接返回
      return response.data;
    }
  } else { //文件类型直接返回
    return response
  }
}, function (error) { 
  console.log(error.response)
  if(error.response.data.meta){
    return Promise.reject(error.response.data.meta.message);
  }else{
    return Promise.reject(error.response.statusText||error.response.data||error.response.data.error||error.response.data.message);
  }
});

new Vue({
  router,
  store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount('#app')
