<template>
  <el-container>
    <el-header class="header-nav">
      <el-menu
        default-active="2"
        class="el-menu-demo"
        mode="horizontal"
        @select="selectFun">
        <el-menu-item v-for="(itemO, indexO) in urls" :index="itemO.path" :key="indexO">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{itemO.navName}}</span>
          </template> 
        </el-menu-item> 
      </el-menu>
    </el-header>
    <el-main class="main-box">
      <div class="main-container">
        <router-view></router-view>
      </div> 
    </el-main>
  </el-container>
</template>

<script>
  export default {
    data(){
      return {
        urls: [],
      }
    },
    created() {
      console.log('getRedirectParams')
      this.common.getRedirectParams('orgId');
    },
    mounted: function () {
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
      },
    }
  };
</script>

<style lang="less" scoped>
  .header-nav{
    width:100%;
    position: fixed;
    top: 0;
    z-index: 999;
    padding: 0;
  }
  .main-box{
    padding:0;
    padding-top: 60px;
    .main-container{
      overflow:hidden;
    }
  }
  
</style>
