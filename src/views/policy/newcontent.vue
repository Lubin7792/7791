  <style>
@import "./newcontent.css";
</style>

<template>
  <div class="newconten">
    <div v-show="show === '基本信息'" class="basicinfo">
      <Form ref="basic" :model="basic" :label-width="120">
        <FormItem label="策略名称">
          <Input v-model="basic.name"></Input>
        </FormItem>
        <FormItem label="策略类型">
          <Select
            v-model="basic.type"
            style="width:160px"
            @on-change="alick"
            :label-in-value="true"
          >
            <Option v-for="item in policyTyep" :label="item.name" :value="item.key" :key="item.key"></Option>
          </Select>
        </FormItem>
        <FormItem label="储存设备">
          <Select style="width:200px" v-model="basic.deviceval" @on-change="showNow">
            <Option
              v-for="item in this.devicesList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="介质池">
          <Select style="width:200px" v-model="basic.poolval" @on-change="showNow">
            <Option v-for="item in basic.pool" :label="item.name" :value="item.id" :key="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="优先级">
          <Select style="width:200px" v-model="basic.privilegekey" @on-change="showNow">
            <Option
              v-for="item in basic.privilege"
              :label="item.Name"
              :value="item.Level"
              :key="item.Level"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="策略最大调度任务">
          <Input v-model="basic.maxtasks"></Input>
        </FormItem>
        <FormItem label="启用压缩" class="h30">
          <CheckboxGroup v-model="basic.compress">
            <Checkbox label></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="启用加密" class="h30">
          <CheckboxGroup v-model="basic.encryption">
            <Checkbox label></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="加密算法">
          <Input v-model="basic.algorithm"></Input>
        </FormItem>
        <FormItem label="数据保留周期">
          <Input v-model="basic.savedays"></Input>
        </FormItem>
      </Form>
      <div style="display:none">{{ lconten }}</div>
    </div>
    <div v-show="show === '备份资源列表'">
      <div id="areaTree">
        <div class="box-title">
          <span>列表</span>
        </div>
        <div class="tree-box">
          <div class="zTreeDemoBackground left">
            <ul id="treeDemoA" class="ztree"></ul>
          </div>
        </div>
        <div class="tree-conten">
          <Table border ref="selection" :columns="columns4" :data="pathConten"></Table>
        </div>
      </div>
    </div>
    <div v-show="show === '备份选项'">
      <backupoption :show2="policyTypekey" v-if="hackReset" ref="backupOption"></backupoption>
    </div>
    <div v-show="show === '调度计划'" class="planinfo">
      <Form ref="schedule" :model="schedule" :label-width="80">
        <FormItem label="调度类型">
          <Select style="width:120px" @on-change="onplantype" v-model="schedule.typelevel">
            <Option
              v-for="item in schedule.type"
              :label="item.value"
              :value="item.level"
              :key="item.value"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="备份类型">
          <Select style="width:120px" v-model="schedule.backuptlevel">
            <Option
              v-for="item in schedule.backuptype"
              :label="item.value"
              :value="item.level"
              :key="item.value"
            ></Option>
          </Select>
        </FormItem>
        <div v-if="show3 == '0'" class="block250">
          <FormItem label="开始日期" class="plandate">
            <Select v-model="schedule.startday" style="width:120px" @on-change="showNows">
              <Option
                v-for="item in schedule.dayList"
                :value="item.value"
                :key="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="show3 == '1'" class="block250">
          <FormItem label="开始周" class="plandate">
            <Select v-model="schedule.startday" style="width:120px" @on-change="showNows">
              <Option
                v-for="item in schedule.weekList"
                :value="item.value"
                :key="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="show3 == '2'" class="block250">
          <FormItem label="开始日期" class="plandate">
            <DatePicker
              :value="schedule.startday"
              type="date"
              format="dd"
              show-week-numbers
              placement="bottom-end"
              placeholder="Select date"
              @on-change="startDate"
            ></DatePicker>
          </FormItem>
        </div>

        <FormItem label="开始时间" width="100px">
          <TimePicker
            :value="schedule.starttime"
            format="HH:mm:ss"
            placeholder="Select time"
            style="width: 168px"
            @on-change="startTime"
          ></TimePicker>
        </FormItem>
        <div v-if="show3 == '0'" class="block250">
          <FormItem label="结束日期" class="plandate">
            <Select v-model="schedule.endday" style="width:120px" @on-change="showNows">
              <Option
                v-for="item in schedule.dayList"
                :value="item.value"
                :label="item.name"
                :key="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="show3 == '1'" class="block250">
          <FormItem label="结束周" class="plandate">
            <Select v-model="schedule.endday" style="width:120px" @on-change="showNows">
              <Option
                v-for="item in schedule.weekList"
                :value="item.value"
                :key="item.name"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="show3 == '2'" class="block250">
          <FormItem label="结束日期" class="plandate">
            <DatePicker
              :value="schedule.endday"
              type="date"
              format="dd"
              show-week-numbers
              placement="bottom-end"
              placeholder="Select date"
              @on-change="endDate"
            ></DatePicker>
          </FormItem>
        </div>
        <FormItem label="结束时间" width="100px">
          <TimePicker
            :value="schedule.endtime"
            format="HH:mm:ss"
            @on-change="endTime"
            placeholder="Select time"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <FormItem label="间隔类型" style="width:100%">
          <Select
            style="width:150px"
            :label-in-value="true"
            @on-change="planShow"
            v-model="schedule.freqtypelevel"
          >
            <Option
              v-for="item in schedule.freqtype"
              :label="item.value"
              :value="item.level"
              :key="item.value"
            ></Option>
          </Select>
          <Input v-model="schedule.intervalTime" placeholder="输入时间" style="width: 100px"></Input>
          <span>{{ schedule.freqval }}</span>
        </FormItem>
        <div class="button">
          <Button type="warning" @click="addPlan">添加计划</Button>
          <Button type="warning" @click="revisePlan">保存修改</Button>
          <Button type="warning" @click="deletePlan">删除计划</Button>
        </div>
        <div class="planlist">
          <Table
            highlight-row
            border
            :columns="planlist"
            @on-row-click="planListIndex"
            :data="schedule.planList"
          ></Table>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import util from "../../libs/util.js";
