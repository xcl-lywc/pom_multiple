/*******************************************************
 * author yuanyuan.xie  新闻递归 
 * date 2018/05/03 
 *******************************************************/
<template>
    <div v-loading="loading" class="pad20">
        <!-- 新闻 -->
        <ul class="padb20 mard20">
          <li v-for="(newItem, indexNew) in newsData.rows" :key="indexNew">
            <router-link :to="{name: 'NewsDetail', params: {id: newItem.id} }"> 
              <span class="fl text">{{newItem.articleName}}</span>  
              <span class="fr">{{_dataCovert(newItem.createTime)}}</span>
            </router-link>
          </li>
        </ul>
        <div class="clear"></div>
        <!-- 分页 -->
        <el-pagination class="ce-pagination text-right"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange($event)" 
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="newsData.total">
        </el-pagination>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'items',
        props: {
            aTypeData: {    //类型数据
                required: true,
                type: Object,
                default:"",
            },
        },
        components: {},
        data() {
            return {
                loading: true,  //等待事件
                newsData:{              //新闻条数数据
                    rows: [], 
                    total: 0,
                }, 
                elementPageData: {               //分页需要的数据
                  defaultData:  this.common.elementPagination,
                  pageNum:      this.common.elementPagination.pageNumDefault,
                  pageSize:     this.common.elementPagination.pageSizeDefault,
                },                   
            }
        },
        mounted(){
            this.getQueryNewsData(this.aTypeData)
        },
        methods: {
            /*
            * 改变当前页码触发此事件，并广播paginationChange事件
            * @param {number} val 当前页码
            */
            handleCurrentChange(val){
                this.elementPageData.pageNum = val;
                this.getQueryNewsData(this.aTypeData)
            },
            /*
            * 改变每页条数触发此事件，并广播paginationChange事件
            * @param {number} val 每页条数
            */
            handleSizeChange(val){
                this.elementPageData.pageSize = val;
                this.getQueryNewsData(this.aTypeData)
            },
            /*
            * 查询新闻数据
            * @param {{ object }} data 查询数据
            */
            getQueryNewsData(aTypeData){
              this.axios.get( `${this.common.basePath}/home/a_info/article/list`,  this._queryNewsParams()).then( (response) => {   
                this.newsData = response.data;
                this.loading = false;
              }).catch( (error) => {  
                this.loading = false;
                this.$message.error(error) 
              });  
            },
            _queryNewsParams(){ 
              return {
                params: {
                  type:      this.aTypeData.atId,
                  pageSize:  this.elementPageData.pageSize,
                  pageNum:   this.elementPageData.pageNum,
                  partyOrgId:this.orgId,
                  curStatus: 1
                }
              } 
            },
            /*
            * 时间转换
            * @param {string} timeStamp 时间戳
            * @return time 返回转换后的时间
            */
            _dataCovert(timeStamp){
                return new Date(timeStamp).Format('yyyy-MM-dd');
            },
        }
    }
</script>