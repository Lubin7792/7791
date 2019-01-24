<template>
    <Tabs :animated="false" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;" type="card">
        <!-- 介质服务器 -->
        <TabPane label="介质服务器">
            <Table stripe highlight-row :data="medium" :columns="mediums" @on-current-change="putData" height="620px"></Table>

            <div class="btn"> 
                <Button type="info" @click="newServer">新建介质服务器</Button>
                <Button type="info" @click="delServer">删除介质服务器</Button>
                <Button type="info" @click="providerServer">修改介质服务器</Button>
                <serverModal ref="serverModal" @Return="Return"></serverModal>
                <updateServer :putDatas="putDatas" ref="updateServer" @toogleMedium="toogleMedium"></updateServer>
            </div>
        </TabPane>

        <!-- 磁盘 -->
        <TabPane label="磁盘">
            <Table stripe highlight-row :data="disk" :columns="disks" @on-current-change="diskData" height="620px"></Table>
            
            <div class="btn">
                <Button type="info" @click="newDisk">新建磁盘</Button>
                <Button type="info" @click="delDisk">删除磁盘</Button>
                <Button type="info" @click="modifyDisk">修改磁盘</Button>
                <diskModal ref="diskModal" @diskReturn="diskReturn"></diskModal>
                <updateDisk :modalDisk="modalDisk" ref="updateDisk" @listModify="listModify"></updateDisk>
            </div>
        </TabPane>

        <!-- 磁带库 -->
        <TabPane label="磁带库">
            <Table stripe highlight-row :data="tape" :columns="tapes" @on-current-change="librayData" height="620px"></Table>
            
            <div class="btn">
                <Button type="info" @click="newLibrary">新建磁带库</Button>
                <Button type="info" @click="delLibrary">删除磁带库</Button>
                <!-- <Button type="info" @click="modifyLibrary">修改磁带库</Button> -->
                <libraryModal ref="libraryModal" @libraryReturn="libraryReturn"></libraryModal>
                <updateLibrary :modalLibrary="modalLibrary" ref="updateLibrary"></updateLibrary>
            </div>
        </TabPane>        
    </Tabs>
</template>

<script>
import util from '../../libs/util.js'
import axios from 'axios'

// 介质服务器模块
import serverModal from './serverModal.vue'
// 修改介质服务器模块
import updateServer from './updateServer.vue'
// 磁盘模块
import diskModal from './diskModal.vue'
// 修改磁盘模块
import updateDisk from './updateDisk.vue'
// 磁带库模块
import libraryModal from './libraryModal.vue'
// 磁带库模块
import updateLibrary from './updateLibrary.vue'

