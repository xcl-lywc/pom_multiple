import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	socket:             null,  //scoket
  	isLoginOut:         false, // true为退出到登录页面即可重连
  },
  mutations: {

  },
  actions: {

  }
})
