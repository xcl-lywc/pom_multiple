/*********************组织架构*************************/
  Author: Yuanyuan.Xie
  Date:   2019.08.01
/****************************************************/
<template>
  <div>
    <!-- 组织简介 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>职能部门</span> 
      </div>
      <div>
        <el-row :gutter="20">
          <el-col class="org-str-box mart20 cursor-pointer" @click.native="goToDetail(item.id)"  v-for="(item, index) in orgFunctionalDepartmentsList" :key="index" :span="6">
            <el-card class="box-card" shadow="never">
              <div> 
                <el-avatar class="marl5" v-if="item.photo" :src="item.photo"></el-avatar> 
                <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
                <span class="marl5 display-inline-block">{{item.name}}<br/>{{item.adress}}</span>
              </div>
              <div class="org-des">
                {{item.description}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" class="mart20">
            <div @click="showOrgDialog(2)" class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i><input type="file" name="file" class="el-upload__input">
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card> 
    <el-card class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>下属支部</span> 
      </div>
      <div>
        <el-row :gutter="20">
          <el-col class="org-str-box mart20 cursor-pointer" @click.native="goToDetail(item.id)" v-for="(item, index) in orgSubordinateBranchList" :key="index" :span="6">
            <el-card class="box-card" shadow="never">
              <div> 
                <el-avatar class="marl5" v-if="item.photo" :src="item.photo"></el-avatar> 
                <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
                <span class="marl5 display-inline-block">{{item.name}}<br/>{{item.adress}}</span>
              </div>
              <div class="org-des">
                {{item.description}}
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" class="mart20">
            <div @click="showOrgDialog(1)" class="el-upload el-upload--picture-card">
              <i class="el-icon-plus"></i><input type="file" name="file" class="el-upload__input">
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card> 
    <el-dialog
      :title="type == '2' ? '新增职能部门' : '新建下属支部'"
      :visible.sync="dialogVisible"
      width="450px" > 
      <el-form ref="orgInfoForm" :model="orgInfoForm" label-width="100px"> 
        <el-form-item label="名称："
            prop="name"
            :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
          <el-input v-model="orgInfoForm.name"></el-input>
        </el-form-item> 
        <el-form-item v-if="type == 1" label="组织性质："
            prop="nature"
            :rules="[{ required: true, message: '请选择性质', trigger: 'blur' }]">
          <el-select v-model="orgInfoForm.nature" placeholder="请选择">
            <el-option
              v-for="(value, key) in orgNatureList"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-form-item>  
        <el-form-item>
          <el-button type="primary" @click="saveOrgInfoForm('orgInfoForm')">保存</el-button> 
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orgId:           sessionStorage.getItem('orgId'),  
        orgFunctionalDepartmentsList:         [], //职能部门
        orgSubordinateBranchList:             [], //下属支部
        orgNatureList:                        [], //组织性质
        dialogVisible:   false,
        orgInfoForm: {
          name:         null,
          superior_id:  sessionStorage.getItem('orgId'),
          type:         null,
          nature:       null,
        },
        type:           2, 
      }
    },
    mounted() {
      this.getQueryOrgList(2,'orgFunctionalDepartmentsList');// 职能部门
      this.getQueryOrgList(1, 'orgSubordinateBranchList');// 下属支部
      this.getQueryOrgNatureList();
    },
    methods: { 
      /*
       * 查询职能部门以及下属支部
       */
      getQueryOrgList(type, listName){
        this.axios.post( `${this.common.basePath}/user/orgs/children`, {orgId: this.orgId,orgType: type}).then( (response) => {    
          this[listName] = response.data.rows;
        }).catch( (error) => {   
          this.$message.error(error); 
        });
      },
      showOrgDialog(type){
        if(type == 2) this.orgInfoForm.nature = null
        this.type = type;
        this.orgInfoForm.type = type;
        this.dialogVisible = true;
      },
      /*
       * 根据不同的类型查询字典
       */
      getQueryOrgNatureList(){
        this.axios.get( `${this.common.basePath}/user/orgs/nature`, {}).then( (response) => {    
          this.orgNatureList = response.data;
        }).catch( (error) => {   
          this.$message.error(error); 
        });
      },
      /*
       * 保存组织简介表单
       */
      saveOrgInfoForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.axios.post( `${this.common.basePath}/user/orgs/new`, this.orgInfoForm).then( (response) => {   
              this.type == 2 ? this.getQueryOrgList(2,'orgFunctionalDepartmentsList') : this.getQueryOrgList(1,'orgSubordinateBranchList')
              this.$message.success(response.meta.message); 
              this.dialogVisible = false;
              this.$refs[formName].resetFields();
            }).catch( (error) => {   
              this.dialogVisible = false;
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        });
      },
      goToDetail(orgId){ 
        this.$router.push({name: 'OrgBriefIntroduction', params: {id: orgId}})
      }
    }
  }
</script>

<style lang="less">
 .avatar-uploader  {
    .el-upload{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    } 
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 147px;
      height: 147px;
      line-height: 147px;
      text-align: center;
    }
    .avatar {
      width: 147px;
      height: 147px;
      display: block;
    }
  } 
  .org-str-box{
    height: 148px;
    .el-card{
      height: 100%;
    }
  }
  .org-des{
    height: 66px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>