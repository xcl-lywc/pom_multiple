/*!
 * bpmn activiti 流程图 编辑页面
 * @date    2019-10-22T10:14:18+0800
 * @author  chaunlin.Xiao
 * @version v1.0.0 (2019/10/22)
 * @company chuangxiangyuan
 */
<template>
  <div class="BPMN" v-loading="isLoading">
    <el-container>
      <!-- 菜单 -->
      <el-aside width="200px" class="menu-box">
        <h4>模版列表<i class="el-icon-refresh-right cursor-pointer font-color-primary" @click="getModelList(true);"></i></h4>
        <el-menu
          v-if="activeModel"
          :default-active="activeModel"
          class="el-menu-vertical-demo"
          @select="handleSelect">
          <el-menu-item index="new|创建新模板">
            <i class="el-icon-circle-plus"></i>
            <span slot="title">创建新模板</span>
          </el-menu-item>
          <div v-for="(item,index) in modelList">
            <el-menu-item :index="item.id+'|'+item.name">
              <i class="el-icon-location"></i>
              <span slot="title">{{item.name}}</span>
              <i class="el-icon-magic-stick fr mart18" @click.stop="deployModel(item.id)" title="部署"></i>
            </el-menu-item>
          </div>
        </el-menu>
        <div v-else class="no-data">
          暂无数据
        </div>
        <!-- <el-button  class="no-data" type="primary" size="small" plain @click="dialogType=1;$refs['createform'] ? $refs['createform'].resetFields():'';createDialogVisible=true;">创建模版</el-button> -->
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header-box">
          <span v-if="activeModel">{{activeModel.split('|')[1]}}</span>
          <span v-else>流程图</span>
        </el-header>
        <!-- 容器 -->
        <el-main class="container-box">
          <div class="containers" ref="content">
            <div class="canvas" ref="canvas" :style="{'background':color}"></div>
            <div id="js-properties-panel" ref="panel" class="panel" v-show="isShowPanel"></div>
          </div>
        </el-main>
        <!-- 操作区 -->
        <el-footer class="operate-box">
          <div id="operate_bpmn" class="operate">
            <el-button type="primary" size="small" plain @click="PleaseFillInId();">{{activeModel==='new|创建新模板'?'创建模版':'保存模版'}}</el-button>
            <!-- <el-button type="primary" size="small" plain @click="downloadModel(activeModel.split('|')[0])">从服务器下载模版</el-button> -->
            <a ref="saveDiagram" href="javascript:">本地下载画板（Xml）</a>
            <a ref="saveSvg" href="javascript:">本地下载画板（SVG）</a>
            <!-- <el-button type="primary" size="small" plain @click="BpmnUpload">上传当前工作流</el-button> -->
            <!-- <el-button type="primary" size="small" plain @click="uploadFile">上传Zip文件</el-button> -->
            <!-- <el-button type="primary" size="small" v-if="type==='Viewer'" plain @click="changeStatus('Modeler')">编辑</el-button> -->
            <!-- <el-button type="primary" size="small" v-if="type==='Modeler'" plain @click="changeStatus('Viewer')">预览</el-button> -->
            <!-- <el-button type="danger" size="small" round @click="isShowPanel=!isShowPanel" class="fr panel-btn" v-if="isShowPanelBtn">{{!isShowPanel?'显示面板':'隐藏面板'}}</el-button>
            <el-color-picker
              class="color-picker-position fr"
              v-model="color"
              @active-change="color=$event"
              show-alpha
              :predefine="predefineColors">
            </el-color-picker> -->
          </div>
        </el-footer>
      </el-container>
    </el-container>
    
    <el-dialog
      :title="dialogType===1?'创建模版':'保存模版'"
      :visible.sync="createDialogVisible"
      width="500px"
      center>
      <el-form
        :model="createform" 
        ref="createform"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' },]">
          <el-input v-model="createform.name" class="w300" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item 
          label="Key"
          prop="key"
          :rules="[{ required: true, message: '请输入Key', trigger: 'blur' },]">
          <el-input v-model="createform.key" class="w300" placeholder="建议英文 + 数字，例如：test01"></el-input>
        </el-form-item>
        <el-form-item 
          label="类型"
          prop="category"
          :rules="[{ required: true, message: '请选择类型', trigger: 'change' },]">
          <el-select v-model="createform.category" placeholder="请选择类型" class="w300">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['createform'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" size="small" @click="submitCreate('createform')" v-if="dialogType===1">创 建</el-button>
        <el-button type="primary" size="small" @click="submitSave('createform')" v-if="dialogType===2">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  // 引入相关的依赖
  
  import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'// 预览，建模依赖，可拖拽
  /*import BpmnViewer from 'bpmn-js/lib/Viewer'// 预览，建模依赖，不可拖拽*/
  import BpmnModeler from 'bpmn-js/lib/Modeler'// 编辑，建模依赖
  /*import BpmnModeler from './bpmn/customBpmn/custom/index.js'// 编辑，自定义形状，建模依赖*/

  import BpmnModeling from 'bpmn-js/lib/features/modeling/Modeling'// 增加事件监听器在Modeling里时使用

  import propertiesPanelModule from 'bpmn-js-properties-panel'// js属性面板

  /*import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda/index.js'// (camunda)基于bpmn-js-properties-panel的节点属性面板,与propertiesPanelModule搭配使用*/
  import propertiesProviderModule from './bpmn/resourse/activiti/index.js'// (activiti)基于bpmn-js-properties-panel的节点属性面板,与propertiesPanelModule搭配使用
  // import propertiesCustomModule from './bpmn/customBpmn/custom/custom-panel/index.js'// 基于bpmn-js-properties-panel自定义的节点属性面板,与propertiesPanelModule搭配使用
  import myCustomPanel from './bpmn/customBpmn/custom/custom-panel/customPanel.js'// 完全自定义的节点属性面板,不与propertiesPanelModule搭配使用

  import activitiModdleDescriptor from './bpmn/resourse/activiti.json'// activti模块解析引擎

  // 引入bpmn公共方法
  import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

  // 引入.bpmn文件(diagrsamXML、如果需要外部引入.bpmn文件来渲染流程图，需要安装raw-loader来处理)

  // 引入自定义的附加或扩展模块
  import customElementsModule from './bpmn/customElements/index.js';// 自定义工具栏和节点形状
  import customTranslate from './bpmn/customTranslate/customTranslate.js';// 汉化，自定义翻译

  export default {
    name:'BPMN',
    data(){
      return {
        isLoading:false,
        type:'Modeler',// 'Modeler'与'Viewer'
        // bpmn建模器
        bpmnModeler: null,
        container: null,
        canvas: null,
        customTranslateModule:null,
        defaultXmlStr:
        '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">\n'+
          '<process id=""/>\n'+
          '<bpmndi:BPMNDiagram>\n'+
            '<bpmndi:BPMNPlane bpmnElement=""/>\n'+
          '</bpmndi:BPMNDiagram>\n'+
        '</definitions>\n',// 默认的XML字符串
        xmlStr:'',//XML字符串
        encodedData: null,// 下载用的编码数据
        // 点击节点获取的数据
        nodeCode: "",
        nodeName: "",
        // 是否隐藏js属性面板
        isShowPanel:true,
        // 控制是否显示该按钮
        isShowPanelBtn:true,
        // cancas背景色选择器
        color: '#fff',
        predefineColors: [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585',
          'rgba(255, 69, 0, 0.68)',
          'rgb(255, 120, 0)',
          'hsv(51, 100, 98)',
          'hsva(120, 40, 94, 0.5)',
          'hsl(181, 100%, 37%)',
          'hsla(209, 100%, 56%, 0.73)',
          '#c7158577',
          '#fff'
        ],

        modeType:1,// 1表示切换模版列表，2表示切换编辑和预览模式
        activeModel:'new|创建新模板',// 被激活的模版
        modelList:[],// 模版列表

        createDialogVisible:false,// 创建模版
        dialogType:1,// 1创建模版，2保存模版
        dialogLoading:false,
        formLabelWidth: '100px',
        createform:{
          category:null,//string
          id: null,//string
          key: null,//string
          name: null,//string
          tenantId: null,//string
          xmlResource: null,//string
        },
        options: [
          {
            id: '1',
            name: '类型 A'
          }, {
            id: '2',
            name: '类型 B'
          }, {
            id: '3',
            name: '类型 C'
          }, {
            id: '4',
            name: '类型 D'
          }
        ],
      }
    },
    methods:{  
      /**
       * 获取模版列表
       * init true初始化；false刷新
       * @return {[type]} [description]
       */
      getModelList(init){ 
        this.isLoading = true;
        let form = {
          category: null,
          id: null,
          key: null,
          name: null,
          tenantId: null
        }
        this.axios.post(`${this.common.basePath}/activiti/repository/list`,form).then((response) => {
          this.modelList = response.data;
          let firstModel = response.data?response.data[0]:null;//第一个模版
          if(init&&firstModel){
            this.activeModel = firstModel.id+'|'+firstModel.name;
            this.getModelXmlStr(firstModel.id);
          }
          // this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 获取模版详情
       * @author chuanlin.Xiao
       * @date   2019-10-17T16:37:51+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      getModelDetail(id){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/model/detail`,{params:{id:id}}).then((response) => {
          this.createform = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 模版列表的激活事件
       * @param  {[type]} active     [description]
       * @param  {[type]} activePath [description]
       * @return {[type]}         [description]
       */
      handleSelect(active, activePath) {
        this.modeType = 1;
        this.activeModel = active;
        if(active==="new|创建新模板"){
          this.xmlStr = this.defaultXmlStr;
          this.buildModel(this.type,this.xmlStr);//建模
        }else{
          this.getModelXmlStr(active.split('|')[0]);
        }
        
      },
      /**
       * 切换编辑与预览状态
       * @author chuanlin.Xiao
       * @date   2019-10-22T11:31:51+0800
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      changeStatus(type){
        this.type=type;
        this.modeType = 2;

        let xmlStr = this.defaultXmlStr;
        console.log('===============================')
        console.log(this.bpmnModeler)
        this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          console.log(xml)
          xmlStr=xml;
        });
        console.log('===============================')

        this.activeModel!='new|创建新模板'?this.getModelXmlStr(this.activeModel.split('|')[0]):this.buildModel(type,xmlStr);
      },
      /**
       * 从服务器下载模版，文件流
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      downloadModel(id){ 
        this.isLoading = false;
        this.axios.get(`${this.common.basePath}/activiti/repository/download`,{params:{id:id},responseType:'blob'}).then((response) => {
          if(response.data.type==='text/xml'){
            var blob = new Blob([response.data]);//文件流
            var fileName = 'download.bpmn';//文件名
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            if ('download' in document.createElement('a')) { // 非IE下载
              var downloadElement = document.createElement('a');//创建a标签
              downloadElement.href = href;
              downloadElement.download = fileName; //下载后文件名
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
            } else { // IE10+下载
              navigator.msSaveBlob(blob, 'download.bpmn')
            }
          }else{
            this.$message.error('下载失败！！！')
          }

          // this.blobToDataURI(new Blob([response.data]))
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 从服务器获取xmlStr
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      getModelXmlStr(id){ 
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/resource`,{params:{id:id}}).then((response) => {

          let xmlStr = response.data?response.data:this.defaultXmlStr;
          if(this.modeType==2){
            console.log('===============================')
            console.log(this.bpmnModeler)
            this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
              console.log(xml)
              xmlStr=xml;
            });
            console.log('===============================')
          }
          this.xmlStr = xmlStr;
          
          console.log(this.xmlStr)
          this.buildModel(this.type,this.xmlStr);//建模
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 文件流转换为base64
       * @param  {[type]} blob [description]
       * @return {[type]}      [description]
       */
      blobToDataURI(blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          console.log(e.target.result)
        }
      },
      /**
       * 部署模版
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      deployModel(id){ 
        if(this.bpmnModeler._definitions.rootElements[0].id===''){
          this.$message({type:'warning',message:'请填写流程编号!!!'});
          return;//中断后续操作
        }else{
          this.isLoading = false;
          this.axios.post(`${this.common.basePath}/activiti/repository/deploy?id=${id}`).then((response) => {
            console.log(response)
            this.isLoading = false;
          }).catch((error) => {
            this.$message.error(error);
            this.isLoading = false;
          });
        }
      },
      /**
       * 创建模版，先画流程图，然后保存信息
       * @return {[type]} [description]
       */
      createModel(){ 
        // this.isLoading = true;
        // let form = {
        //   category: this.createform.category,
        //   key: this.createform.key,
        //   name: this.createform.name,
        //   tenantId: this.createform.tenantId,
        //   xmlResource: this.createform.xmlResource,
        // }
        // this.axios.post(`${this.common.basePath}/activiti/repository/create`,form).then((response) => {
        //   this.getModelList(true);//刷新
        //   this.createDialogVisible = false;
        //   this.$message({type:'success',message:'创建模版成功！'});
        //   this.isLoading = false;
        // }).catch((error) => {
        //   this.$message.error(error);
        //   this.isLoading = false;
        // });
        let xmlStr = '';
        this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          console.log(xml)
          xmlStr=xml;
        });
        this.dialogLoading = true;
        let form = {
          // id:this.activeModel.split('|')[0],
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
        }
        this.axios.post(`${this.common.basePath}/activiti/repository/save`,form).then((response) => {
          this.getModelList(false);//刷新
          // this.getModelXmlStr(this.activeModel.split('|')[0]);//刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'创建模版成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 创建模版
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitCreate(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createModel();
          } else {
            return false;
          }
        });
      },
      /**
       * 保存模版，根据id保存该模版的xml至服务器
       * @return {[type]} [description]
       */
      saveModel(){ 
        let xmlStr = '';
        this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          console.log(xml)
          xmlStr=xml;
        });
        this.dialogLoading = true;
        let form = {
          id:this.activeModel.split('|')[0],
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
        }
        this.axios.post(`${this.common.basePath}/activiti/repository/save`,form).then((response) => {
          this.getModelList(false);//刷新
          this.getModelXmlStr(this.activeModel.split('|')[0]);//刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'保存模版xml至服务器，成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 保存模版
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitSave(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveModel();
          } else {
            return false;
          }
        });
      },
      /**
       * 请填写id
       * @author chuanlin.Xiao
       * @date   2019-10-18T14:15:06+0800
       */
      PleaseFillInId(){
        if(this.bpmnModeler._definitions.rootElements[0].id===''){
          this.$message({type:'warning',message:'请填写流程编号!!!'});
          return;//中断后续操作
        }else{
          this.activeModel!='new|创建新模板'?this.getModelDetail(this.activeModel.split('|')[0]):'';
          this.activeModel==='new|创建新模板'?this.dialogType=1:this.dialogType=2;
          this.$refs['createform'] ? this.$refs['createform'].resetFields():'';
          this.createDialogVisible=true;
        }
      }, 
      /*
       bpmnModel 
       *********************************************************/
      //建模
      buildModel(type,xmlStr){
        if(type==='Modeler'){//能编辑
          this.panel.innerHTML = "";//清空该节点下所有的子节点
          this.canvas.innerHTML = "";//清空该节点下所有的子节点
          this.isShowPanelBtn = true;
          this.isShowPanel = true;
          this.bpmnModeler = new BpmnModeler({
            container: this.canvas,
            keyboard: {
              bindTo: window
            },
            //添加控制板
            propertiesPanel: {
              parent: '#js-properties-panel'
            },
            //附加模块
            additionalModules: [

              // myCustomPanel,// 完全自定义的属性面板
              propertiesProviderModule,// 基于propertiesPanelModule的属性面板
              // propertiesCustomModule,// 基于propertiesPanelModule自定义节点属性面板
              
              propertiesPanelModule,//属性面板

              this.customTranslateModule,// 汉化模块
              customElementsModule,//自定义工具栏和节点形状
            ],
            //扩展模块
            moddleExtensions: {
              activiti: activitiModdleDescriptor
            },
          });
        }else{//不能编辑
          this.panel.innerHTML = "";//清空该节点下所有的子节点
          this.canvas.innerHTML = "";//清空该节点下所有的子节点
          this.isShowPanelBtn = false;
          this.isShowPanel = false;
          this.bpmnModeler = new BpmnViewer({
            container: this.canvas,
            keyboard: {
              bindTo: document
            },
            bpmnRenderer: {//bpmn样式渲染更改
              // defaultFillColor: '#333',
              // defaultStrokeColor: '#ff4500'
            },
            textRenderer: {//text样式渲染更改
              defaultStyle: {
                fontFamily: '"Nothing You Could Do"',
                fontWeight: 'bold',
                fontSize: 12,
                // lineHeight: 16
              },
              externalStyle: {
                fontSize: 12,
                // lineHeight: 16
              }
            }
          });
        }

        // 下载画板
        let _this = this
        // 获取a标签dom节点
        const downloadLink = this.$refs.saveDiagram;
        const downloadSvgLink = this.$refs.saveSvg;
        // 给图绑定事件，当图有发生改变就会触发这个事件
        this.bpmnModeler.on('commandStack.changed', function () {
          _this.saveSVG(function (err, svg) {
            _this.setEncoded(downloadSvgLink, 'activiti.svg', err ? null : svg)
          })

          _this.saveDiagram(function (err, xml) {
            _this.setEncoded(downloadLink, 'activiti.bpmn', err ? null : xml)
          })
        });

        //创建新的画板（切换模版时，xml取自服务器；切换编辑和预览状态时，xml取自本地） 
        this.createNewDiagram(type,xmlStr);
        
      },
      // 创建画板
      createNewDiagram(type,xmlStr) {
        const that = this;
        const bpmnXmlStr = xmlStr;
        // 将Xml字符串转换成图显示出来 (与后台交互获取到bpmnXmlStr并显示出来)
        this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
          if (err) {
            console.error(err);
          }else {
            // 字符串转换成图成功后执行的函数
            that.success(type)
          }

          // 让图能自适应屏幕
          var canvas = that.bpmnModeler.get('canvas');
          canvas.zoom('fit-viewport');

          // 写死的某几个节点和线
          // const nodeCodes = ['StartEvent_1','Task_0qg0mca','Task_0307aue'];
          // const colorClass = 'nodeSuccess';
          // that.setNodeColor(nodeCodes, colorClass, canvas);
          // const nodeCodes2 = ['SequenceFlow_1u5gq9e','SequenceFlow_1n5pril'];
          // const colorClass2 = 'lineSuccess';
          // that.setNodeColor(nodeCodes2, colorClass2, canvas);
        })
      },
      // 通过与后台交互获取到已经走过的流程然后上色(这里是写死的某几个节点和线)
      setNodeColor(nodeCodes, colorClass, canvas){
        for(let i = 0; i < nodeCodes.length; i++) {
          // canvas.addMarker(nodeCodes[i], colorClass);
        }
      },
      // 转换成图的成功事件
      success(type) {
        const bpmnjs = this.bpmnModeler;
        const eventBus = bpmnjs.get('eventBus');
        const elementFactory = bpmnjs.get('elementFactory');
        if(type==='Modeler'){
          const commandStack = bpmnjs.get('commandStack');//仅Modeler需引入
          const bpmnRules = bpmnjs.get('bpmnRules');//仅Modeler需引入
          this.addBpmnListener(this, new BpmnModeling(eventBus,elementFactory,commandStack,bpmnRules));//增加事件监听器在Modeling里
          this.dubbleQueryInfo();
          this.colorEvent();
        }else{
          // this.setLineColor('Task_0307aue','RED', this, new BpmnModeling(eventBus,elementFactory));
          this.addBpmnListener(this, new BpmnModeling(eventBus,elementFactory));//增加事件监听器在Modeling里
        }    
      },
      // 增加事件监听器在Modeling里 ,通过点击事件获取到具体某个节点的信息
      addBpmnListener(_self,modeling) {
        const bpmnjs = this.bpmnModeler;
        const eventBus = bpmnjs.get('eventBus');
        const events = [
          'element.click',
          'element.dblclick'
        ];
        events.forEach(function(event) {
          eventBus.on(event, function(e) {
            //bpmn:Lane bpmn:SequenceFlow bpmn:Task bpmn:SequenceFlow bpmn:ExclusiveGateway
            //bpmn:Process
            // console.log(event + '   ' + JSON.stringify(e.element));
            if(e.element.type=='bpmn:Process'||e.element.type=='bpmn:Lane')
              return;

            var elementRegistry = bpmnjs.get('elementRegistry');
            var shape = elementRegistry.get(e.element.id);
            // console.log(shape)
            // 改变颜色
            // modeling.setColor(shape,{ stroke:'RED' });
            // 通过点击获取节点id和节点名称
            _self.nodeCode = shape.businessObject.id;
            _self.nodeName = shape.businessObject.name;
            console.log(shape.businessObject)  
            console.log(_self.nodeCode)
            console.log(_self.nodeName)
          })       
        })
      },
      //用户右键单击元素，获取信息
      dubbleQueryInfo(){
        const moddle = this.bpmnModeler.get('moddle'),
              modeling = this.bpmnModeler.get('modeling');
        this.bpmnModeler.on('element.contextmenu', 1500, (event) => {
          event.originalEvent.preventDefault();
          event.originalEvent.stopPropagation();
          if(event.element.type=='bpmn:Process'||event.element.type=='bpmn:Lane')
              return;
          console.log(event)
        });
      },
      //颜色(通过与后台交互获取到已经走过的流程然后上色)
      colorEvent(){
        const viewer = this.bpmnModeler;
        var overlays = viewer.get('overlays'),
            canvas = viewer.get('canvas'),
            elementRegistry = viewer.get('elementRegistry'),
            modeling = viewer.get('modeling');

        // Option 1: Color via Overlay
        // var shape = elementRegistry.get('Task_1ymuvem');
        // console.log(shape)
        // var div = document.createElement("div");
        // div.className = 'highlight-overlay';
        // div.style.width = shape.width+'px';
        // div.style.height = shape.height+'px';
        // var $overlayHtml = div;
        // overlays.add('Task_1ymuvem', {
        //   position: {
        //     top: 0,
        //     left: 0
        //   },
        //   html: $overlayHtml
        // });

        // Option 2: Color via BPMN 2.0 Extension
        // var elementToColor = elementRegistry.get('StartEvent_1');
        // modeling.setColor([ elementToColor ], {
        //   stroke: 'green',
        //   fill: 'rgba(0, 80, 0, 0.4)'
        // });

        // Option 3: Color via Marker + CSS Styling
        // canvas.addMarker('Task_0ho18x0', 'highlight');
      },

      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG (done) {
        // 把传入的done再传给bpmn原型的saveSVG函数调用
        this.bpmnModeler.saveSVG(done)
      },
      // 下载为Xml格式,done是个函数，调用的时候传入的
      saveDiagram (done) {
        let this_ = this;
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          console.log(xml)
          done(err, xml)
          if (xml) {
            // this_.setEncoded(this.$refs.saveDiagram, 'diagram.bpmn', xml)
          } 
        })
      },
      // 当图发生改变的时候会调用这个函数，这个data就是图的xml
      setEncoded (link, name, data) {
        // 把xml转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data);
        // 获取到图的xml，保存就是把这个xml提交给后台
        this.xmlStr = data
        // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
        if (data) {
          link.className = 'active'
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          link.download = name
        }
      },

      // 上传文件
      uploadFile (file) {
        this.$emit('fileUpload', file)
        return false
      },
      // 点击按钮触发上传当前工作流
      BpmnUpload () {
        // this.$emit('BpmnSave', this.encodedData)
      },
    },
    mounted(){
      
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      this.canvas = this.$refs.canvas;
      // 获取到属性ref为“panel”的dom节点
      this.panel = this.$refs.panel;
      // 定义声明汉化模块
      this.customTranslateModule = {
        translate: [ 'value', customTranslate ]
      };
      this.getModelList(true);
      // this.buildModel('Modeler',this.defaultXmlStr);//建模

      // this.bpmnModeler.detach();//动态分离面板
      // this.bpmnModeler.attachTo('#el');//动态连接到某个元素上
    }
  }
  
</script>

<style lang="less">
  @import './bpmn/bpmn.less';
</style>
