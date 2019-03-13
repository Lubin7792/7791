<template>
  <div class="home-middle">
     <div class="home-title">
          <p > </p>
          <i>备份成功数量</i>
          <em>{{this.content.successtasks}}</em>    
        </div>
        <div class="home-content">
          <p class="home-con-tit">服务器统计</p>
           <div id="myChart2" :style="{width:'',height:'324px'}"></div> 
             <div class=" home-details">
               <span class="home-capacity">
                 <p>介质服务器数量</p>
                 {{this.content.MediaServers}}
               </span>
               <span class="home-range">
                <p>客户端数量</p>
                 {{this.content.clients}}
               </span>
          </div>
        </div>
  </div>
</template>
<script >
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/bar");
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  props: {
    content:{}
  },
  name: "hello",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart2"));
      // 绘制图表
      myChart.setOption({
        legend: {
          orient: "vertical",
          left: "left",
          data: []
        },
        color: ["#fd7549", "#e3e3e3"],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"], 
            data: [
              // { value: this.content.device.tapelibdevs, name: "介质服务器" },
              // { value: this.content.device.diskdevs, name: "客户端" },
              { value: 390, name: "介质服务器" },
              { value: 310, name: "客户端" }
            ],
            itemStyle: {
              color:'red',
              emphasis: {
                shadowBlur: 100,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              
              }
            }
          }
        ]
      });
    }
  }
};
</script>