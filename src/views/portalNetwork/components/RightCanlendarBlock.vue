/**************************************
*--------------------- 右边，人头，日历模块 ---------------------*
***************************************/
<template>
	<div>
		<!-- 日历 -->
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="12" class="text-left">
            <el-dropdown>
              <span class="el-dropdown-link"><i class="el-icon-user-solid"></i>张三</span> 
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-row :gutter="0" style="min-width: 250px">
                    <el-col :span="11">
                      <el-avatar shape="square" :size="100" :src="loginInUserInfo.picture"></el-avatar>
                    </el-col>
                    <el-col :span="13">
                      <p>{{loginInUserInfo.real_name}} <i :class="loginInUserInfo.sex == 0 ? 'el-icon-male' : 'el-icon-female'"></i></p>
                      <p>生日：{{common._convertDate(loginInUserInfo.birthday, 'yyyy.MM.dd')}} </p>
                      <p>手机：{{loginInUserInfo.phone_num}} </p>
                    </el-col>
                  </el-row>
                </el-dropdown-item> 
                <el-dropdown-item>我的信息</el-dropdown-item>
                <el-dropdown-item>我的收藏</el-dropdown-item>
                <el-dropdown-item>我的课程</el-dropdown-item>
                <el-dropdown-item>我的工作</el-dropdown-item> 
                <el-dropdown-item>
                  <el-button type="primary" size="mini" @click="updatePwdDialogVisible = true; $refs.uploadPwdForm ? $refs.uploadPwdForm.resetFields() : ''; ">修改密码</el-button> 
                  <el-button type="primary" size="mini">退出登录</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> 
          </el-col>
          <el-col :span="12" class="text-right">
            <!-- 聊天按钮 --> 
            <div  @click="$router.push({name: 'ChatDialogue'})" style="display:inline-block">
              <el-badge :value="chatNews" class="item" v-if="isComment">
              <i class="el-icon-s-comment cursor-pointer"></i>
            </el-badge>   
            </div> 
            <div v-if="isOrg">
              <el-select v-model="orgId" @change="changeOrg">
                <el-option v-for="(item, index) in orgList" :value="item.org_id" :label="item.org_name"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <Canlendar></Canlendar>
      </div>
    </el-card>
    <el-dialog
      title="修改密码"
      :visible.sync="updatePwdDialogVisible"
      width="30%" > 
      <el-form :model="uploadPwdForm" ref="uploadPwdForm" label-width="100px" class="demo-ruleForm">
        <el-form-item 
          label="旧密码：" 
          prop="oldPassWord" 
          :rules="[
            { required: true, message: '请输入账号', trigger: 'blur' }, 
          ]">
          <el-input type="password" v-model="uploadPwdForm.oldPassWord"></el-input>
        </el-form-item>
        <el-form-item 
          label="新密码：" 
          prop="newPassWord" 
          :rules="[
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }, 
          ]">
          <el-input type="password" v-model="uploadPwdForm.newPassWord"></el-input>
        </el-form-item>
        <el-form-item 
          label="确认密码：" 
          prop="resnewPassWord" 
          :rules="[
            { required: true, message: '再次输入密码', trigger: 'blur' }, 
            { validator: validatePass2, trigger: 'blur' } 
          ]">
          <el-input type="password" v-model="uploadPwdForm.resnewPassWord"></el-input>
        </el-form-item> 
        <el-form-item  >
          <el-button type="primary" @click="updatePwd('uploadPwdForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
	</div>
</template>
<script>  
  import Canlendar from './Canlendar.vue'
  export default { 
    props: {
      nature: {     //组织性质编号
        default: 2,
        required: false
      },
      isOrg:  {     //true为显示下拉组织选项
        default: false,
        required: false
      },
      isComment: {  //true显示聊天对话按钮
        default: true,
        required: false
      },
      orgList:{   //组织数组，只有当需要暂时组织下拉的时候才有数据
        type: Array, 
        required: false
      }
    },
    components: {
      Canlendar
    },
    data() {
      return {
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        token:              sessionStorage.getItem('token'),    //框架的数据, 
        loading:            false,       //页面加载
        updatePwdDialogVisible: false,
        orgId:              null,  
        uploadPwdForm:      { //修改密码表单
          oldPassWord:    null,
          newPassWord:    null,
          resnewPassWord: null,
        }, 
        chatNews:0,//未读聊天消息
      }
    }, 
    mounted() {   
      if(this.orgList){
         this.orgId = this.orgList[0].org_id;
      };
      this.getMyUnReadNews();
    }, 
    methods: {   
      validatePass(rule, value, callback) {
        if (!value) {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          if (this.uploadPwdForm.resnewPassWord !== '') {
            this.$refs.uploadPwdForm.validateField('rePassword');
          }
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.uploadPwdForm.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          callback();
        }
      }, 
      /*
       * 查询组织积分雷达图
       */
      updatePwd(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.axios.post( `${this.common.basePath}/user/user/passwordUpdate`, this.uploadPwdForm).then( (response) =>{   
              this.$message.success(response.meta.message);
              this.updatePwdDialogVisible = false; 
            }).catch( (error) => { 
              this.updatePwdDialogVisible = false;
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        });   
      },  
      /*
       * 根据组织性质查询组织列表
       */
      getQueryOrgList(){
        this.axios.post( `${this.common.basePath}/user/orgs/getAll`, {user_id: this.loginInUserInfo.id, nature: parseInt(this.nature)}).then( (response) =>{   
          this.orgList = response.data;
          this.orgId = response.data.rows[0].org_id;
          this.$emit('orgChangeId', this.orgId);
        }).catch( (error) => {  
          this.$message.error(error); 
        });
      },
      changeOrg(){
        this.$emit('orgChangeId', this.orgId);
      },

      /**
       * 获取我的未读聊天消息
       * @return {[type]} [description]
       */
      getMyUnReadNews(){
        this.axios.get(`${this.common.basePath}/user/online_chat/un_read`,{params:{pageNum:1,pageSize:10}}).then((response) => {
          this.chatNews = response.data.total;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
    }
  }
</script>

<style lang="less">
  .echart-box{
    width: 100%;
    height: 500px;
  }
  .integral-history-box{
    height: 468px;
    overflow: auto;
  }
  .photo-message{ 
    display: inline-flex;
    width: 100%;
    .photo{
      img{
        width: 120px;
        height: 150px;
      }
    }
  }
</style>