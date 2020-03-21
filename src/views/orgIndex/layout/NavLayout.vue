<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo" >
        <el-submenu v-for="(itemO, indexO) in urls" :index="indexO.toString()">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{itemO.navName}}</span>
          </template>
          <el-menu-item v-for="(itemT, indexT) in itemO.children" :index="`${indexO}-${indexT}`">{{itemT.navName}}</el-menu-item>
        </el-submenu> 
      </el-menu>
    </el-aside>
    <el-main>
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
      }
    }
  };
</script>
