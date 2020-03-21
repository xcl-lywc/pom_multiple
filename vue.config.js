let objectProject = {
  index: { //默认一个首页方便页面默认跳转必须为index文件
    entry: 'src/views/index/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: 'Index Page',
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  }, 
  total: { //首页
    entry: 'src/views/total/main.js', 
    template: 'src/public/total.html', // 模板来源
    filename: 'total.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'total Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'total']
  },
  orgIndex: { //组织工作台
    entry: 'src/views/orgIndex/main.js', 
    template: 'src/public/orgIndex.html', // 模板来源
    filename: 'orgIndex.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'orgIndex Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'orgIndex']
  },
  workbenchArticle: { //工作台文章管理
    entry: 'src/views/workbench/article/main.js',
    template: 'src/public/workbenchArticle.html',
    filename: 'workbenchArticle.html',
    title: 'workbenchArticle Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'workbenchArticle']
  },
  workbenchMetting: { //会议管理
    entry: 'src/views/workbench/metting/main.js',
    template: 'src/public/workbenchMetting.html',
    filename: 'workbenchMetting.html',
    title: 'workbenchMetting Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'workbenchMetting']
  },
  workbenchOrganizationalStructure: { //工作台组织管理
    entry: 'src/views/workbench/organizationalStructure/main.js',
    template: 'src/public/workbenchOrganizationalStructure.html',
    filename: 'workbenchOrganizationalStructure.html',
    title: 'workbenchOrganizationalStructure Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'workbenchOrganizationalStructure']
  },
  exhibitionHome: { //展示台首页以及后台管理系统融为一体
    entry: 'src/views/exhibition/home/main.js',
    template: 'src/public/exhibitionHome.html',
    filename: 'exhibitionHome.html',
    title: 'exhibitionHome Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'exhibitionHome']
  }, 
  exhibitionJustLook: { //展示文章首页以及其他的内容，只展示
    entry: 'src/views/exhibition/justLook/main.js',
    template: 'src/public/exhibitionJustLook.html',
    filename: 'exhibitionJustLook.html',
    title: 'exhibitionJustLook Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'exhibitionJustLook']
  }, 
  pmdSystem: { //党员发展系统
    entry: 'src/views/pmdSystem/main.js',
    template: 'src/public/pmdSystem.html',
    filename: 'pmdSystem.html',
    title: 'pmdSystem Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'pmdSystem']
  },
  portalNetwork: { //门户网
    entry: 'src/views/portalNetwork/main.js',
    template: 'src/public/portalNetwork.html',
    filename: 'portalNetwork.html',
    title: 'portalNetwork Page', 
    chunks: ['chunk-vendors', 'chunk-common', 'portalNetwork']
  },
  course: { //学习平台---课程
    entry: 'src/views/studyPlatform/course/main.js', 
    template: 'src/public/course.html', // 模板来源
    filename: 'course.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'course Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'course']
  },
  knowledge: { //学习平台---知识
    entry: 'src/views/studyPlatform/knowledge/main.js', 
    template: 'src/public/knowledge.html', // 模板来源
    filename: 'knowledge.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'knowledge Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'knowledge']
  },
  exam: { //学习平台---考试
    entry: 'src/views/studyPlatform/exam/main.js', 
    template: 'src/public/exam.html', // 模板来源
    filename: 'exam.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'exam Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'exam'] 
  }, 
  task: { //任务
    entry: 'src/views/task/main.js', 
    template: 'src/public/task.html', // 模板来源
    filename: 'task.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'task Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'task'] 
  },
  feedback: { //反馈系统
    entry: 'src/views/feedback/main.js', 
    template: 'src/public/feedback.html', // 模板来源
    filename: 'feedback.html', // 在 dist/index.html 的输出
    // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'feedback Page',
    // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'feedback'] 
  } 
  
}
let page = {}
let projectname = process.argv[3] // 获取执行哪个文件 
if (process.env.NODE_ENV == 'development') {
  page = objectProject
} else {
  page[projectname] = objectProject[projectname]
}
module.exports = {
  lintOnSave:false,//关闭eslint规范
  publicPath: './', // 官方要求修改路径在这里做更改，默认是根目录下，可以自行配置
  outputDir: 'dist/'+projectname, //标识是打包哪个文件
  //默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  filenameHashing: true,
  pages: page,
  productionSourceMap: false,// 生产环境 sourceMap 
  devServer: {
    // open: true, // 项目构建成功之后，自动弹出页面 
    port: 8081, // 端口号，默认8080
    https: false, // 协议
    hotOnly: false, // 没啥效果，热模块，webpack已经做好了
    proxy: { 
      '/api': {
        target: 'http://192.168.31.10:19999', 
        pathRewrite: {'^/api' : ''}, //重定向
        secure: false
      },
      '/ws': {
        target: 'http://192.168.31.10:19999',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/ws' : ''}, //重定向
        secure: false
      },
      '/chat': {
        target: 'http://192.168.31.10:19007',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/chat' : ''}, //重定向
        secure: false
      }
    }
  } 
}
