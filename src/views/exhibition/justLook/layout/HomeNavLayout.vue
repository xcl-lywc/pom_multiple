/*********************首页展示页面 - 公用栏目***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.18
/************************************************/
<template>
  <div v-if="homeDetail">
  	<div class="banner-wrap"><img src="../../../../assets/images/banner_big.png"></div>
  	<el-container class="home-container" v-if="loginInUserInfo"> 
  		<el-header height="46px">
  			<div class="fr marl15 header-img">  
          <el-avatar v-if="loginInUserInfo.picture" :src="loginInUserInfo.picture"></el-avatar> 
          <el-icon v-else class='el-icon-s-custom'></el-icon>
           {{loginInUserInfo.real_name}}
        </div> 
  		</el-header>
      <div class="header-divider">
        <el-divider ></el-divider>
      </div>
  		<el-main>
        <el-tabs type="border-card" @tab-click="tabClick" v-model="tabValue">
          <el-tab-pane v-for="(item, index) in urls" :name="item.path" :key="index" :label="item.navName">
            <router-view v-if="homeDetail && isRouterAlive"></router-view> 
          </el-tab-pane> 
        </el-tabs> 
  		</el-main>
  		<el-footer class="home-footer" height="auto" :style="`background: ${homeDetail.backGroundConfig}`">
  			<div>
          <p>党委名称： {{homeDetail.partyOrgName}}</p>
          <p>地址：{{homeDetail.address}}</p>
          <p>联系电话：{{homeDetail.phone}}</p>   
        </div>
  		</el-footer>
  	</el-container>
    <!-- 修改页面主题色 -->
    <ThemePicker v-if="homeDetail" :default="homeDetail.backGroundConfig"></ThemePicker>
  </div>
</template>
<script>
  import ThemePicker from '../../../../components/ThemePicker.vue' 
	export default{ 
    components: {
      ThemePicker
    },
		data(){
			return {
        isRouterAlive:  true,
				urls: 		      [],
				homeDetail:     null,
        loginInUserInfo:   null,
        userOrg:      {rows: [], total: 0},
        tabValue:     '',
			}
		},
    watch: {
      $route(){ 
        this.reload();
      }
    },
    created() {   
      this.common.getRedirectParams('orgId');
    },
		mounted(){
			this.url();
			this.getQueryBlockData();
      this.getQueryLoginInUserInfo(); 
		},
		methods: {
      /*
       * 刷新页面
       */
      reload () { 
          this.isRouterAlive = false
          this.$nextTick(() => (this.isRouterAlive = true))
       },
			url(){ 
        let menu = this.$router.options.routes;
        menu.forEach( (item) => {
          if(item.meta){
            if(item.meta.type == "homenav-layout"){
              this.urls.push(item);
            }
          }
        });
        if(this.urls.length){
          this.tabValue = this.urls[0].path;
        }
      },
      /*
       * 查询首页块块
       * @param {{ String }} typeId 查询ID
       */
      getQueryBlockData(){  
        this.axios.get( `${this.common.basePath}/home/user/home`, {} ).then( (response) => {   
          this.homeDetail = response.data ? response.data[0] : null; 
          // ------------- 不是从其他页面跳转过来的，需要获取orgId -------------
          if(!this.common.getParamsByName('orgId')){
            sessionStorage.setItem('orgId', response.data[0].orgId); 
          }
          sessionStorage.setItem('homeData', JSON.stringify(response.data))
        }).catch( (error) => {  
          this.$message.error(error) 
        });  
      },
      /*
      * 查询当前登录用户信息 
      */
      getQueryLoginInUserInfo(){  
        this.axios.get( `${this.common.basePath}/user/user/loginUser`, {} ).then( (response) => {   
          this.loginInUserInfo = response.data;
          sessionStorage.setItem('loginInUserInfo', JSON.stringify(response.data));  
        }).catch( (error) => {  
          this.$message.error(error) 
        });  
      }, 
      tabClick(ev){ 
        this.$router.push({path: ev.name})
      }
		},
	}
</script>
<style lang="less">
	.banner-wrap{
		margin: 0;
		padding: 0;
		img{
			width: 100%;
		}
	}
	.home-footer{
		padding: 10px 100px!important;
		color: 	 #fff;
		p{
			line-height: 30px;
		}
	}
  .header-divider{
    .el-divider--horizontal{
      margin-top: 0px;
      margin-bottom: 0
    }
  }
  .header-img{
    display: flex;
    align-items: center;
  }
  .xie-asdie-type{
    background: #fff;
    border: 1px solid #dadada;
  }
</style>