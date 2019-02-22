  <style>
@import "./newcontent.css";
</style>

<template>
  <div class="newconten">
    <div v-show="show==='基本信息'" class="basicinfo">
      <Form ref="basic" :model="basic" :label-width="120">
        <FormItem label="策略名称">
          <Input v-model="basic.name"></Input>
        </FormItem>
        <FormItem label="策略类型">
          <Select v-model="basictype" style="width:160px" @on-change="alick" :label-in-value="true">
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
      <div style="display:none">{{lconten}}</div>
    </div>
    <div v-show="show==='备份资源列表'">
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
    <div v-show="show==='备份选项'">
      <backupoption :show2="policyTypekey" v-if="hackReset" ref="backupOption"></backupoption>
    </div>
    <div v-show="show==='调度计划'" class="planinfo">
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
        <FormItem label="开始日期" class="plandate">
          <DatePicker
            type="date"
            :value="schedule.startday"
            format="dd"
            show-week-numbers
            placement="bottom-end"
            placeholder="Select date"
            @on-change="startDate"
          ></DatePicker>
        </FormItem>
        <FormItem label="开始时间" width="100px">
          <TimePicker
            :value="schedule.starttime"
            format="HH:mm:ss"
            placeholder="Select time"
            style="width: 168px"
            @on-change="startTime"
          ></TimePicker>
        </FormItem>
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
        <FormItem label="结束时间" width="100px">
          <TimePicker
            :value="schedule.endtime"
            format="HH:mm:ss"
            @on-change="endTime"
            placeholder="Select time"
            style="width: 168px"
          ></TimePicker>
        </FormItem>
        <!-- <div v-if="show3==='周'"></div> -->
        <!-- <div v-if="show3==='时间间隔'"> </div> -->
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
          <Button type="warning">添加计划</Button>
          <Button type="warning">保存计划</Button>
          <Button type="warning">删除计划</Button>
        </div>
        <div class="planlist">
          <Table border :columns="planlist" :data="schedule.list"></Table>
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
      hackReset: true,
      policyTypekey: "",
      zNodes: [],
      timevalue1: "",
      timevalue2: "",
      nowTime: "",
      nowDate: "",
      ztreeObj: {},
      pathConten: [],
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
      options2: {
        shortcuts: [
          {
            text: "1 周",
            value() {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "2 周",
            value() {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 14);
              return [start, end];
            }
          },
          {
            text: "3 周",
            value() {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 21);
              return [start, end];
            }
          },
          {
            text: "4 周",
            value() {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 28);
              return [start, end];
            }
          }
        ]
      },
      planlist: [
        {
          title: "调度类型",
          key: "plantype"
        },
        {
          title: "备份类型"
        },
        {
          title: "开始时间"
        },
        {
          title: "结束时间"
        },
        {
          title: "间隔时间"
        }
      ],

      show3: "",
      basic: {
        name: "",
        deviceval: "",
        poolval: "",
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
        privilegekey: "",
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
        maxtasks: "",
        compress: [],
        encryption: [],
        algorithm: "",
        savedays: ""
      },
      schedule: {
        typelevel: "",
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
        endtime: ""
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
          iconSkin:"client",
            name: item.machine,
             nocheck:true,
            nodetype: 0
          })
        );
      }
      $.fn.zTree.init($("#treeDemo"), this.setting, array);
    }
  },
  watch: {
    databack: function(newdata, olddata) {},
    hackOne: function(type) {
      if (type == 131072) {
        this.$refs.backupOption.setOptins(14, 0);
      }
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
      if (type == 196608) {
   this.$parent.$parent.delTabList()
      }else{
        this.$parent.$parent.addTabList()
      }



    }
  },
  methods: {
    showOptions() {
      console.log(this.$refs.backupOption.showOption());
    },
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
    policypost: function() {
      let tests = {
        base: {
          name: this.basic.name,
          type: this.basictype,
          privilege: parseInt(
            this.basic.privilegekey ? this.basic.privilegekey : 0
          ),
          pool: parseInt(this.basic.poolval ? this.basic.poolval : 0),
          device: parseInt(this.basic.deviceval ? this.basic.deviceval : 0),
          savedays: parseInt(this.basic.savedays ? this.basic.savedays : 0),
          maxtasks: parseInt(this.basic.maxtasks ? this.basic.maxtasks : 0)
        },
        resource: [
          {
            client: parseInt(
              this.resources.clientId ? this.resources.clientId : 1
            ),
            type: 65538,
            path: this.resources.pathValue,
            exclude: 0
          }
        ],
        option: this.$refs.backupOption.showOption(),
        schedule: [
          {
            scheduletype: parseInt(
              this.schedule.typelevel ? this.schedule.typelevel : 0
            ),
            backuptype: parseInt(
              this.schedule.backuptlevel ? this.schedule.backuptlevel : 0
            ),
            freqtype: parseInt(
              this.schedule.freqtypelevel ? this.schedule.freqtypelevel : 0
            ),
            freqval: parseInt(
              this.schedule.intervalTime ? this.schedule.intervalTime : 0
            ),
            startday: parseInt(this.schedule.startday.replace(/'/g, "")),
            starttime: this.schedule.starttime,
            endday: parseInt(this.schedule.endday),
            endtime: this.schedule.endtime
              ? this.schedule.endtime
              : this.schedule.endNow,
            duration: 0
          }
        ]
      };
      console.log(tests);
      util.restfullCall("/rest-ful/v3.0/policy", tests, "post", this.senddata);
    },
    senddata: function(value) {
      alert(value.data.message);
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.policySwitch);
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
      this.timeFormate();
    },
    build_path_by_tree_node: function(treeNode) {
      //获取路径
      var path = "";
      var cid = 0;
      let name = "";
      let current_node = treeNode;
      let parent = treeNode.getParentNode();

      while (true) {
        parent = current_node.getParentNode();
        if (!parent) {
          cid = current_node.id;
          name = current_node.name;
          break;
        }
        if (parent.nodetype) {
          path = "/" + path;
        }
        path = current_node.name + path;
        current_node = parent;
      }
      return { client: cid, path: path, name: name };
    },
    //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {
      if (!treeNode.hasOwnProperty("children")) {
        let typeId = this.basictype;
        let path = this.build_path_by_tree_node(treeNode);
        // console.log(treeNode, treeNode.hasOwnProperty("children"));
        let str =
          "/rest-ful/v3.0/client/resource/browse?" +
          "client=" +
          path.client +
          "&type=" +
          typeId +
          "&path=" +
          path.path;
        util.restfullCall(str, null, "get", function(obj) {
          //返回数据处理
          var arrays = new Array();
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
        });
      }
    },
    //选中节点
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.build_path_by_tree_node(treeNode);
      var pathList = path.name + "_" + path.path;
      this.pathConten.push({ name: pathList.slice(0,-1) });
      this.resources.clientId = path.client;
      this.resources.pathValue = path.path.slice(0,-1);
      console.log(pathList);
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
