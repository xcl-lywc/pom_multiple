/********************* 新闻列表 ***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.22
/************************************************/
<template>
  <div class="row">
    <!-- 面包屑 -->
    <el-breadcrumb class="marb20" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{paramObject.atName}}</el-breadcrumb-item>
    </el-breadcrumb> 
    <el-divider></el-divider>
    <div class="col-xs-12 mr-bot20 news-types-model">
      <div class="pad20">
        <!-- 新闻 -->
        <ul class="padb20 mard20">
          <li v-for="(newItem, indexNew) in newsData.rows" :key="indexNew">
            <router-link :to="{name: 'NewsDetail', params: {id: newItem.id} }">
              <span class="fl padr5">{{indexNew+1}}.</span>
              <span class="fl text">{{newItem.articleName}}</span>  
              <span class="fr">{{_dataCovert(newItem.createTime)}}</span>
            </router-link>
          </li>
        </ul>
        <div class="clear"></div>
        <!-- 分页 -->
        <el-pagination class="text-right mart20"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)" 
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="newsData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orgId:         sessionStorage.getItem('orgId'),
        elementPageData: {               //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        allarticletypes: {newsData: {}, types: {}}, //新闻，栏目数据
        paramObject: JSON.parse(this.$route.params.object),
        newsData: {rows:[], total: 0,},
        
      }
    },
    created(){
      
    },
    mounted(){
      this.getQueryNewsData();
    },
    methods: {
      /*
      * 查询新闻数据
      */
      getQueryNewsData(){
        this.axios.get( `${this.common.basePath}/home/a_info/article/list`, this._getQueryNewsParams() ).then( (response) => {   
            this.newsData = response.data;
        }).catch( (error) => {  
          this.$message.error(error) 
        });    
      },
      _getQueryNewsParams(){ 
        let paramsData = {
          params: {
              pageSize:   this.elementPageData.pageSize,
              pageNum:    this.elementPageData.pageNum,
              partyOrgId: this.orgId,
              curStatus: 1,
          }
        } 
        if(this.paramObject.atType == 2){
          paramsData.params.special = this.paramObject.atId;
        }else{
          paramsData.params.type = this.paramObject.atId;
        }
        return paramsData;
      },
      /*
      * 时间转换
      * @param {string} timeStamp 时间戳
      * @return time 返回转换后的时间
      */
      _dataCovert(timeStamp){
          return new Date(timeStamp).Format('yyyy-MM-dd');
      },
      /*
      * 改变当前页码触发此事件，并广播paginationChange事件
      * @param {number} val 当前页码
      */
      handleCurrentChange(val){
          this.elementPageData.pageNum = val;
          this.getQueryNewsData()
      },
      /*
      * 改变每页条数触发此事件，并广播paginationChange事件
      * @param {number} val 每页条数
      */
      handleSizeChange(val){
          this.elementPageData.pageSize = val;
          this.getQueryNewsData()
      },
    }
  };
</script>
<style lang="less">
.news-types-model{
  li{
    position: relative;
    height:30px;
    line-height: 30px;
    padding-left: 15px;
    font-size: 16px;
  }
  li:before{
      content: "";
      border: 6px solid #ccc;
      border-color: transparent transparent transparent #6f6f6f;
      height: 0;
      width: 0;
      display: block;
      position: absolute;
      top: 8px;
      left: 0;
  }
  .el-pagination li:before{
    display: none;
  }
}
</style>