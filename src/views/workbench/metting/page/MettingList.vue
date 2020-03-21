/*******************************************************
 * author yuanyuan.xie  会议列表 
 * date 2018/09/18
 *******************************************************/
<template>
  <div v-loading="loading" class="pad20">
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="会议名称：">
        <el-input v-model="queryForm.title" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="queryForm.status" placeholder="">
          <el-option label="全部" value=""></el-option>
          <el-option label="未开始" value="0"></el-option>
          <el-option label="进行中" value="1"></el-option>
          <el-option label="已结束" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getQueryMettingsData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 会议 -->
    <el-table 
      border
      stripe
      :data="mettingList.rows"
      style="width: 100%">
      <el-table-column  
        prop="m_title"
        label="会议标题"> 
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        width="180">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.startTime, 'yyyy.MM.dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.endTime, 'yyyy.MM.dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="m_addr"
        label="地点">
      </el-table-column>
      <el-table-column
        prop="join_num"
        width="80"
        label="会议人数">
      </el-table-column>
      <el-table-column
        prop="status"
        width="80"
        label="会议状态">
      </el-table-column>
      <el-table-column 
        label="操作">
        <template slot-scope="scope">
          <el-button @click="goToDetail(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="goToEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="mettingSigned(scope.row)" type="text" size="small">签到</el-button>
          <el-button @click="mettingStart(scope.row)" type="text" size="small">开始</el-button>
          <el-button @click="mettingEnd(scope.row)" type="text" size="small">结束</el-button>
        </template>
      </el-table-column>
    </el-table> 
    <!-- 分页 -->
    <el-pagination class="ce-pagination text-right mart20"
      @size-change="handleSizeChange($event)"
      @current-change="handleCurrentChange($event)" 
      :page-sizes="common.elementPagination.pageSizes"
      :page-size="common.elementPagination.pageSizeDefault"
      layout="total, sizes, prev, pager, next, jumper"
      :total="mettingList.total">
    </el-pagination>
  </div>
</template>
<script type="text/javascript">
  export default {  
    data() {
      return {
        loading:         true,  //等待事件
        loginInUserInfo: JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        orgId:           sessionStorage.getItem('orgId'),
        mettingList:{              //新闻条数数据
            rows: [], 
            total: 0,
        },     
        queryForm: { 
          org_id:   sessionStorage.getItem('orgId'),
          pageNum:  this.common.elementPagination.pageNumDefault,
          pageSize: this.common.elementPagination.pageSizeDefault,
          status:   null,
          title:    null,
        }               
      }
    },
    mounted(){
        this.getQueryMettingsData()
    },
    methods: {
      /*
      * 改变当前页码触发此事件，并广播paginationChange事件
      * @param {number} val 当前页码
      */
      handleCurrentChange(val){
          this.queryForm.pageNum = val;
          this.getQueryMettingsData()
      },
      /*
      * 改变每页条数触发此事件，并广播paginationChange事件
      * @param {number} val 每页条数
      */
      handleSizeChange(val){
          this.queryForm.pageSize = val;
          this.getQueryMettingsData()
      },
      /*
      * 查询会议列表
      * @param {{ object }} data 查询数据
      */
      getQueryMettingsData(){
        this.axios.post( `${this.common.basePath}/conference/meeting/select_meeting`,  this.queryForm).then( (response) => {   
          this.mettingList = response.data;
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        });  
      },
      /*
       * 会议签到
       */ 
      mettingSigned(mettingData){
        this.loading = true;
        this.axios.post( `${this.common.basePath}/conference/personal_meeting/signed`, {meeting_id: mettingData.id, status: mettingData.cur_status, user_id: this.loginInUserInfo.id}).then((response) => {   
          this.$message.success(response.meta.message);
          this.getQueryMettingsData();
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        }); 
      },
      /*
       * 会议开始
       */ 
      mettingStart(mettingData){
        this.loading = true;
        this.axios.post( `${this.common.basePath}/conference/meeting/start_meeting?id=${mettingData.id}`, '').then((response) => {   
          this.$message.success(response.meta.message);
          this.getQueryMettingsData();
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        }); 
      },
      /*
       * 会议结束
       */ 
      mettingEnd(mettingData){
        this.loading = true;
        this.axios.post( `${this.common.basePath}/conference/meeting/end_meeting?id=${mettingData.id}`, '').then((response) => {   
          this.$message.success(response.meta.message);
          this.getQueryMettingsData();
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        }); 
      },
      /*
       * 跳转详情
       */
      goToDetail(row){ 
        this.$router.push({name: 'MettingDetail', params: {mettingid: row.id}});
      },
      /*
       * 编辑会议
       */
      goToEdit(row){ 
        this.$router.push({name: 'EditMetting', params: {mettingid: row.id}});
      },
    }
  }
</script>