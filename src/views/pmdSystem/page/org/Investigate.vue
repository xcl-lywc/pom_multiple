/*********************党员考察*************************/
  Author: Yuanyuan.Xie
  Date:   2019.10.09
/****************************************************/
<template>
  <div v-loading="loading"> 
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="考察人：">
        <el-input v-model="queryForm.creator_name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="被考察人：">
        <el-input v-model="queryForm.creator_name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="考察时间：">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item> 
      <el-form-item>
        <el-button type="primary" @click="getQueryApplysData">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 申请 -->
    <el-table 
      border
      stripe
      :data="applyList.rows"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column  
        type="selection" 
        label="选择"> 
      </el-table-column>
      <el-table-column
        type="index"
        label="序号" 
        width="50" > 
        <template slot-scope="scope">
          <span>{{(queryForm.pageNum - 1) * queryForm.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator_name"
        label="考察人"> 
      </el-table-column>
      <el-table-column
        prop="creator_name"
        label="考察对象"> 
      </el-table-column>
      <el-table-column
        prop="apply_time"
        label="创建时间">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.apply_time, 'yyyy.MM.dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="apply_time"
        label="考察时间">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.apply_time, 'yyyy.MM.dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status" 
        label="状态">
      </el-table-column> 
      <el-table-column 
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button @click="showDialog(scope.row, 'inspect')" type="text" size="small">查看</el-button> 
        </template>
      </el-table-column>
    </el-table> 
    <div class="mar20">
      <el-button type="primary" size="small" @click="showApplyDialog">创建考察</el-button> 
    </div>
    <!-- 分页 -->
    <el-pagination class="ce-pagination text-right mart20"
      @size-change="handleSizeChange($event)"
      @current-change="handleCurrentChange($event)" 
      :page-sizes="common.elementPagination.pageSizes"
      :page-size="common.elementPagination.pageSizeDefault"
      layout="total, sizes, prev, pager, next, jumper"
      :total="applyList.total">
    </el-pagination>
    <!-- 党委审批 -->
    <el-dialog
      title="党委审批"
      :visible.sync="dialogApproveVisible"
      width="450px" > 
      <el-form ref="approveForm" :model="approveForm" label-width="150px">  
        <el-form-item label="积极分子名单："  >
          <span>{{applyCreator}}</span>
        </el-form-item>    
        <el-form-item label="审批意见："
            prop="opinion"
            :rules="[{ required: true, message: '请填写审批意见', trigger: 'blur' }]">
          <el-input type="texteara" v-model="approveForm.opinion"></el-input>
        </el-form-item>
        <el-form-item label="报批件："
            prop="appendix"
            :rules="[{ required: true, message: '请上传报批件', trigger: 'blur' }]">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="`${common.basePath}/user/file/upload`"
            :headers="{ 'Authorization': `Bearer ${token}`}"
            :data="{org_id: orgId, type: 'meeting'}"
            :show-file-list="true"
            :on-success="((response, file, fileList) => { uploadSuccess(response, file, fileList, 'approveForm')})"
            name="upfile"> 
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitApprove('approveForm','commit')">通过</el-button>
          <el-button @click="submitApprove('approveForm','refuse')">不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> 
  </div>
</template> 
<script> 
  export default { 
    data() {
      return {
        loading:                    true,
        orgId:                      sessionStorage.getItem('orgId'),  
        loginInUserInfo:            JSON.parse(sessionStorage.getItem('loginInUserInfo')),   
        token:                      sessionStorage.getItem('token'), 
        dialogApproveVisible:       false, 
        activistList:     [],
        timeRange:        [],
        queryForm:    {
          status:              null,
          party_status:        1,
          creator_name:        null,
          start_time:          null,
          end_time:            null,
          org_id:              5,
          pageNum:             this.common.elementPagination.pageNumDefault,
          pageSize:            this.common.elementPagination.pageSizeDefault,
        },    
        applyList:     {rows: [], total: 0}, 
        approveForm:   { //党委审批表单
          appendix:     null,
          opinion:      null,
          user_id:      [],       //积极分子名单Id
          org_id:       sessionStorage.getItem('orgId'),
          party_status: 1,
        }, 
      }
    },
    mounted() {
      this.getQueryApplysData();  
    },
    methods: {   
      /*
       * 查询申请列表
       * @param {{ object }} data 查询数据
       */
      getQueryApplysData(){
        this.loading = true;
        if(this.timeRange.length){
          this.queryForm.start_time = new Date(this.timeRange[0]).getTime();
          this.queryForm.end_time = new Date(this.timeRange[1]).getTime();
        }
        
        this.axios.post( `${this.common.basePath}/conference/party/find_apply`,  this.queryForm).then( (response) => {   
          this.applyList = response.data;
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        });  
      }, 
      /*
       * 改变当前页码触发此事件，并广播paginationChange事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
          this.queryForm.pageNum = val;
          this.getQueryApplysData()
      },
      /*
       * 改变每页条数触发此事件，并广播paginationChange事件
       * @param {number} val 每页条数
       */
      handleSizeChange(val){
          this.queryForm.pageSize = val;
          this.getQueryApplysData()
      },  
    }
  }
</script>

<style lang="less"> 
  .org-str-box{
    height: 148px;
    .el-card{
      height: 100%;
    }
  }
  .box-card-fix{
    position: relative;
    .link{
      position: absolute;
      right: 0;
    }
  }
</style>