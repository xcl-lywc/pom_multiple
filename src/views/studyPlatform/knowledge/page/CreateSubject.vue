/**************************************
*---------------------创建学科（新建学科）-----------*
***************************************/
<template>
  <div class="create-subject" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header height=""></el-header>
      <el-main>
        <div class="">
          <el-form 
            :model="form" 
            ref="form"
            :label-width="formLabelWidth">
            <el-form-item 
              label="学科名称" 
              prop="name" 
              :rules="[{ required: true, message: '请输入学科名称', trigger: 'blur' }]">
              <el-input v-model="form.name" class="w300"></el-input>
            </el-form-item>
            <el-form-item 
              label="学科简介" 
              prop="description"
              :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
              { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
              <el-input type="textarea" v-model="form.description" rows="5"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer>
        <div class="text-right">
          <el-button @click="$refs['form'].resetFields();" size="small">重 置</el-button>
          <el-button type="primary" @click="submitForm('form')" size="small">创建学科</el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        form: {
          party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")),
          name: null,
          description: null,
        },
        formLabelWidth:'100px',
      };
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_knowledge_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
    },
    methods: {
      
      
      /**
       * 提交添加表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.add();
          } else {
            return false;
          }
        });
      },
      /**
       * 添加学科
       * @return {[type]} [description]
       */
      add(){
        let form = {
          party_org_id:this.party_org_id,
          name: this.form.name,
          description: this.form.description,
        }
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/create_subject`,form).then((response) => {
          this.$refs['form'].resetFields();//成功后，清空表单
          this.$message({type: 'success',message: '添加学科成功，可前往学科管理查看！'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      
     
    }
  }
</script>
<style lang="less" scoped>
   .create-subject{
      
   }
</style>