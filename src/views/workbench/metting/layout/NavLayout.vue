<template>
  <el-container>
    <el-header class="mar0 pad0" height="auto">
      <page-header class="pad15" projectName="组织管理项目"></page-header>
    </el-header>
    <el-container class="mart20 backgroundFFF">
      <el-aside width="200px" class="container-min-height">
        <el-menu
          default-active="/metting"
          class="el-menu-vertical-demo height-absolutely" 
          @select="selectFun">
          <div v-for="(item1, index1) in urls" :key="index1">
            <!-- 无子栏目 -->
            <el-menu-item   
              v-if="item1.meta.showNav && !item1.children"
              :index="`${item1.path}`">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.navName}}</span>
              </template>
            </el-menu-item>
            <!-- 有子栏目 -->
            <el-submenu 
              v-if="item1.meta.showNav && item1.children"
              :index="item1.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item1.navName}}</span>
              </template>
              <el-menu-item-group> 
                <el-menu-item 
                  v-for="(item2, index2) in item1.children" 
                  :index="`${item1.path}${item2.path ? '/' + item2.path : ''}`" v-if="item2.meta.showNav">
                    {{item2.navName}}
                </el-menu-item> 
              </el-menu-item-group> 
            </el-submenu> 
            
          </div> 
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
  import pageHeader from '../../../../components/ChildOrgHeader.vue'
  export default {
    components: {
      'page-header': pageHeader,
    },
    data(){
      return {
        urls:     [],
        isReload: true,
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