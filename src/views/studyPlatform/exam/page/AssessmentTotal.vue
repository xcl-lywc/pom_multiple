/**************************************
*---------------------考核统计-----------*
***************************************/
<template>
  <div class="assessment-total" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <div class="no-data">暂无页面设计图</div>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
      }
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_exam_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")))
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
  .assessment-total{
    
  }
</style>