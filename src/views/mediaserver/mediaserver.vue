<template>
 <Tabs :animated="false" class="media" v-model="tabsData" @on-click="tabName" type="card">
    <!-- 介质服务器 -->
    <TabPane label="介质服务器" v-if="nowShow(getPower.seeMediaServer)" name="介质服务器" :key="Math.random()">
      <Table
        stripe
        highlight-row
        :row-class-name="rowMedium"
        :data="medium"
        :columns="mediums"  
        height="720"
      ></Table>
      <div class="btn">
        <Button type="info" @click="newServer"   v-if="nowShow(getPower.addMediaServer)" >新建介质服务器</Button>
        <!-- <Button type="info" @click="providerServer">修改介质服务器</Button> -->
        <serverModal :selServiceList="selServiceList" ref="serverModal" @Return="Return"></serverModal>
        <updateServer ref="updateServer" @toogleMedium="toogleMedium"></updateServer>
      </div>
    </TabPane>
    <!-- 磁盘 -->
    <TabPane label="磁盘设备"   v-if="nowShowTow(getPower.seeDiskDevice)"  name="磁盘设备" :key="Math.random()">
      <Table
        stripe
        highlight-row
        :data="disk"
        :row-class-name="rowDisks"
        :columns="disks"
        height="720"
      ></Table>

      <div class="btn">
        <Button type="info" @click="newDisk"  v-if="nowShowTow(getPower.newDiskDevice)">新建磁盘</Button>
        <!-- <Button type="info" @click="modifyDisk">修改磁盘</Button> -->
        <diskModal ref="diskModal" @diskReturn="diskReturn"></diskModal>
        <updateDisk ref="updateDisk" @listModify="listModify" ></updateDisk>
      </div>
    </TabPane>
    <!-- 磁带库 -->
    <TabPane label="磁带库设备" name="磁带库设备" :key="Math.random()">
      <Table
        stripe
        highlight-row
        :data="tape"
        :row-class-name="rowTape"
        :columns="tapes"
        @on-current-change="librayData" 
        height="720"
      ></Table>

      <div class="btn">
        <Button type="info" @click="newLibrary">新建磁带库</Button>
        <!-- <Button type="info" @click="modifyLibrary">修改磁带库</Button> -->
        <libraryModal ref="libraryModal" @libraryReturn="libraryReturn"></libraryModal>
        <updateLibrary :modalLibrary="modalLibrary" ref="updateLibrary"></updateLibrary>
      </div>
    </TabPane>
  </Tabs>
</template>
<script>
import util from "../../libs/util.js";
import axios from "axios";

