<template>
  <div class="row">
    <!-- 面包屑 -->
    <el-breadcrumb class="padb20 border-home-er" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/' }">政策法规</el-breadcrumb-item> -->
      <el-breadcrumb-item v-if="allarticletypes[0]">{{allarticletypes[0].atName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <div v-if="allarticletypes" class="col-xs-12 mr-bot20 news-recursion-box">
      <news-recursion v-for="(item, index) in allarticletypes"  hierarchy="1" :typesModel="item"  v-if="item.atypes" :key="index"></news-recursion>
    </div>
  </div>
</template>

<script>
  import News_Recursion from '../components/NewsRecursion.vue'

  export default {
    components:{
      "news-recursion": News_Recursion, // 新闻递归
    },
    watch:{
      /*
      * 监听路由发生改变
      */
      $route(){
        this.paramId = this.$route.params.id
        this.getQueryAllarticletypesData();
      }

    },
    data() {
      return {
        orgId:         sessionStorage.getItem('orgId'),
        allarticletypes:{}, //栏目数据
        paramId: this.$route.params.id,
    	}
    },
    created(){
      
    },
    mounted(){
      this.getQueryAllarticletypesData();
    },
    methods: {
      /*
      * 根据一级栏目查询子栏目信息
      */
      getQueryAllarticletypesData(){
        this.axios.get( `${this.common.basePath}/home/a_types/atypestreelist`, {params: {partyOrgId: this.orgId, id: this.paramId}} ).then( (response) => {   
            this.allarticletypes = response.data;
        }).catch( (error) => {  
          this.$message.error(error) 
        });    
      },
    }
  };
</script>
