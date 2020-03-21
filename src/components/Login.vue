<!--登录 -->
<template>
  <div v-loading="isLoad">
    <div class="login-fix-box">
      <div class="left-title">
        <p class="main-title">行政学习系统</p>
        <p class="sub-title">学习系统提供统一学科和知识体系的学习资源，考题资源功能系统。学习资源以课程为主体，图文、音频、视频、附件资料组成的课时为组成项构成一套完整而全面在线学习体系。每个课时通过知识体系关联相应的题库资源，实现立体的学习体系。考核体系通过试题难度，自动手动组卷等功能实现在线考核，自动判分，多人手动判分结合的考核体系。</p>
      </div>  
      <div class="login-box"> 
        <div class="box-form">
          <div class="marb20">登录</div>
          <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm">
            <el-form-item 
              label="账号" 
              prop="username" >
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item 
              label="密码" 
              prop="password" >
              <el-input type="password" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item  >
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="primary" @click="register">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div> 
  </div>
</template>

<script> 
  import qs from 'qs'
  export default {
    data() { 
      return { 
        isLoad:   false,
        ruleForm: {
          username: '',
          password: '',
        }
      };
    },
    components: {
      
    },
    created () {
       
    },
    mounted () {
      // --------- 键盘时间的监听
      window.addEventListener('keypress', this.pressEnter);  
    },
    methods: {
      pressEnter (event) { 
        if(this.$route.path && this.$route.path == "/login") { //仅在登录页调用此事件
          if(event.key == "Enter") {
            this.login()
          }
        }
      },
    	//登录
      login () { 
        this.isLoad = true;    
        this.axios.post( `${this.common.basePath}/login/password`, qs.stringify(this.ruleForm)
        ).then( (response) =>{  
          this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
          sessionStorage.setItem('token',  response.data.access_token);
          this.getQueryLoginInUserInfo(response);  
        }).catch( (error) => {  
          this.isLoad = false;
          this.$message.error(error); 
        });
      },
      register(){
        this.$router.push({path: '/register'})
      },
      /*
      * 查询当前登录用户信息 
      */
      getQueryLoginInUserInfo(LoginInfo){  
        this.axios.get( `${this.common.basePath}/user/user/loginUser`, {} ).then( (response) => {   
          sessionStorage.setItem('loginInUserInfo', JSON.stringify(response.data));  
          this.$emit('successSun',LoginInfo);
          this.isLoad = false;
        }).catch( (error) => {  
          this.isLoad = false;
          this.$message.error(error) 
        });  
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;  
  .login-fix-box{
    margin-top: calc(50vh - 158px); 
    margin-left: calc(50vw - 425px); 
    display: flex; 
  }
  .login-box { 
    width: 500px; 
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    opacity: 0.9;
    -webkit-box-sizing: border-box;
    background-color: #d4d4d496;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #171717b8;
    .box-title{
      color: @darkBlue;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid @darkBlue;
    }
    .box-form{
      padding: 0 15px;
      .head-img{
        margin-left: 35%;
        border-radius: 50%;
        width: 80px;
      }
    }
    .box-footer{
      cursor: pointer;
      color: royalblue;
      text-align: center;
      font-size: 14px;
    }
  }
  #particles-js{
    width: 100vw;
    height: 99.5vh;
    position: absolute;
    top: 0;
  }
  #canvas {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .login-box {
    .el-form-item__content {
      padding-left: 0;
    }
  }
  .left-title{ 
    width: 350px;
    padding-right: 50px;
    color:#333;
    .main-title{
      font-weight:900;
      font-size:36px; 
    }
    .sub-title{
      margin-top:6px; 
      font-size:14px;
      font-weight:900;
    }
  }
</style> 