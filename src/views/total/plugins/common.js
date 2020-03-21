import vue from 'vue';

import router from '.././router'
const Vue = new vue({router}); //注册router, 实例中调用

export default {
  basePath: `${window.location.origin}/api`, 
}