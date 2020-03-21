/*!
 * oa系统组件
 * @date    2019-10-31T10:11:28+0800
 * @author  chaunlin.Xiao
 * @version v1.0.0 (2019/10/31)
 * @company chuangxiangyuan
 */
<template>
  <div class="oa" v-loading="isLoading">
  	<el-button icon="el-icon-plus" @click="addOrEditMenu(1,'data')" type="success" size="mini marb15">创建OA系统</el-button>
  	<el-row :gutter="20">
  		<el-col :span="6">
  			<span>OA系统</span>
  			<el-menu
          style="min-width: 200px"
		      v-if="oamenuData.length>0"
		      :default-active="activeNav"
		      :default-openeds="openNav"
		      mode="vertical"
		      class="el-menu-vertical-demo"
		      @select="handleSelect"
		      background-color="#fff"
		      text-color="#000"
		      active-text-color="#409EFF">
		      <div v-for="(item,index) in oamenuData" :key="item.id">
		        <el-submenu :index="item.id+''" v-if="item.oaOptionVos.length>0">
		          <template slot="title">
		            <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null">
		              <i class="el-icon-location"></i>
		            	<span>{{item.menu_name}}</span>
		              <i class="el-icon-edit" style="padding-left: 10px;color:#2196f3;" v-show="tempAtId===item.id" @click.stop="addOrEditMenu(2,item)" title="编辑"></i>
		            </div>
		          </template>
		          <div v-for="(itemChild,indexChild) in item.oaOptionVos">
		            <el-menu-item  :index="itemChild.id+'-child'+itemChild.option_id">
									<template slot="title">
				            <div @mouseover=" tempAtId = null " @mouseout="tempAtId = null">
				              <span>{{itemChild.option_name}}</span>
				            </div>
				          </template>
		            </el-menu-item>
		          </div>
		        </el-submenu>
		        <el-menu-item :index="item.id+''"  v-else>
			        <template slot="title">
		            <div @mouseover=" tempAtId = item.id " @mouseout="tempAtId = null">
		              <i class="el-icon-location"></i>
		            	<span>{{item.menu_name}}</span>
		              <i class="el-icon-edit" style="padding-left: 10px;color:#2196f3;" v-show="tempAtId===item.id" @click.stop="addOrEditMenu(2,item)" title="编辑"></i>
		            </div>
		          </template>
			      </el-menu-item>
		      </div>
		    </el-menu>
		    <div class="no-data" v-else>
		      暂无数据
		    </div>
  		</el-col>
  		<el-col :span="18">
				<!-- 基本信息 -->
        <el-card class="box-card" shadow="hover" v-if="isMenuItem">
          <div slot="header">
            <span>基本信息</span>
          </div>
          <el-form label-width="100px" class="show-form" v-if="oamenuItemDetailData">
            <el-row :gutter='20'>
              <el-col :span="24">
                <el-form-item label="名称：">{{oamenuItemDetailData.oaOptionVo.option_name}}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="配置：">
                  <!-- {{oamenuItemDetailData.fieldVo.wf_config}} -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="no-data" v-else>
            暂无数据
          </div>
        </el-card>
        <!-- 流程图 -->
        <el-card class="box-card mart20" shadow="hover" v-if="isMenuItem">
          <div slot="header">
            <span>流程图</span>
          </div>
          <div v-if="oamenuItemDetailData">
            <BpmnModel ref="activiti_bpmn" :config="bpmnConfig" @communicationEvent="communicationEvent"></BpmnModel>
          </div>
          <div class="no-data" v-else>
            暂无数据
          </div>
          <div class="overflow-hidden marb15" v-if="oamenuItemDetailData">
            <el-button type="primary" size="small fl" icon="el-icon-edit" v-if="oamenuItemDetailData.oaOptionVo.act_deploy_id" @click="$refs.activiti_bpmn.initModel(bpmnConfig.defaultXmlStr)">重构</el-button>
            <el-button type="primary" size="small fr" icon="el-icon-edit" @click="createOrSaveProcess();" v-if="oamenuItemDetailData.oaOptionVo.act_deploy_id">保存</el-button>
            <el-button type="success" size="small fr" @click="createOrSaveProcess();" icon="el-icon-circle-plus-outline" v-else>创建</el-button>
            <el-button type="primary" size="small fr marr10" icon="el-icon-edit" v-if="bpmnConfig.type==='Viewer'&&oamenuItemDetailData.oaOptionVo.act_deploy_id" @click="changeStatus('Modeler')">编辑</el-button>
            <el-button type="primary" size="small fr marr10" icon="el-icon-view" v-if="bpmnConfig.type==='Modeler'&&oamenuItemDetailData.oaOptionVo.act_deploy_id" @click="changeStatus('Viewer')">预览</el-button>
          </div>
        </el-card>
        <div class="no-data" v-else>
          该菜单下没有菜单项！请配置！
        </div>
  		</el-col>
  	</el-row>

  	<!-- 添加或编辑oa -->
    <el-dialog 
      :title="dialogFormTitle[dialogFormType]" 
      :visible.sync="dialogFormVisible" 
      width='900px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-row :gutter="20" class="oa-dialog-container">
        	<el-form-item 
	          label="" 
	          prop="" 
	          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
	          <span v-if="dialogFormType===1">根节点添加/添加菜单/创建菜单</span>
	          <span v-if="dialogFormType===2">在原菜单的基础上，重选菜单项，编辑菜单相关信息</span>
	        </el-form-item>
        	<el-col :span="12">
		  			<el-form-item 
		          label="菜单名称" 
		          prop="menu_name" 
		          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
		          <el-input v-model="form.menu_name" class=""></el-input>
		        </el-form-item>
		        <el-form-item 
		          label="菜单描述" 
		          prop="menu_description"
		          :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },
		          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
		          <el-input type="textarea" v-model="form.menu_description" rows="5"></el-input>
		        </el-form-item>
		  		</el-col>
		  		<el-col :span="12">
		  			<el-form-item 
		          label="菜单项" 
		          prop="checkList" 
		          :rules="[{ required: true, message: '请选择菜单项', trigger: 'blur' }]">
		          <el-menu
					      v-if="menuData.length>0"
					      mode="vertical"
					      class="el-menu-vertical-demo"
					      background-color="#fff"
					      text-color="#000"
					      active-text-color="#409EFF">
					      <div v-for="(item,index) in menuData" :key="item.id">
					      	<el-checkbox-group v-model="form.checkList">
					        <el-submenu :index="item.id+''" v-if="item.optionInfoVos.length>0">
					          <template slot="title">
					            <i class="el-icon-location"></i>
					            <span>{{item.group_name}}</span>
					          </template>
					          <div v-for="(itemChild,indexChild) in item.optionInfoVos">
					            <el-menu-item  :index="itemChild.id+'-child'">
												<template slot="title">
							            <div @mouseover=" tempAtId = itemChild.id " @mouseout="tempAtId = null">
							              <el-checkbox :label="itemChild" style="margin-right: -10px;margin-top: -5px;">&nbsp;</el-checkbox>
							              <span>{{itemChild.option_name}}</span>
							              <i class="el-icon-circle-plus-outline" style="padding-left: 10px;color:#2196f3;" v-show="tempAtId===itemChild.id&&form.checkList.indexOf(itemChild)==-1" @click.stop="form.checkList.push(itemChild)" title="添加"></i>
							            </div>
							          </template>
					            </el-menu-item>
					          </div>
					        </el-submenu>
					        <el-menu-item :index="item.id+''"  v-else>
						        <template slot="title">
					            <i class="el-icon-location"></i>
					            <span>{{item.group_name}}</span>
					          </template>
						      </el-menu-item>
					        </el-checkbox-group>
					      </div>
					    </el-menu>
					    <div class="no-data" v-else>
					      暂无数据
					    </div>
		        </el-form-item>
		  		</el-col>
		  	</el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitMenuForm('form',dialogFormType)" size="small">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 保存流程模版、创建模版 -->
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
        <!-- <el-form-item 
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
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['createform'].resetFields();" size="small">重 置</el-button>
        <el-button type="primary" size="small" @click="submitCreate('createform')" v-if="dialogType===1">创 建</el-button>
        <el-button type="primary" size="small" @click="submitSave('createform')" v-if="dialogType===2">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 表单配置 -->
    <el-dialog
      title="表单配置"
      top="5vh"
      custom-class="peizhi"
      :visible.sync="isShowForm"
      width="1200px">
      <div v-loading="formLoading">

        <!-- CustomForm：组件库数据为后台获取 -->
        <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :component_list="component_list" :type="'component'"></CustomForm>
        
        <!-- CustomForm：组件库数据为默认的，component_list需传空数组 -->
        <!-- <CustomForm @saveCustomForm="handleSubmit" :dataDict="dataDict" :sortable_item="sortable_item" :type="'form'" :component_list="[]"></CustomForm> -->
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowForm = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import BpmnModel from 'custom-bpmn-activiti'
  export default {
    components: {
      BpmnModel
    },
    data(){
    	return{
    		isLoading:false,
    		dialogLoading:false,
        formLabelWidth: '100px',

    		menuData:[],// 菜单数据
    		tempAtId:null,// 浮动的id

    		oamenuData:[],// OA菜单数据
    		activeNav:'',// 被激活的OA菜单项 string类型
    		activeParentNav:null,// 被激活的OA菜单项所属菜单，即被激活的菜单项的父级id number类型
        openNav:[],// 默认被激活的OA菜单 数组类型，元素是string类型
        isMenuItem:false,// 是否有菜单项
        oamenuItemDetailData:null,// OA菜单项详情
        

        // 添加或编辑菜单  
        dialogFormVisible: false,
        dialogFormType:1,
        dialogFormTitle:['','创建OA系统','编辑'],
        form: {
        	checkList:[],
          menu_name: null,
          menu_description: null,
        },
        editId:null,

        bpmnConfig:{
          width:'',//流程图容器宽度
          height:'600px',//流程图容器高度
          type:'Modeler',// 'Modeler'可编辑 'Viewer'预览
          defaultXmlStr:
          '<?xml version="1.0" encoding="UTF-8"?>\n'+
          '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:activiti="http://activiti.org/bpmn" targetNamespace="http://www.activiti.org/processdef">\n'+
            '<process id=""/>\n'+
            '<bpmndi:BPMNDiagram>\n'+
              '<bpmndi:BPMNPlane bpmnElement=""/>\n'+
            '</bpmndi:BPMNDiagram>\n'+
          '</definitions>\n',// 默认的XML字符串
          showDownloadLink:false,//是否展示本地下载链接
        },
        // 自定义表单配置Dialog
        formLoading:false,
        isShowForm:false,
        element:null,
        getBusinessObject:null,
        formKey:null,
        dataDict: [],
        component_list:[],// 组件库数据（组件库，由后台查询得到）
        sortable_item: [], //最后需要保存的表单数据

        //保存流程模版、创建模版Dialog
        createDialogVisible:false,
        dialogType:1,// 1创建模版，2保存模版
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
    props:['oadata'],
    computed:{

    },
    mounted(){
      // this.$refs.activiti_bpmn.initModel(this.bpmnConfig.defaultXmlStr);
    	this.queryOAMenu(false)
      this.getFormDictJson();// 获取表单配置所需字典
    },
    methods:{

    	/**
    	 * 选择、切换菜单项
    	 * @author chuanlin.Xiao
    	 * @date   2019-10-31T14:06:33+0800
    	 * @param  {[type]}                 key     [description]
    	 * @param  {[type]}                 keyPath [description]
    	 * @return {[type]}                         [description]
    	 */
    	handleSelect(key, keyPath){
    		console.log(key, keyPath);
        this.activeNav = key;
        this.activeParentNav = Number(keyPath[0]);
        
        keyPath.length>1?this.isMenuItem = true : this.isMenuItem = false;
        if(keyPath.length>1){//有菜单项
          this.queryOAMenuItemDetail(Number(key.split('-child')[0]),true);
        }else{//无菜单项
          
        }
    	},
    	/**
    	 * 创建或编辑菜单按钮的操作
    	 * @author chuanlin.Xiao
    	 * @date   2019-10-31T14:06:26+0800
    	 * @param  {[type]}                 type [description]
    	 * @param  {[type]}                 data [description]
    	 */
      addOrEditMenu(type,data){
      	this.menuData.length>0?'':this.queryMenu();
        this.dialogFormType = type;
        this.$refs['form']?this.$refs['form'].resetFields():'';
        this.dialogFormVisible = true;
        type === 2 ? this.form.checkList=data.oaOptionVos:'';
        type === 2 ? this.queryOAMenuDetail(data.id):'';
        type === 2 ? this.editId = data.id:'';
      },

    	/**
    	 * 查询菜单
    	 * @author chuanlin.Xiao
    	 * @date   2019-10-31T14:06:16+0800
    	 * @return {[type]}                          [description]
    	 */
      queryMenu(){ 
        this.dialogLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/menu/find_menu`).then((response) => {
        	this.menuData = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询oa系统的菜单
       * @author chuanlin.Xiao
       * @date   2019-10-31T14:47:41+0800
       * @param  {Boolean}                isRefesh [description]
       * @return {[type]}                          [description]
       */
      queryOAMenu(isRefesh){ 
        this.isLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/oa_menu/find_menu`,{org_id:this.oadata.party_org_id}).then((response) => {
          if(isRefesh){
            this.oamenuData = response.data;
          }else{
            if(response.data&&response.data.length>0){
              this.oamenuData = response.data;
              this.activeParentNav = response.data[0].id;
              this.openNav = [response.data[0].id+''];
              if(response.data[0].oaOptionVos.length>0){
                this.isMenuItem = true;
                this.activeNav = response.data[0].oaOptionVos[0].id+'-child'+response.data[0].oaOptionVos[0].option_id;
                this.queryOAMenuItemDetail(response.data[0].oaOptionVos[0].id,true);
              }else{
                this.isMenuItem = false;
                this.activeNav = ''; 
             }
            }else{
              this.oamenuData = [];
              this.activeParentNav = null;
              this.openNav = [];
              this.message('您未配置菜单！请创建！')
            } 
          }
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 提交创建或编辑的菜单
       * @author chuanlin.Xiao
       * @date   2019-10-31T14:06:07+0800
       * @param  {[type]}                 formName       [description]
       * @param  {[type]}                 dialogFormType [description]
       * @return {[type]}                                [description]
       */
      submitMenuForm(formName,dialogFormType) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	let arr = [];
          	this.form.checkList.forEach( function(element, index) {
          		arr.push({option_id:element.id,option_name:element.option_name,act_deploy_id:element.act_deploy_id})
          	});
            let form = {
            	id:dialogFormType===1?null:this.editId,
              menu_name:this.form.menu_name,
              menu_description:this.form.menu_description,
              oaOptionVos:arr,
              org_id:this.oadata.party_org_id,
            }
            console.log(arr)
            this.axios.post(`${this.common.basePath}/activiti/oa_menu/create_menu`,form).then((response) => {
              this.queryOAMenu(true);//刷新
              this.$message({type: 'success',message: '成功!'});
              this.dialogFormVisible = false;
            }).catch((error) => {
              this.$message.error(error);  
            });
          } else {
            return false;
          }
        });
      },
      /**
       * 查询OA菜单详情 或回显详情
       * @author chuanlin.Xiao
       * @date   2019-10-31T16:08:52+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      queryOAMenuDetail(id){ 
        this.dialogLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/oa_menu/find_menu_info?id=${id}`).then((response) => {
          this.form.menu_description = response.data.menu_description;// 回显信息
          this.form.menu_name = response.data.menu_name;// 回显信息
          this.dialogLoading = false;
        }).catch((error) => {
          this.dialogLoading = false;
          this.$message.error(error);  
        });
      },
      /**
       * 查询OA菜单项详情 或刷新详情、回显详情
       * @author chuanlin.Xiao
       * @date   2019-10-31T17:09:17+0800
       * @param  {[type]}                 id   [description]
       * @param  {[type]}                 init [description]
       * @return {[type]}                      [description]
       */
      queryOAMenuItemDetail(id,init){ 
        this.isLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/oa_menu/find_option_info?id=${id}`).then((response) => {
          if(init){
            this.oamenuItemDetailData = response.data; 
            response.data.oaOptionVo.act_deploy_id?this.getModelXmlStr(response.data.oaOptionVo.act_deploy_id):this.$refs.activiti_bpmn.initModel(this.bpmnConfig.defaultXmlStr);
          }else{
            this.form = response.data;
          }  
          this.isLoading = false;
        }).catch((error) => {
          this.$refs.activiti_bpmn.initModel(this.bpmnConfig.defaultXmlStr)
          this.isLoading = false;
          this.$message.error(error);  
        });
      },


      /**
       * 子组件向父组件通讯事件（表单配置）
       */
      communicationEvent(element,getBusinessObject) {
        this.sortable_item = [];//清空表单配置右侧的数据
        this.isShowForm = true;
        console.log(element,getBusinessObject);

        this.element = element
        this.getBusinessObject = getBusinessObject;

        this.getComponentsData(Number(this.activeNav.split('-child')[1]));// 获取组件库
        let formKey = getBusinessObject(element).get('activiti:formKey');// 获取formKey
        formKey!=undefined?this.formKey=formKey:this.formKey=null;
        formKey!=undefined?this.getFormData(formKey):'';
      },  
      /**
       * 提交表单配置
       */
      handleSubmit(foromData) { 
        let params = {
          "uuid":     this.formKey, // formKey
          "value":    this.element.id,// taskId
          "formData": foromData
        } 
        let self = this;
        this.formLoading = false
        let config = {
          method: "post",
          url: `${this.common.basePath}/activiti/form/save`,
          data: params,
        }
        this.axios(config).then((response) => {
          this.$message.success(response.meta.message);
          // 设置formkey到bpmn里面
          var bo      = this.getBusinessObject(this.element),
              formKey = response.data || undefined;
          bo.set('activiti:formKey',formKey)
      
          // this.getFormData(formKey);// 刷新
          this.isShowForm = false;
          this.formLoading = false;
        }).catch((errorMsg) => {
          this.formLoading = false
          this.$message.error(errorMsg)
        })
      }, 
      /**
       * 获取字典（表单配置）
       */
      getFormDictJson(){
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/dictionary/type/json`,
          data: {},
        }
        this.axios(config).then((response) => {
          this.dataDict = response.data.items;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获取表单配置
       */
      getFormData(formKey){ 
        this.formLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/activiti/form/id`,
          params: {id:formKey},
        }
        this.axios(config).then((response) => {
          this.sortable_item = response.data ? response.data.formData : [];
          this.formLoading = false;
        }).catch((errorMsg) => {
          this.formLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获组件库取配置
       */
      getComponentsData(menuId){ 
        this.formLoading = true; 
        this.axios.post(`${this.common.basePath}/activiti/field/find_by_option?id=${menuId}`).then((response) => {
          this.component_list = response.data ? JSON.parse(response.data.wf_config) : [];
          this.formLoading = false;
        }).catch((error) => {
          this.formLoading = false;
          this.$message.error(error);  
        });
      },


      /**
       * 从服务器获取xmlStr
       * @author chuanlin.Xiao
       * @date   2019-10-28T16:00:29+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      getModelXmlStr(id){ 
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/deployment/resource`,{params:{deploymentId:id}}).then((response) => {
          let xmlStr = response.data?response.data:this.bpmnConfig.defaultXmlStr;
          console.log('服务器获取的xml',xmlStr);
          this.$refs.activiti_bpmn.initModel(xmlStr)
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 创建或则保存流程图
       * @author chuanlin.Xiao
       * @date   2019-10-28T09:46:04+0800
       */
      createOrSaveProcess(){
        console.log('bpmnModeler',this.$refs.activiti_bpmn.bpmnModeler)
        if(this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id===''){
          this.$message({type:'warning',message:'您尚未填写流程编号!!!'});
          return;//中断后续操作
        }else{
          console.log(this.oamenuItemDetailData.oaOptionVo.act_deploy_id)
          // this.oamenuItemDetailData.oaOptionVo.act_deploy_id?this.getModelDetail(this.oamenuItemDetailData.oaOptionVo.act_deploy_id):'';
          this.oamenuItemDetailData.oaOptionVo.act_deploy_id?this.dialogType=2:this.dialogType=1;
          this.$refs['createform'] ? this.$refs['createform'].resetFields():'';
          if(true){// 创建或保存流程图时，保持弹框的key和name与流程图的key、name相同
            this.createform.key = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id
            this.createform.name = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name
          }
          this.createDialogVisible=true;
        }
      },
      /**
       * 获取流程模版详情，回显信息
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:15:48+0800
       * @param  {[type]}                 id [description]
       * @return {[type]}                    [description]
       */
      getModelDetail(id){
        this.dialogLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/repository/model/detail`,{params:{id:id}}).then((response) => {
          this.createform.category = response.data?response.data.category:null;// 仅需回显种类信息
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 实时返回xml
       */
      _returnXmlStr(){
        let xmlStr = '';
        this.$refs.activiti_bpmn.saveDiagram(function (err, xml) {
          xmlStr = xml
        })
        return xmlStr;
      }, 
      /**
       * 创建模版，先画流程图，然后保存信息
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:53:03+0800
       * @return {[type]}                 [description]
       */
      createModel(){ 
        this.dialogLoading = false;

        console.log('创建流程xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();

        //key
        let newKey = this.createform.key;
        let oldkey = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id;
        if(newKey!=oldkey){// 流程编号发生改变
          xmlStr = xmlStr.replace('id="'+oldkey+'"', 'id="'+newKey+'"');
          xmlStr = xmlStr.replace('bpmnElement="'+oldkey+'"', 'bpmnElement="'+newKey+'"')
        }
        //name
        let newName = this.createform.name;
        let oldName = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name;
        console.log(oldName)
        if(oldName!=undefined){// 弹出弹框之前定义了流程名称时
          if(newName!=oldName){// 流程名称发生改变
            xmlStr = xmlStr.replace('name="'+oldName+'"', 'name="'+newName+'"');
          }
        }else{// 弹出弹框之前未定义流程名称时
          xmlStr = xmlStr.replace('<process id="'+newKey+'" ', '<process id="'+newKey+'" name="'+newName+'"',);
        }
        
        let form = {
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
          optionId:this.oamenuItemDetailData.oaOptionVo.id,
        }
        this.axios.post(`${this.common.basePath}/activiti/repository/deployment/save`,form).then((response) => {
          // this.queryOAMenu(true);// 刷新
          this.queryOAMenuItemDetail(Number(this.activeNav.split('-child')[0]),true);// 刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'创建流程图成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 创建模版
       * @author chuanlin.Xiao
       * @date   2019-10-28T14:52:54+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
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
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:32:26+0800
       * @return {[type]}                 [description]
       */
      saveModel(){ 
        this.dialogLoading = false;
        console.log('保存/修改流程xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();

        //key
        let newKey = this.createform.key;
        let oldkey = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].id;
        if(newKey!=oldkey){// 流程编号发生改变
          xmlStr = xmlStr.replace('id="'+oldkey+'"', 'id="'+newKey+'"');
          xmlStr = xmlStr.replace('bpmnElement="'+oldkey+'"', 'bpmnElement="'+newKey+'"')
        }
        //name
        let newName = this.createform.name;
        let oldName = this.$refs.activiti_bpmn.bpmnModeler._definitions.rootElements[0].name;
        console.log(oldName)
        if(oldName!=undefined){// 弹出弹框之前定义了流程名称时
          if(newName!=oldName){// 流程名称发生改变
            xmlStr = xmlStr.replace('name="'+oldName+'"', 'name="'+newName+'"');
          }
        }else{// 弹出弹框之前未定义流程名称时
          xmlStr = xmlStr.replace('<process id="'+newKey+'" ', '<process id="'+newKey+'" name="'+newName+'"',);
        }

        let form = {
          id:this.oamenuItemDetailData.oaOptionVo.act_deploy_id,
          category: this.createform.category,
          key: this.createform.key,
          name: this.createform.name,
          tenantId: this.createform.tenantId,
          xmlResource: xmlStr,
          optionId:this.oamenuItemDetailData.oaOptionVo.id,
        }
        this.axios.post(`${this.common.basePath}/activiti/repository/deployment/save`,form).then((response) => {
          // this.queryOAMenu(true);// 刷新
          this.queryOAMenuItemDetail(Number(this.activeNav.split('-child')[0]),true);// 刷新
          this.createDialogVisible = false;
          this.$message({type:'success',message:'保存流程图至服务器，成功！'})
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 保存模版
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:38:30+0800
       * @param  {[type]}                 formName [description]
       * @return {[type]}                          [description]
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
       * 切换流程图的编辑与预览状态
       * @author chuanlin.Xiao
       * @date   2019-10-28T15:57:09+0800
       * @param  {[type]}                 type [description]
       * @return {[type]}                      [description]
       */
      changeStatus(type){
        this.bpmnConfig.type=type;
        console.log('切换流程时的xml',this._returnXmlStr())
        let xmlStr = this._returnXmlStr();
        this.oamenuItemDetailData.oaOptionVo.act_deploy_id?this.getModelXmlStr(this.oamenuItemDetailData.oaOptionVo.act_deploy_id):this.$refs.activiti_bpmn.buildModel(type,xmlStr);
      }, 

    }
  }
</script>

<style lang="less">
	.oa{
		width:100%;
		overflow:hidden;
		.oa-dialog-container{
			width:100%;
			overflow:hidden;
		}
    .el-dialog__wrapper{
      z-index:5000 !important;
      .el-dialog.peizhi{
        background: #f7f7f7;
      }
    }
	}
  .el-select-dropdown.el-popper{
    z-index:9999 !important;
   }
</style>