<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    
    .ivu-modal{
        top: 0;
    }
  }
    .upRebase{
      border: 1px solid #dddee1; 
    border-bottom:none; 
    border-right:none; 
    line-height: 40px;
    }
    .upRebase .line{
      width: 60px;
      display: inline-block;
      margin-right: 5px;
      border-right: 1px solid #dddee1; 
      padding-right: 5px;
    }
  .upRebase > div {
 width: 50%;
    display: inline-block;
    padding: 0 10px;
    border-bottom: 1px solid #dddee1; 
    border-right: 1px solid #dddee1; 
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
                <div class="upRebase" style="margin-bottom:20px">
                  <!-- <div v-for="(value,key) in baseData" :key="key" v-if="(typeof(value) !== 'object') && (key !== 'id')"><div class="line">{{ralations[key]}}</div> {{value}}!!{{key}}</div> -->
                  <div v-if="baseData==null" >无数据</div>
                  <div v-else v-for="(value,key) in ralations" :key="key"><div class="line">{{value}}</div> {{baseData[key]}}</div>
                </div>
              </TabPane>
              <TabPane label="任务日志">
                <Table :row-class-name="rowDesc" :data="log" :columns="historyLog" height="300"></Table>
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
          { title: '来源', key: 'module' },
          { title: '描述', key: 'desc' }
        ],
        log:[],
        baseData: null,
        ralations : {
          type: '类型',
          client: '客户机',
          policy: '策略',
          policytype:"策略类型",
          starttime: '开始时间',
          endtime: '结束时间',
          times: '耗时',
          scheduletype: '备份类型',
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
        console.log(this.baseData )
      },
      rowDesc(row) {
        if(row.level === '警告'){
          return 'wrning'
        }else if(row.level === "错误"){
          return 'error'
        }
      }
    }
}
</script>
