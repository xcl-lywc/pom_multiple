/**************************************
*---------------------任务详情-----------*
***************************************/
<template>
  <div class="task-detail" v-loading="isLoading" ref="" v-if="!isNoViewing">
    <div class="overflow-hidden">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="fl mart8">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tasklist_'+CLASS }">{{taskCommon.returnTaskData(CLASS).name}}任务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/taskdetail_'+CLASS }">任务详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select 
        v-model="task" 
        placeholder="请选择任务"
        size="small"
        class="fr"
        @focus="taskList.total===0 ? getTaskList() : ''"
        @change="selectChange">
        <el-option v-for="(item,index) in taskList.rows" :label="item.taskName" :value="item.id" :key="item.id"></el-option>
      </el-select>
    </div>
    <el-container class="table-container" v-if="taskList.total>0">
      <el-header height="50px" class="line-height-50 mart10">
        <h4>任务信息</h4>
      </el-header>
      <el-main class="padrl20" v-if="detailInfo">
        <el-form 
          class="showform"
          label-width="100px">
          <el-form-item label="任务名称：">{{detailInfo.taskName}}</el-form-item>
          <el-row :gutter="20">
            <el-col :span='12'>
              <el-form-item label="开始时间：">{{common._convertDate(detailInfo.startTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="截止时间：">{{common._convertDate(detailInfo.endTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span='12'>
              <el-form-item label="创建者：">{{detailInfo.creator}}</el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="创建时间：">{{common._convertDate(detailInfo.createTime, 'yyyy/MM/dd hh:mm')}}</el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="关键词：">
            <div v-if="detailInfo.keyWords&&detailInfo.keyWords.length>0">
              <span v-for="item in detailInfo.keyWords">{{_conversion(Number(item))}}&nbsp;&nbsp;&nbsp;</span>
            </div>
          </el-form-item>
          <el-form-item label="任务状态：">
            <div v-if="detailInfo.status">
              <span v-for="item in statusArr">{{item.id==detailInfo.status?item.name:''}}</span>
            </div>
          </el-form-item>
          <el-form-item label="描述：">{{detailInfo.content}}</el-form-item>
          <el-form-item label="附件：">
            <div v-if="detailInfo.privateFile&&detailInfo.privateFile.length>0">
              <div v-for="(file,fileIndex) in detailInfo.privateFile">
                <!-- {{file.split('.')[file.split('.').length-1]}} -->
                <!-- {{'附件0'+(fileIndex+1)+'.'+flie.split('.')[1]}} -->
                <a :href="file" :download="'附件0'+(fileIndex+1)+'.'+file.split('.')[file.split('.').length-1]" title="点击下载" target="_blank" class="underline font-color-primary">
                  {{'附件0'+(fileIndex+1)+'.'+file.split('.')[file.split('.').length-1]}}
                </a>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>
        <div class="fr">
          <el-button type="danger" size="small" @click="approvalTask(task)" v-if="CLASS!='up'">审批</el-button>
          <el-button type="warning" size="small" @click="operateTaskId=task;dialogType=0;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;" v-if="CLASS!='down'">指派</el-button>
          <el-button type="success" size="small" @click="fileList=[];operateTaskId=task;dialogType=1;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;">汇报</el-button>
          <el-button type="primary" size="small" @click="fileList=[];operateTaskId=task;dialogType=2;$refs['form'] ? $refs['form'].resetFields():'';$refs['uploadfile']?$refs['uploadfile'].clearFiles():'';dialogVisible=true;echoTaskDetail(task);">修改</el-button>
        </div>
      </el-footer>
      <el-header height="50px" class="line-height-50 mart10">
        <h4>历史记录</h4>
      </el-header>
      <el-main class="padrl20">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="all" v-if="CLASS==='inner'">
            <el-card class="box-card marb10" :body-style="{ padding: '10px' }">
              <div class="overflow-hidden record">
                <div class="fl head-img">
                  <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </div>
                <div class="fr info">
                  <div class="info-top">
                    张三   2019-9-03
                  </div>
                  <div class="info-bottom">
                    Nunc ut sem id urna aliquet vestibulum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas vel fringilla lacus, efficitur ultricies quam. Fusce finibus eu nibh sit amet efficitur. Etiam efficitur sed erat vel vulputate. Sed eget augue vestibulum, ornare eros non, suscipit justo. Morbi ac odio cursus, rhoncus dui et, facilisis odi
                  </div>
                </div>
              </div>
            </el-card>
             <el-form 
              class='showform'
              :model="chatform" 
              ref="chatform">
              <el-form-item 
                prop="val"
                :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },]">
                <el-input type="textarea" v-model="chatform.val" rows="5" clearable @clear="chatform.val=null" maxlength="255" show-word-limit placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-button type="primary" size="small" @click="send('chatform')" class="fr mart5">发送</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="指派记录" name="assign" v-if="CLASS==='inner'">
            <el-card class="box-card marb10" :body-style="{ padding: '10px' }">
              <div class="overflow-hidden record">
                <div class="fl head-img">
                  <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </div>
                <div class="fr info">
                  <div class="info-top">
                    张三   2019-9-03
                  </div>
                  <div class="info-bottom">
                    Nunc ut sem id urna aliquet vestibulum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas vel fringilla lacus, efficitur ultricies quam. Fusce finibus eu nibh sit amet efficitur. Etiam efficitur sed erat vel vulputate. Sed eget augue vestibulum, ornare eros non, suscipit justo. Morbi ac odio cursus, rhoncus dui et, facilisis odi
                  </div>
                </div>
              </div>
            </el-card>
             <el-form 
              class='showform'
              :model="chatform" 
              ref="chatform">
              <el-form-item 
                prop="val"
                :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },]">
                <el-input type="textarea" v-model="chatform.val" rows="5" clearable @clear="chatform.val=null" maxlength="255" show-word-limit placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-button type="primary" size="small" @click="send('chatform')" class="fr mart5">发送</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="汇报记录" name="reporting-recored" v-if="CLASS==='down'">
            <div class="overflow-hidden" v-if="reportRecored.total>0">
              <el-collapse accordion>
                <div v-for="(item,index) in reportRecored.rows">
                  <el-collapse-item class="marb10">
                    <template slot="title">
                      <div class="overflow-hidden w-100">
                        <span class="fl">{{item.executeOrg}}</span>
                        <span class="fr marr10">{{common._convertDate(item.firstReportTime, 'yyyy/MM/dd hh:mm')}}，累计{{item.sourceTotal}}分</span>
                      </div>
                    </template>
                    <div class="overflow-hidden" v-if="item.info&&item.info.length>0">
                      <div v-for="(childrenitem,childrenindex) in item.info">
                        <el-card class="box-card marb10" :body-style="{ padding: '20px' }">
                          <el-form class='showform'>
                            <el-row :gutter='20'>
                              <el-col :span="12">
                                <el-form-item label='汇报标题：'>
                                  {{childrenitem.title}}
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label='汇报人：'>
                                  {{childrenitem.reportUser}}
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label='汇报时间：'>
                                  {{common._convertDate(childrenitem.reportTime, 'yyyy/MM/dd hh:mm')}}
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item label='汇报积分：'>
                                  {{childrenitem.source+'分'}}
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-form-item label='汇报内容：'>
                              {{childrenitem.content?childrenitem.content:'暂无数据'}}
                            </el-form-item>
                            <el-form-item label='附件：'>
                              {{childrenitem.privateFile}}
                            </el-form-item>
                            <el-form-item label='状态：'>
                              {{childrenitem.status}}
                            </el-form-item>
                          </el-form>
                        </el-card>
                      </div>
                    </div>
                    <div v-else class="no-data">暂无数据</div>
                  </el-collapse-item>
                </div>
              </el-collapse>
            </div>
            <div v-else class="no-data">暂无数据</div>
            <el-footer height="30px">
              <el-pagination
                class="fr"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="elementPageData.pageNum"
                :page-sizes="elementPageData.defaultData.pageSizes_s"
                :page-size="elementPageData.defaultData.pageSizeDefault_s"
                layout="total, sizes, prev, pager, next, jumper"
                :total="reportRecored.total">
              </el-pagination>
            </el-footer>
          </el-tab-pane>
          <el-tab-pane label="汇报历史" name="reporting-history" v-if="CLASS==='up'">
            <div class="overflow-hidden" v-if="reportHistory.total>0">
              <div v-for="(item,index) in reportHistory.rows">
                <el-card class="box-card marb10" :body-style="{ padding: '20px' }">
                  <el-form class='showform'>
                    <el-row :gutter='20'>
                      <el-col :span="12">
                        <el-form-item label='汇报标题：'>
                          {{item.title}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='汇报人：'>
                          {{item.reportUser}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='汇报时间：'>
                          {{common._convertDate(item.reportTime, 'yyyy/MM/dd hh:mm')}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='汇报积分：'>
                          {{item.source+'分'}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label='汇报内容：'>
                      {{item.content?item.content:'暂无数据'}}
                    </el-form-item>
                    <el-form-item label='附件：'>
                      {{item.privateFile}}
                    </el-form-item>
                    <el-form-item label='状态：'>
                      {{item.status}}
                    </el-form-item>
                    <el-button type="warning" size="small" @click="$message('无api')" class="fr mart5 marb10">评审</el-button>
                    <el-button type="primary" size="small" @click="$message('无api')" class="fr mart5 marb10 marr10">修改</el-button>
                  </el-form>
                </el-card>
              </div>
            </div>
            <div v-else class="no-data">暂无数据</div>
            <el-footer height="30px">
              <el-pagination
                class="fr"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="elementPageData.pageNum"
                :page-sizes="elementPageData.defaultData.pageSizes_s"
                :page-size="elementPageData.defaultData.pageSizeDefault_s"
                layout="total, sizes, prev, pager, next, jumper"
                :total="reportHistory.total">
              </el-pagination>
            </el-footer>
            <el-divider></el-divider>
            <el-form 
              :model="form" 
              ref="form"
              :label-width="formLabelWidth">
              <el-form-item 
                label="汇报标题：" 
                prop="title" 
                :rules="[{ required: true, message: '请输入汇报任务的标题', trigger: 'blur' }]">
                <el-input v-model="form.title" class="w300"></el-input>
              </el-form-item>
              <el-form-item 
                label="附件：" 
                prop="privateFile"
                label-position="top"
                :rules="[{ required: false, message: '请上传附件', trigger: 'blur' },]">
                <el-upload
                  ref="uploadfile"
                  class=""
                  :action="`${common.basePath}/user/file/upload`"
                  :headers="myHeaders"
                  :show-file-list="true"
                  :file-list="fileList"
                  :limit="10"
                  multiple
                  name="file"
                  :data="myFileData"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :on-error="handleError"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload">
                  <el-button size="small" type="primary">上传附件</el-button>
                  <span slot="tip" class="el-upload__tip mar0 line-height-16 marl5">最多上传10个附件，且单附件不超过50M</span>
                </el-upload>
              </el-form-item>
              <el-form-item 
                label="内容：" 
                prop="introduction"
                :rules="[{ required: false, message: '请输入内容', trigger: 'blur' },
                { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
                <el-input type="textarea" v-model="form.introduction" rows="5"></el-input>
              </el-form-item>
              <el-button type="success" size="small" @click="operateTaskId=task;submitForm('form',1,true)" class="fr" style="margin-top: -15px;">发 布</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="审批历史" name="approval" v-if="CLASS==='down'">
            <div class="overflow-hidden" v-if="approvalHistory.total>0">
              <div v-for="(item,index) in approvalHistory.rows">
                <el-card class="box-card marb10" :body-style="{ padding: '20px' }">
                  <el-form class='showform'>
                    <el-row :gutter='20'>
                      <el-col :span="12">
                        <el-form-item label='审批人：'>
                          {{item.approver}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='审批时间：'>
                          {{item.createTime}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label='审批内容：'>
                      {{item.content}}
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </div>
            <div v-else class="no-data">暂无数据</div>
            <el-footer height="30px">
              <el-pagination
                class="fr"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="elementPageData.pageNum"
                :page-sizes="elementPageData.defaultData.pageSizes_s"
                :page-size="elementPageData.defaultData.pageSizeDefault_s"
                layout="total, sizes, prev, pager, next, jumper"
                :total="approvalHistory.total">
              </el-pagination>
            </el-footer>
          </el-tab-pane>
          <el-tab-pane label="聊天记录" name="chat">
            <div v-if="chatRecored.total>0">
              <div v-for="(item,index) in chatRecored.rows" :key="index">
                <el-card class="box-card marb10" :body-style="{ padding: '10px' }">
                  <div class="overflow-hidden record">
                    <div class="fl head-img">
                      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                    </div>
                    <div class="fr info">
                      <div class="info-top">
                        {{item.spokesman_name}}&nbsp;&nbsp;&nbsp;{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}
                      </div>
                      <div class="info-bottom">
                        {{item.info}}
                        <el-link type="primary" @click="replyId=item.id;$refs['replychatform'] ? $refs['replychatform'].resetFields():'';replyDialogVisible=true;" class="fr font-size-12">回复</el-link>
                        <el-tree
                          class="overflow-hidden chat-tree"
                          :props="chatProps"
                          :data="item.comments"
                          empty-text='暂无回复'
                          node-key="id"
                          icon-class="el-icon-chat-line-round"
                          :expand-on-click-node="true"
                          ref="chatTree">
                          <div slot-scope="{ node, data }" class="w-100 overflow-hidden">
                            <div class="fl head-img">
                              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                            </div>
                            <div class="fr info">
                              <div class="info-top">
                                {{data.spokesman_name}}&nbsp;&nbsp;&nbsp;{{common._convertDate(data.create_time, 'yyyy/MM/dd hh:mm')}}
                              </div>
                              <div class="info-bottom">
                                {{data.info}}
                                <el-link type="primary" @click="replyId=data.id;$refs['replychatform'] ? $refs['replychatform'].resetFields():'';replyDialogVisible=true;" class="fr font-size-12" style="font-size:12px">回复</el-link>
                              </div>
                            </div>
                          </div>
                        </el-tree>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div> 
            <div v-else class="no-data">暂无数据</div>
            <el-footer height="30px">
              <el-pagination
                class="fr"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="elementPageData.pageNum"
                :page-sizes="elementPageData.defaultData.pageSizes_s"
                :page-size="elementPageData.defaultData.pageSizeDefault_s"
                layout="total, sizes, prev, pager, next, jumper"
                :total="chatRecored.total">
              </el-pagination>
            </el-footer>
            <el-divider></el-divider>
            <el-form 
              class='showform'
              :model="chatform" 
              ref="chatform">
              <el-form-item 
                prop="val"
                :rules="[{ required: true, message: '请输入描述内容', trigger: 'blur' },]">
                <el-input type="textarea" v-model="chatform.val" rows="5" clearable @clear="chatform.val=null" maxlength="255" show-word-limit placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-button type="primary" size="small" @click="send('chatform')" class="fr mart5">发送</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <div class="table-container no-data text-center" v-else>暂无数据</div>

    <!-- '任务指派','任务汇报','任务修改' 弹框 -->
    <el-dialog 
      :title="dialogTitle[dialogType]" 
      :visible.sync="dialogVisible"
      width='750px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          v-if="dialogType===0"
          label="指派给：" 
          prop="ids" 
          :rules="[{ required: true, message: '请选择至少一个指派人', trigger: 'change' }]">
          <el-select
            v-loading="isSelectLoading3"
            class="w300"
            v-model="form.ids"
            multiple
            filterable
            default-first-option
            @focus="assignList.total==0 ? getAssignList(3) : ''"
            placeholder="请选择至少一个指派人，可选择多个">
            <el-option
              v-for="item in assignList.rows"
              :key="item.id"
              :label="item.real_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===1"
          label="汇报标题：" 
          prop="title" 
          :rules="[{ required: true, message: '请输入汇报任务的标题', trigger: 'blur' }]">
          <el-input v-model="form.title" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===2"
          label="任务名称：" 
          prop="taskName" 
          :rules="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
          <el-input v-model="form.taskName" class="w300"></el-input>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===2"
          label="时间：" 
          prop="dataValue"
          :rules="[{ required: true, message: '请选择时间，且时间段必须是未来时间', trigger: 'change' }]">
          <el-date-picker
            v-model="form.dataValue"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="timestamp"
            size=""
            :picker-options="pickerOptions"
            @change="datatimerChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item 
          v-if="dialogType===2"
          label="关键词：" 
          prop="keyWords" 
          :rules="[{ required: true, message: '请选择至少一个关键词', trigger: 'change' }]">
          <el-select
            class="w-100"
            v-model="form.keyWords"
            multiple
            filterable
            default-first-option
            @focus="keyWords.total==0 ? getKeywords(4) : ''"
            placeholder="请选择至少一个关键词，可选择多个"
            v-loading="isSelectLoading4">
            <el-option
              v-for="item in keyWords.rows"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
          label="附件：" 
          prop="privateFile"
          label-position="top"
          :rules="[{ required: false, message: '请上传附件', trigger: 'blur' },]">
          <el-upload
            ref="uploadfile"
            class=""
            :action="`${common.basePath}/user/file/upload`"
            :headers="myHeaders"
            :show-file-list="true"
            :file-list="fileList"
            :limit="10"
            multiple
            name="file"
            :data="myFileData"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :on-error="handleError"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload">
            <el-button size="small" type="primary">上传附件</el-button>
            <span slot="tip" class="el-upload__tip mar0 line-height-16 marl5">最多上传10个附件，且单附件不超过50M</span>
          </el-upload>
        </el-form-item>
        <el-form-item 
          label="描述：" 
          prop="introduction"
          :rules="[{ required: false, message: '请输入描述内容', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.introduction" rows="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();$refs['uploadfile'].clearFiles();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType,false)" size="small">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 聊天消息回复 弹框 -->
    <el-dialog 
      title="回复消息" 
      :visible.sync="replyDialogVisible"
      width='400px'>
      <el-form 
        class='showform overflow-hidden'
        :model="replychatform" 
        ref="replychatform">
        <el-form-item 
          prop="reply"
          :rules="[{ required: true, message: '请输入回复的内容', trigger: 'blur' },]">
          <el-input type="textarea" v-model="replychatform.reply" rows="5" clearable @clear="replychatform.reply=null" maxlength="255" show-word-limit placeholder="请输入回复的内容"></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="reply('replychatform')" class="fr mart5">回复</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        CLASS:this.$route.path.split('_')[1],//class分类：inner---内部任务；up---上级任务；down---下级任务
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("task_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,

        dictionaryTask:26,//任务在字典的id
        task:this.common.getParamsByName('taskId')?Number(this.common.getParamsByName('taskId')):null,
        taskList:{rows:[],total:0},
        detailInfo:null,
        statusArr:[{name:'待评审',id:1},{name:'执行中',id:2},{name:'完成',id:3},{name:'撤销',id:4}],//任务状态的数组集合
        keyWords:{rows:[],total:0},//关键词
        myHeaders:{Authorization: 'Bearer ' + sessionStorage.getItem('token')},

        //'任务指派','任务汇报','任务修改' dialog
        dialogVisible: false,
        dialogTitle:['任务指派','任务汇报','任务修改',],
        dialogType:0,
        dialogLoading:false,
        isSelectLoading4:false,
        isSelectLoading3:false,
        isSelectLoading2:false,
        isSelectLoading1:false,
        formLabelWidth: '100px',
        form: {
          introduction:null,
          privateFile:[],
          ids:[],
          orgId:null,
          title:null,
          taskName:null,
          dataValue:[],
          keyWords:[],
        },
        fileList:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        assignList:{rows:[],total:0},//指派人
        operateTaskId:null,//任务id

        activeName: 'chat',
        chatform:{
          val:null,
        },
        replychatform:{
          reply:null,
        },
        chatRecored:{rows:[],total:0},//聊天记录
        elementPageData: { //分页需要的数据
          defaultData:  this.taskCommon.elementPagination,
          pageNum:      this.taskCommon.elementPagination.pageNumDefault_s,
          pageSize:     this.taskCommon.elementPagination.pageSizeDefault_s,
        },
        replyDialogVisible:false,
        replyId:null,
        chatProps: {
          children: 'comments',
          label: 'info'
        },
        reportHistory:{rows:[],total:0},//汇报历史
        reportRecored:{rows:[],total:0},//汇报记录
        approvalHistory:{rows:[],total:0},//审批历史

      }
    },
    computed:{
      myFileData(){
        return {type:'taskFile',org_id:this.party_org_id};
      },
    },
    mounted() { 
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('task_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("task_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }

      this.getKeyWords(4);
      this.getTaskList();
      this.queryChatRecored();
    },
    destoryed() {
       
    },
    methods: {
      /**
       * select的change事件
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      selectChange(val){
        this.task=val;
        this.$router.push({path: '/taskdetail_'+this.CLASS});
        this.getTaskDetail(val);
        this.activeName==='chat'?this.queryChatRecored():'';
        this.activeName==='reporting-history'?this.queryReportHistory():'';
        this.activeName==='reporting-recored'?this.queryReportRecored():'';
        this.activeName==='approval'?this.queryApprovalHistory():'';
      },
      /**
       * tab切换
       * @param  {[type]} tab   [description]
       * @param  {[type]} event [description]
       * @return {[type]}       [description]
       */
      handleClick(tab, event) {
        this.elementPageData.pageNum = 1;
        this.activeName = tab.name;
        tab.name==='chat'?this.queryChatRecored():''; 
        tab.name==='reporting-history'?this.queryReportHistory():'';  
        tab.name==='reporting-recored'?this.queryReportRecored():''; 
        tab.name==='approval'?this.queryApprovalHistory():'';  
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.activeName==='chat'?this.queryChatRecored():'';
        this.activeName==='reporting-history'?this.queryReportHistory():'';
        this.activeName==='reporting-recored'?this.queryReportRecored():'';
        this.activeName==='approval'?this.queryApprovalHistory():''; 
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.activeName==='chat'?this.queryChatRecored():'';
        this.activeName==='reporting-history'?this.queryReportHistory():'';
        this.activeName==='reporting-recored'?this.queryReportRecored():'';
        this.activeName==='approval'?this.queryApprovalHistory():'';
      },
      /**
       * 文件上传成功时的钩子
       * @param  {[type]} res      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleSuccess(res,file,fileList) {
        if(res.meta.code === 0){
          this.$message({type: 'success',message: `${file.name} 上传成功!!`});
        }else{
          this.$message.error(res.meta.message);
        }
        let arr = [];
        fileList.forEach( function(element, index) {
          if(element.response){
            arr.push(element.response.data[0].path)
          }else{
            arr.push(element.url)
          }
        });
        this.form.privateFile = arr;
      },
      /**
       * 移除文件
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleRemove(file, fileList) {
        let arr = [];
        fileList.forEach( function(element, index) {
          if(element.response){
            arr.push(element.response.data[0].path)
          }else{
            arr.push(element.url)
          }
        });
        this.form.privateFile = arr;
      },
      /**
       * 文件上传失败时的钩子
       * @param  {[type]} err      [description]
       * @param  {[type]} file     [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleError(err, file, fileList){
        console.log(err, file, fileList)
        this.$message.error(`${file.name} 上传失败!!`);
      },
      /**
       * 限制文件上传个数
       * @param  {[type]} files    [description]
       * @param  {[type]} fileList [description]
       * @return {[type]}          [description]
       */
      handleExceed(files, fileList) {
        this.$message.warning(`上传的文件超出限制个数，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件！！！`);
      },
      /**
       * 限制用户上传格式和大小
       * @param  {[type]} file [description]
       * @return {[type]}      [description]
       */
      beforeUpload(file) {
        const isLt100M = file.size / 1024 / 1024 < 50;
        if (!isLt100M) {
          this.$message.error('上传文件大小不能超过 50MB!');
        }
        return isLt100M;
      },
      /**
       * 验证是否上传文件
       * @param  {[type]}   rule     [description]
       * @param  {[type]}   value    [description]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      checkFiles(rule, value, callback){
        if (this.form.file===[]||this.form.file===undefined) {
          callback(new Error('请选择要上传的附件'));
        } else {
          callback();
        }
      },
      /**
       * 创建的任务时间change事件，保证所选时间必须是未来时间
       * @return {[type]} [description]
       */
      datatimerChange(val){
        val&&val[0]>=new Date().getTime() ?'' :this.form.dataValue = []; 
      },

      /**
       * 获取内部/上下级任务列表
       * @return {[type]} [description]
       */
      getTaskList(){ 
        this.isLoading = true;
        this.axios.post(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/list`:`${this.taskCommon.basePath}/supAndSub/list`,{orgId:this.party_org_id,supOrSub:this.CLASS==='inner'?null:(this.CLASS==='up'?1:2)}).then((response) => {
          this.taskList = response.data;
          !this.task?(this.task = response.data.total>0?response.data.rows[0].id:null):'';
          this.taskList.total>0?this.getTaskDetail(this.task):'';
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 获取内部/上下级任务详情
       * @return {[type]} [description]
       */
      getTaskDetail(id){ 
        this.isLoading = true;
        this.axios.get(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/info`:`${this.taskCommon.basePath}/supAndSub/info`,{params:{id:id}}).then((response) => {
          this.detailInfo = response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isLoading = false;
        });
      },
      /**
       * 回显内部任务详情
       * @return {[type]} [description]
       */
      echoTaskDetail(id){
        let that = this;
        this.dialogLoading = true;
        this.axios.get(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/info`:`${this.taskCommon.basePath}/supAndSub/info`,{params:{id:id}}).then((response) => {
          this.form = response.data;
          this.form.introduction = response.data.content;
          this.form.dataValue = [response.data.startTime,response.data.endTime];
          if(response.data.privateFile&&response.data.privateFile.length>0){
            response.data.privateFile.forEach( function(element, index) {
              let name = '附件0'+(index+1)+'.'+element.split('.')[element.split('.').length-1];
              let url = element
              that.fileList.push({name:name,url:url})
            });
          }else{
            that.fileList = [];
          }
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      /**
       * 获取关键词
       * @return {[type]} [description]
       */
      getKeyWords(i){
        let that = this;
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/dictionary/type`,{}).then((response) => {
          this.keyWords = response.data;

          response.data.rows.forEach( function(element, index) {
            element.name=='任务'?that.dictionaryTask = element.id : '';
          });

          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      /**
       * 获取该组织下的指派人列表
       * @return {[type]} [description]
       */
      getAssignList(i){
        this._switchLoading(true,i);
        this.axios.post(`${this.common.basePath}/user/user/list`,{orgId:this.party_org_id}).then((response) => {
          this.assignList = response.data;
          this._switchLoading(false,i);
        }).catch((error) => {
          this._switchLoading(false,i);
          this.$message.error(error);
        });
      },
      _switchLoading(value,i){
        console.log(value,i)
        switch (i) {
          case 1:
            return this.isSelectLoading1 = value; 
            break;
          case 2:
            return this.isSelectLoading2 = value; 
            break;
          case 3:
            return this.isSelectLoading3 = value; 
            break;
          case 4:
            return this.isSelectLoading4 = value; 
            break;
          default:
            return false; 
            break;
        }
      },
      /**
       * 根据id转化关键词或任务类型
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      _conversion(id){
        let that = this;
        let result = '';
        this.keyWords.rows.forEach( function(element, index) {
          id===element.id ? result=element.name : '';
        });
        return result;
      },

      /**
       * 提交弹框表单
       * @param  {[type]} formName [description]
       * @param  {[type]} type  
       * @param  {[val]} val  [val为true时，汇报历史处，发布汇报内容]   
       * @return {[type]}          [description]
       */
      submitForm(formName,type,val) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type===0?this.taskAssignment():'';
            type===1?this.taskReport(val):'';
            type===2?this.taskModify():'';
          } else {
            return false;
          }
        });
      },
      /**
       * 内部/上下级任务指派
       * @return {[type]} [description]
       */
      taskAssignment(){
        let form = {
          // files: this.form.privateFile,
          ids:this.form.ids,//指派给谁
          message: this.form.introduction,//描述
          orgId: this.party_org_id,//指派给那个组织；指派内部任务时，指派组织为当前组织
          privateFile: this.form.privateFile,//附件
          taskId: this.operateTaskId,
        }
        this.axios.post(this.CLASS=='inner'?`${this.taskCommon.basePath}/tInside/assign`:`${this.taskCommon.basePath}/supAndSub/assign`,form).then((response) => {
          // this.getTaskDetail(this.task);//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务汇报
       * @param  {[val]} val  [val为true时，汇报历史处，发布汇报内容]   
       * @return {[type]} [description]
       */
      taskReport(val){
        let form = {
          // files: this.form.privateFile,
          title:this.form.title,//汇报大标题
          content: this.form.introduction,//汇报内容描述
          orgId: this.party_org_id,//汇报给那个组织
          privateFile: this.form.privateFile,//附件
          taskId: this.operateTaskId,
        }
        this.axios.post(this.CLASS=='inner'?`${this.taskCommon.basePath}/tInside/report`:`${this.taskCommon.basePath}/supAndSub/report`,form).then((response) => {
          // this.getTaskDetail(this.task);//刷新
          if(val){
            //发送成功，清空数据
            this.fileList=[];
            this.$refs['form'] ? this.$refs['form'].resetFields():'';
            this.$refs['uploadfile']?this.$refs['uploadfile'].clearFiles():'';
            //刷新
            this.queryReportHistory();
          }
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务修改
       * @return {[type]} [description]
       */
      taskModify(){
        let form = {
          id: this.operateTaskId,
          taskName: this.form.taskName,//任务名称
          startTime:this.form.dataValue[0],//任务开始日期
          endTime:this.form.dataValue[1],//任务截止日期
          privateFile:this.form.privateFile,//任务相关附件
          keyWords:this.form.keyWords,//任务关键词
          content:this.form.introduction,//任务描述
          // org:this.CLASS==='inner'?null:'string',
        }
        this.axios.post(this.CLASS==='inner'?`${this.taskCommon.basePath}/tInside/update`:`${this.taskCommon.basePath}/supAndSub/update`,form).then((response) => {
          this.getTaskDetail(this.task);//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 内部/上下级任务的审批
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      approvalTask(id) {
        this.$confirm('是否审批通过该任务?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'success'
        }).then(() => {
          // if(this.CLASS !='inner'){this.$message('暂无api');return;}
          this.axios.get(this.CLASS=='inneer'?`${this.taskCommon.basePath}/tInside/approval?id=${id}`:`${this.taskCommon.basePath}/supAndSub/approval?id=${id}`).then((response) => {
            this.getTaskDetail(this.task);//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
          
        }).catch(() => {});    
      },

      
      /**
       * 查询聊天记录
       * @return {[type]} [description]
       */
      queryChatRecored(){
        this.isLoading = true;
        let params = {
          from:this.task,//任务id
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          type:this.dictionaryTask,//任务在字典中的id
        }
        this.axios.post(`${this.common.basePath}/user/comment/list`,params).then((response) => {
          this.chatRecored=response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 发送消息
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      send(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.activeName==='chat'?this.sendChatNews():'';
          } else {
            return false;
          }
        });
      },
      /**
       * 发送聊天消息
       * @return {[type]} [description]
       */
      sendChatNews(){
        let params = {
          from:this.task,//任务id
          info:this.chatform.val,
          type:this.dictionaryTask,//任务在字典中的id
        }
        this.axios.post(`${this.common.basePath}/user/comment/create`,params).then((response) => {
          this.chatform.val = null;
          this.queryChatRecored();//刷新
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 回复消息
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      reply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.activeName==='chat'?this.addChatNews():'';
          } else {
            return false;
          }
        });
      },
      /**
       * 回复聊天消息
       * @return {[type]} [description]
       */
      addChatNews(){
        let params = {
          from:this.task,//任务id
          info:this.replychatform.reply,
          id:this.replyId,//消息id
          type:this.dictionaryTask,//任务在字典中的id
        }
        this.axios.post(`${this.common.basePath}/user/comment/append`,params).then((response) => {
          this.replychatform.reply = null;
          this.queryChatRecored();//刷新
          this.replyDialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        });
      },

      /**
       * 查询汇报历史
       * @return {[type]} [description]
       */
      queryReportHistory(){
        this.isLoading = true;
        let paramsObj = {
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          taskId:this.task,//任务id
          orgId:this.party_org_id,
        }
        this.axios.get(`${this.taskCommon.basePath}/supAndSub/repHistory`,{params:paramsObj}).then((response) => {
          this.reportHistory=response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 查询汇报记录
       * @return {[type]} [description]
       */
      queryReportRecored(){
        this.isLoading = true;
        let paramsObj = {
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          taskId:this.task,//任务id
        }
        this.axios.get(`${this.taskCommon.basePath}/supAndSub/repRecord`,{params:paramsObj}).then((response) => {
          this.reportRecored=response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },

      /**
       * 查询审批历史
       * @return {[type]} [description]
       */
      queryApprovalHistory(){
        this.isLoading = true;
        let paramsObj = {
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          taskId:this.task,//任务id
        }
        this.axios.get(`${this.taskCommon.basePath}/supAndSub/appHistory`,{params:paramsObj}).then((response) => {
          this.approvalHistory=response.data;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          this.$message.error(error);
        });
      },
      
    }
  }
</script>

<style lang="less" scoped>
  .task-detail{
    .record{
      .head-img{
        width:50px;
      }
      .info{
        width:calc(100% - 50px);
        box-sizing:border-box;
        padding:10px;
        .info-top{
          font-size:12px;
          color: #999;
        }
        .font-bottom{
          text-indent: 28px;
          margin-top: 5px;
          font-size: 14px;
        }
      }
    }
    
  }
</style>