import backupoption from "./backupoption";
export default {
  props: {
    show: {
      type: String
    },
    model1: {
      type: [String, Object]
    }
  },
  components: {
    backupoption
  },
  // beforeUpdate() {
  //   //回填
  //   this.basic.type = this.basicty;
  // },
  data() {
    return {
      setting: {
        check: {
          enable: true
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        }
      },
      treeNodeA: {},
      treeId: "",
      hackReset: true,
      policyTypekey: "65536",
      ztreeTyep: "",
      ztreeObj: {},
      pathConten: [],
      pathContens: [],
      checkType: false,
      columns4: [
        {
          title: "已选地址",
          key: "path"
        }
      ],
      treedata: [
        {
          title: "客户端列表",
          loading: "false",
          children: []
        }
      ],
      planlist: [
        {
          title: "调度类型",
          key: "typelevelCh"
        },
        {
          title: "备份类型",
          key: "backupCh"
        },
        {
          title: "开始时间",
          key: "starttime"
        },
        {
          title: "结束时间",
          key: "endtime"
        },
        {
          title: "间隔时间",
          key: "freqval"
        }
      ],

      show3: "0",
      basic: {
        type: "65536",
        name: "",
        deviceval:'',
        poolval: 2,
        pool: [
          {
            id: 1,
            name: "空白介质池",
            type: 0,
            Cover: 0,
            Protected: 0
          },
          {
            id: 2,
            name: "默认介质池",
            type: 1,
            Cover: 30,
            Protected: 30
          },
          {
            id: 3,
            name: "归档介质池",
            type: 4,
            Cover: 0,
            Protected: 0
          },
          {
            id: 4,
            name: "CATALOG介质池",
            type: 4,
            Cover: 90,
            Protected: 90
          }
        ],
        privilegekey:1,
        privilege: [
          {
            Level: 1,
            Name: "低优先级"
          },
          {
            Level: 2,
            Name: "中等优先级"
          },
          {
            Level: 3,
            Name: "高优先级"
          }
        ],
        maxtasks: "5",
        compress: [],
        encryption: [],
        algorithm: "",
        savedays: "30"
      },
      schedule: {
        typelevel: 0,
        dayList: [
          { name: "1号", value: "1" },
          { name: "2号", value: "2" },
          { name: "3号", value: "3" },
          { name: "4号", value: "4" },
          { name: "5号", value: "5" },
          { name: "6号", value: "6" },
          { name: "7号", value: "7" },
          { name: "8号", value: "8" },
          { name: "9号", value: "9" },
          { name: "10号", value: "10" },
          { name: "11号", value: "11" },
          { name: "12号", value: "12" },
          { name: "13号", value: "13" },
          { name: "14号", value: "14" },
          { name: "15号", value: "15" },
          { name: "16号", value: "16" },
          { name: "17号", value: "17" },
          { name: "18号", value: "18" },
          { name: "19号", value: "19" },
          { name: "20号", value: "20" },
          { name: "21号", value: "21" },
          { name: "22号", value: "22" },
          { name: "23号", value: "23" },
          { name: "24号", value: "24" },
          { name: "25号", value: "25" },
          { name: "26号", value: "26" },
          { name: "27号", value: "27" },
          { name: "28号", value: "28" },
          { name: "29号", value: "29" },
          { name: "30号", value: "30" },
          { name: "31号", value: "31" }
        ],
        weekList: [
          { value: "1", name: "周一" },
          { value: "2", name: "周二" },
          { value: "3", name: "周三" },
          { value: "4", name: "周四" },
          { value: "5", name: "周五" },
          { value: "6", name: "周六" },
          { value: "7", name: "周日" }
        ],
        type: [
          {
            value: "日期",
            level: 0
          },
          {
            value: "周",
            level: 1
          },
          {
            value: "时间间隔",
            level: 2
          }
        ],
        freqtypelevel: "",
        freqtype: [
          {
            value: "小时",
            level: 0
          },
          {
            value: "分钟",
            level: 1
          }
        ],
        freqval: "",
        backuptlevel: "",
        backuptype: [
          {
            value: "全备",
            level: 1
          },
          {
            value: "增量",
            level: 2
          },
          {
            value: "差量",
            level: 3
          }
        ],
        intervalTime: "",
        timeType: "",
        list: [],
        startday: "",
        starttime: "",
        endday: "",
        endtime: "",
        planList: [],
        planListIndex: "",
        addLists: {}
      },
      resources: {
        equipment: "",
        clientId: "",
        pathValue: ""
      },
      columns12: [
        {
          title: "机器名",
          key: "machine"
        },
        {
          title: "操作系统类型",
          key: "systemType"
        },
        {
          title: "IP地址",
          key: "ip"
        },
        {
          title: "软件版本号",
          key: "softwareVersion"
        }
      ]
    };
  },
  computed: {
    hackOne() {
      return this.policyTypekey;
    },
    policyTyep() {
      return this.$store.state.index.policyType;
    },
    devicesList() {
      return this.$store.state.index.devicesList;
    },
    lconten() {
      let data1 = [];
      data1 = this.$store.state.index.policyData;
      const array = [];
      for (let i = 0; i < data1.length; i++) {
        let item = data1[i];
        array.push(
          (item = {
            id: item.id,
            iconSkin: "client",
            name: item.machine,
            nocheck: true,
            nodetype: 0
          })
        );
      }
      $.fn.zTree.init($("#treeDemoA"), this.setting, array);
    }
  },
  watch: {
    policyTyep:function (data) {
      this.basic.type=data[0].key
    },
     devicesList:function (data) {
      this.basic.deviceval=data[0].id
    },
    hackOne: function(type) {
      if (type == 131072) {
        this.$refs.backupOption.setOptins(14, 0);
      }
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
      if (type == 196608) {
        this.$parent.$parent.delTabList();
      } else {
        this.$parent.$parent.addTabList();
      }
    }
  },
  methods: {
    planListIndex: function(value, index) {
      this.show3 = value.scheduletype.toString();
      console.log(value, this.show3);
      (this.schedule.startday = ""),
        (this.schedule.endday = ""),
        (this.schedule.planListIndex = index);
      this.schedule.typelevel = value.scheduletype;
      this.schedule.backuptlevel = value.backuptype;
      this.schedule.freqtypelevel = value.freqtype;
      this.schedule.intervalTime = value.freqval;
      this.$nextTick(() => {
        this.schedule.startday = value.startday.toString();
        this.schedule.endday = value.endday.toString();
      });
      this.schedule.starttime = value.starttime;
      this.schedule.endtime = value.endtime;
    },
    addList: function() {
      let typelevelNum = parseInt(
        this.schedule.typelevel ? this.schedule.typelevel : 0
      );
      let backupNum = parseInt(
        this.schedule.backuptlevel ? this.schedule.backuptlevel : 0
      );
      let addList = {
        backuptype: backupNum,
        scheduletype: typelevelNum,
        freqtype: parseInt(
          this.schedule.freqtypelevel ? this.schedule.freqtypelevel : 0
        ),
        freqval: parseInt(
          this.schedule.intervalTime ? this.schedule.intervalTime : 0
        ),
        // startday: parseInt(this.schedule.startday.replace(/'/g, "")),
        startday: parseInt(this.schedule.startday),
        starttime: this.schedule.starttime,
        endday: parseInt(this.schedule.endday),
        endtime: this.schedule.endtime,
        typelevelCh:
          typelevelNum == 0 ? "日期" : typelevelNum == 1 ? "周" : "间隔时间",
        backupCh: backupNum == 1 ? "全备" : backupNum == 2 ? "增量" : "差量",
        duration: 0
      };
      this.schedule.addLists = addList;
    },
    addPlan: function() {
      this.addList();
      this.schedule.planList.push(this.schedule.addLists);
    },
    revisePlan: function() {
      this.addList();
      this.schedule.planList.splice(
        this.schedule.planListIndex,
        1,
        this.schedule.addLists
      );
    },
    deletePlan: function() {
      // let array =  this.schedule.planList
      this.schedule.planList.splice(this.schedule.planListIndex, 1);
      // this.schedule.planList= array
    },
    showOptions() {},
    startDate: function(value) {
      this.schedule.startday = value;
    },
    startTime: function(value) {
      this.schedule.starttime = value;
    },
    endDate: function(value) {
      this.schedule.endday = value;
    },
    endTime: function(value) {
      this.schedule.endtime = value;
    },
    planShow: function(value) {
      let test = value;
      this.schedule.freqval = test.label;
    },
    showNow: function() {},
    showNows: function(value) {},
    policypost: function() {
      let tests = {
        base: {
          name: this.basic.name,
          type: this.basic.type,
          privilege: parseInt(
            this.basic.privilegekey ? this.basic.privilegekey : 0
          ),
          pool: parseInt(this.basic.poolval ? this.basic.poolval : 0),
          device: parseInt(this.basic.deviceval ? this.basic.deviceval : 0),
          savedays: parseInt(this.basic.savedays ? this.basic.savedays : 0),
          maxtasks: parseInt(this.basic.maxtasks ? this.basic.maxtasks : 0)
        },
        resource: this.pathContens,
        option: this.$refs.backupOption.showOption(),
        schedule: this.schedule.planList
      };
      console.log(tests);
      util.restfullCall("/rest-ful/v3.0/policy", tests, "post", this.senddata);
    },
    senddata: function(value) {
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.index.policySwitch);
        alert(value.data.message);
      } else {
        alert(value.data.message);
      }
    },
    alick: function(value) {
      this.basic.type = value.value;
      this.policyTypekey = String(value.value);
    },
    timeFormate: function() {
      let date =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mm =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getMinutes() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      this.schedule.startday = "'" + date + "'";
      this.schedule.starttime = hh + ":" + mm + ":" + ss;
    },
    onplantype: function(value) {
      this.show3 = value;
      // console.log( this.schedule.startday, this.schedule.endtday,"1")
      this.$nextTick(() => {
        this.schedule.startday = "";
        this.schedule.endday = "";
      });
      // this.timeFormate();
    },
    build_path_by_tree_node: function(treeNode) {
      //获取路径
      let path = "";
      let cid = 0;
      do {
        let parent = treeNode.getParentNode();
        if (!parent) {
          cid = treeNode.id;
          name = treeNode.name;
          break;
        }

     
       if (parent.nodetype != 0) {
          path = "/" + treeNode.name + path;
        } else {
          path = treeNode.name + path;
        }
        if (parent.nodetype != 1) {
        }
        treeNode = parent;
      } while (true);



      /*
      var path = "";
      let name = "";
      let current_node = treeNode;
      let parent = treeNode.getParentNode();

      while (true) {
        parent = current_node.getParentNode();
        if (!parent) {
          name = current_node.name;
          break;
        }
        if (this.checkType) {
          path = "/" + path;
           path =current_node.name+path ;
          current_node = parent;
          console.log(path,current_node.name)
        }else{
          path = current_node.name + path;
          current_node = parent;

        }         
      }*/
      if(path.indexOf("//")==0){
         path=path.substr(1)
      }
      return { client: cid, path: path, name: name };
    },
    //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {

      if (typeof this.basic.type == "number") {
        if (!treeNode.hasOwnProperty("children")) {
          this.treeNodeA = treeNode;
          this.treeId = treeId;
          let typeId = treeNode.ResType ? treeNode.ResType : this.basic.type;
          let path = this.build_path_by_tree_node(treeNode);
          let str =
            "/rest-ful/v3.0/client/resource/browse?" +
            "client=" +
            path.client +
            "&type=" +
            typeId +
            "&path=" +
            path.path;
          util.restfullCall(str, null, "get", this.callData);
        }
      }
    },
    callData: function(obj) {
      let treeNode = this.treeNodeA;
      let treeId = this.treeId;
      //返回数据处理
      var arrays = new Array();
      // console.log( obj.data.resources)
      let objj = obj.data.resources;
      for (let i = 0; i < objj.length; i++) {
        arrays.push({
          ResType: objj[i].ResType,
          name: objj[i].Name,
          nodetype: 1
        });
      }
      let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
      ztreeobj.addNodes(treeNode, arrays);
      this.checkType = treeNode.ResType;
    },
    //选中节点
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.build_path_by_tree_node(treeNode);
      var pathList = path.name + "_" + path.path;
      if (treeNode.checked) {
        this.pathConten.push({ path:pathList});
        this.pathContens.push({ path: path.path, client: parseInt(path.client), type:treeNode.ResType,exclude:0});
      } else {
        function pathFilter(element){
          return element.path !==pathList;
        }
          function pathFilters(element){
          return element.path !==path.path;
        }
        this.pathConten= this.pathConten.filter(pathFilter)
        this.pathContens= this.pathContens.filter(pathFilters)
      }
      this.resources.clientId = path.client;
      this.ztreeTyep = treeNode.ResType;
      this.resources.pathValue = path.path;
    }
  }
};
</script>

<style>
#areaTree {
  border: 1px solid #e5e5e5;
  margin-bottom: 2px;
  border-radius: 4px;
  overflow: hidden;
}
.box-title {
  border-radius: 3px 3px 0 0;
  background-color: #f5f5f5;
}
.box-title a {
  color: #2fa4e7;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 8px 15px;
  cursor: pointer;
}
.box-title .fa {
  float: right;
  line-height: 20px;
}
</style>