<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">UiHome</router-link> |
      <router-link to="/about">UiAbout</router-link>
    </div>
    <div>
      <a href="exhibitionHome.html">exhibitionHome.html(展示页面和操作页面)</a> 
      <br/>
      <a href="workbenchArticle.html">workbenchArticle.html（管理文章）</a> 
      <br/>
      <a href="workbenchOrganizationalStructure.html">workbenOrg.html（管理组织）</a>
      <br/>
      <a href="course.html">course.html(课程)</a>
      <br/>
      <a href="exam.html">exam.html(考试)</a>
      <br/>
      <a href="knowledge.html">knowledge.html(知识点)</a>
      <br/>
      <a href="portalNetwork.html">portalNetwork.html（门户网）</a> 
      <br/>
      <a href="exhibitionJustLook.html">exhibitionJustLook.html(文章展示页面)</a> 
      <br/> 
      <a href="workbenchMetting.html">workbenchMetting.html(会议页面)</a> 
      <br/>
      <a href="pmdSystem.html">pmdSystem.html(党员发展系统)</a>
      <br/>  
      <a href="task.html">task.html(任务)</a> 
      <br/>
      <a href="feedback.html">feedback.html(反馈系统)</a> 
    </div>
    <!-- <router-view/> -->
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
