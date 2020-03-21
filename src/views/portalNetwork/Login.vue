<template>
  <!--登录 -->
  <login @successSun="loginSuccess"></login>
</template>

<script> 
  import Login from '../../components/Login.vue'
  export default {
    data() { 
      return { 
      };
    },
    components: {
      Login
    },
    created () {
       
    },
    mounted () {
    },
    methods: {
      /*
       * 登录成功 跳转第一个页面
       */
      loginSuccess(data){   
        this.$router.push({path: '/home'});
      }
    },
  }
</script>

<style scoped lang="less">
</style> 