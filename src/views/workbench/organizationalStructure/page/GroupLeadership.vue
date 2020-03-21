/*********************班子管理*************************/
  Author: Yuanyuan.Xie
  Date:   2019.08.05
/****************************************************/
<template>
  <div v-loading="isLoad">
    <!-- 组织简介 -->
    <draggable v-model="leaderList"
                 :options="{group:'people'}"
                 @start="drag=true"
                 @end="drag=false; draggablePositionEnd()">
      <el-card v-for="(item, indx) in leaderList" class="box-card mart20">
        <div slot="header" class="clearfix">
          <span>{{item.position_name}}</span>  
          <el-button class="fr" type="text" @click="showOrderLeaderDialog(item.info)">成员排序</el-button>
        </div>
        <div>
          <div v-if="!item.info.length">
            <el-link type="success" @click="dialogLeaderVisible = true; positionId = item.id ">添加</el-link>
          </div>
          <el-row v-else :gutter="20">   
            <el-col class="org-str-box marb20"   
              v-for="(itemLeader, indexLeader) in item.info" 
              :key="indexLeader" :span="6">
              <el-card class="box-card" shadow="never">
                <div class="box-card-fix"> 
                  <el-avatar class="marl5" v-if="itemLeader.photo" :src="itemLeader.photo"></el-avatar> 
                  <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
                  <span class="marl5 display-inline-block">{{itemLeader.user_name}}
                    <br/>{{common._convertDate(itemLeader.create_time, 'yyyy.MM.dd')}} 到 {{common._convertDate(itemLeader.stop_time, 'yyyy.MM.dd')}}
                  </span>
                  <span class="link">
                    <el-link class="marr10" type="primary" @click="deleteLeader(itemLeader.id)">离任</el-link> 
                    <el-link type="success" @click="dialogLeaderVisible = true; positionId = item.id; leaderId = itemLeader.id; ">添加</el-link>
                  </span>
                </div>
                <div>
                  {{itemLeader.description}} 
                </div>
              </el-card> 
            </el-col>  
          </el-row>
        </div>
      </el-card>   
    </draggable>
    <div class="mart20">
      <el-button type="primary" @click=" dialogPositionVisible = true ">添加职位</el-button>
    </div>
    <!-- 添加职位 -->
    <el-dialog
      title="添加职位"
      :visible.sync="dialogPositionVisible"
      width="450px" > 
      <el-form ref="positionForm" :model="positionForm" label-width="100px"> 
        <el-form-item label="名称："
            prop="name"
            :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="positionForm.name"></el-input>
        </el-form-item> 
        <el-form-item label="名称："
            prop="description"
            :rules="[{ required: true, message: '请输入多行文本', trigger: 'blur' }]">
          <el-input type="textarea" v-model="positionForm.description"></el-input>
        </el-form-item>    
        <el-form-item>
          <el-button type="primary" @click="savePostionForm('positionForm')">保存</el-button>
          <el-button @click="resetPositionForm('positionForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加成员 -->
    <el-dialog
      title="添加成员"
      :visible.sync="dialogLeaderVisible"
      width="450px" > 
      <el-form ref="leaderForm" :model="leaderForm" label-width="100px">  
        <el-form-item label="成员："
            prop="user_id"
            :rules="[{ required: true, message: '请选择成员', trigger: 'blur' }]">
          <el-select v-model="leaderForm.user_id" placeholder="请选择">
            <el-option
              v-for="(item, index) in userList"
              :key="item.id"
              :label="item.real_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>    
        <el-form-item>
          <el-button type="primary" @click="saveLeaderForm('leaderForm')">保存</el-button>
          <el-button @click="resetLeaderForm('leaderForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 成员排序 -->
     <el-dialog
      title="拖动排序"
      :visible.sync="dialogOrderLeaderVisible"
      width="80vw" > 
      <el-row :gutter="20">  
        <draggable v-model="leaderOrderItemList"
             :options="{group:'people'}"
             @start="drag=true"
             @end="drag=false;">
          <el-col class="org-str-box marb20"   
            v-for="(itemLeader, indexLeader) in leaderOrderItemList" 
            :key="indexLeader" :span="6">
            <el-card class="box-card" shadow="never">
              <div class="box-card-fix"> 
                <el-avatar class="marl5" v-if="itemLeader.photo" :src="itemLeader.photo"></el-avatar> 
                <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
                <span class="marl5 display-inline-block">{{itemLeader.user_name}}
                  <br/>{{common._convertDate(itemLeader.create_time, 'yyyy.MM.dd')}} 到 {{common._convertDate(itemLeader.stop_time, 'yyyy.MM.dd')}}
                </span>
                <span class="link">
                  <el-link class="marr10" type="primary" @click="deleteLeader(itemLeader.id)">离任</el-link> 
                  <el-link type="success" @click="dialogLeaderVisible = true; positionId = item.id; leaderId = itemLeader.id; ">添加</el-link>
                </span>
              </div>
              <div>
                {{itemLeader.description}} 
              </div>
            </el-card> 
          </el-col> 
        </draggable>
      </el-row>
      <div class="text-right">
        <el-button type="primary" @click="saveOrderLeaderForm()">保存</el-button> 
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  export default {
    components: {
      draggable,
     },
    data() {
      return {
        isLoad:                     true,
        orgId:                      sessionStorage.getItem('orgId'),  
        loginInUserInfo:            JSON.parse(sessionStorage.getItem('loginInUserInfo')),   
        dialogPositionVisible:      false, 
        dialogLeaderVisible:        false,
        dialogOrderLeaderVisible:   false,
        leaderList:                 null,//领导列表
        positionList:               null,//职位列表
        userList:                   null,//用户列表
        positionForm:    {
          name:        null,
          description: null,
          org_id:      sessionStorage.getItem('orgId'),
          order:       1,
        }, 
        leaderForm:      {
          position_id:   null,
          user_id:       null,
          leader_id:     null,
        },
        positionId:      null,
        leaderId:        null,
        leaderOrderItemList: [], //需要排序的成员列表
      }
    },
    mounted() {
      this.getQueryUserList();
      this.getQueryLeader();
      this.getQueryPositionList();
    },
    methods: { 
      /*
       * 查询成员数据
       */
      getQueryLeader(){
        this.axios.get( `${this.common.basePath}/user/leader/list/sort`, {params: {orgId: this.orgId}}).then( (response) => {    
          this.leaderList = response.data;
          this.isLoad = false;
        }).catch( (error) => {   
          this.isLoad = false;
          this.$message.error(error); 
        });
      },
      /*
       * 查询职位列表
       */
      getQueryPositionList(){
        this.axios.post( `${this.common.basePath}/user/position/list`, {orgId: this.orgId}).then( (response) => {    
          this.positionList = response.data.rows;
        }).catch( (error) => {   
          this.$message.error(error); 
        });
      },
      /*
       * 获取当前组织下面的所有用户
       */
      getQueryUserList(){ 
        this.axios.post( `${this.common.basePath}/user/user/list`, {orgId: this.orgId}).then( (response) => {    
          this.userList = response.data.rows;
        }).catch( (error) => {   
          this.$message.error(error); 
        });
      },
      savePostionForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.axios.post(`${this.common.basePath}/user/position/new`, this.positionForm).then( (response) => {    
              this.getQueryLeader();
              this.getQueryPositionList();
              this.$refs[formName].resetFields();
              this.dialogPositionVisible = false;
            }).catch( (error) => {   
              this.dialogPositionVisible = false;
              this.$refs[formName].resetFields();
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        }); 
      },
      saveLeaderForm(formName){
        this.leaderForm.position_id = this.positionId;
        this.leaderForm.leader_id = this.leaderId;
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.axios.post(`${this.common.basePath}/user/leader/add`, this.leaderForm).then( (response) => {    
              this.getQueryLeader(); 
              this.$refs[formName].resetFields();
              this.dialogLeaderVisible = false;
            }).catch( (error) => {   
              this.dialogLeaderVisible = false;
              this.$refs[formName].resetFields();
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        }); 
      },
      deleteLeader(id){
        this.$confirm('是否确认离任?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.common.basePath}/user/leader/delete`, {id: id}).then( (response) => {    
            this.getQueryLeader();  
            this.$message({
              type: 'success',
              message: '已删除'
            });  
          }).catch( (error) => {    
            this.$message.error(error); 
          });
        }).catch(() => {      
        }); 
      }, 
      draggablePositionEnd(){
        let positionOrder = [];
        this.leaderList.forEach((item) => {
          positionOrder.push(item);
        });
        this.axios.post(`${this.common.basePath}/user/position/order`, positionOrder).then( (response) => {    
          this.getQueryPositionList();
          this.$message({
            type: 'success',
            message: '职位排序成功'
          });  
        }).catch( (error) => {    
          this.$message.error(error); 
        });
      },
      showOrderLeaderDialog(leaderList){
        if(!leaderList || !leaderList.length) { this.$message('还没有成员，请添加成员！');return false;}
        this.dialogOrderLeaderVisible = true; 
        this.leaderOrderItemList = leaderList; 
      },
      saveOrderLeaderForm(){
        this.axios.post(`${this.common.basePath}/user/leader/order`, this.leaderOrderItemList).then( (response) => {    
          this.getQueryLeader();
          this.$message({
            type: 'success',
            message: '成员排序成功'
          });  
          this.dialogOrderLeaderVisible = false;
        }).catch( (error) => {    
          this.dialogOrderLeaderVisible = false;
          this.$message.error(error); 
        });
      }
    }
  }
</script>

<style lang="less"> 
  .org-str-box{
    height: 148px;
    .el-card{
      height: 100%;
    }
  }
  .box-card-fix{
    position: relative;
    .link{
      position: absolute;
      right: 0;
    }
  }
</style>