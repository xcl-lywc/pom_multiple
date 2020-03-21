/*********************新评论*************************/
  Author: Yuanyuan.Xie
  Date:   2019.07.15
/****************************************************/
<template>
  <div v-loading="isLoad">
    <!-- 组织简介 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>组织简介</span> 
      </div>
      <div> 
        <el-form ref="orgInfoForm" :model="orgInfoForm" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名称："
                prop="name"
                :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                <el-input v-model="orgInfoForm.name"></el-input>
              </el-form-item>
              <el-form-item label="成立时间："
                prop="buildtime.date_time"
                :rules="[{ required: true, message: '请选择成立时间', trigger: 'blur' }]">
                <el-row>
                  <el-col :span="14">
                    <el-date-picker
                      style="width: 100%"
                      v-model="orgInfoForm.buildtime.date_time"
                      :type="getTypeName(orgInfoForm.buildtime.type)"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="10">
                    <el-select v-model="orgInfoForm.buildtime.type" placeholder="请选择" style="width: 100%">
                      <el-option label="年" value="1"></el-option>
                      <el-option label="年-月" value="2"></el-option>
                      <el-option label="年-月-日" value="3"></el-option>
                      <el-option label="年-月-日 时:分:秒" value="4"></el-option>
                    </el-select>
                  </el-col>
                </el-row> 
                
              </el-form-item>
              <el-form-item label="地址："
                prop="address"
                :rules="[{ required: true, message: '请输入地址', trigger: 'blur' }]">
                <el-input v-model="orgInfoForm.address"></el-input>
              </el-form-item>
              <el-form-item label="电话："
                prop="phone"
                :rules="[{ required: true, message: '请输入电话', trigger: 'blur' }]">
                <el-input v-model="orgInfoForm.phone"></el-input>
              </el-form-item> 
            </el-col>
            <el-col :span="12">
              <el-form-item label="头像："
                prop="photo"
                :rules="[{ required: true, message: '请上传头像', trigger: 'blur' }]">
                <el-upload
                  class="avatar-uploader"  
                  :action="`${common.basePath}/home/sys/ueditor/exec?action=uploadimage`"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess" 
                  name="upfile">
                  <img v-if="orgInfoForm.photo" :src="orgInfoForm.photo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="邮箱："
                prop="mailbox"
                :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
                <el-input v-model="orgInfoForm.mailbox"></el-input>
              </el-form-item> 
            </el-col>
            <el-col :span="24">
              <el-form-item label="简介：">
                <el-input type="textarea" v-model="orgInfoForm.description" :autosize="{ minRows: 5}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="text-right">
              <el-button type="primary" @click="saveOrgInfoForm('orgInfoForm')">保存</el-button>
              <el-button @click="resetOrgInfoForm('orgInfoForm')">还原</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <!-- 公示信息 --> 
    <el-card v-for="(item, index) in noticeList" :key="index" class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>公示信息{{index + 1}}</span> 
      </div>
      <div>
        <el-form :ref="`noticeInfoForm${index}`" :model="item" label-width="100px">
          <el-form-item label="名称："
            prop="title"
            :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
            <el-input v-model="item.title"></el-input>
          </el-form-item> 
          <el-form-item label="简介：" 
            prop="info"
            :rules="[{ required: true, message: '请输入简介', trigger: 'blur' }]">
            <!-- <el-input type="texteara" v-model="item.info"></el-input> -->
            <ueditor :valueData="item.info" :ref="`editueditor${index}`" :config="editorConfig" :type="'new'" :idName="`editueditor${index}`"></ueditor>
          </el-form-item>
          <el-button type="primary" @click="saveNoticeForm(`noticeInfoForm${index}`, item, 'edit', `editueditor${index}`)">保存</el-button>
            <el-button @click="resetNoticeForm(`noticeInfoForm${index}`, item)">还原</el-button>
        </el-form>
      </div>
    </el-card>
    <!-- 新增公示公告 -->
    <el-card class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>公示信息</span> 
      </div>
      <div>
        <el-form ref="noticeInfoForm" :model="noticeInfoForm" label-width="100px">
          <el-form-item label="名称："
            prop="title"
            :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
            <el-input v-model="noticeInfoForm.title"></el-input>
          </el-form-item> 
          <el-form-item label="简介：" 
            prop="info"
            :rules="[{ required: true, message: '请输入简介', trigger: 'blur' }]">
            <!-- <el-input type="texteara" v-model="noticeInfoForm.info"></el-input> -->
            <ueditor :ref="`addueditor`" :config="editorConfig" :type="'new'" idName="addueditor"></ueditor>
          </el-form-item>
          <el-button type="primary" @click="saveNoticeForm('noticeInfoForm', noticeInfoForm , 'new', 'addueditor')">保存</el-button>
            <el-button @click="resetNoticeForm('noticeInfoForm', noticeInfoForm)">还原</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import ueditor from '../../../../components/Ueditor.vue' 
  export default {
    components: {
      ueditor
    },
    data() {
      return {
        isLoad:          true,
        orgId:           this.$route.params.id != ':id' && this.$route.params.id ? this.$route.params.id : sessionStorage.getItem('orgId'),  //用户信息
        orgInfoForm: {
          address:      null,
          buildtime:    {date_time: '', type: '1'},
          description:  null,
          latitude:     null,
          longitude:    null,
          mailbox:      null,
          name:         null,
          nature:       null,
          office_start: null,
          office_stop:  null,
          phone:        null,
          photo:        null,
          type:         null,
        }, 
        buildTimeType:  'date',
        orgNatureList:  [],
        orgTypeList:    [],
        noticeList:     [],
        noticeInfoForm: {  
          info:       null,
          order:      0,
          org_id:     this.$route.params.id != ':id' && this.$route.params.id ? this.$route.params.id : sessionStorage.getItem('orgId'),
          title:      null
        },
        editorConfig: {
          /*可以在此处定义工具栏的内容*/
          elementPathEnabled: false,
          autoHeightEnabled: false,
          autoFloatEnabled: false,　　//是否工具栏可浮动
          initialContent: ' ',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent: false, 
          //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: '/ueditor/'
        },
      }
    },
    mounted() {
      this.getQueryOrgDetailById();
      this.getQueryOrgNatureList();// 组织性质
      this.getQueryOrgTypeList();// 组织类别
      this.getQueryNoticeList(); 
    },
    methods: {
      /*
       * 获取组织详情
       */
      getQueryOrgDetailById(){
        this.axios.get( `${this.common.basePath}/user/orgs/one?id=${this.orgId}`, '').then( (response) => {   
          if(!response.data.buildtime){
            response.data.buildtime = {date_time: null, type: '1'};
          } 
          response.data.buildtime.type = response.data.buildtime.type.toString();
          response.data.type = response.data.type.toString();
          response.data.nature = response.data.nature.toString();
          this.orgInfoForm = response.data;  

          this.isLoad = false;
        }).catch( (error) => {   
          this.isLoad = false;
          this.$message.error(error); 
        });
      },
      handleAvatarSuccess(file){ 
        this.orgInfoForm.photo = file.path;
      },
      /*
       * 保存组织简介表单
       */
      saveOrgInfoForm(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) {  
            this.orgInfoForm.buildtime.date_time = new Date(this.orgInfoForm.buildtime.date_time).getTime();
            this.axios.post( `${this.common.basePath}/user/orgs/update`, this.orgInfoForm).then( (response) => {  
              this.$message.success(response.meta.message);  
              this.getQueryOrgDetailById();
            }).catch( (error) => {    
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        });
      },
      /*
       * 重置组织简介表单
       */
      resetOrgInfoForm(formName){
        this.$refs[formName].resetFields();
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
       * 根据不同的类型查询字典
       */
      getQueryOrgTypeList(){
        this.axios.get( `${this.common.basePath}/user/orgs/type`, {}).then( (response) => {    
          this.orgTypeList = response.data;
        }).catch( (error) => {   
          this.$message.error(error); 
        });
      },
      getTypeName(typeId){
        switch(typeId){
          case '1':
            return 'year';
            break;
          case '2':
            return 'month';
            break;
          case '3':
            return 'date';
            break;
          case '4':
            return 'datetime';
            break; 
        }
      },
      /*
       * 查询公告列表
       */
      getQueryNoticeList(){
        this.axios.post( `${this.common.basePath}/user/notice/list`, {orgId: this.orgId}).then( (response) => {    
          this.noticeList = response.data;
        }).catch( (error) => {   
          this.$message.error(error); 
        }); 
      },
      /*
       * 保存公告信息
       * @params {string} formName 表单ref名称
       * @params {object} item 当前需要被保存的对象
       * @params {string} operateType 操作类型
       * @params {number} index 下标
       */
      saveNoticeForm(formName, item, operateType, ueditorRefName){
        if(operateType == 'new'){
          item.info = this.$refs[ueditorRefName].getUEContent();
        }else{
          item.info = this.$refs[ueditorRefName][0].getUEContent();
        } 

        let url = operateType == 'new' ? `${this.common.basePath}/user/notice/new` : `${this.common.basePath}/user/notice/update`;
        let regsObj = operateType == 'new' ? this.$refs[formName] : this.$refs[formName][0];

        regsObj.validate((valid) => {
          if (valid) { 
            this.axios.post( url, item).then( (response) => {  
              regsObj.resetFields();
              this.$message.success(response.meta.message);  
              this.getQueryNoticeList(); 
            }).catch( (error) => {    
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        });
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
  
</style>