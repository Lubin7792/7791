<style>
</style>

<template>
  <div class="home-left">
    <div class="task">
      <div class="home-task">
        <div class="home-title">
          <p > </p>
          <i>备份任务量</i>
          <em>{{left.tasks}}</em>    
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="home-content">
          <p class="home-con-tit">备份数据量</p>
          <div id="myChart1"  :style="{width:'',height:'244px'}" ></div>
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
      this.drawLine(data);
    }
  },
  methods: {
    drawLine(data) {
      var array = new Array;
      if(data.classsum == null) {
          array.push({
            value:1,
            name:"暂无数据"
          })
      }else if(data.classsum.length !== 0) {
          for (var i=0;i<data.classsum.length;i++){
            array.push({
              value:data.classsum[i].percent,
              name:data.classsum[i].policytype
            })
          }
      };
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart1"));
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
            radius: ["55%", "75%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  color:"#2f3b4c",
                  fontSize: "22",
                  fontWeight: "bold",
                  
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
              // "#fff",
              "##4ee6cb",
              "##57d868",
              "#c95dea"
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