<style scoped>
@import './syscontent.css';

</style>
<template>
  <div class="sys-content">
    <div class="row">
      <Table :data="pageData" :columns="tableColumns1" :row-class-name="rowClassName" @on-row-click="onClick" height="619"></Table>
    </div>
      <div class="sys-page" >
      <!-- 分页器 -->
        <Page :total="number" show-total :page-size="pageSize" @on-change="onPage"></Page>
      </div>
    <!-- 详情弹框 -->
    <Modal v-model="modal1" title="日志详情" class="sysmodal" cancel-text>
      <div class="sysdetails">
        <ul>
          <li>
              <span>级别:</span>
              <Input v-model="detailsData.levelstr" readonly placeholder="Enter something..." style="width: 300px"></Input>
          </li>
          <li>
              <span>时间:</span>
              <Input v-model="detailsData.time" readonly placeholder="Enter something..." style="width: 300px"></Input>
          </li>
          <li>
              <span>来源:</span>
              <Input v-model="detailsData.src" readonly placeholder="Enter something..." style="width: 300px"></Input>
          </li>
          <li>
              <span>描述:</span>
              <Input v-model="detailsData.desc" type="textarea" :autosize="{minRows: 5,maxRows: 6}" placeholder="Enter something..." style="width: 300px"></Input>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>
<script>
import util from '../../libs/util.js'
import axios from 'axios'
export default {
  data () {
    return {
      modal1: false,
      detailsData: {},
      tableData1: [],
      pageData:[],
      number:0,
      pageSize: 12,
      tableColumns1: [
        { title: '级别', key: 'levelstr' },
        { title: '时间', key: 'time' },
        { title: '来源', key: 'src' },
        { title: '描述', key: 'desc', className: 'sysdesc', width:400 },
        { title: '详情', width: 80, align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Div",
                {
                  style: {
                  },
                  class:{
                    renderIcon:true,
                    policyA:true
                  },
                  on: {
                    click: () => {
                      this.modal1 = true;
                    }
                  }
                },
                ""
              )
            ]);
          }
        }
      ],
      details1:{},
    }
  },
  created() {
    // 系统事件表格信息
    util.restfullCall('rest-ful/v3.0/sysevents',null,'get',this.senddata)
  },
  methods: {
    onPage (index) {
      var start = (index - 1 ) * this.pageSize;
      var end = index * this.pageSize
      this.pageData = this.tableData1.slice(start,end);
    },
    // 接收父组件
    queryEvent:function(obj) {
      // console.log("e",obj)
      this.tableData1 = obj
      this.number = obj.length
      this.pageData = this.tableData1.slice(0,this.pageSize)
    },
    // 日志管理表格回调
    senddata: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          levelstr: obj.data[i].levelstr,
          desc: obj.data[i].desc,
          id: obj.data[i].id,
          level: obj.data[i].level,
          src: obj.data[i].src,
          time: obj.data[i].time,
        })
        this.number = obj.data.length
      }

      // 所有数据
      this.tableData1 = array;
      this.pageData = this.tableData1.slice(0,this.pageSize)
      
    },
    // 点击行的内容
    rowClassName (row, index) {
      if(row.levelstr === '警告') {
        return 'wrning';
      }else if(row.levelstr === '错误') {
        return 'error';
      }
    },
    // 点击某行弹出详情对话框
    onClick (row, index) {
      this.detailsData = row
    } 
  },
}
</script>
