import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../../../assets/styles/common.less'
import commonJS from '../../../plugins/common.js'
Vue.prototype.common = commonJS;
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 全局引入axios 并配置
import axios from 'axios' 
Vue.prototype.axios = axios;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
/******************axios拦截器****************/
Vue.prototype.axios.interceptors.response.use(function (response) {
  //请求成功的拦截  
  if (response.config.responseType != "blob") {  //非文件类型不进行处理
    if (response.data.meta.code != 0) {
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
  if(error.response.status == '401' || error.response.status == '403'){ //没有token
    // 抛出未登录异常, 并定时跳转至登录页
    setTimeout(() => {
      window.location.href = window.location.origin + "/login"
    }, 1500)
    return Promise.reject("未登陆或登陆信息失效!") 
  } else { 
    return Promise.reject(error.response.data.message);
  }
});
new Vue({
  router,
  store,
  render: function(createElement) { 
    let routeMeta = this.$route.meta,
        props = {};
    if (routeMeta && routeMeta.type) { 
      if(routeMeta.type == 'nav-layout'){
        props.layout = 'nav-layout'
      }else{
        props.layout = 'blank-layout'
      }
    }
    return createElement(App, {props});
  }
}).$mount('#app')
