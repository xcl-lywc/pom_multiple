/*********************首页展示页面ss - 公用栏目***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.12
/************************************************/
<template>
  <div v-if="homeDetail" class="backgroundFFF">
  	<div class="header-logo backgroundFFF overflow-hidden">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="logo fl"><img src="../../../assets/images/banner_big.png"></div> 
        </el-col>
        <el-col :span="18" class="mart20">
          <el-tabs type="card" @tab-click="tabClick" v-model="tabValue">
            <el-tab-pane v-for="(item, index) in urls" :key="index" :name="index.toString()" :label="item.navName"></el-tab-pane>  
          </el-tabs> 
        </el-col>
      </el-row> 
    </div>
  	<el-container class="home-container" v-if="loginInUserInfo">   
  		<el-main class="container-width backgroundFFF">
        <router-view v-if="homeDetail && isRouterAlive"></router-view> 
  		</el-main>
  		<el-footer class="home-footer text-center" height="auto" :style="`background: ${homeDetail.backGroundConfig}`">
  			<div>
          <p>@创想园信息科技公司</p> 
        </div>
  		</el-footer>
  	</el-container> 
    <!-- 修改页面主题色 -->
    <ThemePicker v-if="homeDetail" :default="homeDetail.backGroundConfig"></ThemePicker>
  </div>
</template>
<script> 
  import ThemePicker from '../../../components/ThemePicker.vue' 
	export default{ 
    components: {
      ThemePicker
    },
		data(){
			return {
        isRouterAlive:  true,
				urls: 		      [],
				homeDetail:     null,
        loginInUserInfo:null, 
        tabValue:       '0',
			}
		},
    watch: {
      $route(){ 
        this.reload();
      }
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
      },
      /*
      * 查询首页块块
      * @param {{ String }} typeId 查询ID
      */
      getQueryBlockData(){  
        this.axios.get( `${this.common.basePath}/home/user/home`, {} ).then( (response) => {   
          this.homeDetail = response.data ? response.data[0] : null;
          sessionStorage.setItem('orgId', response.data[0].orgId); 
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
      dropdownHandleCommand(ev){
        sessionStorage.setItem("orgId", ev)
        this.$router.push({path: '/warticleindex'}); 
      },
      tabClick(ev){  
        this.$router.push({path: this.urls[ev.name].path});
      }
		},
	}
</script>
<style lang="less">
  body, html{
    background-color: #fff;
  }
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
  .header-logo{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .logo{
      img{
        width: 100%; 
        height: 80px;
      }
    }
  }
  .container-width{
    margin-top: 60px;
    width: 1100px;
    margin: auto;
    min-height: calc(100vh - 134px)
  }
  .overflow-hidden{
    overflow: hidden;
  }
  .home-container{
    margin-top: 80px;
  }
</style>