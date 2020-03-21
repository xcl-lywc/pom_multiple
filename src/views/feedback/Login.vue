<template>
  
  <div>
    <!--登录 -->
    <login @successSun="loginSuccess"></login>
    <el-dialog
      title="请选择组织"
      :visible.sync="dialogVisible"
      width="400px">
      <el-row :gutter="20" v-if="myOrg.total>0">
        <div v-for="item in myOrg.rows">
          <el-col :span="8">
            <el-card shadow="hover">
              <div @click="toPage(item.org_id)" class="cursor-pointer">{{item.org_name}}</div>
            </el-card>
          </el-col>
        </div>
      </el-row>
      <el-row :gutter="20" v-else>
        <div class="no-data">
          您还未加入任何组织 或者 组织获取失败，请重试！
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script> 
  import Login from './page/loginComponent.vue'
  export default {
    data() { 
      return { 
        dialogVisible:false,
        myOrg:{rows:[],total:0}
      };
    },
    components: {
      Login
    },
    created () {
       
    },
    mounted () {
    },
    methods: {
      /*
       * 登录成功 跳转第一个页面
       */
      loginSuccess(data){
        if(data.meta&&data.meta.code===0){
          this.queryUserInfo();
        }else{
          this.$message.error(data.meeta.message);
        }
      },

      /**
       * 查询当前登录用户信息
       * @return {[type]} [description]
       */
      queryUserInfo(){
        this.axios.get(`${this.common.basePath}/user/user/loginUser`,{params:{}}).then((response) => {
          //session中存储获取用户信息
          sessionStorage.setItem('userData',JSON.stringify(response.data));
          //session存储assignee、Access-Key
          sessionStorage.setItem("assignee",response.data.id)
          sessionStorage.setItem('Access-Key',JSON.stringify(response.data.id));
          //选组织
          this.queryUserOrgList(response.data.id);
        }).catch((error) => {this.$message.error('获取用户信息失败！5秒后...前往重新登录！');setTimeout(()=> {this.$router.push({name: 'Login'});}, 5000)});
      },

      /**
       * 查询当前登录用户的所属组织列表
       * @return {[type]} [description]
       */
      queryUserOrgList(id){
        this.axios.post( `${this.common.basePath}/user/orgs/getAll`, {user_id: id} ).then( (response) => { 
          this.myOrg = response.data;
          this.dialogVisible = true;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      }, 

      /**
       * 前往页面,并且session选择的组织id
       * @param  {[type]} org_id [description]
       * @return {[type]}        [description]
       */
      toPage(org_id){
        sessionStorage.setItem('feedback_orgId',JSON.stringify(org_id))
        this.$router.push({path: '/home'});
      },
    },
  }
</script>

<style scoped lang="less">
</style> 