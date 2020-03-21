/**************************************
*---------------------课程详情-----------*
***************************************/
<template>
  <el-container class="subject-detail" v-loading="isLoading" ref="">
    <el-header class="header-breadcrumb">
      <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-nav">
          <el-breadcrumb-item :to="{ path: '/knowledge_subjectlist' }">学科列表</el-breadcrumb-item>
          <el-breadcrumb-item>学科详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-header>
    <el-main class="main-container" v-if="detailInfo">
      <el-card class="box-card">
        <el-form 
          :model="detailInfo"
          class=""
          ref="detailInfoForm"
          :label-width="formLabelWidth">
          <el-form-item 
            label="学科编码" 
            prop="code" 
            class="is-required"
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input v-model="detailInfo.code" class="w300" disabled></el-input>
          </el-form-item>
          <el-form-item 
            label="学科名称" 
            prop="name" 
            :rules="[{ required: true, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input v-model="detailInfo.name" class="w300" @change="disabledEdit = false"></el-input>
          </el-form-item>
          <el-form-item 
            label="创建者" 
            class="is-required"
            prop="creator_name" 
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input v-model="detailInfo.creator_name" class="w300" disabled></el-input>
          </el-form-item>
          <el-form-item 
            label="创建时间" 
            prop="create_time" 
            class="is-required"
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-date-picker
              v-model="detailInfo.create_time"
              type="datetime"
              class="w300"
              placeholder="选择日期时间"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item 
            label="所属组织" 
            prop="org_name" 
            class="is-required"
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input v-model="detailInfo.org_name" class="w300" disabled></el-input>
          </el-form-item>
          <el-form-item 
            label="课程数量" 
            prop="countLecture" 
            class="is-required"
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input-number v-model="detailInfo.countLecture" :min="0" disabled :controls="false"></el-input-number>
            <el-button class="append-unit" disabled>个</el-button>
          </el-form-item>
          <el-form-item 
            label="试题数" 
            class="is-required"
            prop="countQuestions" 
            :rules="[{ required: false, message: '请输入学科名称', trigger: 'blur' }]">
            <el-input-number v-model="detailInfo.countQuestions" :min="0" disabled :controls="false"></el-input-number>
            <el-button class="append-unit" disabled>个</el-button>
          </el-form-item>
          <el-form-item 
            label="学科简介" 
            prop="description"
            :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
            { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
            <el-input type="textarea" v-model="detailInfo.description" rows="5" @change="disabledEdit = false"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
    <el-main class="no-data main-container" v-else><el-card class="box-card">暂无数据</el-card></el-main>
    <el-footer v-if="detailInfo">
      <el-card class="box-card footer-container"> 
        <div class="">
          <el-button type="primary" size="small" @click="submitForm('detailInfoForm',detailInfo.id)" :disabled="disabledEdit">编辑</el-button>
          <el-button type="warning" size="small" @click="drawerType=0;drawer=true;getKnowledgeTree();">管理知识点</el-button>
          <el-button type="" size="small" @click="elementPageData.pageNum = 1;drawerType=1;drawer=true;getCourseProblemList(1);">查看题库</el-button>
          <el-button type="" size="small" @click="elementPageData.pageNum = 1;drawerType=2;drawer=true;getCourseProblemList(2);">查看课程</el-button>
        </div>
      </el-card>
    </el-footer>
    <!-- drawer -->
    <el-drawer
      :title="drawerTitleArr[drawerType]"
      :visible.sync="drawer"
      ref="drawer"
      :modal="true"
      :close-on-press-escape = "false"
      :wrapperClosable = 'true'
      size="750px"
      custom-class = 'costom-deawer-style'
      :direction="direction">
      <div class="demo-drawer__content">
        <!-- 管理知识点 -->
        <div v-if="drawerType===0" v-loading="isTreeLoading">
          <el-tree
            :props="knowledgeProps"
            :data="knowledgeArr"
            node-key="id"
            :expand-on-click-node="false"
            default-expand-all
            ref="knowledgeTree">
            <span class="my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
              <i class="fa marr10" :class="{'fa-bookmark':!data.parent_id,'fa-bookmark-o':data.parent_id}" aria-hidden="true"></i><span :class="{'font-weight-600':!data.parent_id}">{{ data.name }}</span>
              <span v-show="tempAtId == data.id" class="tree-left-operate">
                <span class="font-color-success marr20 font-size-12" @click="addNextK(data)">添加下级知识点</span>
                <span class="font-color-success marr20 font-size-12" @click="addSameK(data)" v-if="data.parent_id">添加同级知识点</span>
                <span class="font-color-primary marr20 font-size-12" @click="editK(data)" v-if="data.parent_id">编辑知识点</span>
                <span class="font-color-danger font-size-12" @click="delK(data)" v-if="data.parent_id">删除知识点</span>
              </span>
            </span>
          </el-tree>
        </div>
        <!-- 查看题库或课程列表 -->
        <div v-if="drawerType!=0" v-loading="isTreeLoading">
          <div v-if="courseProblem.total>0" class="padl20">
            <div v-for="(item,index) in courseProblem.rows" class="marb10" @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null">
              <span>{{index>9?'0'+(index+1):(index+1)}}. {{drawerType===1 ? item.content : item.l_title }}</span>
              <!-- <el-link type="primary" v-show="tempAtId == item.id" class="text-right marl20" :underline="false">查 看</el-link> -->
            </div>
          </div>
          <div class="no-data" v-else>暂无数据</div>
          <el-pagination
            style="bottom: 20px;
            position: fixed;
            right: 20px;"
            class="fr"
            @size-change="handleSizeChange($event,drawerType)"
            @current-change="handleCurrentChange($event,drawerType)"
            :current-page="elementPageData.pageNum"
            :page-sizes="elementPageData.defaultData.pageSizes"
            :page-size="elementPageData.defaultData.pageSizeDefault"
            layout="total, sizes, prev, pager, next, jumper"
            :total="courseProblem.total">
          </el-pagination>
        </div>
      </div>
    </el-drawer>
  </el-container>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")),
        detailId:this.$route.params.id,
        isLoading:false,
        isTreeLoading:false,
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formLabelWidth:'100px',
        detailInfo:{
          name:null,
          description:null,
        },
        disabledEdit:true,//禁止编辑

        //drawer
        drawer:false,
        drawerTitleArr:['管理知识点','题库列表','课程列表'],
        drawerType:0,
        direction: 'rtl',

        knowledgeArr:[],//知识树
        tempAtId:null,//当前浮动选中的节点Id
        knowledgeProps: {
          label: 'name',
          children: 'childrens'
        },
        courseProblem:{rows:[],total:0},//该学科下的课程或题库列表

      }
    },
    mounted() { 
      this.getDetailInfo();
    },
    destoryed() {
       
    },
    methods: {

      /**
       * 获取科目详情信息
       * @return {[type]}    [description]
       */
      getDetailInfo(){
        this.isLoading = true;
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_by_id?id=${this.detailId}`).then((response) => {
          this.detailInfo = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.detailInfo = null;
          this.$message.error(error);
        });
      },

      /**
       * 提交编辑表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName,id) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.edit(id);
          } else {
            return false;
          }
        });
      },
      /**
       * 编辑学科
       * @return {[type]} [description]
       */
      edit(id){
        let form = {
          id:id,
          name: this.detailInfo.name,
          description: this.detailInfo.description,
          party_org_id:this.party_org_id,
        }
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/edit_by_id`,form).then((response) => {
          this.getDetailInfo();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 查询学科下的课程列表与题库列表
       * type 1 查询题库；2 查询课程
       * @return {[type]} [description]
       */
      getCourseProblemList(type){ 
        this.isTreeLoading = true;
        this.axios.post(type===1?`${this.knowledgeCommon.basePath}/paper_questions/select_questions`:`${this.knowledgeCommon.basePath}/lecture/select_lecture`,this._listParms(type)).then((response) => {
          this.courseProblem = response.data ? response.data:({rows:[],total:0});
          this.isTreeLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTreeLoading = false;
        });
      },
      _listParms(type){
        let problemParmsObj = {
          ids:[this.detailId],
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
        }
        let courseParmsObj = {
          l_subject:String(this.detailId),
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          party_org_id:this.party_org_id,
        }
        return type===1 ? problemParmsObj : courseParmsObj;
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val,type) {
        this.elementPageData.pageSize = val;
        this.getCourseProblemList(type);
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val,type) {
        this.elementPageData.pageNum = val;
        this.getCourseProblemList(type);
      },
      
      /**
       * 获取学科知识点树
       * @return {[type]} [description]
       */
      getKnowledgeTree(){ 
        this.isTreeLoading = true;
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_subject`,this._serchformParms()).then((response) => {
          this.knowledgeArr = response.data;
          this.isTreeLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTreeLoading = false;
        });
      },
      _serchformParms(){
        return{
          id: this.detailId,
          party_org_id:this.party_org_id,
        }
      },
      /**
       * 添加下级知识点
       * @param {[type]} data [description]
       */
      addNextK(data){
        this.$prompt('知识点名称', '添加知识点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(val){
            if(val===''||!val){return false}
          },
          inputErrorMessage: '请输入知识点名称',
          roundButton:false,
        }).then(({ value }) => {
          let form = {
            id:data.id,
            party_org_id:this.party_org_id,
            name: value,
          }
          this.axios.post(`${this.knowledgeCommon.basePath}/sonsubject/add_next_level`,form).then((response) => {
            this.getKnowledgeTree();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});
      },
      /**
       * 添加同级知识点
       * @param {[type]} data [description]
       */
      addSameK(data){
        this.$prompt('知识点名称', '添加知识点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(val){
            if(val===''||!val){return false}
          },
          inputErrorMessage: '请输入知识点名称',
          roundButton:false,
        }).then(({ value }) => {
          let form = {
            id:data.id,
            party_org_id:this.party_org_id,
            name: value,
          }
          this.axios.post(`${this.knowledgeCommon.basePath}/sonsubject/add_some_level`,form).then((response) => {
            this.getKnowledgeTree();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});
      },
      /**
       * 编辑知识点
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      editK(data){
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_by_id?id=${data.id}`).then((response) => {

          //编辑学科或知识点
          this.$prompt('知识点名称', '编辑知识点', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: function(val){
              if(val===''||!val){return false}
            },
            inputErrorMessage: '请输入知识点名称',
            inputValue:response.data.name,
            roundButton:false,
          }).then(({ value }) => {
            let form = {
              id:response.data.id,
              party_org_id:this.party_org_id,
              name: value,
            }
            this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/edit_by_id`,form).then((response) => {
              this.getKnowledgeTree();//刷新
              this.$message({type: 'success',message: '成功!'});
            }).catch((error) => {
              this.$message.error(error);
            });
          }).catch(() => {});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 删除知识点
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      delK(data){
        this.$confirm('是否删除该知识点?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/delete_by_id?id=${data.id}`).then((response) => {
            this.getKnowledgeTree();//刷新
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
  .subject-detail{
    padding-top:20px;
    padding-bottom: 20px;
    overflow:hidden;
    .header-breadcrumb{
      .breadcrumb-nav{
        
      }
    }
    .main-container{
      padding:0px 20px;
    }
    .footer-container{
      
    }
  }
</style>