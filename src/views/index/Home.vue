<template>
  <div class="home">
   <ueditor :config="editorConfig" :type="'new'" ref="ueditor" id="ueditor"></ueditor>
  </div>
</template>

<script>
import ueditor from '../../components/Ueditor.vue'
export default {
  name: 'home',
  components: {
  	ueditor
  },
  data(){
  	return {
  		editorConfig: {
        /*可以在此处定义工具栏的内容*/
        elementPathEnabled: 		 false,
        autoHeightEnabled: 			 false,
        autoFloatEnabled: 			 false,　　//是否工具栏可浮动
        initialContent: ' ',   	 //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
        autoClearinitialContent: false, 
        //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
        initialFrameWidth: 			 null,
        initialFrameHeight: 		 450,
        BaseUrl: '',
        UEDITOR_HOME_URL: 		 	 '/ueditor/',
        toolleipi: 							 true,//是否在toolbars显示，表单设计器的图标
        textarea:                'design_content',//编辑器的表单名称   
      },
  	}
  }
}
</script>
