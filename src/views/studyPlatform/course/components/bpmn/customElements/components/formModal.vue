<template>
	<div class="form-component" :id="id">
		<el-dialog
		  title="添加或编辑表单"
		  :visible.sync="isShow"
		  :before-close="handleCancel"
		  width="70%">
		  <div>
		  	<el-input v-model="input" placeholder="请输入表单key"></el-input>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="handleCancel" size="small">取 消</el-button>
		    <el-button type="primary" @click="handleOk" size="small">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'form-modal',
	components:{
		
	},
	data(){
		return{
			input:null,
			isShow:true,
		}
	},
	computed:{
	  
	},
	props:{
		id:{
			type: String,
			default: null
		},
		element: {
			type: Object,
			default: null,
		},
	},
	mounted(){
		console.log(this.element)
		console.log(this.id)
	},
	methods:{
		handleOk(){
			this.isShow = false;
			document.getElementsByClassName('BPMN')[0].removeChild(document.getElementById(this.id));
		},
		handleCancel(){
			this.isShow = false;
			document.getElementsByClassName('BPMN')[0].removeChild(document.getElementById(this.id));
		},
	}
}
</script>

<style lang="less">

</style>


