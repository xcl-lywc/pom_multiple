/**************************************
*---------------------题库（题库、试题篮、题库列表）-----------*
***************************************/
<template>
  <div class="item-bank" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header height="">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="学科" prop="subject">
            <el-select v-model="formInline.subject" placeholder="请选择学科" clearable @clear="formInline.subject = null" @focus="selecMeuntArr.length==0 ? getSelectList() : ''">
              <el-option v-for="(item,index) in selecMeuntArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="知识点" prop="knowledge">
            <el-input v-model="formInline.knowledge" clearable placeholder="知识点" @change="elementPageData.pageNum = 1;formInline.knowledge = $event;getList();" @clear="formInline.knowledge = null"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
          <div class="fr">
            <el-button type="success" size="small" @click="dialogType=1;$refs.knowledgeTree?$refs.knowledgeTree.setCheckedKeys([]):'';$refs['form'] ? $refs['form'].resetFields():'';form.paperQuesAnswersDtos=[{content:null,exactness:true}];form.radio=0;dialogVisible=true;getTree();">添加习题</el-button>
            <el-button type="success" size="small" @click="$message('暂无api')">导入习题</el-button>
          </div>
        </el-form>
      </el-header>
      <el-main>
        <div class="list-area" v-loading="isListLoading">
          <div class="overflow-hidden" v-if="listData.total>0">
            <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in listData.rows" :key="index">
              <div slot="header" class="overflow-hidden">
                <span class="fl ellipsis" style="width:calc(100% - 300px)">{{index+1}}. {{item.content}}？</span>
                <el-button-group class="w250 fr">
                  <el-button type="primary" size="small" icon="el-icon-edit" @click="editId=item.id;dialogType=2;$refs.knowledgeTree?$refs.knowledgeTree.setCheckedKeys([]):'';$refs['form'] ? $refs['form'].resetFields():'';form.paperQuesAnswersDtos=[{content:null,exactness:true}];form.radio=0;dialogVisible=true;getTree();getDetailInfo(item.id);">编辑</el-button>
                  <el-button type="success" size="small" icon="el-icon-plus" @click="addToBaseket(item)">试题篮</el-button>
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="del(item)">删除</el-button>
                </el-button-group>
              </div>
              <div>
                <el-row :gutter="20" class="options">
                  <el-col :span="16">
                    <div class="text">
                      <!-- 选择题 -->
                      <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                        {{studyCommon.conversionABCD(o)}}. {{i.content}}
                      </div>
                      <!-- 简答题（即简答题答案） -->
                      <div class="simple-problem" v-if="item.type===3">
                        {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="img item-bank-cover" v-if="item.picture">
                      <el-image
                      style="width: 200px; "
                      :src="item.picture"
                      fit="cover"></el-image>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="info">
                  <el-col :span="4">
                    <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div>创建人：{{item.creator_name}}</div>
                  </el-col>
                  <el-col :span="6">
                    <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                  </el-col>
                  <el-col :span="4">
                    <div>分值：{{item.score}} 分</div>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="isShow!=item.id" type="" size="mini" @click="isShow=item.id">查看解析</el-button>
                    <el-button v-if="isShow==item.id" type="" size="mini" @click="isShow=null">收起解析</el-button>
                    <el-button type="" size="mini" @click="elementPageData.pageNum = 1;elementPageData.pageSize = 5;getProblemList(item.knowledges.split(',').map(Number));ids=item.knowledges.split(',').map(Number);drawer=true;">相关习题</el-button>
                  </el-col>
                </el-row>
                <el-card class="box-card mart10" shadow="hover" v-if="isShow==item.id">
                  <el-form ref="showform" label-width="100px" class="showform">
                    <!-- 只有选择题才有答案 -->
                    <el-form-item label="正确答案：" v-if="item.type!=3">
                      <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                        <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                      </div>
                    </el-form-item>
                    <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                  </el-form>
                </el-card>
              </div>
            </el-card>
          </div>
          <div v-else class="no-data background-fff">  
            暂无数据
          </div>
        </div>
      </el-main>
      <el-footer>
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange($event,'list')"
          @current-change="handleCurrentChange($event,'list')"
          :current-page="elementPageData.pageNum_s"
          :page-sizes="elementPageData.defaultData.pageSizes_s"
          :page-size="elementPageData.defaultData.pageSizeDefault_s"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listData.total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 弹框 -->
    <el-dialog 
      :title="dialogType===1 ? '添加习题' : '编辑习题（纠错）' " 
      :visible.sync="dialogVisible" 
      top="5vh"
      width='950px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="overflow-hidden">
              <el-form-item 
                label="习题知识点" 
                prop="knowledges" 
                :rules="[{ required: true, message: '请选择习题知识点', trigger: 'blur' }]">
                <el-tree
                  :props="knowledgeProps"
                  :data="knowledgeArr"
                  node-key="id"
                  show-checkbox
                  :expand-on-click-node="true"
                  :check-on-click-node = 'true'
                  ref="knowledgeTree">
                  <span class="my_custom-tree-node" slot-scope="{ node, data }">
                    <i class="fa marr10" :class="{'fa-bookmark':!data.parent_id,'fa-bookmark-o':data.parent_id}" aria-hidden="true"></i><span :class="{'font-weight-600':!data.parent_id}">{{ data.name }}</span>
                  </span>
                </el-tree>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="overflow-hidden">
              <el-form-item 
                label="习题题干" 
                prop="content" 
                :rules="[{ required: true, message: '请输入习题题干', trigger: 'blur' }]">
                <el-input v-model="form.content" class=""></el-input>
              </el-form-item>
              <el-form-item 
                label="习题图片" 
                prop="picture"
                label-position="top"
                :rules="[{ required: false, message: '请选择要上传的图片', trigger: 'blur' }]">
                <el-upload
                  class=""
                  :action="`${common.basePath}/user/file/upload`"
                  :headers="myHeaders"
                  name="file"
                  :show-file-list="false"
                  :data="myImageData"
                  :on-success="handleSuccess_covers"
                  :on-error="handleError_covers"
                  :before-upload="beforeUpload_covers">
                  <div class="overflow-hidden text-left">
                    <el-button size="small" type="primary">上传图片</el-button>
                    <span slot="tip" class="el-upload__tip marl10">图片大小不能超过2M</span>
                  </div>
                  <div class="img item-bank-cover" v-if="form.picture">
                    <el-image
                    :src="form.picture"
                    fit="cover"></el-image>
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item 
                label="习题类型" 
                prop="type"
                :rules="[{ required: true, message: '请选择习题类型', trigger: 'blur' }]">
                <el-radio-group v-model="form.type" @change="dialogType===1?form.paperQuesAnswersDtos=[{content:null,exactness:true}]:'';dialogType===1?form.radio=0:''" :disabled="dialogType===2">
                  <el-radio :label="1">单选题</el-radio>
                  <el-radio :label="2">多选题</el-radio>
                  <el-radio :label="3">简答题</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 多选题 -->
              <el-form-item 
                v-if="form.type===2"
                label="习题选项" 
                prop="paperQuesAnswersDtos"
                :rules="[{ required: true, message: '请添加习题选项', trigger: 'blur' }]">
                <div class="marb10" v-for="(answerItem,answerIndex) in form.paperQuesAnswersDtos" :key="answerIndex">
                  <el-input v-model="answerItem.content" class="w300"></el-input>
                  <el-checkbox v-model="answerItem.exactness" class="marl10 marr20">设为正确答案</el-checkbox>
                  <el-button type="danger" size="mini" @click="form.paperQuesAnswersDtos.splice(answerIndex, 1);">删除</el-button>
                </div>
                <el-button type="success" size="mini" @click="form.paperQuesAnswersDtos.push({content:null,exactness:false})">添加选项</el-button>
              </el-form-item>
              <!-- 单选题 -->
              <el-form-item 
                v-if="form.type===1"
                label="习题选项" 
                prop="paperQuesAnswersDtos"
                :rules="[{ required: true, message: '请添加习题选项', trigger: 'blur' }]">
                <div class="marb10" v-for="(answerItem,answerIndex) in form.paperQuesAnswersDtos" :key="answerIndex">
                  <el-input v-model="answerItem.content" class="w300"></el-input>
                  <el-radio v-model="form.radio" :label="answerIndex" class="marl10 marr20">设为正确答案</el-radio>
                  <el-button type="danger" size="mini" @click="form.paperQuesAnswersDtos.splice(answerIndex, 1);">删除</el-button>
                </div>
                <el-button type="success" size="mini" @click="form.paperQuesAnswersDtos.push({content:null,exactness:false})">添加选项</el-button>
              </el-form-item>
              <!-- 简答题 -->
              <el-form-item 
                v-if="form.type===3"
                label="习题简答" 
                prop="paperQuesAnswersDtos[0].content"
                :rules="[{ required: true, message: '请输入习题的简答答案', trigger: 'blur' },
                { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
                <el-input type="textarea" v-model="form.paperQuesAnswersDtos[0].content" rows="5"></el-input>
              </el-form-item>
              <el-form-item 
                label="习题分值" 
                prop="score"
                :rules="[{ required: true, message: '请输入习题分值', trigger: 'blur' }]">
                <el-input-number v-model="form.score" :min="0"></el-input-number>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item 
          label="习题解析" 
          prop="analysis"
          :rules="[{ required: false, message: '请输入习题解析', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.analysis" rows="5"></el-input>
        </el-form-item>
        <el-form-item 
          label="习题备注" 
          prop="description"
          :rules="[{ required: false, message: '请输入习题备注', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.description" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();$refs.knowledgeTree.setCheckedKeys([]);form.paperQuesAnswersDtos=[{content:null,exactness:true}];form.radio=0;" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">保 存</el-button>
      </div>
    </el-dialog>
    <!-- drawer -->
    <el-drawer
      title="相关习题列表"
      :visible.sync="drawer"
      ref="drawer"
      :modal="true"
      :close-on-press-escape = "false"
      :wrapperClosable = 'true'
      size="75%"
      custom-class = 'costom-deawer-style'
      @close="elementPageData.pageNum = 1;elementPageData.pageSize = 5;"
      :direction="direction">
      <div class="demo-drawer__content">
        <div class="drawer-list-area" v-loading="isDrawerLoading">
          <div class="overflow-hidden" v-if="relatedProblem.total>0">
            <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in relatedProblem.rows" :key="index">
              <div slot="header" class="overflow-hidden">
                <span class="fl ellipsis" style="width:calc(100% - 300px)">{{index+1}}. {{item.content}}？</span>
                <!-- <el-button-group class="w250 fr">
                  <el-button type="primary" size="small" icon="el-icon-edit" @click="dialogType=2;$refs.knowledgeTree?$refs.knowledgeTree.setCheckedKeys([]):'';$refs['form'] ? $refs['form'].resetFields():'';form.paperQuesAnswersDtos=[{content:null,exactness:true}];form.radio=0;dialogVisible=true;getTree();">编辑</el-button>
                  <el-button type="success" size="small" icon="el-icon-plus">试题篮</el-button>
                  <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
                </el-button-group> -->
              </div>
              <div>
                <el-row :gutter="20" class="options">
                  <el-col :span="16">
                    <div class="text">
                      <!-- 选择题 -->
                      <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                        {{studyCommon.conversionABCD(o)}}. {{i.content}}
                      </div>
                      <!-- 简答题（即简答题答案） -->
                      <div class="simple-problem" v-if="item.type===3">
                        {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="img item-bank-cover" v-if="item.picture">
                      <el-image
                      style="width: 200px; "
                      :src="item.picture"
                      fit="cover"></el-image>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="info">
                  <el-col :span="4">
                    <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div>创建人：{{item.creator_name}}</div>
                  </el-col>
                  <el-col :span="6">
                    <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                  </el-col>
                  <el-col :span="4">
                    <div>分值：{{item.score}} 分</div>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="isShow_!=item.id" type="" size="mini" @click="isShow_=item.id">查看解析</el-button>
                    <el-button v-if="isShow_==item.id" type="" size="mini" @click="isShow_=null">收起解析</el-button>
                    <!-- <el-button type="" size="mini" @click="getProblemList(item.knowledges.split(',').map(Number))">相关习题</el-button> -->
                  </el-col>
                </el-row>
                <el-card class="box-card mart10" shadow="hover" v-if="isShow_==item.id">
                  <el-form ref="showform" label-width="100px" class="showform">
                    <!-- 只有选择题才有答案 -->
                    <el-form-item label="正确答案：" v-if="item.type!=3">
                      <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                        <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                      </div>
                    </el-form-item>
                    <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                  </el-form>
                </el-card>
              </div>
            </el-card>
          </div>
          <div v-else class="no-data background-fff">  
            暂无数据
          </div>
        </div>
      </div>
      <div class="demo-drawer__footer text-right marr20 padt20">
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange($event,'relatedProblem')"
          @current-change="handleCurrentChange($event,'relatedProblem')"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes_s"
          :page-size="elementPageData.defaultData.pageSizeDefault_s"
          layout="total, sizes, prev, pager, next, jumper"
          :total="relatedProblem.total">
        </el-pagination>
      </div>
    </el-drawer>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},
        isLoading:false,
        isListLoading:false,
        elementPageData: { //分页需要的数据
          defaultData:  this.studyCommon.elementPagination,
          pageNum:      this.studyCommon.elementPagination.pageNumDefault_s,
          pageSize:     this.studyCommon.elementPagination.pageSizeDefault_s,
        },
        formInline: {
          subject: null,
          knowledge:null,
        },
        selecMeuntArr:[],//选择框的下拉选数组集合
        listData:{rows:[],total:0},//列表数据
        isShow:null,//是否展示解析（用于题库）
        isShow_:null,//是否展示解析(用于相关习题)
        
        
        //dialog
        dialogVisible: false,
        dialogType:1,//1添加，2编辑
        dialogLoading:false,
        form: {
          knowledges:'',
          content: null,
          picture:null,
          type:1,
          paperQuesAnswersDtos:[
            {content:null,exactness:true},
          ],
          score:0,
          analysis:null,
          description:null,
          // num:null,
          radio: 0,//用于单选题
        },
        knowledgeArr:[],//知识树
        knowledgeProps: {
          label: 'name',
          children: 'childrens'
        },
        formLabelWidth: '100px',
        editId:null,//编辑表单的id
        detailInfo:null,//课程详情
        
        //drawer
        drawer:false,
        isDrawerLoading:false,
        direction: 'ltr',
        relatedProblem:{rows:[],total:0},//相关习题
        ids:[],//相关知识点id数组
      };
    },
    computed:{
      myImageData(){
        return {type:'examImage',org_id:this.party_org_id};
      },
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_exam_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
    },
    methods: {

      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val,type) {
        this.elementPageData.pageSize = val;
        if(type==='list'){
          this.getList();
        }else{
          this.getProblemList(this.ids);
        }
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val,type) {
        this.elementPageData.pageNum = val;
        if(type==='list'){
          this.getList();
        }else{
          this.getProblemList(this.ids);
        }
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
          this.form.picture = res.data[0].path;
        }else{
          this.$message.error(res.meta.message);
        }
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError_covers(err, file, fileList){
        this.form.picture = null;
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
       * 获取题库
       * @return {[type]} [description]
       */
      getList(){ 
        this.isListLoading = true;
        this.axios.post(`${this.examCommon.basePath}/paper_questions/find_question`,this._serchformParms()).then((response) => {
          this.listData = response.data ? response.data:({rows:[],total:0});
          this.isListLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isListLoading = false;
        });
      },
      _serchformParms(){
        return{
          id:this.formInline.subject,
          name:this.formInline.knowledge,
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
        }
      },
      /**
       * 获取科目的下拉选
       * @return {[type]} [description]
       */
      getSelectList(){
        this.axios.post(`${this.examCommon.basePath}/knowledge/select_top_subject?id=${this.party_org_id}`).then((response) => {
          this.selecMeuntArr = response.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 获取学科知识点树
       * @return {[type]} [description]
       */
      getTree(){ 
        this.dialogLoading = true;
        this.axios.post(`${this.examCommon.basePath}/knowledge/select_subject`,this._treeParms()).then((response) => {
          response.data.forEach( function(element, index) {
            !element.parent_id ? element.disabled = true : '';//将顶级（科目）设为禁用状态
          });
          this.knowledgeArr = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      _treeParms(){
        return{
          id: null,
          party_org_id:this.party_org_id,
        }
      },
      /**
       * 查询知识点相关的习题
       * @return {[type]} [description]
       */
      getProblemList(ids){ 
        this.isDrawerLoading = true;
        this.axios.post(`${this.examCommon.basePath}/paper_questions/select_questions`,this._listProblemParms(ids)).then((response) => {
          this.relatedProblem = response.data ? response.data:({rows:[],total:0});
          this.isDrawerLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isDrawerLoading = false;
        });
      },
      _listProblemParms(ids){
        let problemParmsObj = {
          ids:ids,
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
        }
        return problemParmsObj;
      },
      /**
       * 获取详情信息
       * @param  {[type]} id [description]
       */
      getDetailInfo(id){
        let that = this;
        this.axios.post(`${this.examCommon.basePath}/paper_questions/find_question_info?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.form = response.data;
          this.$refs.knowledgeTree?this.$refs.knowledgeTree.setCheckedKeys(response.data.knowledges.split(',')):'';//知识点
          if(response.data.type===1){//单选
            response.data.paperQuesAnswersDtos.forEach( function(element, index) {
              element.exactness ? that.form.radio = index : '';
            });
          }
        }).catch((error) => {
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
        this.form.knowledges = this.$refs.knowledgeTree.getCheckedKeys();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type === 2 ? this.edit() : this.add();
          } else {
            return false;
          }
        });
      },
      /**
       * 添加习题
       * @param {[type]} data [description]
       */
      add(){
        let that = this;
        if(this.form&&this.form.type===1){//单选
          this.form.paperQuesAnswersDtos.forEach( function(element, index) {
            index===that.form.radio ? element.exactness = true : element.exactness = false;
          });
        }
        let form = {
          analysis: this.form.analysis,
          content: this.form.content,
          description: this.form.description,
          knowledges:this.form.knowledges.join(','),
          paperQuesAnswersDtos: this.form.paperQuesAnswersDtos,
          picture: this.form.picture,
          score: this.form.score,
          type: this.form.type,
        }
        this.axios.post(`${this.examCommon.basePath}/paper_questions/add_question`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });  
      },
      /**
       * 编辑习题
       * @param {[type]} data [description]
       */
      edit(){
        let that = this;
        if(this.form&&this.form.type===1){//单选
          this.form.paperQuesAnswersDtos.forEach( function(element, index) {
            index===that.form.radio ? element.exactness = true : element.exactness = false;
          });
        }
        let form = {
          id:this.editId,
          analysis: this.form.analysis,
          content: this.form.content,
          description: this.form.description,
          knowledges:this.form.knowledges.join(','),
          paperQuesAnswersDtos: this.form.paperQuesAnswersDtos,
          picture: this.form.picture,
          score: this.form.score,
          type: this.form.type,
        }
        this.axios.post(`${this.examCommon.basePath}/paper_questions/edit_question`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 删除习题
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      del(data){
        this.$confirm('是否删除该习题?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.examCommon.basePath}/paper_questions/delete_question?id=${data.id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});  
      },
      /**
       * 添加习题到试题篮
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      addToBaseket(data){
        this.$confirm('是否添加该习题到试题篮中?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.examCommon.basePath}/paper_questions/add_baseket?id=${data.id}`).then((response) => {
            // this.getList();//刷新
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
  .item-bank{
    .problem-bank{
      .options{
        .text{
          .change-problem{
          
          }
          .simple-problem{

          }
        }
        .img{

        }
      }
      .info{
        font-size:14px;
        color:#666;
        margin:10px 0;
      }
      
    }
  }


  .drawer-list-area{
    background:#f1f1f1;
    .problem-bank{
      .options{
        .text{
          .change-problem{
          
          }
          .simple-problem{

          }
        }
        .img{

        }
      }
      .info{
        font-size:14px;
        color:#666;
        margin:10px 0;
      }
      
    }
  }
</style>