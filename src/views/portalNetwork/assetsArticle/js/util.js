import vue from 'vue';
import Vuex from 'vuex'
/* 加载vue路由 */
import Router from 'vue-router'
vue.use(Vuex)
vue.use(Router)
const Vue = new vue();
export default {
  webScoketSever:       `${window.location.host}/ws/socket/web`, 
  timeT:                null, //用于清空时间
  /*
   * 启动scoket 
   * @params {object} data send给后台的数据
   */
  connection(data) {  
    console.log("connection()");  
    let wsuri = '';
        window.location.protocol === 'http:' ? 
        wsuri = `ws://${Vue.util.webScoketSever}?access_token=Bearer ${sessionStorage.getItem('token')}`:
        wsuri = `wss://${Vue.util.webScoketSever}?access_token=Bearer ${sessionStorage.getItem('token')}`;

    if (!sessionStorage.getItem('loginInUserInfo')) return false; 
    if(typeof(WebSocket) == "undefined") {
      console.log("您的浏览器不支持WebSocket");
    }else{ 
      // console.log("您的浏览器支持WebSocket");
      // ---------- 一开始进来就判断一下当前scoket是否打开 ------------ 
      if(Vue.$store.state.socket ? Vue.$store.state.socket.readyState === 1 : false){
        Vue.$store.state.socket.send(JSON.stringify(data));
        console.log("send.....")
        return false;
      }
      Vue.$store.state.socket = new WebSocket(wsuri);
      Vue.$store.state.socket.onopen = Vue.util.onopen(data);
      Vue.$store.state.socket.onclose = Vue.util.onclose(data);
      Vue.$store.state.socket.onerror = Vue.util.onerror;
      Vue.$store.state.socket.onmessage = Vue.util.onmessage;
      
      // ------ 循环，直到获取到当前socket的状态为1，在关闭循环 ---------
      let set = setInterval( () => {
        if(Vue.$store.state.socket ? Vue.$store.state.socket.readyState === 1 : false){
          Vue.$store.state.socket.send(JSON.stringify(data));
          console.log("send.....")
          clearTimeout(set);
        }
      },10000) 
    }
  },
  sendMessage(data){

  },
  //重连
  reconnection(data) {
    // console.log('reconnection')
    //与服务器已经建立连接
    if (Vue.$store.state.socket && Vue.$store.state.socket.readyState == 1) {
        clearTimeout(Vue.util.timeT);
    } else { 
      // console.log(Vue.$store.state.socket.readyState,Vue.$store.state.isLoginOut)
      // 3与服务器关闭连接，并且当前并没有退出登录，将建立重连 
      if (Vue.$store.state.socket.readyState == 3 && !Vue.$store.state.isLoginOut) {
        Vue.util.connection(data);
      }else if(Vue.$store.state.isLoginOut){ //当前是登录页面时，就不用重连
        clearTimeout(Vue.util.timeT);
        return false;
      }
      //0正尝试与服务器建立连接,2正在关闭与服务器的连接
      Vue.util.timeT = setTimeout(()=> {
          Vue.util.reconnection(data);
      }, 10000); 
    }
  },
  onopen(data) { 
    console.log('open')
  },
  onclose(data) { 
    Vue.util.reconnection(data);
  },
  onmessage(e, data) { 
     
  }, 
  onerror() { 
    Vue.util.reconnection();
  },
}