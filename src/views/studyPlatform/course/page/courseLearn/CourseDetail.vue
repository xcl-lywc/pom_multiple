/**************************************
*---------------------课程详情-----------*
***************************************/
<template>
  <el-container class="course-detail" v-loading="isLoading" ref="">
    <el-header class="header-breadcrumb">
      <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb-nav">
          <el-breadcrumb-item :to="{ path:'/course_courselearn'}">课程列表</el-breadcrumb-item>
          <el-breadcrumb-item>课程详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-header>
    <el-main class="main-container" v-if="detailInfo">
      <el-card class="box-card">
        <div class="top-bar">
          <div class="bar-left fl">
            {{detailInfo.l_title ? detailInfo.l_title : '暂无数据'}}
          </div>
          <div class="bar-right fr">
            <span class="fl">时长：{{detailInfo.l_hours+'小时'}}，学习人数：{{detailInfo.countPerson+'人'}}，评分：</span>
            <el-rate
              class="fl"
              v-model="detailInfo.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </div>
        </div>
        <div class="cover-bar">
          <el-image
            style="width: 100%;"
            :src="detailInfo.l_covers!='[]' ? JSON.parse(detailInfo.l_covers)[0].response.data[0].path : ''"
            fit="fill">
          </el-image>
        </div>
        <div class="tabs-bar">
          <el-tabs v-model="activeTabsName" @tab-click="handleTabsClick">
            <el-tab-pane label="简介" name="brief">
              <el-form ref="showform" label-width="100px" class="showform">
                <el-form-item label="课程名称：">{{detailInfo.l_title ? detailInfo.l_title : '暂无数据'}}</el-form-item>
                <el-form-item label="讲师：">{{detailInfo.l_docent ? detailInfo.l_docent : '暂无数据'}}</el-form-item>
                <el-form-item label="创建者：">{{detailInfo.creator_name ? detailInfo.creator_name : '暂无数据'}}</el-form-item>
                <el-form-item label="创建时间：">{{detailInfo.create_time ? common._convertDate(detailInfo.create_time , 'yyyy/MM/dd hh:mm') : '暂无数据'}}</el-form-item>
                <el-form-item label="售价：">{{detailInfo.l_price ? detailInfo.l_price+'元' : '暂无数据'}}</el-form-item>
                <el-form-item label="简介：">{{detailInfo.l_introduction ? detailInfo.l_introduction : '暂无数据'}}</el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="课时安排" name="class">
              <el-collapse v-if="detailInfo.lperiods&&detailInfo.lperiods.length>0">
                <el-collapse-item v-for="(item,index) in detailInfo.lperiods" :key="item.id" :title="'第'+(index+1)+'节课：'+item.period_title" :name="item.id">
                  <div class="class-time">
                    时长：{{item.period_hours+'小时'}}，积分：{{item.period_score+'分'}}<el-link class="marl20 marr20" type="primary" @click="toLearn(detailId,item.id)" :underline="false">去学习</el-link>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div v-else class="no-data">暂无数据</div>
            </el-tab-pane>
            <el-tab-pane label="相关评论" name="comment">
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
            <el-tab-pane label="讲述知识点" name="knowledge">
              <el-tree v-if="detailInfo.subjects&&detailInfo.subjects.length>0" :data="detailInfo.subjects" :props="defaultProps"></el-tree>
              <div v-else class="no-data">暂无数据</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </el-main>
    <el-main class="no-data main-container" v-else><el-card class="box-card">暂无数据</el-card></el-main>
    <el-footer v-if="detailInfo">
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
  </el-container>
</template>

<script>  
  export default { 
    data() {
      return {
        detailId:this.$route.params.id,
        isLoading:false,
        activeTabsName:'brief',
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        detailInfo:null,
        commentList:[],
        commentTotal:0,
        commentform:{
          description:null,
        },
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },

        //弹框
        bugDialogVisible:false,
        form:{
          bug:null,
        },
      }
    },
    mounted() { 
      this.getDetailInfo();
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
      },

      /**
       * tabs的切换
       * @param  {[type]} tab [description]
       * @return {[type]}     [description]
       */
      handleTabsClick(tab){
        this.elementPageData.pageNum = 1;
        this.elementPageData.pageSize = 10;
        tab.name==='comment' ? this.getComment(this.detailId):'';
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
       * 去学习
       * @param  {[type]} detailId [description]
       * @param  {[type]} learnId  [description]
       * @return {[type]}          [description]
       */
      toLearn(detailId,learnId){
        this.$router.push({
          name:'LearnPartyClass',
          params:{
            detailId:detailId,
            learnId:learnId,
          }
        })
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
          this.commentList = response.data ? response.data.rows :[];
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
            this.getComment(this.detailId);//刷新
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
  .course-detail{
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
      .cover-bar{
        overflow:hidden;
        .el-image{
          min-height:200px;
        }
      }
      .tabs-bar{
        .class-time{
          text-align:right;
        }
        .conmment-box{
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