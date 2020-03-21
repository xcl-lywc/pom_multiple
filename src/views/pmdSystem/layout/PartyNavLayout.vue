<template>
  <el-container>
    <el-header class="mar0 pad0" height="auto">
      <page-header class="pad15" projectName="组织管理项目"></page-header>
    </el-header>
    <el-container class="mart20 backgroundFFF">
      <el-aside width="200px" class="container-min-height">
        <el-menu
          default-active="/organizationstructure"
          class="el-menu-vertical-demo height-absolutely" 
          @select="selectFun">
          <el-menu-item v-for="(itemO, indexO) in urls" :index="itemO.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{itemO.navName}}</span>
            </template> 
          </el-menu-item> 
        </el-menu>
      </el-aside>
      <el-main class="container-min-height">
        <div class="main-container">
          <router-view v-if="isReload"></router-view>
        </div> 
      </el-main>
    </el-container>
  </el-container> 
</template>


<script>
  import pageHeader from '../../../components/ChildOrgHeader.vue'
  
  export default {
    components: {
      'page-header': pageHeader,
    },
    data(){
      return {
        isReload:   true,
        urls:       [],
      }
    },
    watch:{
      $route(){
        this.isReload = false;
        this.$nextTick( ()=> {
          this.isReload = true;
        })
      }
    },
    created() {   
      this.common.getRedirectParams('orgId');
    },
    mounted() {
       this.url();
    },
    methods: {
      url(){ 
        let menu = this.$router.options.routes;
        menu.forEach( (item) => {
          if(item.meta){
            if(item.meta.type == "nav-layout"){
              this.urls.push(item);
            }
          }
          
        })
      },
      selectFun(indexPath){   
        this.$router.push(indexPath)
      }
    }
  };
</script>
<style lang="less">
  .container-min-height{
    min-height: calc(100vh - 120px);
  }
  .height-absolutely{
    height: 100%;
  }
</style>