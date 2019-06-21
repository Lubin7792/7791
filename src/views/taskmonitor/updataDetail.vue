<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    
    .ivu-modal{
        top: 0;
    }
  }
    .upDase{
      border: 1px solid #dddee1; 
    border-bottom:none; 
    border-right:none; 
    line-height: 40px;
    }
    .upDase .line{
      width: 60px;
      height: 40px;
      display: inline-block;
      margin-right: 5px;
      border-right: 1px solid #dddee1; 
      padding-right: 5px;
    }
  .upDase > div {
    width: 50%;
    display: inline-block;
    padding: 0 10px;
    border-bottom: 1px solid #dddee1; 
    border-right: 1px solid #dddee1; 
  }
  .ivu-table .wrning td {
	background-color: rgb(224, 222, 63) !important;
}
.ivu-table .error td {
	background-color: rgb(201, 80, 50) !important;
}
</style>

<template>
    <!-- 运行记录报表详情弹框 -->
    <Modal footer-hide v-model="modal1" title="信息详情" class-name="vertical-center-modal" width="700px">
        <Form :label-width="130">
          <Tabs type="card">
              <TabPane label="基本信息">
                <div class="upDase" style="margin-bottom:20px">
                  <div v-for="(value,key) in baseData" :key="key" v-if="(typeof(value) !== 'object') && (key !== 'id')"><div class="line">{{ralations[key]}}</div>  {{value}}</div>
                </div>
              </TabPane>
              <TabPane label="任务日志">
                <Table stripe :row-class-name="rowClassName" :data="log" :columns="historyLog" height="300"></Table>
              </TabPane>
          </Tabs>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
import axios from 'axios'

export default {
    data () {
      return {
        modal1: false,
        id: '',
        historyLog: [
          { title: '级别', key: 'level', width: 100 },
          { title: '时间', key: 'time' },
          { title: '模块', key: 'module' },
          { title: '描述', key: 'desc' }
        ],
        log:[],
        baseData: {},
        ralations : {
          policy: '策略',
          client: '客户机',
          mediaserver: '服务器',
          device: '设备',
          starttime: '开始时间',
          usedtime: '耗时',
          files: '文件',
          bytes: '字节',
          rate: '速率',
          pool: '介质池',
          state: '状态',
        }
      }
    },
    watch: {
      id: {
        handler(newVal, oldVal) {
          // 查询基本信息
          util.restfullCall('/rest-ful/v3.0/task/monitor/' + newVal, null, 'get', this.callbackBase)
          // 查询历史日志
          util.restfullCall('/rest-ful/v3.0/report/history/' + newVal + '/log', null, 'get', this.callbackLog)
        },
      }
    },
    methods: {
      monitorDetail:function(id) {
        this.id = id
        this.modal1 = true
      },
      // 历史日志回调
      callbackLog: function(logObj) {
        var array = new Array()
        for (let i = 0; i < logObj.data.data.length; i++) {
          array.push({
            id: logObj.data.data[i].id,
            task: logObj.data.data[i].task,
            level: logObj.data.data[i].level,
            levelint: logObj.data.data[i].levelint,
            desc: logObj.data.data[i].desc,
            time: logObj.data.data[i].time,
            module: logObj.data.data[i].module
          })
          this.log = array
        }
      },
      // 基本信息回调
      callbackBase: function (baseObj) {
        this.baseData = baseObj.data.data
      },
      // 行内容
      rowClassName(row, index) {
        if(row.level === '警告') {
          return 'wrning';
        }else if(row.level === '错误') {
          return 'error';
        }
      },
    }
}
</script>
