<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    
    .ivu-modal{
        top: 0;
    }
  }
  .base > div {
    width: 40%;
    display: inline-block;
    margin: left;
    margin-left: 4%;
    margin-bottom: 5px;
  }
  .ivu-table .wrning td {
	  background-color: rgb(224, 222, 63);
  }
  .ivu-table .error td {
    background-color: rgb(201, 80, 50);
  }
</style>

<template>
    <!-- 运行记录报表详情弹框 -->
    <Modal footer-hide v-model="modal1" title="运行记录报表详情" class-name="vertical-center-modal" width="700px">
        <Form :label-width="130">
          <Tabs type="card">
              <TabPane label="基本信息">
                <div class="base" style="margin-bottom:20px">
                  <div v-for="(value,key) in baseData" :key="key" v-if="(typeof(value) !== 'object') && (key !== 'id')">{{ralations[key]}}: {{value}}</div>
                </div>
              </TabPane>
              <TabPane label="历史日志">
                <Table stripe :row-class-name="rowDesc" :data="log" :columns="historyLog" height="300"></Table>
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
          type: '类型',
          client: '客户机',
          policy: '策略',
          starttime: '开始时间',
          endtime: '结束时间',
          scheduletype: '计划备份',
          files: '文件',
          bytes: '字节',
          device: '设备',
          pool: '介质池',
          result: '状态',
          rate: '速率',
        }
      }
    },
    watch: {
      id: {
        handler(newVal, oldVal) {
          console.log('newVal', newVal)
          console.log('oldVal', oldVal)
          // 查询基本信息
          util.restfullCall('/rest-ful/v3.0/report/history/' + newVal + '/base', null, 'get', this.callbackBase)
          // 查询历史日志
          util.restfullCall('/rest-ful/v3.0/report/history/' + newVal + '/log', null, 'get', this.callbackLog)
        },
      }
    },
    methods: {
      reportDetail:function(id) {
        this.id = id
        // console.log("id",this.id)
        this.modal1 = true
      },
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
      callbackBase: function (baseObj) {
        this.baseData = baseObj.data.data
        console.log("baseObj",baseObj.data.data)
      },
      rowDesc(row) {
        if(row.desc === '警告'){
          return 'wrning'
        }else if(row.desc === "错误"){
          return 'error'
        }
      }
    }
}
</script>
