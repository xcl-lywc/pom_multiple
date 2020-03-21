import vue from 'vue';

// import router from './vue'
// const Vue = new vue({router}); //注册router, 实例中调用

export default {
  // basePath: `${window.location.origin}/api/plecture`, 
  elementPagination:{     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码
    
   	pageSizes_s: [5, 10, 15],
    pageSizeDefault_s: 5,   //初始条数
    pageNumDefault_s:1,      //初始页码
  },
  //题库选择题的ABCD转化
  conversionABCD(index){
  	let arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  	return index>25?index:arr[index];
  },
}