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
            disabled
            @on-change="alick"
            :label-in-value="true"
          >
            <Option v-for="item in policyTyep" :label="item.name" :value="item.key" :key="item.key"></Option>
          </Select>
        </FormItem>
        <FormItem label="储存设备">
          <Select style="width:200px" v-model="basic.device" @on-change="showNow" disabled>
            <Option v-for="item in devicesList" :label="item.name" :value="item.id" :key="item.id"></Option>
          </Select>
        </FormItem>
        <FormItem label="介质池">
          <Select style="width:200px" v-model="basic.pool" @on-change="showNow"  disabled>
            <Option
              v-for="item in policylist.pool"
              :label="item.name"
              :value="item.id"
              :key="item.name"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="优先级">
          <Select style="width:200px" v-model="basic.privilege" @on-change="showNow">
            <Option
              v-for="item in policylist.privilege"
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
          <CheckboxGroup v-model="temporary.compress">
            <Checkbox label></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="启用加密" class="h30">
          <CheckboxGroup v-model="temporary.encryption">
            <Checkbox label></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="加密算法">
          <Input v-model="temporary.algorithm"></Input>
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
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
        <div class="tree-conten">
          <Table border ref="selection" :columns="columns4" :data="pathConten"></Table>
        </div>
      </div>
    </div>
    <div v-show="show === '备份选项'">
      <backupoption :show2=" basic.type.toString()" v-if="hackReset" ref="backupOption"></backupoption>
    </div>
    <div v-show="show === '调度计划'" class="planinfo">
      <Form ref="schedule" :model="schedule" :label-width="80">
        <FormItem label="调度类型">
          <Select style="width:120px" @on-change="onplantype" v-model="schedule.scheduletype">
            <Option
              v-for="item in policylist.type"
              :label="item.value"
              :value="item.level"
              :key="item.value"
            ></Option>
          </Select>
        </FormItem>
        <FormItem label="备份类型">
          <Select style="width:120px" v-model="schedule.backupType">
            <Option
              v-for="item in policylist.backuptype"
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
                v-for="item in policylist.dayList"
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
                v-for="item in policylist.weekList"
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
                v-for="item in policylist.dayList"
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
                v-for="item in policylist.weekList"
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
            v-model="schedule.freqtype"
          >
            <Option
              v-for="item in policylist.freqtypes"
              :label="item.value"
              :value="item.level"
              :key="item.value"
            ></Option>
          </Select>
          <Input v-model="schedule.freqval" placeholder="输入时间" style="width: 100px"></Input>
          <span>{{ temporary.freqval }}</span>
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
            :data="temporary.planList"
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
      type: String,
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
  //   this.basictype = this.basicty;
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
      back: {},
      treeNodeA: {},
      treeId: "",
      hackReset: true,
      policyTypekey: "",
      ztreeTyep: "",
      ztreeObj: {},
      pathConten: [],
      checkType: false,
      columns4: [
        {
          title: "已选地址",
          key: "name"
        }
      ],
      treedata: [
        {
          title: "客户端列表",
          loading: "false",
          children: []
        }
      ],
      plan1: "",
      basictype: [null],
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
      policylist: {
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
        freqtypes: [
          {
            value: "小时",
            level: 0
          },
          {
            value: "分钟",
            level: 1
          }
        ]
      },
      show3: "0",
      temporary: {
        compress: [],
        encryption: [],
        algorithm: "",
        freqval: "",
        planList: [],
        planListIndex: "",
        addLists: {}
      },

      basic: {
        type:'',
        name: "",
        privilege: "",
        pool: "",
        device: "",
        maxtasks: "",
        savedays: ""
      },
      schedule: {
        scheduletype: 0,
        backupType: "",
        freqtype: "",
        freqval: "",
        startday: "",
        starttime: "",
        endday: "",
        endtime: ""
      },
      resources: {
        equipment: "",
        clientId: "",
        pathValue: ""
      }
    };
  },
  computed: {
    backData() {
      return this.$store.state.detailData;
    },
    // hackOne() {
    //   return this.policyTypekey;
    // },
    policyTyep() {
      return this.$store.state.policyType;
    },
    devicesList() {
      return this.$store.state.devicesList;
    },
    lconten() {
      let data1 = [];
      data1 = this.$store.state.policyData;
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
      $.fn.zTree.init($("#treeDemo"), this.setting, array);
    }
  },
  watch: {
    databack: function(newdata, olddata) {},
    backData: function(data) {
      this.$emit('setshow', '基本信息');
      this.basic = data.base;
      // this.schedule.scheduletype=0;
      // this.schedule.backupType='';
      // this.schedule.freqtype='';
      // this.schedule.freqval='';
      // this.schedule.startday='';
      // this.schedule.starttime='';
      // this.schedule.endday='';
      // this.schedule.endtime='';
      this.temporary.planList = data.schedule;
      for(let i =0;i<data.schedule.length;i++){
          this.temporary.planList[i].typelevelCh=data.schedule[i].scheduletype==0?"日期":data.schedule[i].scheduletype==1?"全备":"间隔时间";
            this.temporary.planList[i].backupCh=data.schedule[i].backupType==1?"全备":data.schedule[i].backupType==2?"增量":"差量"
      }
    },
    // hackOne: function(type) {
    //   if (type == 131072) {
    //     this.$refs.backupOption.setOptins(14, 0);
    //   }
    //   this.hackReset = false;
    //   this.$nextTick(() => {
    //     this.hackReset = true;
    //   });
      // if (type == 196608) {
      //   this.$parent.$parent.delTabList();
      // } else {
      //   this.$parent.$parent.addTabList();
      // }
    // }
  },
  methods: {
    planListIndex: function(value, index) {
      this.show3 = value.scheduletype.toString();
      this.schedule.startday = "",
        this.schedule.endday = "",
        this.temporary.planListIndex = index;
      this.schedule.scheduletype = value.scheduletype;
      this.schedule.backupType = value.backupType;
      this.schedule.freqtype = value.freqtype;
      this.schedule.freqval = value.freqval;
      this.$nextTick(() => {
        this.schedule.startday = value.startday.toString();
        this.schedule.endday = value.endday.toString();
      });
      this.schedule.starttime = value.starttime;
      this.schedule.endtime = value.endtime;
    },
    addList: function() {
      let typelevelNum = parseInt(
        this.schedule.scheduletype ? this.schedule.scheduletype : 0
      );
      let backupNum = parseInt(
        this.schedule.backupType ? this.schedule.backupType : 0
      );
      let addList = {
        backupType: backupNum,
        scheduletype: typelevelNum,
        freqtype: parseInt(this.schedule.freqtype ? this.schedule.freqtype : 0),
        freqval: parseInt(this.schedule.freqval ? this.schedule.freqval : 0),
        // startday: parseInt(this.schedule.startday.replace(/'/g, "")),
        startday: parseInt(this.schedule.startday),
        starttime: this.schedule.starttime,
        endday: parseInt(this.schedule.endday),
        endtime: this.schedule.endtime,
        typelevelCh:
          scheduletype == 0 ? "日期" : typelevelNum == 1 ? "周" : "间隔时间",
        backupCh: backupNum == 1 ? "全备" : backupNum == 2 ? "增量" : "差量",
        duration: 0
      };
      this.temporary.addLists = addList;
    },
    addPlan: function() {
      this.addList();
      this.temporary.planList.push(this.temporary.addLists);
    },
    revisePlan: function() {
      this.addList();
      this.temporary.planList.splice(
        this.temporary.planListIndex,
        1,
        this.temporary.addLists
      );
    },
    deletePlan: function() {
      // let array =  this.temporary.planList
      this.temporary.planList.splice(this.temporary.planListIndex, 1);
      // this.temporary.planList= array
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
      this.temporary.freqval = value.label;
    },
    showNow: function() {},
    showNows: function(value) {},
    policypost: function() {
      let tests = {
        base: {
          name: this.basic.name,
          type: this.basictype,
          privilege: parseInt(this.basic.privilege ? this.basic.privilege : 0),
          pool: parseInt(this.basic.pool ? this.basic.pool : 0),
          device: parseInt(this.basic.device ? this.basic.device : 0),
          savedays: parseInt(this.basic.savedays ? this.basic.savedays : 0),
          maxtasks: parseInt(this.basic.maxtasks ? this.basic.maxtasks : 0)
        },
        resource: [
          {
            client: parseInt(
              this.resources.clientId ? this.resources.clientId : 1
            ),
            type: parseInt(this.ztreeTyep),
            path: this.resources.pathValue,
            exclude: 0
          }
        ],
        option: this.$refs.backupOption.showOption(),
        schedule: this.temporary.planList
      };
      console.log(tests);
      util.restfullCall("/rest-ful/v3.0/policy", tests, "post", this.senddata);
    },
    senddata: function(value) {
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.policySwitch);
      } else {
        alert(value.data.message);
      }
    },
    alick: function(value) {
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
      return { client: cid, path: path, name: name };
    },
    //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {
      if (typeof( this.basictype) == "number") {
        if (!treeNode.hasOwnProperty("children")) {
          this.treeNodeA = treeNode;
          this.treeId = treeId;
          let typeId = treeNode.ResType ? treeNode.ResType : this.basictype;
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
      this.pathConten.push({ name: pathList });
      this.resources.clientId = path.client;
      this.ztreeTyep = treeNode.ResType;
      this.resources.pathValue = path.path;
      console.log(this.ztreeTyep);
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