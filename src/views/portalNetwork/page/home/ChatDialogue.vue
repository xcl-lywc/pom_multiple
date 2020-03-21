/**************************************
*---------------------首页-----------*
***************************************/
<template>
  <div v-loading="isloading" class="row pad-l20 pad-r20 mr-t5">
    <el-row :gutter="20">
      <el-col :span="17">
        <el-card shadow="never" class="box-card mart20">
          <el-breadcrumb class="marb20" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">{{loginInUserInfo.real_name}}</el-breadcrumb-item>
            <el-breadcrumb-item>聊天记录</el-breadcrumb-item> 
          </el-breadcrumb>
          <el-divider></el-divider>
          <div class="mart20 chat">
            <!-- 聊天start -->
            <el-row>
              <!-- 聊天人员start -->
              <el-col :span="8" class="chat-person">
                <el-card shadow="never">
                  <div class="search-input-wrapper">
                    <el-input placeholder="请输入名字" prefix-icon="el-icon-search" v-model="input2" clearable @clear="input2=null" size="small" @change="getUserList();"></el-input>
                  </div>
                  <el-card shadow="never" class="infinite-list-wrapper">
                    <ul
                      v-if="userObj.total>0"
                      class="list">
                      <li v-for="(i,index) in userObj.rows" v-if="i.id!=loginInUserInfo.id" class="list-item cursor-pointer" @click="current_user=i;chatRecord.total=0;chatRecord.rows=[];elementPageData.pageNum_=1;batchReadingNews(true);">
                        <el-avatar :size="40" :src="i.picture" class="fl head-img" @error="true">
                          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                        </el-avatar>
                        <div class="fr info">
                          <p :class="{'activeColor':current_user&&current_user.id===i.id}">{{i.real_name}}</p>
                          <p class="ellipsis last-news">{{i.email}}</p>
                        </div>
                      </li>
                    </ul>
                    <p v-if="userObj.total===0" class="noMore">暂无数据</p>
                    <p v-if="loading" class="loading">加载中...</p>
                    <p v-if="noMore" class="noMore">没有更多了</p>
                  </el-card>
                  <el-backtop target=".infinite-list-wrapper" :bottom="155" style="right: calc(100vw - 330px);"></el-backtop>
                </el-card>
              </el-col>
              <!-- 聊天人员end -->
              <!-- 聊天容器start -->
              <el-col :span="16" class="chat-wrapper"
                v-loading="chatloading"
                :element-loading-text="chatloadingText"
                element-loading-spinner="el-icon-loading">
                <el-card shadow="never" :body-style="{ padding: '0px' }">
                  <div class="top-bar">{{current_user?current_user.real_name:''}}</div>
                  <el-divider></el-divider>
                  <div class="mid-bar" @scroll="scrollLoadMore($event)" id="chat-wrapper">
                    <div v-if="isShowHistoryLoading" v-loading="true" class="mart10 padb5" element-loading-spinner="el-icon-loading" element-loading-background="transparent"></div>
                    <!-- 聊天历史记录 -->
                    <div class="history-news marb10" v-if="chatRecord.total>0">
                      <div v-for="(item,index) in chatRecord.rows">
                        <div class="chat-record " :class="{'text-left':item.sender!=loginInUserInfo.id,'text-right':item.sender==loginInUserInfo.id}">
                          <div class="brief-info">
                            <el-avatar :size="30" :src="item.headImg" :class="{'fr':item.sender==loginInUserInfo.id,'fl':item.sender!=loginInUserInfo.id}" @error="true">
                              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                            </el-avatar>
                            <div class="remarks" :class="{'fl':item.sender==loginInUserInfo.id,'fr':item.sender!=loginInUserInfo.id}">
                              <span v-if="item.sender!=loginInUserInfo.id">{{item.senderName}} &nbsp;{{common._convertDate(item.createTime,'MM/dd hh:mm:ss')}}</span>
                              <span v-if="item.sender==loginInUserInfo.id">{{common._convertDate(item.createTime,'MM/dd hh:mm:ss')}} &nbsp;{{item.senderName}}</span>
                            </div>
                          </div>
                          <div class="content" :class="{'marr30':item.sender==loginInUserInfo.id,'marl30':item.sender!=loginInUserInfo.id}" v-html="item.messageInfo ? item.messageInfo.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : item.messageInfo"></div>
                        </div>
                      </div>
                    </div>
                    <!-- <el-divider v-if="chatRecord.total==0">暂无聊天历史记录</el-divider> -->
                    <el-divider v-if="chatRecord.total!=0">以上是聊天历史记录</el-divider>
                    <div class="mart10" v-if="chatRecord.total==0&&current_user">
                      <el-divider>
                        <el-link type="primary" @click="elementPageData.pageNum=1;queryChatRecord(true)">查看聊天历史</el-link>
                      </el-divider>
                    </div>
                    <!-- 聊天新消息 -->
                    <div class="newest-news mart10" v-for="(item,index) in chatArr_branch()" :key="index">
                      <div :class="{'chat-record':true,'text-left':item.whoType === 'they','text-right':item.whoType === 'we'}">
                        <div class="brief-info">
                          <el-avatar :size="30" :src="JSON.parse(item.m).creater === '我' ? computed_picture(loginInUserInfo.id) : computed_picture(JSON.parse(item.m).creater)" :class="{'fl':item.whoType === 'they','fr':item.whoType === 'we'}" @error="true">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                          </el-avatar>
                          <div :class="{'remarks':true,'fr':item.whoType === 'they','fl':item.whoType === 'we'}">{{JSON.parse(item.m).creater === '我' ? JSON.parse(item.m).creater : computed_creater(JSON.parse(item.m).creater)}} &nbsp;{{common._convertDate(JSON.parse(item.m).createDate,'MM/dd hh:mm:ss')}}</div>
                        </div>
                        <div :class="{'content':true,'marl30':item.whoType === 'they','marr30':item.whoType === 'we'}" v-html="JSON.parse(item.m).info ? JSON.parse(item.m).info.replace(/\r/g,'<br/>').replace(/\n/g,'<br/>') : JSON.parse(item.m).info"></div>
                      </div>
                    </div>
                  </div>
                  <el-divider></el-divider>
                  <div class="bottom-bar">
                    <!-- 发送表情 -->
                    <el-popover
                      placement="top"
                      title="添加表情"
                      width="500"
                      trigger="hover">
                      <div id="emotion-app">
                        <div class="show-emotion-area" v-if="selectionEmotionArr.length>0">
                          <div class="emotion customEditor">
                            <img v-for="(item,index) in selectionEmotionArr" :key="index" :src="item.emotion_icon" :alt="'['+item.emotion+']'">
                          </div>
                          <div class="btn">
                            <el-button type="primary" :disabled="current_user?false:true" class="fr marl10" @click="chat.messageType=3;emotionHtmlStr(selectionEmotionArr)" size="mini">发 送</el-button>
                            <el-button type="" @click="selectionEmotionArr = [];" size="mini" class="fr">清 空</el-button>
                            <el-button type="" @click="selectionEmotionArr.pop();" size="mini" class="fr">回 退</el-button>
                          </div>
                        </div>
                        <sina-emotion 
                          :source="emotionArr"
                          @changeEmotion="emotion=arguments[0].phrase;emotion_icon=arguments[0].icon;emotionJsonFun(emotion,emotion_icon);">    
                        </sina-emotion>
                      </div>
                      <i class="el-icon-eleme marb10 marr10 cursor-pointer mart5" title="表情" slot="reference" @click="chat.messageType=3"></i>
                    </el-popover>
                    <!-- 上传文件、图片 -->
                    <el-dropdown @command="chat.messageType=4;" trigger="hover" placement="top">
                      <span class="el-dropdown-link">
                        <i class="el-icon-upload marb10 cursor-pointer mart5" title="上传文件、图片" @click='chat.messageType=4;'></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="image">
                          <el-upload
                            class="uploadimage"
                            :action="`${common.basePath}/user/file/upload`"
                            :headers="myHeaders"
                            :show-file-list="false"
                            name="file"
                            :data="{type:'chatImage',group_id:orgId}"
                            :on-success="handleSuccessSingleImage"
                            :on-error="handleErrorSingleImage"
                            :before-upload="beforeUploadSingleImage">
                            <el-button type="primary" size="mini" @click='chat.messageType=4;'>上传图片<i class="el-icon-picture-outline el-icon--right"></i></el-button>
                          </el-upload>
                        </el-dropdown-item>
                        <el-dropdown-item  command="file">
                          <el-upload
                            class="uploadfile"
                            :action="`${common.basePath}/user/file/upload`"
                            :headers="myHeaders"
                            :show-file-list="false"
                            name="file"
                            :data="{type:'chatFile',group_id:orgId}"
                            :on-success="handleSuccessSingleFile"
                            :on-error="handleErrorSingleFile"
                            :before-upload="beforeUploadSingleFile">
                            <el-button type="success" size="mini" @click='chat.messageType=4;'>上传文件<i class="el-icon-folder-opened el-icon--right"></i></el-button>
                          </el-upload>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- 清空聊天记录 -->
                    <i class="el-icon-delete marb10 marl10 cursor-pointer mart5" title="清空聊天记录" @click="clearRecord();"></i>
                    <!-- 发送文字 -->
                    <el-button type="primary" size="mini" class="fr marb5" @click="chat.messageType=2;heatBeat_sendMessage(chat.value,'text')" :disabled="current_user?false:true">发 送</el-button>
                    <!-- 文本框 -->
                    <el-form :model="chat" ref="chat" label-width="0">
                      <el-form-item
                        prop="value"
                        :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },
                        { min: 1, max: 1000, message: '长度在 1 到 100 个字符', trigger: 'blur' },]">
                        <el-input 
                          type="textarea" 
                          v-model="chat.value"
                          rows="3" 
                          placeholder="请输入内容"
                          :disabled="current_user?false:true" 
                          @input="chat.messageType = 2" 
                          @keypress.enter.native="press_enter($event)"
                          @keydown.ctrl.enter.native="down_ctrlEnter()"></el-input>
                      </el-form-item>
                    </el-form>
                    <i class="tips">Enter 发送，Ctrl+Enter 换行</i>
                  </div>
                </el-card>
              </el-col>
              <!-- 聊天容器end -->
            </el-row>
            <!-- 聊天end -->

          </div>
        </el-card> 
      </el-col>
      <el-col :span="7">
        <!-- 日历 -->
        <RightCanlendarBlock></RightCanlendarBlock>
        <!-- 通知列表 -->
        <RightNoticeBlock></RightNoticeBlock>
        <!-- 代办事务列表 -->
        <RightAffairBlock></RightAffairBlock>
      </el-col>
    </el-row> 

  </div>
