<template>
    <Tabs class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;" type="card">
        <!-- 介质服务器 -->
        <TabPane label="介质服务器">
            <Table stripe highlight-row :data="medium" :columns="mediums" @on-current-change="putData"></Table>

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
            <Table stripe highlight-row :data="disk" :columns="disks" @on-current-change="diskData"></Table>
            
            <div class="btn">
                <Button type="info" @click="newDisk">新建磁盘</Button>
                <Button type="info" @click="delDisk">删除磁盘</Button>
                <Button type="info" @click="modifyDisk">修改磁盘</Button>
                <diskModal ref="diskModal"  @diskReturn="diskReturn"></diskModal>
                <updateDisk :modalDisk="modalDisk" ref="updateDisk" @listModify="listModify"></updateDisk>
            </div>
        </TabPane>

        <!-- 磁带库 -->
        <TabPane label="磁带库">
            <Table :columns="tapes" :data="tape"></Table>
            
            <div class="btn">
                <Button type="info" @click="newLibrary">新建磁带库</Button>
                <Button type="info">删除磁带库</Button>
                <Button type="info" @click="updateLibrary">修改磁带库</Button>
                <libraryModal></libraryModal>
                <updateLibrary :modal="modalLibrary" @close="closeLibrary"></updateLibrary>
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
  // provide(){
  //     return{
  //         getmediumInfo:this.getmediumInfo
  //     }
  // },
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
        { title: '类型', key: 'machine' },
        { title: 'IP地址', key: 'addr' },
        { title: '操作系统', key: 'os' },
        { title: '软件版本', key: 'Version' },
        { title: '状态', key: 'status' }
      ],
      disks: [
        { title: '名称', key: 'name' },
        { title: '设备路径', key: 'path' },
        { title: '介质服务器', key: 'server' },
        { title: '存储容量', key: 'enable' },
        { title: '状态', key: 'type' }
      ],
      tapes: [
        { title: '名称', key: 'name' },
        { title: '介质服务器', key: 'server' },
        { title: '设备序列号', key: 'serialNumber' },
        { title: '槽位数', key: 'slotNumber' },
        { title: '驱动器数量', key: 'number' },
        { title: '状态', key: 'state' }
      ],
      medium: [],
      disk: [],
      tape: [],
      putDatas: {},
      modalDisk: {},
      modalLibrary: false,
    }
  },

  created() {
    // 获取介质信息
    util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    // 获取磁盘信息
    util.restfullCall('/rest-ful/v3.0/devices?type=0', null, 'get', this.diskdata)    
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
          name: diskobj.data[i].name,
          id: diskobj.data[i].id,
          server: diskobj.data[i].server,
          servername: diskobj.data[i].servername,
          enable: diskobj.data[i].enable,
          type: diskobj.data[i].type,
        })
        this.disk = array
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
      console.log("aaa",listDisk)
      this.disk.forEach(item => {
        if (item.id === listDisk.id) item.name=listDisk.name
      })
    },
    newLibrary: function() {
      this.$store.commit('getModalLibrary', true)
    },

    newLibrary: function() {
      this.$store.commit('getModalLibrary', true)
    },

    updateLibrary: function() {
      this.modalLibrary = true
    },

    closeLibrary: function(modal) {
      this.modalLibrary = modal
    }
    // getmediumInfo:function(){
    //     console.log("我重新被调用了");
    //     util.restfullCall('/rest-ful/v3.0/mediaservers',null,'get',this.senddata);
    // }，
    // getdiskInfo:function(){

    // }
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
</style>
