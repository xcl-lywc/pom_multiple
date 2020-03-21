import vue from 'vue';
import Vuex from 'vuex'
/* 加载vue路由 */
import Router from 'vue-router'
import { Loading } from 'element-ui';
vue.use(Vuex)
vue.use(Router)
const Vue = new vue();
export default {
  //api
  basePath: `${window.location.origin}/api`, 
  //ws2
  httpSocketSever: `${window.location.host}/chat/websocket/web`,
  elementPagination:{     //elementUi中的分页所需数据
      pageSizes: [10, 20, 30],
      pageSizeDefault: 10,   //初始条数
      pageNumDefault:1,      //初始页码
  },
  /**
   * 遍历树(递归遍历), 删除空白的childrens
   * @param  {object}   node         根节点(单个对象, 多个树需要重复调用)
   * @param  {string}   childrenName 子节点的名称
   * @return none
   */
  traverseTree (node, childrenLabel) {
    let childrens = null

    if(childrenLabel) {
      childrens = childrenLabel
    } else {
      childrens = "childrens"
    }
    if (!node) {
      return;
    }

    if (node[childrens] && node[childrens].length > 0) {
      var i = 0;
      for (i = 0; i < node[childrens].length; i++) {
        if(childrenLabel) {
          this.traverseTree(node[childrens][i], childrenLabel);
        } else {
          this.traverseTree(node[childrens][i]);
        }
      }
    } else {
      delete node[childrens]
    }
  },
  /*
   * 将时间戳转换为某年某月某日 00：00：00
   * @params {string/number} timeSetback 时间戳
   * @params {string} format 时间格式
   */
  _convertDate(timeSetback, format){
      return timeSetback ? new Date(timeSetback).Format(format) : '无';
  },
  /*
   * 查询文件流并下载
   * @params {string/number} fileId 
   */
  downloadFile(fileId){ 
    // ------ 文件流下载必须要指定responseType的类型为blob才能正确显示
    Vue.$request.requestAxios('get', basePath + '/file/'+ fileId +'/download', {responseType: "blob"}, 
      (respose) => {// 请求成功回调函数...
        this._fileBold(respose)
      }, (error) => {// 请求失败回调函数...
        Vue.$message('/file/'+fileId+'/download - 失败', 20)
      } 
    );
  },
  /*
   * 根据参数名称获取值
   */
  getParamsByName(name){  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  },
  /*
   * 重定向页面
   */
  _redirect(params){  
    let loadingInstance = Loading.service({ fullscreen: true , lock: true}); 
    Vue.axios.get(`${Vue.common.basePath}/user/power_resource/redirect`, params).then( (response) => { 
      loadingInstance.close();
      window.open(response.data);
    }).catch( (error) => {  
      loadingInstance.close();
      Vue.$message.error(error); 
    });  
  },
  /*
   * 获取到重定向页面地址上面参数
   * params  可传入出token以外的参数名字（token名字是有后台开发人员指定字段）
   */
  getRedirectParams(){  
    // -------- 从其他系统跳转过来的，直接跳转页面到对应页面就行，不用的登录 -------
    let token = Vue.common.getParamsByName('token'); 
    if(token) { //必须要有token才能绑定下面的数据 
      sessionStorage.setItem('token',  token);
      Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
     
      // --------- 循环给每个参数绑定session值 -------------
      for (var i = 0; i < arguments.length; i++) {
        var needle = arguments[i];
        sessionStorage.setItem(needle, Vue.common.getParamsByName(needle));
      }  
    }
  }
}
/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}