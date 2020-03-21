/*******************************************************
 * author yuanyuan.xie  会议列表 
 * date 2018/09/18
 *******************************************************/
<template>
  <div v-loading="loading" class="pad20" >
    <!-- 查询表单 -->
    <el-form v-if="mettingForm" :model="mettingForm" ref="mettingForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="会议标题：" prop="m_title" :rules="[{ required: true, message: '会议标题不能为空'},]">
            <el-input v-model="mettingForm.m_title" ></el-input>
          </el-form-item>
          <el-form-item label="开始时间：" prop="startTime" :rules="[{ required: true, message: '开始时间不能为空'},]">
            <el-date-picker
              v-model="mettingForm.startTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="截止时间：" prop="endTime" :rules="[{ required: true, message: '结束时间不能为空'},]">
            <el-date-picker
              v-model="mettingForm.endTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="会议地点：" prop="m_addr" :rules="[{ required: true, message: '会议地点不能为空'},]">
            <el-input v-model="mettingForm.m_addr" placeholder=""></el-input>
          </el-form-item> 
          <el-form-item label="参会人：" prop="join_people_name" :rules="[{ required: true, message: '参会人不能为空'},]">
            <el-input readonly v-model="mettingForm.join_people_name" placeholder="请选择参会人"></el-input>
          </el-form-item>
          <el-form-item label="关键词：" prop="m_keywords" :rules="[{ required: true, message: '关键词不能为空'},]">
            <el-tag
              class="marr10"
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="keyWordHandleClose(tag)">
              {{tag}}
            </el-tag>
            <el-tag>
              
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="keyWordHandleInputConfirm"
              @blur="keyWordHandleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="keyWordShowInput">添加关键词</el-button>

          </el-form-item>
          <el-form-item label="描述：" prop="description" :rules="[{ required: true, message: '描述不能为空'},]">
            <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="mettingForm.description" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="附件：">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              :action="`${common.basePath}/user/file/upload`"
              :headers="{ 'Authorization': `Bearer ${token}`}"
              :data="{org_id: orgId, type: 'metting'}"
              :show-file-list="true"
              :on-success="uploadSuccess"
              name="upfile" 
              :file-list="defaultFileList"> 
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item> 
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>参会人</span> 
            </div>
            <div> 
              <tree-selected-last  
                class="marb20"      
                :isCheckbox="isCheckbox"
                :treeData="treeData" 
                :checkedValue="checkedValueReal"
                @treeValData="treeValDataFun"> 
              </tree-selected-last>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="updateMetting('mettingForm')">保存</el-button>
        <el-button type="primary" @click="publishMetting('mettingForm')">发布</el-button> 
      </el-form-item>
    </el-form> 
  </div>
