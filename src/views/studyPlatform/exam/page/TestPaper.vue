/**************************************
*---------------------试卷（试卷库）-----------*
***************************************/
<template>
  <div class="test-paper" ref="" v-loading="isLoading" v-if="!isNoViewing">
    <el-container class="table-container">
      <el-header height="">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline search-form-area" size="small">
          <el-form-item label="时间" prop="dataValue">
            <el-date-picker
              v-model="formInline.dataValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              size="small"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="试卷名称" prop="name">
            <el-input v-model="formInline.name" clearable placeholder="名称" @change="elementPageData.pageNum = 1;formInline.name = $event;getList();" @clear="formInline.name = null"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="elementPageData.pageNum = 1;getList();">搜索</el-button>
            <el-button type="default" @click="$refs['formInline'].resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          class="table-area"
          :data="tableData.rows"
          stripe
          border
          max-height="600"
          style="width: 100%"
          v-loading="isTableLoading"
          :row-key="getRowKeys"
          ref="multipleTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column
            fixed
            type="selection"
            label=""
            :reserve-selection="true"
            width="55">
          </el-table-column> -->
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="theme"
            label="试卷名称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="creator_name"
            label="建立者"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="建立时间"
            align="center"
            width="180">
            <template slot-scope="scope">
              {{common._convertDate(scope.row.create_time, 'yyyy/MM/dd hh:mm')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="分值/分"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="test_time"
            label="答题时长/分钟"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="use"
            label="引用次数"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="类型"
            align="center"
            width="">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type===1">智能组题</el-tag>
              <el-tag type="success" v-if="scope.row.type===2">手动组题</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200">
            <template slot-scope="scope">
              <el-button @click.native.prevent="drawer=true;scope.row.type===1?getAutomaticDetailInfo(scope.row.id):getManualDetailInfo(scope.row.id);" type="" size="mini">查看</el-button>
              <el-button @click.native.prevent="del(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div class="fl btn-area w500">
          <el-button type="success" size="small" @click="dialogType=1;clear_();dialogVisible=true;getTree();">智能组题</el-button>
          <el-button type="danger" size="small" @click="$message('暂无api')">批量删除</el-button>
          <el-button type="success" size="small" @click="dialogType=2;clear();dialogVisible=true;getTestBasket();">手动组题</el-button>
        </div>
        <el-pagination
          class="fr page-area"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </el-footer>
    </el-container>

    <!-- 弹框 -->
    <el-dialog 
      :title="dialogType===2 ? '手动组题' : '智能组题' " 
      :visible.sync="dialogVisible" 
      top="5vh"
      width='950px'>
      <el-form 
        :model="form" 
        ref="form"
        :label-width="formLabelWidth"
        v-loading="dialogLoading">
        <el-form-item 
          label="考试主题" 
          prop="theme" 
          :rules="[{ required: true, message: '请输入考试主题', trigger: 'blur' }]">
          <el-input v-model="form.theme" class=""></el-input>
        </el-form-item>
        <el-form-item 
          label="考试要求" 
          prop="requirement"
          :rules="[{ required: true, message: '请输入考试要求', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.requirement" rows="5"></el-input>
        </el-form-item>
        <el-form-item 
          label="考试时长" 
          prop="test_time"
          :rules="[{ required: true, message: '请输入考试时间', trigger: 'blur' }]">
          <el-input-number v-model="form.test_time" :min="0" :precision="0" :step="10" controls-position="right"></el-input-number>
            <el-button class="append-unit">分钟</el-button>
        </el-form-item>
        <el-form-item 
          label="备注" 
          prop="description"
          :rules="[{ required: false, message: '请输入考试备注', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },]">
          <el-input type="textarea" v-model="form.description" rows="5"></el-input>
        </el-form-item>
        <div v-if="dialogType===2">
          <el-form-item 
            label="考试试题" 
            prop="testAllArr" 
            :rules="[{ required: true, message: '请选择考试题型', trigger: 'blur' }]">
            <span class="font-color-info">（请从试题篮中选择试题）</span>
            <span class="marl20">共选择了 {{ids.length}} 道习题（{{single.length}}道单选题、{{multiple.length}}道多选题、{{short.length}}道简答题）</span>
          </el-form-item>
          <div class="text-center font-color-primary font-weight-600 marb10">试题篮</div>
          <el-form-item 
            label=""
            label-width="0">
            <el-checkbox-group v-model="ids" size="small" @change="change">
              <el-collapse v-if="testBasket.length>0">
                <div v-for="(i,o) in testBasket" class="overflow-hidden bb1-eee">
                <el-collapse-item :title="{0:'单选题',1:'多选题',2:'简答题'}[o]">
                  <div class="overflow-hidden">
                    <div class="collapse-list-area">
                      <div class="overflow-hidden" v-if="i.total>0">
                        <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in i.rows" :key="index">
                          <div slot="header" class="overflow-hidden">
                            <el-checkbox :label="item" :key="item.id" class="fl">&nbsp;</el-checkbox>&nbsp;&nbsp;&nbsp;
                            <span class="fl">{{index+1}}. {{item.content}}？</span>
                          </div>
                          <div>
                            <el-row :gutter="20" class="options">
                              <el-col :span="16">
                                <div class="text">
                                  <!-- 选择题 -->
                                  <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                                    {{studyCommon.conversionABCD(o)}}. {{i.content}}
                                  </div>
                                  <!-- 简答题（即简答题答案） -->
                                  <div class="simple-problem" v-if="item.type===3">
                                    {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                                  </div>
                                </div>
                              </el-col>
                              <el-col :span="8">
                                <div class="img item-bank-cover" v-if="item.picture">
                                  <el-image
                                  style="width: 200px; "
                                  :src="item.picture"
                                  fit="cover"></el-image>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row :gutter="20" class="info">
                              <el-col :span="4">
                                <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                              </el-col>
                              <el-col :span="4">
                                <div>创建人：{{item.creator}}</div>
                              </el-col>
                              <el-col :span="6">
                                <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                              </el-col>
                              <el-col :span="4">
                                <div>分值：{{item.score}} 分</div>
                              </el-col>
                              <el-col :span="6">
                                <el-button v-if="isShow_!=item.id" type="" size="mini" @click="isShow_=item.id">查看解析</el-button>
                                <el-button v-if="isShow_==item.id" type="" size="mini" @click="isShow_=null">收起解析</el-button>
                                <el-button type="danger" size="mini" @click="remove(item)">移除本题</el-button>
                              </el-col>
                            </el-row>
                            <el-card class="box-card mart10" shadow="hover" v-if="isShow_==item.id">
                              <el-form ref="showform" label-width="100px" class="showform">
                                <!-- 只有选择题才有答案 -->
                                <el-form-item label="正确答案：" v-if="item.type!=3">
                                  <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                                    <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                                  </div>
                                </el-form-item>
                                <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                              </el-form>
                            </el-card>
                          </div>
                        </el-card>
                      </div>
                      <div v-else class="no-data background-fff">  
                        暂无数据
                      </div>
                    </div>
                    <div class="overflow-hidden text-right marr20 padt20">
                      <el-pagination
                        class="fr page-area"
                        @size-change="handleSizeChange_s($event,o)"
                        @current-change="handleCurrentChange_s($event,o)"
                        :current-page="{0:elementPageData_s.pageNum1,1:elementPageData_s.pageNum2,2:elementPageData_s.pageNum3}[o]"
                        :page-sizes="elementPageData_s.defaultData.pageSizes_s"
                        :page-size="elementPageData_s.defaultData.pageSizeDefault_s"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="i.total">
                      </el-pagination>
                    </div>
                  </div>
                </el-collapse-item>
                </div>
              </el-collapse>
            </el-checkbox-group>  
            <div v-if="testBasket.length==0" class="font-color-info text-center">（试题篮暂无数据，可前往题库添加试题）</div>        
          </el-form-item>
        </div>
        <div v-if="dialogType===1">
          <el-form-item 
            label="考试试题" 
            prop="testAllArr" 
            :rules="[{ required: true, message: '请选择考试题型', trigger: 'blur' }]">
            <span class="font-color-info">（请从下列试题随机选择，进行智能组题）</span>
            <span class="marl20">共选择了 {{singleNum+multipleNum+shortNum}} 道习题（{{singleNum}}道单选题、{{multipleNum}}道多选题、{{shortNum}}道简答题）</span>
          </el-form-item>
          <div class="text-center font-color-primary font-weight-600 marb10">可选试题</div>
          <el-row :gutter="20">
            <el-col :span="9">
              <div class="overflow-hidden">
                <el-form-item 
                  label="知识点">
                    <el-tree
                      :props="knowledgeProps"
                      :data="knowledgeArr"
                      node-key="id"
                      show-checkbox
                      :expand-on-click-node="true"
                      :check-on-click-node = 'true'
                      @check = "check"
                      ref="knowledgeTree">
                      <span class="my_custom-tree-node" slot-scope="{ node, data }">
                        <i class="fa marr10" :class="{'fa-bookmark':!data.parent_id,'fa-bookmark-o':data.parent_id}" aria-hidden="true"></i><span :class="{'font-weight-600':!data.parent_id}">{{ data.name }}</span>
                      </span>
                    </el-tree>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="overflow-hidden">
                <el-form-item 
                  label="已生成的试题">
                  <div v-if="generatedTestQuestions">
                    <!-- <div>&nbsp;</div> -->
                    <el-form label-position="top">
                      <!-- 单选题 -->
                      <div>
                        <el-form-item 
                          class="change-top-label"
                          label-width="55px"
                          :label="`单选题    [共计${generatedTestQuestions.selectOne ? generatedTestQuestions.selectOne.length : '0'}种不同分值的题]`">
                          <div>
                            
                          </div>
                          <div v-if="generatedTestQuestions.selectOne">
                            <div v-for="(item_,index) in generatedTestQuestions.selectOne" class="marb10">
                              {{index+1}}. 可用试题：{{item_.num}}道，分值：{{item_.score}}分/道，随机选择
                              <el-input-number class="w50" v-model="item_.newNum" size="mini" :min="0" :max="item_.num" controls-position="right" :controls="false" @change="onSingleStepChange($event,item_,index)"></el-input-number>
                              道。
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                      <!-- 多选题 -->
                      <div>
                        <el-form-item 
                          class="change-top-label"
                          label-width="55px"
                          :label="`多选题    [共计${generatedTestQuestions.selectMore ? generatedTestQuestions.selectMore.length : '0'}种不同分值的题]`">
                          <div>
                            
                          </div>
                          <div v-if="generatedTestQuestions.selectMore">
                            <div v-for="(item_,index) in generatedTestQuestions.selectMore" class="marb10">
                              {{index+1}}. 可用试题：{{item_.num}}道，分值：{{item_.score}}分/道，随机选择
                              <el-input-number class="w50" v-model="item_.newNum" size="mini" :min="0" :max="item_.num" controls-position="right" :controls="false" @change="onMultipleStepChange($event,item_,index)"></el-input-number>
                              道。
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                      <!-- 简答题 -->
                      <div>
                        <el-form-item 
                          class="change-top-label"
                          label-width="55px"
                          :label="`简答题    [共计${generatedTestQuestions.description ? generatedTestQuestions.description.length : '0'}种不同分值的题]`">
                          <div>  
                          </div>
                          <div v-if="generatedTestQuestions.description">
                            <div v-for="(item_,index) in generatedTestQuestions.description" class="marb10">
                              {{index+1}}. 可用试题：{{item_.num}}道，分值：{{item_.score}}分/道，随机选择
                              <el-input-number class="w50" v-model="item_.newNum" size="mini" :min="0" :max="item_.num" controls-position="right" :controls="false" @change="onShortStepChange($event,item_,index)"></el-input-number>
                              道。
                            </div>
                          </div>
                        </el-form-item>
                      </div>
                    </el-form>
                  </div>
                  <div v-else class="font-color-info">（暂无数据，请通过选择知识点，生成试题）</div>        
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button @click="$refs['form'].resetFields();dialogType===2?clear():clear_();" size="small">重 置</el-button>
        <el-button type="primary" @click="submitForm('form',dialogType)" size="small">创建试卷</el-button>
      </div>
    </el-dialog>
    <!-- drawer -->
    <el-drawer
      title="试卷的详细信息"
      :visible.sync="drawer"
      ref="drawer"
      :modal="true"
      :close-on-press-escape = "false"
      :wrapperClosable = 'true'
      size="750px"
      custom-class = 'costom-deawer-style'
      :direction="direction">
      <div class="demo-drawer__content" v-loading="isDrawerLoading">
        <el-form ref="showform" label-width="100px" class="showform" v-if="detailInfo">
          <el-form-item label="试卷主题：">{{detailInfo.theme ? detailInfo.theme : '暂无数据'}}</el-form-item>
          <el-form-item label="试卷要求：">{{detailInfo.requirement ? detailInfo.requirement : '暂无数据'}}</el-form-item>
          <el-form-item label="试卷类型：">
            <el-tag v-if="detailInfo.type===1" >智能组题</el-tag>
            <el-tag type="success" v-if="detailInfo.type===2" >手动组题</el-tag>
          </el-form-item>
          <el-form-item label="试卷状态：">
            <span v-if="detailInfo.cur_status===1" class="font-color-success">新建试卷，暂未使用</span>
            <span v-if="detailInfo.cur_status===2" class="font-color-primary">正在使用中</span>
            <span v-if="detailInfo.cur_status===20" class="font-color-danger">已删除</span>
          </el-form-item>
          <el-form-item label="试卷分值：">{{detailInfo.score ? detailInfo.score+'分' : '暂无数据'}}</el-form-item>
          <el-form-item label="答题时长：">{{detailInfo.test_time ? detailInfo.test_time+'分钟' : '暂无数据'}}</el-form-item>
          <el-form-item label="试卷备注：">{{detailInfo.description ? detailInfo.description : '暂无数据'}}</el-form-item>
          <el-form-item label="试卷试题：" v-if="detailInfo.type===2">
            <el-collapse>
              <el-collapse-item title="单选题">
                <div class="overflow-hidden">
                  <div class="collapse-show-list-area">
                    <div class="overflow-hidden" v-if="detailInfo.selectOne&&detailInfo.selectOne.length>0">
                      <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in detailInfo.selectOne" :key="index">
                        <div slot="header" class="overflow-hidden">
                          <span class="fl">{{index+1}}. {{item.content}}？</span>
                        </div>
                        <div>
                          <el-row :gutter="20" class="options">
                            <el-col :span="16">
                              <div class="text">
                                <!-- 选择题 -->
                                <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                                  {{studyCommon.conversionABCD(o)}}. {{i.content}}
                                </div>
                                <!-- 简答题（即简答题答案） -->
                                <div class="simple-problem" v-if="item.type===3">
                                  {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="8">
                              <div class="img item-bank-cover" v-if="item.picture">
                                <el-image
                                style="width: 200px; "
                                :src="item.picture"
                                fit="cover"></el-image>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20" class="info">
                            <el-col :span="4">
                              <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>创建人：{{item.creator}}</div>
                            </el-col>
                            <el-col :span="8">
                              <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>分值：{{item.score}} 分</div>
                            </el-col>
                            <el-col :span="4">
                              <el-button v-if="isShow_!=item.id" type="" size="mini" @click="isShow_=item.id">查看解析</el-button>
                              <el-button v-if="isShow_==item.id" type="" size="mini" @click="isShow_=null">收起解析</el-button>
                            </el-col>
                          </el-row>
                          <el-card class="box-card mart10" shadow="hover" v-if="isShow_==item.id">
                            <el-form ref="showform" label-width="100px" class="showform">
                              <!-- 只有选择题才有答案 -->
                              <el-form-item label="正确答案：" v-if="item.type!=3">
                                <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                                  <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                                </div>
                              </el-form-item>
                              <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                            </el-form>
                          </el-card>
                        </div>
                      </el-card>
                    </div>
                    <div v-else class="no-data background-fff">  
                      暂无数据
                    </div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="多选题">
                <div class="overflow-hidden">
                  <div class="collapse-show-list-area">
                    <div class="overflow-hidden" v-if="detailInfo.selectMore&&detailInfo.selectMore.length>0">
                      <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in detailInfo.selectMore" :key="index">
                        <div slot="header" class="overflow-hidden">
                          <span class="fl">{{index+1}}. {{item.content}}？</span>
                        </div>
                        <div>
                          <el-row :gutter="20" class="options">
                            <el-col :span="16">
                              <div class="text">
                                <!-- 选择题 -->
                                <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                                  {{studyCommon.conversionABCD(o)}}. {{i.content}}
                                </div>
                                <!-- 简答题（即简答题答案） -->
                                <div class="simple-problem" v-if="item.type===3">
                                  {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="8">
                              <div class="img item-bank-cover" v-if="item.picture">
                                <el-image
                                style="width: 200px; "
                                :src="item.picture"
                                fit="cover"></el-image>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20" class="info">
                            <el-col :span="4">
                              <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>创建人：{{item.creator}}</div>
                            </el-col>
                            <el-col :span="8">
                              <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>分值：{{item.score}} 分</div>
                            </el-col>
                            <el-col :span="4">
                              <el-button v-if="isShow_!=item.id" type="" size="mini" @click="isShow_=item.id">查看解析</el-button>
                              <el-button v-if="isShow_==item.id" type="" size="mini" @click="isShow_=null">收起解析</el-button>
                            </el-col>
                          </el-row>
                          <el-card class="box-card mart10" shadow="hover" v-if="isShow_==item.id">
                            <el-form ref="showform" label-width="100px" class="showform">
                              <!-- 只有选择题才有答案 -->
                              <el-form-item label="正确答案：" v-if="item.type!=3">
                                <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                                  <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                                </div>
                              </el-form-item>
                              <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                            </el-form>
                          </el-card>
                        </div>
                      </el-card>
                    </div>
                    <div v-else class="no-data background-fff">  
                      暂无数据
                    </div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="简答题">
                <div class="overflow-hidden">
                  <div class="collapse-show-list-area">
                    <div class="overflow-hidden" v-if="detailInfo.descriptions&&detailInfo.descriptions.length>0">
                      <el-card class="box-card problem-bank marb10" shadow="hover" v-for="(item,index) in detailInfo.descriptions" :key="index">
                        <div slot="header" class="overflow-hidden">
                          <span class="fl">{{index+1}}. {{item.content}}？</span>
                        </div>
                        <div>
                          <el-row :gutter="20" class="options">
                            <el-col :span="16">
                              <div class="text">
                                <!-- 选择题 -->
                                <div v-for="(i,o) in item.paperQuesAnswersDtos" class="change-problem marb5"  v-if="item.type!=3">
                                  {{studyCommon.conversionABCD(o)}}. {{i.content}}
                                </div>
                                <!-- 简答题（即简答题答案） -->
                                <div class="simple-problem" v-if="item.type===3">
                                  {{item.paperQuesAnswersDtos[0]?item.paperQuesAnswersDtos[0].content:''}}
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="8">
                              <div class="img item-bank-cover" v-if="item.picture">
                                <el-image
                                style="width: 200px; "
                                :src="item.picture"
                                fit="cover"></el-image>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20" class="info">
                            <el-col :span="4">
                              <div>题型：{{ {1:'单选题',2:'多选题',3:'简答题'}[item.type] }}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>创建人：{{item.creator}}</div>
                            </el-col>
                            <el-col :span="8">
                              <div>创建时间：{{common._convertDate(item.create_time, 'yyyy/MM/dd hh:mm')}}</div>
                            </el-col>
                            <el-col :span="4">
                              <div>分值：{{item.score}} 分</div>
                            </el-col>
                            <el-col :span="4">
                              <el-button v-if="isShow_!=item.id" type="" size="mini" @click="isShow_=item.id">查看解析</el-button>
                              <el-button v-if="isShow_==item.id" type="" size="mini" @click="isShow_=null">收起解析</el-button>
                            </el-col>
                          </el-row>
                          <el-card class="box-card mart10" shadow="hover" v-if="isShow_==item.id">
                            <el-form ref="showform" label-width="100px" class="showform">
                              <!-- 只有选择题才有答案 -->
                              <el-form-item label="正确答案：" v-if="item.type!=3">
                                <div v-for="(answer,answerIndex) in item.paperQuesAnswersDtos" class="inline-block">
                                  <span v-if="answer.exactness">{{studyCommon.conversionABCD(answerIndex)}}&nbsp;&nbsp;&nbsp;</span>
                                </div>
                              </el-form-item>
                              <el-form-item label="答案解析：">{{item.analysis?item.analysis:'暂无数据'}}</el-form-item>
                            </el-form>
                          </el-card>
                        </div>
                      </el-card>
                    </div>
                    <div v-else class="no-data background-fff">  
                      暂无数据
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
          <el-form-item label="题型分布：" v-if="detailInfo.type===1">
            <div v-if="detailInfo.smartInfos&&detailInfo.smartInfos.length>0">
              <div v-for="(items,indexs) in detailInfo.smartInfos">
                <el-tag :type=" {1:'',2:'success',3:'warning'}[items.type] ">{{ {1:'单选题',2:'多选题',3:'简答题'}[items.type] }} {{ items.score+'分/道' }} {{ items.number }}道</el-tag>
              </div>
            </div>
            <div v-else class="">  
              暂无数据
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        party_org_id:this.common.getParamsByName('orgId')?Number(this.common.getParamsByName('orgId')):JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")),
        isNoViewing:false,//是否禁止查看页面 false可以查看该页面；true不能查看该页面
        isLoading:false,
        isTableLoading:false,
        elementPageData_s: { //分页需要的数据 5
          defaultData:  this.studyCommon.elementPagination,
          pageNum1:      this.studyCommon.elementPagination.pageNumDefault_s,
          pageSize1:     this.studyCommon.elementPagination.pageSizeDefault_s,
          pageNum2:      this.studyCommon.elementPagination.pageNumDefault_s,
          pageSize2:     this.studyCommon.elementPagination.pageSizeDefault_s,
          pageNum3:      this.studyCommon.elementPagination.pageNumDefault_s,
          pageSize3:     this.studyCommon.elementPagination.pageSizeDefault_s,
        },
        elementPageData: { //分页需要的数据 10
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        formInline: {
          name: null,
          dataValue: null,
        },
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
        selecMeuntArr:[],//选择框的下拉选数组集合
        tableData:{rows:[],total:0},//表格数据
        getRowKeys(row) {//列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        multipleSelection:null,

        //dialog
        dialogVisible: false,
        dialogType:1,//1手动组题，2自动组题
        dialogLoading:false,
        form: {
          theme: null,
          testAllArr:[],//所有选择的题的集合
          requirement:null,
          test_time:90,
          description:null,
        },
        ids:[],//所有选择的题的集合
        single:[],//所有选择的单选题的集合
        multiple:[],//所有选择的多选题的集合
        short:[],//所有选择的简答题的集合
        formLabelWidth: '100px',
        testBasket:[],
        knowledgeArr:[],//知识树
        knowledgeProps: {
          label: 'name',
          children: 'childrens'
        },
        generatedTestQuestions:null,//生成的试题
        smart: {single:[],multiple:[],short:[]},//智能组题的集合(数组长度不会变化)
        newSmart:{single:[],multiple:[],short:[]},//智能组题的集合(数组长度会变化)
        newSmartArr:[],//选择的智能组题的集合(添加时使用)
        singleNum:0,//选择的智能组题的单选题个数
        multipleNum:0,//选择的智能组题的多选题个数
        shortNum:0,//选择的智能组题的多简答题个数
        isShow_:null,//是否展示解析


        //drawer
        drawer:false,
        isDrawerLoading:false,
        direction: 'ltr',
        detailInfo:null,//详情信息

      };
    },
    created() {
      
    },
    mounted() {
      console.log(this.common.getParamsByName('orgId'))
      if(this.common.getParamsByName('orgId')){
        sessionStorage.setItem('studyPlatform_exam_orgId',JSON.stringify(Number(this.common.getParamsByName('orgId'))));
      }
      console.log(JSON.parse(sessionStorage.getItem("studyPlatform_exam_orgId")))
      if(!this.party_org_id){
        this.isNoViewing = true;
        this.$message.error('未获取到组织！！！');
        return;
      }
      this.getList();
    },
    methods: {
      
      /**
       * 数据多选
       * [handleSelectionChange description]
       * @param  {[type]} val [被选中数组数据]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange(val) {
        this.elementPageData.pageSize = val;
        this.getList();
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange(val) {
        this.elementPageData.pageNum = val;
        this.getList();
      },
      /**
       * 改变每页条数触发此事件
       * [handleSizeChange description]
       * @param  {[type]} val [当前数据]
       * @return {[type]}     [description]
       */
      handleSizeChange_s(val,type) {
        console.log(val)
        if(type===0){//单选
          this.elementPageData_s.pageSize1 = val;
          this.getTestBasket();
        }else if(type===1){//多选
          this.elementPageData_s.pageSize2 = val;
          this.getTestBasket();
        }else{//简答
          this.elementPageData_s.pageSize3 = val;
          this.getTestBasket();
        }
      },
      /**
       * 改变当前页码触发此事件
       * [handleCurrentChange description]
       * @param  {[type]} val [当前页码]
       * @return {[type]}     [description]
       */
      handleCurrentChange_s(val,type) {
        if(type===0){//单选
          this.elementPageData_s.pageNum1 = val;
          this.getTestBasket();
        }else if(type===1){//多选
          this.elementPageData_s.pageNum2 = val;
          this.getTestBasket();
        }else{//简答
          this.elementPageData_s.pageNum3 = val;
          this.getTestBasket();
        }
      },
      /**
       * 在试题篮中选择试题的事件
       * @return {[type]} [description]
       */
      change(val){
        val.length>0?this.form.testAllArr = true : this.form.testAllArr = [];//
        let single = [];
        let multiple = [];
        let short = [];
        val.forEach( function(element, index) {
          element.type===1?single.push(element) : '';
          element.type===2?multiple.push(element) : '';
          element.type===3?short.push(element) : '';
        });
        this.single = single;
        this.multiple = multiple;
        this.short = short;
      },

      /**
       * 获取试卷库
       * @return {[type]} [description]
       */
      getList(){ 
        this.isTableLoading = true;
        this.axios.post(`${this.examCommon.basePath}/papers/find_testPapers`,this._serchformParms()).then((response) => {
          this.tableData = response.data ? response.data:({rows:[],total:0});
          this.isTableLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.isTableLoading = false;
        });
      },
      _serchformParms(){
        return{
          pageSize:this.elementPageData.pageSize,
          pageNum:this.elementPageData.pageNum,
          endTime: this.formInline.dataValue ? this.formInline.dataValue[1] : null,
          startTime: this.formInline.dataValue ? this.formInline.dataValue[0] : null,
          theme: this.formInline.name,
        }
      },
      /**
       * 查看手动试卷详情
       * @param  {[type]} id [description]
       */
      getManualDetailInfo(id){
        this.isDrawerLoading = true;
        this.axios.post(`${this.examCommon.basePath}/papers/test_paperInfo?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.isDrawerLoading = false;
        }).catch((error) => {
          this.isDrawerLoading = false;
          this.$message.error(error);
        });
      },
      /**
       * 查看智能试卷详情
       * @param  {[type]} id [description]
       */
      getAutomaticDetailInfo(id){
        this.isDrawerLoading = true;
        this.axios.post(`${this.examCommon.basePath}/papers/smart_paperInfo?id=${id}`).then((response) => {
          this.detailInfo = response.data;
          this.isDrawerLoading = false;
        }).catch((error) => {
          this.isDrawerLoading = false;
          this.$message.error(error);
        });
      },

      /**
       * 查询试题篮
       * @return {[type]} [description]
       */
      getTestBasket(){ 
        this.dialogLoading = true;
        this.axios.post(`${this.examCommon.basePath}/paper_questions/find_questions`,this._testBasketParms()).then((response) => {
          this.testBasket = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      _testBasketParms(){
        let parmsObj = {
          pageSize1:this.elementPageData_s.pageSize1,
          pageNum1:this.elementPageData_s.pageNum1,
          pageSize2:this.elementPageData_s.pageSize2,
          pageNum2:this.elementPageData_s.pageNum2,
          pageSize3:this.elementPageData_s.pageSize3,
          pageNum3:this.elementPageData_s.pageNum3,
        }
        return parmsObj;
      },
      /**
       * 获取学科知识点树
       * @return {[type]} [description]
       */
      getTree(){ 
        this.dialogLoading = true;
        this.axios.post(`${this.examCommon.basePath}/knowledge/select_subject`,this._treeParms()).then((response) => {
          response.data.forEach( function(element, index) {
            !element.parent_id ? element.disabled = true : '';//将顶级（科目）设为禁用状态
          });
          this.knowledgeArr = response.data;
          this.dialogLoading = false;
        }).catch((error) => {
          this.$message.error(error);
          this.dialogLoading = false;
        });
      },
      _treeParms(){
        return{
          id: null,
          party_org_id:this.party_org_id,
        }
      },

      /**
       * 清空数据（手动组题）
       * @return {[type]} [description]
       */
      clear(){
        this.$refs['form'] ? this.$refs['form'].resetFields():'';
        this.ids=[];this.short=[];this.single=[];this.multiple=[];
        this.elementPageData_s.pageNum1 = 1;
        this.elementPageData_s.pageNum2 = 1;
        this.elementPageData_s.pageNum3 = 1;
      },
      /**
       * 清空数据（智能组题）
       * @return {[type]} [description]
       */
      clear_(){
        this.$refs['form'] ? this.$refs['form'].resetFields():'';
        this.smart =  {single:[],multiple:[],short:[]};//智能组题的集合(数组长度不会变化)
        this.newSmart = {single:[],multiple:[],short:[]};//智能组题的集合(数组长度会变化)
        this.newSmartArr = [];//选择的智能组题的集合(添加时使用)
        this.singleNum = 0;//选择的智能组题的单选题个数
        this.multipleNum = 0;//选择的智能组题的多选题个数
        this.shortNum = 0;//选择的智能组题的多简答题个数
      },
      /**
       * 手动组题、智能组题
       * @param  {[type]} formName [description]
       * @param  {[type]} type     2手动组题，1智能组题
       * @return {[type]}          [description]
       */
      submitForm(formName,type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            type === 2 ? this.manualSettingOfQuestions(type) : this.intelligentQuestionSetting();
          } else {
            return false;
          }
        });
      },
      /**
       * 手动组题
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      manualSettingOfQuestions(type){
        let form = {
          description: this.form.description,
          descriptions: this.short,//简答题集合
          requirement: this.form.requirement,
          selectMore:  this.multiple,//多选题的集合
          selectOne: this.single,//单选题的集合
          test_time: this.form.test_time,
          theme: this.form.theme,
          type: type,//2手动，1智能
        }
        this.axios.post(`${this.examCommon.basePath}/papers/create_papers`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        }); 
      },
      /**
       * 智能组题
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      intelligentQuestionSetting(type){
        let form = {
          description: this.form.description,
          requirement: this.form.requirement,
          smartInfos: this.newSmartArr,//选择的智能组题的集合
          knowledges:this.$refs.knowledgeTree.getCheckedKeys().join(','),
          test_time: this.form.test_time,
          theme: this.form.theme,
          type: type,//2手动，1智能
        }
        this.axios.post(`${this.examCommon.basePath}/papers/create_smartPaper`,form).then((response) => {
          this.getList();//刷新
          this.dialogVisible = false;
          this.$message({type: 'success',message: '成功!'});
        }).catch((error) => {
          this.$message.error(error);
        }); 
      },
      /**
       * 知识点 当复选框被点击的时候触发
       * @param  {[type]} data      [description]
       * @param  {[type]} node      [description]
       * @param  {[type]} component [description]
       * @return {[type]}           [description]
       */
      check(data,status){
        this.axios.post(`${this.examCommon.basePath}/papers/create_smart?knowledges=${status.checkedKeys.join(',')}`).then((response) => {
          this.generatedTestQuestions = response.data;//生成的试题
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /**
       * 智能组题 单选题的计数器change事件
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      onSingleStepChange(val,data,index){
        this.smart.single[index] = {number: data.newNum,score: data.score,type: data.type};
        this._fitterSmart(this.smart,'single')
      },
      /**
       * 智能组题 多选题的计数器change事件
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      onMultipleStepChange(val,data,index){
        this.smart.multiple[index] = {number: data.newNum,score: data.score,type: data.type};
        this._fitterSmart(this.smart,'multiple')
      },
      /**
       * 智能组题 简答题的计数器change事件
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      onShortStepChange(val,data,index){
        this.smart.short[index] = {number: data.newNum,score: data.score,type: data.type};
        this._fitterSmart(this.smart,'short')
      },
      /**
       * 过滤智能组题数组
       */
      _fitterSmart(smart,type){
        if(type=='single'){
          smart.single.forEach( function(element, index) {
            element.number === 0 ? delete smart.single[index] : '';
            element.number === undefined ? delete smart.single[index] : ''
          });
        }else if(type=='multiple'){
          smart.multiple.forEach( function(element, index) {
            element.number === 0 ? delete smart.multiple[index] : '';
            element.number === undefined ? delete smart.multiple[index] : ''
          });
        }else if(type=='short'){
          smart.short.forEach( function(element, index) {
            element.number === 0 ? delete smart.short[index] : '';
            element.number === undefined ? delete smart.short[index] : ''
          });
        }
        this.smart = smart;
        this.__forEachSmart(this.smart,type)
      },
      /**
       * 循环智能组题数组得到新的数组
       */
      __forEachSmart(smartObj,type){
        let that = this;
        if(type==="single"){
          that.newSmart.single = [];
          smartObj.single.forEach( function(element, index) {
            that.newSmart.single.push(element)
          });
        }else if(type==="multiple"){
          that.newSmart.multiple = [];
          smartObj.multiple.forEach( function(element, index) {
            that.newSmart.multiple.push(element)
          });
        }else if(type==="short"){
          that.newSmart.short = [];
          smartObj.short.forEach( function(element, index) {
            that.newSmart.short.push(element)
          });
        }
        this.___forEachNewSmart(that.newSmart);
      },
      ___forEachNewSmart(obj){
        var arr = [];
        var subArr = [];
        var singleNum = 0;
        var multipleNum = 0;
        var shortNum = 0;
        for(let i in obj){
          arr[i] = obj[i];
        }
        arr['single'].forEach( function(element, index) {
          subArr.push(element)
        });
        arr['multiple'].forEach( function(element, index) {
          subArr.push(element)
        });
        arr['short'].forEach( function(element, index) {
          subArr.push(element)
        });
        subArr.forEach( function(element, index) {
          element.type===1 ? singleNum=singleNum+element.number:'';
          element.type===2 ? multipleNum=multipleNum+element.number:'';
          element.type===3 ? shortNum=shortNum+element.number:'';
        });
        this.singleNum = singleNum;
        this.multipleNum = multipleNum;
        this.shortNum = shortNum;
        this.newSmartArr = subArr;
        this.singleNum+this.multipleNum+this.shortNum>0?this.form.testAllArr = true : this.form.testAllArr = [];//
      },

      /**
       * 从试题篮移除习题
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      remove(data){
        this.$confirm('是否移除该习题?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.examCommon.basePath}/paper_questions/delete_baseket?id=${data.id}`).then((response) => {
            this.getTestBasket();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});  
      },
      /**
       * 从试题库删除试卷
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      del(data){
        this.$confirm('是否删除该试卷?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.axios.post(`${this.examCommon.basePath}/papers/delete_testPapers?id=${data.id}`).then((response) => {
            this.getList();//刷新
            this.$message({type: 'success',message: '成功!'});
          }).catch((error) => {
            this.$message.error(error);
          });
        }).catch(() => {});  
      },
      
     
    }
  }
</script>
<style lang="less" scoped>
   .test-paper{
      
   }
</style>