/**************************************
*---------------------首页-----------*
***************************************/
<template>
  <div v-loading="loading"
    class="row pad-l20 pad-r20 mr-t5" 
    style="min-height: 100px; width: 100%">
    <el-row v-if="dataBlockJson" :gutter="15">
      <el-col 
        class="marb15"
        v-for="(item, index) in dataBlockJson[0].configItemList" 
        :key="index" 
        :span="number(item.type)">
          <div class="grid-content bg-purple-dark">
            <div v-if=" item.type == 3 ">
              <div class="block cu-border">
                <el-carousel class="banner-wrapper">
                  <el-carousel-item v-for="(itemImg, indexImg) in JSON.parse(item.config).swiperData" :key="indexImg">
                    <a class="banner-wrapper-innter" :href="itemImg.link" target="_blank">
                      <img :src="itemImg.imgUrl"/>
                      <p>{{itemImg.title}}</p>
                    </a>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <div v-if=" item.type == 1 || item.type == 2">
              <div class="cu-box-wrap">
                <h1 :style="`border-bottom-color: ${dataBlockJson[0].backGroundConfig}`"><span class="fl" :style="`background: ${dataBlockJson[0].backGroundConfig}`">{{item.atName}}</span><a class="fr more"  href="javascript:void(0)" @click="moreButtonClicked(item)">更多&gt;</a></h1> 
                <ul 
                  v-if="item.hasOwnProperty('newsData' + index)" class="cu-border ">
                  <li 
                    v-if="item['newsData' + index].hasOwnProperty('rows')"  
                    v-for="(newItem, indexNews) in item['newsData' + index].rows" :key="indexNews">
                    <router-link :to="{name: 'NewsDetail', params: {id: newItem.id} }">
                      <span class="fl text">{{newItem.articleName}}</span>  
                      <span class="fr">{{_dataCovert(newItem.createTime)}}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
      </el-col>
    </el-row> 
  </div>
</template>

<script>  
  export default { 
    data() {
      return {
        dataBlockJson: JSON.parse(sessionStorage.getItem('homeData')),       //框架的数据, 
        loading:       true,       //页面加载
        orgId:         sessionStorage.getItem('orgId'),
      }
    },
    mounted() { 
      this._covertNewsData();
    },
    destoryed() {
       
    },
    methods: {
      /**
       * 点击 更多 记录分类信息
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      moreButtonClicked (item) {
        sessionStorage.setItem("typeName", item.atName)
        sessionStorage.setItem("typeName", item.atId)
        this.$router.push({name: 'NewsList', params: {object: JSON.stringify({atType: item.atType, atId: item.atId, atName: item.atName})}})
      }, 
      /*
      * 组装新闻数据-文章列表查询
      */
      _covertNewsData () {  
        this.loading = true; 
        this.dataBlockJson[0].configItemList.forEach((item,index) => {
          if(item.type == 1 || item.type == 2){ //1、分类；2、专题；3、图片滚动；4、视频
            this.axios.get( `${this.common.basePath}/home/a_info/article/list`, this._newsParams(item)).then( (response) => {  
              item['newsData' + index] = response.data;
              // -------------------------- 避免页面监听不到数据变化 -----------------------
              this.dataBlockJson = Object.assign({}, this.dataBlockJson, this.dataBlockJson);
              this.loading = false;
            }).catch( (error) => {  
              this.loading = false;
              this.$message.error(error) 
            }); 
          }
        }) 
      },
      _newsParams(item){
        return {
          params:  {
            type: item.aTypeId,
            pageSize: 7,
            pageNum: 1,
            partyOrgId: this.orgId,
            curStatus: 1
          } 
        }
      },
      /*
      * 时间转换
      * @param {string} timeStamp 时间戳
      * @return time 返回转换后的时间
      */
      _dataCovert(timeStamp){
        return new Date(timeStamp).Format('yyyy-MM-dd');
      }, 
      /*
      * 根据类别判断布局格式
      */
      number(type){
        return type == 1 || type == 2 ? 8 : 16;
      },
      
    }
  }
</script>

<style lang="less">
.cu-box-wrap{
  height:340px;
  >ul{
    height: 307px;
    padding: 10px;
    li{
        padding: 6px 18px;
        position: relative;
        font-size: 16px;
        display: inline-block;
        width: 100%;
        cursor: pointer;
        box-sizing: border-box;
        span.text{
          overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: calc(~'100% - 120px');
        }
    }
    li:hover{
      color: #dc3a3a;
    }
    li:before{
      position: absolute;
        content: "";
        border: 7px solid #555555;
        border-color: transparent transparent transparent #555555;
        left: 0;
        top: 12px;
    }
  }
  >h1{
    padding: 0;
    margin: 0;
    font-size: 15px;
      background: #fff;
    border-bottom: 2px solid #dc3a3a;
    color: #fff;
    height: 33px;
    span{
      background: #dc3a3a;
      font-size: 18px;
      padding: 6px 25px;
    }
    a.more{
      color: #676767;
      line-height: 33px;
      cursor: pointer;
      font-weight: 100;
    }

  }
  a{
    color: #333;
  }
}
.date-background{
    display: inline-block;
  width: 100%;
  line-height: 50px;
  font-size: 18px;
  border-bottom: 1px solid #dadada;
}
.cu-border{
  border: 1px solid #d8d8d8;
  background: #fff;
}
/*   图片滚动    */
.banner-wrapper {
  overflow: hidden;
  position: relative;
  height: 339px;
}
.banner-wrapper>div{
  /*width: 2000%;*/
  position: relative;
  height: 100%;
}
.banner-wrapper .banner-inner {
  display: flex;
  float: left;
  height: 100%;
}
.banner-wrapper img{
  float: left;
  height: 100%;
  width: 100%;
}
.banner-wrapper .round-inner{
  position: absolute;
  bottom: 2rem;
  text-align: center;
  width: 100%;
}
.banner-wrapper .round-inner span{
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 100%;
  background: rgba(255,255,255,.7);
}
.banner-wrapper .round-inner span.active{
  background: #fff000;
}
</style>