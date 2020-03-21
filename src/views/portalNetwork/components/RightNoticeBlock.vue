/**************************************
*----------------通知列表-----------*
***************************************/
<template>
	<el-card shadow="never" class="box-card mart20">
    <div slot="header" class="clearfix">
      <el-row>
        <el-col :span="12" class="text-left">通知列表</el-col>
        <el-col :span="12" class="text-right"><el-link type="primary" @click="$router.push({name: 'NoticeList'})">更多</el-link></el-col>
      </el-row>
    </div>
    <div>
      <div v-for="(item, index) in noticeHistoryList.rows" :key="index">
        <el-row>
          <el-col :span="16" class="text-left"><span class="text">{{item.title}}</span></el-col>
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
        noticeHistoryList:  {rows: [], total: 0}, //通知列表 
        searchForm:     { 
          userId:       JSON.parse(sessionStorage.getItem('loginInUserInfo')).id,
        }
      }
    },
    mounted() {  
      this.getQueryNoticeList();
    }, 
    methods: {  
      /*
       * 查询通知列表
       */
      getQueryNoticeList(){ 
        console.log(this.searchForm)
        this.axios.post( `${this.common.basePath}/user/transaction/noticeHistory`, this.searchForm ).then( (response) => {  
          this.noticeHistoryList = response.data;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      },  
    }
  }
</script>