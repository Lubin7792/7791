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
  padding: 10px 30px;
  height: 50px;
  position: relative;
  top: -15px;
}
</style>

<template>
  <Tabs :animated="false" type="card" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px; height: 100%">
    <!-- 运行记录报表 -->
    <TabPane label="运行记录报表">
        <!-- 搜索条件 -->
      <div class="run-top">
        <h2>过 滤 查 询</h2>
        <Row type="flex" justify="space-between" class="run-row">
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
              <DatePicker type="datetimerange" placeholder="请选择时间日期" style="width: 340px" @on-change="time"></DatePicker>
            </Col>
            <Col span="4">
              <span>介质服务器</span>
              <Select v-model="model1" style="width:140px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="3">
              <span>状态</span>
              <Select v-model="model1" style="width:130px">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="2">
              <Button type="primary" shape="circle" icon="ios-search">生成</Button>
            </Col>
        </Row>
      </div>

        <!-- <Table stripe :data="run" :columns="runReport" @on-row-click="rowData" height="500px"></Table> -->
        <el-table tripe :data="run" :span-method="arraySpanMethod" height="600" highlight-current-row @selection-change="tableRowClassName" @row-click="clickRow" ref="moviesTable">
          <!-- <el-table-column type="selection" width="55">
          </el-table-column> -->
          <el-table-column v-for="item in runReport" :key="item.key" :prop="item.key" :label="item.title">
            <template slot-scope="props">
              <div v-if="props.row['总备份数据量'] && item.key === 'id'" style="display: flex;justify-content: space-around;font-size:20px;font-weight:600">
                <span v-for="(val, key) in props.row" :key="key">{{key}}:{{val}}</span>
              </div>
              <div v-else>{{props.row[item.key]}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)" type="info" plain>数据详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <updataReport ref="updataReport"></updataReport>
    </TabPane>

    <!-- 设备报表 -->
    <TabPane label="设备报表">
        <Table stripe :data="device" :columns="deviceReport" height="720px"></Table>
    </TabPane>

    <!-- 介质报表 -->
    <TabPane label="介质报表">
        <Table stripe :data="medium" :columns="mediumReport" style="overflow-y:scroll; height:720px"></Table>
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
        { title: 'ID', key: 'id' },
        { title: '策略', key: 'policy' },
        { title: '开始时间', key: 'time_s' },
        { title: '结束时间', key: 'time_e' },
        { title: '备份大小', key: 'bytes' },
        { title: '速率', key: 'rate' },
        { title: '介质服务器', key: 'mediaserver' },
        { title: '状态', key: 'result' },
      ],
      deviceReport: [
        { title: '客户端名称', key: 'name' },
        { title: '备份次数', key: 'backup' },
        { title: '成功次数', key: 'success' },
        { title: '失败次数', key: 'failures' },
        { title: '备份总数据量', key: 'backupTotal' }
      ],
      mediumReport: [
        { title: 'Barcode', key: 'barcode' },
        { title: '标签', key: 'barcode' },
        { title: '使用容量', key: 'online' },
        { title: '介质池', key: 'pool' },
        { title: '最后写入时间', key: 'LastWrtime' },
        { title: '设备', key: 'device' }
      ],
      run: [],
      device: [],
      medium: [],
      cityList: [],
      model1: '',
      getTime: []
    }
  },
  created() {
    // 查询设备报表
    util.restfullCall('/rest-ful/v3.0/report/device', null, 'get', this.callbackDevice)
    // 查询介质报表
    util.restfullCall('/rest-ful/v3.0/report/volume', null, 'get', this.callbackMedium)

    let data = [
      {
        tasks: [
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          },
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          },
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          }
        ],
        statistics: {
          tile: '一月',
          count: 3,
          success: 3,
          failed: 0,
          totalsize: '163.58M'
        }
      },
      {
        tasks: [
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          },
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          },
          {
            id: 0,
            policy: 'test',
            time_s: '2019-01-23 12:20:21',
            time_e: '2019-01-23 13:21:20',
            bytes: '23.32G',
            rate: '53.82M/S',
            mediaserver: 'testserver',
            result: '成功'
          }
        ],
        statistics: {
          tile: '二月',
          count: 3,
          success: 3,
          failed: 0,
          totalsize: '163.58M'
        }
      }
    ]
    let arr = []
    // let titleArr = {
    //   conut:
    //   tile: 'tile',
    //   failed: '失败',
    //   success: '成功'
    // }
    data.forEach(item => {
      // console.log('item.statistics', item.statistics)
      let stat = {}
      stat[item.statistics.tile + '份总备份次数'] = item.statistics['count']
      stat['成功次数'] = item.statistics['success']
      stat['失败次数'] = item.statistics['failed']
      stat['总备份数据量'] = item.statistics['totalsize']
      // Object.keys(item.statistics).map(item2 => {
      //   stat[titleArr[item2]] = item.statistics[item2]
      // })
      arr = arr.concat(item.tasks)
      console.log('arr', arr)
      arr.push(stat)
    })

    console.log(arr)
    this.run = arr
    // this.runReport = Object.keys(arr[0])
  },
  methods: {
    // 点击详情查看展示行详细内容
     handleEdit(index, row) {
       this.$refs.updataReport.reportDetail(index,row)
        console.log(index, row);
      },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log('row', row)
      // console.log(columnIndex)
      if (row['总备份数据量']) {
        if (columnIndex === 0) return [1, 9]
        return [0, 0]
      }
      // if(row['总备份数据量'] && columnIndex === 0) return [1, 8];

      // return [1, 2];
    },

    // 查询设备报表返回数据
    callbackDevice: function(deviceObj) {
      // console.log("设备报表数据",deviceObj)
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
          type: deviceObj.data[i].type
        })
        this.device = array
      }
    },
    // 查询介质报表返回数据
    callbackMedium: function(mediumObj) {
      // console.log("介质报表数据",mediumObj)
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
          used: mediumObj.data[i].used
        })
        this.medium = array
      }
    },
    // 点击行数据
    rowData: function(rows) {
      console.log('rows', rows)
    },
    // 得到选中的时间区域
    time: function(times) {
      console.log('times', times)
      this.getTime = times
    },
    // 点击行获得点击行数据
    tableRowClassName(row) {
      console.log("row",row)
        // if (rowIndex === 1) {
        //   return 'warning-row';
        // } else if (rowIndex === 3) {
        //   return 'success-row';
        // }
        // return '';
    },
    clickRow(row){
            this.$refs.moviesTable.toggleRowSelection(row)
            } 
  }
}
</script>
