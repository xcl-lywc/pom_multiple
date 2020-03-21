/**************************************
*---------------------考试（考试活动）-----------*
***************************************/
<template>
  <div class="exam" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <div class="tabs-area exam-tabs-area" v-loading="isTabLoading">
      <div class="text-right overflow-hidden created-btn">
        <el-button type="success" size="small" @click="$refs['form'] ? $refs['form'].resetFields():'';form.join_org_name=null;tempAtId=null;isShowPN=false;personList=[];dialogVisible=true;getTestList();getOrgList(party_org_id)" class="marb10">创建考试</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="" tab-position="left">
        <el-tab-pane label="待审批" name="1">
          <div class="overflow-hidden" v-if="listData.total>0">
            <div class="overflow-hidden" v-for="(item,index) in listData.rows" :key='index'>
              <el-card class="box-card marb10">
                <el-row :gutter="20" class="marb10">
                  <el-col :span="8">
                    <span class="font-color-primary font-weight-600">{{item.theme}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建者：{{item.creator_name}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="marb10">
                  <el-col :span="24">
                    <span class="font-color-info">考试时间：{{common._convertDate(item.test_begin, 'yyyy/MM/dd hh:mm')}} ~ {{common._convertDate(item.test_end, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="font-size-14">参考情况：{{item.num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">参考人数：{{item.join_num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">总分：{{item.score}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" size="small" @click="$message('暂未实现')" v-if="exam_cur_status===4">查看详情</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="未开始" name="2">
          <div class="overflow-hidden" v-if="listData.total>0">
            <div class="overflow-hidden" v-for="(item,index) in listData.rows" :key='index'>
              <el-card class="box-card marb10">
                <el-row :gutter="20" class="marb10">
                  <el-col :span="8">
                    <span class="font-color-primary font-weight-600">{{item.theme}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建者：{{item.creator_name}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="marb10">
                  <el-col :span="24">
                    <span class="font-color-info">考试时间：{{common._convertDate(item.test_begin, 'yyyy/MM/dd hh:mm')}} ~ {{common._convertDate(item.test_end, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="font-size-14">参考情况：{{item.num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">参考人数：{{item.join_num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">总分：{{item.score}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" size="small" @click="$message('暂未实现')" v-if="exam_cur_status===4">查看详情</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="3">
          <div class="overflow-hidden" v-if="listData.total>0">
            <div class="overflow-hidden" v-for="(item,index) in listData.rows" :key='index'>
              <el-card class="box-card marb10">
                <el-row :gutter="20" class="marb10">
                  <el-col :span="8">
                    <span class="font-color-primary font-weight-600">{{item.theme}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建者：{{item.creator_name}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="marb10">
                  <el-col :span="24">
                    <span class="font-color-info">考试时间：{{common._convertDate(item.test_begin, 'yyyy/MM/dd hh:mm')}} ~ {{common._convertDate(item.test_end, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="font-size-14">参考情况：{{item.num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">参考人数：{{item.join_num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">总分：{{item.score}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" size="small" @click="$message('暂未实现')" v-if="exam_cur_status===4">查看详情</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结束" name="4">
          <div class="overflow-hidden" v-if="listData.total>0">
            <div class="overflow-hidden" v-for="(item,index) in listData.rows" :key='index'>
              <el-card class="box-card marb10">
                <el-row :gutter="20" class="marb10">
                  <el-col :span="8">
                    <span class="font-color-primary font-weight-600">{{item.theme}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建者：{{item.creator_name}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="font-color-info">创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="marb10">
                  <el-col :span="24">
                    <span class="font-color-info">考试时间：{{common._convertDate(item.test_begin, 'yyyy/MM/dd hh:mm')}} ~ {{common._convertDate(item.test_end, 'yyyy/MM/dd hh:mm')}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6">
                    <span class="font-size-14">参考情况：{{item.num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">参考人数：{{item.join_num}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="font-size-14">总分：{{item.score}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button type="primary" size="small" @click="$message('暂未实现')" v-if="exam_cur_status===4">查看详情</el-button>
                  </el-col>
                </el-row>
              </el-card>
            </div>
          </div>
          <div v-else class="no-data">
            暂无数据
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        class="fr mart10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="elementPageData.pageNum"
        :page-sizes="elementPageData.defaultData.pageSizes"
        :page-size="elementPageData.defaultData.pageSizeDefault"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listData.total">
      </el-pagination>
    </div>

    <!-- 弹框 -->
    <el-dialog 
      title="创建考试" 
      :visible.sync="dialogVisible" 
      top="5vh"
      width='950px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="考试主题" 
          prop="theme" 
          :rules="[{ required: true, message: '请输入考试主题', trigger: 'blur' }]">
          <el-input v-model="form.theme" class=""></el-input>
        </el-form-item>
        <el-form-item 
          label="考试要求" 
          prop="requirement"
          :rules="[{ required: true, message: '请输入考试要求', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.requirement" rows="5"></el-input>
        </el-form-item>
        <el-form-item 
          label="考试时间" 
          prop="test_time"
          :rules="[{ required: true, message: '请选择考试时间', trigger: 'blur' }]">
          <el-date-picker
            v-model="form.test_time"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            size="small"
            :picker-options="pickerOptions"
            @change="datatimerChange">
          </el-date-picker>
          <span class="font-color-info">（请输入当前时刻之后的日期时间）</span>
        </el-form-item>
        <el-form-item 
          label="考试试卷" 
          prop="test_id"
          :rules="[{ required: true, message: '请选择考试试卷', trigger: 'blur' }]">
          <el-select v-model="form.test_id" placeholder="请选择，可搜索" filterable clearable @clear="form.test_id=null" class="w-100">
            <el-option
              v-for="item in testList"
              :key="item.id"
              :label="item.theme"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item 
              label="参考组织" 
              prop="join_org_id"
              :rules="[{ required: true, message: '请选择考试试卷', trigger: 'blur' }]">
              <el-tag v-if="form.join_org_id&&form.join_org_name" closable @close="form.join_org_name=null;form.join_org_id=null;tempAtId=null;personList=[];form.test_man=[]">{{form.join_org_name}}</el-tag>
              <span v-else class="font-color-info">
                (请任意选择一个参考组织)
              </span>
              <el-link class="marl20" v-if="isShowPN" type="primary" @click="getOrgList_(form.join_org_id);">上一级</el-link>
              <el-link class="marl10" v-if="isShowPN" type="primary" @click="getOrgList(form.join_org_id);">下一级</el-link>
              <el-tree :data="orgList" :props="defaultProps" @node-click="">
                <div class="my_custom-tree-node" slot-scope="{ node, data }">
                  <i v-if="data.below" class="el-icon-caret-right marr10 fl" style="line-height: 20px;" @click="getOrgList(data.id);isShowPN=true;"></i>
                  <i v-else class="marr22 fl" style="line-height: 20px;"></i>
                  <div @click="tempAtId=data.id;form.join_org_id=data.id;form.join_org_name=data.name;getPersonList(data.id)" class="fl" style="line-height: 20px;width:80%">
                    <i class="el-icon-circle-check font-color-primary marr10" v-if="tempAtId===data.id"></i>
                    <span :class="{'font-color-primary':tempAtId===data.id}">{{ data.name }}</span>
                  </div>
                </div>
              </el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item 
              label="参考人员" 
              prop="test_man"
              :rules="[{ required: true, message: '请选择参考人员', trigger: 'blur' }]">
              <el-transfer 
                v-model="form.test_man" 
                :data="personList"
                :titles="[`可选人员`, '所选参考人员']"
                :props="{key: 'id',label: 'real_name'}">
              </el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="考试备注" 
          prop="description"
          :rules="[{ required: false, message: '请输入考试备注', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.description" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();form.join_org_name=null;tempAtId=null;isShowPN=false;personList=[];getOrgList(party_org_id)" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form')" size="small">创建试卷</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        isTabLoading:false,
        elementPageData: { //分页需要的数据
          defaultData:  this.studyCommon.elementPagination,
          pageNum:      this.studyCommon.elementPagination.pageNumDefault,
          pageSize:     this.studyCommon.elementPagination.pageSizeDefault,
        },
        activeName: '1',
        exam_cur_status:1,//考试状态（管理员）
        listData:{total:0,rows:[]},

        //dialog
        dialogVisible: false,
        dialogLoading:false,
        formLabelWidth:'100px',
        form: {
          theme: null,
          requirement:null,
          test_time:[],
          test_id: null,//考试试卷
          join_org_id:null,//参考组织id
          join_org_name:null,
          test_man:[],//参考人员的id串
          description:null,
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        testList:[],//试卷库列表
        orgList:[],//组织列表
        defaultProps: {
          children: 'childrens',
          label: 'name'
        },
        tempAtId:null,//当前浮动选中的节点Id
        isShowPN:false,//是否展示上一级和下一级
        personList:[],//某组织下的可选参考人员
      }
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_exam_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
    },
    destoryed() {
       
    },
    methods: {
      /**
       * tab切换
       * @param  {[type]} tab   [description]
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      handleClick(tab, event) {
        this.elementPageData.pageSize = 10;
        this.elementPageData.pageNum = 1;
        this.exam_cur_status = Number(tab.name);
        this.getList();
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.getList();
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.getList();
      },

      /**
       * 查询不同状态的考试列表（管理员）
       * @return {[type]} [description]
       */
      getList(){
        this.axios.post(`${this.examCommon.basePath}/exam/find_exam`,this._serchformParms()).then((response) => {
          this.listData = response.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      _serchformParms(){
        return{
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          cur_status: this.exam_cur_status,//1待审批，2未开始，3进行中，4已结束
          id:null,
        }
      },

      /**
       * 考试时间change事件，保证所选时间必须是未来时间
       * @return {[type]} [description]
       */
      datatimerChange(val){
        val&&val[0]>=new Date().getTime() ?'' :this.form.test_time = []; 
      },
      /**
       * 获取试卷库
       * @return {[type]} [description]
       */
      getTestList(){ 
        this.dialogLoading = true;
        this.axios.post(`${this.examCommon.basePath}/papers/find_testPapers`,{}).then((response) => {
          this.testList = response.data ? response.data.rows:[];
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 获取组织（下级）
       * @return {[type]} [description]
       */
      getOrgList(id){ 
        this.dialogLoading = true;
        this.axios.post(`${this.common.basePath}/user/orgs/children`,{orgId:id}).then((response) => {
          this.orgList = response.data ? response.data.rows:[];
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 获取组织（上级）
       * @return {[type]} [description]
       */
      getOrgList_(id){ 
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/user/orgs/superior`,{params:{orgId:id}}).then((response) => {
          this.orgList = response.data ? response.data.rows:[];
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 获取该组织相关人员
       * @return {[type]} [description]
       */
      getPersonList(id){ 
        this.dialogLoading = true;
        this.axios.post(`${this.common.basePath}/user/user/list`,{orgId:id}).then((response) => {
          this.personList = response.data ? response.data.rows:[];
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },

      /**
       * 创建试卷
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              now_group_id:this.party_org_id,
              description: this.form.description,
              party_org_id: this.form.join_org_id,
              requirement: this.form.requirement,
              test_begin: this.form.test_time[0],
              test_end: this.form.test_time[1],
              test_id: this.form.test_id,
              test_man: this.form.test_man.join(','),
              theme: this.form.theme,
            }
            this.axios.post(`${this.examCommon.basePath}/exam/create_exam`,form).then((response) => {
              this.getList();//刷新
              this.dialogVisible = false;
              this.$message({type: 'success',message: '成功!'});
            }).catch((error) => {
              this.$message.error(error);
            });
          } else {
            return false;
          }
        });
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .exam{
    .tabs-area{
      overflow:auto;
      padding:20px;
      box-sizing:border-box;
    }
  }
</style>