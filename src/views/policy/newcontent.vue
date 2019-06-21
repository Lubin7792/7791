  <style>
@import "./newcontent.css";
</style>

<template>
  <div class="newconten">
     <loading v-if="loadingShow" key="1"></loading>
    <div v-show="show === '基本信息'" class="basicinfo">
      <Form ref="basic" :model="basic" :label-width="120" :rules="ruleMode">
        <FormItem label="策略名称" prop="name">
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
          <!-- <Input v-model="basic.maxtasks"></Input> -->
          <InputNumber :max="5" :min="1" v-model="basic.maxtasks"></InputNumber>
        </FormItem>
        <FormItem label="压缩级别" class="h30 checkPosition">
             <Select
              v-model="basic.compressValue"
              style="width:160px"
              :label-in-value="true"
              placeholder="请选择"
            >
              <Option
                v-for="item in basic.compressList"
                :label="item.name"
                :value="item.key"
                :key="item.key"
              ></Option>
            </Select>
        </FormItem>
        <FormItem label="启用加密" class="h30">
            <Checkbox  v-model="basic.encryption" ></Checkbox>
        </FormItem>
        <!-- <FormItem label="加密算法">
          <Input v-model="basic.algorithm"></Input>
        </FormItem>-->
        <FormItem label="数据保留周期">
          <InputNumber :max="90" :min="1" v-model="basic.savedays"></InputNumber>&nbsp;天
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
          <Table border ref="selection" :columns="columns4" :data="resources.pathConten"></Table>
        </div>
      </div>
    </div>
    <div v-show="show === '备份选项'">
      <backupoption :show2="policyTypekey" v-if="hackReset" ref="backupOption" ></backupoption>
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
        <FormItem label="间隔类型" style="width:46%">
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
        <div class="buttonList">
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
    const formName = function(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入策略名称"));
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,128}$/.test(value)) {
        return callback(
          new Error("可包含-汉字、字母、数字、下划线")
        );
      } else {
        callback();
      }
    };
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

    return {
      loadingShow:false,
      ztreeArray:[],
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
      treeNodeA: {},
      treeId: "",
      hackReset: true,
      policyTypekey: "65536",
      ztreeTyep: "",
      ztreeObj: {},
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

      show3: "0",
      basic: {
        type: 65536,
        name: "",
        deviceval: "",
        poolval: 2,
        pool: [],
        privilegekey: 1,
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
         compressList: [
          {
            key: 0,
            name: "不压缩"
          },
          {
            key: 6,
            name: "高"
          },
          {
            key: 3,
            name: "中"
          },
          {
            key: 1,
            name: "低"
          }
        ],
        compressValue:0,
        maxtasks: 5,
        encryption: false,
        algorithm: "",
        savedays: 30
      },
      schedule: {
        typelevel: 0,
        dayList: [
          { name: "1号", value: 1 },
          { name: "2号", value: 2 },
          { name: "3号", value: 3 },
          { name: "4号", value: 4 },
          { name: "5号", value: 5 },
          { name: "6号", value: 6 },
          { name: "7号", value: 7 },
          { name: "8号", value: 8 },
          { name: "9号", value: 9 },
          { name: "10号", value: 10 },
          { name: "11号", value: 11 },
          { name: "12号", value: 12 },
          { name: "13号", value: 13 },
          { name: "14号", value: 14 },
          { name: "15号", value: 15 },
          { name: "16号", value: 16 },
          { name: "17号", value: 17 },
          { name: "18号", value: 18 },
          { name: "19号", value: 19 },
          { name: "20号", value: 20 },
          { name: "21号", value: 21 },
          { name: "22号", value: 22 },
          { name: "23号", value: 23 },
          { name: "24号", value: 24 },
          { name: "25号", value: 25 },
          { name: "26号", value: 26 },
          { name: "27号", value: 27 },
          { name: "28号", value: 28 },
          { name: "29号", value: 29 },
          { name: "30号", value: 30 },
          { name: "31号", value: 31 }
        ],
        weekList: [
          { value: 1, name: "周一" },
          { value: 2, name: "周二" },
          { value: 3, name: "周三" },
          { value: 4, name: "周四" },
          { value: 5, name: "周五" },
          { value: 6, name: "周六" },
          { value: 7, name: "周日" }
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
        backuptlevel:1,
        backuptype: [],
        intervalTime: "",
        timeType: "",
        list: [],
        startday:  new Date().getDate() ,
        starttime: hh + ":" + mm + ":" + ss,
        endday:  new Date().getDate() ,
        endtime: hh + ":" + mm + ":" + ss,
        planList: [],
        planListIndex: "",
        addLists: {}
      },
      resources: {
        equipment: "",
        checkNode:null,
        clientId: "",
        pathValue: "",
        // 展示列表
        pathConten: [],
        // 发送列表
     pathContens: []
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
      // let data1 = [];
      // data1 = this.$store.state.index.policyData;
      // const array = [];
      // for (let i = 0; i < data1.length; i++) {
      //   let item = data1[i];
      //   array.push(
      //     (item = {
      //       id: item.id,
      //       iconSkin: "client",
      //       name: item.machine,
      //       nocheck: true,
      //       nodetype: 0
      //     })
      //   );
      // }
      // this.ztreeArray=array
      // $.fn.zTree.init($("#treeDemoA"), this.setting, array);
    }
  },
  created() {
  },
  watch: {
    policyTyep: function(data) {
      // this.basic.type = data[0].key;
    },
    devicesList: function(data) {
      // this.basic.deviceval = data[0].id;
    },
    hackOne: function(type) {
      this.$refs.backupOption.callBack();
      if (type == 131072) {
        this.$refs.backupOption.setOptins(14, 0);
      }
       if (type == 524288) {
         this.$refs.backupOption.setOptins(39, 1);
        this.$refs.backupOption.setOptins(40, 1);
       }
      // this.hackReset = false;
      // this.$nextTick(() => {
      //   this.hackReset = true;
      // });
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
      (this.schedule.startday = ""),
        (this.schedule.endday = ""),
        (this.schedule.planListIndex = index);
      this.schedule.typelevel = value.scheduletype;
      this.schedule.backuptlevel = value.backuptype;
      this.schedule.freqtypelevel = value.freqtype;
      this.schedule.intervalTime = value.freqval;
      // this.$nextTick(() => {
        if( value.scheduletype==2){
              this.schedule.startday =("'"+value.startday+"'")|| value.startday;
              this.schedule.endday = ("'"+value.endday+"'")||value.endday;
        }else{
          this.schedule.startday = value.startday;
          this.schedule.endday = value.endday;
        }
      // });
      this.schedule.starttime = value.starttime;
      this.schedule.endtime = value.endtime;
    },
    addList: function() {
      this.schedule.addLists={};

      let typelevelNum = parseInt(
        this.schedule.typelevel 
      );
      let backupNum = parseInt(
        this.schedule.backuptlevel
      );
      let  freqtype=parseInt(this.schedule.freqtypelevel ? this.schedule.freqtypelevel : 0);
         let freqval= parseInt(this.schedule.intervalTime ? this.schedule.intervalTime : 0);
      let addList = {
        backuptype: backupNum,
        scheduletype: typelevelNum,
         freqtype:freqtype,
        freqval:freqval,
        startday:parseInt(this.schedule.startday)|| parseInt(this.schedule.startday.replace(/'/g, "")),
        // startday: parseInt(this.schedule.startday),
        starttime: this.schedule.starttime,
        endday: parseInt(this.schedule.endday)|| parseInt(this.schedule.endday.replace(/'/g, "")),
        endtime: this.schedule.endtime,
        typelevelCh:
          typelevelNum == 0 ? "日期" : typelevelNum == 1 ? "周" : "间隔时间",
        backupCh:this.backupChn(backupNum),
        startdayType:this.startdayTypeN(typelevelNum,this.schedule.startday),
        enddayType:this.startdayTypeN(typelevelNum,this.schedule.endday),
        duration: 0,
         freqvalCh:freqval+(freqtype==0?"小时":"分钟")
      };
      if(!addList.backuptype||!addList.startday||(addList.starttime=='')||!addList.endday||(addList.endtime=='')){
        this.$Message.error('选项不可为空');
        return false
      }
      this.schedule.addLists = addList;
    },
    addPlan: function() {
      this.addList();
    if(Object.keys(this.schedule.addLists).length!=0){
  this.schedule.planList.push(this.schedule.addLists);
     }
    },
    startdayTypeN:function (type,num) {
      if(type==1){
      let week;
      this.schedule.weekList.map(item =>{
        if(item.value==num){
          week= item.name;
        }
      })
      return week
      }else{
       let dayNum=parseInt(num)|| parseInt(num.replace(/'/g, ""));
        return ""+dayNum+"号"
      }
    },
    backupChn:function(num){
      let text='';
       this.schedule.backuptype.map(item=>{
         if(item.Type==num)
         text= item.Name
       })
       return text;
    },
    revisePlan: function() {
      this.addList();
    if(Object.keys(this.schedule.addLists).length!=0){
      this.schedule.planList.splice(
        this.schedule.planListIndex,
        1,
        this.schedule.addLists
      );}
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
    if(value!=undefined){
        let test = value;
      this.schedule.freqval = test.label;
    }
    },
    showNow: function() {},
    showNows: function(value) {},
    policypost: function() {
        if(!(/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,128}$/.test(this.basic.name) )){
           this.$parent.$parent.closeOpen(true);
       this.$Message.error("输入策略名称格式错误！新建失败");
       return false;
        }
      if(this.resources.pathConten.length==0){
         this.$parent.$parent.closeOpen(true);
       this.$Message.error("备份资源列表未选择！新建失败");
       return false;
      }
  if(this.basic.type===524288){
    var optionData=this.$refs.backupOption.showOption();
   var options= optionData.find((element)=>{
      return element.type==38;
    })
     if(options==undefined||options.value==""){
         this.$parent.$parent.closeOpen(true);
       this.$Message.error("DB2系统用户名不可为空！新建失败");
       return false;
      }
  }
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
        resource: this.resources.pathConten,
        option: this.$refs.backupOption.showOption(),
        schedule: this.schedule.planList,
      };
      if(this.basic.encryption){
      this.$refs.backupOption.adds(0,1);
    }
      this.$refs.backupOption.adds(1,this.basic.compressValue);
      this.$parent.$parent.closeOpen(false);
      util.restfullCall("/rest-ful/v3.0/policy", tests, "post", this.senddata);

    },
    senddata: function(value) {
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.index.policySwitch);
      } else {
        alert(value.data.message);
      }
    },
    alick: function(value) {
      this.basic.type = value.value;
      this.policyTypekey = String(value.value);
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
      this.ztreeArray=array
      $.fn.zTree.init($("#treeDemoA"), this.setting, array);
      this.resources.pathConten=[];
        util.restfullCall(
        "/rest-ful/v3.0/policy/backuptype/" + this.basic.type,
        null,
        "get",
        obj=>{
         this.schedule.backuptype=obj.data
        }
      );
      // this.schedule.backuptlevel=1;
    },
    timeFormate: function() {
       let week =new Date().getDay();
      let date =
        new Date().getDate() ;
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
      week==0?week=7:week=week
      if(this.show3=="0"){
         this.schedule.startday =  date ;
         this.schedule.endday =  date ;
      }
       if(this.show3=="1"){
         this.schedule.startday =  week ;
         this.schedule.endday =  week ;
      }
       if(this.show3=="2"){
         this.schedule.startday =String(date)
         this.schedule.endday =  String(date)
      }
    },
    onplantype: function(value) {
      this.show3 = value;
      // console.log( this.schedule.startday, this.schedule.endtday,"1")
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

      if (path.indexOf("//") == 0) {
        path = path.substr(1);
      }
      return { client: cid, path: path, name: name ,namePath:name+"_"+path};
    },
    //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {
      if (typeof this.basic.type == "number") {
        if (!treeNode.hasOwnProperty("children")) {
      this.loadingShow=true;
          this.treeNodeA = treeNode;
          this.treeId = treeId;
          let typeId = treeNode.ResType ? treeNode.ResType : this.basic.type;
          let path = this.tree_path(treeNode);
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
            checked: this.findCheckout(treeNode)
        });
      }
      let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
      ztreeobj.addNodes(treeNode, arrays);
      this.checkType = treeNode.ResType;
    },
    findCheckout:function(state){
      if(state.checked){
        return true
      }else{
        return false
      }
    },
       findIcon:function(num){
      if(num==65537){
        return "disk"
      }
       if(num==65538){
        return "catalog"
      }
       if(num==65539){
        return "file"
      }
    },
    //选中节点
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.tree_path(treeNode);
      this.resources.treeNode=path.path
      var pathList = path.name + "_" + path.path;
      if (treeNode.checked) {
        this.SelectNode(treeNode)
    //  this.resources.pathConten.push({ path: pathList });
    //     this.resources.pathContens.push({
    //       path: path.path,
    //       client: parseInt(path.client),
    //       type: treeNode.ResType,
    //       exclude: 0
    //     });
      } else {
        this.DisSelectNode(treeNode)
    //  function pathFilter(element) {
    //       return element.path !== pathList;
    //     }
    //     function pathFilters(element) {
    //       return element.path !== path.path;
    //     }
    //     this.resources.pathConten = this.resources.pathConten.filter(pathFilter);
    //     this.resources.pathContens = this.resources.pathContens.filter(pathFilters);
      }
      this.resources.clientId = path.client;
      this.ztreeTyep = treeNode.ResType;
      this.resources.pathValue = path.path;
    },
          //操作展示列表
    DeleteItemFromArray(path, start) {
           for (var index = 0; index < this.resources.pathConten.length; ) {
             //删除相关的
           if (this.resources.pathConten[index].name.substring(start, path.length + 1) == path) {
              this.resources.pathConten.splice(index, 1);               
          }
          else if (this.resources.pathConten[index].name.substring(start) == path) {
              this.resources.pathConten.splice(index, 1)   
          } else {
            ++index
          }
        }
      },
          // 取消选中状态下
      DisSelectNode:function(treeNode) {
        let parent = null ;
        do{
          parent =treeNode.getParentNode();
          if(parent.level==0){
            break
          }
          if((parent==null )||(parent.checked)){
            break;
          }else{
            treeNode = parent;
          }
        }while(true)
        this.DeleteItemFromArray(this.tree_path(treeNode).namePath,1)
 if ((parent != null) && (parent.checked)) {
           this.resources.pathConten.unshift({ name : "-" +this.tree_path(treeNode).namePath,path:this.tree_path(treeNode).path, type: treeNode.ResType,client:this.tree_path(treeNode).client ,Exclude:1})
        }
      },
       // 选中状态下
      SelectNode:function(treeNode) {
      let parent = null;
      do{
        parent =treeNode.getParentNode()
        if(parent) {
          // 删除-父节点
              this.DeleteItemFromArray("-" +this.tree_path(parent).namePath, 0);
        }
        if ((parent == null) || (parent.checked && parent.check_Child_State != 2)||parent.level==0) {
            break;
          }  else {
            treeNode = parent;
          }
      }while(true)
        this.DeleteItemFromArray(this.tree_path(treeNode).namePath, 1);
    //排查兄弟节点
       let bNeedInsert = true;
        let tempNode = treeNode;
        if (parent) {
          do  {
              for (var index = 0; index < this.resources.pathConten.length; index++) {
                if (this.resources.pathConten[index].name.substring(1) == this.tree_path(tempNode).namePath) {
                    bNeedInsert = false;
                    break
                }
              }
              tempNode = tempNode.getParentNode();
          }while(tempNode)
        }
       
        if (bNeedInsert == true) {
            this.resources.pathConten.unshift({ name : "+" +this.tree_path(treeNode).namePath, path:this.tree_path(treeNode).path,type: treeNode.ResType,client:this.tree_path(treeNode).client,Exclude:0 })
        }
      },

    //重置数据
        callBackFun() {
          // this.basic.type=65536;
       this.show3="0";
       this.policyTypekey="65536"
      this.hackReset = false;
      Object.assign(this.$data.basic, this.$options.data().basic)
      Object.assign(this.$data.schedule, this.$options.data().schedule)
      Object.assign(this.$data.resources, this.$options.data().resources)
     this.$nextTick(()=>{
      this.basic.deviceval = this.devicesList[0].id;
        this.hackReset = true;
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
      this.ztreeArray=array
      $.fn.zTree.init($("#treeDemoA"), this.setting, array);

       util.restfullCall(
        "/rest-ful/v3.0/policy/backuptype/" + this.basic.type,
        null,
        "get",
        obj=>{
         this.schedule.backuptype=obj.data
        }
      );

      this.schedule.backuptlevel=1;
       util.restfullCall(
        "/rest-ful/v3.0/volpools",
        null,
        "get",
        obj=>{
         this.basic.pool=obj.data
        }
      );

     })
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