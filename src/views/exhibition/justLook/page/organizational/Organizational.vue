<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="6">
				<el-card shadow="never">
					<el-tree  
						:props="defaultProps" 
						:load="loadNode"
						node-key="id"
			  		lazy 
			  		@node-click="handleNodeClick"
		  		></el-tree>
				</el-card>
			</el-col> 
			<el-col :span="11">
				<!-- 简介 -->
				<el-card shadow="never">
					<div v-if="orgInfo" v-loading="isLoad" class="personal-wrapper">
			      <h1 :style="`background-color: ${dataBlockJson[0].backGroundConfig}`" class="title marb20">|| 简介</h1> 
		        <el-row>
		          <el-col :span="24">
		            <div class="grid-content bg-purple-dark photo-message">
		              <div class="photo">
		                <el-avatar v-if="orgInfo.photo" shape="square" :size="100" :src="orgInfo.photo"></el-avatar>
		                <el-avatar v-else shape="square" :size="100" icon="el-icon-user-solid"></el-avatar> 
		              </div>
		              <div class="other">
		                <p>名称：{{orgInfo.name ? orgInfo.name : '暂无'}}</p> 
		                <p>邮箱：{{orgInfo.mailbox ? orgInfo.mailbox : '暂无'}}</p>
		                <p>电话：{{orgInfo.phone ? orgInfo.phone : '暂无'}}</p>
		                <p>地址：{{orgInfo.address ? orgInfo.address : '暂无'}}</p>
		                <p>描述：{{orgInfo.description ? orgInfo.description : '暂无'}}</p>
		              </div>
		            </div>
		          </el-col>
		        </el-row> 
			    </div>
				</el-card>
				<!-- 公告栏 -->
				<el-card shadow="never"> 
			    <div class="personal-wrapper">
			      <h1 :style="`background-color: ${dataBlockJson[0].backGroundConfig}`" class="title marb20">|| 公告栏</h1>
			      <el-card v-if="noticeList" v-for="(item,index) in noticeList" class="box-card mart20"> 
		          <div slot="header" class="clearfix">
						    <span>{{item.title}}</span> 
						  </div>
		          <el-main style="padding: 0 20px;" v-html="item.info"></el-main> 
			        <p v-if="noticeList ? !noticeList.length : true "> 暂无公告 </p>
			      </el-card>
			    </div>
				</el-card>
			</el-col>
			<el-col :span="7">
				<!-- 班子组成 -->
				<el-card shadow="never">
					<div v-if="leaderList.length" v-loading="isLoad" class="personal-wrapper">
			      <h1 :style="`background-color: ${dataBlockJson[0].backGroundConfig}`" class="title marb20">|| 班子组成</h1> 
		        <div class="" v-for="(item, index) in leaderList"> 
		            <div class="marb15 mart15 grid-content bg-purple-dark photo-message">
		              <div class="photo"> 
		                <el-avatar shape="square" :size="100" icon="el-icon-user-solid"></el-avatar> 
		              </div>
		              <div class="other">
		                <p>{{item.userName}} {{item.position}}</p>  
		              </div>
		            </div>
		            <el-divider v-if="index < leaderList.length - 1"></el-divider> 
		        </div>  
			    </div>
			    <div v-else v-loading="isLoad" class="personal-wrapper">
			      <h1 :style="`background-color: ${dataBlockJson[0].backGroundConfig}`" class="title marb20">|| 班子组成</h1>
			    	<p class="text-center"> 暂无班子 </p>
			    </div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script> 
  export default {
    data(){
    	return {
    		isLoad:  true,
    		dataBlockJson: JSON.parse(sessionStorage.getItem('homeData')),       //框架的数据, 
    		orgId:   sessionStorage.getItem('orgId'), 
    		defaultProps: {
    			label: 'name', 
          isLeaf: 'below'
    		},
    		orgInfo:  			null, //根据指定Id查询的组织简介
    		noticeList:     null, // 公告栏
    		leaderList:     [], //班子组成
    	}
    },
    mounted(){ 
		},
		methods: {
			getQueryPartyorgtree(orgId){ 
				let myFirstPromise = new Promise((resolve, reject) => {
					this.axios.post( `${this.common.basePath}/user/orgs/children`, {orgId: orgId} ).then( (response) => {   
	          resolve(response.data);
	        }).catch( (error) => {   
	        	reject(error);
	          this.$message.error(error);
	        });  
				});  
				return myFirstPromise;
			},
			/*
			 * 树节点懒加载
			 */
			loadNode(node, resolve) {   
				if(node.level === 0){  
					this.getQueryOrgInfo(this.orgId);
					this.getQueryNoticeList(this.orgId);
					this.getQueryLeaderList(this.orgId);
					return resolve([{name: this.dataBlockJson[0].partyOrgName, id: this.orgId}]);
				}else{
					this.getQueryPartyorgtree(node.key).then( (response) => { 
						response.rows.forEach((item) => {
							item.below = !item.below;
						}) 
						return resolve(response.rows);
					}); 
				}
				  
      },
			handleNodeClick(ev){ 
				this.getQueryOrgInfo(ev.id);
				this.getQueryNoticeList(ev.id);
				this.getQueryLeaderList(ev.id);
			},
			getQueryOrgInfo(orgId){
				this.axios.get( `${this.common.basePath}/user/orgs/one`, {params: {id: orgId}} ).then( (response) => {   
          this.orgInfo = response.data;
          this.isLoad = false;
        }).catch( (error) => {
        	this.isLoad = false;    
          this.$message.error(error);
        }); 
			},
			/*
       * 党支部公告栏列表
       */
      getQueryNoticeList(orgId){
        this.axios.post( `${this.common.basePath}/user/notice/list`, {orgId: orgId} ).then( (response) => {   
          this.noticeList = response.data; 
        }).catch( (error) => { 
          this.$message.error(error);
        });  
      },
      /*
       * 查询班子组成
       */
      getQueryLeaderList(orgId){
        this.axios.post( `${this.common.basePath}/user/leader/list/item`, {orgId: orgId} ).then( (response) => {   
          this.leaderList = response.data; 
        }).catch( (error) => { 
          this.$message.error(error);
        });  
      },
		}
  }
</script>

<style lang="less">
.personal-wrapper {  
  margin-bottom: 30px;
  .is-circle{
    padding: 6px;
  }
 
  .title{ 
    line-height: 40px;
    font-size: 18px;
    color: #fff;
    margin-top: 0;
    padding: 0 30px;
    i{
      float: right;
      cursor: pointer;
    }
    i:before{
      font-size: 22px;
      position: relative;
      top: 9px;
    }
  }
  .photo-message{ 
    display: inline-flex;
    width: 100%;
    .photo{
      img{
        width: 120px;
        height: 150px;
      }
    }
  }
  .other{
    margin-left: 20px;
    width: calc(~'100% - 150px');
    p{
      padding-bottom: 10px;
    }
  }
}
</style>