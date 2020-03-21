/*************************************
*  create by xieyuanyuan date 2018/09/06
*  查询树形下拉
**************************************/
<template>
  <div style="width: 100%;">    
    <!-- 多选组合框 -->
    <el-checkbox-group style="width: 100%;" v-if="isCheckbox == 0" 
      class="my-tree-bar" 
      v-model="checkedValueD" 
      @change="handleCheckedValueChange"> 
        <show-tree-selected-last 
          :isCheckbox="isCheckbox"  
          :treeData="treeData"></show-tree-selected-last>
    </el-checkbox-group>
    <!-- 单选组合框 -->
    <el-radio-group 
      style="width: 100%;" 
      v-if="isCheckbox == 1" 
      class="my-tree-bar" 
      v-model="checkedValueD" 
      @change="handleCheckedValueChange"> 
        <show-tree-selected-last 
          :isCheckbox="isCheckbox"   
          :treeData="treeData"  ></show-tree-selected-last>
    </el-radio-group>
  </div>
</template>
<script>
  import Show_Tree_Selected_Last  from './Show_Tree_Selected_Last.vue'
  export default {
    props:{   
      isCheckbox: {     //0为多选，1为单选
        default: 0,
      },    
      checkedValue: { 
        default: [],
      },
      treeData: {
        default: [],
      }
    },
    name: 'items',
    components: {
      'show-tree-selected-last': Show_Tree_Selected_Last
    },
    computed:{
      
    },
    data() {
      return { 
        orgId:  sessionStorage.getItem('orgId'),  
        checkedValueD: this.checkedValue,
      }
    },
    created() { 
    }, 
    methods:{ 
      handleCheckedValueChange(val){
        this.$emit('treeValData',val)
      }
    }
  }
</script>
<style lang="less">
@de1201:   #de1201;//de1201
  /*自定义的树形下拉*/
.my-tree-bar{
  .title{
      background-color: @de1201!important; 
      color: #fff; 
      line-height: 30px; 
      padding-left: 20px; 
      margin-bottom: 10px;
    }
  .my-tree{
    ul{
      /*padding-left: 5px;*/
      li{
        cursor: pointer;
        font-size: 12px;
        transform: rotate(0deg);
        transition: transform .3s ease-in-out;
        line-height: 26px;
        font-size: 14px!important;
        position: relative;
        padding-left: 14px;
        .arrow{ 
          border: 5px solid transparent;
          border-color: transparent transparent transparent #c0c4cc;
          height: 0;
          width: 0;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 8px;
          transition: all .3s;
        }
        .bottom-arrow{
          transform: rotate(90deg); 
        }
      }
      
      .last-li{
        .arrow{
          border:none !important;
        }
        
      }
    }
    .hide{
      opacity: 0;
    }
    .show{
      opacity: 1;
    }
  }
}
</style>