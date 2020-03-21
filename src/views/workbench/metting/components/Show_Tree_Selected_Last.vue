/*************************************
*  create by xieyuanyuan date 2018/09/06
*  显示树形下拉
**************************************/
<template>
  <div class="my-tree">  
      <ul>
        <!-- 当是最后一层，并且没有人员数据的情况下，就将箭头给去掉 -->
       <li :class="{'last-li' : !(item.childrens ? item.childrens.length : false) && !item.users}" 
           v-for="(item, index) in treeData" :key="index" >
        <p @click="showChildren(item)">
          <span class="arrow" :class="{'bottom-arrow': item.isShow}"></span> 
          <span>{{item.orgName}}</span>
        </p>   
        <items v-show="item.childrens && item.isShow" 
            :isCheckbox="isCheckbox"  
            :treeData="item.childrens" ></items>
         <!-- 显示人员选项 -->
         <ul class="my-tree" v-show="item.users && item.isShow">
            <li class="last-li" v-for="(itemusers, indexusers) in item.users.rows" :key="indexusers">
              <el-checkbox v-if="isCheckbox == 0"  
                :label="itemusers">{{itemusers.real_name}}</el-checkbox>
              <el-radio v-if="isCheckbox == 1"  
                :label="itemusers">{{itemusers.real_name}}</el-radio>
            </li>
         </ul>
       </li>
     </ul>
  </div>
</template>
<script>
  import items  from './Show_Tree_Selected_Last.vue'
  export default {
    name: 'items',
    props:{
      treeData:   null, //树结构数据 
      isCheckbox: {     //0为多选，1为单选
        default: 0,
      },  
    },
    data() {
      return {  
        checkedCities: null,
      }
    },
    mounted() {
       
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      showChildren(item){ 
        item.isShow = !item.isShow;
      },
    }
  }
</script>