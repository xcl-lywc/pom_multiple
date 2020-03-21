/**************************************
*---------------------知识点列表（学科知识树）-----------*
***************************************/
<template>
  <div class="subject-knowledge-tree" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header height="">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="学科" prop="subject">
            <el-select v-model="formInline.subject" placeholder="请选择学科" clearable @clear="formInline.subject = null" @focus="selecMeuntArr.length==0 ? getSelectList() : ''">
              <el-option v-for="(item,index) in selecMeuntArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-button type="success" class="w100 marl20" size="small" @click="addS">添加学科</el-button>
      <el-main>
        <div class="tree-area" v-loading="isTreeLoading">
          <el-tree
            :props="knowledgeProps"
            :data="knowledgeArr"
            node-key="id"
            :indent='24'
            :expand-on-click-node="false"
            ref="knowledgeTree">
            <span class="my_custom-tree-node" slot-scope="{ node, data }" @mouseover=" tempAtId = data.id " @mouseout="tempAtId = null">
              <i class="fa marr10" :class="{'fa-bookmark':!data.parent_id,'fa-bookmark-o':data.parent_id}" aria-hidden="true"></i><span :class="{'font-weight-600':!data.parent_id}">{{ data.name }}</span>
              <span v-show="tempAtId == data.id" class="tree-left-operate">
                <span class="font-color-success marr20 font-size-12" @click="addNextK(data)">添加下级知识点</span>
                <span class="font-color-success marr20 font-size-12" @click="addSameK(data)" v-if="data.parent_id">添加同级知识点</span>
                <span class="font-color-primary marr20 font-size-12" @click="editS(data)" v-if="!data.parent_id">编辑学科</span>
                <span class="font-color-primary marr20 font-size-12" @click="editK(data)" v-if="data.parent_id">编辑知识点</span>
                <span class="font-color-danger font-size-12" @click="delS(data)" v-if="!data.parent_id">删除学科</span>
                <span class="font-color-danger font-size-12" @click="delK(data)" v-if="data.parent_id">删除知识点</span>
              </span>
            </span>
          </el-tree>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面        
        isLoading:false,
        isTreeLoading:false,
        formInline: {
          subject: null,
        },
        selecMeuntArr:[],//选择框的下拉选数组集合
        knowledgeArr:[],//知识树
        detailInfo:null,//知识详情
        tempAtId:null,//当前浮动选中的节点Id
        knowledgeProps: {
          label: 'name',
          children: 'childrens'
        },

      };
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_knowledge_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_knowledge_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
    },
    methods: {

      /**
       * 获取学科知识点树
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTreeLoading = true;
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_subject`,this._serchformParms()).then((response) => {
          this.knowledgeArr = response.data;
          this.isTreeLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTreeLoading = false;
        });
      },
      _serchformParms(){
        return{
          id: this.formInline.subject,
          party_org_id:this.party_org_id,
        }
      },
      /**
       * 获取科目的下拉选
       * @return {[type]} [description]
       */
      getSelectList(){
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_top_subject?id=${this.party_org_id}`).then((response) => {
          this.selecMeuntArr = response.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 获取详情信息
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getDetailInfo(id,type){
        this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/select_by_id?id=${id}`).then((response) => {
          this.detailInfo = response.data;

          //编辑学科或知识点
          this.$prompt(type===1?'学科名称':'知识点名称', type===1?'编辑学科':'编辑知识点', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: function(val){
              if(val===''||!val){return false}
            },
            inputErrorMessage: type===1?'请输入学科名称':'请输入知识点名称',
            inputValue:response.data.name,
            roundButton:false,
          }).then(({ value }) => {
            let form = {
              id:response.data.id,
              party_org_id:this.party_org_id,
              name: value,
            }
            this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/edit_by_id`,form).then((response) => {
              this.getList();//刷新
              this.$message({type: 'success',message: '成功!'});
            }).catch((error) => {
              this.$message.error(error);
            });
          }).catch(() => {});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 添加科目
       * @param {[type]} data [description]
       */
      addS(data){
        this.$prompt('学科名称', '添加学科', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(val){
            if(val===''||!val){return false}
          },
          inputErrorMessage: '请输入学科名称',
          roundButton:false,
        }).then(({ value }) => {
          let form = {
            party_org_id:this.party_org_id,
            name: value,
          }
          this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/create_subject`,form).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});
      },
      /**
       * 添加下级知识点
       * @param {[type]} data [description]
       */
      addNextK(data){
        this.$prompt('知识点名称', '添加知识点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(val){
            if(val===''||!val){return false}
          },
          inputErrorMessage: '请输入知识点名称',
          roundButton:false,
        }).then(({ value }) => {
          let form = {
            id:data.id,
            party_org_id:this.party_org_id,
            name: value,
          }
          this.axios.post(`${this.knowledgeCommon.basePath}/sonsubject/add_next_level`,form).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});
      },
      /**
       * 添加同级知识点
       * @param {[type]} data [description]
       */
      addSameK(data){
        this.$prompt('知识点名称', '添加知识点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: function(val){
            if(val===''||!val){return false}
          },
          inputErrorMessage: '请输入知识点名称',
          roundButton:false,
        }).then(({ value }) => {
          let form = {
            id:data.id,
            party_org_id:this.party_org_id,
            name: value,
          }
          this.axios.post(`${this.knowledgeCommon.basePath}/sonsubject/add_some_level`,form).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});
      },
      /**
       * 编辑学科
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      editS(data){
        this.getDetailInfo(data.id,1);
      },
      /**
       * 编辑知识点
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      editK(data){
        this.getDetailInfo(data.id,2);
      },
      /**
       * 删除学科
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      delS(data){
        this.$confirm('是否删除该学科?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/delete_by_id?id=${data.id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});  
      },
      /**
       * 删除知识点
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      delK(data){
        this.$confirm('是否删除该知识点?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.knowledgeCommon.basePath}/knowledge/delete_by_id?id=${data.id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {}); 
      },
     
    }
  }
</script>
<style lang="less" scoped>
  .subject-knowledge-tree{
    
  }
</style>