// 介质服务器模块
import serverModal from "./serverModal.vue";
// 修改介质服务器模块
import updateServer from "./updateServer.vue";
// 磁盘模块
import diskModal from "./diskModal.vue";
// 修改磁盘模块
import updateDisk from "./updateDisk.vue";
// 磁带库模块
import libraryModal from "./libraryModal.vue";
// 磁带库模块
import updateLibrary from "./updateLibrary.vue";

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
      numNowList: [],
      numNowListTow:[],
      showA:true,
      showB:true,
      tabsData:'磁带库设备',
      mediums: [
        { title: "名称", key: "name" },
        { title: "设备数量", key: "devices" },
        { title: "机器名称", key: "machine" },
        { title: "IP地址", key: "addr" },
        { title: "操作系统", key: "os" },
        { title: "软件版本", key: "version" },
        { title: "状态", key: "status" },
        {
          title: "操作",
          key: "operation",
          align: "center",
          render: (h, params) => {
            return h("div", [
              // 修改介质服务器弹框
              h("Icon", {
                props: {
                  type: "ios-chatboxes",
                  size: "20"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.$refs.updateServer.showMoad2(params.row);
                  }
                }
              }),
              // 删除介质服务器
              this.nowShow(this.getPower.deleteMediaserver)?h("Icon", {
                props: {
                  type: "ios-close",
                  size: "20"
                },
                on: {
                  click: () => {
                    if (confirm("确认删除数据")) {
                      util.restfullCall(
                        "/rest-ful/v3.0/mediaserver/" + params.row.id,
                        null,
                        "DELETE",
                        this.delCallback
                      );
                    }
                  }
                }
              }):''
            ]);
          }
        }
      ],
      disks: [
        { title: "名称", key: "name" },
        { title: "设备路径", key: "path" },
        { title: "介质服务器", key: "servername" },
        { title: "存储容量", key: "filesize" },
        { title: "状态", key: "status" },
        {
          title: "操作",
          key: "operation",
          align: "center",
          render: (h, params) => {
            return h("div", [
              // 修改磁盘弹框
              this.nowShowTow(this.getPower.editDiskDevice)? h("Icon", {
                props: {
                  type: "ios-chatboxes",
                  size: "20"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.$refs.updateDisk.showModify(params.row);
                  }
                }
              }):'',
              // 删除磁盘弹框
             this.nowShowTow(this.getPower.deleteDiskDevice)? h("Icon", {
                props: {
                  type: "ios-close",
                  size: "20"
                },
                on: {
                  click: () => {
                    if (confirm("确认删除数据")) {
                      util.restfullCall(
                        "/rest-ful/v3.0/device/" + params.row.id,
                        null,
                        "DELETE",
                        this.deldisks
                      );
                    }
                  }
                }
              }):''
            ]);
          }
        }
      ],
      tapes: [
        { title: "名称", key: "name" },
        { title: "介质服务器", key: "servername" },
        { title: "设备序列号", key: "serialno" },
        { title: "槽位数", key: "slots" },
        { title: "驱动器数量", key: "drivers" },
        { title: "状态", key: "status" },
        {
          title: "操作",
          key: "operation",
          align: "center",
          render: (h, params) => {
            return h("div", [
              // 磁带库详情弹框
              h("Icon", {
                props: {
                  type: "gear-b",
                  size: "20"
                },
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => {
                    this.$refs.updateLibrary.livrayModify(params.row);
                  }
                }
              }),
              // 删除磁带库弹框
              h("Icon", {
                props: {
                  type: "ios-close",
                  size: "20"
                },
                on: {
                  click: () => {
                    if (confirm("确认删除数据")) {
                      util.restfullCall(
                        "/rest-ful/v3.0/device/" + params.row.id,
                        null,
                        "DELETE",
                        this.delLibrarys
                      );
                    }
                  }
                }
              })
            ]);
          }
        }
      ],
      medium: [],
      disk: [],
      tape: [],
      modalLibrary: {},
      selServiceList: []
    };
  },

  created() {
    this.$store.dispatch("getPrivilege", this.$store.state.power.module.mediaServer);
    this.$store.dispatch("getPrivilegeTow", this.$store.state.power.module.diskDevice);
    // 获取介质信息
    util.restfullCall(
      "/rest-ful/v3.0/mediaservers",
      null,
      "get",
      this.senddata
    );
    // 获取磁盘信息
    util.restfullCall(
      "/rest-ful/v3.0/devices?type=0",
      null,
      "get",
      this.diskdata
    );
    //获取磁带库信息
    util.restfullCall(
      "/rest-ful/v3.0/devices?type=1",
      null,
      "get",
      this.tapesdata
    );
  },
  computed: {
    getPrivilege() {
      return this.$store.state.index.privilegeData;
    },
      getPrivilegeTow() {
      return this.$store.state.index.privilegeDataTow;
    },
    getPower(){
      return this.$store.state.power.name
    },
    
  },
  watch: {
    getPrivilege(data) {
      this.numNowList = data;
      if (this.numNowList.indexOf(this.getPower.seeMediaServer) != -1) {
          this.tabsData="介质服务器"  
      }
      if ((this.numNowList.indexOf(this.getPower.seeMediaServer) != -1)&&(this.getPrivilegeTow.indexOf(this.getPower.seeDiskDevice) != -1)) {
          this.tabsData="介质服务器"
          console.log("1111")
      }
    },
      getPrivilegeTow(data){
      this.numNowListTow=data
          if (this.numNowListTow.indexOf(this.getPower.seeDiskDevice) != -1) {
          this.tabsData="磁盘设备"
      }
       if ((this.numNowList.indexOf(this.getPower.seeMediaServer) != -1)&&(this.getPrivilegeTow.indexOf(this.getPower.seeDiskDevice) != -1)) {
          this.tabsData="介质服务器"
          console.log("2222")

      }
    }
  },
  methods: {
    tabName(name){
 this.tabsData=name
    },
    nowShow(num) {
      if (this.numNowList.indexOf(num) != -1) {
        return true;
      } else {
        return false;
      }
    },
    nowShowTow(num) {
      if (this.numNowListTow.indexOf(num) != -1) {
        return true;
      } else {
        return false;
      }
    },
    // 查询成功的介质服务器表
    senddata: function(obj) {
      var array = new Array();
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          name: obj.data[i].name,
          id: obj.data[i].id,
          machine: obj.data[i].machine,
          os: obj.data[i].os,
          addr: obj.data[i].addr,
          status: obj.data[i].status,
          version: this.filter(obj.data[i].version),
          devices: obj.data[i].devices
        });
      }
      this.medium = array;
    },
    // 查询添加成功的磁盘表
    diskdata: function(diskobj) {
      var array = new Array();
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
          lowlimit: diskobj.data[i].lowlimit
        });
      }
      this.disk = array;
    },
    // 查询添加成功的磁带库表
    tapesdata: function(typeobj) {
      var array = new Array();
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
          changer: typeobj.data[i].changer
        });
        this.tape = array;
      }
    },
    // 介质服务器部分代码
    // 软件版本号转换
    filter: function(versions) {
      let v0 = (versions & 0xff000000) >> 24;
      v0 = v0.toString();
      let v1 = (versions & 0xff0000) >> 16;
      v1 = v1.toString();
      let v2 = (versions & 0xff00) >> 8;
      v2 = v2.toString();
      let v3 = versions & 0xff;
      v3 = v3.toString();
      let str = v0 + "." + v1 + "." + v2 + "." + v3;
      return str;
    },
    // 点击新建介质服务器触发事件
    newServer: function() {
      util.restfullCall(
        "/rest-ful/v3.0/vrtsserver?type=2",
        null,
        "get",
        this.goback
      );
      // this.$refs.serverModal.showMoadl()
    },
    // 新建介质服务器回调
    goback: function(obj) {
      var array = new Array();
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          id: obj.data[i].id,
          machine: obj.data[i].machine
        });
      }
      this.selServiceList = array;
      this.$nextTick(() => {
        this.$refs.serverModal.showMoadl();
      });
    },
    // 接收添加成功的介质服务器数据并附给介质表
    Return(datas) {
      this.medium = datas;
    },
    // 修改介质服务器成功之后数据接收
    toogleMedium(data) {
      this.medium.forEach(item => {
        if (item.id === data.id) item.name = data.name;
      });
    },
    // 删除介质服务器回调判断
    delCallback(callback) {
      if (callback.data.code === 0)
        util.restfullCall(
          "/rest-ful/v3.0/mediaservers",
          null,
          "get",
          this.senddata
        );
    },

    // 磁盘部分的代码
    // 点击创建磁盘触发事件
    newDisk: function() {
      this.$refs.diskModal.newDisks();
    },
    //接收添加成功的数据并附给磁盘表
    diskReturn(diskdatas) {
      this.disk = diskdatas;
      util.restfullCall(
        "/rest-ful/v3.0/mediaservers",
        null,
        "get",
        this.senddata
      );
    },
    // 删除磁盘成功之后的回调判断
    deldisks(calback) {
      if (calback.data.code === 0)
        util.restfullCall(
          "/rest-ful/v3.0/devices?type=0",
          null,
          "get",
          this.diskdata
        );
      util.restfullCall(
        "/rest-ful/v3.0/mediaservers",
        null,
        "get",
        this.senddata
      );
    },
    // 修改磁盘成功的回调接收
    listModify(listDisk) {
      this.disk = listDisk;
    },
    // 磁带库部分代码
    // 点击创建磁带库
    newLibrary: function() {
      // this.$store.commit('getModalLibrary', true)
      this.$refs.libraryModal.newLibrarys();
    },
    // 接收添加成功的磁带库信息赋值给磁带库表
    libraryReturn(librardata) {
      util.restfullCall(
        "/rest-ful/v3.0/devices?type=" + librardata.type,
        null,
        "get",
        this.tapesdata
      );
    },
    // 选中点击的磁带库数据
    librayData: function(livrayRow) {
      this.modalLibrary = livrayRow;
    },
    // 删除磁带库成功之后的回调判断
    delLibrarys(librarys) {
      if (librarys.data.code === 0)
        util.restfullCall(
          "/rest-ful/v3.0/devices?type=1",
          null,
          "get",
          this.tapesdata
        );
    },
    // 行内容
    rowMedium(row, index) {
      if (row.status === "离线") {
        return "error";
      }
    },
    rowDisks(row, index) {
      if (row.status === "离线") {
        return "error";
      }
    },
    rowTape(row, index) {
      if (row.status === "离线") {
        return "error";
      }
    }
  }
};
</script>


<style scoped>
.media .btn {
  margin-top: 15px;
}
.ivu-table .error td {
  background-color: rgb(201, 80, 50) !important;
}
</style>
