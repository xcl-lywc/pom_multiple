/**************************************
*---------------------任务报表-----------*
***************************************/
<template>
  <div class="task-report" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <div class="overflow-hidden">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="fl mart8">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tasklist_'+CLASS }">{{taskCommon.returnTaskData(CLASS).name}}任务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/taskreport_'+CLASS }">任务分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select 
        v-model="task" 
        placeholder="请选择任务"
        size="small"
        class="fr"
        @focus="taskList.total===0 ? getTaskList() : ''"
        @change="task=$event">
        <el-option v-for="(item,index) in taskList.rows" :label="item.taskName" :value="item.id" :key="item.id"></el-option>
      </el-select>
    </div>
    <el-container class="table-container"  v-if="taskList.total==0">
      <el-row :gutter='20'>
        <el-col :span='12'>
          <el-header height="50px" class="line-height-50 mart10">
            <h4><i class="el-icon-s-data font-color-primary marr5"></i>任务概况</h4>
          </el-header>
          <el-main class="padrl20" v-if="">
            <el-card class="box-card">
              <general-chart className="general" :data="generalData"></general-chart>
            </el-card>
          </el-main>
        </el-col>
        <el-col :span='12'>
          <el-header height="50px" class="line-height-50 mart10">
            <h4><i class="el-icon-s-data font-color-danger marr5"></i>工作热度图</h4>
          </el-header>
          <el-main class="padrl20" v-if="">
            <el-card class="box-card">
              <thermal-chart className="thermal" :data="thermalData"></thermal-chart>
            </el-card>
          </el-main>
        </el-col>
      </el-row>
      <el-header height="50px" class="line-height-50 mart10">
        <h4><i class="el-icon-s-data font-color-success marr5"></i>近一年发布与完成对比图</h4>
      </el-header>
      <el-main class="padrl20" v-if="">
        <el-card class="box-card">
          <ratio-chart className="ratio" :data="ratioData_dimensions" :data_="ratioData_source"></ratio-chart>
        </el-card>
      </el-main>
    </el-container>
    <div class="table-container no-data text-center" v-else>暂无数据</div>
  </div>
</template>

<script>  
  import echarts from 'echarts'
  import GeneralChart from '../components/GeneralChart.vue'
  import ThermalChart from '../components/ThermalChart.vue'
  import RatioChart from '../components/RatioChart.vue'
  export default { 
    data() {
      return {
        CLASS:this.$route.path.split('_')[1],//class分类：inner---内部任务；up---上级任务；down---下级任务
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,

        task:null,
        taskList:{rows:[],total:0},
        generalData:[],
        thermalData:[],
        ratioData_dimensions:[],
        ratioData_source:[],
      }
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('task_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("task_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }

      // this.getTaskList();
      this.getGeneralData();
      this.getWorkingThermogram();
      this.getRatioData();
    },
    components: {
      GeneralChart,
      ThermalChart,
      RatioChart
    },
    methods: {
      /**
       * 获取内部任务列表
       * @return {[type]} [description]
       */
      getTaskList(){ 
        this.isLoading = true;
        this.axios.post(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/list`:`${this.taskCommon.basePath}/supAndSub/list`,{orgId:this.party_org_id,supOrSub:this.CLASS==='inner'?null:(this.CLASS==='up'?1:2)}).then((response) => {
          this.taskList = response.data;
          this.task = response.data.total>0?response.data.rows[0].id:null;
          if(this.taskList.total>0){
            this.getGeneralData();
            this.getWorkingThermogram();
            this.getRatioData();
          }
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },

      /**
       * 获取任务概况数据
       * @return {[type]}      [description]
       */
      getGeneralData(){
        let arr = [{name:'执行中',value:12},{name:'待审批',value:20},{name:'撤销',value:15},{name:'已完成',value:20},]
        this.generalData = arr;
      },

      /**
       * 获取工作热度图数据 
       * @return {[type]} [description]
       */
      getWorkingThermogram(){
        var plantCap = [
          {
            name: '党课学习',
            value: '150'
          }, 
          {
            name: '文章阅读',
            value: '115'
          }, 
          {
            name: '考核学习',
            value: '113'
          }, 
          {
            name: '反馈信息',
            value: '95'
          }, 
          {
            name: '会议通知',
            value: '92'
          }, 
          {
            name: '任务审批',
            value: '100'
          }, 
          {
            name: '党员发展',
            value: '120'
          }, 
          {
            name: '组织管理',
            value: '125'
          }
        ];
        var datalist = [
          {
            offset: [58, 58],
            symbolSize: 150,
            opacity: .95,
            color: 'rgba(33, 150, 243, 1)'
          },  
          {
            offset: [10, 43],
            symbolSize: 115,
            opacity: .84,
            color: 'rgba(156, 39, 176, 0.95)'
          }, 
          {
            offset: [83, 35],
            symbolSize: 113,
            opacity: .8,
            color: 'rgba(8,184,55, 0.95)'
          }, {
            offset: [36, 30],
            symbolSize: 95,
            opacity: .75,
            color: 'rgba(233, 30, 99, 0.90)'
          }, 
          {
            offset: [64, 25],
            symbolSize: 92,
            opacity: .7,
            color: 'rgba(255, 193, 5, 0.90)'
          }, 
          {
            offset: [32, 55],
            symbolSize: 100,
            opacity: .68,
            color: 'rgba(15,210,255, 0.85)'
          }, 
          {
            offset: [85, 72],
            symbolSize: 120,
            opacity: .7,
            color: 'rgba(255, 87, 34, 0.80)'
          },
          {
            offset: [20, 80],
            symbolSize: 125,
            opacity: .88,
            color: 'rgba(104,184,55, 0.95)'
          }
        ];
        var datas = [];
        for (var i = 0; i < plantCap.length; i++) {
            var item = plantCap[i];
            var itemToStyle = datalist[i];
            datas.push({
                name: item.value + '\n' + item.name,
                value: itemToStyle.offset,
                symbolSize: itemToStyle.symbolSize,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 14,
                            color:'#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: itemToStyle.color,
                        opacity: itemToStyle.opacity
                    }
                },
            })
        }
        this.thermalData = datas;
      },

      /**
       * 获取近一年发布与完成对比数据
       * @return {[type]}      [description]
       */
      getRatioData(){
        let obj = {
          dimensions: ['month', '发布', '完成'],
          source: [
            {month: '01月份', '发布': 43.3, '完成': 85.8},
            {month: '02月份', '发布': 83.1, '完成': 73.4},
            {month: '03月份', '发布': 86.4, '完成': 65.2},
            {month: '04月份', '发布': 72.4, '完成': 53.9},
            {month: '05月份', '发布': 43.3, '完成': 85.8},
            {month: '06月份', '发布': 83.1, '完成': 73.4},
          ]
        };
        this.ratioData_dimensions = obj.dimensions;
        this.ratioData_source = obj.source;
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .task-report{
    
  }
</style>