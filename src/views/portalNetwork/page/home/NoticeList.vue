/**************************************
*-------------- 通知列表 --------------*
***************************************/
<template>
  <div v-loading="loading" class="row pad-l20 pad-r20 mr-t5"  >
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card"> 
          <el-breadcrumb class="marb20" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">{{loginInUserInfo.real_name}}</el-breadcrumb-item>
            <el-breadcrumb-item>通知列表</el-breadcrumb-item> 
          </el-breadcrumb>
          <el-divider></el-divider>
          <div class="mart20">
            <div v-for="(item, index) in noticeHistoryList.rows" :key="index" class="cursor-pointer mart10" @click="goToDetail(item.id)">
              <el-row >
                <el-col :span="16" class="text-left"><span class="text">{{item.title}}-{{item.noticeType}}</span></el-col>
                <el-col :span="8"  class="text-right"><span class="text">{{common._convertDate(item.createTime, 'yyyy.MM.dd hh:ss')}}</span></el-col>
              </el-row>
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination class="text-right mart20"
            @size-change="handleSizeChange($event)"
            @current-change="handleCurrentChange($event)" 
            :page-sizes="elementPageData.defaultData.pageSizes"
            :page-size="elementPageData.defaultData.pageSizeDefault"
            layout="total, sizes, prev, pager, next, jumper"
            :total="noticeHistoryList.total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock></RightCanlendarBlock> 
        <!-- 代办事务列表 -->
        <RightAffairBlock></RightAffairBlock>
      </el-col>
    </el-row>
  </div>
</template>

<script>   
  import RightCanlendarBlock from '../../components/RightCanlendarBlock.vue' 
  import RightAffairBlock from '../../components/RightAffairBlock.vue'
  export default { 
    components: {
      RightCanlendarBlock, 
      RightAffairBlock
    },  
    data() {
      return {
        loading:            false,
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息,
        noticeHistoryList:  {rows: [], total: 0}, //通知列表
        elementPageData: {               //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        searchForm:     {
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
          userId:       JSON.parse(sessionStorage.getItem('loginInUserInfo')).id,
        }
      }
    },
    mounted() {  
      this.getQueryNoticeList();
    }, 
    methods: {  
      /*
       * 查询通知列表
       */
      getQueryNoticeList(){  
        this.axios.post( `${this.common.basePath}/user/transaction/noticeHistory`, this.searchForm ).then( (response) => {  
          this.noticeHistoryList = response.data;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      }, 
      /*
       * 改变当前页码触发此事件，并广播paginationChange事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
          this.searchForm.pageNum = val;
          this.getQueryNoticeList()
      },
      /*
       * 改变每页条数触发此事件，并广播paginationChange事件
       * @param {number} val 每页条数
       */
      handleSizeChange(val){
          this.searchForm.pageSize = val;
          this.getQueryNoticeList()
      },
      goToDetail(id){
        this.$router.push({name: 'NoticeDetail', params: {id: id}});
      }
    }
  }
</script>
 