<style scoped>
  ._title {
    position: absolute;
    left: 10px;
    top: -10px;
    background: #fff;
  }
  .handle {
    position: relative;
    padding-top: 20px;
    height: 25%;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
</style>

<template>
  <div>
    <Modal title="SQLSERVER备份" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="开始恢复" cancel-text="取消恢复" width="500" :mask-closable="false">
      <div>
        <!-- 恢复路径 -->
        <Form label-position="left" :label-width="0">
          <RadioGroup v-model="path">
            <FormItem>
                <Radio label="new">恢复到原路径</Radio>
                <br>
                <Radio label="old">重定向恢复</Radio>
            </FormItem>
          </RadioGroup>
        </Form>
        <Form label-position="left" :label-width="120">
            <FormItem label="客户端：">
                <Select placeholder="请选择客户端" :disabled="!disab" @on-open-change="clientChange" @on-change="onClient" v-model="redirect.client">
                  <Option v-for="item in clientSelect" :value="item.client" :key="item.client">{{ item.machine }}</Option>
                </Select>
            </FormItem>
            <FormItem label="重定向实例：">
                <Select placeholder="请选择实例" :disabled="!disab" @on-change="changes" @on-open-change="caseChange" v-model="redirect.case" :label-in-value="true">
                  <Option v-for="item in example" :value="item.host" :key="item.host">{{ item.host }}</Option>
                </Select>
            </FormItem>
        </Form>
        <!-- 恢复时间 -->
        <div class="handle">
          <span class="_title">恢复时间点</span>
          <Form label-position="left" :label-width="50">
            <RadioGroup v-model="timeChoose">
              <FormItem>
                  <Radio label="chooseTime">选择时间点</Radio>
              </FormItem>
              <FormItem>
                  <Radio label="appointTime">指定时间点</Radio>
              </FormItem>
              <FormItem>
                  <DatePicker type="datetime" :value="redirect.time" :readonly="!readonly" :disabled="!disTime" placeholder="请选择日期时间" style="width: 300px" @on-change="startTime"></DatePicker>
              </FormItem>
            </RadioGroup>
          </Form>
        </div>
        <!-- 数据库状态 -->
        <div class="handle">
          <span class="_title">数据库状态</span>
          <Form label-position="left" :label-width="50">
            <RadioGroup v-model="dataBase">
              <FormItem>
                  <Radio label="dataBaseY">使数据库处于可用状态（RECOVER）</Radio>
              </FormItem>
              <FormItem>
                  <Radio label="dataBaseN">使数据处于不可用状态（NORECOVER）</Radio>
              </FormItem>
            </RadioGroup>
          </Form>
        </div>
      </div>
	  </Modal>
  </div>
</template>

<script>
  import util from '../../libs/util.js'

  export default {
    data() {
      return {
        modal: false,
        disab: false,
        disTime:false,
        readonly:false,
        path: 'new',
        timeChoose: 'chooseTime',
        dataBase:'dataBaseY',
        redirect: {
          client: '',
          case: '',
          time: ''
        },
        clientSelect: [],
        example: [],
        RestoreTime: '',
        PolicyType: '',
        list: [],
      }
    },
    watch: {
      path: {
        handler(newVal, oldVal) {
          if(newVal=="new") {
            this.disab = false
          }else if(newVal=="old") {
            this.disab = true
          }
        }
      },
      timeChoose: {
        handler(newVal, oldVal) {
          if(newVal=="chooseTime") {
            this.disTime = false
            this.readonly = false
          }else if(newVal=="appointTime") {
            this.disTime = true
            this.readonly = true

          }
        }
      },
    },
    methods: {
      // 重选择客户端
      clientChange:function(open) {
        if(open == true) util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.clientslData)
      },
      // 客户端回调数据
      clientslData: function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            client:obj.data[i].id,
            machine:obj.data[i].machine
          })
        }
        this.clientSelect = array
      },
      // 客户端id
      onClient: function(id) {
        this.redirect.client = id
      },
      // 实例下拉框获取的数据
      caseChange: function(open) {
        if(open==true) util.restfullCall('/rest-ful/v3.0/client/agent/instances?cid='+this.redirect.client+'&type='+this.PolicyType, null, 'get', this.exampleData)
      },
      // 实例下拉框回调
      exampleData: function(obj) {
        let data = []
        for(let i = 0;i < obj.data.length;i++ ){
          let object = JSON.parse(obj.data[i].conf)
          data.push(object)
        }
        var array = new Array
        for(let i = 0;i < data.length;i++ ){
          array.push({
            host:data[i].host
          })
        }
        this.example = array

      },
      // 选中实例名字
      changes: function(datas) {
        this.redirect.case = datas.label
      },
      // 指定恢复时间点
       startTime: function(start) {
        this.redirect.time = start
      },
      // 接收父组件的传递
      server: function(row, data) {
        var array = new Array
        for(var i=0;i<data.length;i++) {
          if(data[i].name.substring(0,1) == '+'){  
            this.list.push({
              Exclude:0,
              Type:data[i].type,
              path: data[i].name.substring(1,data[i].name.length)
            })
          }else  if(data[i].name.substring(0,1) == '-'){  
            this.list.push({
              Exclude:1,
              Type:data[i].type,
              path: data[i].name.substring(1,data[i].name.length)
            })
          }
        }
        this.redirect.client = row.client
        this.RestoreTime = row.RestoreTime;
        this.PolicyType = row.policytype
        this.modal = true
      },
      // 默认恢复
      defaultPath:function(path) {
        var file = "1";
        if(this.dataBase == "dataBaseY"){file = "1"}else{file = "0"}
        // (this.dataBase == "dataBaseY")?(file = "1"):(file = "0")
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type: 37, value: this.file},  
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 默认恢复原路径+指定时间点
      defaultAppoint:function(path) {
        var file = "1"
        if(this.dataBase == "dataBaseY"){file = "1"}else{file = "0"}
        // (this.dataBase == "dataBaseY")?(file = "1"):(file = "0")
          util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type: 37, value: this.file},
              { type: 36, value: this.redirect.time},
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 重定向恢复
      redirects:function(path) {
        var file = "1"
        if(this.dataBase == "dataBaseY"){file = "1"}else{file = "0"}
        // (this.dataBase == "dataBaseY")?(file = "1"):(file = "0")
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type: 37, value: this.file},
              { type: 35, value: this.redirect.case},
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 重定向恢复+指定时间点
      redirectAppoint:function(path) {
        var file = "1"
        if(this.dataBase == "dataBaseY"){file = "1"}else{file = "0"}
        // (this.dataBase == "dataBaseY")?(file = "1"):(file = "0")
          util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type: 37, value: this.file},
              { type: 36, value:this.redirect.time },
              { type: 35, value: this.redirect.case},
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      ok() {
        if((this.path == "new")&&(this.timeChoose == "chooseTime")){
          // 只选恢复到原路径
          this.defaultPath()
        }else if((this.path == "new")&&(this.timeChoose == "appointTime")) {
          // 只选恢复到原路径+指定时间点
          this.defaultAppoint()
        }else if((this.path == "old")&&(this.timeChoose == "chooseTime")) {
          // 重定向恢复
          this.redirects()
        }else if((this.path == "old")&&(this.timeChoose == "appointTime")) {
          // 重定向恢复+指定时间点
          this.redirectAppoint()
        }
        // 重置弹框
        this.disab = false;
        this.disTime = false;
        this.readonly = false;
        this.path = 'new';
        this.timeChoose = 'chooseTime';
        this.dataBase = 'dataBaseY';
        this.redirect.client = '';
        this.redirect.case = '';
        this.redirect.time = '';
        this.clientSelect = [];
        this.example = [];
        this.list = [];
      },
      calbackClients:function(obj) {
        // console.log("sqsever备份",obj)
      },
      cancel() {
        this.list=[];
      }
    }
  }
</script>