</template>
<script type="text/javascript">
  import treeSelected from '../components/Query_Tree_Selected.vue'
  export default {  
    components:{
      'tree-selected-last': treeSelected
    },
    data() {
      return { 
        loginInUserInfo: JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        orgId:           sessionStorage.getItem('orgId'),   
        token:           sessionStorage.getItem('token'),      
        loading:         true,      
        mettingId:       this.$route.params.mettingid,
        dynamicTags:     [],    //添加关键词用
        inputVisible:    false, //添加关键词用
        inputValue:      null,  //添加关键词用 
        defaultFileList: [],    //默认文件列表
        isCheckbox:      0,
        treeData:        [],
        checkedValueReal:[],
        mettingForm:     null,
      }
    },
    mounted(){  
      this.getQueryMettingsInfo(); 
    },
    methods: {   
      /*
       * 查询会议详情 
       */
      getQueryMettingsInfo(){
        this.axios.post( `${this.common.basePath}/conference/meeting/meeting_info?id=${this.mettingId}`, '').then( (response) => { 
          this.getQueryData(response.data); 
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        });  
      }, 
      /*
       * 查询数据
       */
      getQueryData(mettingData) {  
        this.axios.get( `${this.common.basePath}/user/user/allLeader`, {params: {orgId: this.orgId}} ).then( (response) => {
          this.treeData = this._convertData(mettingData, response.data ? response.data : []); 
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        }); 
       },
      /*
       * 组装会议数据
       * @params {object} mettingData 会议数据
       * @params {object} treeData 人员树的数据
       */
      _convertData(mettingData, treeData){  
        let joinPeple = null, joinPeopleName = [], checkedValue = [];
        if(mettingData.join_people) {joinPeple = mettingData.join_people.split(',')}
      
        treeData.forEach((item) => {
          item.isShow = true; 
          if(item.childrens) this._convertData(item.childrens);  
          // ----------------- 用于获取选中的值 ----------------
          if(item.users){
            // 找到每层下面的人员信息
            item.users.rows.forEach( (item) => {
              // 根据之前被选中的人员Id 跟现在的所有人员数据做对比 
              if(joinPeple){
                joinPeple.forEach((checkItem) => { 
                  if(checkItem == item.id){ 
                    if(this.isCheckbox == 0){ 
                      checkedValue.push(item);
                      joinPeopleName.push(item.real_name);
                    }else{
                      joinPeopleName = item.real_name;
                      checkedValue = item;
                    } 
                  }
                })
              }
            })
          } 
        }) 
        // -------- 处理文件数据 -----------
        if(mettingData.appendix){
          JSON.parse(mettingData.appendix).forEach( (item) => {
            this.defaultFileList.push({name: item.fileName, url: item.path});
          })
        }
        
        this.checkedValueReal = checkedValue;
        mettingData.join_people_name = joinPeopleName.join(',');  
        this.dynamicTags = mettingData.m_keywords.split(',');
        this.mettingForm = mettingData;  
        return treeData;
      }, 
      /**
       * 上传成功, 写入img对应的path
       * @param  {[type]} response [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      uploadSuccess (response, file, fileList) {  
        let files = [];
        fileList.forEach( (item) => {
          if(item.response){
            if(item.response.data){
              item.response.data.forEach( (itemfile) => {
                files.push(itemfile)
              })
            } 
          }
          
        })
        this.mettingForm.appendix = JSON.stringify(files); 
      },
      /*
       * 修改会议 
       */
      updateMetting(formName){  
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( `${this.common.basePath}/conference/meeting/create_meeting`,  this.mettingForm).then( (response) => { 
              this.$router.push({name: 'MettingList'});
              this.loading = false;
            }).catch( (error) => {  
              this.loading = false;
              this.$message.error(error) 
            });  
          } else { 
            return false;
          }
        });
      },
      /*
       * 发布会议 
       */
      publishMetting(formName){  
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( `${this.common.basePath}/conference/meeting/publish`,  this.mettingForm).then( (response) => {
              this.$router.push({name: 'MettingList'});
              this.loading = false;
            }).catch( (error) => {  
              this.loading = false;
              this.$message.error(error) 
            });  
          } else { 
            return false;
          }
        });
      },
      /*
       * 删除关键词
       */
      keyWordHandleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        // ----------------  将关键词数组转换为字符串 ---------------------
        this.mettingForm.m_keywords = this.dynamicTags.join(',');
      },
      /*
       * 显示新增关键词文本框
       */
      keyWordShowInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }, 
      /*
       * 保存关键词
       */
      keyWordHandleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';

        // ----------------  将关键词数组转换为字符串 ---------------------
        this.mettingForm.m_keywords = this.dynamicTags.join(',');
      },
      resetMetting(formName){
        this.$refs.upload.clearFiles();
        this.dynamicTags = [];
        this.$refs[formName].resetFields();
      },
      /*
       * 获取到参会人
       */
      treeValDataFun(peoples){ 
        let joinPeople = [], joinPeopleName = [];
        peoples.forEach( (item) => {
          joinPeopleName.push(item.real_name);
          joinPeople.push(item.id);
        });
        this.mettingForm.join_people_name = joinPeopleName.join(',');
        this.mettingForm.join_people = joinPeople.join(',');
      }
    }
  }
</script>
<style lang="less"> 
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px!important;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>