export default {
  components: {
    serverModal,
    diskModal,
    libraryModal,
    updateDisk,
    updateLibrary,
    updateServer
  },
  data() {
    return {
      mediums: [
        { title: '名称', key: 'name' },
        { title: '设备数量', key: 'devices' },
        { title: '机器名称', key: 'machine' },
        { title: 'IP地址', key: 'addr' },
        { title: '操作系统', key: 'os' },
        { title: '软件版本', key: 'Version' },
        { title: '状态', key: 'status' }
      ],
      disks: [
        { title: '名称', key: 'name' },
        { title: '设备路径', key: 'path' },
        { title: '介质服务器', key: 'servername' },
        { title: '存储容量', key: 'filesize' },
        { title: '状态', key: 'status' }
      ],
      tapes: [
        { title: '名称', key: 'name' },
        { title: '介质服务器', key: 'servername' },
        { title: '设备序列号', key: 'serialno' },
        { title: '槽位数', key: 'sltos' },
        { title: '驱动器数量', key: 'drivers' },
        { title: '状态', key: 'state' },
        {title: '操作',key: 'operation',align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                  props: {
                      type: 'gear-b',
                      size: '20'
                  },
                  on: {
                      click: () => {
                        console.log(params)
                        this.$refs.updateLibrary.livrayModify(params.row.changer, params.row.name)
                      }
                  }
              },),
            ]);
          }
        },
      ],
      medium: [],
      disk: [],
      tape: [],
      putDatas: {},
      modalDisk: {},
      modalLibrary: {},
    }
  },

  created() {
    // 获取介质信息
    util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    // 获取磁盘信息
    util.restfullCall('/rest-ful/v3.0/devices?type=0', null, 'get', this.diskdata)
    //获取磁带库信息
    util.restfullCall('/rest-ful/v3.0/devices?type=1', null, 'get', this.tapesdata)
  },

  methods: {
    // 查询成功的介质服务器表
    senddata: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          name: obj.data[i].name,
          id: obj.data[i].id,
          machine: obj.data[i].machine,
          os: obj.data[i].os,
          addr: obj.data[i].addr,
          status: obj.data[i].status,
          Version: obj.data[i].Version,
          devices: obj.data[i].devices
        })
      }
      this.medium = array
    },
    // 查询添加成功的磁盘表
    diskdata: function(diskobj) {
      var array = new Array()
      for (let i = 0; i < diskobj.data.length; i++) {
        array.push({
          id: diskobj.data[i].id,
          name: diskobj.data[i].name,
          type: diskobj.data[i].type,
          server: diskobj.data[i].server,
          servername: diskobj.data[i].servername,
          enable: diskobj.data[i].enable,
          status: diskobj.data[i].status,
          path: diskobj.data[i].path,
          filesize: diskobj.data[i].filesize,
          maxtasks: diskobj.data[i].maxtasks,
          lowlimit: diskobj.data[i].lowlimit,
        })
        this.disk = array
      }
    },
     // 查询添加成功的磁带库表
    tapesdata: function(typeobj) {
      var array = new Array()
      for (let i = 0; i < typeobj.data.length; i++) {
        array.push({
          name: typeobj.data[i].name,
          id: typeobj.data[i].id,
          server: typeobj.data[i].server,
          servername: typeobj.data[i].servername,
          vendor: typeobj.data[i].vendor,
          productid: typeobj.data[i].productid,
          status: typeobj.data[i].status,
          serialno: typeobj.data[i].serialno,
          drivers: typeobj.data[i].drivers,
          slots: typeobj.data[i].slots,
          changer: typeobj.data[i].changer,
        })
        this.tape = array
      }
    },
  // 介质服务器部分代码
    // 点击新建服务器触发事件
    newServer: function() {
      this.$refs.serverModal.showMoadl()
    },
    // 接收添加成功的数据并附给介质表
    Return(datas) {
      this.medium = datas
    },
    // 点击修改介质服务器
    providerServer: function() {
      this.$refs.updateServer.showMoad2()
    },
    // 选中行数据
    putData: function(currentRow) {
      this.putDatas = currentRow
    },
    // 修改成功之后数据接收
    toogleMedium(data) {
      this.medium.forEach(item => {
        if (item.id === data.id) item.name = data.name
      })
    },
    // 点击删除介质数据
    delServer: function() {
      if (confirm('确认删除数据')) { util.restfullCall( '/rest-ful/v3.0/mediaserver/' + this.putDatas.id, null, 'DELETE', this.delCallback) }
    },
    // 删除成功之后的回调判断
    delCallback(callback) {
      if (callback.data.code === 0)
        util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    },

  // 磁盘部分的代码
    // 点击创建磁盘触发事件
    newDisk: function() {
      this.$refs.diskModal.newDisks()
    },
    //接收添加成功的数据并附给磁盘表
    diskReturn(diskdatas) {
      util.restfullCall('/rest-ful/v3.0/devices?type='+diskdatas.type, null, 'get', this.diskdata)
    },
    // 选中行数据
    diskData: function(diskRow) {
      this.modalDisk = diskRow
    },
    // 删除磁盘
    delDisk:function() {
      if (confirm('确认删除数据')) { util.restfullCall( '/rest-ful/v3.0/device/' + this.modalDisk.id, null, 'DELETE', this.deldisks) }
    },
    // 删除磁盘成功之后的回调判断
    deldisks(calback) {
      if (calback.data.code === 0)
      util.restfullCall('/rest-ful/v3.0/devices?type=0', null, 'get', this.diskdata)   
    },
    // 点击修改磁盘
    modifyDisk: function() {
      this.$refs.updateDisk.showModify()
    },
    // 修改成功的回调接收
    listModify(listDisk) {
      this.disk.forEach(item => {
        if (item.id === listDisk.id) item.name=listDisk.name
      })
    },
  // 磁带库部分代码
    // 点击创建磁带库
    newLibrary: function() {
      // this.$store.commit('getModalLibrary', true)
      this.$refs.libraryModal.newLibrarys()
    },
    // 接收添加成功的磁带库信息赋值给磁带库表
    libraryReturn(librardata) {
      util.restfullCall('/rest-ful/v3.0/devices?type='+librardata.type, null, 'get', this.tapesdata)
    },
    // 选中点击的磁带库数据
    librayData:function(livrayRow) {
      this.modalLibrary = livrayRow
    },
    // 删除磁盘
    delLibrary:function() {
      if (confirm('确认删除数据')) { util.restfullCall( '/rest-ful/v3.0/device/' + this.modalLibrary.id, null, 'DELETE', this.delLibrarys) }
    },
    // 删除磁带库成功之后的回调判断
    delLibrarys(librarys) {
      if (librarys.data.code === 0)
      util.restfullCall('/rest-ful/v3.0/devices?type=1', null, 'get', this.tapesdata)   
    },
  }
}
</script>

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
</style>

<style scoped>
.btn {
  margin-top: 15px;
}
/* .ivu-tabs {
  height: 100%;
}
.ivu-tabs-no-animation>.ivu-tabs-content {
  height: 100%;
}
.ivu-tabs .ivu-tabs-tabpane {
  height: 100%;
}
.ivu-table-wrapper {
  height: 80%;
} */
</style>
