/**************************************
*---------------------党课学习-----------*
***************************************/
<template>
  <el-container class="learn-party-class" v-loading="isLoading" ref="">
    <el-header class="header-breadcrumb">
      <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-nav">
          <el-breadcrumb-item :to="{ path: '/course_courselearn' }">课程列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/course_courselearn/coursedetail/${detailId}` }">课程详情</el-breadcrumb-item>
          <el-breadcrumb-item>党课学习</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-header>
    <el-main class="main-container" v-if="detailInfo&&periodDetailInfo">
      <el-card class="box-card">
        <div class="top-bar">
          <div class="bar-left fl">
            {{periodDetailInfo.period_title ? periodDetailInfo.period_title : '暂无数据'}}
          </div>
          <div class="bar-right fr">
            <span class="fl">时长：{{periodDetailInfo.period_hours+'小时'}}，积分：{{periodDetailInfo.period_score+'分'}}</span>
          </div>
        </div>
        <div class="video-bar cover-bar">
          <!-- 视频课时 -->
          <video width="100%" height="400" controls :src="periodDetailInfo.video_address ? JSON.parse(periodDetailInfo.video_address)[0].response.data[0].path : ''" v-if="periodDetailInfo.period_type===1">
            您的浏览器不支持视频。
          </video>
          <!-- 音频课时 -->
          <audio width="100%" height="400" controls :src="periodDetailInfo.video_address ? JSON.parse(periodDetailInfo.video_address)[0].response.data[0].path : ''" v-if="periodDetailInfo.period_type===2">
            您的浏览器不支持音频。
          </audio>
          <!-- 图文课时 -->
          <div v-if="periodDetailInfo.video_address&&periodDetailInfo.period_type===3" class="overflow-hidden">
            <div v-for="itemImg in JSON.parse(periodDetailInfo.video_address)">
              <el-image
                style="width: 50%;"
                :src="itemImg.response.data[0].path"
                fit="fill">
              </el-image>
            </div>
          </div>
          <!-- 附件课时 -->
          <div v-if="periodDetailInfo.video_address&&periodDetailInfo.period_type===4" class="overflow-hidden">
            <div v-for="itemImg in JSON.parse(periodDetailInfo.video_address)" class="overflow-hidden enclosure-class-hour">
              <i class="el-icon-folder-opened fl"></i>
              <a
                class="fl"
                :href="itemImg.response.data[0].path"
                download
                title="点击下载查看"
                target="_blank">
                {{itemImg.response.data[0].fileName}}
              </a>
            </div>
            
          </div>
        </div>
        <div class="tabs-bar">
          <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
            <el-tab-pane label="相关习题" name="exercises">
              <div class="overflow-hidden" v-if="exercisesList.length>0">
                <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in exercisesList" :key="index">
                  <div slot="header" class="overflow-hidden">
                    <span>{{index+1}}. {{item.content}}？</span>
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
                    <el-row :gutter="20" class="info" style="font-size:14px;color:#666;margin:10px 0;">
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
              <div v-else class="no-data">  
                暂无数据
              </div>
              <div class="fill-width overflow-hidden">
                <el-pagination
                  class="fr mart10"
                  @size-change="handleSizeChange($event,'exercises')"
                  @current-change="handleCurrentChange($event,'exercises')"
                  :current-page="elementPageData.pageNum"
                  :page-sizes="elementPageData.defaultData.pageSizes"
                  :page-size="elementPageData.defaultData.pageSizeDefault"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="exercisesTotal">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="问答" name="questions-answers">
              <el-collapse v-if="QA.length>0" @change="handleChangeCollapse" accordion>
                <el-collapse-item v-for="(qitem,qindex) in QA" :key="qindex" :name="qitem.id">
                  <template slot="title">
                    <div class="q-item">
                      <el-avatar size="small" :src="qitem.creator_pic" class="fl mart10"></el-avatar>
                      <div class="q-a-item-text fl">
                        <span class="marl5">{{qitem.creator_name}}</span>
                        <span class="marl10">问：{{qitem.content}}</span>
                        <!-- <i class="el-icon-edit font-color-primary marl5 cursor-pointer" @click="dialogType=1;$refs['qaform'] ? $refs['qaform'].resetFields():'';qaDialogVisible = true;"></i> -->
                        <el-popover
                          placement="top-end"
                          width="400"
                          trigger="click">
                          <el-image
                            :src="qitem.picture">
                          </el-image>
                          <i v-if="qitem.picture" slot="reference" class="el-icon-picture font-color-success marl5 cursor-pointer" title="该问题的图片描述"></i>
                        </el-popover>
                      </div>
                    </div>
                  </template>
                  <div class="a-item mart10 marl20" v-if="qitem.lQuestionsAnswers.length>0">
                    <div v-for="(aitem,aindex) in qitem.lQuestionsAnswers" :key="aindex">
                      <div class="overflow-hidden marb5" v-if="aindex+1<=showAnswerNum&&aitem.l_question_id===showQuestionId">
                        <el-avatar size="small" :src="aitem.creator_pic" class="fl"></el-avatar>
                        <div class="q-a-item-text fl">
                          <span class="marl5">{{aitem.creator_name}}</span>
                          <span class="marl10">答：{{aitem.content}} </span>
                          <i class="el-icon-edit font-color-primary marl5 cursor-pointer" @click="questionId=qitem.id;answerId=aitem.id;dialogType=2;$refs['qaform'] ? $refs['qaform'].resetFields():'';qaDialogVisible = true;"></i>
                          <i class="el-icon-delete font-color-danger marl5 cursor-pointer" @click="questionId=qitem.id;answerId=aitem.id;delAnswers();"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-data">暂无数据，快去回答问题吧...</div>
                  <el-breadcrumb separator="/" class="mart10 marl20">
                    <el-breadcrumb-item>共{{qitem.lQuestionsAnswers.length}}个回答</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="qitem.lQuestionsAnswers.length>1">
                      <a v-show="showAnswerNum==1" @click="showAnswerNum=qitem.lQuestionsAnswers.length;showQuesId=qitem.id">更多</a>
                      <a v-show="showAnswerNum!=1" @click="showAnswerNum=1;showQuesId=qitem.id">收起</a>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item><a @click="questionId=qitem.id;dialogType=0;$refs['qaform'] ? $refs['qaform'].resetFields():'';qaDialogVisible = true;">解答</a></el-breadcrumb-item>
                    <el-breadcrumb-item>共{{qitem.browseNum}}人浏览</el-breadcrumb-item>
                    <el-breadcrumb-item>{{qitem.day_ago}}天前</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-collapse-item>
              </el-collapse>
              <div v-else class="no-data">暂无数据</div>
              <div class="fill-width overflow-hidden" v-if='QATotal>0'>
                <el-pagination
                  class="fr mart10 marb10"
                  @size-change="handleSizeChange($event,'QA')"
                  @current-change="handleCurrentChange($event,'QA')"
                  :current-page="elementPageData.pageNum"
                  :page-sizes="elementPageData.defaultData.pageSizes"
                  :page-size="elementPageData.defaultData.pageSizeDefault"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="QATotal">
                </el-pagination>
              </div>              
              <div class="overflow-hidden marb10 text-right">
                <el-button type="primary" size="mini" @click="dialogType=3;$refs['qaform'] ? $refs['qaform'].resetFields():'';qaDialogVisible = true;">去 提 问</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="评论" name="comment">
              <div v-if="commentList.length>0" class="overflow-hidden">
                <el-card class="box-card mart10" v-for="(item,index) in commentList" :key="index">
                  <div class="conmment-box">
                    <div class="info">
                      <el-avatar size="small" :src="item.creator_pic" class="fl"></el-avatar>
                      <span class="info-text fl mart5">{{item.creator_name+' '}} {{' '+common._convertDate(item.create_time , 'yyyy/MM/dd hh:mm')}}</span>
                      <i class="el-icon-delete cursor-pointer font-color-danger fr" @click="delComment(item.id)"></i>
                    </div>
                    <div class="comment">{{item.description}}</div>
                  </div>
                </el-card>
              </div>
              <div v-else class="no-data">暂无数据</div>
              <div class="fill-width overflow-hidden" v-if='commentTotal>0'>
                <el-pagination
                  class="fr mart10 marb10"
                  @size-change="handleSizeChange($event,'comment')"
                  @current-change="handleCurrentChange($event,'comment')"
                  :current-page="elementPageData.pageNum"
                  :page-sizes="elementPageData.defaultData.pageSizes"
                  :page-size="elementPageData.defaultData.pageSizeDefault"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="commentTotal">
                </el-pagination>
              </div>
              <el-form 
                class="mart10"
                v-if="detailInfo.l_can_comment===0"
                :model="commentform" 
                ref="commentform"
                label-width="0">
                <el-form-item 
                  prop="description"
                  :rules="[{ required: true, message: '请评论点什么吧', trigger: 'blur' },
                  { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
                  <el-input type="textarea" placeholder = "请评论点什么吧" v-model="commentform.description" rows="5"></el-input>
                </el-form-item>
              </el-form>
              <div class="comment-btn" v-if="detailInfo.l_can_comment===0">
                <el-button type="primary" @click="publishComment('commentform',detailInfo.id)" size="small">发表评论</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="笔记" name="note">
              <div class="overflow-hidden">
                <el-switch
                  @change="switchChange"
                  class="mart10 fr"
                  v-model="noteValue"
                  active-text="我的"
                  inactive-text="全部">
                </el-switch>
              </div>
              <div v-if="noteTotal>0" class="overflow-hidden">
                <el-card class="box-card mart10" v-for="(noteitem,index) in noteList" :key="index">
                  <div class="conmment-box mart10">
                    <div class="info">
                      <el-avatar size="small" :src="noteitem.creator_pic" class="fl"></el-avatar>
                      <span class="info-text fl mart5">{{noteitem.creator_name+' '}} {{' '+common._convertDate(noteitem.create_time , 'yyyy/MM/dd hh:mm')}}</span>
                      <i class="el-icon-delete cursor-pointer font-color-danger fr" @click="delNote(noteitem.id)"></i>
                    </div>
                    <div class="comment show-text-3" :class="{'show-text-3':showNoteId!=noteitem.id,'show-text-all':showNoteId==noteitem.id}">{{noteitem.content}}</div>
                    <el-breadcrumb separator="/" class="mart10">
                      <el-breadcrumb-item v-if="">
                        <a v-if="showNoteId!=noteitem.id" @click="showNoteId=noteitem.id">{{'展开'}}</a>
                        <a v-if="showNoteId==noteitem.id" @click="showNoteId=null">{{'收起'}}</a>
                      </el-breadcrumb-item>
                      <el-breadcrumb-item>{{noteitem.day_ago}}天前</el-breadcrumb-item>
                    </el-breadcrumb>
                  </div>
                </el-card>
              </div>
              <div v-else class="no-data">暂无数据</div> 
              <div class="fill-width overflow-hidden" v-if='noteTotal>0'>
                <el-pagination
                  class="fr mart10 marb10"
                  @size-change="handleSizeChange($event,'note')"
                  @current-change="handleCurrentChange($event,'note')"
                  :current-page="elementPageData.pageNum"
                  :page-sizes="elementPageData.defaultData.pageSizes"
                  :page-size="elementPageData.defaultData.pageSizeDefault"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="noteTotal">
                </el-pagination>
              </div>
              <el-form 
                class="mart10"
                :model="noteform" 
                ref="noteform"
                label-width="0">
                <el-form-item 
                  prop="note"
                  :rules="[{ required: true, message: '请输入笔记', trigger: 'blur' },
                  { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
                  <el-input type="textarea" placeholder = "请输入笔记" v-model="noteform.note" rows="5"></el-input>
                </el-form-item>
              </el-form>
              <div class="comment-btn">
                <el-button type="primary" @click="publishNote('noteform')" size="small">提交笔记</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </el-main>
    <el-main class="no-data main-container" v-else><el-card class="box-card">暂无数据</el-card></el-main>
    <el-footer v-if="detailInfo&&periodDetailInfo">
      <el-card class="box-card footer-container"> 
        <!-- 收藏 -->
        <i v-if="!detailInfo.collect||detailInfo.collect===0" class="el-icon-star-off cursor-pointer font-size-20 font-color-danger" @click="collect(detailInfo.id)" title="收藏党课"></i>
        <i v-if="detailInfo.collect&&detailInfo.collect!=0" class="el-icon-star-on cursor-pointer font-size-20 font-color-danger" @click="cancelCollect(detailInfo.id)" title="取消收藏"></i>
        <span class="span">收藏</span>
        <!-- 点赞 -->
        <i v-if="detailInfo.llike&&detailInfo.llike!=0" class="fa fa-thumbs-up font-size-20" :class="{'cursor-pointer':detailInfo.l_can_like===0}" @click='detailInfo.l_can_like===0?cancelPraise(detailInfo.id):""' :title="detailInfo.l_can_like===0?'取消点赞':''"></i>
        <i v-if="!detailInfo.llike||detailInfo.llike===0" class="fa fa-thumbs-o-up font-size-20" :class="{'cursor-pointer':detailInfo.l_can_like===0}" @click='detailInfo.l_can_like===0?praise(detailInfo.id):""' :title="detailInfo.l_can_like===0?'点赞党课':''"></i>
        <el-badge :value="detailInfo.l_like" class="item">
          <span class="dianzan">点赞数</span>
        </el-badge>
        <!-- 报错 -->
        <i class="el-icon-warning font-size-20 cursor-pointer font-color-warning marl30" @click="$refs['form'] ? $refs['form'].resetFields():'';bugDialogVisible = true"></i>
        <span class="span">报错</span>
      </el-card>
    </el-footer>
    <!-- 报错dialog -->
    <el-dialog
      title="报错"
      :visible.sync="bugDialogVisible"
      width="500px">
      <el-form 
      :model="form" 
      ref="form"
      label-width="100px">
        <el-form-item 
          label="报错描述：" 
          prop="bug"
          :rules="[{ required: true, message: '请输入报错内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.bug" rows="5" placeholder="请输入报错内容..."></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bugDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="bugDialogVisible = false;$message('暂无api')" size="small">提 交</el-button>
      </span>
    </el-dialog>
    <!-- '解答','修改问题','修改答案','提问'dialog -->
    <el-dialog
      :title="dialogTitle[dialogType].name"
      :visible.sync="qaDialogVisible"
      width="500px">
      <el-form 
      :model="qaform" 
      label-width="100px"
      ref="qaform">
        <div v-if="dialogType!=3">
          <el-form-item
            :label="dialogTitle[dialogType].title" 
            prop="desc"
            :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="qaform.desc" rows="5" placeholder="请输入内容..."></el-input>
          </el-form-item>
        </div>
        <div v-if="dialogType===3">
          <el-form-item 
            label="问题" 
            prop="content"
            :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="qaform.content" rows="5"></el-input>
          </el-form-item>
          <el-form-item 
            label="图片描述" 
            prop="picture"
            label-position="top"
            :rules="[{ required: false, message: '请选择要上传的图片', trigger: 'blur' }]">
            <el-upload
              :action="`${common.basePath}/user/file/upload`"
              :headers="myHeaders"
              :limit="1"
              list-type="picture"
              name="file"
              :data="myImageData"
              :on-success="handleSuccess_covers"
              :on-remove="handleRemove_covers"
              :on-error="handleError_covers"
              :on-exceed="handleExceed_covers"
              :before-upload="beforeUpload_covers">
              <el-button size="small" type="primary">上传图片</el-button>
              <span slot="tip" class="el-upload__tip marl10">请上传一张不超过2M的图片</span>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item 
          label="备注" 
          prop="description"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="qaform.description" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qaDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('qaform',dialogType)" size="small">提 交</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        detailId:this.$route.params.detailId,//课程id
        learnId:this.$route.params.learnId,//课时id
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},
        isLoading:false,
        activeTabsName:'exercises',
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },

        detailInfo:null,//课程详情
        periodDetailInfo:null,//课时详情

        exercisesList:[],//习题
        exercisesTotal:0,
        isShow:null,//是否展示解析

        QA:[],//问答
        QATotal:0,

        commentList:[],//评论
        commentTotal:0,
        commentform:{
          description:null,
        },

        noteList:[],//笔记
        noteTotal:0,
        noteform:{
          note:null,
        },
        noteValue:true,
        showNoteId:null,//显示三行文本

        //bug弹框
        bugDialogVisible:false,
        form:{
          bug:null,
        },

        //问答弹框
        qaDialogVisible:false,
        dialogType:0,
        dialogTitle:[{name:'解答',title:'答案'},{name:'修改问题',title:'问题'},{name:'修改答案',title:'答案'},{name:'提问',title:'问题'}],
        qaform:{
          desc:null,
          picture:null,
          content:null,
          description:null,
        },
        questionId:null,//问题的id
        answerId:null,//答案的id
        showAnswerNum:1,//一个问题展示多少答案，与【更多】配合使用
        showQuestionId:null,//与【更多】配合使用
      }
    },
    computed:{
      myImageData(){
        return {type:'QAImage',org_id:this.party_org_id};
      },
    },
    mounted() { 
      this.getDetailInfo();
      this.learnClassHour();
      this.getExercises();
    },
    destoryed() {
       
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
        type==='comment' ? this.getComment(this.detailId) : '';
        type==='QA' ? this.queryQA():'';
        type==='note' ? this.getNote():'';
        type==='exercises' ? this.getExercises():'';
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val,type) {
        this.elementPageData.pageNum = val;
        type==='comment' ? this.getComment(this.detailId) : '';
        type==='QA' ? this.queryQA():'';
        type==='note' ? this.getNote():'';
        type==='exercises' ? this.getExercises():'';
      },
      /**
       * tabs的切换
       * @param  {[type]} tab [description]
       * @return {[type]}     [description]
       */
      handleTabsClick(tab){
        this.elementPageData.pageNum = 1;
        this.elementPageData.pageSize = 10;

        tab.name==='exercises' ? this.getExercises():'';
        tab.name==='note' ? this.isShow = null:'';

        tab.name==='questions-answers' ? this.queryQA():'';
        tab.name==='questions-answers' ? this.showAnswerNum=1 : '';
        tab.name==='questions-answers' ? this.showQuestionId=null : '';

        tab.name==='comment' ? this.getComment(this.detailId):'';

        tab.name==='note' ? this.getNote():'';
        tab.name==='note' ? this.showNoteId = null:'';
      },
      /**
       * 问答的折叠面板change事件
       * @return {[type]} [description]
       */
      handleChangeCollapse(val){
        this.showAnswerNum = 1;
        this.showQuestionId = val;
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
          this.qaform.picture = res.data[0].path;
        }else{
          this.$message.error(res.meta.message);
        }
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove_covers(file, fileList) {
        fileList.length===0 ?  this.qaform.picture = null : '';
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
       * 获取课程详情信息
       * @return {[type]}    [description]
       */
      getDetailInfo(){
        this.isLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_by_id?id=${this.detailId}`).then((response) => {
          this.detailInfo = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 根据课时id学习党课课时
       * @return {[type]}    [description]
       * /period/select_period?id=${this.learnId}  查课时详情
       * /lecture/learn_lecture?lperiodid=${this.learnId}  去学习课时
       */
      learnClassHour(){
        this.isLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/lecture/learn_lecture?lperiodid=${this.learnId}`).then((response) => {
          this.periodDetailInfo = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },

      /**
       * 根据课时id查询相关习题
       * @return {[type]}    [description]
       */
      getExercises(){
        let form = {
          ids:[this.learnId],
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
        }
        this.axios.post(`${this.courseCommon.basePath}/period/select_questions`,form).then((response) => {
          this.exercisesList = response.data ? response.data.rows : [];
          this.exercisesTotal = response.data.total;
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 根据课时id查询问答
       */
      queryQA(){
        let form = {
          ids:[this.learnId],
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
        }
        this.axios.post(`${this.courseCommon.basePath}/lquestions/find_lquestions`,form).then((response) => {
          this.QA =  response.data ? response.data.rows : [];
          this.QATotal = response.data.total;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 创建问题
       */
      createQuestions(){
        let form = {
          content: this.qaform.content,
          description: this.qaform.description,
          period_id: this.learnId,
          picture: this.qaform.picture,
        }
        this.axios.post(`${this.courseCommon.basePath}/lquestions/create_lquestions`,form).then((response) => {
          this.queryQA();//刷新
          this.$message({type: 'success',message: '成功!'});
          this.qaDialogVisible = false;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 创建答案
       */
      createAnswers(){
        let form = {
          content: this.qaform.desc,
          description: this.qaform.description,
          l_question_id: this.questionId,
        }
        this.axios.post(`${this.courseCommon.basePath}/lquestions_answers/create_lques_answers`,form).then((response) => {
          this.queryQA();//刷新
          this.$message({type: 'success',message: '成功!'});
          this.qaDialogVisible = false;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 修改自己的答案
       */
      editAnswers(){
        let form = {
          content: this.qaform.desc,
          description: this.qaform.description,
          id: this.answerId,
          l_question_id: this.questionId,
        }
        this.axios.post(`${this.courseCommon.basePath}/lquestions_answers/edit_lques_answers`,form).then((response) => {
          this.queryQA();//刷新
          this.$message({type: 'success',message: '成功!'});
          this.qaDialogVisible = false;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 删除自己的答案
       */
      delAnswers(){
        this.$confirm('是否删除该答案?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
            this.axios.post(`${this.courseCommon.basePath}/lquestions_answers/delete_lques_answers?id=${this.answerId}`).then((response) => {
              this.queryQA();//刷新
              this.$message({type: 'success',message: '成功!'});
              this.qaDialogVisible = false;
            }).catch((error) => {
              this.$message.error(error);
            });
        }).catch(() => {});
      },
      /**
       * 提交'解答','修改问题','修改答案','提问'的表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type===0 ? this.createAnswers() : '';
            type===2 ? this.editAnswers() : '';
            type===3 ? this.createQuestions() : '';
          } else {
            return false;
          }
        });
      },

      /**
       * 查询评论
       */
      getComment(id){
        let form = {
          ids:[id],
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
        }
        this.axios.post(`${this.courseCommon.basePath}/evaluate/find_evaluate`,form).then((response) => {
          this.commentList =  response.data ? response.data.rows : [];
          this.commentTotal = response.data.total;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 发表评论
       * @return {[type]} [description]
       */
      publishComment(formName,id){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              description: this.commentform.description,
              fk_lecture_id: id,
            }
            this.axios.post(`${this.courseCommon.basePath}/evaluate/create_lecture_evaluate`,form).then((response) => {
              this.getComment(id);//刷新
              this.$message({type: 'success',message: '成功!'});
              this.commentform.description = null;//发表成功，清空输入框
            }).catch((error) => {
              this.$message.error(error);
            });
          } else {
          return false;
          }
        });
      },
      /**
       * 删除评论
       */
      delComment(id){
        this.$confirm('是否删除该评论?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.courseCommon.basePath}/evaluate/delete_evaluate?id=${id}`).then((response) => {
            this.getComment(this.datailId);//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {}); 
      },

      /**
       * 查看全部与查看我的笔记 切换
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      switchChange(val){
        this.getNote();
      },
      /**
       * 查询笔记
       * /note/findNote 查询用户自己的笔记
       * /note/findAllNote 查询笔记
       */
      getNote(){
        let form = {
          ids:[this.learnId],
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
        }
        this.axios.post(this.noteValue ? `${this.courseCommon.basePath}/note/findNote`:`${this.courseCommon.basePath}/note/findAllNote`,form).then((response) => {
          this.noteList = response.data ? response.data.rows : [];
          this.noteTotal = response.data.total;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 提交笔记
       * @return {[type]} [description]
       */
      publishNote(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              content: this.noteform.note,
              period_id: this.learnId,
            }
            this.axios.post(`${this.courseCommon.basePath}/note/createNote`,form).then((response) => {
              this.getNote();//刷新
              this.$message({type: 'success',message: '成功!'});
              this.noteform.note = null;//发表成功，清空输入框
            }).catch((error) => {
              this.$message.error(error);
            });
          } else {
          return false;
          }
        });
      },
      /**
       * 删除笔记
       */
      delNote(id){
        this.$confirm('是否删除该笔记?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.courseCommon.basePath}/note/deleteNote?id=${id}`).then((response) => {
            this.getNote();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {}); 
      },

      /**
       * 收藏
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      collect(id){
        this.axios.post(`${this.courseCommon.basePath}/collect/create_collect?id=${id}`).then((response) => {
          this.getDetailInfo();//刷新
          this.$message({type: 'success',message: '收藏成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 取消收藏
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      cancelCollect(id){
        this.axios.post(`${this.courseCommon.basePath}/collect/delete_collect?id=${id}`).then((response) => {
          this.getDetailInfo();//刷新
          this.$message({type: 'success',message: '取消收藏成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 点赞
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      praise(id){
        this.axios.post(`${this.courseCommon.basePath}/like/create_like?id=${id}`).then((response) => {
          this.getDetailInfo();//刷新
          this.$message({type: 'success',message: '点赞成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 取消点赞
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      cancelPraise(id){
        this.axios.post(`${this.courseCommon.basePath}/like/delete_like?id=${id}`).then((response) => {
          this.getDetailInfo();//刷新
          this.$message({type: 'success',message: '取消点赞成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .learn-party-class{
    padding-top:20px;
    padding-bottom: 20px;
    overflow:hidden;
    .header-breadcrumb{
      .breadcrumb-nav{
        
      }
    }
    .main-container{
      padding:0px 20px;
      .top-bar{
        overflow:hidden;
        margin-bottom:20px;
        .bar-left{
          font-weight:600;
        }
        .bar-right{
          overflow:hidden;
          font-size:14px;
          color:#666;
        }
      }
      .video-bar{
        
        
      }
      .tabs-bar{
        .class-time{
          text-align:right;
        }
        .q-item{
          overflow:hidden;
        }
        .a-item{
          overflow:hidden;
        }
        .conmment-box{
          margin-bottom:10px;
          overflow:hidden;
          .info{
            overflow:hidden;
            font-size:12px;
            color:#666;
            .info-text{
              margin-left: 10px;
              margin-top: 10px;
            }
          }
          .comment{
            text-indent:28px;
            font-size:14px;
            color:#333;
          }
        }
        .comment-btn{
          text-align: right;
        }
      }
    }
    .footer-container{
      text-align: center;
      font-size: 15px;
      .item{
        margin-right: 8px;
      }
      .span{
        margin: 0 30px 0 5px;
      }
      .dianzan{
        margin: 0 0 0 5px;
      }
    }
  }
</style>