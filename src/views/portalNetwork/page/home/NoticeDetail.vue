/**************************************
*-------------- 通知列表 --------------*
***************************************/
<template>
  <div v-loading="loading" class="row pad-l20 pad-r20 mr-t5" v-if="detail" >
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card"> 
          <el-breadcrumb class="marb20" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">{{loginInUserInfo.real_name}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/noticelist' }">通知列表</el-breadcrumb-item> 
            <el-breadcrumb-item>{{detail.title}}</el-breadcrumb-item> 
          </el-breadcrumb>
          <el-divider></el-divider>
          <div class="mart20">
            <h4 class="text-center">{{detail.title}}</h4>
            <p class="colorc2c2c2 mini-font text-right">{{common._convertDate(detail.createTime, 'yyyy.MM.dd')}}</p>
            <div>
              {{detail.context}}
            </div>
          </div> 
        </el-card>
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock></RightCanlendarBlock> 
        <!-- 代办事务列表 -->
        <RightAffairBlock></RightAffairBlock>
      </el-col>
    </el-row>
  </div>
</template>

<script>   
  import RightCanlendarBlock from '../../components/RightCanlendarBlock.vue' 
  import RightAffairBlock from '../../components/RightAffairBlock.vue'
  export default { 
    components: {
      RightCanlendarBlock, 
      RightAffairBlock
    },  
    data() {
      return {
        loading:            true,
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息,
        detail:             null,
      }
    },
    mounted() {  
      this.getQueryNoticeInfo();
    }, 
    methods: {  
      /*
       * 查询通知列表
       */
      getQueryNoticeInfo(){  
        this.axios.get( `${this.common.basePath}/user/transaction/noticeHistoryInfo?id=${this.$route.params.id}`, {} ).then( (response) => {  
          this.detail = response.data;
          this.loading = false;
        }).catch( (error) => { 
          this.loading = false;
          this.$message.error(error) 
        }); 
      },  
    }
  }
</script>
 