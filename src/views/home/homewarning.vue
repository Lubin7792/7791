<template>
    <div class="home-war">
        <p class="war-tit">警告记录（最近一周）</p>
        <Table  :columns="warning" :data="warnings" :show-header="false" @on-row-click="getRowData" height="250"></Table>
        <Modal  v-model="details" title="详情"  cancel-text class="popup">
          <popup :num="ceshi" ></popup>   
        </Modal>
    </div>
</template>

<script>
import util from '../../libs/util.js'
import popup from "../common/popup.vue";
export default {
  data() {
    return {
      details: false,
      ceshi:[],
      nowTime: '',
      pastTimes: '',
      level: '',
      warning: [
        { title: '描述', key: 'desc'},
        { width: 150, align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Icon",
                {
                  props: {
                    type: 'ios-chatboxes',
                    size: '20',
                  },
                  on: {
                    click: () => {
                      this.details = true;
                    }
                  }
                },
                ""
              )
            ]);
          }
        }
      ],
      warnings: []
    };
  },
  watch: {
    level: {
      handler(newVal, oldVal) {
        if(newVal !== '') {
        util.restfullCall('/rest-ful/v3.0/sysevents?level='+this.level+'&starttime='+this.pastTimes+'&endtime='+this.nowTime, null, 'get', this.wrningData)
        }
      },
    }
  },
  created() {
    // 时间处理部分
    var now = new Date();
    var y = now.getFullYear();                       //获取完整的年份(4位)
    var m = now.getMonth()+1;                        //获取当前月份(0-11,0代表1月)
    var d =now.getDate();                            //获取当前日(1-31)
    var h = now.getHours();                          //获取当前小时
    var mm = now.getMinutes();                       //获取当前分
    var s = now.getSeconds();                        //获取当前秒
    this.nowTime = y+'-'+m+'-'+d+' '+h+':'+mm+':'+s; //当前时间
    var past = new Date(now-7*24*3600*1000);          //一周前时间
    var y = past.getFullYear();                       //一周前年
    var m = past.getMonth()+1;                        //一周前月
    var d = past.getDate();                           //一周前日
    this.pastTimes = y+'-'+m+'-'+d+' '+"00:00:00";    //一周前时间
    // 级别处理
    util.restfullCall('/rest-ful/v3.0/loglevels', null, 'get', this.levelData)
    // 警告表格数据
  },
  methods: {
    // 级别下拉框回调数据
    levelData:function(obj) {
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        if(obj.data[i].name == "警告"){
          this.level = obj.data[i].level
        }
      }
    },
    // 警告表格数据回调
    wrningData:function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          levelstr: obj.data[i].levelstr,
          desc: obj.data[i].desc,
          id: obj.data[i].id,
          level: obj.data[i].level,
          src: obj.data[i].src,
          time: obj.data[i].time,
          user: obj.data[i].user,
        })
      }
      this.warnings = array
    },
    // remove(index) {
    //   this.warnings.splice(index, 1);
    // },
    getRowData(row, index) {
     this.ceshi=row;
    }
  },
  components: {
    popup
  }
};
</script>