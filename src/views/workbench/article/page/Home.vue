/*********************首页设置***********************/
  Author: Yuanyuan.Xie
  Date:   2019.07.11
/************************************************/
<template>
  <div v-loading="isLoad" class="backgroundFFF pad20">
    <div class="text-right mar20"><el-button type="primary" @click="editHomeSettingVisible = true; ">编辑基本信息</el-button></div>
    <!-- 首页基本配置，当已经被配置过的时候就不显示此操作 -->
    <div v-if="!homeData">
      <h1 class="marb20">创建首页基本配置</h1>
      <el-form :model="homeSettingForm" ref="homeSettingForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="homeName"
          label="首页名称"
          :rules="[
            { required: true, message: '请输入首页名称', trigger: 'blur' },
          ]"
         >
          <el-input v-model="homeSettingForm.homeName"></el-input>
        </el-form-item>
        <el-form-item
          prop="address"
          label="地址"
          :rules="[
            { required: true, message: '请输入地址', trigger: 'blur' },
          ]"
          >
          <el-input v-model="homeSettingForm.address"></el-input>
        </el-form-item> 
        <el-form-item
          prop="backGroundConfig"
          label="主题色"
          :rules="[
            { required: true, message: '请选择主题色', trigger: 'blur' },
          ]"
          >
          <div class="block"> 
            <el-color-picker v-model="homeSettingForm.backGroundConfig"></el-color-picker>
          </div>
        </el-form-item> 
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
          >
          <el-input v-model="homeSettingForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="手机号"
          :rules="[
            { required: true, message: '请输入邮箱', trigger: 'blur' }, 
          ]"
          >
          <el-input v-model="homeSettingForm.phone"></el-input>
        </el-form-item> 
         
        <el-form-item>
          <el-button type="primary" @click="submitHomeSettingForm('homeSettingForm')">提交</el-button> 
          <el-button @click="resetHomeSettingForm('homeSettingForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="homeData">
      <!-- 首页模块内容 -->
      <el-row :gutter="20" v-if="contentData && contentData.length > 0">
        <!-- 轮播块, col=16 -->
        <el-col v-if="item.type == '3'" v-for='(item, index) in contentData' :span="16" class="block-wrap swiper-wrap"  :key="index">
          <div class="grid-content" >
            <div class="fix-padding" :xxx="index">
              <el-carousel height="363px">
                <div class="btn-group swiper-btn-group">
                  <el-button size="mini" @click="addContentButtonClicked('swiper', index)">添加轮播</el-button>
                  <el-button size="mini" @click="addContentButtonClicked('news', index)">添加分类</el-button>
                  <el-button size="mini" type="primary" @click="editContentButtonClicked(item, index)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="deleteContentButtonClicked(index,item)">删除</el-button>
                </div>
                <el-carousel-item v-for="(swiperItem, swiperIndex) in JSON.parse(item.config).swiperData" :key="swiperIndex" >
                  <p class="swiper-title">{{ swiperItem.title || "暂无标题"}}</p>
                  <img :src="swiperItem.imgUrl" :alt="swiperIndex" style="width:100%" @click="pictureDialogVisible = true">
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </el-col>
        <!-- 新闻块, col=8 -->
        <el-col v-else :span="8" class="block-wrap news-wrap" :key="index">
          <div class="grid-content">
            <div class="main-block-wrap" :style="`border-top-color: ${homeData.backGroundConfig}`">
              <span class="main-block-title" :style="`background: ${homeData.backGroundConfig}`">{{ item.atName }}</span>
              <div class="btn-group">
                <el-button size="mini" @click="addArticle(item)">写文章</el-button>
                <el-button size="mini" @click="addContentButtonClicked('swiper', index)">添加轮播</el-button>
                <el-button size="mini" @click="addContentButtonClicked('news', index)">添加分类</el-button>
                <el-button size="mini" type="primary" @click="editContentButtonClicked(item, index)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteContentButtonClicked(index,item)">删除</el-button>
              </div>
              <news-list v-if="item.aTypeId" :atId="item.aTypeId"></news-list>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-else>
        <p><i class="el-icon-warning warning-icon"></i>当前主页没有内容, 请添加</p>
        <el-button size="mini" type="primary" @click="addContentButtonClicked('swiper', 0)">添加轮播</el-button>
        <el-button size="mini" type="primary" @click="addContentButtonClicked('news', 0)">添加分类</el-button>
      </div>
    </div> 
    <!-- (轮播图)新增, 编辑 -->
    <el-dialog
      :title="contentOperateType == 'new' ? '新增轮播' : '编辑轮播'"
      id="swiper-dialog"
      :visible.sync="swiperDialogVisible"
      width="40%"
      :close-on-click-modal="false">
      <el-form label-width="80px" class="fill-width" size="small">
        <el-button type='primary' size="mini" class="fill-width add-swiper-item" @click="addSwiperItem">添加一项</el-button>
        <div v-for="(item, index) in tempSwiperData.swiperData">
          <el-form-item :label="'文章:'">
            <el-input placeholder="请输入文章地址" v-model="item.link"></el-input>
          </el-form-item>
          <el-form-item :label="'标题:'">
            <el-input placeholder="请输入文章标题" v-model="item.title"></el-input>
          </el-form-item>
          <el-form-item :label="'图片:'" required>
            <el-upload
              class="avatar-uploader"
              :action="imgServer"
              :headers="token"
              :show-file-list="false"
              :on-success="uploadSuccess"
              name="upfile">
              <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar" @click="clickIndex(index)">
              <i v-else class="el-icon-plus avatar-uploader-icon" @click="clickIndexNew(index)"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="default" :disabled="index == 0" size="mini" @click="changeIndex(index, 'forward')">上移一项</el-button>
            <el-button type="default" :disabled="index == (tempSwiperData.swiperData.length - 1)" size="mini" @click="changeIndex(index, 'backword')">下移一项</el-button>
            <el-button type="danger" size="mini" @click="deleteSwiperItem(item, index)">删除</el-button>
          </el-form-item>
          <div class="divide-line"></div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="tempSwiperData.swiperData.length <= 0 || !swiperHasImg" @click="saveSwiper">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- (新闻模块)新增, 编辑 -->
    <el-dialog
      :title="contentOperateType == 'new' ? '新增' : '编辑'"
      id="news-dialog"
      :visible.sync="newsDialogVisible"
      width="30%"
      :close-on-click-modal="false">
      <small class="tips-text">先选择(分类/专题), 再选择下方筛选条件</small>
      <el-form label-width="100px" class="fill-width" v-loading="newsLoading" size="small">
        <el-form-item :label="'分类/专题：'" required>
          <el-select class="fill-width" v-model="tempNewsData.atType" @change="clickChange = true">
            <el-option
              v-for="item in keyTpyeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'筛选条件：'" required> 
          <el-select class="fill-width" v-model="tempNewsData.atId" @change="changeFilterOptionValue($event)">
            <el-option
              v-for="item in filterOptions"
              :key="item.atId"
              :label="item.atName"
              :value="item.atId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="tempNewsData.atId == null" @click="saveNews">确 定</el-button>
      </span>
    </el-dialog> 

    <!-- 编辑首页基本配置 -->
    <el-dialog
      title="编辑首页基本配置"
      id="news-dialog"
      :visible.sync="editHomeSettingVisible"
      width="30%"
      :close-on-click-modal="false">
      <el-form :model="homeSettingForm" ref="homeSettingForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="homeName"
          label="首页名称"
          :rules="[
            { required: true, message: '请输入首页名称', trigger: 'blur' },
          ]"
         >
          <el-input v-model="homeSettingForm.homeName"></el-input>
        </el-form-item>
        <el-form-item
          prop="address"
          label="地址"
          :rules="[
            { required: true, message: '请输入地址', trigger: 'blur' },
          ]"
          >
          <el-input v-model="homeSettingForm.address"></el-input>
        </el-form-item> 
        <el-form-item
          prop="backGroundConfig"
          label="主题色"
          :rules="[
            { required: true, message: '请选择主题色', trigger: 'blur' },
          ]"
          >
          <div class="block"> 
            <el-color-picker v-model="homeSettingForm.backGroundConfig"></el-color-picker>
          </div>
        </el-form-item> 
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
          >
          <el-input v-model="homeSettingForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="手机号"
          :rules="[
            { required: true, message: '请输入邮箱', trigger: 'blur' }, 
          ]"
          >
          <el-input v-model="homeSettingForm.phone"></el-input>
        </el-form-item> 
         
        <el-form-item>
          <el-button type="primary" @click="submitHomeSettingForm('homeSettingForm')">提交</el-button> 
          <el-button @click="resetHomeSettingForm('homeSettingForm')">重置</el-button>
        </el-form-item>
      </el-form> 
    </el-dialog>  
    <!-- 修改页面主题色 -->
    <ThemePicker v-if="homeData" :default="homeData.backGroundConfig"></ThemePicker>
  </div>
