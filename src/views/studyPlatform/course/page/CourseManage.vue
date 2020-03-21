/**************************************
*---------------------课程管理（课程管理列表、课程资源管理）-----------*
***************************************/
<template>
  <div class="course-manage" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="formInline.name" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.name = $event;getList();" @clear="formInline.name = null"></el-input>
          </el-form-item>
          <el-form-item label="学科" prop="subject">
            <el-select v-model="formInline.subject" placeholder="请选择学科" clearable @clear="formInline.subject = null" @focus="selecMeuntArr.length==0 ? getSelectList() : ''">
              <el-option v-for="(item,index) in selecMeuntArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
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
          max-height="600"
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
            prop="l_title"
            label="课程名称"
            align="center"
            width="">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            align="center"
            width="">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.create_time, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="l_price"
            label="售价/元"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="score"
            label="评分"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{scope.row.score ? scope.row.score : '暂无评分'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="cur_status"
            label="状态"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.cur_status === 1">正常</span>
              <span v-if="scope.row.cur_status === 2">已下架</span>
              <span v-if="scope.row.cur_status === 20">已删除</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button @click.native.prevent="delBtn(scope.row.id);" type="danger" size="mini">删除</el-button>
              <el-button @click.native.prevent="drawerform.fk_lecture_id=scope.row.id;editId=scope.row.id;dialogType=2;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;getDetailInfo(scope.row.id);" type="primary" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="fl btn-area">
          <!-- <el-button type="primary" size="small" @click="">批量编辑</el-button> -->
          <el-button type="success" size="small" @click="drawerform.fk_lecture_id=null;dialogType=1;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;">添加课程</el-button>
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
      :title="dialogType===1 ? '添加课程' : '编辑课程' " 
      :visible.sync="dialogVisible" 
      top="5vh"
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="党课标题" 
          prop="l_title" 
          :rules="[{ required: true, message: '请输入党课标题', trigger: 'blur' }]">
          <el-input v-model="form.l_title" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="讲师" 
          prop="l_docent"
          :rules="[{ required: true, message: '请输入讲师姓名', trigger: 'blur' }]">
          <el-input v-model.number="form.l_docent" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          label="党课封面" 
          prop="l_covers"
          label-position="top"
          :rules="[{ required: false, message: '请选择要上传的图片', trigger: 'blur' }]">
          <el-upload
            class=""
            :action="`${common.basePath}/user/file/upload`"
            :headers="myHeaders"
            :show-file-list="false"
            list-type="picture"
            :file-list="form.l_covers?JSON.parse(form.l_covers):[]"
            :limit="1"
            name="file"
            :data="myImageData"
            :on-success="handleSuccess_covers"
            :on-remove="handleRemove_covers"
            :on-error="handleError_covers"
            :on-exceed="handleExceed_covers"
            :before-upload="beforeUpload_covers">
            <div class="cover-bar_" v-if="form.l_covers!='[]'" style="position:relative" @mouseover = 'isShowPicDelBtn = true'
                @mouseout = 'isShowPicDelBtn = false'>
              <el-image
                style="width: 100%;"
                :src="form.l_covers!='[]' ? JSON.parse(form.l_covers)[0].response.data[0].path : ''"
                fit="fill">
              </el-image>
              <i class="el-icon-delete delete-position" v-show="isShowPicDelBtn" @click.stop="handleRemove_covers('file',[])"></i>
            </div>
            <el-button size="small" type="primary" v-else>上传封面</el-button>
            <div slot="tip" class="el-upload__tip mar0 line-height-16 mart5">只能上传.jpg、.jpeg、.png、.gif格式的文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item 
          label="党课课时" 
          prop="lperiods"
          label-position="top"
          :rules="[{ required: false, message: '请添加课时', trigger: 'blur' }]">
          <el-button size="small" type="primary" @click="drawerType=1;$refs.knowledgeTree?$refs.knowledgeTree.setCheckedKeys([]):'';$refs['drawerform'] ? $refs['drawerform'].resetFields():'';drawer = true;getKnowledgeList();">添加课时</el-button>
          <div class="mart10" v-if="form.lperiods.length>0">
            <el-tree
              :props="classHourProps"
              :data="form.lperiods"
              node-key="id"
              ref="classHourTree">
              <span class="my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
                <span>{{ data.period_title }}</span>
                <span v-show="tempAtId == data.id" class="tree-right-operate">
                  <i class="el-icon-edit font-color-primary marr20" @click="editClassHour(data)"></i>
                  <i class="el-icon-delete font-color-danger" @click="delClassHour(data)"></i>
                </span>
              </span>
            </el-tree>
          </div>
          <span v-else>
            （未添加课时）
          </span>
        </el-form-item>
        <el-form-item 
          label="售价" 
          prop="l_price"
          :rules="[{ required: false, message: '请输入售价', trigger: 'blur' }]">
          <el-input-number v-model="form.l_price" :min="0" :precision="2" :step="10" controls-position="right"></el-input-number>
          <el-button class="append-unit">元</el-button>
        </el-form-item>
        <el-form-item 
          label="关键字" 
          prop="l_keywords" 
          :rules="[{ required: false, message: '请输入党课关键字', trigger: 'blur' }]">
          <el-input v-model="form.l_keywords" class="w300"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span='12'>
            <el-form-item 
              label="点赞" 
              prop="l_can_like"
              :rules="[{ required: false, message: '请选择是否点赞', trigger: 'change' }]">
              <el-switch active-text="允许" inactive-text="不允许" v-model="form.l_can_like"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item 
              label="点赞积分" 
              prop="like_score"
              :rules="[{ required: false, message: '请输入点赞积分', trigger: 'blur' }]">
              <el-input-number v-model="form.like_score" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span='12'>
            <el-form-item 
              label="评论" 
              prop="l_can_comment"
              :rules="[{ required: false, message: '请选择是否评论', trigger: 'change' }]">
              <el-switch active-text="允许" inactive-text="不允许" v-model="form.l_can_comment"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item 
              label="评论积分" 
              prop="comment_score"
              :rules="[{ required: false, message: '请输入评论积分', trigger: 'blur' }]">
              <el-input-number v-model="form.comment_score" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="报错积分" 
          prop="error_score"
          :rules="[{ required: false, message: '请输入报错积分', trigger: 'blur' }]">
          <el-input-number v-model="form.error_score" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item 
          label="党课简介" 
          prop="l_introduction"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.l_introduction" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">保 存</el-button>
      </div>
    </el-dialog>
    <!-- drawer -->
    <el-drawer
      :title="drawerType===1?'添加课时':'编辑课时'"
      :visible.sync="drawer"
      ref="drawer"
      :modal="false"
      :close-on-press-escape = "false"
      :wrapperClosable = 'false'
      size="600px"
      custom-class = 'costom-deawer-style'
      :direction="direction">
      <div class="demo-drawer__content">
        <el-form 
          :model="drawerform" 
          ref="drawerform"
          class="drawerform"
          :label-width="formLabelWidth">
          <el-form-item 
            label="课时标题" 
            prop="period_title" 
            :rules="[{ required: true, message: '请输入课时标题', trigger: 'blur' }]">
            <el-input v-model="drawerform.period_title" class="w300"></el-input>
          </el-form-item>
          <el-form-item 
            label="课时类型" 
            prop="period_type"
            :rules="[{ required: true, message: '请选择课时类型', trigger: 'change' }]">
            <el-select class="w300" v-model="drawerform.period_type" placeholder="" clearable @clear="drawerform.period_type = null" @change="drawerform.video_address = JSON.stringify([])">
              <el-option v-for="(item,index) in period_type_options" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="课时资料" 
            prop="video_address"
            class="is-required"
            :rules="[{ validator: checkFiles, trigger: 'blur' }]">
            <el-upload
              class=""
              :action="`${common.basePath}/user/file/upload`"
              :headers="myHeaders"
              :show-file-list="true"
              :file-list="drawerform.video_address ? JSON.parse(drawerform.video_address) : []"
              :limit="drawerform.period_type===1||drawerform.period_type===2?1:10"
              multiple
              name="file"
              :data="myFileData"
              :on-success="handleSuccess_data"
              :on-remove="handleRemove_data"
              :on-error="handleError_data"
              :on-exceed="handleExceed_data"
              :before-upload="beforeUpload_data">
              <el-button size="small" type="primary" v-if="drawerform.period_type">{{drawerform.period_type ? period_type_options[drawerform.period_type-1].uploadBtnText : '未选择课时类型'}}</el-button>
              <span slot="tip" class="el-upload__tip marl10">{{drawerform.period_type ? period_type_options[drawerform.period_type-1].uploadTips : '未选择课时类型'}}</span>
            </el-upload>
          </el-form-item>
          <el-form-item 
            label="课时时长" 
            prop="period_hours"
            :rules="[{ required: true, message: '请输入课时时长', trigger: 'blur' }]">
            <el-input-number v-model="drawerform.period_hours" :min="0" :precision="2" :step="1" controls-position="right"></el-input-number>
            <el-button class="append-unit">小时</el-button>
          </el-form-item>
          <el-form-item 
            label="课时积分" 
            prop="period_score"
            :rules="[{ required: true, message: '请输入课时积分', trigger: 'blur' }]">
            <el-input-number v-model="drawerform.period_score" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item 
            label="知识点" 
            prop="knowledges"
            :check-on-click-node="false"
            :rules="[{ required: true, message: '请选择知识点', trigger: 'change' }]">
            <el-tree
              :props="knowledgeProps"
              :data="knowledgeArr"
              node-key="id"
              ref="knowledgeTree"
              show-checkbox>
              <span class="my_custom-tree-node" slot-scope="{ node, data }">
                <span class="marl10">{{ data.name }}</span>
              </span>
            </el-tree>
          </el-form-item>
          <el-form-item 
            label="附件资料" 
            prop="period_appendix"
            :rules="[{ required: false, message: '请选择上传的附件', trigger: 'blur' }]">
            <el-upload
              class=""
              :action="`${common.basePath}/user/file/upload`"
              :headers="myHeaders"
              :show-file-list="true"
              :file-list="drawerform.period_appendix ? JSON.parse(drawerform.period_appendix) : []"
              :limit="10"
              multiple
              name="file"
              :data="myFileData"
              :on-success="handleSuccess_enclosure"
              :on-remove="handleRemove_enclosure"
              :on-error="handleError_enclosure"
              :on-exceed="handleExceed_enclosure"
              :before-upload="beforeUpload_enclosure">
              <el-button size="small" type="primary">上传课时学习资料的附件</el-button>
              <span slot="tip" class="el-upload__tip marl10">最多上传10个附件，且单附件不超过50M</span>
            </el-upload>
          </el-form-item>
          <el-form-item 
            label="课时简介" 
            prop="period_introduction"
            :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="drawerform.period_introduction" rows="5"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer text-right marr20">
          <el-button @click="drawer = false" size="small">取 消</el-button>
          <el-button @click="$refs['drawerform'].resetFields();$refs.knowledgeTree.setCheckedKeys([]);" size="small">重 置</el-button>
          <el-button type="primary" @click="submitClassHour('drawerform')" size="small">保 存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        isNoViewing:false,//是否禁止查看页面
        isLoading:false,
        isTableLoading:false,
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formInline: {
          subject: null,
          name: null,
        },
        selecMeuntArr:[],//选择框的下拉选数组集合
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:null,

        //dialog
        dialogVisible: false,
        dialogType:1,//1添加，2编辑
        dialogLoading:false,
        isShowPicDelBtn:false,//是否显示图片删除按钮
        form: {
          // party_org_code:'1-1',
          party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
          l_title: null,
          l_price:0,
          l_docent: null,
          l_covers:JSON.stringify([]),
          lperiods:[],
          knowledgeId:[],
          l_keywords:null,
          l_can_like: true,
          like_score:0,
          l_can_comment: true,
          comment_score:0,
          error_score:0,
          l_introduction:null,
        },
        formLabelWidth: '100px',
        editId:null,//编辑表单的id
        detailInfo:null,//课程详情
        tempAtId:null,//当前浮动选中的节点Id
        classHourProps: {
          label: 'period_title',
          children: 'childrens'
        },

        //drawer
        drawer:false,
        drawerType:1,//1添加，2编辑
        direction: 'rtl',
        drawerform:{
          fk_lecture_id:null,//党课ID
          period_title:null,
          period_type:1,//课时可以分为视频课时(1)、音频课时(2)、图文课时(3)和附件课时(4)
          video_address:JSON.stringify([]),//课时资料文件
          period_hours:0,
          period_score:0,
          period_introduction:null,
          knowledges:null,//知识点 String this.$refs.knowledgeTree.getCheckedKeys()
          period_appendix:JSON.stringify([]),//党课课时学习资料附件：多个附件按json串存储到该属性
        },
        period_type_options:[
          {name:'视频课时',id:1,uploadBtnText:'上传视频',uploadTips:'只能上传.mp4格式的文件，且不超过50M'},
          {name:'音频课时',id:2,uploadBtnText:'上传音频',uploadTips:'只能上传.mp3格式的文件，且不超过50M'},
          {name:'图文课时',id:3,uploadBtnText:'上传图文',uploadTips:'最多上传10个文件，文件格式为.png、.jpg、.jpeg、.pdf，且单文件不超过50M'},
          {name:'附件课时',id:4,uploadBtnText:'上传附件',uploadTips:'最多上传10个附件，且单附件不超过50M'},
        ],
        knowledgeArr:[],
        knowledgeProps: {
          label: 'name',
          children: 'childrens'
        },
        editClassHourObj:null,//需要编辑的课时
        editClassHourId:null,//需要编辑的课时id
        classHourDetailInfo:null,//课时详情
      };
    },
    computed:{
      myImageData(){
        return {type:'plectureImage',org_id:this.party_org_id};
      },
      myFileData(){
        return {type:'plectureFile',org_id:this.party_org_id};
      },
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_course_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
      this.getSelectList();
    },
    methods: {

      /**
       * 验证是否上传文件
       * @param  {[type]}   rule     [description]
       * @param  {[type]}   value    [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      checkFiles(rule, value, callback){
        if (value === '[]') {
          callback(new Error('请上传...'));
        } else {
          callback();
        }
      },
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
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess_covers(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: '上传成功!'});
          // this.form.l_covers = res.data[0].path;
        }else{
          this.$message.error(res.meta.message);
        }

        // let that = JSON.parse(this.form.l_covers);
        // fileList.forEach( function(element, index) {
        //   if(element.response){
        //     let obj = {
        //       id:element.response.data[0].fileId,
        //       name:element.response.data[0].fileName,
        //       url:element.response.data[0].path
        //     }
        //     that.push(obj);
        //   }
        // });
        // this.form.l_covers = JSON.stringify(that);
        this.form.l_covers = JSON.stringify(fileList);
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove_covers(file, fileList) {
        // fileList.length===0 ?  this.form.l_covers = null : '';
        
        // let that = [];
        // fileList.forEach( function(element, index) {
        //   if(element.status==='success'){
        //     let obj = {
        //       id:element.id,
        //       name:element.name,
        //       url:element.url
        //     }
        //     that.push(obj);
        //   }
        // });
        if(file==='file'){
          this.$confirm('是否删除该图片?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.form.l_covers = JSON.stringify(fileList);
          }).catch(() => {}); 
        }else{
          this.form.l_covers = JSON.stringify(fileList);
        }
      },
      /**
       * 限制文件上传个数
       * @param  {[type]} files    [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleExceed_covers(files, fileList) {
        this.$message('如需更改，请先删除后再上传！')
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError_covers(err, file, fileList){
        console.log(err, file, fileList)
        this.$message.error('上传失败!!');
      },
      /**
       * 限制用户上传格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload_covers(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isLt100M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG && !isGIF) {
          this.$message({type:'error',message: '上传文件只能是 .jpeg、.jpg、.png、.gif 格式!',offset:100});
        }
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        return isLt100M && (isJPG || isPNG || isGIF);
      },

      /**
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess_enclosure(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: `${file.name} 上传成功!!`});
        }else{
          this.$message.error(res.meta.message);
        }
        this.drawerform.period_appendix = JSON.stringify(fileList);
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove_enclosure(file, fileList) {
        this.drawerform.period_appendix = JSON.stringify(fileList);
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError_enclosure(err, file, fileList){
        this.$message.error(`${file.name} 上传失败!!`);
      },
      /**
       * 限制文件上传个数
       * @param  {[type]} files    [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleExceed_enclosure(files, fileList) {
        this.$message.warning(`上传的文件超出限制个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件！！！`);
      },
      /**
       * 限制用户上传格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload_enclosure(file) {
        const isLt100M = file.size / 1024 / 1024 < 50;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 50MB!');
        }
        return isLt100M;
      },

      /**
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess_data(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: `${file.name} 上传成功!!`});
        }else{
          this.$message.error(res.meta.message);
        }
        this.drawerform.video_address = JSON.stringify(fileList);
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove_data(file, fileList) {
        this.drawerform.video_address = JSON.stringify(fileList);
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError_data(err, file, fileList){
        if(this.drawerform.period_type === 1 ||this.drawerform.period_type === 2){
          this.$message.error(`上传失败!!`);
        }else{
          this.$message.error(`${file.name} 上传失败!!`);
        }
      },
      /**
       * 限制文件上传个数
       * @param  {[type]} files    [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleExceed_data(files, fileList) {
        if(this.drawerform.period_type === 1 ||this.drawerform.period_type === 2){
          this.$message('如需更改，请先删除后再上传！')
        }else{
          this.$message.warning(`上传的文件超出限制个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件！！！`);
        }
      },
      /**
       * 限制用户上传格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload_data(file) {
        const fileSuffix = file.name.split('.')[1];//文件后缀
        const isLt100M = file.size / 1024 / 1024 < 50;

        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isPDF =  fileSuffix === 'pdf';
        const isMP4 =  fileSuffix === 'mp4';
        const isMP3 =  fileSuffix === 'mp3';

        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 50MB!');
        }

        if(this.drawerform.period_type === 1){//视频
          if (!isMP4) {
            this.$message({type:'error',message: '上传文件只能是 .mp4 格式!',offset:100});
          }
          return isLt100M && isMP4;
        }else if(this.drawerform.period_type === 2){//音频
          if (!isMP3) {
            this.$message({type:'error',message: '上传文件只能是 .mp3 格式!',offset:100});
          }
          return isLt100M && isMP3;
        }else if(this.drawerform.period_type === 3){//图文
          if (!isJPG && !isPNG && !isPDF) {
            this.$message({type:'error',message: '上传文件只能是 .jpeg、.jpg、.png、.pdf 格式!',offset:100});
          }          
          return isLt100M && (isJPG || isPNG || isPDF);
        }else if(this.drawerform.period_type === 4){//附件
          return isLt100M;
        }
      },

      /**
       * 获取课程列表
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTableLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_lecture`,this._serchformParms()).then((response) => {
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
          endTime: this.formInline.dataValue ? this.formInline.dataValue[1] : null,
          startTime: this.formInline.dataValue ? this.formInline.dataValue[0] : null,
          l_title: this.formInline.name,
          l_subject:this.formInline.subject ? String(this.formInline.subject) : null,
          party_org_id:this.party_org_id,
        }
      },
      /**
       * 获取科目的下拉选
       * @return {[type]} [description]
       */
      getSelectList(){
        this.axios.post(`${this.courseCommon.basePath}/knowledge/select_top_subject?id=${this.party_org_id}`).then((response) => {
          this.selecMeuntArr = response.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 获取课程详情信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getDetailInfo(id){
        this.dialogLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_by_id?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.form = response.data;
          this.form.l_can_comment = response.data.l_can_comment===0?true:false;
          this.form.l_can_like = response.data.l_can_like===0?true:false;
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 获取知识点
       * @return {[type]} [description]
       */
      getKnowledgeList(){ 
        this.axios.post(`${this.courseCommon.basePath}/knowledge/select_subject`,{party_org_id:this.party_org_id,}).then((response) => {
          response.data.forEach( function(element, index) {
            !element.parent_id ? element.disabled = true : '';//将顶级（科目）设为禁用状态
          });
          this.knowledgeArr = response.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 获取课时详情信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getClassHourDetailInfo(id){
        this.dialogLoading = false;
        this.axios.post(`${this.courseCommon.basePath}/period/select_period?id=${id}`).then((response) => {
          this.classHourDetailInfo = response.data;
          this.drawerform = response.data;
          this.$refs.knowledgeTree?this.$refs.knowledgeTree.setCheckedKeys(response.data.knowledges.split(',')):'';
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
       * 编辑课程
       * @return {[type]} [description]
       */
      edit(){
        let form = {
          id:this.editId,
          // party_org_code:'1-1',
          party_org_id:this.party_org_id,
          l_title: this.form.l_title,
          l_price:this.form.l_price,
          l_docent: this.form.l_docent,
          l_covers:this.form.l_covers,
          lperiods:this.form.lperiods,
          knowledgeId:this.form.knowledgeId,
          l_keywords:this.form.l_keywords,
          l_can_like: this.form.l_can_like ? 0:1,
          like_score:this.form.like_score,
          l_can_comment: this.form.l_can_comment ? 0:1,
          comment_score:this.form.comment_score,
          error_score:this.form.error_score,
          l_introduction:this.form.l_introduction,
        }
        this.axios.post(`${this.courseCommon.basePath}/lecture/update_lectureinfo`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 添加课程
       * @return {[type]} [description]
       */
      add(){
        let form = {
          // party_org_code:'1-1',
          party_org_id:this.party_org_id,
          l_title: this.form.l_title,
          l_price:this.form.l_price,
          l_docent: this.form.l_docent,
          l_covers:this.form.l_covers,
          lperiods:this.form.lperiods,
          knowledgeId:this.form.knowledgeId,
          l_keywords:this.form.l_keywords,
          l_can_like: this.form.l_can_like ? 0:1,
          like_score:this.form.like_score,
          l_can_comment: this.form.l_can_comment ? 0:1,
          comment_score:this.form.comment_score,
          error_score:this.form.error_score,
          l_introduction:this.form.l_introduction,
        }
        this.axios.post(`${this.courseCommon.basePath}/lecture/create_lecture`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 提交添加或编辑课时的表单（分为两种情况:1.新增课程时添加/编辑课时,通过js实现，2.在原有课程基础上添加/编辑课时,通过api实现。）
       */
      submitClassHour(formName){
        this.drawerform.knowledges = this.$refs.knowledgeTree.getCheckedKeys();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              fk_lecture_id:this.drawerform.fk_lecture_id,//党课ID（新增课程时，添加课时不需要传课程id；在已有党课基础上，添加课时需要传课程id）
              period_title:this.drawerform.period_title,
              period_type:this.drawerform.period_type,//课时可以分为视频课时(1)、音频课时(2)、图文课时(3)和附件课时(4)
              video_address:this.drawerform.video_address,//课时资料文件地址
              period_hours:this.drawerform.period_hours,
              period_score:this.drawerform.period_score,
              period_introduction:this.drawerform.period_introduction,
              knowledges:this.drawerform.knowledges.join(','),//知识点 
              period_appendix:this.drawerform.period_appendix,//党课课时学习资料附件：多个附件按json串存储到该属性
            }
            if(this.dialogType===1){//新增课程过程中，添加课时...（js实现）
              if(this.drawerType===1){//添加课时
                this.form.lperiods.push(form);
                
                let arr = this.form.lperiods;
                let newarr = [];
                arr.forEach( function(element, index) {
                  newarr = newarr.concat(element.knowledges.split(','));
                });
                let numarr = []
                this._unique(newarr).forEach( function(element, index) {
                  numarr.push(Number(element))
                });
                this.form.knowledgeId = numarr;
              }else{//编辑课时
                this.form.lperiods.splice(this.form.lperiods.indexOf(this.editClassHourObj), 1 , form);

                let arr = this.form.lperiods;
                let newarr = [];
                arr.forEach( function(element, index) {
                  newarr = newarr.concat(element.knowledges.split(','));
                });
                let numarr = []
                this._unique(newarr).forEach( function(element, index) {
                  numarr.push(Number(element))
                });
                this.form.knowledgeId = numarr;
              }
              
              this.drawer = false;
            }else{//在已有课程的基础上，添加课时（api实现）
              if(this.drawerType===1){//添加课时
                this.axios.post(`${this.courseCommon.basePath}/period/add_period`,form).then((response) => {
                  this.$message({type: 'success',message: '成功!'});
                  this.drawer = false;
                  this.getDetailInfo(form.fk_lecture_id);//刷新         
                }).catch((error) => {
                  this.$message.error(error);
                });
              }else{//编辑课时
                form.id = this.editClassHourId;
                this.axios.post(`${this.courseCommon.basePath}/period/edit_period`,form).then((response) => {
                  this.$message({type: 'success',message: '成功!'});
                  this.drawer = false;
                  this.getDetailInfo(form.fk_lecture_id);//刷新
                }).catch((error) => {
                  this.$message.error(error);
                });
              }
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 简单数组去重
       * @param  {[type]} arr [需去重的数组]
       * @return {[type]}     [description]
       */
      _unique(arr){
        var hash=[];
        for (var i = 0; i < arr.length; i++) {
           if(hash.indexOf(arr[i])==-1){
            hash.push(arr[i]);
           }
        }
        return hash;
      },
      /**
       * 删除课时按钮与删除课时
       */
      delClassHour(data) {
        if(this.dialogType===1){//新增课程过程中，删除课时...（js实现）
          this.$confirm('是否删除该课时?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.form.lperiods.splice(this.form.lperiods.indexOf(data), 1);

            let arr = this.form.lperiods;
            let newarr = [];
            arr.forEach( function(element, index) {
              newarr = newarr.concat(element.knowledges.split(','));
            });
            let numarr = []
            this._unique(newarr).forEach( function(element, index) {
              numarr.push(Number(element))
            });
            this.form.knowledgeId = numarr;
          }).catch(() => {}); 
        }else{//删除已有课程的课时（api实现）
          this.$confirm('是否删除该课时?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.axios.post(`${this.courseCommon.basePath}/period/delete_period?pid=${data.id}`).then((response) => {
              this.getDetailInfo(this.drawerform.fk_lecture_id);//刷新
              this.$message({type: 'success',message: '成功!'});
            }).catch((error) => {
              this.$message.error(error);
            });
          }).catch(() => {});    
        }
      },
      /**
       * 编辑课时按钮
       */
      editClassHour(data){
        if(this.dialogType===1){//新增课程过程中，编辑课时...（js实现）
          this.getKnowledgeList();
          this.drawerType=2;
          // this.$refs['drawerform'] ? this.$refs['drawerform'].resetFields():'';
          this.drawer = true;
          this.editClassHourObj = data;//需要编辑的课时
          this.$refs.knowledgeTree?this.$refs.knowledgeTree.setCheckedKeys(data.knowledges.split(',')):'';
          this.drawerform = data;
        }else{//编辑已有课程的课时（api实现）
          this.getKnowledgeList();
          this.drawerType=2;
          this.$refs['drawerform'] ? this.$refs['drawerform'].resetFields():'';
          this.drawer = true;
          this.editClassHourId = data.id;//需要编辑的课时
          this.getClassHourDetailInfo(data.id);
        }
      },

      /**
       * 删除课程按钮
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      delBtn(id) {
        this.$confirm('是否删除该课程?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.del(id);
        }).catch(() => {});    
      },
      /**
       * 删除课程
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      del(id){
        this.axios.post(`${this.courseCommon.basePath}/lecture/delete_lecture?id=${id}`).then((response) => {
          this.getList();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      
     
    }
  }
</script>
<style lang="less" scoped>
   .course-manage{
      
   }
</style>