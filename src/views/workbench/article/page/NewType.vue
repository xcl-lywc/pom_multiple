/*********************添加分类***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.08
/************************************************/
<template>
  <div v-loading="loading"> 
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>文章分类</span> 
          </div>
          <div class="button-group">
            <el-button type="primary" class="button-new-top-type" size="mini" @click="showTypeDialog('top', 'new')">添加顶层分类</el-button>
          </div> 
          <el-tree 
            ref="typeTree"
            v-if="typeList && typeList.length > 0"
            :data="typeList"
            v-loading="loading"
            node-key="atId"
            :props="defaultProps"
            :expand-on-click-node="false"
            draggable
            @node-drag-end="handleDragEnd">
            <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="showContorl(data)" @mouseout="tempAtId = null">
              <span @click="clickCheck(data)">{{ node.label }}</span>
              <span v-show="tempAtId == data.atId" class="tree-right-operate">
                <el-button
                  type="text"
                  size="mini"
                  @click="showTypeDialog('child', 'new', data)">
                  添加子分类
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="showTypeDialog('child', 'edit', data)">
                  编辑分类
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="data.atypes && data.atypes.length <= 0"
                  @click="() => deleteType(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>        
        </el-card> 
      </el-col>
      <el-col :span="14">
        <el-card class="box-card" v-if="activeTypeItem">
          <div slot="header" class="clearfix">
            <span>分类详情</span> 
          </div>
          <div>
            <p>分类名：{{activeTypeItem.atName}}</p>
            <p>创建时间：{{common._convertDate(activeTypeItem.createTime, 'yyyy.MM.dd')}}</p>
            <p>是否在首页展示：{{activeTypeItem.isShow ? '是' : '否'}} </p>
          </div>
        </el-card> 
      </el-col>
    </el-row>   
    <el-dialog
      :title="tempOperateType == 'new' ? '新增' : '编辑'"
      :visible.sync="typeDialogVisible"
      width="30%"
      >
      <el-form label-width="100px">
        <el-form-item :label="'分类名：'" required>
          <el-input v-model="typeName" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeDialogVisible = false">取 消</el-button>
        <el-button :disabled="!typeName" type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false, 
        orgId: sessionStorage.getItem("orgId"),
        typeList:    [],        //分类的树形结构
        defaultProps: {
          children: 'atypes',   //分类/专题树的配置
          label: 'atName'
        }, 
        typeName:          null,   //类型input名称
        tempLevel:         null,   //当前操作的层级 top顶层 child 子集
        tempAtId:          null,   //鼠标移动到对应的节点, 记录此节点atId, 显示对应的操作按钮
        tempOperateType:   null,   //当前操作模式 new新增 edit编辑
        tempOperateObj:    {},     //当前触发操作的data对象
        typeDialogVisible: false, 
        activeTypeItem:    null,   //当前被选中的类型数据
        
      }
    },
    mounted: function () {  
      this.getTypeList(null, `/home/a_types/allarticletypes`, "typeList")
    },
    methods: {
      /**
       * 获取分类(树)
       * @return none
       */
      getTypeList (atType, url, target) {  
        this.loading = true
        this.typeDialogVisible = false;
        let config = {
          url: this.common.basePath + url,
          method: 'get',
          params: {
            type: atType,
            partyOrgId: this.orgId,
          }
        }
        this.axios[config.method]( config.url, {params: config.params} ).then( (response) => {  
          this[target] = response.data;
          this.loading = false;
        }).catch( (error) => { 
          this.$message.error(error)
          this.loading = false;
        }); 
      },
      /**
       * 点击显示分类输入dialog
       * @param {string} typeStr  添加顶层top 或是 添加子集层 child
       * @param {string} operate  当前操作模式
       * @param {object} data     当前点击的对象data
       */
      showTypeDialog (typeStr, operate, data) {
        this.typeDialogVisible = true;
        this.typeName          = null;
        this.tempLevel         = typeStr;
        this.tempOperateObj    = data //保存当前操作的data
        this.tempOperateType   = operate
        if(operate == "edit") {
          this.typeName = data.atName
        }
      },
      /**
       * 点击确定, 添加/编辑 节点提交 (顶层/子集)
       */
      addType() { 
        let config = {}
        if (this.tempLevel == "top") {
          config.data = {
            atName:     this.typeName,
            atType:     "1",
            partyOrgId: this.orgId,
          }
        } else {
          config.data = {
            atName:   this.typeName,
            atType:   "1",
            parentId: this.tempOperateObj.atId,
            partyOrgId:    this.orgId
          }
        }

        if(this.tempOperateType == "new") {
          config.url    = `${this.common.basePath}/home/a_types/add`,
          config.method = "post"
        } else {
          config.url    = `${this.common.basePath}/home/a_types/${this.tempOperateObj.atId}`,
          config.method = "put"
          config.data = {
            atName: this.typeName,
            partyOrgId:  this.orgId
          }
        }
        
        this.axios[config.method]( config.url, config.data ).then( (response) => {  
           this.$message({
              message: "成功",
              type: "success"
            })
            //重新查询
            this.getTypeList(null, `/home/a_types/allarticletypes/from_org/${this.orgId}`, "typeList")
        }).catch( (error) => { 
          this.$message.error(error); 
        });  
      },

      deleteType(node, data) { 
        this.$confirm("确定删除吗?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let config = {
            url:    `${this.common.basePath}/home/a_types/${data.atId}`,
            method: "delete",
            data:   {partyOrgId: this.orgId}
          }

	        this.axios[config.method]( config.url, config.data).then( (response) => {  
	          this.$message.success("删除成功")
	          //重新查询
            this.getTypeList(null, `/home/a_types/allarticletypes`, "typeList")
	        }).catch( (error) => { 
	          this.$message.error(error); 
	        }); 

        }).catch((error) =>{ 
        })
      },
      /**
       * 鼠标浮动, 显示对应的编辑按钮
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      showContorl(data) {
        this.tempAtId = data.atId
      },
      editType () {

      },
      /*
       * 点击查看类型详情
       */
      clickCheck(ev){ 
        this.activeTypeItem = ev;
      }, 
      handleDragEnd(ev){
        this.axios.post( `${this.common.basePath}/home/a_types/sort`, this.typeList).then( (response) => {  
          this.$message.success(response.meta.message)
          //重新查询
          this.getTypeList(null, `/home/a_types/allarticletypes`, "typeList")
        }).catch( (error) => { 
          this.$message.error(error); 
        }); 
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .button-group {
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
  }
  .custom-tree-node .tree-right-operate {
    margin-left: 15px;
  }
</style>