</template>

<script>
  import ThemePicker from '../../../../components/ThemePicker.vue' 
  import draggable from 'vuedraggable'
  import Sortable  from 'sortablejs'

  import newsList from "../components/NewsList.vue";

  export default {
    data() {
      return {
        isLoad:          true,
        homeSettingForm: {   //首页基本设置
          "address": null,
          "backGroundConfig": null,
          "email":    null,
          "homeName": null,
          "manageOrgId": sessionStorage.getItem("orgId"),
          "orgId": sessionStorage.getItem("orgId"),
          "phone": null
        },
        homeData:         null, //首页数据
        orgId: sessionStorage.getItem("orgId"),
        imgServer: `${this.common.basePath}/home/sys/ueditor/file?action=uploadimage`,
        token:     { "Authorization": `Bearer ${sessionStorage.getItem("token")}`},
        imageUrl:  '',

        orgCode: sessionStorage.getItem("orgCode"),
        //------------- 左侧分类 -------------//
        asideNavArray:        [],     //左侧分类列表
        asideTypeOption:      [],     //左侧 分类 > 新增/编辑 > select的option
        asideTypeOptionValue: null,
        asideTypeTempChoosed: null,   //左侧 分类 > 新增 > select的option value完整对象

        asideChoosed: {               //当前选中的左侧分类项
          atId:  null,
          index: null
        },
        asideOperateType:   null,  //右键菜单操作类型 "new" 新增 "edit" 编辑
        asideDialogVisible: false, //左侧dialog显示

        rightMenuShow: false,
        rightMenuX: 0,
        rightMenuY: 0,

        //------------- 右侧主体 -------------//
        tempSwiperData: { //点击新增 编辑 后, 暂时的轮播数据
          type: 'swiper',
          swiperData: [   //轮播数据(包含图片和文章地址,用于保存和编辑)
          ],
          title:    null,
          interval: 3000, //轮播时间间隔
        },
        tempNewsData: {     //点击新增 编辑 后, 暂时的新闻数据
          type:   'news',   
          atName: null,     //名称
          atId:   null,     //类型/专题对应的Id
          atType: "1",      //类型种类
        },
        swiperHasImg: false,
        //页面主体 数据
        contentData:        [],
        contentOperateType: null,  //右侧主体操作类型 new 新增 edit 编辑
        tempContentIndex:   null,  //右侧主体的操作位置 用于添加
        tempSwiperIndex:    null,  //右侧主体的操作位置 > 操作的swiper的位置

        // 分类 或 主题的选项
        keyTpyeOptions: [
          {
            value: "1",
            label: '分类'
          }, {
            value: "2",
            label: '专题'
          }
        ],

        // 分类名 (筛选条件)
        filterOptions: [],
        filterTypeTempChoosed: null, //当前过滤所选中的对象

        editDialogVisible:    false, //主体 - 编辑dialog
        pictureDialogVisible: false, //主体 - 轮播dialog
        swiperDialogVisible:  false,
        newsDialogVisible:    false,
        editHomeSettingVisible: false, //编辑首页基本信息
        loading: false,
        navLoading:  false,
        newsLoading: false,
        clickChange: false,  //当点击了上层select, 此时需要刷新并重置下层, 将此值变为true 
      }
    },
    components: {
      "news-list": newsList,
      draggable,
      Sortable,
      ThemePicker
    },
    watch: {
      //监听左侧列表的diaolog, 关闭后取消选中
      asideDialogVisible (newV, oldV) {
        if(newV == false) {
          this.asideChoosed.atId = null;
          this.asideChoosed.index = null;
        }
      },
      tempSwiperData : {
        // 监听tempSwiperData, 如有某一条图片为空, 则无法提交
        handler: function (newV, oldV) { 
          this.swiperHasImg = true
          this.tempSwiperData.swiperData.forEach((item, index) => {
            if (!item.imgUrl) { //为空
              this.swiperHasImg = false
            }
          })
        },
        deep: true
      },
      "tempNewsData.atType": {
        handler: function (newV, oldV) { 
          this.getFilterOptions(newV)
          if(this.clickChange) {
            this.tempNewsData.atId = null
          }
          this.clickChange = false //结束点击切换, 此值变为false
        },
        deep: true
      }
    },
    created () {
      
    },
    mounted () {
      this.getHomeSetting(); 
    },
    methods: {
      /*
       * 查询首页是否已经被配置过
       */
      getHomeSetting(){
        this.axios.get( `${this.common.basePath}/home/home/detail`, {params: {orgId: this.orgId}} ).then( (response) => { 
          if(response.data){
            this.homeSettingForm = response.data;
          } 
          this.homeData = response.data;
          this.contentData = response.data.configItemList;
          this.isLoad = false;
        }).catch( (error) => { 
          this.isLoad = false;
          this.$message.error(error); 
        });   
      }, 
      /**
       * 获取主页数据
       * @return {[type]} [description]
       */
      getContentData () {
        this.loading = true 
        
        this.axios.get( `${this.common.basePath}/home/home/data`, {params: {partyOrgId: this.orgId}} ).then( (response) => {  
          this.contentData  = response.data;
          this.loading = false
        }).catch( (error) => { 
          this.loading = false
          this.$message.error(error); 
        });   
      },
      /**
       * 用户不点击确定, 点击了取消或者关闭了dialog, 则重新查询数据
       * @return {[type]} [description]
       */
      refreshData () {
        this.getHomeSetting()
        this.newsDialogVisible = false;
        this.swiperDialogVisible = false;
      },
      /**
       * 右键菜单,禁用默认菜单,并显示自定义菜单
       * @param  {object} event 
       * @return none
       */
      rightClick (event, item, index) {
        event.preventDefault();

        this.rightMenuShow = true;
        this.rightMenuX    = event.clientX + 10 + 'px';
        this.rightMenuY    = event.clientY + 5 + 'px';
        this.asideChoosed.atId     = item.atId
        this.asideChoosed.index    = index
      },
      /**
       * 新增左侧类型导航, 控制dialog部分显示
       * @return {[type]} [description]
       */
      newAsideType () {
        this.asideTypeOptionValue = null; //还原select选中
        this.rightMenuShow        = false;
        this.asideOperateType     = "new";
        this.asideDialogVisible   = true;
      },
      /**
       * 编辑左侧类型导航, 控制dialog部分显示
       * @return {[type]} [description]
       */
      editAsideType () {
        this.rightMenuShow        = false;
        this.asideOperateType     = "edit";
        this.asideDialogVisible   = true;
        this.asideTypeOptionValue = this.asideChoosed.atId //将当前选中的aside的id赋值到select中
      },
      /**
       * 点击类型列表,选中某一项, 记录此条完整对象,用于push进navArray
       * @param  {Number} value 当前选中的值atId
       * @return none
       */
      changeAsideOptionValue (value) {
        let obj = {};
        obj = this.asideTypeOption.find((item)=> {
          return item.atId === value;
        });
        this.asideTypeTempChoosed = obj
      },
      /**
       * 提交左侧类型列表( 新增 / 编辑)
       * @return none
       */
      submitAsideType () {
        this.asideDialogVisible = false;
        if(this.asideOperateType == "new") { //新增分类, 末尾push
          this.asideNavArray.push(this.asideTypeTempChoosed)
          this.saveNavDataToServer()
        } else { //编辑分类, 删除本位置的item并重新插入新的item
          if(!this.asideTypeTempChoosed) {
            this.$message.success("成功")
          } else {
            this.asideNavArray.splice(this.asideChoosed.index, 1, this.asideTypeTempChoosed)
            this.saveNavDataToServer()
          }
        }
      },
      /**
       * 将修改的导航数组保存
       * @return {[type]} [description]
       */
      saveNavDataToServer () { 
        this.asideNavArray.partyOrgId = this.orgId;
        this.axios.post( `${this.common.basePath}/home/home/nav`, this.asideNavArray ).then( (response) => {  
          this.$message.success(response.meta.message)
          this.getAsideTypeList()
        }).catch( (error) => {  
          this.loading = false
          this.getAsideTypeList()
          this.$message.error(error); 
        });  
      },
      /**
       * 删除左侧类型导航, 不需要传参, 当前操作的全局asideChoosed
       * @return none
       */
      deleteAsideType () {
        
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.asideNavArray.splice(this.asideChoosed.index, 1)
          this.saveNavDataToServer()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getAsideTypeList()
        }).catch(() => {
          this.asideChoosed.atId  = null;
          this.asideChoosed.index = null;
        });
      },
      /**
       * 在本类型下点击 写文章, 
       */
      addArticle (item) {
        sessionStorage.setItem("tempType", JSON.stringify(item))
        this.$router.push({name: "UploadArticle"})
      },
      /**
       * 点击添加 主区域 内容
       * @param {String} typeName 类型名称 news 新闻 swiper 轮播
       * @param {Number} index    当前点击的顺序index
       * @return none
       */
      addContentButtonClicked (typeName, index) {
        this.contentOperateType = "new"
        if(typeName == 'swiper') {
          this.swiperDialogVisible = true
          //创建一个空的数据, 用于新增
          this.tempSwiperData = {
            type: 'swiper',
            swiperData: [],
            title:    null,
            interval: 3000
          }
        } else {
          this.newsDialogVisible = true
          //创建一个空的新闻对象, 使用前需要提前清空数据
          this.tempNewsData = {
            type:    'news',
            atType:  "1",
            atId:    null,
            atName:  null,
          }
          this.getFilterOptions("1") // 新增时查询一次atType为1的 filterOptions
        }
        this.tempContentIndex = index;
      },

      /**
       * 编辑 主区域 内容
       * @param {String} typeName 类型名称 news 新闻 swiper 轮播
       * @param {Number} index    当前点击的顺序index
       * @return none
       */
      editContentButtonClicked (item, index) {   
        this.contentOperateType = "edit"
        //深拷贝, 避免影响原有数据
        if(item.type == '3') {   
          let swiperConfig = JSON.parse(item.config);
          swiperConfig.itemId = item.itemId; 
          this.tempSwiperData      = swiperConfig;
          this.swiperDialogVisible = true
        } else {
          item.atType = item.type.toString();
          item.atId = item.aTypeId;
          this.tempNewsData        = JSON.parse(JSON.stringify(item)); 
          this.newsDialogVisible   = true
        }
        //记录操作的index
        this.tempContentIndex = index
      },
      /**
       * 删除 主区域 内容
       * @param  {Number} index 删除内容索引值
       * @param  {Object} item  当前需要被删除的模块
       * @return none
       */
      deleteContentButtonClicked (index,item) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.contentData.splice(index, 1)
          this.deleteContentDataToServer(item); 
        }).catch(() => {

        });
      },
      /**
       * 过滤select change事件
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      changeFilterOptionValue (value) {
        let obj = {};
        obj = this.filterOptions.find((item)=> {
          return item.atId === value;
        });
        this.filterTypeTempChoosed = obj
      },
      /**
       * 点击确定保存新闻( 新增 / 编辑 ) 
       * @return {[type]} [description]
       */
      saveNews () {
        //判断是否重复
        let repeatedFlag = false // 是否重复的标识
        this.contentData.forEach((item, index) => {
          if(item.type == "news") {
            if(this.tempNewsData.atId == item.atId){
              repeatedFlag = true
            }
          }
        })
        //操作完contentData完成之后且没有重复内容, 将本次修改后的数据提交
        if(repeatedFlag) {
          this.$message.error("失败, 存在重复的分类/专题!")
        } else { 
          if(this.contentOperateType == "new") {
            //无删除时index + 1
            this.contentData.splice(this.tempContentIndex + 1, 0,
              {
                type:    'news',
                atType:  this.tempNewsData.atType,
                atId:    this.tempNewsData.atId,
                atName:  this.filterTypeTempChoosed.atName,
              })
          } else {
            this.contentData.splice(this.tempContentIndex, 1,
              {
                type:    'news',
                atType:  this.tempNewsData.atType,
                atId:    this.filterTypeTempChoosed.atId,
                atName:  this.filterTypeTempChoosed.atName,
              })
          }   
          let homeDataForm =  {
            "aTypeId": this.tempNewsData.atId,
            "config":  '',
            "homeId":  this.homeData.homeId, 
            "orgId":   this.orgId,
            "type":    this.tempNewsData.atType, //type  ：1、分类；2、专题；3、图片滚动；4、视频
          }
          if(this.contentOperateType == 'edit'){
            homeDataForm.itemId = this.tempNewsData.itemId;
          }
          this.saveContentDataToServer(homeDataForm)
          this.newsDialogVisible = false
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      /**
       * 获取分类列表
       * @param  {String} typeStr 分类1 主题2
       * @return none
       */
      getAsideTypeList (typeStr) { 
        this.navLoading = true
        this.axios.get( `${this.common.basePath}/home/home/nav`, {params: {partyOrgId: this.orgId}} ).then( (response) => {  
          this.asideNavArray = response.data;
          this.navLoading = false
        }).catch( (error) => {  
          this.loading = false 
          this.$message.error(error); 
        }); 
      },
      /**
       * 获取顶层分类(aside的select中使用)
       * @return {[type]} [description]
       */
      getAsideTypeOption () { 
        this.axios.get( `${this.common.basePath}/home/a_types/toparticletypes`, {params: {partyOrgId: this.orgId}} ).then( (response) => {  
          this.asideTypeOption = response.data; 
        }).catch( (error) => {   
          this.$message.error(error); 
        }); 
      },
      /**
       * 获取筛选条件的分类(content的select中使用)
       * @param  {String} typeValue 分类的type 1分类 2专题 默认分类
       * @return {[type]}           [description]
       */
      getFilterOptions (typeValue) { 
        this.newsLoading = true;
        this.axios.get( `${this.common.basePath}/home/a_types/articletypes`, {params: {partyOrgId: this.orgId,type: typeValue}} ).then( (response) => {  
          this.filterOptions = response.data; 
          this.newsLoading = false
        }).catch( (error) => {   
          this.$message.error(error); 
        });  
      },
      /**
       * 将修改的主体数组保存
       * @return {[type]} [description]
       */
      saveContentDataToServer (homeDataForm) {
        if(this.contentOperateType == 'new'){
          this.axios.post( `${this.common.basePath}/home/home/add`,  homeDataForm ).then( (response) => {  
            this.refreshData()
          }).catch( (error) => {   
            this.refreshData()
            this.$message.error(error); 
          }); 
        }else if(this.contentOperateType == 'edit'){
          
          this.axios.put( `${this.common.basePath}/home/home/update`,  homeDataForm ).then( (response) => {  
            this.refreshData()
          }).catch( (error) => {   
            this.refreshData()
            this.$message.error(error); 
          }); 
        }
         
      },
      /*
       * 删除指定Id模块
       */
      deleteContentDataToServer(item){
        let params = {
            "homeId":  this.homeData.homeId,
            "itemId":  item.itemId,
            "orgId":   this.orgId
          }
        this.axios.post( `${this.common.basePath}/home/home/delete`, params ).then( (response) => {  
          this.refreshData()
        }).catch( (error) => {   
          this.refreshData()
          this.$message.error(error); 
        });  
      },
      /**
       * 添加轮播 > 点击添加一项
       */
      addSwiperItem () {
        this.tempSwiperData.swiperData.unshift({
          link:   null,
          imgUrl: null,
          title:  null
        })
      },
      /**
       * 删除本条轮播小项目
       * @return {[type]} [description]
       */
      deleteSwiperItem (item, index) {
        this.tempSwiperData.swiperData.splice(index, 1)
      },
      /**
       * 点击新增/编辑 轮播 点击对应的上传, 记录index
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
      clickIndex (index) {
        this.tempSwiperIndex = index
      },
      clickIndexNew (index) {
        this.tempSwiperIndex = index
      },
      /**
       * 点击上移 或 下移(需要重新触发tempSwiperData的watch, 驱使页面刷新)
       * @param  {object} item     当前点击的对象
       * @param  {string} moveType 上移forward 或是 下移backword
       * @return {[type]}          [description]
       */
      changeIndex (index, moveType) {
        if(moveType == "forward") { //点击上移
          let temp = this.tempSwiperData.swiperData[index - 1]
          this.tempSwiperData.swiperData[index - 1] = this.tempSwiperData.swiperData[index]
          this.tempSwiperData.swiperData[index] = temp
        } else { //点击下移
          let temp = this.tempSwiperData.swiperData[index + 1]
          this.tempSwiperData.swiperData[index + 1] = this.tempSwiperData.swiperData[index]
          this.tempSwiperData.swiperData[index] = temp
        }
        let swiper = JSON.parse(JSON.stringify(this.tempSwiperData))
        this.tempSwiperData = swiper
      },
      /**
       * 上传成功, 写入img对应的path
       * @param  {[type]} response [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      uploadSuccess (response, file, fileList) {
        //上传完成后把信息写入对应tempSwiperData.swiperData的path
        this.tempSwiperData.swiperData[this.tempSwiperIndex].imgUrl = response.data.path
      },
      /**
       * 点击确定, 保存数据
       * @return {[type]} [description]
       */
      saveSwiper () {
        if(this.contentOperateType == "new") {
          //无删除时index + 1
          this.contentData.splice(this.tempContentIndex + 1, 0,this.tempSwiperData)
        } else if(this.contentOperateType == "edit") {
          this.contentData.splice(this.tempContentIndex, 1, this.tempSwiperData)
        }
        let homeDataForm =  {
            "aTypeId": '',
            "config":  JSON.stringify(this.tempSwiperData),
            "homeId":  this.homeData.homeId, 
            "orgId":   this.orgId,
            "type":    3, //type  ：1、分类；2、专题；3、图片滚动；4、视频
        } 
        if(this.contentOperateType == 'edit'){
          homeDataForm.itemId = this.tempSwiperData.itemId;
        }

        this.saveContentDataToServer(homeDataForm)
        this.swiperDialogVisible = false
      },
      /*
       * 创建首页基本设置信息表单
       */
      submitHomeSettingForm(formName){
        let url = `${this.common.basePath}/home/home/create`;
        let method ='post';
        if(this.editHomeSettingVisible){
          url = `${this.common.basePath}/home/home/home_config/update`;
          method = 'put';
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios[method]( url, this.homeSettingForm ).then( (response) => {  
              this.$message.success(response.meta.message);
              this.getHomeSetting();
              this.editHomeSettingVisible = false;
            }).catch( (error) => {  
              this.editHomeSettingVisible = false;
              this.$message.error(error); 
            });  
          } else { 
            return false;
          }
        });
        
      },
      /*
       * 重置首页基本设置信息表单
       */
      resetHomeSettingForm(fromName){

      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  /*侧边栏*/
  .el-aside {
    padding: 10px;
  }
  /*侧边栏 >> 类型列表*/
  .type-list-wrap {
    background: #fff;
    border: 1px solid #eee; 
  }
  .type-list-wrap .type-list{
    list-style: none;
    padding: 0;
    margin: 10px;
  }
  .type-list-wrap .type-list .list-item {
    padding: 8px 16px;
  }
  .type-list-wrap .type-list .list-item:hover {
    background: #e4e4e4;
    cursor: pointer;
  }
  .type-list-wrap .type-list .list-item.active {
    color: #dc3a3a;
    border-left: 3px solid #dc3a3a;
  }
  .qr-code-wrap {
    margin: 20px 0;
  }
  .qr-code-wrap img {
    width: 100%;
    border: 1px solid #d8d8d8;
  }
  .qr-code-wrap p {
    margin: 0;
    text-align: center;
  }
  /*侧边栏 >> 右键菜单*/
  #aside-right-menu {
    position: absolute;
    z-index: 99;
  }
  #aside-right-menu ul{
    margin: 0;
    padding: 5px;
    list-style: none;
    font-size: 14px;
    background: #fff;
    outline: 1px solid #ececec;
  }
  #aside-right-menu ul li {
    padding: 5px 10px;
    cursor: pointer;  
  }
  #aside-right-menu ul li:hover {
    background: #e4e4e4;
  }
  /*主体 >> 模块*/
  .el-main {
    max-height: calc(100vh - 115px);
    padding: 10px;
    overflow-y: auto;
  }
  .block-wrap {
    padding: 10px;
  }
  .block-wrap.swiper-wrap {
    padding: 0; 
    height: 373px; /*统一两种类型的高度*/
  }
  .block-wrap.news-wrap {
    padding-top: 32px;
    height: 373px; /*统一两种类型的高度*/
  }
  .grid-content {
    position: relative;
  }
  .main-block-wrap {
    height: 328px;
    border: 1px solid #d8d8d8;
    border-top: 2px solid #dc3a3a;
    background: #fff;
  }
  .main-block-wrap .btn-group {
    display: block;
    height: 28px;
    padding: 5px;
    font-size: 14px;
    text-align: right;
  }
  .btn-group button {
    margin: 0;
    padding: 7px;
  }
  .block-wrap .swiper-title {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 30px 20px;
    margin: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    line-height: 40px;
    z-index: 99;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .block-wrap .btn-group.swiper-btn-group {
    position: relative;
    z-index: 99;
    text-align: right;
    padding: 5px;
  }
  .main-block-wrap .main-block-title{
    position: absolute;
    top: -31px;
    left: 0;
    padding: 5px 10px;
    background: #dc3a3a;
    color: #fff;
  }
  .el-carousel__item {
    background-color: #99a9bf;
  }
  .add-swiper-item {
    margin-bottom: 10px;
  }
  .divide-line {
    border-top: 1px solid #c7c7c7;
    border-bottom: 1px solid #c7c7c7;
    height: 0px;
    padding-top: 2px;
    margin: 20px 0; 
  }
  .tips-text {
    display: block;
    font-size: 14px;
    color: #909090;
    margin-bottom: 10px;
  }
</style>

<!-- 强制样式 -->
<style> 
  /* 主体 > 新增/编辑 轮播 */
  .avatar-uploader .el-upload {
    width: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 250px;
    display: block;
  }
</style>