/**************************************
*---------------------课程学习（课程对外的列表）-----------*
***************************************/
<template>
  <div class="course-learn" v-loading="isLoading" ref="contentWrap" :style="{'height':containerHeight+'px'}" v-if="!isNoViewing">
    <div ref="contentWrap" v-if="listData.total>0">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in listData.rows" :key="item.id" shadow="hover">
          <el-card class="box-card marb20">
            <div slot="header" class="clearfix">
              <span class="ellipsis w-60">{{'课程：'+ (item.l_title ? item.l_title:'暂无数据')}}</span>
              <i v-if="!item.collect||item.collect===0" class="el-icon-star-off cursor-pointer fr font-size-20 font-color-danger" @click="collect(item.id)" title="收藏党课"></i>
              <i v-if="item.collect&&item.collect!=0" class="el-icon-star-on cursor-pointer fr font-size-20 font-color-danger" @click="cancelCollect(item.id)" title="取消收藏"></i>
            </div>
            <div class="image-container" @click="skipDetail(item.id)">
              <el-image 
                :src="item.l_covers!='[]' ? JSON.parse(item.l_covers)[0].response.data[0].path : ''"
                class="image cursor-pointer"
                fit="cover">
              </el-image>
            </div>
            <div class="text-container">
              <div class="teacher-score">
                <span class="fl">{{'讲师：'+ (item.l_docent ? item.l_docent:'暂无数据')}}</span>
                <span class="fr">{{'评分：'+ (item.score ? item.score:'暂无数据')}}</span>
              </div>
              <div class="brief">
                {{'简介：'+ (item.l_introduction ? item.l_introduction:'暂无数据')}}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else class="no-data">暂无数据</div>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        containerHeight:window.screen.availHeight-163,
        scrollLoadSw: true, //滚动加载开关
        searchForm:  {
          pageNum:       1,
          pageSize:      10,
          party_org_id:  this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        },
        listData:{rows:[],total:0},
      }
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'));
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_course_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }

      // ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
        // 滑动到底部50的时候操作数据
        if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
          // ------ 值为true表示可以再次请求
          if(this.scrollLoadSw){
            this.scrollLoadSw = false;
            if(this.searchForm.pageNum < this.listData.total / this.searchForm.pageSize){
              this.getQueryList(false);
            } 
          }
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getQueryList(true);
    },
    destoryed() {
       
    },
    methods: {
      /*
       * 查询课程列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(isRefresh){ 
        this.isLoading = true; 
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_lecture`,this._queryParams(isRefresh)).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.listData.rows = this.listData.rows.concat(response.data.rows);

            this.listData.total = response.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.listData = response.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          this.isLoading = false;
        });
      },
      _queryParams(isRefresh){
        isRefresh ? this.searchForm.pageNum = 1 : this.searchForm.pageNum ++;
        return this.searchForm;
      },
      /**
       * 刷新
       * @param  {[type]} num [description]
       * @return {[type]}     [description]
       */
      refresh(num){  
        this.isLoading = true; 
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_lecture`,{pageNum:1,pageSize:num*10,party_org_id:  this.party_org_id,}).then((response) => {
          this.listData = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error); 
          this.isLoading = false;
        });
      },

      /**
       * 收藏
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      collect(id){
        this.axios.post(`${this.courseCommon.basePath}/collect/create_collect?id=${id}`).then((response) => {
          this.refresh(this.searchForm.pageNum);//刷新
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
          this.refresh(this.searchForm.pageNum);//刷新
          this.$message({type: 'success',message: '取消收藏成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 跳转详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      skipDetail(id){
        this.$router.push({
          name:'CourseDetail',
          params:{
            id:id,
          },
        })
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .course-learn{
    overflow-y: auto;
    overflow-x:hidden;
    height:100%;
    box-sizing:border-box;
    padding:20px;
    .image-container{
      height:200px;
      .image{
        width:100%;
        height:200px;
      }
    }
    .text-container{
      margin-top:10px;
      font-size:14px;
      color:#666;
      .teacher-score{
        overflow:hidden;
        margin-bottom:5px;
      }
      .brief{
        min-height:38px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-indent:0px;
      }
    }
  }
</style>