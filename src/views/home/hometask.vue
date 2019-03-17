<style>
</style>

<template>
    <div class="home-left">
        <div class="home-title">
          <p > </p>
          <i>备份任务量</i>
          <em>{{left.tasks}}</em>    
        </div>
        <div class="home-content">
          <p class="home-con-tit">备份数据量</p>
            <div id="myChart1"  :style="{width:'470px',height:'244px'}" ></div> 
           
             <div class="home-details">
               <span class="home-capacity">
                 <p> 累计完成备份数据量</p>
                 {{left.totalbytes}}
               </span>
               <span class="home-range">
                <p>同比上周字节增长量</p>
                 {{left.increasebytes}}
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
    left:{}
  },
  name: "hello",
  data() {
    return {
      // leftData:this.left,
      msg: "Welcome to Your Vue.js App",
      mss: "",
    };
  },
  watch: {
    left:function(data) {
      // console.log("data",data)
      this.drawLine(data);
    }
  },
  methods: {
    drawLine(data) {
      var array = new Array;
      for (var i=0;i<data.classsum.length;i++){
        array.push({
          value:data.classsum[i].percent,
          name:data.classsum[i].policytype
        })
      };
      // datalist = array;
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart1"));
      // console.log('this.left', JSON.stringify(this.left))
      // console.log('this.left', this.left,typeof this.left.classsum)
      // console.log('this.left', this.left,this.left.classsum[0].percent)
      // 绘制图表
      myChart.setOption({
        legend: {
          orient: "vertical",
          x: "left",
          data: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["65%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            color: [
              "#fd7549",
              // "#fff",
              "#108bd8",
              // "#fff",
              "#ff9103",
              // "#fff",
              "#c5c7c9",
              // "#fff"
            ],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: array
            // data: [
            //   { value: data.classsum[0].percent, name: data.classsum[0].policytype },
              // { value: 4, name: "策略管理" },
              // { value: 5, name: "" },
              // { value: 3, name: "邮件营销" },
              // { value: 5, name: "" },
              // { value: 0, name: "联盟广告" },
              // { value: 5, name: "" },
              // { value: 0, name: "视频广告" },
              // { value: 5, name: "" }
            // ]
          }
        ]
      });
    }
  }
};
</script>