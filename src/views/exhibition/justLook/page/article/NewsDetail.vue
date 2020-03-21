<template>
  <div v-if="newsDetailData">
    <!-- 右边内容 -->
    <div class="detail-wrapper">
      <!-- 面包屑 -->
      <el-breadcrumb class="marb20 border-home-er" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> 
        <el-breadcrumb-item>{{newsDetailData.articleName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-divider ></el-divider>
      <div class="mar20">
        <h1 class="text-center">{{newsDetailData.articleName}}</h1>
        <p class="text-center small-font colorc2c2c2">{{newsDetailData.articleWord}}{{newsDetailData.articleNum}}</p>
      </div>
      <el-row>
          <el-col :span="8" class="small-font colorc2c2c2">
            {{newsDetailData.author}} 创建于 {{common._convertDate(newsDetailData.createTime, 'yyyy.MM.dd hh:mm:ss')}}
          </el-col>
          <el-col :span="16" class="operation-block text-right">
            <el-radio-group v-model="radioGroup1" size="mini">
              <el-radio-button label="laud">赞 （{{newsDetailData.aLisksAomunt ? newsDetailData.aLisksAomunt + '+' : '0'}}）</el-radio-button>
              <el-radio-button label="collection">收藏（{{newsDetailData.collectionAomunt ? newsDetailData.collectionAomunt + '+' : '0'}}）</el-radio-button>
              <el-radio-button label="comment">评论（{{commentList.length ? commentList.length + '+' : '0'}}）</el-radio-button>
              <el-radio-button label="learn">学习（{{newsDetailData.learnScore ? newsDetailData.learnScore + '+' : '0'}}）</el-radio-button>
              <el-radio-button label="error">报错（{{newsDetailData.errorScore ? newsDetailData.errorScore + '+' : '0'}}）</el-radio-button>
            </el-radio-group> 
          </el-col>
       </el-row>
      <div class="detail-content padt20 mart20" v-html="newsDetailData.articleContent"></div>
      <div class="text-right mar20 detail-icon">
        <span title="点赞" v-if="newsDetailData.laudScore" class="icon iconfont" @click="newsLike" :class="newsDetailData.like ? 'icon-icon_dianzan-mian' : 'icon-icon_dianzan-xian'"></span>

        <span title="收藏" class="icon iconfont" @click="collectionNews" :class="newsDetailData.collection ? 'icon-shoucang1' : 'icon-shoucang'"></span> 
        <!-- true 表示还没有学习，false表示已经学习过的 -->
        <span title="学习" v-if="newsDetailData.learnScore" class="icon iconfont" @click="learnNews" :class="newsDetailData.allowLearn ? 'icon-xuexi1' : 'icon-xuexi'"></span>

        <span title="报错" v-if="newsDetailData.errorScore" class="icon iconfont icon-baocuo-_huabanfuben" @click="errorDialogVisible = true"></span> 

      </div>
      <div class="padl20" v-if="newsDetailData.privateFiles" 
        v-for="(itemFile, indexFile) in JSON.parse(newsDetailData.privateFiles)" 
        :key="indexFile">
        附加资料{{indexFile + 1}}：
        <el-button 
          type="text"
          title="点击下载"
          @click="common.downloadFile(itemFile.id)">
            {{itemFile.name}}
        </el-button> 
      </div> 
      <div class="comment-wrapper pad20"> 
        <div class="common-content">
          <el-card v-for="(itemComment, index) in commentList" :key="index" class="marb20">
            <el-row>
              <el-col :span="12">
                <el-avatar v-if="itemComment.picture" :src="itemComment.picture"></el-avatar> 
                <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
                <span class="marl5 display-inline-block">{{itemComment.creator}}</span>
              </el-col>
              <el-col :span="12" class="text-right">
                <span class="small-font colorc2c2c2">{{common._convertDate(itemComment.createTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
              </el-col>
            </el-row>
            <p class="marl20 pad15">{{itemComment.commentContent}}</p>
          </el-card>
          <el-card v-if="newsDetailData.commentScore" class="marb20">
            <el-row>
              <el-col :span="24" class="text-right">
                <span class="marr5 display-inline-block">{{loginInUserInfo.real_name}}</span>
                <el-avatar class="marl5" v-if="loginInUserInfo.picture" :src="loginInUserInfo.picture"></el-avatar> 
                <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
              </el-col> 
            </el-row>
            <p class="padt15 padb15">
              <el-input class="xie-textarea__inner" v-model="form.commentContent" type="textarea"></el-input>
            </p>
            <div class="text-right">
              <el-button @click="commentNewsYes" type="success" icon="el-icon-check" circle></el-button>
              <el-button @click="form.commentContent = '' " type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </el-card>
        </div>
      </div> 
    </div>
    <!-- 评论模态框 -->
    <el-dialog
      class="dialog"
      title="评论"
      :visible.sync="commentDialogVisible"
      width="30%" >
      <div>
        <el-input v-model="form.commentContent" type="textarea" rows="5"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="commentDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="commentNewsYes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 报错模态框 -->
    <el-dialog
      class="dialog"
      title="报错"
      :visible.sync="errorDialogVisible"
      width="30%" >
      <div>
        <el-input v-model="form.errorContent" type="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="errorDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="errorCorrectionNews">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
    	return {
        loginInUserInfo: JSON.parse(sessionStorage.getItem('loginInUserInfo')),
        orgId: sessionStorage.getItem('orgId'),
        commentDialogVisible: false,  //为true，显示评论弹框 ，false不显示
        errorDialogVisible:   false,  //为true，显示报错弹框 ，false不显示
        newsDetailData: null,         //新闻详情数据
        commentList: [],              //评论列表
        newsId: this.$route.params.id,
        linkChecked: true,      
        form: {                       //需提交后台的表单数据
          commentContent: '',   
          errorContent:   '',
        },
        radioGroup1: 'laud',
    	}
    },
    mounted(){
      this.getNewDetail();
      this.getCommentList();
    },
    methods: {
      /*
      * 查询新闻详情
      */
      getNewDetail() { 
        this.axios.get( `${this.common.basePath}/home/a_info/${this.newsId}/detail`, {params: {partyOrgId: this.orgId}} ).then( (response) => {   
            this.newsDetailData = response.data;
        }).catch( (error) => {  
          this.$message.error(error) 
        });     
      }, 
      /*
      * 评论列表
      */
      getCommentList() { 
        this.axios.get( `${this.common.basePath}/home/a_reviewes/list`, {params: {status: 2, fromId: this.newsId, fromType: '1'} } ).then( (response) => {   
            this.commentList = response.data.rows;
        }).catch( (error) => {  
          this.$message.error(error) 
        });    
      },
      /*
      * 新闻点赞
      * @return data
      */
      newsLike() { 
        this.axios.get( `${this.common.basePath}/home/a_like?id=${this.newsId}&&type=1`, {} ).then( (response) => {   
          this.getNewDetail();
        }).catch( (error) => {  
          this.$message.error(error) 
        });  
      },
      /*
      * 评论新闻
      */
      commentNewsYes() {
        this.axios.post( `${this.common.basePath}/home/a_reviewes/review`, {fromId: this.newsId, fromType: '1', commentContent: this.form.commentContent} ).then( (response) => {   
          this.getCommentList();
          this.$message.success(response.meta.message); 
          this.commentDialogVisible = false; 
          this.form.commentContent = null;
        }).catch( (error) => {   
          this.commentDialogVisible = false; 
          this.form.commentContent = null;
          this.$message.error(error) 
        });

        
      },
      /*
      * 学习新闻
      * @return data
      */
      learnNews() {
        this.axios.get( `${this.common.basePath}/home/a_info/learn/${this.newsId}`, {} ).then( (response) => {   
          this.getNewDetail();
          this.$message.success(response.meta.message);  
        }).catch( (error) => {    
          this.$message.error(error) 
        }); 
      },
      /*
      * 新闻报错
      * @return data
      */
      errorCorrectionNews() {  
        this.axios.post( `${this.common.basePath}/home/a_errors/error`, {fromId: this.newsId, fromType: '1', errorContent: this.form.errorContent} ).then( (response) => { 
          this.$message.success(response.meta.message);   
          this.errorDialogVisible = false; 
          this.form.errorContent = null;
        }).catch( (error) => {     
          this.errorDialogVisible = false; 
          this.form.errorContent = null;
          this.$message.error(error) 
        });   
      },
      /*
      * 收藏新闻
      * @return data
      */
      collectionNews() {  
        this.axios.post( `${this.common.basePath}/home/a_collection?id=${this.newsId}&&type=1`, '').then( (response) => {   
          this.getNewDetail();
          this.$message.success(response.meta.message);  
          this.errorDialogVisible = false;
        }).catch( (error) => {    
          this.errorDialogVisible = false;
          this.$message.error(error) 
        });   
        
      }, 
    }
  };
</script>
<style lang="less">
  .detail-content{
    img{
      max-width: 100%
    }
  }
  .detail-icon{
    span{
      font-size: 18px;
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .xie-textarea__inner{
    .el-textarea__inner{
      height: 110px;
    } 
  }
</style>