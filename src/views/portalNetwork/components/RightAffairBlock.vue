/**************************************
*----------------待办事务列表-----------*
***************************************/
<template>
	<el-card shadow="never" class="box-card mart20">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12" class="text-left">代办事务</el-col>
        <el-col :span="12" class="text-right"><el-link type="primary" @click="$router.push({name: 'AffairList'})">更多</el-link></el-col>
      </el-row>
    </div>
    <div>
      <div v-for="(item, index) in affairList.rows" :key="index">
        <el-row>
          <el-col :span="16" class="text-left"><span class="text">{{item.taskName}}</span> </el-col>
          <el-col :span="8"  class="text-right"><span class="text">{{common._convertDate(item.createTime, 'yyyy.MM.dd')}}</span></el-col>
        </el-row>
      </div>
    </div>
  </el-card>
</template>
<script>   
  export default {  
    data() {
      return { 
        affairList:         {rows: [], total: 0}, //代办事务列表
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息,
      }
    },
    mounted() {  
      this.getQueryAffairList();
    }, 
    methods: {  
      /*
       * 查询代办事务列表
       */
      getQueryAffairList(){ 
        this.axios.post( `${this.common.basePath}/task/base_task/list`, {assignee: this.loginInUserInfo.id, curStatus: 1} ).then( (response) => {
          this.affairList = response.data;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      }  
    }
  }
</script>