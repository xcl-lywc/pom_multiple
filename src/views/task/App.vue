<template>
  <component :is="layout" name="layout"></component>
</template>
<script>
  import BlankLayout from "./taskPublicFile/layout/BlankLayout.vue";
  import NavLayout from "./taskPublicFile/layout/NavLayout.vue";
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

