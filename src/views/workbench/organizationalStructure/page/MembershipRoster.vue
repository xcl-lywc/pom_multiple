/*********************成员名册*************************/
  Author: Yuanyuan.Xie
  Date:   2019.08.07
/****************************************************/
<template>
  <div v-loading="isLoad">
    <div class="mart20">
      <el-form class="demo-form-inline" :inline="true" :model="searchForm" label-width="100px">
        <el-row>
          <el-form-item label="姓名:">
            <el-input v-model="searchForm.realName"></el-input>
          </el-form-item>
          <el-form-item label="年龄区间:">
            <el-input-number :min="0" :max="searchForm.maxAge" v-model="searchForm.minAge"></el-input-number> 到 
            <el-input-number :min="0" v-model="searchForm.maxAge"></el-input-number> 
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getQueryUserList()">搜索</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-table
      :data="userList.rows"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="real_name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="180">
        <template slot-scope="scope">
          {{showNameByDictionaryId(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="出生年月">
        <template slot-scope="scope">
          {{common._convertDate(scope.row.birthday, 'yyyy.MM.dd')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="educational_background"
        label="学历"
        width="180">
        <template slot-scope="scope">
          {{showNameByDictionaryId(scope.row.educational_background )}}
        </template>
      </el-table-column>
      <el-table-column
        prop="highest_degree "
        label="学位"
        width="180">
        <template slot-scope="scope">
          {{showNameByDictionaryId(scope.row.highest_degree)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="highest_school "
        label="毕业院校"
        width="180"> 
      </el-table-column>
      <el-table-column
        prop="native_place"
        label="籍贯"
        width="180"> 
        <template slot-scope="scope">
          {{showNameByDictionaryId(scope.row.native_place)}}
        </template>
      </el-table-column> 
      <el-table-column
        prop="phone"
        label="手机"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone_num"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column 
        label="操作"
        width="180">
        <template slot-scope="scope"> 
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="text-right mart20"
      @size-change="handleSizeChange($event)"
      @current-change="handleCurrentChange($event)" 
      :page-sizes="elementPageData.defaultData.pageSizes"
      :page-size="elementPageData.defaultData.pageSizeDefault"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userList.total">
    </el-pagination>
  </div>
</template>

<script> 
  export default { 
    data() {
      return {
        isLoad:                     true,
        orgId:                      sessionStorage.getItem('orgId'),  
        loginInUserInfo:            JSON.parse(sessionStorage.getItem('loginInUserInfo')),   
        elementPageData: {               //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        searchForm:                 {
          pageNum:   this.common.elementPagination.pageNumDefault,
          pageSize:  this.common.elementPagination.pageSizeDefault,
          orgId:     sessionStorage.getItem('orgId'),
          realName:  null,
          minAge:    0,
          maxAge:    0,
        },
        userList:    {rows: [], total: 0},
        dictionary:  [],
      }
    },
    mounted() {
      this.getQueryUserList(); 
      this.getQueryDictionaryList();
    },
    methods: { 
      /*
       * 查询成员数据
       */
      getQueryUserList(){
        this.isLoad = true;
        this.axios.post( `${this.common.basePath}/user/user/list`, this.searchForm).then( (response) => {    
          this.userList = response.data;
          this.isLoad = false;
        }).catch( (error) => {   
          this.isLoad = false;
          this.$message.error(error); 
        });
      },
      /*
       * 查询字典
       */
      getQueryDictionaryList(){
        this.axios.post( `${this.common.basePath}/user/dictionary/type`, {}).then( (response) => {    
          this.dictionary = response.data.rows; 
        }).catch( (error) => {    
          this.$message.error(error); 
        });
      },
      /*
       * 字典Id查询字典对应的名字
       */ 
      showNameByDictionaryId(id){ 
        let name = null;
        this.dictionary.forEach( (item) => {
          if(id == item.id){  
            name = item.name;
          }
        })
        return name;
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