<!--登录 -->
<template>
  <div class="backgroundFFF">
    <el-row class="display-flex">
      <el-col :span="6" class="display-flex">
        <img src="../assets/images/banner_big.png" class="marr5" style="width: 80px; height: 60px;">{{projectName}}
      </el-col>
      <el-col :span="12">
        <el-input style="" placeholder="请输入内容" v-model="inputValue"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
      </el-col>
      <el-col :span="4" class="marl5"> 
        <i class="el-icon-s-order"></i>{{orgInfo.name}}
      </el-col>
      <el-col v-if="loginInUserInfo" :span="2" class="text-right"><img style="width: 50px; height: 50px;" :src="loginInUserInfo.picture"/></el-col>
    </el-row>
  </div>
</template>

<script> 
  export default {
    props:{
      projectName: {  //项目名称
        Required: true,
      }, 
    },
    data() { 
      return { 
        loginInUserInfo: null, 
        orgId:           sessionStorage.getItem('orgId'),
        orgInfo:         {name: null},
        orgName:         null,
        inputValue:      null,
 
      };
    },
    components: {
    },
    created () {
    },
    mounted () {
      this.getQueryOrgInfo();
      this.getQueryLoginInUserInfo();
    },
    methods: {
      getQueryOrgInfo(){
        this.axios.get( `${this.common.basePath}/user/orgs/one`, {params: {id: this.orgId}} ).then( (response) => {   
          this.orgInfo = response.data; 
        }).catch( (error) => {  
          this.$message.error(error);
        }); 
      },
      /*
      * 查询当前登录用户信息 
      */
      getQueryLoginInUserInfo(LoginInfo){  
        this.axios.get( `${this.common.basePath}/user/user/loginUser`, {} ).then( (response) => {   
          sessionStorage.setItem('loginInUserInfo', JSON.stringify(response.data));  
          this.loginInUserInfo = response.data;
        }).catch( (error) => {  
          this.$message.error(error) 
        });  
      },
    },
  }
</script>

<style scoped lang="less">
  .display-flex{
    display: flex;
    align-items: center;
  }
</style> 