/**************************************
*---------------------课程学习统计-----------*
***************************************/
<template>
  <div class="course-learn-total" v-loading="isLoading" v-if="!isNoViewing">
    <div class="no-data">
      暂无页面设计图
    </div>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
      }
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_course_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
    },
    destoryed() {
       
    },
    methods: {
      
      
    }
  }
</script>

<style lang="less" scoped>
  .course-learn-total{
    
  }
</style>