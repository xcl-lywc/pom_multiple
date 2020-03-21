/*!
 * bpmn activiti 流程图 预览页面
 * @date    2019-10-22T10:14:18+0800
 * @author  chaunlin.Xiao
 * @version v1.0.0 (2019/10/22)
 * @company chuangxiangyuan
 */
<template>
  <div class="BPMN" v-loading="isLoading">
    <el-container>
      <!-- 顶部 -->
      <el-header class="header-box">
        <span v-if="detail">{{detail.name}}</span>
        <span v-else>流程图</span>
        <i class="el-icon-refresh-right cursor-pointer font-color-primary" @click="getActiviti();"></i>
      </el-header>
      <!-- 容器 -->
      <el-main class="container-box">
        <div class="containers viewer-container" ref="content">
          <div class="canvas" ref="canvas"></div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  // 引入相关的依赖
  
  import BpmnViewer from 'bpmn-js/lib/NavigatedViewer'// 预览，建模依赖，可拖拽
  /*import BpmnViewer from 'bpmn-js/lib/Viewer'// 预览，建模依赖，不可拖拽*/

  import BpmnModeling from 'bpmn-js/lib/features/modeling/Modeling'// 增加事件监听器在Modeling里时使用

  // 引入bpmn公共方法
  import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

  // 引入.bpmn文件(diagrsamXML、如果需要外部引入.bpmn文件来渲染流程图，需要安装raw-loader来处理)

  export default {
    name:'BPMN',
    data(){
      return {
        activitiId:'15004',
        isLoading:false,
        // bpmn建模器
        bpmnModeler: null,
        container: null,
        canvas: null,
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
        detail:null,// 详情
      }
    },
    methods:{ 

      getActiviti(){
        this.getModelDetail(this.activitiId);
        this.getModelXmlStr(this.activitiId);
      },
      /**
       * 从服务器获取xmlStr
       * @param  {[type]} id [description] 15004
       * @return {[type]}    [description]
       */
      getModelXmlStr(id){ 
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/resource`,{params:{id:id}}).then((response) => {
          let xmlStr = response.data?response.data:this.defaultXmlStr;
          this.xmlStr = xmlStr; 
          console.log(this.xmlStr)
          this.buildModel(this.xmlStr);//建模
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 获取模版详情
       * @author chuanlin.Xiao
       * @date   2019-10-17T16:37:51+0800
       * @param  {[type]}                 id [description] 15004
       * @return {[type]}                    [description]
       */
      getModelDetail(id){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/model/detail`,{params:{id:id}}).then((response) => {
          this.detail = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
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
      /*
       bpmnModel 
       *********************************************************/
      //建模
      buildModel(xmlStr){
        this.canvas.innerHTML = "";//清空该节点下所有的子节点
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

        //创建新的画板
        this.createNewDiagram(xmlStr); 
      },
      // 创建画板
      createNewDiagram(xmlStr) {
        const that = this;
        const bpmnXmlStr = xmlStr;
        // 将Xml字符串转换成图显示出来 (与后台交互获取到bpmnXmlStr并显示出来)
        this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
          if (err) {
            console.error(err);
          }else {
            // 字符串转换成图成功后执行的函数
            that.success()
          }

          // 让图能自适应屏幕
          var canvas = that.bpmnModeler.get('canvas');
          canvas.zoom('fit-viewport');
        })
      },
      // 通过与后台交互获取到已经走过的流程然后上色(这里是写死的某几个节点和线)
      setNodeColor(nodeCodes, colorClass, canvas){
        for(let i = 0; i < nodeCodes.length; i++) {
          // canvas.addMarker(nodeCodes[i], colorClass);
        }
      },
      // 转换成图的成功事件
      success() {
        const bpmnjs = this.bpmnModeler;
        const eventBus = bpmnjs.get('eventBus');
        const elementFactory = bpmnjs.get('elementFactory');
        if(false){
          // const commandStack = bpmnjs.get('commandStack');//仅Modeler需引入
          // const bpmnRules = bpmnjs.get('bpmnRules');//仅Modeler需引入
          // this.addBpmnListener(this, new BpmnModeling(eventBus,elementFactory,commandStack,bpmnRules));//增加事件监听器在Modeling里
          // this.dubbleQueryInfo();
          // this.colorEvent();
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
    },
    mounted(){
      
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      this.canvas = this.$refs.canvas;
      this.getActiviti();
      // this.buildModel(this.defaultXmlStr);//建模

      // this.bpmnModeler.detach();//动态分离面板
      // this.bpmnModeler.attachTo('#el');//动态连接到某个元素上
    }
  }
  
</script>

<style lang="less">
  @import './bpmn/bpmn.less';
</style>
