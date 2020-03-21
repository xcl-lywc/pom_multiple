<template>
  <component :is="layout" name="layout"></component>
</template>
<script>  
  import BlankLayout from "../studyPublicFile/layout/BlankLayout.vue";
  import NavLayout from "../studyPublicFile/layout/NavLayout.vue";
  export default {  
   props: {
      layout: {
          type: String,
          default: "blank-layout"
      }
    },
    components: {
        "blank-layout": BlankLayout,
        "nav-layout": NavLayout, 
    }
  }
</script>
<style lang="less"> 
</style>