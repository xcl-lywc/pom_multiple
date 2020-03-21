<template>
  <component :is="layout" name="layout"></component>
</template>
<script>  
  import BlankLayout from "./layout/BlankLayout.vue";
  import OrgNavLayout from "./layout/OrgNavLayout.vue";
  import PartyNavLayout from "./layout/PartyNavLayout.vue";

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
        "partynav-layout": PartyNavLayout, 
    }
  }
</script>
<style lang="less"> 
</style>
