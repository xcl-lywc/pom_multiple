/**************************************
*---------------------课程订单（课程订单）-----------*
***************************************/
<template>
  <div class="course-order" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="时间" prop="dataValue">
            <el-date-picker
              v-model="formInline.dataValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              size="small"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态" prop="order">
            <el-select v-model="formInline.order" placeholder="请选择订单状态" clearable @clear="formInline.order = null" @focus="selecMeuntArr.length==0 ? getSelectList() : ''">
              <el-option v-for="(item,index) in selecMeuntArr" :label="item.name" :value="item.status" :key="item.status"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="formInline.name" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.name = $event;getList();" @clear="formInline.name = null"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          class="table-area"
          :data="tableData.rows"
          stripe
          border
          max-height="600"
          style="width: 100%"
          v-loading="isTableLoading"
          :row-key="getRowKeys"
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column
            fixed
            type="selection"
            label=""
            :reserve-selection="true"
            width="55">
          </el-table-column> -->
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="l_title"
            label="课程名称"
            align="center"
            width="">
          </el-table-column>
          <el-table-column
            prop="creator"
            label="购买人"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="购买时间"
            align="center"
            width="">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.create_time, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="花费/元"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="cur_status"
            label="状态"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.cur_status === 0">未支付</span>
              <span v-if="scope.row.cur_status === 1">已支付</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button @click.native.prevent="delBtn(scope.row.id);" type="danger" size="mini">删除</el-button>
              <!-- <el-button @click.native.prevent="editId=scope.row.id;dialogType=2;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;getDetailInfo(scope.row.id);" type="primary" size="mini">编辑</el-button> -->
              <el-button @click.native.prevent="$message('暂无api')" type="primary" size="mini">修改订单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="fl btn-area">
          <!-- <el-button type="primary" size="small" @click="">批量编辑</el-button> -->
          <el-button type="success" size="small" @click="dialogType=1;$refs['form'] ? $refs['form'].resetFields():'';dialogVisible=true;">批量/单个添加订单</el-button>
          <el-button type="danger" size="small" @click="$message('暂无api')" :disabled="tableData.total===0">批量删除</el-button>
        </div>
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </el-footer>
    </el-container>
    <!-- 弹框 -->
    <el-dialog 
      :title="dialogType===1 ? '添加订单' : '编辑订单' " 
      :visible.sync="dialogVisible" 
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="课程" 
          prop="course"
          :rules="[{ required: true, message: '请选择课程', trigger: 'change' }]">
          <el-select class="w300" multiple v-model="form.course" placeholder="请选择课程" clearable @clear="form.course = null" @focus="options.length==0 ? getOptions() : ''">
          <el-option v-for="(item,index) in options" :label="item.l_title" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        isTableLoading:false,
        userInfo:null,//当前登陆用户信息
        elementPageData: { //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formInline: {
          dataValue: null,
          order: null,
          name: null,
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
        selecMeuntArr:[{name:'未支付',status:0},{name:'已支付',status:1}],//选择框的下拉选数组集合
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:null,

        //dialog
        dialogVisible: false,
        dialogType:1,//1添加，2编辑
        dialogLoading:false,
        form: {
          course:null,
        },
        options:[],//选择框的下拉选数组集合
        formLabelWidth: '100px',
        editId:null,//编辑表单的id
        detailInfo:null,
      };
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_course_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_course_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
      this.getUserInfo();
      this.getSelectList();
      this.getOptions();
    },
    methods: {
      
      /**
       * 数据多选
       * [handleSelectionChange description]
       * @param  {[type]} val [被选中数组数据]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
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
       * 获取订单列表
       * /order/find_order  管理员查询订单
       * /order/find_user_order  用户查询自己的订单
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTableLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/order/find_user_order`,this._serchformParms()).then((response) => {
          this.tableData = response.data;
          this.isTableLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTableLoading = false;
        });
      },
      _serchformParms(){
        return{
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          endTime: this.formInline.dataValue ? this.formInline.dataValue[1] : null,
          startTime: this.formInline.dataValue ? this.formInline.dataValue[0] : null,
          l_title: this.formInline.name,
          cur_status:this.formInline.order,
        }
      },
      /**
       * 查询当前登录用户信息
       * @return {[type]} [description]
       */
      getUserInfo(){
        this.axios.get(`${this.common.basePath}/user/user/loginUser`,{params:{}}).then((response) => {
          this.userInfo = response.data;
        }).catch((error) => {
          this.$message.error('error');
        });
      },
      /**
       * 获取订单状态下拉选
       * @return {[type]} [description]
       */
      getSelectList(){},
      /**
       * 获取课程下拉选
       * @return {[type]} [description]
       */
      getOptions(){
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_lecture`,{party_org_id:this.party_org_id}).then((response) => {
          this.options = response.data.rows;
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 提交添加或编辑订单的表单
       * @param  {[type]} formName [description]
       * @param  {[type]} type     1添加，2编辑
       * @return {[type]}          [description]
       */
      submitForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type === 2 ? this.edit() : this.add();
          } else {
            return false;
          }
        });
      },
      /**
       * 获取订单详情信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getDetailInfo(id){
        this.dialogLoading = true;
        this.axios.post(`${this.courseCommon.basePath}/lecture/select_by_id?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.form = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 编辑订单（管理员修改订单发货状态）
       * @return {[type]} [description]
       */
      edit(){
        let form = {
          l_title: this.form.l_title,
          // buyer:this.form.buyer,
          // cost:this.form.cost,
          id:this.editId,
        }
        this.axios.post(`${this.courseCommon.basePath}/lecture/update_lectureinfo`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 添加订单（根据已有课程添加订单）
       * @return {[type]} [description]
       */
      add(){
        this.axios.post(`${this.courseCommon.basePath}/order/create_order`,this.form.course).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '下单成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 点击删除订单
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      delBtn(id) {
        this.$message('暂无api');
        return;
        this.$confirm('是否执行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.del(id);
        }).catch(() => {});    
      },
      /**
       * 删除订单
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      del(id){
        this.axios.post(`${this.courseCommon.basePath}/lecture/delete_lecture?id=${id}`).then((response) => {
          this.getList();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      
     
    }
  }
</script>
<style lang="less" scoped>
  .course-order{
     
  }
</style>