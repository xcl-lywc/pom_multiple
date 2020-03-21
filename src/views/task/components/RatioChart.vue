<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const debounce = require('debounce');
const animationDuration = 6000;

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    data:{
    	type:Array,
    	default:null
    },
    data_:{
      type:Array,
      default:null
    }
  },
  data() {
    return {
      chart: null,
      arr_new:[],
      arr_new_:[],
      screenWidth:document.body.clientWidth,//屏幕宽度
    }
  },
  watch: {
    data(newValue, oldValue) {//监听数据变化
  　　　　this.arr_new = newValue;
  		 this.initChart()
  　　},
    data_(newValue, oldValue) {//监听数据变化
  　　　　this.arr_new_ = newValue;
       this.initChart()
  　　},
  	screenWidth(newValue, oldValue) {//监听屏幕宽度变化
  　　　　this.screenWidth = newValue;
  		 console.log('ratio',newValue, oldValue)
       this.initChart();
  　 },
  },
  mounted() {
    //初始化echarts
    this.initChart();
    //自适应浏览器大小
    window.addEventListener('resize', this.__resizeHanlder);
  },
  created(){
  	// 获取屏幕宽度
  	const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    };
		this.__resizeHanlder = debounce(() => {if (this.chart) {this.chart.resize()}}, 100) 
	},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {

  	/* 
		 初始化echarts实例
		 */
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.chart.resize(this.$el, {width:(this.screenWidth/1-240)+'px',});//设置初始echrts宽度
  		//获取所需数据
  		var dimensions = this.arr_new;
      var source = this.arr_new_;
      //标题
			var obj = {'ratio':'近一年发布与完成对比图'};
			//柱状图数据配置
			this.chart.setOption({
        title : {
          text: obj[this.className],
          subtext: '',
          x:'center',
          y:'bottom',
    		},
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: dimensions,
          source: source,
        },
        xAxis: {type: 'category'},
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {type: 'bar'},
          {type: 'bar'},
        ]
			});
    },
  }
}
</script>
