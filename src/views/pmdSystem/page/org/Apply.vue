/*********************入党申请*************************/
  Author: Yuanyuan.Xie
  Date:   2019.09.30
/****************************************************/
<template>
  <div v-loading="loading"> 
    <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item label="申请人：">
        <el-input v-model="queryForm.creator_name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="申请时段">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="queryForm.status" placeholder="">
          <el-option label="全部" value=""></el-option>
          <el-option label="驳回" value="-1"></el-option>
          <el-option label="申请" value="1"></el-option>
          <el-option label="考察" value="2"></el-option>
          <el-option label="会议" value="3"></el-option>
          <el-option label="公示" value="4"></el-option>
        </el-select>
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
        label="申请人"> 
      </el-table-column>
      <el-table-column
        prop="apply_time"
        label="申请时间">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.apply_time, 'yyyy.MM.dd hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status" 
        label="申请阶段">
      </el-table-column>
      <el-table-column
        prop="application" 
        label="申请书">
      </el-table-column>
      <el-table-column 
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="scope.row.cur_status == 1" @click="showDialog(scope.row, 'inspect')" type="text" size="small">考察</el-button>
          <el-button v-if="scope.row.cur_status == 2" @click="showDialog(scope.row, 'meeting')" type="text" size="small">支部会议</el-button>
          <el-button v-if="scope.row.cur_status == 3" @click="showDialog(scope.row, 'announce')" type="text" size="small">公示</el-button>
          <el-button v-if="scope.row.cur_status == 4" @click="showDialog(scope.row, 'approve')" type="text" size="small">报批</el-button> 
        </template>
      </el-table-column>
    </el-table> 
    <div class="mar20">
      <el-button type="primary" size="small" @click="showApplyDialog">党委审批</el-button> 
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
    <!-- 考察 -->
    <el-dialog
      title="考察会议材料上传"
      :visible.sync="dialogInspectVisible"
      width="450px"> 
      <el-form ref="inspectForm" :model="inspectForm" label-width="150px">    
        <el-form-item label="考察结论："
            prop="inspect_result"
            :rules="[{ required: true, message: '请填写考察结论', trigger: 'blur' }]">
          <el-input type="texteara" v-model="inspectForm.inspect_result"></el-input>
        </el-form-item>
        <el-form-item label="考察附件："
            prop="inspect_appendix"
            :rules="[{ required: true, message: '请上传考察附件', trigger: 'blur' }]">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="`${common.basePath}/user/file/upload`"
            :headers="{ 'Authorization': `Bearer ${token}`}"
            :data="{org_id: orgId, type: 'meeting'}"
            :show-file-list="true"
            :on-success="((response, file, fileList) => { uploadSuccess(response, file, fileList, 'inspectForm')})"
            name="upfile"> 
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitInspect('inspectForm','commit')">通过</el-button>
          <el-button @click="submitInspect('inspectForm','refuse')">不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 支部会议 -->
    <el-dialog
      title="支部会议材料上传"
      :visible.sync="dialogMeetingVisible"
      width="50vw"> 
      <el-form ref="meetingForm" :model="meetingForm" label-width="150px">    
        <el-form-item label="会议结论："
            prop="result_record"
            :rules="[{ required: true, message: '请填写会议结论', trigger: 'blur' }]">
          <el-input type="texteara" v-model="meetingForm.result_record"></el-input>
        </el-form-item>
        <el-form-item label="投票结论："
            prop="should_arrive"
            :rules="[{ required: true, message: '请填写会议结论', trigger: 'blur' }]">
          会议应到
          <el-input class="mar5" type="number" style="width: 100px;" min="0" v-model="meetingForm.should_arrive" show-word-limit></el-input>人,实到
          <el-input class="mar5" type="number" style="width: 100px;" width="100" v-model="meetingForm.true_arrive" show-word-limit></el-input>人。其中
          <el-input class="mar5" type="number" style="width: 100px;" width="100" v-model="meetingForm.agree" show-word-limit></el-input>人赞成
          <el-input class="mar5" type="number" style="width: 100px;" width="100" v-model="meetingForm.opposition" show-word-limit></el-input>人反对,
          <el-input class="mar5" type="number" style="width: 100px;" width="100" v-model="meetingForm.waiver" show-word-limit></el-input>人弃权。
        </el-form-item>
        <el-form-item label="投票记录："
            prop="appendix"
            :rules="[{ required: true, message: '请上传投票记录', trigger: 'blur' }]">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="`${common.basePath}/user/file/upload`"
            :headers="{ 'Authorization': `Bearer ${token}`}"
            :data="{org_id: orgId, type: 'meeting'}"
            :show-file-list="true"
            :on-success="((response, file, fileList) => { uploadSuccess(response, file, fileList, 'meetingForm')})"
            name="upfile"> 
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitmeeting('meetingForm','commit')">通过</el-button>
          <el-button @click="submitmeeting('meetingForm','refuse')">不通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 公示 -->
    <el-dialog
      title="公示结果"
      :visible.sync="dialogAnnounceVisible"
      width="450px"> 
      <el-form ref="announceForm" :model="announceForm" label-width="150px">    
        <el-form-item label="公示结果："
            prop="description"
            :rules="[{ required: true, message: '请填写公示结果', trigger: 'blur' }]">
          <el-input type="texteara" v-model="announceForm.description"></el-input>
        </el-form-item>
        <el-form-item label="公示表："
            prop="announce_appendix"
            :rules="[{ required: true, message: '请上传公示表', trigger: 'blur' }]">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="`${common.basePath}/user/file/upload`"
            :headers="{ 'Authorization': `Bearer ${token}`}"
            :data="{org_id: orgId, type: 'meeting'}"
            :show-file-list="true"
            :on-success="((response, file, fileList) => { uploadSuccess(response, file, fileList, 'announceForm')})"
            name="upfile"> 
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAnnounce('announceForm','commit')">通过</el-button>
          <el-button @click="submitAnnounce('announceForm','refuse')">未通过</el-button>
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
        dialogInspectVisible:       false,
        dialogMeetingVisible:       false,
        dialogAnnounceVisible:      false,
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
        applyCreator:  null,  //积极分子名单
        approveForm:   { //党委审批表单
          appendix:     null,
          opinion:      null,
          user_id:      [],       //积极分子名单Id
          org_id:       sessionStorage.getItem('orgId'),
          party_status: 1,
        },
        inspectForm:   { //考察表单
          inspect_result:     null,
          org_id:             5,
          inspect_appendix:   null,
          apply_man:          null,
          creator:            null,
          party_status:       1, 
        },
        meetingForm:   { //会议表单
          agree:         null,//会议赞成人数
          appendix:      null,//会议记录附件
          apply_man:     null,//申请人id
          creator:       null,//创建者 
          opposition:    null,//会议反对人数
          org_id:        5,
          party_status:  1,
          result_record: null,//会议结论
          should_arrive: null,//会议应到人数
          true_arrive:   null,//会议实到人数
          waiver:        null,//会议弃权人数
        },
        announceForm:{  //公示表单
          announce_appendix:  null,//公示附件 
          creator:            null,//创建者 
          description:        null,//公示结果信息 
          org_id:             5,//组织Id
          party_status:       1,//入党阶段
          people_id:          null,//被公示人ID
          user_id:            [],//公示人员Id列表
        }
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
      /**
       * 上传成功, 写入img对应的path
       * @param  {[type]} response [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      uploadSuccess (response, file, fileList, formName) {  
        let files = [];
        fileList.forEach( (item) => {
          if(item.response){
            if(item.response.data){
              item.response.data.forEach( (itemfile) => {
                files.push(itemfile)
              })
            } 
          }
        })
        if(formName == 'approveForm'){
          this.approveForm.appendix = JSON.stringify(files); 
        }else if(formName == 'inspectForm'){
          this.inspectForm.inspect_appendix = JSON.stringify(files); 
        }else if(formName == 'meetingForm'){
          this.meetingForm.appendix = JSON.stringify(files);
        }else if(formName == 'announceForm'){
          this.announceForm.announce_appendix = JSON.stringify(files);
        }   
      },
      showApplyDialog(){
        if(this.approveForm.user_id.length){
          this.dialogApproveVisible = true;
        }else{
          this.$message('请选择申请人');
        }   
      }, 
      /*
       * 多选申请人
       */
      handleSelectionChange(val){
        let creatorList = [], creatorNameList = [];
        val.forEach((item) => {
          creatorList.push(item.creator);
          creatorNameList.push(item.creator_name)
        })
        this.approveForm.user_id = creatorList;
        this.applyCreator = creatorNameList.join(',');
      },
      /*
       * 显示弹框
       */
      showDialog(data, type){ 
        if(type == 'inspect'){
          this.inspectForm.apply_man = data.id;
          this.inspectForm.creator = data.creator;
          this.dialogInspectVisible = true;
        }else if(type == 'meeting'){
          this.meetingForm.apply_man = data.id;
          this.meetingForm.creator = data.creator;
          this.dialogMeetingVisible = true;
        }else if(type == 'announce'){
          this.announceForm.people_id = data.id;
          this.announceForm.user_id = [data.id];
          this.announceForm.creator = data.creator;
          this.dialogAnnounceVisible = true;
        }else if(type == 'approve'){
          this.approveForm.user_id = [data.creator];
          this.applyCreator = data.creator_name
          this.dialogApproveVisible = true;
        }
      },
      /**
       * 党委审批
       */
      submitApprove(formName,type) {   
        let url = type == 'commit' ? `${this.common.basePath}/conference/approve/commit_approve` : `${this.common.basePath}/conference/approve/refuse_approve`;

        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( url,  this.approveForm).then( (response) => { 
              this.$message.success(response.meta.message);
              this.loading = false;
              this.dialogApproveVisible = false;
              this.getQueryApplysData();
            }).catch( (error) => { 
              this.loading = false;
              this.$message.error(error) 
              this.dialogApproveVisible = false; 
            });  
          } else { 
            return false;
          }
        }); 
      },
      /**
       * 考察
       */
      submitInspect(formName,type) {   
        let url = type == 'commit' ? `${this.common.basePath}/conference/inspect/commit_inspect` : `${this.common.basePath}/conference/inspect/refuse_inspect`; 
        
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( url,  this.inspectForm).then( (response) => { 
              this.$message.success(response.meta.message);
              this.loading = false;
              this.dialogInspectVisible = false;
              this.getQueryApplysData();
            }).catch( (error) => { 
              this.loading = false;
              this.$message.error(error) 
              this.dialogInspectVisible = false; 
            });  
          } else { 
            return false;
          }
        }); 
      }, 
      /**
       * 会议
       */
      submitmeeting(formName,type){
        let url = type == 'commit' ? `${this.common.basePath}/conference/meeting/commit_meeting` : `${this.common.basePath}/conference/meeting/refuse_meeting`; 
       
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( url,  this.meetingForm).then( (response) => { 
              this.$message.success(response.meta.message);
              this.loading = false;
              this.dialogMeetingVisible = false;
              this.getQueryApplysData();
            }).catch( (error) => { 
              this.loading = false;
              this.$message.error(error) 
              this.dialogMeetingVisible = false; 
            });  
          } else { 
            return false;
          }
        }); 
      }, 
      /**
       * 公示
       */
      submitAnnounce(formName,type){
        let url = type == 'commit' ? `${this.common.basePath}/conference/announce/commit_announce` : `${this.common.basePath}/conference/announce/refuse_announce`; 
       
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post( url,  this.announceForm).then( (response) => { 
              this.$message.success(response.meta.message);
              this.loading = false;
              this.dialogAnnounceVisible = false;
              this.getQueryApplysData();
            }).catch( (error) => { 
              this.loading = false;
              this.$message.error(error) 
              this.dialogAnnounceVisible = false; 
            });  
          } else { 
            return false;
          }
        }); 
      }
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