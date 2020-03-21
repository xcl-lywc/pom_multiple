<template>
  <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="文件文章" name="first"><article-home></article-home></el-tab-pane>
      <el-tab-pane label="组织结构" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="党建地图" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="网上党课" name="fourth">定时任务补偿</el-tab-pane>
      <el-tab-pane label="领导信箱" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
</template>

<script>   
  export default {
    components: { 
    },
    data() {
      return {
        activeName: 'first',
      }
    }
  }
</script>
