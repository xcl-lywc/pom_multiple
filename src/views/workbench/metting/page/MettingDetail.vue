/*******************************************************
 * author yuanyuan.xie  会议列表 
 * date 2018/09/18
 *******************************************************/
<template>
  <div v-loading="loading" class="pad20">
    <!-- 会议详情 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>会议详情</span> 
      </div>
      <el-row :gutter="20" v-if="mettingInfo">
        <el-col :span="12" class="mart5">
          <p>会议标题：{{mettingInfo.m_title}}</p> 
        </el-col>
        <el-col :span="12" class="mart5">
          <p>开始时间：{{common._convertDate(mettingInfo.startTime, 'yyyy.MM.dd hh:mm:ss')}}</p>
        </el-col>
        <el-col :span="12" class="mart5"> 
          <p>会议地点：{{mettingInfo.m_title}}</p>
        </el-col>
        <el-col :span="12" class="mart5"> 
          <p>结束时间：{{common._convertDate(mettingInfo.endTime, 'yyyy.MM.dd hh:mm:ss')}}</p>
        </el-col>
        <el-col :span="24" class="mart5">
          <p>描述：{{mettingInfo.description}}</p> 
        </el-col>
        <el-col :span="24">
          <p v-if="mettingInfo.appendix">附件：
            <el-button 
              type="text" 
              v-for="(item, index) in JSON.parse(mettingInfo.appendix)" 
              :key="index" 
              @click="fileDownload(item.path)">{{item.fileName}}</el-button>
          </p> 
          <p v-else>附件： 无</p>
        </el-col> 
      </el-row>
    </el-card>
    <!-- 参会人员 -->
    <el-card class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>参会人员</span> 
      </div>
      <el-row :gutter="20"> 
        <el-col :span="24" v-if="peopleList"> 
          <div class="display-flex" v-if="peopleList.join">
            <div class="marr5">参加：</div>
            <div class="marr5" v-for="(item, index) in peopleList.join">
              <el-avatar class="marl5" v-if="item.picture" :src="item.picture"></el-avatar> 
              <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
            </div>
          </div>
          <div v-else>参加：无</div>

          <div class="display-flex" v-if="peopleList.not_join">
            <div class="marr5">不参加：</div>
            <div class="marr5" v-for="(item, index) in peopleList.not_join">
              <el-avatar class="marl5" v-if="item.picture" :src="item.picture"></el-avatar> 
              <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
            </div>
          </div>
          <div v-else>不参加：无</div>

          <div class="display-flex" v-if="peopleList.not_back">
            <div class="marr5">未回复：</div>
            <div class="marr5" v-for="(item, index) in peopleList.not_back">
              <el-avatar class="marl5" v-if="item.picture" :src="item.picture"></el-avatar> 
              <el-avatar v-else icon="el-icon-user-solid"></el-avatar> 
            </div>
          </div>
          <div v-else>未回复：无</div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 沟通记录 -->
    <el-card class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>沟通记录</span> 
      </div>
      <el-row :gutter="20"> 
        <el-col :span="24" v-if="peopleList"> 
          <el-tabs v-model="activeName" type="card" @tab-click="">
            <el-tab-pane label="参会人员" name="1">待开发</el-tab-pane>
            <el-tab-pane label="会务人员" name="2">待开发</el-tab-pane>
            <el-tab-pane label="通知通告" name="3">待开发</el-tab-pane> 
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script type="text/javascript">
  export default {  
    data() {
      return {
        loading:         true,  //等待事件
        loginInUserInfo: JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        orgId:           sessionStorage.getItem('orgId'),
        mettingId:       this.$route.params.mettingid,
        mettingInfo:     null,
        peopleList:      null,
        activeName:      '1',
      }
    },
    mounted(){ 
      this.getQueryMettingsInfo();
      this.getQueryMettingsPeopleList();
    },
    methods: { 
      /*
       * 查询会议详情 
       */
      getQueryMettingsInfo(){
        this.axios.post( `${this.common.basePath}/conference/meeting/meeting_info?id=${this.mettingId}`, '').then( (response) => {
          this.mettingInfo = response.data;
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        });  
      }, 
      /*
       * 参会人员名单 
       */
      getQueryMettingsPeopleList(){
        this.axios.post( `${this.common.basePath}/conference/meeting/people_list?id=${this.mettingId}`, '').then( (response) => {
          this.peopleList = response.data;
          this.loading = false;
        }).catch( (error) => {  
          this.loading = false;
          this.$message.error(error) 
        });  
      },  
      fileDownload(path){
        window.open(path);
      }
    }
  }
</script>