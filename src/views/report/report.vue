<style>
  .run-top {
    margin-top: 20px;
    border: 1px solid #ccc;
    /* background: #ccc; */
    margin-bottom: 15px;
  }
  .run-top > h3 {
    display: block;
    width: 100px;
    padding: 5px;
    text-align: center;
    position: relative;
    left: 20px;
    top: -15px;
    background: #fff;
  }
  .run-row {
    padding: 10px 30px;
    height: 50px;
    position: relative;
    top: -15px;
  }
  .ivu-table .wrning td {
	  background-color: rgb(224, 222, 63) !important;
  }
  .ivu-table .error td {
    background-color: rgb(201, 80, 50);
  }
</style>

<template>
  <Tabs :animated="false" type="card">
    <!-- 运行记录报表 -->
    <TabPane label="运行记录报表">
        <!-- 搜索条件 -->
      <div class="run-top">
        <h3>过滤查询</h3>
        <Row type="flex" justify="space-between" class="run-row">
            <Col span="4">
              <span>客户端</span>
              <Select v-model="query.client" clearable style="width:160px" @on-change="changesCli" @on-open-change="openClient">
                  <Option v-for="item in clientSelect" :value="item.id" :key="item.id">{{ item.machine }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <span>策略类型</span>
              <Select v-model="query.policytype" clearable style="width:150px" @on-change="changesType" @on-open-change="openType">
                  <Option v-for="item in typeSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <span>开始时间</span>
              <DatePicker type="datetime" placeholder="请选择时间日期" style="width: 170px" @on-change="startTime"></DatePicker>
            </Col>
            <Col span="4">
              <span>结束时间</span>
              <DatePicker type="datetime" placeholder="请选择时间日期" style="width: 170px" @on-change="endTime"></DatePicker>
            </Col>
            <Col span="4">
              <span>介质服务器</span>
              <Select v-model="query.mediaserver" clearable style="width:140px" @on-change="changesServer" @on-open-change="openServer">
                  <Option v-for="item in serverSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="3">
              <span>状态</span>
              <Select v-model="query.status" clearable style="width:130px" @on-change="changesStatus" @on-open-change="openStatus">
                  <Option v-for="item in statusSelect" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="1">
              <Button type="primary" shape="circle" icon="ios-search" @click="generate">生成</Button>
            </Col>
        </Row>
      </div>

        <Table stripe :row-class-name="rowRun" :data="run" :columns="runReport" height="650"></Table>
        <updataReport ref="updataReport"></updataReport>
    </TabPane>

    <!-- 设备报表 -->
    <TabPane label="设备报表">
        <!-- 搜索条件 -->
      <div class="run-top">
        <h3>过滤查询</h3>
        <Row type="flex" justify="space-between" class="run-row">
            <Col span="6">
              <span>介质服务器</span>
              <Select v-model="deviceQuery.mediaserver" clearable style="width:250px" @on-change="changesDeviceServer" @on-open-change="openDeviceServer">
                  <Option v-for="item in deviceServerSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="6">
              <span>设备类型</span>
              <Select v-model="deviceQuery.type" clearable style="width:250px" @on-change="openDeviceType" @on-open-change="openDevice">
                  <Option v-for="item in deviceTypeSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="6">
              <span>状态</span>
              <Select v-model="deviceQuery.status" clearable style="width:250px" @on-change="changesDeviceStatus" @on-open-change="openDeviceStatus">
                  <Option v-for="item in deviceStatusSelect" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Button type="primary" shape="circle" icon="ios-search" @click="generateDevice">生成</Button>
            </Col>
        </Row>
      </div>

        <Table stripe :row-class-name="rowDevice" :data="device" :columns="deviceReport" height="650"></Table>
    </TabPane>

    <!-- 介质报表 -->
    <TabPane label="介质报表">
          <!-- 搜索条件 -->
      <div class="run-top">
        <h3>过滤查询</h3>
        <Row justify="space-between" class="run-row">
            <Col span="7">
              <span>介质池</span>
              <Select v-model="deviceQuery.mediaserver" clearable style="width:250px" @on-change="changesPool" @on-open-change="openPool">
                  <Option v-for="item in poolSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="7">
              <span>状态</span>
              <Select v-model="deviceQuery.status" clearable style="width:250px" @on-change="changesPoolStatus" @on-open-change="openPoolStatus">
                  <Option v-for="item in poolStatusSelect" :value="item.code" :key="item.code">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Button type="primary" shape="circle" icon="ios-search" @click="generatePool">生成</Button>
            </Col>
        </Row>
      </div>

        <!-- <Table stripe :data="medium" :columns="mediumReport" style="overflow-y:scroll; height:520px"></Table> -->
        <Table stripe :row-class-name="rowMedium" :data="medium" :columns="mediumReport" height="650"></Table>
    </TabPane>
  </Tabs>
</template>

<script>
import util from '../../libs/util.js'
import axios from 'axios'

// 运行记录详情弹框
import updataReport from './updataReport.vue'

export default {
  components: {
    updataReport
  },
  data() {
    return {
      runReport: [
        { title: 'ID', key: 'id', width: 80, },
        { title: '任务类型', key: 'type' },
        { title: '策略名称', key: 'policy' },
        { title: '策略类型', key: 'policytype' },
        { title: '调度类型', key: 'scheduletype' },
        { title: '开始时间', key: 'starttime' },
        { title: '结束时间', key: 'endtime' },
        { title: '备份大小', key: 'bytes' },
        { title: '速率', key: 'rate' },
        { title: '设备', key: 'device' },
        { title: '状态', key: 'result', width: 80, },
        {title: '操作',key: 'operation',align: 'center',width: 80, 
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                  props: {
                      type: 'gear-b',
                      size: '20',
                  },
                  on: {
                      click: () => {
                        // console.log("222",params)
                        this.$refs.updataReport.reportDetail(params.row.id,)
                      }
                  }
              },),
            ]);
          }
        },
      ],
      deviceReport: [
        { title: '设备名称', key: 'name' },
        { title: '设备类型', key: 'devicetype' },
        { title: '设备路径', key: 'path' },
        { title: '最大任务数', key: 'maxtasks' },
        { title: '介质服务器', key: 'mediaserver' },
        { title: '状态', key: 'status' },
        { title: '备份任务数', key: 'tasks' },
        { title: '总备份数量', key: 'bytes' },
      ],
      mediumReport: [
        { title: '名称', key: 'name' },
        { title: '条形码', key: 'barcode' },
        { title: '已使用容量', key: 'bytes' },
        { title: '介质池', key: 'pool' },
        { title: '介质状态', key: 'status' },
        { title: '在线状态', key: 'online' },
        { title: '镜像数量', key: 'images' },
        { title: '写入时间', key: 'lastwrtime' },
        { title: '最后回收时间', key: 'recycletime' },
      ],
      run: [],
      device: [],
      medium: [],
      status: [],
      clientSelect: [],
      typeSelect: [],
      serverSelect: [],
      statusSelect:[],
      deviceServerSelect:[],
      deviceTypeSelect:[],
      deviceStatusSelect:[],
      poolSelect:[],
      poolStatusSelect:[],
      query: {
        client: "",
        policytype: '',
        starttime: '',
        endtime: '',
        mediaserver: '',
        status: ''
      },
      deviceQuery: {
        mediaserver: "",
        type: "",
        status: ""
      },
      poolQuery:{
        pool: "",
        status: "",
      }
    }
  },
  created() {
    // 查询设备报表
    util.restfullCall('/rest-ful/v3.0/report/device', null, 'get', this.callbackDevice)
    // 查询介质报表
    util.restfullCall('/rest-ful/v3.0/report/volume', null, 'get', this.callbackMedium)
  },
  methods: {
    // 查询设备报表返回数据
    callbackDevice: function(deviceObj) {
      var array = new Array()
      for (let i = 0; i < deviceObj.data.length; i++) {
        array.push({
          name: deviceObj.data[i].name,
          path: deviceObj.data[i].path,
          mediaserver: deviceObj.data[i].mediaserver,
          devicetype: deviceObj.data[i].devicetype,
          maxtasks: deviceObj.data[i].maxtasks,
          status: deviceObj.data[i].status,
          bytes: deviceObj.data[i].bytes,
          tasks: deviceObj.data[i].tasks,
        })
      }
        this.device = array
    },
    // 查询介质报表返回数据
    callbackMedium: function(mediumObj) {
      var array = new Array()
      for (let i = 0; i < mediumObj.data.length; i++) {
        array.push({
          name: mediumObj.data[i].name,
          barcode: mediumObj.data[i].barcode,
          lastwrtime: mediumObj.data[i].lastwrtime,
          bytes: mediumObj.data[i].bytes,
          status: mediumObj.data[i].status,
          online: mediumObj.data[i].online,
          pool: mediumObj.data[i].pool,
          images: mediumObj.data[i].images,
          recycletime: mediumObj.data[i].recycletime
        })
      }
      this.medium = array
    },

  // 生成的各报表
    // 点击生成按钮生成运行记录报表
    generate() {
      let url = '/rest-ful/v3.0/report/history?'
      Object.keys(this.query).forEach(item => {
        if(this.query[item]) url += `${item}=${this.query[item]}&`
      })
      util.restfullCall(url, null, 'get', this.callbackQuery)
    },
    // 生成的运行记录列表的返回数据
    callbackQuery: function(queryObj) {
      var array = new Array()
      for (let i = 0; i < queryObj.data.length; i++) {
        array.push({
          bytes: queryObj.data[i].bytes,
          client: queryObj.data[i].client,
          device: queryObj.data[i].device,
          endtime: queryObj.data[i].endtime,
          files: queryObj.data[i].files,
          id: queryObj.data[i].id,
          policy: queryObj.data[i].policy,
          policytype: queryObj.data[i].policytype,
          pool: queryObj.data[i].pool,
          rate: queryObj.data[i].rate,
          result: queryObj.data[i].result,
          scheduletype: queryObj.data[i].scheduletype,
          starttime: queryObj.data[i].starttime,
          type: queryObj.data[i].type
        })
      }
        this.run = array
    },
    // 点击生成按钮生成设备报表
    generateDevice() {
      let url = '/rest-ful/v3.0/report/device?'
      Object.keys(this.deviceQuery).forEach(item => {
        if(this.deviceQuery[item]) url += `${item}=${this.deviceQuery[item]}&`
      })
      util.restfullCall(url, null, 'get', this.callbackDeviceQuery)
    },
    // 生成的设备列表的返回数据
    callbackDeviceQuery: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          name: obj.data[i].name,
          bytes: obj.data[i].bytes,
          devicetype: obj.data[i].devicetype,
          maxtasks: obj.data[i].maxtasks,
          path: obj.data[i].path,
          mediaserver: obj.data[i].mediaserver,
          status: obj.data[i].status,
          tasks: obj.data[i].tasks
        })  
      }
      this.device = array
    },
    // 点击生成按钮生成介质报表
    generatePool() {
      let url = '/rest-ful/v3.0/report/volume?'
      Object.keys(this.poolQuery).forEach(item => {
        if(this.poolQuery[item]) url += `${item}=${this.poolQuery[item]}&`
      })
      util.restfullCall(url, null, 'get', this.callbackPoolQuery)
    },
    // 生成的介质报表返回数据
    callbackPoolQuery: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          name: obj.data[i].name,
          barcode: obj.data[i].barcode,
          lastwrtime: obj.data[i].lastwrtime,
          bytes: obj.data[i].bytes,
          status: obj.data[i].status,
          online: obj.data[i].online,
          pool: obj.data[i].pool,
          images: obj.data[i].images,
          recycletime: obj.data[i].recycletime
        })
      }
      this.medium = array
    },

  // 运行记录查询栏
    // 点击客户端下拉框生成客户端下拉框数据
    openClient:function(openCli) {
      if(openCli == true) util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.cliData)
    },
    // 客户端下拉框回调数据
    cliData:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          machine:obj.data[i].machine
        })
      }
      this.clientSelect = array
    },
    // 客户端下拉框选中的id
    changesCli: function(datas) {
      this.query.client = datas
    },
    // 点击策略类型下拉框生成策略类型数据
    openType:function(openTyp) {
      if(openTyp == true) util.restfullCall('/rest-ful/v3.0/policytype', null, 'get', this.typeData)
    },
    // 策略类型下拉框回调数据
    typeData:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          type:obj.data[i].type,
          name:obj.data[i].name
        })
      }
      this.typeSelect = array
    },
    // 策略类型下拉框选中的id
    changesType: function(datas) {
      this.query.policytype = datas
    },
    // 点击介质服务器下拉框生成数据
    openServer:function(openSer) {
      if(openSer == true) util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.serverData)
    },
    // 介质服务器下拉框回调
    serverData:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          name:obj.data[i].name
        })
      }
      this.serverSelect = array
    },
    // 介质服务器下拉框选中的id
    changesServer: function(datas) {
      this.query.mediaserver = datas
    },
    // 开始时间
    startTime: function(start) {
      this.query.starttime = start
    },
    // 结束时间
    endTime: function(end) {
      this.query.endtime = end
    },
    // 状态下拉框生成的数据
    openStatus:function(open) {
      if(open == true) this.statusSelect = [{code: 1, name: "成功"},{code: -1, name: "失败"}]
    },
    // 状态下拉框的id
    changesStatus: function(id) {
      this.query.status = id
    },

  // 设备报表查询栏
    // 点击介质服务器下拉框生成数据
    openDeviceServer:function(openSer) {
      if(openSer == true) util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.serverDatas)
    },
    // 介质服务器下拉框回调
    serverDatas:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          name:obj.data[i].name
        })
      }
      this.deviceServerSelect = array
    },
    // 介质服务器下拉框选中的id
    changesDeviceServer: function(id) {
      this.deviceQuery.mediaserver = id
    },
    // 设备类型下拉框获取的数据
    openDevice:function(open) {
      if(open == true) util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.deviceData)
    },
    // 设备类型下拉框回调
    deviceData:function (obj) {
      // console.log("obj",obj)
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          type:obj.data[i].type,
          name:obj.data[i].name
        })
      }
      this.deviceTypeSelect = array
    },
    // 设备下拉框选中的id
    openDeviceType:function(id) {
      this.deviceQuery.type = id
    },
    // 状态下拉框获取数据
    openDeviceStatus:function(open) {
      if(open == true) this.deviceStatusSelect = [{code: 1, name: "在线"},{code: -1, name: "离线"}]
    },
    // 状态下拉框的id
    changesDeviceStatus: function(datas) {
      this.deviceQuery.status = datas
    },

  // 介质报表查询栏
    // 介质池下拉框获取的数据
    openPool:function(open) {
      if(open == true) util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.poolData)
    },
    // 介质池回调数据
    poolData: function (obj) {
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          name:obj.data[i].name
        })
      }
      this.poolSelect = array
    },
    // 介质池下拉框选中的id
    changesPool:function(id) {
      this.poolQuery.pool = id
    },
    // 状态下拉框获取数据
    openPoolStatus:function(open) {
      if(open == true) this.poolStatusSelect = [{code: 0, name: "正常"},{code: 1, name: "错误"},{code: 2,name: "已满"}]
    },
    // 状态下拉框的id
    changesPoolStatus: function(datas) {
      this.poolQuery.status = datas
    },
    // 行内容背景色
    rowRun (row, index) {
      if (row.result === '失败') {
        return 'error';
      }
    },
    rowDevice (row, index) {
      if (row.result === '离线') {
        return 'error';
      }
    },
    rowMedium (row, index) {
      if (row.status === '已满') {
        return 'wrning';
      }
    },
  }
}
</script>
