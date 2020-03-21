import vue from 'vue';

import router from '.././router'
const Vue = new vue({router}); //注册router, 实例中调用

export default {
  basePath: `${window.location.origin}/api/task2`,
  elementPagination:{     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码
    
   	pageSizes_s: [5, 10, 15],
    pageSizeDefault_s: 5,   //初始条数
    pageNumDefault_s:1,      //初始页码
  },

  returnTaskData(type){
  	switch (type) {
  	  	case 'inner':
  	  		return {name:'内部'}
  	  		break;
  	  	case 'up':
  	  		return {name:'上级'}
  	  		break;
  	  	case 'down':
  	  		return {name:'下级'}
  	  		break;
  	  	default:
  	  		// statements_def
  	  		break;
  	  }  
  },
}