</template>

<script>  
  import RightCanlendarBlock from '../../components/RightCanlendarBlock.vue'
  import RightNoticeBlock from '../../components/RightNoticeBlock.vue'
  import RightAffairBlock from '../../components/RightAffairBlock.vue'
  import SinaEmotion from '../../components/SinaEmotion.vue';//新浪表情
  export default { 
    components: {
      RightCanlendarBlock,
      RightNoticeBlock,
      RightAffairBlock,
      SinaEmotion
    },
    data() {
      return {
        isloading:          false,       //主页面加载
        loginInUserInfo:    JSON.parse(sessionStorage.getItem('loginInUserInfo')), //登录人员相关账号信息
        token:              sessionStorage.getItem('token'),    //框架的数据
        orgId:              sessionStorage.getItem('orgId'),    //组织id
        myHeaders:          {Authorization: 'Bearer ' + sessionStorage.getItem('token')},

        input2:null,//人员搜索框
        userObj: {rows:[],total:0},//人员
        loading: false,//人员列表加载更多
        noMore: false,//人员列表没有更多了
        current_user:null,//当前人员
        chatloading:false,//聊天室加载
        chatloadingText:'加载中...',//聊天室加载文字提示
        emotionArr: this.emotion.emotionArr ? this.emotion.emotionArr : [],
        emotion: '[表情]',
        emotion_icon:'',
        selectionEmotionArr:[],//选中的表情数组
        chat:{
          value:null,//消息体
          messageType:2,//消息类型 1、加群消息，2、文字消息，3、表情消息，4、文件消息，5、语音消息，6、撤回消息
        },
        elementPageData: {
          //历史记录向上滚动加载
          pageNum:        1,
          pageSize:       10,
          //历史记录向下滚动加载
          pageNum_:        1,
          pageSize_:       20,
        },
        scrollLoadSw: true, //滚动加载开关
        isShowHistoryLoading:false,//是否展示历史加载的开关
        chatRecord:{total:0,rows:[]},//聊天记录
        unReadNews:{total:0,rows:[]},//批量未读消息
        chatArr:sessionStorage.getItem('chatRecord') ? JSON.parse(sessionStorage.getItem('chatRecord')) : [],//暂缓记录，聊天信息

        websock: null, //webSocket对象
        reconnectData:null,
        lockReconnect:false,    //避免重复连接，因为onerror之后会立即触发 onclose
        timeout:30000,          //30s一次心跳检测
        timeoutObj:null,
        serverTimeoutObj:null,
      };
    },
    created () {
      if(sessionStorage.getItem('token')) {
        this.initWebSocket();
      }else {
        this.$message.error("登录失效, 请重新登录!");setTimeout(()=> {this.$router.push({name:"Login"})}, 2000);
      }
    },
    mounted() { 
      this.getUserList();
      this.getMyUnReadNews();
      // console.log(this.$store.state.socket)
    }, 
    computed:{
      chatArr_branch(){//计算我与当前私聊人员应该显示的聊天内容
        return function(){
          let arr = this.chatArr;
          let newArr = [];
          arr.forEach( (item) => {
            if(JSON.parse(item.m).creater==='我'){
              JSON.parse(item.m).reader === this.current_user.id ? newArr.push(item) : '';
            }else if(JSON.parse(item.m).creater===this.loginInUserInfo.id){
              JSON.parse(item.m).reader === this.current_user.id ? newArr.push(item) : '';
            }else if(JSON.parse(item.m).creater===this.current_user.id){
              JSON.parse(item.m).reader === this.loginInUserInfo.id ? newArr.push(item) : '';
            }            
          }) 
          return newArr;
        }
      },
      computed_creater(){//计算成员姓名
        return function(creater){
          let arr = this.userObj.rows;
          let newVal = '暂无';
          for(var i= 0;i<arr.length;i++){
            arr[i].id === creater ? newVal = arr[i].real_name : '';
          }
          return newVal;
        }
      },
      computed_picture(){//计算成员头像
        return function(creater){
          let arr = this.userObj.rows;
          let newVal = '';
          for(var i= 0;i<arr.length;i++){
            arr[i].id === creater ? newVal = arr[i].picture : '';
          }
          return newVal;
        }
      }
    },
    watch:{
    
    },
    methods: { 

      clearRecord(){
        this.chat.value = null;
        sessionStorage.removeItem('chatRecord');
        this.chatArr=[];
      },

      /**
       * 初始化WS
       * @return {[type]}                  [description]
       */
      initWebSocket(){
        if(typeof(WebSocket) === "undefined"){
          this.$message.error('您的浏览器不支持聊天，请升级浏览器或更换浏览器！');
        }else{
          this.chatloading = true;
          this.chatloadingText = '连接聊天室中...';
          //你的websockt url
          let wsuri = '';
          window.location.protocol === 'http:' ? 
          wsuri = `ws://192.168.31.10:19007/websocket/web/${sessionStorage.getItem('token')}`:
          wsuri = `wss://${this.common.httpSocketSever}/${sessionStorage.getItem('token')}`;
          //创建websoket
          if('WebSocket' in window){
            this.websock = new WebSocket(wsuri);
          }else if('MozWebSocket' in window){
            this.websock = new MozWebSocket(wsuri);
          }else{
            this.websock = new SockJS(wsuri);
          }
          //链接websoket
          this.websock.onopen = this.websocketonopen; //连接成功,发送数据      
          this.websock.onmessage = this.websocketonmessage;  //广播成功,数据接收   
          this.websock.onerror = this.websocketonerror;  //连接断开、失败      
          this.websock.onclose = this.websocketclose; //各种问题导致连接关闭
        }
      },
      //连接成功,发送数据
      websocketonopen(){
        this.chatloading = false;
        this.$message({type:'success',message:'连接成功！'});
        // this.heatBeat();
      },
      //心跳检测+消息发送
      heatBeat_sendMessage(val,type){
        this.sendMessage(val,type);
        return;
        console.log('心跳检测中...')
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(()=>{
            this.sendMessage(val,type);
            this.serverTimeoutObj = setTimeout(()=> {
              this.websock.close(); this.websock = null;      //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, 5000);
        }, this.timeout)
      },
      //发送消息
      sendMessage(val,type){
        if(type==='text'){
          this.$refs['chat'].validate((valid) => {
            if (valid) {
              this._sendRequest(val,type);
            } else {
              return false;
            }
          }); 
        }else{
          this._sendRequest(val,type);
        }      
      },
      _sendRequest(val,type){
        if(this.websock&&this.websock.readyState === 1){
          let actions  = {
            "infoType":this.chat.messageType,
            "info":val,
            'readerId':this.current_user.id,
          };
          if(type==="text"){if(actions.info.replace(/^\s+|\s+$/g, ' ') === ' ' ){this.$message.error('内容不能为空！');this.chat.value =null;return;}}
          this.axios.post(`${this.common.basePath}/user/online_chat/send`,actions).then((response) => {

            //(私聊)
            let m = {
              "chatId":null,
              "createDate":(new Date()).getTime(),
              "creater":'我',//发送者
              "curStatus":null,
              "info":val,
              'reader':this.current_user.id,//接收者
              'messageType':this.chat.messageType,
            };
            //暂缓我发送的信息体(私聊)
            let temporary_actions = {
              m: JSON.stringify(m), 
              t: 2,//1表示群聊消息，2表示私聊消息
              whoType:'we',
            };
            this.chatArr.push(temporary_actions);//暂缓聊天记录
            sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
            console.log('暂缓信息',this.chatArr);

            //发送成功后，清空文本框内容
            type==='text'?this.chat.value = null:'';
            //发送成功后，清空表情
            type==='emotion'?this.selectionEmotionArr = []:'';
            // console.log('211212')
            this.scrollToBottom();
            // console.log('2121')
          }).catch((error) => {
            this.$message.error(error);  
          });
        }else{
          this.$message.error('聊天室已经关闭或不可用,无法发送信息！');        }
      },
      //广播成功,数据接收   
      websocketonmessage(e){
        // this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
        const redata = JSON.parse(e.data);
        console.log('广播成功',redata);
        if('messageType' in redata&&this.loginInUserInfo.id!=redata.sender){//接收消息
          if(redata.messageType===1){//接受私聊消息
            this.getMyUnReadNews(true);//刷新获取私聊我的消息
            //当前用户如果有消息，需读取
            if(this.current_user.id === redata.sender){//表示当前用户
              //有消息时，单条读取
              redata.receivers.indexOf(this.loginInUserInfo.id)!=-1 ? this.singleReadNews(redata.msgId) : '';
            }
            //暂缓接收的信息体(私聊)
            let m = {
              "chatId":redata.msgId,
              "createDate":(new Date()).getTime(),
              "creater":redata.sender,
              "curStatus":null,
              'reader':redata.receivers[0],//接收者
              "info":redata.messageInfo,
              'messageType':redata.messageType,
            };
            let temporary_redata = {
              m: JSON.stringify(m), 
              t: redata.messageType===1?2:1,//1表示群聊消息，2表示私聊消息
              whoType:'they',
            };
            this.current_user.id === redata.sender ? this.chatArr.push(temporary_redata) : '';//暂缓接受到的信息
            if(this.loginInUserInfo.id!=redata.sender){
              this.$notify({
                dangerouslyUseHTMLString:true,//是否将 message 属性作为 HTML 片段处理
                message: '<b>'+this.computed_creater(redata.sender)+'</b> 向 <i style="color:teal">'+this.computed_creater(redata.receivers[0])+'</i>  发送了新消息！',
                // type: 'success',
                duration:5000,
                offset: 0
              });
            }
          }
          sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
          console.log('暂缓信息',this.chatArr)
        }
        this.scrollToBottom();
      },
      //连接失败,执行重连
      websocketonerror(e){
        this.websock = null;
        this.reconnect();
      },
      //各种问题导致连接关闭
      websocketclose(e){  
        console.log('各种原因导致soket关闭,错误码为：'+e.code);
        this.websock = null;this.reconnect();
      },
      //心跳检测
      heatBeat(){
        console.log('心跳检测')
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(()=>{
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            console.log('send ping');
            this.websock.send("ping");
            this.serverTimeoutObj = setTimeout(()=> {
              console.log(this.websock);
              this.websock.close(); this.websock = null;      //如果  30秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
            }, this.timeout);
        }, this.timeout)
      }, 
      //执行重连
      reconnect(){
        this.chatloading = true;
        this.chatloadingText = '连接失败！正在尝试重连....';
        if(this.lockReconnect){//这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
          return
        }
        this.lockReconnect = true;
        this.reconnectData && clearTimeout(this.reconnectData);
        this.reconnectData = setTimeout(()=>{
          this.initWebSocket();
          this.lockReconnect = false;
        },5000)
      },

      /**
       * 滚动(聊天框默认滚动到底部)
       * @return {[type]} [description]
       */
      scrollToBottom(){
        // console.log('2555')
        // 滚动(聊天框默认滚动到底部)
        this.$nextTick(() => {
          let msgBox = document.getElementById('chat-wrapper') // 获取对象
          // console.log(msgBox)
          msgBox ? msgBox.scrollTop = msgBox.scrollHeight :'';// 滚动高度
        })
      },
      /**
       * ctrl+enter换行
       * @return {[type]} [description]
       */
      down_ctrlEnter(){
        if(this.chat.value){
          this.chat.value += '\r\n';
        }else{
          this.chat.value = '';
          this.chat.value += '\r\n';
        }
      },
      /**
       * enter回车发送文字消息
       * @param  {[type]} evt [description]
       * @return {[type]}     [description]
       */
      press_enter(evt){
        evt.preventDefault();
        this.chat.messageType=2;
        this.heatBeat_sendMessage(this.chat.value,'text') ;
      },
      /**
       * 把选中的表情组成一个数组
       * @param  {[type]} emotion      [description]
       * @param  {[type]} emotion_icon [description]
       * @return {[type]}              [description]
       */
      emotionJsonFun(emotion,emotion_icon){
        this.selectionEmotionArr.push({emotion:emotion,emotion_icon:emotion_icon});
      },
      /**
       * 把表情拼成html字符串,消息类型：infoType为3（表情消息）,然后发送，无法在文本域显示表情，也无法发送表情加文字
       * @param  {[type]} selectionEmotionArr      [description]
       * @return {[type]}                          [description]
       */
      emotionHtmlStr(selectionEmotionArr){
        let val = "";
        selectionEmotionArr.forEach( function(element, index) {
          val += '<img src="'+ element.emotion_icon +'" alt="'+ element.emotion +'"/>';
        });
        this.heatBeat_sendMessage(val,'emotion');
      },
      /**
       * 聊天上传单张图片
       */
      handleSuccessSingleImage(res,file,fileList) {//文件上传成功时的钩子
        if(res.meta.code === 0){
          let val = "";
          if(file.size>120000){//图片太大，限制宽300高150
            val ='<img src="'+ res.data[0].path +'" alt="'+ res.data[0].fileName +'" width="300" height="150" />';
          }else{
            val ='<img src="'+ res.data[0].path +'" alt="'+ res.data[0].fileName +'"/>';
          }
          let fileId = res.data[0].fileId;
          this.heatBeat_sendMessage(val,"upload");
        }else{
          this.$message.error(res.meta.message);
        }
      },
      handleErrorSingleImage(err, file, fileList){//文件上传失败时的钩子
        this.$message.error('上传失败!!');
      },
      beforeUploadSingleImage(file) {//限制用户上传的图片格式和大小
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt100M = file.size / 1024 / 1024 < 100;

        if (!isJPG && !isPNG) {
          this.$message({type:'error',message: '上传图片只能是 JPG/PNG 格式!',offset:100});
        }
        if (!isLt100M) {
          this.$message.error('上传图片大小不能超过 100MB!');
        }
        return isLt100M && (isJPG || isPNG);
      },
      /**
       * 聊天上传单个文件
       */
      handleSuccessSingleFile(res,file,fileList) {//文件上传成功时的钩子
        if(res.meta.code === 0){
          let val = '<a class="a" href="'+ res.data[0].path +'" target="_blank"><i class="el-icon-folder el-icon--right"></i> '+ res.data[0].fileName +'</a>';
          let fileId = res.data[0].fileId;
          this.heatBeat_sendMessage(val,"upload");
        }else{
          this.$message.error(res.meta.message);
        }
      },
      handleErrorSingleFile(err, file, fileList){//文件上传失败时的钩子
        this.$message.error('上传失败!!');
      },
      beforeUploadSingleFile(file) {//限制用户上传的图片格式和大小
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 100MB!');
        }
        return isLt100M;
      },
      
      /**
       * 用户列表list查询
       * @return {[type]} [description]
       */
      getUserList(){  
        this.isloading = true;
        this.axios.post(`${this.common.basePath}/user/user/list`,{realName:this.input2}).then((response) => {
          this.userObj = response.data;

          this.current_user = response.data ? response.data.rows[0] :　null;
          if(response.data.total>0){
            if(response.data.rows[0].id!=this.loginInUserInfo.id){
              this.current_user = response.data.rows[0];
            }else{
              if(response.data.total>1){
                this.current_user = response.data.rows[1];
              }else{
                this.current_user = null;
              }
            }
          }else{
            this.current_user = null;
          }

          this.elementPageData.pageNum_=1;
          this.current_user ? this.batchReadingNews(true) : '';

          this.isloading = false;
        }).catch((error) => {
          this.isloading = false;
          this.$message.error(error);  
        });
      },

      /**
       * 获取获取私聊我的消息
       * @return {[type]} [description]
       */
      getMyUnReadNews(){
        this.axios.get(`${this.common.basePath}/user/online_chat/un_read`,{params:{pageNum:1,pageSize:10}}).then((response) => {
          
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 单条阅读新消息
       * @param  {[type]} messageId 消息id
       * @return {[type]}     [description]
       */
      singleReadNews(messageId){
        this.axios.post(`${this.common.basePath}/push/message/receive`,[messageId]).then((response) => {
          this.getMyUnReadNews();//刷新
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 批量阅读新消息,请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @param  {Boolean} isRefresh true为重置数据 false累加数据
       * @return {[type]}            [description]
       */
      batchReadingNews(isRefresh){  
        this.axios.post(`${this.common.basePath}/push/message/chat/list`,this._batchParams(isRefresh)).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.unReadNews.rows = this.unReadNews.rows.concat(response.data.rows);
            this.unReadNews.total = response.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.unReadNews = response.data;
          }
          //--------暂缓未读消息 -------
          this.cacheUnReadInfo(this.unReadNews);
          this.getMyUnReadNews();//刷新
          this.scrollToBottom();
          // ------- 请求完毕，将滚动开关设置为true
          this.getMyUnReadNews(true);//刷新
          this.scrollLoadSw = true;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
        });
      },
      _batchParams(isRefresh){
        return{
          sender:this.current_user.id,
          receiver:this.loginInUserInfo.id,
          fromType:1,
          curStatus:1,// 1未读，2已读
          pageNum:this.elementPageData.pageNum_,
          pageSize:this.elementPageData.pageSize_,
        }
      },
      //暂缓未读信息
      cacheUnReadInfo(unReadNews){
        let m = {};
        if(unReadNews.total!=0){
          unReadNews.rows.forEach( (item) => {
            m = {
              "chatId":item.msgId,
              "createDate":item.createTime,
              "creater":item.sender,//发送者
              "curStatus":null,
              "info":item.messageInfo,
              'reader':item.receiver,//接收者
              'messageType':item.messageType,
            };
            let temporary_redata ={
              m: JSON.stringify(m), 
              t: 2,//1表示群聊,2表示私聊
              whoType:item.sender===this.loginInUserInfo.id?'we':'they',
            }
            this.chatArr.push(temporary_redata);//暂缓未读消息
          });
          sessionStorage.setItem('chatRecord',JSON.stringify(this.chatArr));//session暂缓聊天记录
        }        
      },
      /**
       * 查询历史聊天记录,请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @param  {Boolean} isRefresh true为重置数据 false累加数据
       * @return {[type]}            [description]
       */
      queryChatRecord(isRefresh){
        if(isRefresh){//初始化请求获取pageNum最大值
          this.isShowHistoryLoading = true;
          this.axios.post(`${this.common.basePath}/push/message/chat/list`,{sender:this.current_user.id,receiver:this.loginInUserInfo.id,messageType:1,}).then((response) => {
            this.elementPageData.pageNum = Math.ceil(response.data.total / this.elementPageData.pageSize);
            this._queryRequest(isRefresh);
            this.isShowHistoryLoading = false;
          }).catch((error) => {
            this.$message.error(error); 
            this.isShowHistoryLoading = false;
          });
        } else{
          this._queryRequest(isRefresh);
        }
      },
      _queryRequest(isRefresh){
        this.isShowHistoryLoading = true;
        this.axios.post(`${this.common.basePath}/push/message/chat/list`,this._queryParams(isRefresh)).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.chatRecord.rows = response.data.rows.concat(this.chatRecord.rows);
            this.chatRecord.total = response.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.chatRecord.rows = response.data.rows;
            this.chatRecord.total = response.data.total;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          this.isShowHistoryLoading = false;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          this.isShowHistoryLoading = false;
        });
      },
      _queryParams(isRefresh){
        return{
          sender:this.current_user.id,
          receiver:this.loginInUserInfo.id,
          fromType:1,
          curStatus:2,// 1未读，2已读
          pageNum:this.elementPageData.pageNum,
          pageSize:this.elementPageData.pageSize,
        }
      },
      //滚动加载更多历史聊天记录
      scrollLoadMore(event) {
        // if(event.srcElement.scrollHeight - (event.srcElement.scrollTop + event.srcElement.clientHeight) ==0){// 滑动到底部的时候操作数据
        //   if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
        //     this.scrollLoadSw = false;
        //     this.elementPageData.pageNum ++;
        //     if(this.elementPageData.pageNum <=Math.ceil(this.chatRecord.total / this.elementPageData.pageSize)){
        //       this.queryChatRecord(false);
        //     } 
        //   }
        // }
        if(event.srcElement.scrollTop == 0){// 滑动到顶部的时候操作数据
          if(this.scrollLoadSw){// ------ 值为true表示可以再次请求
            this.scrollLoadSw = false;
            this.elementPageData.pageNum --;
            if(this.elementPageData.pageNum > 0){
              this.queryChatRecord(false);
            } 
          }
        }
      },

    },
    destroyed(){
      if(this.websock){
        this.lockReconnect = true;  
        this.websock.close();this.websock = null;                  //全部关闭
        sessionStorage.removeItem('chatRecord') ;                  //清空暂缓聊天记录
        clearTimeout(this.reconnectData);                          //离开清除 timeout
        clearTimeout(this.timeoutObj);                             //离开清除 timeout
        clearTimeout(this.serverTimeoutObj);                       //离开清除 timeout
      }else{
        // this.$message('你尚未启动soket！')
      } 
    },
  }
</script>

<style lang="less" scoped>
  .chat{
    .activeColor{
      color: #461EE8;
    }

    .chat-person{
      .search-input-wrapper{
        
      }
      .infinite-list-wrapper{
        overflow:auto;
        margin-top:15px;
        height:550px;
        .list{
          overflow: hidden;
          .list-item{
            overflow: hidden;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            .head-img{

            }
            .info{
              width: calc(100% - 50px);
              .last-news{
                color:#666;
              }
            }
          }
        }
        .loading,.noMore{
          text-align: center;
          font-size: 14px;
          margin-top: 10px;
          color: #666;
        }
      }
    }
    .chat-wrapper{
      .top-bar{
        text-align: center;
        font-weight: 600;
        padding: 10px 0;
      }
      .mid-bar{
        height: 450px;
        box-sizing: border-box;
        padding: 10px 20px;
        overflow: auto;
        .history-news,.newest-news{
          overflow: auto;
        }
        .chat-record{
          overflow:hidden;
          width: 100%;
          margin-bottom: 10px;
          .brief-info{
            overflow:hidden;
            .remarks{
              width: calc(100% - 40px);
              font-size:14px;
              color: #999;
              padding-top: 5px;
            }
          }
          .content{
            box-sizing: border-box;
            margin-top: 5px;
            background: #03A9F4;
            padding: 10px 17px;
            border-radius: 10px;
            display: inline-block;
          }
        }
      }
      .bottom-bar{
        height: 144px;
        box-sizing: border-box;
        padding: 10px 20px;
        overflow: hidden;
        .tips{
          position: absolute;
          font-size: 12px;
          right: 30px;
          bottom: 10px;
        }
      }
    }
  }
</style>