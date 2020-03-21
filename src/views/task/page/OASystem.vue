/*!
 * oa系统
 * @date    2019-10-31T10:11:28+0800
 * @author  chaunlin.Xiao
 * @version v1.0.0 (2019/10/31)
 * @company chuangxiangyuan
 */
<template>
  <div class="oa-page" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/oa_system' }">OA系统</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="pad20 oa-container">
      <oa-component :oadata='oadata'></oa-component>
    </el-container>
  </div>
</template>

<script>
	import OaComponent from '../components/OA.vue'
  export default {
    data(){
    	return{
    		party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,

        oadata:{
        	party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        },
        
    	}
    },
    components: {
      OaComponent
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('task_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("task_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }

      // this.getList();
    },

  }
</script>

<style lang="less">
	.oa-page{

	}
</style>