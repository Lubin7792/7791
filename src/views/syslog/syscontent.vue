<style scoped>
@import './syscontent.css';

</style>
<template>
    <div class="sys-content">
        <div class="row">
            <Table highlight-row :data="pageData" :columns="tableColumns1" :row-class-name="rowClassName" @on-row-click="onClick" height="680"></Table>
        </div>
        <div style="margin: 10px;overflow: hidden">
            <div style="position: fixed; left: 40%;">
            <!-- 分页器 -->
                <Page :total="number" show-total :page-size="pageSize" @on-change="changePage"></Page>
                <!-- <Page :total="number" show-total /> -->
            </div>
        </div>
        <!-- 详情弹框 -->
        <Modal v-model="modal1" title="日志详情" class="sysmodal" cancel-text>
            <div class="sysdetails">
                <ul>
                    <li>
                        <span>级别:</span>
                        <Input v-model="detailsData.level" readonly placeholder="Enter something..." style="width: 300px"></Input>
                    </li>
                    <li>
                        <span>时间:</span>
                        <Input v-model="detailsData.time" readonly placeholder="Enter something..." style="width: 300px"></Input>
                    </li>
                    <li>
                        <span>用户:</span>
                        <Input v-model="detailsData.id" readonly placeholder="Enter something..." style="width: 300px"></Input>
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
      pageSize: 13,
      tableColumns1: [
        { title: '级别', key: 'levelstr' },
        { title: '时间', key: 'time' },
        { title: '用户', key: 'id' },
        { title: '来源', key: 'src' },
        { title: '描述', key: 'desc', className: 'sysdesc', width:400 }
      ],
      details1:{},
    }
  },
  created() {
    // 日志管理表格信息
    util.restfullCall('rest-ful/v3.0/syslogs',null,'get',this.senddata)
  },
  methods: {
    changePage (index) {
      var start = (index - 1 ) * this.pageSize;
      var end = index * this.pageSize
      this.pageData = this.tableData1.slice(start,end);
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      // this.tableData1 = this.mockTableData1();
    },
    // 接收父组件
    logfile:function(obj) {
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
          user: obj.data[i].user
        })
        this.number = obj.data.length
      }

      // 所有数据
      this.tableData1 = array;
      this.pageData = this.tableData1.slice(0,this.pageSize)
      
    },
    // 点击行的内容
    rowClassName (row, index) {
      // if (row.levelstr === '消息') {
      //   return 'news';
      // }else 
      if(row.levelstr === '警告') {
        return 'wrning';
      }else if(row.levelstr === '错误') {
        return 'error';
      }
    },
    // 点击某行弹出详情对话框
    onClick (row, index) {
        this.modal1 = true;
        this.detailsData = row
    }
      
  },
  components: {
  }
}
</script>
