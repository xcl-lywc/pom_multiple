/*********************首页设置***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.11
/************************************************/
<template>
  <div v-loading="isLoad" class="backgroundFFF pad20">
    <!-- 修改页面主题色 -->
    <ThemePicker v-if="homeData" :default="homeData.backGroundConfig"></ThemePicker>
    <!-- 系统概况 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统概况</span> 
      </div>
      <div class="echart-box" ref="myechart"></div>
    </el-card>
    <!-- 系统概况 -->
    <el-card class="box-card mart20">
      <div slot="header" class="clearfix">
        <span>会议列表</span> 
        <el-link type="primary" class="fr" @click="goToMetting()">更多</el-link>
      </div>
      <div>
        <el-row v-for="(item, index) in mettingList.rows" :key="index">
          <el-col :span="16">{{item.m_title}}</el-col>
          <el-col :span="8" class="text-right">
            {{common._convertDate(item.startTime, 'yyyy.MM.dd')}} ~ 
            {{common._convertDate(item.endTime, 'yyyy.MM.dd')}}
          </el-col>
        </el-row> 
      </div>
    </el-card>
  </div>
</template>

<script>
  import ThemePicker from '../../../../components/ThemePicker.vue'   

  export default {
    data() {
      return {
        isLoad:          true,
        homeData:        null, //首页数据
        orgId:           sessionStorage.getItem('orgId'), 
        mettingList:     {total: 0, rows: []}
      }
    },
    components: { 
      ThemePicker
    },
    watch: {
    },
    created () {
      
    },
    mounted () {
      this.getHomeSetting(); 
      this.echartBar();
      this.getQueryMettingList();
    },
    methods: {
      /*
       * 查询首页是否已经被配置过
       */
      getHomeSetting(){
        this.axios.get( `${this.common.basePath}/home/home/detail`, {params: {orgId: this.orgId}} ).then( (response) => {  
          this.homeData = response.data; 
          this.isLoad = false;
        }).catch( (error) => { 
          this.isLoad = false;
          this.$message.error(error); 
        });   
      }, 
      /**
       * 查询会议列表 
       */
      getQueryMettingList () {
        let params = {
          org_id: this.orgId,
          pageNum:  this.common.elementPagination.pageNumDefault,
          pageSize: this.common.elementPagination.pageSizeDefault,
        }
        
        this.loading = true  
        this.axios.post( `${this.common.basePath}/conference/meeting/select_meeting`, params ).then( (response) => {  
          this.mettingList  = response.data;
          this.loading = false
        }).catch( (error) => { 
          this.loading = false
          this.$message.error(error); 
        });   
      },
      /*
       * 柱状图
       */
      echartBar(){
        let option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        }; 
        let myechart = this.$echarts.init(this.$refs.myechart) //初始化一个echarts
        myechart.setOption(option)  //setOption 用this.option中的数据开始作图
      },
      goToMetting (){ 
        this.$router.push({path: '/metting/list'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .echart-box{
    width: 100%;
    height: 500px;
  }
</style>