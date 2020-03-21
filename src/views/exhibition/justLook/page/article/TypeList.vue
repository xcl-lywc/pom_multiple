/**********************************
*  create by xieyuanyuan date 2018/05/04
*  首页 - 分类树
**********************************/   
<template>
  <div class="type-wrap"> 
    <el-tree
      ref="tree"
      :expand-on-click-node="false"
      :data="treeData"
      :props="treeProps"
      node-key="atId"
      @node-click="typeclicked">
      <span class="tree-node" slot-scope="{ node, data }" @mouseover="active = data.atId" @mouseout="setActive">
        <span :class="{'active-node': active == data.atId}">{{ node.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  export default { 
    data () {
      return {
        active:     null,
        orgId:    sessionStorage.getItem('orgId'),
        treeData: null,
        treeProps: {
          children: 'atypes',
          label: 'atName'
        }
      } 
    }, 
    mounted () { 
      this.getTypeListData()
    },
    methods: {
      /**
       * 根据atId获取子分类列表
       * @return {[type]} [description]
       */
      getTypeListData () {
        let params = {
          params: {
            partyOrgId: this.orgId,
            isShow:     1,
          }
        }
        this.axios.get( `${this.common.basePath}/home/a_types/allarticletypes`,  params).then( (response) => {   
          this.treeData = response.data;
        }).catch( (error) => {  
          this.$message.error(error) 
        });    
      },
      typeclicked (data) {
        this.active = data.atId
        sessionStorage.setItem("typeName", data.atName)
        sessionStorage.setItem("typeId", data.atId)
        this.$router.push({name: 'MultiStoreyNewsList', params: {id: data.atId, name: data.atName}})
      },
      setActive () {
        let sessionId = JSON.parse(sessionStorage.getItem("typeId") || null)
        //初始化激活的Id 同时更新对应的名称typeName
        if(sessionId || this.$route.params.id) {
          this.active = sessionId || this.$route.params.id
        } else {
          this.active = null
        }

        if(this.$route.params.id) { //当返回到非主页并带有参数的页面时, 更新选中, 否则清空记住的类型信息
          sessionStorage.setItem("typeName", this.$route.params.name)
          sessionStorage.setItem("typeId", this.$route.params.id)
        } else {
          this.active = null
        }
      }
    }
  }
</script>

<style scoped>
  .active-node,
  .tree-node:hover {
    color: #dc3a3a;
  }
</style>

<style>
  .type-wrap .tree-node {
    width: 100%;
    height: 100%;
    line-height: 40px;
    text-align: left;
  }    
  .type-wrap .el-tree-node__content {
    height: 40px;
  }
  .type-wrap .tree-node {
    font-size: 17px;
    color: #000;
  }
</style>