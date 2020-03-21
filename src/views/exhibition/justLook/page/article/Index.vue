<template>
  <div>
  	<el-container>
	  <el-aside width="200px" class="xie-asdie-type padt10"><TypeList></TypeList></el-aside>
	  <el-main class=" backgroundFFF border marl20"><router-view></router-view></el-main>
	</el-container> 
  </div>
  
</template>

<script>
  import TypeList from './TypeList.vue'
  export default {
    components: {
      TypeList
    },
  }
</script>