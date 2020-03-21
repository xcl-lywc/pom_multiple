/*********************组织工作台- 公用栏目***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.18
/************************************************/
<template>
  <el-container>  
    <el-header class="padt10 padb10" height="auto"  width="100%" style="color: #fff;" :style="{'background-color': homeData[0].backGroundConfig}">
      <div class="fl"><i @click="goBack" class="el-icon-back cursor-pointer">返回</i></div>
      <div class="fr marl15 header-img">  
        <el-avatar v-if="loginInUserInfo.picture" :src="loginInUserInfo.picture"></el-avatar> 
        <el-icon v-else class='el-icon-s-custom'></el-icon>
         {{loginInUserInfo.real_name}}
      </div>
    </el-header> 
    <el-container class="mart20">
      <el-aside width="200px" class="backgroundFFF"> 
        <el-menu
          @select="menuSelect"
          :default-active="activeMenu"
          class="el-menu-vertical-demo" 
          active-text-color="#ffd04b">
          <el-submenu v-for="(itemO, indexO) in urls" :index="indexO.toString()">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{itemO.navName}}</span>
            </template>
            <el-menu-item v-for="(itemT, indexT) in itemO.children" :index="`${itemO.path}/${itemT.path}`">{{itemT.navName}}</el-menu-item>
          </el-submenu> 
        </el-menu>
      </el-aside>
      <el-main class="padt0">
        <div class="main-container">
          <router-view></router-view>
        </div> 
      </el-main>
    </el-container> 
  </el-container> 
</template>

<script>
  export default {
    data(){
      return {
        loginInUserInfo: JSON.parse(sessionStorage.getItem('loginInUserInfo')),
        homeData:        JSON.parse(sessionStorage.getItem('homeData')),
        urls:            [],
        activeMenu:      null,
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
            if(item.meta.type == "orgnav-layout"){
              this.urls.push(item);
            }
          }
          
        })
      },
      menuSelect(index){
        this.$router.push({path: index});
        this.activeMenu = index
      },
      goBack() {
        this.$router.push({path: '/home'});
      }
    }
  };
</script>
