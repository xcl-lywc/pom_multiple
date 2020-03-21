<template>
  <component :is="layout" name="layout"></component>
</template>
<script>  
  import BlankLayout from "./layout/BlankLayout.vue"; 
  import HomeNavLayout from "./layout/HomeNavLayout.vue";
  export default {  
   props: {
      layout: {
          type: String,
          default: "blank-layout"
      }
    },
    components: {
        "blank-layout": BlankLayout, 
        "homenav-layout": HomeNavLayout,
    },
    watch:  {
      $router(url){
        debugger
      }
    },
  }
</script>
<style lang="less"> 
</style>
