<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
const debounce = require('debounce');

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
      default: '400px'
    },
    data:{
    	type:Array,
    	default:null
    }
  },
  watch: {
    data(newValue, oldValue) {//监听数据变化
  　　　　this.arr_new = newValue;
  		 this.initChart()
  　　},
    screenWidth(newValue, oldValue) {//监听屏幕宽度变化
  　　　 this.screenWidth = newValue;
      console.log('thermal',newValue, oldValue)
      this.initChart();
  　　},
  },
  data() {
    return {
      chart: null,
      arr_new:[],
      screenWidth:document.body.clientWidth,//屏幕宽度
    }
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
      this.chart.resize(this.$el, {width:(this.screenWidth/2-60)+'px',});//设置初始echrts宽度
  		//获取所需数据
			var datas = this.arr_new;
      //标题
			var obj = {'thermal':'工作热度图'};
			//热度图数据配置
			this.chart.setOption({
        title : {
          text: obj[this.className],
          subtext: '',
          x:'center',
          y:'bottom'
        },
        grid: {
          show: false,
          top: 10,
          bottom: 10
        },
        xAxis: [{
          gridIndex: 0,
          type: 'value',
          show: false,
          min: 0,
          max: 100,
          nameLocation: 'middle',
          nameGap: 5
        }],
        yAxis: [{
          gridIndex: 0,
          min: 0,
          show: false,
          max: 100,
          nameLocation: 'middle',
          nameGap: 30
        }],
        series: [{
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 120,
          label: {
            normal: {
              show: true,
              formatter: '{b}',
              color: '#fff',
              textStyle: {
                fontSize: '20'
              }
            },
          },
          itemStyle: {
            normal: {
              borderWidth: '4',
              borderType: 'solid',
              borderColor: '#fff',
              color: '#68b837',
              shadowColor: '#68b837',
              shadowBlur: 10
            }
          },
          data: datas
        }]
      });
    },
		
  }
}
</script>
