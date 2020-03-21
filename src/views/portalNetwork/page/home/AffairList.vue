/**************************************
*-------------- 代办事务列表 --------------*
***************************************/
<template>
  <div v-loading="loading" class="row pad-l20 pad-r20 mr-t5"  >
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card"> 
          <el-breadcrumb class="marb20" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">{{loginInUserInfo.real_name}}</el-breadcrumb-item> 
            <el-breadcrumb-item>工作列表</el-breadcrumb-item> 
          </el-breadcrumb>
          <div>
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="任务名称">
                <el-input v-model="searchForm.keyWords" placeholder="任务名称"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchForm.curStatus" placeholder="状态">
                  <el-option label="待处理" value="1"></el-option>
                  <el-option label="已处理" value="2"></el-option> 
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getQueryaffairList">搜索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              ref="multipleTable"
              :data="affairList.rows"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                type="index"
                width="50">
              </el-table-column> 
              <el-table-column
                label="任务名称"
                width="120"
                prop="taskName"> 
              </el-table-column>
              <el-table-column
                label="开始"
                width="120">
                <template slot-scope="scope">{{ common._convertDate(scope.row.createTime, 'yyyy.MM.dd') }}</template>
              </el-table-column>
              <el-table-column
                label="结束"
                width="120">
                <template slot-scope="scope">{{common._convertDate(scope.row.endTime, 'yyyy.MM.dd') }}</template>
              </el-table-column>
              <el-table-column
                label="积分"
                width="80"
                prop="taskScore"> 
              </el-table-column>
              <el-table-column
                label="状态"
                width="120" > 
                <template slot-scope="scope">{{showStatusText(scope.row.curStatus) }}</template>
              </el-table-column>
            </el-table>   
          </div>
          <!-- 分页 -->
          <el-pagination class="text-right mart20"
            @size-change="handleSizeChange($event)"
            @current-change="handleCurrentChange($event)" 
            :page-sizes="elementPageData.defaultData.pageSizes"
            :page-size="elementPageData.defaultData.pageSizeDefault"
            layout="total, sizes, prev, pager, next, jumper"
            :total="affairList.total">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock></RightCanlendarBlock> 
        <!-- 通知列表 -->
        <RightNoticeBlock></RightNoticeBlock>
      </el-col>
    </el-row>
  </div>
</template>

<script>   
  import RightCanlendarBlock from '../../components/RightCanlendarBlock.vue' 
  import RightNoticeBlock from '../../components/RightNoticeBlock.vue'
  export default { 
    components: {
      RightCanlendarBlock, 
      RightNoticeBlock
    },  
    data() {
      return {
        loading:            false,
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息,
        affairList:  {rows: [], total: 0}, //通知列表
        elementPageData: {               //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        searchForm:     {
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
          curStatus:    '1',
          keyWords:     null,
          assignee:     JSON.parse(sessionStorage.getItem('loginInUserInfo')).id
        }
      }
    },
    mounted() {  
      this.getQueryaffairList();
    }, 
    methods: {  
      /*
       * 查询通知列表
       */
      getQueryaffairList(){  
        this.axios.post( `${this.common.basePath}/task/base_task/list`, this.searchForm ).then( (response) => {  
          this.affairList = response.data;
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
          this.getQueryaffairList()
      },
      /*
       * 改变每页条数触发此事件，并广播paginationChange事件
       * @param {number} val 每页条数
       */
      handleSizeChange(val){
          this.searchForm.pageSize = val;
          this.getQueryaffairList()
      },
      handleSelectionChange(ev){

      },
      showStatusText(status){
        if(status == 1){
          return '待处理';
        }else if(status == 1){
          return '已处理';
        }
      }
    }
  }
</script>
 