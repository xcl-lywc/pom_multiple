/*********************文章报错*************************/
  Author: Yuanyuan.Xie
  Date:   2019.07.15
/****************************************************/
<template>
  <div v-loading="loading">
    <!-- 文章表格 -->
    <el-table
      ref="multipleTable"
      stripe
      :data="articleTableData.rows"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="multiSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="id"
        label="序号"
        width="55">
      </el-table-column>
      <el-table-column
        prop="errorContent"
        label="报错内容">
      </el-table-column>
      <el-table-column
        prop="creator"
        label="提错人"
        width="80">
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button @click="submitArticle(scope, 'single')" type="primary" size="small">发布</el-button> -->
          <el-button :disabled="scope.row.fromType != '1'" @click="clickEdit(scope)" type="default" size="small">修改</el-button>
          <el-button @click="showRejectDialog(scope)" type="danger" size="small">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="under-table">
      <!-- <el-button :disabled="multipleSelection.length <= 0" type="primary" @click="submitArticle(null, 'multi')">批量发布</el-button> -->
      <el-button :disabled="multipleSelection.length <= 0" type="danger" @click="rejectMulti">批量驳回</el-button>
    </div> 
    <!-- 分页 -->
    <div class="page-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[5, 10, 15]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="articleTableData.total">
      </el-pagination>
    </div>

    <!-- 驳回dialog -->
    <el-dialog
      title="驳回"
      width="35%"
      :visible.sync="rejectDialogVisible">
      <el-form ref="form" :model="rejectForm" size="small">
        <el-form-item>
          <el-input type="textarea" rows="5" v-model="rejectForm.rejectReason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectArticle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orgId:  sessionStorage.getItem('orgId'),     //党组织id
        articleTableData:  {//文章表格数据
          rows: [],
          total: null
        },  
        rejectDialogVisible: false,
        rejectForm: {
          rejectReason: null
        },
        tempChoosedItem:   [],  //当前选中
        
        multipleSelection: [],

        currentPage: 1,  //当前页
        perPage: 5,
        loading: false,
      }
    },
    mounted: function () {
      this.getTableData()
    },
    methods: {
      /**
       * 多选操作
       * @param  {array} array  当前选中的元素数组
       * @return none
       */
      multiSelectionChange (array) { 
        this.multipleSelection = []
        array.forEach(function(item, index) {
          this.multipleSelection.push(item.id)
        })
      },
      /**
       * 发布文章
       * @param  {object} item table Item(通过scope返回)
       * @return none
       */
      submitArticle (item, typeStr) { 
        let config = {
          method: "post",
          url:    `${this.common.basePath}/home/a_errors/examine`,
          data: {
            fromId: null,
            status: 2
          }
        }
        if(typeStr == "multi") {
          config.data.fromId = this.multipleSelection
        } else {
          config.data.fromId = [item.row.id]
        }
        this.$confirm("确定要发布吗?", "发布", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { // 点击确定
          this.axios[config.method]( config.url, config.data).then( (response) => {  
            this.$message({
              message: "发布成功!",
              type: "success"
            })
            this.getTableData()
          }).catch( (error) => {  
            this.$message.error(error); 
          }); 
        }).catch(() => {})
      },
      /**
       * 显示驳回dialog
       * @param  {object} item 当前操作的表格元素
       * @return none
       */
      showRejectDialog (item) {
        this.rejectForm.rejectReason = null;
        this.rejectDialogVisible     = true;
        this.tempChoosedItem         = item;
      },
      /**
       * 批量驳回
       * @return {[type]} [description]
       */
      rejectMulti () {
         this.$confirm("确定要驳回吗?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=> {
          this.rejectArticle(this.multipleSelection)
        }).catch(()=> {

        })
      },
      /**
       * 驳回文章
       * @param  {object} item table Item(通过scope返回)
       * @return none       
       * */
      rejectArticle (idArray) { 
        let config = {
          method: "post",
          url:    `${this.common.basePath}/home/a_errors/examine`,
          data: {
            fromId: idArray || [this.tempChoosedItem.row.id],
            status: 3
          }
        }
        this.axios[config.method]( config.url, config.data).then( (response) => {  
          this.$message({
            message: "驳回成功!",
            type: "success"
          })
          this.getTableData()
          this.rejectDialogVisible = false
        }).catch( (error) => {  
          this.$message.error(error); 
        });  
      },
      /**
       * 获取表格数据
       * @param  {需要查询的页码} page 默认不需要传,查询特定页则传入对应的页数
       * @return {[type]}      [description]
       */
      getTableData: function (page) { 
        this.loading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/home/a_errors/list`,
          params: {
            pageNum:  page || this.currentPage,
            pageSize: this.perPage,
            status:   1,
            fromType: 1,
            partyOrgId: this.orgId
          }
        }
        this.axios[config.method]( config.url, {params: config.params}).then( (response) => {  
          this.loading = false
          this.articleTableData = response.data.data
          if(response.data.data.rows <= 0 && this.currentPage > 0 ) {
            //当前页没有数据, 则查询前一页
            this.getTableData(this.currentPage -= 1)
          }
        }).catch( (error) => {  
          this.loading = false
          this.$message.error(error); 
        }); 
      },
      /**
       * 点击分页 > 每页条数的回调
       * @param  {number} val 每页的显示条数
       * @return none
       */
      handleSizeChange(val) {
        this.perPage = val
        this.getTableData()
      },
      /**
       * 点击分页 > 每页条数的回调
       * @param  {number} val 当前点击的页数
       * @return none
       */
      handleCurrentChange(val) {
        this.currentPage = val
        this.getTableData()
      },
      /**
       * 点击编辑按钮, 跳转
       * @param  {object} data 表格的scope对象
       * @return none
       */
      clickEdit (data) {
        if(data.row.fromType == "1") {
          this.$router.push({
            name: "Settings_Edit_Article",
            params: {id: data.row.fromId}
          })
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .type-text-in-table {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
  }
  .under-table {
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #fff;
  }
  .page-wrap {
    background: #fff;
    padding: 20px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>