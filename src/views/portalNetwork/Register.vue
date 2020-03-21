<template>
  <!--登录 -->
  <Register @successSun="registerSuccess"></Register>
</template>

<script> 
  import Register from '../../components/Register.vue'
  export default {
    data() { 
      return { 
      };
    },
    components: {
      Register
    },
    created () {
       
    },
    mounted () {
    },
    methods: {
      /*
       * 登录成功 跳转第一个页面
       */
      registerSuccess(data){   
        this.$router.push({path: '/login'});
      }
    },
  }
</script>

<style scoped lang="less">
</style> 