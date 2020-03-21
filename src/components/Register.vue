<!--登录 -->
<template>
  <div>
    <div class="left-title">
      <p class="main-title">行政学习系统</p>
      <p class="sub-title">学习系统提供统一学科和知识体系的学习资源，考题资源功能系统。学习资源以课程为主体，图文、音频、视频、附件资料组成的课时为组成项构成一套完整而全面在线学习体系。每个课时通过知识体系关联相应的题库资源，实现立体的学习体系。考核体系通过试题难度，自动手动组卷等功能实现在线考核，自动判分，多人手动判分结合的考核体系。</p>
    </div> 
    <div class="register-box"> 
      <div class="box-form">
        <div class="marb20 text-center">注册账号</div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item 
            label="账号：" 
            prop="account" 
            :rules="[
              { required: true, message: '请输入账号', trigger: 'blur' }, 
            ]">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item 
            label="组织：" 
            prop="applyOrg" 
            :rules="[
              { required: true, message: '请输入组织', trigger: 'blur' }, 
            ]">
            <el-input v-model="ruleForm.applyOrg"></el-input>
          </el-form-item>
          <el-form-item 
            label="姓名：" 
            prop="realName" 
            :rules="[
              { required: true, message: '请输入姓名', trigger: 'blur' }, 
            ]">
            <el-input v-model="ruleForm.realName"></el-input>
          </el-form-item>
          <el-form-item 
            label="密码：" 
            prop="password" 
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }, 
            ]">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item 
            label="确认密码：" 
            prop="rePassword" 
            :rules="[
              { required: true, message: '请确认密码', trigger: 'blur' },
              { validator: validatePass2, trigger: 'blur' } 
            ]">
            <el-input type="password" v-model="ruleForm.rePassword"></el-input>
          </el-form-item>
          <el-form-item 
            label="邮箱：" 
            prop="email" 
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item  
            label="验证码："   
            :rules="[
              { required: true, message: '请输入验证码', trigger: 'blur' }, 
            ]">
            <el-input style="width: calc(100% - 112px)" v-model="ruleForm.code"></el-input>
            <el-button @click="getCode('ruleForm')">获取验证码</el-button>
          </el-form-item> 
          <el-form-item  >
            <el-button :disabled="!isGetShow" type="primary" @click="register('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script> 
  import qs from 'qs'
  export default {
    data() { 
      return { 
        isGetShow:    false, //是否已经获取到验证码
        ruleForm: {
          account:    null,
          applyOrg:   null,
          email:      null,
          password:   null,
          rePassword: null, 
          realName:   null,
          code: null,
        }, 
      };
    },
    components: {
      
    },
    created () {
       
    },
    mounted () { 
    },
    methods: {
      validatePass(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          if (this.ruleForm.rePassword !== '') {
            this.$refs.ruleForm.validateField('rePassword');
          }
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          callback();
        }
      }, 
    	//注册
      register (formName) {     
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            if(!this.ruleForm.code){
              this.$message.error('请填写验证码！')
              return false;
            } 
            
            this.axios.post( `${this.common.basePath}/user/user/register`, this.ruleForm
            ).then( (response) =>{   
              this.$message.success('提交成功，等管理员审批！');
              setTimeout( () => {
                this.$router.push({path: '/login'})
              },1500)
              
            }).catch( (error) => { 
              this.$message.error(error); 
            });
          } else {
              console.log('error submit!!');
              return false;
          }
        }); 
      },
      /*
       * 获取验证码
       */
      getCode(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.axios.post( `${this.common.basePath}/user/user/sendSms`, this.ruleForm).then( (response) =>{   
              this.$message.success('验证码已经发送到你的邮箱，请确认查收！');
              this.isGetShow = true;
            }).catch( (error) => { 
              this.$message.error(error); 
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });  
        
      }
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;  
  .register-box {
    position: absolute;
    top: 10%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: 0 auto 0 auto;
    padding: 41px 0;
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
  .register-box {
    .el-form-item__content {
      padding-left: 0;
    }
  }
  .left-title{
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
</style> 