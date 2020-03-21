<template>
  <component :is="layout" name="layout"></component>
</template>
<script>  
  import BlankLayout from "./layout/BlankLayout.vue";
  import OrgNavLayout from "./layout/OrgNavLayout.vue";
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
        "orgnav-layout": OrgNavLayout, 
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
