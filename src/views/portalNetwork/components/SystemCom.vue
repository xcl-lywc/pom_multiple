/**************************************
*---------------------系统-----------*
***************************************/
<template>
  <div v-loading="isLoad" class="row pad-l20 pad-r20 mr-t5"  v-if="orgList.rows.length">
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>组织结构</span> 
          </div>
          <el-row>
            <el-col :span="20" class="border-right padr10" v-if="orgInfo">
              <div class=" pad10 mart15 grid-content bg-purple-dark photo-message border">
                <div class="photo"> 
                  <el-avatar v-if="orgInfo.photo" shape="square" :size="100" :src="orgInfo.photo"></el-avatar>
                  <el-avatar v-else shape="square" :size="100" icon="el-icon-user-solid"></el-avatar> 
                </div>
                <div class="other marl10">
                  <p>机构名称：{{orgInfo.name}}</p>
                  <p>建立时间：{{common._convertDate(orgInfo.buildtime ? orgInfo.buildtime.date_time : '', 'yyyy.MM.dd')}}</p>  
                  <p>联系电话：{{orgInfo.phone}}</p>
                  <p>电子邮箱：{{orgInfo.mailbox}}</p>  
                  <p>办公地址：{{orgInfo.address}}</p> 
                </div>
              </div>
            </el-col> 
            <el-col class="padl10" :span="4">
              <p class="mar10"><el-button type="primary" @click="jumpPage('workbenchOrganizationalStructure_organizationstructure')">组织管理</el-button></p>
              <p class="mar10"><el-button type="primary" @click="jumpPage('workbenchArticle_home')">关联首页</el-button></p>
              <p class="mar10"><el-button type="primary" @click="jumpPage('course_courselearn')">课程资源</el-button></p>
              <p class="mar10"><el-button type="primary" @click="jumpPage('exam_itembank')">考核题库</el-button></p>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="box-card mart20">
          <div slot="header" class="clearfix">
            <span>工作概况</span> 
          </div>
          <div> 
          </div>
        </el-card> 
        <el-card shadow="never" class="box-card mart20">
          <div slot="header" class="clearfix">
            <span>组织申请</span>
          </div>
          <div v-if="approvalPersonList.total>0">
            <div v-for="item in approvalPersonList.rows">
              <el-card class="box-card marb10" shadow="never">
                <div>
                  <span style="color:#461EE8">{{item.realName}}</span> 申请加入{{orgInfo?orgInfo.name:''}}
                  <el-tag v-if="item.status===3" class="marl20" type="warning" size="small">申请被驳回</el-tag>
                  <el-tag v-if="item.status===2" class="marl20" size="small">申请已通过</el-tag>
                  <el-tag v-if="item.status===1" class="marl20" size="small">待审批</el-tag>
                  <el-button v-if="item.status===1" type="warning" @click="approvalPerson(item.id,3)" size="mini" class="fr marl10">驳回申请</el-button>
                  <el-button v-if="item.status===1" type="primary" @click="approvalPerson(item.id,2)" size="mini" class="fr">通过申请</el-button>
                </div>
              </el-card> 
            </div>
          </div>
        </el-card> 
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock :isOrg="true" :isComment="false" :nature="type" @orgChangeId="orgChangeIdFun" :orgList="orgList.rows"></RightCanlendarBlock>
        <!-- 通知列表 -->
        <RightNoticeBlock></RightNoticeBlock>
        <!-- 代办事务列表 -->
        <RightAffairBlock></RightAffairBlock>
      </el-col>
    </el-row> 
  </div>
</template>

<script>  
  import RightCanlendarBlock from './RightCanlendarBlock.vue'
  import RightNoticeBlock from './RightNoticeBlock.vue'
  import RightAffairBlock from './RightAffairBlock.vue'
  export default { 
    props: {
      type: {   //组织性质编号
        default: 2, 
      }
    },
    components: {
      RightCanlendarBlock,
      RightNoticeBlock,
      RightAffairBlock
    },
    data() {
      return {
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        token:              sessionStorage.getItem('token'),    //框架的数据, 
        isLoad:             true,       //页面加载
        updatePwdDialogVisible: false,
        orgId:              null, 
        orgInfo:            null, 
        orgList:            {rows: [], total: 0},
        approvalPersonList: {rows: [], total: 0},
      }
    },
    mounted() { 
      // this.util.connection();   
      this.getQueryOrgList();
    }, 
    methods: {    
      getQueryOrgInfo(){
        this.axios.get( `${this.common.basePath}/user/orgs/one`, {params: {id: this.orgId}} ).then( (response) => {   
          this.orgInfo = response.data;
          this.queryApprovalPersonList(response.data.id);
          this.isLoad = false;
        }).catch( (error) => {
          this.isLoad = false;    
          this.$message.error(error);
        }); 
      },
      orgChangeIdFun(id){
        this.orgId = id;
        this.getQueryOrgInfo();
      },
      /*
       * 根据组织性质查询组织列表
       */
      getQueryOrgList(){
        this.axios.post( `${this.common.basePath}/user/orgs/getAll`, {user_id: this.loginInUserInfo.id, nature: parseInt(this.type)}).then( (response) =>{
          this.orgList = response.data;
          if(response.data.rows.length){
            this.orgId = response.data.rows[0].org_id; 
            this.getQueryOrgInfo();
          }else{
            this.$message('当前性质下没有组织！');
          } 
        }).catch( (error) => {  
          this.$message.error(error); 
        });
      },
      jumpPage(pageName){
        // window.location.href = `/workbenOrg.html?token=${this.token}&orgId=${this.orgId}`;
        // return false;
        this.common._redirect({params: {key: pageName, orgId: this.orgId}});
      },


      /*
       * 根据组织查询申请人员列表
       */
      queryApprovalPersonList(id){
        this.axios.post( `${this.common.basePath}/user/approval/list`, this._approvalParams(id)).then( (response) =>{
          this.approvalPersonList = response.data;
        }).catch( (error) => {  
          this.$message.error(error); 
        });
      },
      _approvalParams(id){
        return{
          // endTime: "2019-09-06T01:56:24.060Z",
          org_id: id,
          // pageNum: 0,
          // pageSize: 0,
          // realName: "string",
          // startTime: "2019-09-06T01:56:24.060Z",
          // status: 0,
        };
      },
      /**
       * 组织申请审批
       * @param  {[type]} id     [description]
       * @param  {[type]} status 1审批中；3驳回；2通过
       * @return {[type]}        [description]
       */
      approvalPerson(id,status){
        this.axios.post( `${this.common.basePath}/user/approval/handle`, {ids:[id],status:status}).then( (response) =>{
          // this.orgList = response.data;
          status===2?this.$message.success('审批通过！'):this.$message.warning('审批驳回！');
          this.queryApprovalPersonList(this.orgInfo.id)
        }).catch( (error) => {  
          this.$message.error(error); 
        });
      },

    }
  }
</script>

<style lang="less">
  .echart-box{
    width: 100%;
    height: 500px;
  }
  .integral-history-box{
    height: 468px;
    overflow: auto;
  }
  .photo-message{ 
    display: inline-flex;
    width: 100%;
    .photo{
      img{
        width: 120px;
        height: 150px;
      }
    }
  }
</style>