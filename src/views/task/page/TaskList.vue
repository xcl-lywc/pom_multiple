/**************************************
*---------------------任务列表-----------*
***************************************/
<template>
  <div class="task-list" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/tasklist_'+CLASS }">{{taskCommon.returnTaskData(CLASS).name}}任务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="table-container">
      <el-row class="padrl20">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="类型" prop="type">
            <el-select v-model="formInline.type" placeholder="请选择类型" clearable @clear="formInline.type = null" @focus="taskType.total===0 ? getTaskType(1) : ''" v-loading="isSelectLoading1">
              <el-option v-for="(item,index) in taskType.rows" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="formInline.name" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.name = $event;getList();" @clear="formInline.name = null"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formInline.status" placeholder="请选择状态" clearable @clear="formInline.status = null">
              <el-option v-for="(item,index) in statusArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-main>
        <el-table
          class="table-area"
          :data="tableData.rows"
          stripe
          border
          max-height="600"
          style="width: 100%"
          v-loading="isTableLoading"
          :row-key="getRowKeys"
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <el-table-column
            fixed
            type="selection"
            label="选择"
            :reserve-selection="true"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="taskType"
            label="任务类型"
            align="center"
            width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.taskType&&scope.row.taskType!=''">
                <span v-for="item in scope.row.taskType.split(',')">{{_conversion(Number(item))}}&nbsp;</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="taskName"
            label="任务名称"
            align="center"
            width="">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.startTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="截止时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.endTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="CLASS==='inner'"
            prop="designator"
            label="指派人"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="CLASS==='up'"
            prop="createOrg"
            label="上级组织"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            v-if="CLASS==='up'"
            prop="source"
            label="积分"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="CLASS==='down'"
            prop="createTime"
            label="创建时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.createTime, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="100">
            <template slot-scope="scope">
              {{statusArr[scope.row.status-1].name}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="CLASS==='inner'||CLASS==='down'"
            fixed="right"
            label="操作"
            align="center"
            width="300">
            <template slot-scope="scope">
              <div v-if="CLASS==='inner'">
                <el-button @click.native.prevent="operateTaskId=scope.row.id;dialogType=0;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;" type="warning" size="mini">指派</el-button>
                <el-button @click.native.prevent="operateTaskId=scope.row.id;dialogType=1;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;" type="success" size="mini" :disabled="scope.row.status===3||scope.row.status===4">汇报</el-button>
                <el-button @click.native.prevent="completeTask(scope.row.id)" type="primary" size="mini" :disabled="scope.row.status===3">完成</el-button>
                <el-button @click.native.prevent="$router.push({path: '/taskdetail_'+CLASS,query:{taskId:scope.row.id}})" type="" size="mini">详情</el-button>
              </div>
              <div v-if="CLASS==='down'">
                <el-button @click.native.prevent="approvalTask(scope.row.id)" type="warning" size="mini">审批</el-button>
                <el-button @click.native.prevent="fileList=[];operateTaskId=scope.row.id;dialogType=2;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;echoTaskDetail(scope.row.id);getKeyWords(4)" type="primary" size="mini">修改</el-button>
                <el-button @click.native.prevent="operateTaskId=scope.row.id;revokeTask()" type="danger" size="mini">撤销</el-button>
                <el-button @click.native.prevent="$router.push({path: '/taskdetail_'+CLASS,query:{taskId:scope.row.id}})" type="" size="mini">详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="fl btn-area">
          <el-button type="primary" size="small" @click="$message('暂时无法使用！')">导出</el-button>
          <el-button v-if="CLASS==='inner'" type="warning" size="small" @click="$message('暂时只能单个指派！')" :disabled="multipleSelection.length===0">指派</el-button>
          <el-button v-if="CLASS==='inner'" type="danger" size="small" @click="revokeTask()" :disabled="multipleSelection.length===0">撤销</el-button>
          <el-button v-if="CLASS==='inner'" type="success" size="small" @click="$router.push({path: '/taskcreate_'+CLASS})">创建</el-button>
        </div>
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- '任务指派','任务汇报','任务修改' 弹框 -->
    <el-dialog 
      :title="dialogTitle[dialogType]" 
      :visible.sync="dialogVisible"
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          v-if="dialogType===0"
          label="指派给：" 
          prop="ids" 
          :rules="[{ required: true, message: '请选择至少一个指派人', trigger: 'change' }]">
          <el-select
            v-loading="isSelectLoading3"
            class="w300"
            v-model="form.ids"
            multiple
            filterable
            default-first-option
            @focus="assignList.total==0 ? getAssignList(3) : ''"
            placeholder="请选择至少一个指派人，可选择多个">
            <el-option
              v-for="item in assignList.rows"
              :key="item.id"
              :label="item.real_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===1"
          label="汇报标题：" 
          prop="title" 
          :rules="[{ required: true, message: '请输入汇报任务的标题', trigger: 'blur' }]">
          <el-input v-model="form.title" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===2"
          label="任务名称：" 
          prop="taskName" 
          :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
          <el-input v-model="form.taskName" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===2"
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
        <el-form-item 
          v-if="dialogType===2"
          label="关键词：" 
          prop="keyWords" 
          :rules="[{ required: true, message: '请选择至少一个关键词', trigger: 'change' }]">
          <el-select
            class="w-100"
            v-model="form.keyWords"
            multiple
            filterable
            default-first-option
            @focus="keyWords.total==0 ? getKeywords(4) : ''"
            placeholder="请选择至少一个关键词，可选择多个"
            v-loading="isSelectLoading4">
            <el-option
              v-for="item in keyWords.rows"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="附件：" 
          prop="privateFile"
          label-position="top"
          :rules="[{ required: false, message: '请上传附件', trigger: 'blur' },]">
          <el-upload
            ref="uploadfile"
            class=""
            :action="`${common.basePath}/user/file/upload`"
            :headers="myHeaders"
            :show-file-list="true"
            :file-list="fileList"
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
        <el-form-item 
          label="描述：" 
          prop="introduction"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.introduction" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();$refs['uploadfile'].clearFiles();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">保 存</el-button>
      </div>
    </el-dialog>
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

        isTableLoading:false,
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formInline: {
          type: null,
          status: null,
          name: null,
        },
        statusArr:[{name:'待评审',id:1},{name:'执行中',id:2},{name:'完成',id:3},{name:'撤销',id:4}],//任务状态的下拉选数组集合
        taskType:{rows:[],total:0},//任务类别的下拉选数组集合
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:[],
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},
        
        //'任务指派','任务汇报','任务修改' dialog
        dialogVisible: false,
        dialogTitle:['任务指派','任务汇报','任务修改',],
        dialogType:0,
        dialogLoading:false,
        isSelectLoading4:false,
        isSelectLoading3:false,
        isSelectLoading2:false,
        isSelectLoading1:false,
        formLabelWidth: '100px',
        form: {
          introduction:null,
          privateFile:[],
          ids:[],
          orgId:null,
          title:null,
          taskName:null,
          dataValue:[],
          keyWords:[],
        },
        keyWords:{rows:[],total:0},
        fileList:[],
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
        assignList:{rows:[],total:0},//指派人
        operateTaskId:null,//任务id
        detailInfo:null,//详情
      }
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

      this.getList();
      this.getTaskType(1);
    },
    computed:{
      myFileData(){
        return {type:'taskFile',org_id:this.party_org_id};
      },
    },
    methods: {
      /**
       * 数据多选
       * [handleSelectionChange description]
       * @param  {[type]} val [被选中数组数据]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        let arr = [];
        val.forEach( function(element, index) {
          arr.push(element.id)
        });
        this.multipleSelection = arr;
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.getList();
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.getList();
      },
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
          if(element.response){
            arr.push(element.response.data[0].path)
          }else{
            arr.push(element.url)
          }
        });
        this.form.privateFile = arr;
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
          if(element.response){
            arr.push(element.response.data[0].path)
          }else{
            arr.push(element.url)
          }
        });
        this.form.privateFile = arr;
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
       * 创建的任务时间change事件，保证所选时间必须是未来时间
       * @return {[type]} [description]
       */
      datatimerChange(val){
        val&&val[0]>=new Date().getTime() ?'' :this.form.dataValue = []; 
      },

      /**
       * 获取内部/上下级任务列表
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTableLoading = true;
        this.axios.post(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/list`:`${this.taskCommon.basePath}/supAndSub/list`,this._serchformParms()).then((response) => {
          this.tableData = response.data;
          this.isTableLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTableLoading = false;
        });
      },
      _serchformParms(){
        return{
          orgId:this.party_org_id,
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          status: this.formInline.status,
          taskName: this.formInline.name,
          type: this.formInline.type ? String(this.formInline.type) : null,
          supOrSub:this.CLASS==='inner'?null:(this.CLASS==='up'?1:2),
        }
      },
      /**
       * 回显内部/上下级任务详情
       * @return {[type]} [description]
       */
      echoTaskDetail(id){
        let that = this;
        this.dialogLoading = true;
        this.axios.get(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/info`:`${this.taskCommon.basePath}/supAndSub/info`,{params:{id:id}}).then((response) => {
          this.form = response.data;
          this.form.introduction = response.data.content;
          this.form.dataValue = [response.data.startTime,response.data.endTime];
          if(response.data.privateFile&&response.data.privateFile.length>0){
            response.data.privateFile.forEach( function(element, index) {
              let name = '附件0'+(index+1)+'.'+element.split('.')[element.split('.').length-1];
              let url = element
              that.fileList.push({name:name,url:url})
            });
          }else{
            that.fileList = [];
          }
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 获取该组织下的指派人列表
       * @return {[type]} [description]
       */
      getAssignList(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/user/list`,{orgId:this.party_org_id}).then((response) => {
          this.assignList = response.data;
          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      /**
       * 获取关键词
       * @return {[type]} [description]
       */
      getKeyWords(i){
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
       * 获取任务类型
       * @return {[type]} [description]
       */
      getTaskType(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/dictionary/type`,{}).then((response) => {
          this.taskType = response.data;
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
       * 根据id转化关键词或任务类型
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      _conversion(id){
        let that = this;
        let result = '';
        this.taskType.rows.forEach( function(element, index) {
          id===element.id ? result=element.name : '';
        });
        return result;
      },

      /**
       * 提交弹框的表单
       * @param  {[type]} formName [description]
       * @param  {[type]} type     
       * @return {[type]}          [description]
       */
      submitForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type===0?this.taskAssignment():'';
            type===1?this.taskReport():'';
            type===2?this.taskModify():'';
          } else {
            return false;
          }
        });
      },
      /**
       * 内部/上下级任务指派
       * @return {[type]} [description]
       */
      taskAssignment(){
        let form = {
          // files: this.form.privateFile,
          ids:this.form.ids,//指派给谁
          message: this.form.introduction,//描述
          orgId: this.party_org_id,//指派给那个组织；指派内部任务时，指派组织为当前组织
          privateFile: this.form.privateFile,//附件
          taskId: this.operateTaskId,
        }
        this.axios.post(this.CLASS=='inner'?`${this.taskCommon.basePath}/tInside/assign`:`${this.taskCommon.basePath}/supAndSub/assign`,form).then((response) => {
          // this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务汇报
       * @return {[type]} [description]
       */
      taskReport(){
        let form = {
          // files: this.form.privateFile,
          title:this.form.title,//汇报大标题
          content: this.form.introduction,//汇报内容描述
          orgId: this.party_org_id,//汇报给那个组织
          privateFile: this.form.privateFile,//附件
          taskId: this.operateTaskId,
        }
        this.axios.post(this.CLASS=='inner'?`${this.taskCommon.basePath}/tInside/report`:`${this.taskCommon.basePath}/supAndSub/report`,form).then((response) => {
          // this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务修改
       * @return {[type]} [description]
       */
      taskModify(){
        let form = {
          id: this.operateTaskId,
          taskName: this.form.taskName,//任务名称
          startTime:this.form.dataValue[0],//任务开始日期
          endTime:this.form.dataValue[1],//任务截止日期
          privateFile:this.form.privateFile,//任务相关附件
          keyWords:this.form.keyWords,//任务关键词
          content:this.form.introduction,//任务描述
          // org:this.CLASS==='inner'?null:'string',
        }
        this.axios.post(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/update`:`${this.taskCommon.basePath}/supAndSub/update`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务任务的完成
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      completeTask(id) {
        this.$confirm('是否确认完成该任务?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'success'
        }).then(() => {
          this.axios.get(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/complete?ids=${id}`:`${this.taskCommon.basePath}/supAndSub/complete?ids=${id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
          
        }).catch(() => {});    
      },
      /**
       * 内部/上下级任务的撤销
       * @return {[type]}    [description]
       */
      revokeTask() {
        this.$confirm('是否确认撤销该任务?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'error'
        }).then(() => {
          this.axios.get(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/revoke?ids=${this.multipleSelection.join(',')}`:`${this.taskCommon.basePath}/supAndSub/revoke?ids=${this.operateTaskId}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
          
        }).catch(() => {});    
      },
      /**
       * 内部/上下级任务的审批
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      approvalTask(id) {
        this.$confirm('是否审批通过该任务?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'success'
        }).then(() => {
          // if(this.CLASS !='inner'){this.$message('暂无api');return;}
          this.axios.get(this.CLASS=='inneer'?`${this.taskCommon.basePath}/tInside/approval?id=${id}`:`${this.taskCommon.basePath}/supAndSub/approval?id=${id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
          
        }).catch(() => {});    
      },

      
    }
  }
</script>

<style lang="less" scoped>
  .task-list{
    
  }
</style>