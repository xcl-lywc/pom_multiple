/**************************************
*---------------------创建任务-----------*
***************************************/
<template>
  <div class="task-create" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tasklist_'+CLASS }">{{taskCommon.returnTaskData(CLASS).name}}任务</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/taskcreate_'+CLASS }">创建任务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="table-container">
      <el-header height="50px" class="line-height-50 mart10">
        <h4>任务信息</h4>
      </el-header>
      <el-main class="padrl20">
        <el-form 
          :model="form" 
          ref="form"
          :label-width="formLabelWidth">
          <el-row :gutter="20">
            <el-col :span='12'>
              <el-form-item 
                label="名称：" 
                prop="taskName" 
                :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                <el-input v-model="form.taskName" class="w300"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item 
                label="时间：" 
                prop="dataValue"
                :rules="[{ required: true, message: '请选择时间，且时间段必须是未来时间', trigger: 'change' }]">
                <el-date-picker
                  v-model="form.dataValue"
                  type="datetimerange"
                  align="right"
                  unlink-panels
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="截止时间"
                  value-format="timestamp"
                  size=""
                  :picker-options="pickerOptions"
                  @change="datatimerChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item 
            label="关键词：" 
            prop="keywords" 
            :rules="[{ required: true, message: '请选择至少一个关键词', trigger: 'change' }]">
            <el-select
              class="w-100"
              v-model="form.keywords"
              multiple
              filterable
              default-first-option
              @focus="keyWords.total==0 ? getKeywords(1) : ''"
              placeholder="请选择至少一个关键词，可选择多个"
              v-loading="isSelectLoading1">
              <el-option
                v-for="item in keyWords.rows"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="描述：" 
            prop="introduction"
            :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="form.introduction" rows="5"></el-input>
          </el-form-item>
          <!-- <el-form-item 
            label="任务积分" 
            prop="source"
            :rules="[{ required: false, message: '请输入任务积分', trigger: 'blur' }]">
            <el-input-number v-model="form.source" :min="0" :precision="2"></el-input-number>
          </el-form-item> -->
          <el-form-item 
            label="附件：" 
            prop="flie"
            label-position="top"
            class="is-required"
            :rules="[{ validator: checkFiles, trigger: 'blur' }]">
            <el-upload
              ref="uploadfile"
              class=""
              :action="`${common.basePath}/user/file/upload`"
              :headers="myHeaders"
              :show-file-list="true"
              :limit="10"
              multiple
              name="file"
              :data="myFileData"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-error="handleError"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload">
              <el-button size="small" type="primary">上传附件</el-button>
              <span slot="tip" class="el-upload__tip mar0 line-height-16 marl5">最多上传10个附件，且单附件不超过50M</span>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-main>
      <el-header height="50px" class="line-height-50">
        <h4>审批</h4>
      </el-header>
      <el-main class="padrl20">
        <el-form 
          :model="form_" 
          ref="form_"
          :label-width="formLabelWidth">
          <el-row :gutter="20">
            <el-col :span='12'>
              <el-form-item 
                label="审批人：" 
                prop="approver" 
                :rules="[{ required: !form_.isApprover, message: '请选择审批人', trigger: 'change' }]">
                <el-select v-model="form_.approver" class="w300" placeholder="请选择审批人" clearable @clear="form_.approver = null" @focus="approverList.total==0 ? getApproverList(2) : ''" :disabled="form_.isApprover" v-loading="isSelectLoading2">
                  <el-option v-for="(item,index) in approverList.rows" :label="item.real_name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item
                label="" 
                prop="isApprover"
                :rules="[{ required: false, message: '请选择是否需要审批', trigger: 'blur' }]">
                <el-switch
                  v-model="form_.isApprover"
                  active-text="不需要审批"
                  inactive-text="">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item 
            v-if="CLASS!='inner'"
            label="执行单位："
            prop="acceptanceOrg" 
            :rules="[{ required: true, message: '请选择执行单位', trigger: 'change' }]">
            <el-select v-model="form_.acceptanceOrg" class="w300" placeholder="请选择执行单位" clearable @clear="form_.acceptanceOrg = null" @focus="acceptanceList.total==0 ? getAcceptanceList(4) : ''" v-loading="isSelectLoading4">
              <el-option v-for="(item,index) in acceptanceList.rows" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
      <el-header height="50px" class="line-height-50" v-if="false">
        <h4>受理</h4>
      </el-header>
      <el-main class="padrl20" v-if="false">
        <el-form 
          :model="form__" 
          ref="form__"
          :label-width="formLabelWidth">
          <el-row :gutter="20">
            <el-col :span='12'>
              <el-form-item 
                label="受理人：" 
                prop="assignee" 
                :rules="[{ required: true, message: '请选择至少一个受理人', trigger: 'change' }]">
                <el-select
                  v-loading="isSelectLoading3"
                  class="w300"
                  v-model="form__.assignee"
                  multiple
                  filterable
                  default-first-option
                  @focus="approverList.total==0 ? getApproverList(3) : ''"
                  placeholder="请选择至少一个受理人，可选择多个">
                  <el-option
                    v-for="item in approverList.rows"
                    :key="item.id"
                    :label="item.real_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item 
                label="受理组织：" 
                label-width="100px"
                prop="acceptanceOrg" 
                :rules="[{ required: false, message: '请选择受理组织', trigger: 'change' }]">
                <el-select v-model="form__.acceptanceOrg" class="w300" placeholder="请选择受理组织" clearable @clear="form__.acceptanceOrg = null" @focus="acceptanceList.total==0 ? getAcceptanceList(4) : ''" v-loading="isSelectLoading4">
                  <el-option v-for="(item,index) in acceptanceList.rows" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
      <el-footer>
        <div class="fr">
          <el-button type="primary" @click="$message('暂无api')"  size="small">保 存</el-button>
          <el-button type="success" @click="submitForm('form','form_')" size="small">提 交</el-button>
          <el-button @click="$refs['form'].resetFields();$refs['form_'].resetFields();$refs['uploadfile'].clearFiles()" size="small">取 消</el-button>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        CLASS:this.$route.path.split('_')[1],//class分类：inner---内部任务；up---上级任务；down---下级任务
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},

        formLabelWidth: '100px',
        isSelectLoading1:false,
        isSelectLoading2:false,
        isSelectLoading3:false,
        isSelectLoading4:false,
        form: {
          taskName:null,
          dataValue:[],
          keywords:[],
          introduction:null,
          flie:[],
          source:0,
        },
        form_: {
          approver:null,
          isApprover:false,
          acceptanceOrg:null,
        },
        form__:{
          assignee:[],
          acceptanceOrg:null,
        },
        keyWords:{rows:[],total:0},//关键字
        approverList:{rows:[],total:0},//审批人或受理人
        acceptanceList:{rows:[],total:0},//受理组织
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    computed:{
      myFileData(){
        return {type:'taskFile',org_id:this.party_org_id};
      },
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('task_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("task_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
    },
    destoryed() {
       
    },
    methods: {
      /**
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: `${file.name} 上传成功!!`});
        }else{
          this.$message.error(res.meta.message);
        }
        let arr = [];
        fileList.forEach( function(element, index) {
          arr.push(element.response.data[0].path)
        });
        this.form.file = arr;
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove(file, fileList) {
        let arr = [];
        fileList.forEach( function(element, index) {
          arr.push(element.response.data[0].path)
        });
        this.form.file = arr;
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError(err, file, fileList){
        console.log(err, file, fileList)
        this.$message.error(`${file.name} 上传失败!!`);
      },
      /**
       * 限制文件上传个数
       * @param  {[type]} files    [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleExceed(files, fileList) {
        this.$message.warning(`上传的文件超出限制个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件！！！`);
      },
      /**
       * 限制用户上传格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload(file) {
        const isLt100M = file.size / 1024 / 1024 < 50;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 50MB!');
        }
        return isLt100M;
      },
      /**
       * 验证是否上传文件
       * @param  {[type]}   rule     [description]
       * @param  {[type]}   value    [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      checkFiles(rule, value, callback){
        if (this.form.file===[]||this.form.file===undefined) {
          callback(new Error('请选择要上传的附件'));
        } else {
          callback();
        }
      },

      /**
       * 获取关键词
       * @return {[type]} [description]
       */
      getKeywords(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/dictionary/type`,{}).then((response) => {
          this.keyWords = response.data;
          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      /**
       * 获取该组织下的审批人或受理人列表
       * @return {[type]} [description]
       */
      getApproverList(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/user/list`,{orgId:this.party_org_id}).then((response) => {
          this.approverList = response.data;
          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      /**
       * 获取该组织下的受理组织列表
       * @return {[type]} [description]
       */
      getAcceptanceList(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/orgs/list`,{orgId:this.party_org_id}).then((response) => {
          this.acceptanceList = response.data;
          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      _switchLoading(value,i){
        console.log(value,i)
        switch (i) {
          case 1:
            return this.isSelectLoading1 = value; 
            break;
          case 2:
            return this.isSelectLoading2 = value; 
            break;
          case 3:
            return this.isSelectLoading3 = value; 
            break;
          case 4:
            return this.isSelectLoading4 = value; 
            break;
          default:
            return false; 
            break;
        }
      },
      
      /**
       * 创建的任务时间change事件，保证所选时间必须是未来时间
       * @return {[type]} [description]
       */
      datatimerChange(val){
        val&&val[0]>=new Date().getTime() ?'' :this.form.dataValue = []; 
      },
      /**
       * 提交创建任务的表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName1,formName2) {
        this.$refs[formName1].validate((valid1) => {
          this.$refs[formName2].validate((valid2) => {
            if (valid1&&valid2) {
              this.create();
            } else {
              return false;
            }
          });
        });
      },
      /**
       * 创建内部/上下级任务
       * @return {[type]} [description]
       */
      create(){
        let form = {
          reviewUser:this.form_.isApprover?this.form_.approver:null,//任务审批人
          taskName: this.form.taskName,//任务名称
          startTime:this.form.dataValue[0],//任务开始日期
          endTime:this.form.dataValue[1],//任务截止日期
          privateFile:this.form.file,//任务相关附件
          keyWords:this.form.keywords,//任务关键词
          content:this.form.introduction,//任务描述
          createOrg:this.party_org_id,//创建组织
          // assignee:this.CLASS!='inner'?this.form__.assignee:null,//受理人
          acceptanceOrg:this.CLASS!='inner'?(this.form_.acceptanceOrg?String(this.form_.acceptanceOrg):null):null,//执行单位
          // source:this.form.source,//任务积分定义
        }
        this.axios.post(this.CLASS=='inner'?`${this.taskCommon.basePath}/tInside/create`:`${this.taskCommon.basePath}/supAndSub/create`,form).then((response) => {
          this.$message({type: 'success',message: '任务创建成功，可前往任务列表查看！'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .task-create{
    
  }
</style>