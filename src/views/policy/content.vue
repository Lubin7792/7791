 <style>
@import "./newcontent.css";
</style>

<template>
  <div class="newconten">
     <loading v-if="loadingShow" key="2"></loading>
    <div v-show="show === '基本信息'" class="basicinfo">
      <Form ref="basic" :model="basic" :label-width="120" :rules="ruleMode">
        <FormItem label="策略名称" prop="name">
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
          <Select style="width:200px" v-model="basic.pool" @on-change="showNow" disabled>
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
          <InputNumber :max="5" :min="1" v-model="basic.maxtasks"></InputNumber>
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
        <!-- <FormItem label="加密算法">
          <Input v-model="temporary.algorithm"></Input>
        </FormItem>-->
        <FormItem label="数据保留周期">
          <InputNumber :max="90" :min="1" v-model="basic.savedays"></InputNumber>
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
          <Table border ref="selection" :columns="columns4" :data="resources.pathConten"></Table>
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
              :label="item.Name"
              :value="item.Type"
              :key="item.Type"
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
              placeholder="选择日期"
              @on-change="startDate"
            ></DatePicker>
          </FormItem>
        </div>

        <FormItem label="开始时间" width="100px">
          <TimePicker
            :value="schedule.starttime"
            format="HH:mm:ss"
            placeholder="选择时间"
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
              placeholder="选择日期"
              @on-change="endDate"
            ></DatePicker>
          </FormItem>
        </div>
        <FormItem label="结束时间" width="100px">
          <TimePicker
            :value="schedule.endtime"
            format="HH:mm:ss"
            @on-change="endTime"
            placeholder="选择时间"
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
        <div class="buttonList">
          <Button type="warning" @click="addPlan">添加计划</Button>
          <Button type="warning" @click="revisePlan">保存修改</Button>
          <Button type="warning" @click="deletePlan">删除计划</Button>
        </div>
        <div class="planlist">
          <Table
            highlight-row
            border
            :columns="planlists"
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
      type: String
    },
    model1: {
      type: [String, Object]
    }
  },
  components: {
    backupoption
  },
  data() {
    const formName = function(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入策略名称"));
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,128}$/.test(value)) {
        return callback(new Error("可包含汉字-字母、数字、下划线"));
      } else {
        callback();
      }
    };
    return {
      loadingShow:false,
      ruleMode: {
        name: [
          {
            required: true,
            validator: formName,
            trigger: "blur"
          }
        ]
      },
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
      pathContenList: [],
      pathContens: [],
      checkType: false,
      findPath: "",
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
      planlists: [
        {
          title: "调度类型",
          key: "typelevelCh"
        },
        {
          title: "备份类型",
          key: "backupCh"
        },
        {
          title: "开始日期",
          key: "startdayType"
        },
         {
          title: "开始时间",
          key: "starttime"
        },
          {
          title: "结束日期",
          key: "enddayType"
        },
       
        {
          title: "结束时间",
          key: "endtime"
        },
        {
          title: "间隔时间",
          key: "freqvalCh"
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
        backuptype: [],
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
        type: "",
        name: "",
        id: "",
        privilege: "",
        pool: "",
        device: "",
        maxtasks: 0,
        savedays: 0
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
        pathValue: "",
        pathConten: []
      }
    };
  },
  computed: {
    backData() {
      return this.$store.state.index.detailData;
    },
    policyTyep() {
      return this.$store.state.index.policyType;
    },
    devicesList() {
      return this.$store.state.index.devicesList;
    }
  },
  watch: {
    //重置数据
    backData: function(data) {
      // 重置ztree
      this.lconten();
      let pathMachine;
      let clietList = this.$store.state.index.policyData;
      let clientID;
      let machineList = [];
      //数据清空
      this.$refs.backupOption.callBack();
      // 数据回填
      this.basic = data.base;
      this.basictype = data.base.type;
      this.temporary.planList = data.schedule;
      this.resources.pathConten = JSON.parse(JSON.stringify(data.resource));
      // ztree数据
      for (let i = 0; i < data.resource.length; i++) {
        let _index = data.resource[i].client;
        findMachine(_index);
        function findMachine(_index) {
          function findClient(element) {
            return element.id == _index;
          }
          // 遍历出来客户端列表
          machineList.push(clietList.filter(findClient)[0].machine);
        }
        //拼接路径列表
        // this.pathContenList[i].path =
        //   machineList[i] + "_" + this.pathContenList[i].path;
        this.resources.pathConten[i].name =
          (this.resources.pathConten[i].exclude == 0 ? "+" : "-") +
          machineList[i] +
          "_" +
          this.resources.pathConten[i].path;
      }
      // 调度计划
      this.show3="0";
      Object.assign(this.$data.schedule, this.$options.data().schedule)
      util.restfullCall(
        "/rest-ful/v3.0/policy/backuptype/" + data.base.type,
        null,
        "get",
        this.callType
      );
      for (let i = 0; i < data.schedule.length; i++) {

        this.temporary.planList[i].typelevelCh =
          data.schedule[i].scheduletype == 0
            ? "日期"
            : data.schedule[i].scheduletype == 1
            ? "周"
            : "间隔时间";
             this.temporary.planList[i].startdayType =this.startdayTypeN(data.schedule[i].scheduletype,data.schedule[i].startday);
             this.temporary.planList[i].enddayType =this.startdayTypeN(data.schedule[i].scheduletype,data.schedule[i].endday);
             this.temporary.planList[i].freqvalCh=data.schedule[i].freqval+(data.schedule[i].freqtype==0?"小时":"分钟")
      }
  // 备份选项数据
      this.$nextTick(() => {
        let source = this.$refs.backupOption;
        source.options = data.option;
        if (data.base.type == 65536) {
          let num = data.option.length;

          for (let i = 0; i < num; i++) {
            source.valueF = "0";
            if (data.option[i].type == 6) {
              source.valueA = "6";
              source.valueB = data.option[i].value;
            }
            if (data.option[i].type == 7) {
              source.valueA = 7;
              source.valueC = data.option[i].value;
            }
            if (data.option[i].type == 9) {
              source.valueF = "9";
            }
            if (data.option[i].type == 5) {
              source.showc = true;
            }
            if (data.option[i].type == 8) {
              source.showd = true;
            }
            if (data.option[i].type == 3) {
              source.showa = true;
              source.valueD = data.option[i].value;
            }
            if (data.option[i].type == 4) {
              source.showb = true;
              source.valueE = data.option[i].value;
            }
          }
        }
        if (data.base.type == 131072) {
          for (let i = 0; i < data.option.length; i++) {
            if (data.option[i].type == 24) {
              source.showf = true;
              source.valueA = data.option[i].value;
            }
            if (data.option[i].type == 13) {
              source.showa = true;
            }
            if (data.option[i].type == 15) {
              source.showb = true;
              source.valueA = data.option[i].value;
            }
            if (data.option[i].type == 14) {
              source.valueB = data.option[i].value;
            }
            if (data.option[i].type == 10) {
              source.showc = true;
              source.numberA = Number(data.option[i].value);
            }
            if (data.option[i].type == 12) {
              source.showd = true;
              source.numberB = Number(data.option[i].value);
            }
            if (data.option[i].type == 11) {
              source.showe = true;
            }
          }
        }
        if (data.base.type == 393216) {
        }
        if (data.base.type == 262144) {
          for (let i = 0; i < data.option.length; i++) {
            if (data.option[i].type == 16) {
              source.valueA = String(data.option[i].value);
            }
            if (data.option[i].type == 17) {
              source.valueB = String(data.option[i].value);
            }
            if (data.option[i].type == 18) {
              source.showa = true;
            }
            if (data.option[i].type == 19) {
              source.showb = true;
            }
          }
        }
        if (data.base.type == 327680) {
          for (let i = 0; i < data.option.length; i++) {
            if (data.option[i].type == 21) {
              source.showb = true;
            }
            if (data.option[i].type == 29) {
              source.showa = true;
            }
            if (data.option[i].type == 28) {
              source.valueA = String(data.option[i].value);
            }
          }
        }
      });
      // this.hackReset = false;
      // this.$nextTick(( ) => {
      // this.hackReset = true;

      // });
    }
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
  created() {
    // this.show="基本信息"
  },
  mounted() {
    // this.$emit("updataShow")
  },
  destroyed() {},
  methods: {
    startdayTypeN:function (type,num) {
      if(!num){
        return false;
      }
if(type==1){
      let week;
      this.policylist.weekList.map(item =>{
        if(parseInt(item.value)==num){
          week= item.name;
        }
      })
      return week
      }else{
       let dayNum=parseInt(num)|| parseInt(num.replace(/'/g, ""));
        return ""+dayNum+"号"
      }
    },
    callType: function(obj) {
      this.policylist.backuptype = obj.data;
      for (let i = 0; i < this.temporary.planList.length; i++) {
        this.$set(
          this.temporary.planList[i],
          "backupCh",
          this.backupChn(this.temporary.planList[i].backupType)
        );
      }
    },
    backupChn: function(num) {
      let text = "";
      this.policylist.backuptype.map(item => {
        if (item.Type == num) text = item.Name;
      });
      return text;
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
      $.fn.zTree.init($("#treeDemo"), this.setting, array);
    },
    findHalfCheck(name, treeNode) {
      //已选列表信息
      let findList = this.resources.pathConten;
      // 当前节点
      let nowNode = this.treeNodeA;
      // 当前路径
      let nowPath = this.findPath;
      // 当前节点的客户端
      let clientId = nowPath.name;
      // 当前层级
      let nowLevel = nowNode.level + 1;
      let names = "";
      for (let i = 0; i < findList.length; i++) {
        if (nowLevel != 1) {
          names = "/" + name;
        } else {
          names = name;
        }
        // if (nowLevel == 1 && name == "/") {
        //   names = "";
        // }
        if (nowLevel == 2 && nowPath.path == "/") {
          nowPath.path = "";
        }
        if ("-" + clientId + "_" + nowPath.path + names == findList[i].name) {
          return false;
        }
        if (
          "-" + clientId + "_" + nowPath.path + names ==
          findList[i].name.substr(
            0,
            (clientId + "_" + nowPath.path + names).length + 1
          )
        ) {
          return true;
        }
        if ("+" + clientId + "_" + nowPath.path + names == findList[i].name) {
          return false;
        }
        if (
          "+" + clientId + "_" + nowPath.path + names ==
          findList[i].name.substr(
            0,
            (clientId + "_" + nowPath.path + names).length + 1
          )
        ) {
          return true;
        }
      }
    },
    // 根据name与路径比对是否包含
    findCheckout(name, treeNode) {
      //已选列表信息
      let findList = this.resources.pathConten;
      // 当前节点
      let nowNode = this.treeNodeA;
      // 当前路径
      let nowPath = this.findPath;
      // 当前节点的客户端
      let clientId = nowPath.name;
      // 当前层级
      let nowLevel = nowNode.level + 1;
      let names = "";
      if (true) {
        for (let i = 0; i < findList.length; i++) {
          if (nowLevel != 1) {
            names = "/" + name;
          } else {
            names = name;
          }
          // if (nowLevel == 1 && name == "/") {
          //   names = "";
          // }
          if (nowLevel == 2 && nowPath.path == "/") {
            nowPath.path = "";
          }
          let parent = treeNode.getParentNode();

          if (parent) {
            if (parent.getCheckStatus() != null) {
              if (
                parent.getCheckStatus().checked == true &&
                parent.getCheckStatus().half == false
              ) {
                return true;
              }
              if (
                treeNode.getCheckStatus().checked == true &&
                treeNode.getCheckStatus().half == false
              ) {
                return true;
              }
            }
          }
          if ("-" + clientId + "_" + nowPath.path + names == findList[i].name) {
            return false;
          }

          if (
            "+" + clientId + "_" + this.tree_path(treeNode).path ==
            findList[i].name
          ) {
            return true;
          }

          // if(treeNode,treeNode.checked==true&&treeNode.halfCheck==false){
          //   return true
          // }

          if ("+" + clientId + "_" + nowPath.path + names == findList[i].name) {
            return true;
          }
          if (
            "+" + clientId + "_" + nowPath.path + names ==
            findList[i].name.substr(
              0,
              (clientId + "_" + nowPath.path + names).length + 1
            )
          ) {
            return true;
          }

          // if (
          //   clientId + "_" + nowPath.path + names ==
          //   findList[i].path
          //     .split("/")
          //     .splice(0, nowLevel)
          //     .join("/")
          // ) {
          //   console.log("FFFFFFFFFFFFFFF", findList[i].path)

          //   return true;
          // }
        }
      }
    },
    planListIndex: function(value, index) {
      this.show3 = value.scheduletype.toString();
      (this.schedule.startday = ""),
        (this.schedule.endday = ""),
        (this.temporary.planListIndex = index);
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
      this.temporary.addLists={};
      let typelevelNum = parseInt(
        this.schedule.scheduletype
      );
      let backupNum = parseInt(
        this.schedule.backupType
      );
      let  freqtype=parseInt(this.schedule.freqtype ? this.schedule.freqtype : 0);
         let   freqval= parseInt(this.schedule.freqval ? this.schedule.freqval : 0);
     
      let addList = {
        backupType: backupNum,
        scheduletype: typelevelNum,
       freqtype:freqtype,
        freqval:freqval,
        // startday: parseInt(this.schedule.startday.replace(/'/g, "")),
        startday: parseInt(this.schedule.startday),
        starttime: this.schedule.starttime,
        endday: parseInt(this.schedule.endday),
         startdayType:this.startdayTypeN(typelevelNum,this.schedule.startday),
        enddayType:this.startdayTypeN(typelevelNum,this.schedule.endday),
        endtime: this.schedule.endtime,
        typelevelCh:
          typelevelNum == 0 ? "日期" : typelevelNum == 1 ? "周" : "间隔时间",
        backupCh: this.backupChn(backupNum),
        duration: 0,
        freqvalCh:freqval+(freqtype==0?"小时":"分钟")
      };
      if(!addList.backupType||!addList.startday||(addList.starttime=='')||!addList.endday||(addList.endtime=='')){
        this.$Message.error('选项不可为空');
        return false
      }
      this.temporary.addLists = addList;
    },
    addPlan: function() {
      this.addList();
      if(Object.keys(this.temporary.addLists).length!=0){
      this.temporary.planList.push(this.temporary.addLists);
      }
    },
    revisePlan: function() {
      this.addList();
      if(Object.keys(this.temporary.addLists).length!=0){
      this.temporary.planList.splice(
        this.temporary.planListIndex,
        1,
        this.temporary.addLists
      );}
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
      if(value){
        this.temporary.freqval = value.label;
      }
    },
    showNow: function() {},
    showNows: function(value) {},
    policypost: function() {
      if (/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,128}$/.test(this.basic.name)) {
        let tests = {
          base: {
            name: this.basic.name,
            type: this.basic.type,
            id: this.basic.id,
            privilege: parseInt(
              this.basic.privilege ? this.basic.privilege : 0
            ),
            pool: parseInt(this.basic.pool ? this.basic.pool : 0),
            device: parseInt(this.basic.device ? this.basic.device : 0),
            savedays: parseInt(this.basic.savedays ? this.basic.savedays : 0),
            maxtasks: parseInt(this.basic.maxtasks ? this.basic.maxtasks : 0)
          },
          resource: this.resources.pathConten,
          option: this.$refs.backupOption.showOption(),
          schedule: this.temporary.planList
        };
        util.restfullCall("/rest-ful/v3.0/policy", tests, "put", this.senddata);
      } else {
        this.$Message.error("修改策略名称格式错误！添加失败");
      }
    },
    senddata: function(value) {
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.index.policySwitch);
      } else {
        alert(value.data.message);
      }
    },
    alick: function(value) {
      this.policyTypekey = String(value.value);
    },
    timeFormate: function() {
      let week =new Date().getDay();
      let date = new Date().getDate();
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
       this.schedule.starttime = hh + ":" + mm + ":" + ss;
      this.schedule.endtime = hh + ":" + mm + ":" + ss;
       week==0?week=7:week=week;
      if(this.show3=="0"){
         this.schedule.startday = String(date)
         this.schedule.endday =  String(date)
      }
       if(this.show3=="1"){
         this.schedule.startday =  String(week);
         this.schedule.endday = String(week);
      }
       if(this.show3=="2"){
         this.schedule.startday =String(date)
         this.schedule.endday =String(date)
      }
    },
    onplantype: function(value) {
      this.show3 = value;
      this.$nextTick(() => {
        // this.schedule.startday = "";
        // this.schedule.endday = "";
      });
      this.timeFormate();
    },
    tree_path: function(treeNode) {
      //获取路径
      let path = "";
      let cid = 0;
      do {
        treeNode.halfCheck = false;
        let parent = treeNode.getParentNode();

        if (!parent) {
          cid = treeNode.id;
          name = treeNode.name;
          break;
        }
        if (parent) {
          parent.halfCheck = false;
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
      if (path.indexOf("//") == 0) {
        path = path.substr(1);
      }
      return {
        client: cid,
        path: path,
        name: name,
        namePath: name + "_" + path
      };
    },
    //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {
      if (typeof this.basictype == "number") {
        if (!treeNode.hasOwnProperty("children")) {
      this.loadingShow=true;
          this.treeNodeA = treeNode;
          this.treeId = treeId;
          let typeId = treeNode.ResType ? treeNode.ResType : this.basictype;
          let path = this.tree_path(treeNode);
          this.findPath = path;
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
          this.loadingShow=false;
      let treeNode = this.treeNodeA;
      let treeId = this.treeId;
      //返回数据处理
      var arrays = new Array();
      // console.log( obj.data.resources)
      let objj = obj.data.resources;
      for (let i = 0; i < objj.length; i++) {
        arrays.push({
          iconSkin: this.findIcon(objj[i].ResType),
          ResType: objj[i].ResType,
          name: objj[i].Name,
          nodetype: 1,
          checked: this.findCheckout(objj[i].Name, treeNode),
          halfCheck: this.findHalfCheck(objj[i].Name, treeNode)
        });
      }
      let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
      ztreeobj.addNodes(treeNode, arrays);
      this.checkType = treeNode.ResType;
    },
    findIcon: function(num) {
      if (num == 65537) {
        return "disk";
      }
      if (num == 65538) {
        return "catalog";
      }
      if (num == 65539) {
        return "file";
      }
    },
    //选中节点
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.tree_path(treeNode);
      var pathList = path.name + "_" + path.path;
      if (treeNode.checked) {
        this.SelectNode(treeNode);
        // this.pathContenList.push({ path: pathList });
        // this.pathContens.push({
        //   path: path.path,
        //   client: parseInt(path.client),
        //   type: treeNode.ResType,
        //   exclude: 1
        // });
      } else {
        this.DisSelectNode(treeNode);
        // function pathFilter(element) {
        //   return element.path !== pathList;
        // }
        // this.pathContenList = this.pathContenList.filter(pathFilter);
      }
      this.resources.clientId = path.client;
      this.ztreeTyep = treeNode.ResType;
      this.resources.pathValue = path.path;
    },
    //操作展示列表
    DeleteItemFromArray(path, start) {
      for (var index = 0; index < this.resources.pathConten.length; ) {
        //删除相关的
        if (
          this.resources.pathConten[index].name.substring(
            start,
            path.length + 1
          ) == path
        ) {
          this.resources.pathConten.splice(index, 1);
        } else if (
          this.resources.pathConten[index].name.substring(start) == path
        ) {
          this.resources.pathConten.splice(index, 1);
        } else {
          ++index;
        }
      }
    },
    // 取消选中状态下
    DisSelectNode: function(treeNode) {
      let parent = null;
      do {
        parent = treeNode.getParentNode();
        if (parent.level == 0) {
          break;
        }
        if (parent == null || parent.checked) {
          break;
        } else {
          treeNode = parent;
        }
      } while (true);
      this.DeleteItemFromArray(this.tree_path(treeNode).namePath, 1);
      if (parent != null && parent.checked) {
        this.resources.pathConten.unshift({
          name: "-" + this.tree_path(treeNode).namePath,
          path: this.tree_path(treeNode).path,
          type: treeNode.ResType,
          client: this.tree_path(treeNode).client,
          Exclude: 1
        });
      }
    },
    // 选中状态下
    SelectNode: function(treeNode) {
      let parent = null;
      do {
        parent = treeNode.getParentNode();
        if (parent) {
          // 删除-父节点
          this.DeleteItemFromArray("-" + this.tree_path(parent).namePath, 0);
        }
        if (
          parent == null ||
          (parent.checked && parent.check_Child_State != 2) ||
          parent.level == 0
        ) {
          break;
        } else {
          treeNode = parent;
        }
      } while (true);
      this.DeleteItemFromArray(this.tree_path(treeNode).namePath, 1);
      //排查兄弟节点
      let bNeedInsert = true;
      let tempNode = treeNode;
      if (parent) {
        do {
          for (
            var index = 0;
            index < this.resources.pathConten.length;
            index++
          ) {
            if (
              this.resources.pathConten[index].name.substring(1) ==
              this.tree_path(tempNode).namePath
            ) {
              bNeedInsert = false;
              break;
            }
          }
          tempNode = tempNode.getParentNode();
        } while (tempNode);
      }
      if (bNeedInsert == true) {
        this.resources.pathConten.unshift({
          name: "+" + this.tree_path(treeNode).namePath,
          path: this.tree_path(treeNode).path,
          type: treeNode.ResType,
          client: this.tree_path(treeNode).client,
          Exclude: 0
        });
      }
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