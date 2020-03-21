<template>
  <el-container>
    <el-header height="65px" class="header-nav">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-image
            class="logo-img fl"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="cover"></el-image>
          <span class="name fl">任务系统</span>
        </el-col>
        <el-col :span="14">
          <el-input
            class="search-input"
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="searchVal">
          </el-input>
        </el-col> 
        <el-col :span="4">
          <i class="el-icon-s-grid org-icon"></i>
          <span class="org-name marl5">{{getOrg()}}</span>
        </el-col>
        <el-col :span="2">
          <i class="el-icon-platform-eleme fr else-icon"></i>
          <i class="el-icon-sort fr else-icon marr10" @click="typeMode=!typeMode"></i>
        </el-col> 
      </el-row>
    </el-header>
    <el-main class="main-box">
      <el-row>
        <el-col :span="typeMode?4:24">
          <el-menu
            :default-active="activeIndex"
            :mode="typeMode?'vertical':'horizontal'"
            :class="{'el-menu-demo':!typeMode,'el-menu-vertical-demo':typeMode,'h60':!typeMode,'horizontal-position':!typeMode,}"
            unique-opened
            @select="navClicked">
            <el-submenu v-if="menuNav.inner.length>0" key="inner" index="inner">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>内部任务</span>
              </template>
              <el-menu-item v-for="itemInner in menuNav.inner" :key="itemInner.path" :index="itemInner.path">
                {{ itemInner.navName }}
              </el-menu-item>
            </el-submenu>
            <el-submenu v-if="menuNav.up.length>0" key="up" index="up">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>上级任务</span>
              </template>
              <el-menu-item v-for="itemInner in menuNav.up" :key="itemInner.path" :index="itemInner.path">
                {{ itemInner.navName }}
              </el-menu-item>
            </el-submenu>
            <el-submenu v-if="menuNav.down.length>0" key="down" index="down">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>下级任务</span>
              </template>
              <el-menu-item v-for="itemInner in menuNav.down" :key="itemInner.path" :index="itemInner.path">
                {{ itemInner.navName }}
              </el-menu-item>
            </el-submenu>
            <el-submenu v-if="menuNav.down.length>0" key="oa" index="oa">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统设置</span>
              </template>
              <el-menu-item key="/oa_system" index="/oa_system">
                OA系统
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="typeMode?20:24" :class="{'mart60':!typeMode,}">
          <div class="main-container">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="footer-mark" height="85px">
      <ul class="text-center">
        <li>@by创享源信息技术有限公司</li>
        <li>电话：12312341234</li>
        <li>邮箱：12312341234@163.com</li>
        <li>地址：科华北路65号</li>
      </ul>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    data(){
      return {
        orgList:[],
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        searchVal:null,//全局搜索内容
        menuNav: {inner:[],up:[],down:[]},
        activeIndex:  '/introduce_inner',//激活的菜单
        typeMode:true,//为true时，是纵向菜单；为false时，时横向菜单
      }
    },
    mounted: function () {
      this.getOrgList();
      this.buildMenuNav();
    },
    created() {
      console.log('getRedirectParams')
      this.common.getRedirectParams('orgId');
    },
    watch:{
      "$route": {
        handler (to, from) {
          this.activeIndex = to.path;
        },
        deep: true
      },
    },
    methods: {

      
      getOrgList(){
        this.axios.post(`${this.common.basePath}/user/orgs/list`,{}).then((response) => {
          this.orgList = response.data.total>0?response.data.rows:[];
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getOrg(){
        let that = this;
        let result = '所属组织名称';
        this.orgList.forEach( function(element, index) {
          element.id === that.party_org_id ? result=element.name:''
        });
        return result;
      },

      /**
       * 菜单激活回调，跳转路由
       * @param  {String} path      导航路径
       * @param  {Array}  pathArray 导航层级路径path数组
       * @return none
       */
      navClicked (path, pathArray) {
        // console.log(path, pathArray)
        this.$router.push(path)
        this.activeIndex = path;
      },
      /**
       * 根据router构造菜单导航
       * @return none
       */
      buildMenuNav () { 
        let menu = this.$router.options.routes;
        menu.forEach( (item,index) => {
          if(item.meta){
            if(item.meta.type == "nav-layout"&&item.meta.showMenu){
              index===0?this.activeIndex = item.path:'';
              item.meta.class==='inner' ? this.menuNav.inner.push(item):'';
              item.meta.class==='up' ? this.menuNav.up.push(item):'';
              item.meta.class==='down' ? this.menuNav.down.push(item):'';
            }
          }
        })
      },
    }
  };
</script>

<style lang="less" scoped>
  .header-nav{
    background: #fff;
    border-bottom:1px solid #eee;
    border-box:box-sizing;
    .logo-img{
      width:60px;
      height:60px;
      margin-top: 2px;
    }
    .name{ 
      margin-left:10px;
      margin-top:20px;
    }
    .search-input{
      width: 500px;
      margin: 10px auto;
      display: block;
    }
    .org-icon,.org-name,.else-icon{
      margin-top:22px
    }

  }

  .main-box{
    padding:10px;
    min-height: calc(100vh - 150px);
    .horizontal-position{
      position:absolute;
      width:100%;
    }
    .main-container{
      background:#fff;
      padding:20px;
      box-sizing:border-box;
      overflow:hidden;
    }
  }

  .footer-mark{
    background: #4CAF50;
    box-sizing: border-box;
    font-size: 14px;
    padding: 5px;
  }
  
  
</style>
