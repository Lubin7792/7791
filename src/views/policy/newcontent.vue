  <style>
@import "./newcontent.css";
</style>

<template>
  <div class="newconten">
    <div v-if="show==='基本信息'" class="basicinfo">
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
    <div v-if="show==='备份资源列表'">
      <Form ref="option" :model="option" :label-width="80">
        <FormItem label="备份内容" class="optionconten">
           <Tree class="lubin1" :data="data3" show-checkbox ></Tree>
        </FormItem>
      </Form>
       <div id="areaTree">
        <div class="box-title">
            <span >列表<i class="fa  fa-refresh" @click="freshArea">asdsad</i></span>
        </div>
        <div class="tree-box">
            <div class="zTreeDemoBackground left">
                <ul id="treeDemo" class="ztree"></ul>
            </div>
        </div>
    </div>
    </div>
       <div v-if="show==='备份选项'" >
          <backupoption :show2="basicty"></backupoption>
    </div>
    <div v-if="show==='调度计划'" class="planinfo">
      <Form ref="plan" :model="plan" :label-width="80">
        <FormItem label="调度类型">
          <Select v-model="plan1" style="width:120px" @on-change="onplantype">
            <Option v-for="item in plantype" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="备份类型">
          <Select v-model="plan1" style="width:120px">
            <Option v-for="item in planbackups" :value="item.value" :key="item.value"></Option>
          </Select>
        </FormItem>
        <div v-if="show3==='日期'">
          <FormItem label="开始时间" class="plandate">
            <DatePicker type="date" show-week-numbers placement="bottom-end" placeholder="Select date"></DatePicker>
          </FormItem>
          <FormItem label="结束时间" class="plandate">
            <DatePicker type="date" show-week-numbers placement="bottom-end" placeholder="Select date"></DatePicker>
          </FormItem>
        </div>
        <div v-if="show3==='周'">
          <FormItem label="选择时间" class="planweek">
            <DatePicker type="daterange" :options="options2" placement="bottom-end" placeholder="选择时间" style="width: 300px"></DatePicker>
          </FormItem>
        </div>
        <div v-if="show3==='时间间隔'">
          <FormItem label="开始时间">
            <DatePicker type="daterange" show-week-numbers placement="bottom-end" placeholder="Select date" style="width: 410px"></DatePicker>
          </FormItem>
        </div>
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
        callback: {
          onClick: this.zTreeOnClick
        }
      },
      zNodes: [],
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
      planbackups: [
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
      plan: {},
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
      console.log(data1);
      const array = [];
      for (let i = 0; i < data1.length; i++) {
        let item = data1[i];
        array.push(
          (item = {
            id: item.id,
            name: item.machine
          })
        );
      }
      return array;
    }
  },
  methods: {
    clicks() {
      console.log(this.policyData, "1ss");
    },
    alick: function(value) {
      // 提交到父组件 用以保存
      this.$emit("switchBasicty", value);
    },
    onplantype: function(value) {
      this.show3 = value;
    },
    freshArea: function() {
      $.fn.zTree.init($("#treeDemo"), this.setting, this.data3);
    },
    zTreeOnClick: function(event, treeId, treeNode) {
      console.log(event, treeId, treeNode);
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
