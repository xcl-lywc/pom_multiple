<template>
	<div>
		<el-container :visible="show" @ok="handleOk" @cancel="handleCancel">
			<div class="content" v-show="data.extensionData">
				<el-row style="margin-top: 20px;">
					<el-col :span="8">
						标签名称
					</el-col>
					<el-col :span="16">
						<el-input v-model="data.name"></el-input>
					</el-col>
				</el-row>
				<el-row style="margin-top: 30px;">
					<el-col :span="8">属性名</el-col>
					<el-col :span="16">属性值</el-col>
				</el-row>
				<el-row style="margin-top: 10px;" v-for="attr in data.extensionData" :key="attr.name">
					<el-col :span="8">{{attr.name}}</el-col>
					<el-col :span="16"><el-input v-model="attr.value"></el-input></el-col>
				</el-row>
			</div>
		</el-container>
	</div>
</template>

<script>
export default {
	name: 'task-modal',
	components:{
		
	},
	props:{
		show: {
			type: Boolean,
			default: false
		},
		data:{
			type: [Object,Array]
		}
	},
	methods:{
		handleOk(){
			this.$emit('handleOk', this.data)
		},
		handleCancel(){
			this.$emit('handleCancel')
		},
	}
}
</script>

<style lang="less">

</style>


