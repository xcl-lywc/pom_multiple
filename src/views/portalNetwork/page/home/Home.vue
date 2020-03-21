/**************************************
*---------------------首页-----------*
***************************************/
<template>
  <div v-loading="loading" class="row pad-l20 pad-r20 mr-t5"  >
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card">
          <div slot="header" class="clearfix">
            <span>积分</span> 
          </div>
          <el-row>
            <el-col :span="13" class="border-right padr10">
              <div class="echart-box" ref="myechart"></div>
            </el-col> 
            <el-col class="padl10" :span="11" v-if="integralUHistory">
              <p class="marb10">积分获取历史</p>
              <div class="border pad10 mar5 integral-history-box">
                <p class="marb5" v-for="(item, index) in integralUHistory">
                  {{common._convertDate(item.createTime, 'yyyy.MM.dd hh:mm')}}
                  {{item.fraction}}
                  {{item.type}}
                  {{item.reason}} 
                </p>
              </div> 
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="never" class="box-card mart20">
          <div slot="header" class="clearfix">
            <span>我的组织</span> 
          </div>
          <div>
            <el-row :gutter="20">
              <el-col v-for="(item, index) in userOrg.rows" :key="index" :span="12" class="cursor-pointer">
                <div @click="goToHome(item.org_id)" class=" pad10 mart15 grid-content bg-purple-dark photo-message border">
                  <div class="photo"> 
                    <el-avatar v-if="item.photo" shape="square" :size="100" :src="item.photo"></el-avatar>
                    <el-avatar v-else shape="square" :size="100" icon="el-icon-user-solid"></el-avatar> 
                  </div>
                  <div class="other marl10">
                    <p class="home-org-title">{{item.org_name}}</p>
                    <p class="home-org-des">{{item.description}}</p>  
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card> 
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock></RightCanlendarBlock>
        <!-- 通知列表 -->
        <RightNoticeBlock></RightNoticeBlock>
        <!-- 代办事务列表 -->
        <RightAffairBlock></RightAffairBlock>
      </el-col>
    </el-row> 

  </div>
</template>

<script>  
  import RightCanlendarBlock from '../../components/RightCanlendarBlock.vue'
  import RightNoticeBlock from '../../components/RightNoticeBlock.vue'
  import RightAffairBlock from '../../components/RightAffairBlock.vue'
  export default { 
    components: {
      RightCanlendarBlock,
      RightNoticeBlock,
      RightAffairBlock
    },
    data() {
      return {
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录账号信息, 
        token:              sessionStorage.getItem('token'),    //框架的数据, 
        loading:            true,       //页面加载
        updatePwdDialogVisible: false,
        orgId:              sessionStorage.getItem('orgId'), 
        userOrg:            {rows: [], total: 0},
        integralUHistory:   null,  
        option:             {     //积分雷达图
          title: {
              text: '积分雷达图'
          },
          tooltip: {},
          legend: {
              data: ['学习', '工作', '阅读', '考核', '签到']
          },
          radar: { 
              name: {
                  textStyle: {
                      color: '#fff',
                      backgroundColor: '#999',
                      borderRadius: 3,
                      padding: [3, 5]
                 }
              },
              indicator: []
          },
          series: [{ 
            type: 'radar', 
            data : [
              {
                value : [],
                name : '预算分配（Allocated Budget）'
              }
            ]
          }]
        }, 
      }
    },
    mounted() { 
      this.util.connection();
      this.getQueryInduceIntegral();  
      this.getQueryIntegralUHistory(); 
      this.getQueryUserOrgList();   
    }, 
    methods: { 
      /*
       * 查询组织积分雷达图
       */
      getQueryInduceIntegral(){
        this.axios.post( `${this.common.basePath}/user/integralU/censusType`, {user_id: this.loginInUserInfo.id,} ).then( (response) => {  
          this.loading = false;
          this._convertIntegral(response.data);
          this.isShow = true
        }).catch( (error) => { 
          this.loading = false;
          this.$message.error(error) 
        }); 
      },  
      _convertIntegral(data){
        let numArray = [];
        data.forEach((item) => { 
          numArray.push(item.sum)
          this.option.radar.indicator.push({name: item.type, max: item.sum});
          this.option.series[0].data[0].value.push(item.sum);
        });
        // 大小排序
        numArray = numArray.sort(this.sortNumber);
        this.option.radar.indicator.forEach( (item) => {
          item.max = numArray[4];
        }) 

        let myechart = this.$echarts.init(this.$refs.myechart) //初始化一个echarts
        myechart.setOption(this.option)  //setOption 用this.option中的数据开始作图
      },
      sortNumber(a,b){
        return a - b
      },
      /*
       * 积分获取历史
       */
      getQueryIntegralUHistory(){
        this.axios.post( `${this.common.basePath}/user/integralU/history`, {userId: this.loginInUserInfo.id,} ).then( (response) => {  
          this.integralUHistory = response.data;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      },
      /*
       * 查询当前登录用户的组织列表
       */
      getQueryUserOrgList(){
        this.axios.post( `${this.common.basePath}/user/orgs/getAll`, {user_id: this.loginInUserInfo.id} ).then( (response) => {  
          this.userOrg = response.data;
        }).catch( (error) => { 
          this.$message.error(error) 
        }); 
      },  
      /*
       * 查询创建首页详情
       */
      goToHome(id){  
        this.axios.get(`${this.common.basePath}/home/home/detail`, {params: {orgId: id}}).then( (response) => { 
          if(response.data){ 
            this.common._redirect({params: {key: 'exhibitionJustLook_home', orgId: id}});
          }else{
            this.$message('还没有配置首页，请配置！！！')
          }
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
  .home-org-des{
    height: 128px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .home-org-title{
    font-weight: 700;
  }
</style>