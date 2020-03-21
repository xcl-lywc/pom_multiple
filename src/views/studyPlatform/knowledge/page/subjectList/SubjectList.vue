/**************************************
*---------------------学科列表（学科列表、学科详情）-----------*
***************************************/
<template>
  <div class="subject-list" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header height="">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="学科名称" prop="name">
            <el-input v-model="formInline.name" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.name = $event;getList();" @clear="formInline.name = null"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          class="table-area"
          :data="tableData.rows"
          stripe
          border
          max-height="650"
          style="width: 100%"
          v-loading="isTableLoading"
          :row-key="getRowKeys"
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column
            fixed
            type="selection"
            label=""
            :reserve-selection="true"
            width="55">
          </el-table-column> -->
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="学科名称"
            align="center"
            width="">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.create_time, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="countLecture"
            label="课程数量/个"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.countLecture?scope.row.countLecture:0}}
            </template>
          </el-table-column>
          <el-table-column
            prop="countQuestions"
            label="试题数/个"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.countQuestions?scope.row.countQuestions:0}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="300">
            <template slot-scope="scope">
              <el-button @click.native.prevent="delBtn(scope.row.id);" type="danger" size="mini">删除</el-button>
              <el-button @click.native.prevent="editId=scope.row.id;dialogType=2;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;getDetailInfo(scope.row.id);" type="primary" size="mini">编辑</el-button>
              <el-button type="" size="small" @click.native.prevent="skipDetail(scope.row.id)" :disabled="tableData.total===0">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="fl btn-area">
          <el-button type="success" size="small" @click="dialogType=1;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;">添加学科</el-button>
          <el-button type="danger" size="small" @click="$message('暂无api')" :disabled="tableData.total===0">批量删除</el-button>
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
    <!-- 弹框 -->
    <el-dialog 
      :title="dialogType===1 ? '添加学科' : '编辑学科' " 
      :visible.sync="dialogVisible" 
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        isTableLoading:false,
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formInline: {
          name: null,
        },
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:null,

        //dialog
        dialogVisible: false,
        dialogType:1,//1添加，2编辑
        dialogLoading:false,
        form: {
          // party_org_code:'1-1',
          party_org_id:1,
          name: null,
          description: null,
        },
        formLabelWidth: '100px',
        editId:null,//编辑表单的id
        detailInfo:null,//学科详情

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
      this.getList();
    },
    methods: {
      
      /**
       * 数据多选
       * [handleSelectionChange description]
       * @param  {[type]} val [被选中数组数据]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
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
       * 获取学科列表
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTableLoading = true;
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_by_name`,this._serchformParms()).then((response) => {
          this.tableData = response.data;
          this.isTableLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTableLoading = false;
        });
      },
      _serchformParms(){
        return{
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          name: this.formInline.name,
          party_org_id:this.party_org_id,
        }
      },
      /**
       * 获取学科详情信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getDetailInfo(id){
        this.dialogLoading = true;
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_by_id?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.form = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);
        });
      },

      /**
       * 提交添加或编辑表单
       * @param  {[type]} formName [description]
       * @param  {[type]} type     1添加，2编辑
       * @return {[type]}          [description]
       */
      submitForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type === 2 ? this.edit() : this.add();
          } else {
            return false;
          }
        });
      },
      /**
       * 编辑学科
       * @return {[type]} [description]
       */
      edit(){
        let form = {
          id:this.editId,
          name: this.form.name,
          description: this.form.description,
          party_org_id:this.party_org_id,
        }
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/edit_by_id`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
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
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 删除学科
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      delBtn(id) {
        this.$confirm('是否删除该学科?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/delete_by_id?id=${id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});    
      },
      
      /**
       * 跳转详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      skipDetail(id){
        this.$router.push({
          name:'SubjectDetail',
          params:{
            id:id,
          }
        })
      },
     
    }
  }
</script>
<style lang="less" scoped>
   .subject-list{
      
   }
</style>