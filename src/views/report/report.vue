<style>
    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
        background: #fff;
        padding: 16px;
    }

    .demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent;
    }

    .demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
        border-color: #fff;
    }
    .run-top {
      border: 1px solid #ccc;
      /* background: #ccc; */
      margin-bottom: 15px;
    }
    .run-top > h2 {
      display: block;
      width: 130px;
      padding: 5px;
      text-align: center;
      position: relative;
      left: 20px;
      top: -15px;
      background: #e3e8ee;
    }
    .run-row {
      padding:10px 30px;
      height: 50px;
      position: relative;
      top: -15px;
    }
</style>

<template>
  <Tabs :animated="false" type="card" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
    <!-- 运行记录报表 -->
    <TabPane label="运行记录报表">
        <!-- 搜索条件 -->
      <div class="run-top">
        <h2>过 滤 查 询</h2>
        <Row :gutter="2" class="run-row">
            <Col span="4">
              <span>客户端</span>
              <Select v-model="model1" style="width:150px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <span>策略类型</span>
              <Select v-model="model1" style="width:150px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="7">
              <span>起止时间</span>
              <TimePicker format="yy/MM/dd/HH:mm:ss" type="timerange" style="width: 320px"></TimePicker>
            </Col>
            <Col span="4">
              <span>介质服务器</span>
              <Select v-model="model1" style="width:150px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <span>状态</span>
              <Select v-model="model1" style="width:150px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="1">
              <Button type="primary" shape="circle" icon="ios-search">生成</Button>
            </Col>
        </Row>
      </div>

        <Table stripe :data="run" :columns="runReport"></Table>
    </TabPane>

    <!-- 设备报表 -->
    <TabPane label="设备报表">
        <Table stripe :data="device" :columns="deviceReport"></Table>
    </TabPane>

    <!-- 介质报表 -->
    <TabPane label="介质报表">
        <Table stripe :data="medium" :columns="mediumReport"></Table>
    </TabPane>
  </Tabs>
</template>

<script>
  import util from '../../libs/util.js'
  import axios from 'axios'
export default {
  data() {
    return {
      runReport: [
        { title: "ID", key: "id" },
        { title: "策略", key: "timeStart" },
        { title: "开始时间", key: "timeStart" },
        { title: "结束时间", key: "timeCons" },
        { title: "备份大小", key: "backup" },
        { title: "速率", key: "file" },
        { title: "介质服务器", key: "client" },
        { title: "状态", key: "resource" },
      ],
      deviceReport: [
        { title: "客户端名称", key: "name" },
        { title: "备份次数", key: "backup" },        
        { title: "成功次数", key: "success" },        
        { title: "失败次数", key: "failures" },        
        { title: "备份总数据量", key: "backupTotal" },        
      ],
      mediumReport: [
        { title: "Barcode", key: "barcode" },
        { title: "标签", key: "barcode" },
        { title: "使用容量", key: "online" },
        { title: "介质池", key: "pool" },
        { title: "最后写入时间", key: "LastWrtime" },
        { title: "设备", key: "device" },
      ],
      run: [],
      device: [],
      medium: [],
      cityList:[],
      model1:""
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
        console.log("设备报表数据",deviceObj)
        var array = new Array()
        for (let i = 0; i < deviceObj.data.length; i++) {
          array.push({
          id: deviceObj.data[i].id,
          name: deviceObj.data[i].name,
          enable: deviceObj.data[i].enable,
          filesize: deviceObj.data[i].filesize,
          lowlimit: deviceObj.data[i].lowlimit,
          maxtasks: deviceObj.data[i].maxtasks,
          path: deviceObj.data[i].path,
          server: deviceObj.data[i].server,
          servername: deviceObj.data[i].servername,
          status: deviceObj.data[i].status,
          type: deviceObj.data[i].type,
          })
          this.device = array
        }
    },
    // 查询介质报表返回数据
    callbackMedium: function(mediumObj) {
        console.log("介质报表数据",mediumObj)
        var array = new Array()
        for (let i = 0; i < mediumObj.data.length; i++) {
          array.push({
          name: mediumObj.data[i].name,
          LastWrtime: mediumObj.data[i].LastWrtime,
          barcode: mediumObj.data[i].barcode,
          device: mediumObj.data[i].device,
          online: mediumObj.data[i].device,
          pool: mediumObj.data[i].pool,
          state: mediumObj.data[i].state,
          used: mediumObj.data[i].used,
          })
          this.medium = array
        }
    },
  }
}
</script>
