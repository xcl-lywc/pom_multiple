/*********************添加专题***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.11
/************************************************/
<template>
  <div v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>专题列表</span> 
          </div> 
          <div class="button-group">
            <el-button type="primary" class="button-new-top-type" size="mini" @click="showAddSpecial('new')">添加分类</el-button>
          </div> 
          <div> 
            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
              @select="selectFun" >
              <el-menu-item v-for="(item, index) in specialTags" :index="JSON.stringify(item)" > 
                <div class="custom-tree-node" @mouseover="hoverTypeId = item.atId" @mouseout="hoverTypeId = null">
                  <span slot="title" class="marr20">{{item.atName}}</span>
                  <span v-show="hoverTypeId == item.atId" class="tree-right-operate">
                    <el-button
                      type="text"
                      size="mini"
                      @click="showAddSpecial('edit', item)">
                      编辑专题
                    </el-button>
                    <el-button
                      type="text"
                      size="mini" 
                      @click="() => deleteSpecial( item)">
                      删除
                    </el-button>
                  </span>
                </div>  
              </el-menu-item>
            </el-menu> 

          </div>       
        </el-card> 
      </el-col>
      <el-col :span="14">
        <el-card class="box-card" v-if="activeTypeItem">
          <div slot="header" class="clearfix">
            <span>专题详情</span> 
          </div>
          <div>
            <p>分类名：{{activeTypeItem.atName}}</p>
            <p>创建时间：{{common._convertDate(activeTypeItem.createTime, 'yyyy.MM.dd')}}</p> 
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
        <el-form-item label="名称：" required>
          <el-input v-model="inputValue" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeDialogVisible = false">取 消</el-button>
        <el-button :disabled="!inputValue" type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orgId:             sessionStorage.getItem("orgId"),
        tempOperateType:   'new',
        typeDialogVisible: false,
        specialTags:       [], 
        inputValue:        '',
        loading:           false, 
        activeTypeItem:    null,
        hoverTypeItem:     null,
        hoverTypeId:       null,
      }
    },
    mounted: function () {
      this.getSpecialList();
    },
    methods: {
      /**
       * 获取专题列表
       * @return {[type]} [description]
       */
      getSpecialList () {
        
        this.loading = true
        let config = {
          url: `${this.common.basePath}/home/a_types/articletypes`,
          method: 'get',
          params: { type: "2" , partyOrgId: this.orgId}
        }
        this.axios[config.method]( config.url, {params: config.params} ).then( (response) => {  
          this.specialTags = response.data;
          this.loading = false
        }).catch( (error) => { 
          this.$message.error(error)
          this.loading = false
        });  
      }, 
      /**
       * 点击删除专题
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      deleteSpecial(tag) {
        
        this.$confirm('确认删除该专题吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( () => {
          let config = {
            url: `${this.common.basePath}/home/a_types/${tag.atId}`,
            method: 'delete',
            params: {partyOrgId: this.orgId}
          }
          this.axios[config.method]( config.url, {params: config.params} ).then( (response) => {  
            this.$message({
              message: "删除专题成功!",
              type: 'success'
            });
            this.specialTags.splice(this.specialTags.indexOf(tag), 1);
          }).catch( (error) => { 
            this.$message.error(error) 
          });
        })
      },
      /**
       * 点击添加专题, 显示输入框
       * @return {[type]} [description]
       */
      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      showAddSpecial(type, data){
        this.tempOperateType = type;
        this.typeDialogVisible = true;
        if(type == 'edit'){ 
          this.hoverTypeItem = data;
          this.inputValue = data.atName;
        } 
      },
      addType() {
        let inputValue = this.inputValue;
        
        if (inputValue) { 
          let config = {
            url:this.tempOperateType == 'new' ? `${this.common.basePath}/home/a_types/add` : `${this.common.basePath}/home/a_types/${this.hoverTypeItem.atId}` ,
            method: this.tempOperateType == 'new' ? 'post' : 'put',
            params: { 
              atName:     this.inputValue,
              atType:     "2",
              status:     1,
              partyOrgId: this.orgId,
            }
          }

          this.axios[config.method]( config.url, config.params ).then( (response) => {  
            this.$message({
              message: response.meta.message,
              type: 'success'
            });
            this.getSpecialList() //重新查询
            this.typeDialogVisible = false;
          }).catch( (error) => { 
            this.typeDialogVisible = false;
            this.$message.error(error);
          });
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      /**
       * 鼠标浮动, 显示对应的编辑按钮
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      showContorl(data) {
        this.tempAtId = data.atId
      },
      selectFun(data){ 
        this.activeTypeItem = JSON.parse(data);
      }
    }
  }
</script> 
<style scoped>
  .tips-title {
    margin-top: 0;
    color: #797979;
  }
  .special-tag {
    margin: 5px;
  }
  .new-special-btn:hover {
    cursor: pointer;
  }
  .el-tag {
    margin: 5px 10px 5px 0;
  }
  .button-new-tag {
    margin: 5px 10px 5px 0;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 150px;
    margin: 5px 10px 5px 0;
    vertical-align: bottom;
  }
</style>