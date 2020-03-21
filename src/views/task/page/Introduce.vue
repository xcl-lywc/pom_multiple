/**************************************
*---------------------介绍-----------*
***************************************/
<template>
  <div class="introduce" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <div class="desc" v-if="CLASS==='inner'">
      内部任务：流转范围是部门或机构的班子成员，也就是任务创建成功后指派人的范围只能是部门和机构的内部班子成员。同时任务的信息包含：任务类型、标题、任务描述、任务附件、任务的开始和截止时间，任务的创建人和审批人、指派人，任务执行过程中的沟通记录、指派记录。沟通记录和指派记录中可以上传当前阶段自己执行情况，以及附件资料等。同时能够做到信息的同步接收。
    </div>
    <div class="desc" v-if="CLASS==='up'">
      上级任务也就是上级布置的任务，上级为了某个目的需要下级配合向一个或多个下级发布任务。机构的上级任务来源于上级机构和上级机构的职能部门。同时每个任务可以完成多次，每次的结果都需要审批后才可以报送成功，上级通过查看报送信息给这次报送打分。每次报送需要提供标题、描述和附件，需要展示报送时间和报送人。
    </div>
    <div class="desc" v-if="CLASS==='down'">
      下级任务就是布置任务给下级机构和下级机构的职能部门，由于公司内部的管理独立，都是由下级机构转发给自己相应的部门。布置的任务包含：任务关键词、任务描述、任务附件、开始时间、截止时间、接收组织列表等信息。同时记录在这个任务沟通过程中聊天记录、和附件记录；方便大家相互学习。每个任务布置都需要经过审批，和结果评审。
    </div>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        CLASS:this.$route.path.split('_')[1],//class分类：inner---内部任务；up---上级任务；down---下级任务
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
      }
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
    },
    destoryed() {
       
    },
    methods: {
      
      
    }
  }
</script>

<style lang="less" scoped>
  .introduce{
    .desc{
      color:#666;
      font-size:14px;
      line-height:20px;
    }
  }
</style>