/**************************************
*---------------------登录-----------*
***************************************/
<template>
  <div>
    <!-- 登录背景 -->
    <div class="background-wrap">
      <div class="login-background"></div>
    </div>
    <div id="title-box">
      <p class="main-title">任务系统</p>
      <p class="sub-title">任务就是......</p>
    </div>
    <!-- 登录框 -->
    <div class="login-box">
      <div class="box-title">欢迎登录</div>
      <div class="box-form">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
          <el-form-item prop="username">
            <el-input type="text" v-model="ruleForm.username" auto-complete="off" palcehoder="请输入用户名" @change="checked = false">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" show-password auto-complete="off" palcehoder="请输入密码" @change="checked = false">
              <i slot="prefix" class="el-input__icon el-icon-goods"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="height:20px;">
            <el-checkbox v-model="checked" class="fl" @change="rememberClick()" :disabled='ruleForm.username==""||ruleForm.password==""'><span class="text-dark-blue">记住密码</span></el-checkbox>
            <el-button type="text" class="text-dark-blue fr" @click="">帮助中心</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="danger">
            {{buttonLoading ? '登录中' : '登录'}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  export default {
    data() {
      var validatepass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validateaccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      return {
        checked: false,
        buttonLoading: false,
        ruleForm: {
          password: '',
          username: '',
        },
        rules: {
          password: [
            { validator: validatepass, trigger: 'blur' }
          ],
          username: [
            { validator: validateaccount, trigger: 'blur' }
          ],
        },
      };
    },
    created () {
      var self = this;
      self._remember();
    },
    watch:{
      
    },
    mounted () {
      // --------- 键盘时间的监听
      window.addEventListener('keypress', this.pressEnter);  
    },
    methods: {
      pressEnter (event) { 
        if(this.$route.path && this.$route.path == "/login") { //仅在登录页调用此事件
          if(event.key == "Enter") {
            this.submitForm('ruleForm');
          }
        }
      },
      //登录
      login () {     
        this.axios.post( `${this.common.basePath}/login/password`, qs.stringify(this.ruleForm)
        ).then( (response) =>{  
          this.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
          sessionStorage.setItem('token',  response.data.access_token)
          this.$emit('successSun',response)
        }).catch( (error) => { 
          this.$message.error(error); 
        });
      },
      //登录按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            return false;
          }
        });
      },
      //重置按钮
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //记住按钮
      rememberClick() {
        this.checked ? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
        this.checked ? localStorage.setItem("username", this.ruleForm.username) : localStorage.removeItem('username');
        this.checked ? localStorage.setItem("password", this.ruleForm.password) : localStorage.removeItem('password');
      },
      //记住账号密码
      _remember: function() {
        if(JSON.parse(localStorage.getItem("remember"))) { 
          this.checked = true;
          if(localStorage.getItem("username") && localStorage.getItem("password")) {
            this.ruleForm.username = localStorage.getItem("username");
            this.ruleForm.password = localStorage.getItem("password");
          }
        }else{
          this.checked = false;
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .fill-width{
    width:100%;
  }
  @darkBlue: #114275;
  @deepRed: #920404;
  @keyframes scaleBackground {
    /*0% {transform:scale(1, 1);background-image: url("");}
    50% {transform:scale(1.04, 1.02);background-image: url("");}
    100% {transform:scale(1, 1);background-image: url("");}*/
  }
  .background-wrap {
    overflow: hidden;
    .login-background {
      width: 100vw;
      height: 100vh;
      background-color:#fff;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  #title-img {
    position: absolute;
    width: 28vw;
    left: 10vw;
    top: 50%;
    margin-top: -158px;
  }
  #title-box {
    position: absolute;
    width: 28vw;
    left: calc(10vw + 0px);
    top: calc(50% + 0px);
    margin-top: -158px;
    color:#333;
    .main-title{
      font-weight:900;
      font-size:36px;
      float:left;
    }
    .sub-title{
      margin-top:6px;
      margin-left:5px;
      float:left;
      width:320px;
      font-size:14px;
      font-weight:900;
    }
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .login-box {
    position: absolute;
    top: 50%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
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
      color: @deepRed;
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
</style>
<style lang="less">
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
</style>