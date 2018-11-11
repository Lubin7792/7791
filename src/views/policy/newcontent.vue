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
          <Select v-model="basictype" style="width:160px" :placeholder="basicty" @on-change="alick">
            <Option v-for="item in basic.type" :value="item.value" :key="item.value"> </Option>
          </Select>
        </FormItem>
        <FormItem label="储存设备">
          <Input v-model="basic.client"></Input>
        </FormItem>
        <FormItem label="介质池">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="优先级">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="策略最大调度任务">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="启用压缩">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="启用加密">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="加密算法">
          <Input v-model="basic.state"></Input>
        </FormItem>
        <FormItem label="数据保留周期">
          <Input v-model="basic.state"></Input>
        </FormItem>
      </Form>
    </div>
    <div v-show="show==='备份资源列表'">
      <div id="areaTree">
        <div class="box-title">
          <span @click="freshArea">列表</span>
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
      <backupoption :show2="basicty"></backupoption>
    </div>
    <div v-show="show==='调度计划'" class="planinfo">
      <Form ref="plan" :model="plan" style="width:80%">
        <FormItem label="调度类型">
          <Select v-model="plan1" style="width:120px" @on-change="onplantype">
            <Option v-for="item in plantype" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="备份类型">
          <Select style="width:120px">
            <Option v-for="item in plan.backups" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期" class="plandate">
          <DatePicker type="date" :value="nowDate" format="yyyy年MM月dd日" show-week-numbers placement="bottom-end" placeholder="Select date"></DatePicker>
        </FormItem>
        <FormItem label="开始时间" >
          <TimePicker :value="nowTime" format="HH点mm分ss秒" placeholder="Select time" style="width: 168px"></TimePicker>
        </FormItem>
        <FormItem label="结束日期" class="plandate">
          <DatePicker type="date" format="yyyy年MM月dd日" show-week-numbers placement="bottom-end" placeholder="Select date"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" >
          <TimePicker :value="timevalue2" format="HH点mm分ss秒" placeholder="Select time" style="width: 168px"></TimePicker>
        </FormItem>
        <!-- <div v-if="show3==='周'"></div> -->
        <!-- <div v-if="show3==='时间间隔'"> </div> -->
        <FormItem label="间隔类型" style="width:100%">
          <Select style="width:150px" @on-change="planShow">
            <Option v-for="item in plan.intervalType" :value="item.value" :key="item.value"></Option>
          </Select>
          <Input v-model="plan.intervalTime" placeholder="输入时间" style="width: 100px"></Input>
          <span>{{ plan.timeType }}</span>
        </FormItem>
      </Form>
      <div class="button">
        <Button type="warning">添加计划</Button>
        <Button type="warning">保存计划</Button>
        <Button type="warning">删除计划</Button>
      </div>
      <div class="planlist">
        <Table border :columns="planlist" :data="planlistcon"></Table>
      </div>
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
    },
    basicty: {
      default: "文件备份选项"
    }
  },
  components: {
    backupoption
  },
  beforeUpdate() {
    //回填
    this.basictype = this.basicty;
  },
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
      basictype: "",
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
      plantype: [
        {
          value: "日期"
        },
        {
          value: "周"
        },
        {
          value: "时间间隔"
        }
      ],

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
      planlistcon: [
        {
          plantype: "时间"
        },
        {
          plantype: "月份"
        },
        {
          plantype: "周"
        }
      ],
      show3: "月份",
      basic: {
        name: "",
        type: [
          {
            value: "文件备份选项"
          },
          {
            value: "RAOLE备份选项"
          },
          {
            value: "SQLSERVER备份选项"
          },
          {
            value: "VMWARE备份选项"
          }
        ],
        client: "",
        state: ""
      },
      plan: {
        intervalType: [
          {
            value: "小时"
          },
          {
            value: "分钟"
          }
        ],
        intervalTime: "",
        timeType:"",
        backups: [
          {
            value: "全备"
          },
          {
            value: "增量"
          },
          {
            value: "差量"
          }
        ]
      },
      resources: {
        pool: "",
        equipment: ""
      },
      option: {
        content: "",
        encryption: "",
        compress: ""
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
    data3() {
      let data1 = [];
      data1 = this.$store.state.policyData;
      const array = [];
      for (let i = 0; i < data1.length; i++) {
        let item = data1[i];
        array.push(
          (item = {
            id: item.id,
            name: item.machine,
            nodetype: 0
          })
        );
      }
      return array;
    }
  },
  mounted: function() {
    // $.fn.zTree.init($("#treeDemo"), this.setting, this.data3);
  },
  methods: {
    planShow:function(value){
      this.$set(this.plan,"timeType", value)
      console.log(1,this.plan.timetype);
    },
    lading: function() {},
    alick: function(value) {
      // 提交到父组件 用以保存
      this.$emit("switchBasicty", value);
    },
    timeFormate: function() {
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
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
      this.nowTime = hh + "点" + mm + "分" + ss + "秒";
      this.nowDate = year + "年" + month + "月" + date + "日";
      console.log(this.nowTime, this.nowDate);
    },
    onplantype: function(value) {
      this.show3 = value;
      this.timeFormate();
    },
    freshArea: function() {
      $.fn.zTree.init($("#treeDemo"), this.setting, this.data3);
    },
    build_path_by_tree_node: function(treeNode) {
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
        let typeId = "65536";
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
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.build_path_by_tree_node(treeNode);
      let pathList = path.name + "_" + path.path;
      this.pathConten.push({ name: pathList });
      console.log(pathList, this.pathConten);
      // let newPath = this.pathConten.filter( item => {
      //     if(pathList !== item) {
      //       return true
      //     }
      //   })
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
