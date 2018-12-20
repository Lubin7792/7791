<style>
</style>
<template>
  <div>
    <Col span="24" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
      <Tabs type="card" :animated="false" @on-click="click">
        <TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
          <Table :columns="columns" :data="datas"></Table>
        </TabPane>
      </Tabs>
    </Col>
  </div>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
      datas:[],
      tabList: [
        {
          title: "运行记录报表"
        },
        {
          title: "设备报表"
        },
        {
          title: "介质报表"
        }
      ],
      columns: [
        {
          title: "ID",
          width: 80,
          key: "id",
          sortable: true

        },
        {
          title: "备份类型",
          width: 90,
          key: "type"
        },
        {
          title: "客户端",
          key: "client"
        },
        {
          title: "策略",
          width: 60,
          key: "policy"
        },
        {
          title: "开始时间",
          sortable: true,
          key: "starttime"
        },
        {
          title: "结束时间",
          sortable: true,
          key: "endtime"
        },
        {
          title: "调用类型",
          width: 90,
          key: "scheduletype"
        },
        {
          title: "文件",
          width: 60,
          key: "files"
        },
        {
          title: "速率",
          key: "bytes"
        },
        {
          title: "设备",
          key: "device"
        },
        {
          title: "介质池",
          width: 120,
          key: "pool"
        },
         {
          title: "结果",
          key: "result"
        }
      ],
      show: "运行记录报表"
    };
  },
  created() {
     util.restfullCall(
          "/rest-ful/v3.0/history",
          null,
          "get",
          this.historyData
        );
  },
  methods: {
    click: function(name) {
      if (name == "运行记录报表") {
        this.columns = [
           {
          title: "ID",
          width: 80,
          key: "id",
          sortable: true

        },
        {
          title: "备份类型",
          width: 90,
          key: "type"
        },
        {
          title: "客户端",
          key: "client"
        },
        {
          title: "策略",
          width: 60,
          key: "policy"
        },
        {
          title: "开始时间",
          sortable: true,
          key: "starttime"
        },
        {
          title: "结束时间",
          sortable: true,
          key: "endtime"
        },
        {
          title: "调用类型",
          width: 90,
          key: "scheduletype"
        },
        {
          title: "文件",
          width: 60,
          key: "files"
        },
        {
          title: "速率",
          key: "bytes"
        },
        {
          title: "设备",
          key: "device"
        },
        {
          title: "介质池",
          width: 120,
          key: "pool"
        },
         {
          title: "结果",
          key: "result"
        }
        ];
        // this.show = "运行记录报表";
        util.restfullCall(
          "/rest-ful/v3.0/history",
          null,
          "get",
          this.historyData
        );
      }
      if (name == "设备报表") {
        this.datas = [];
        this.columns = [
          {
            title: "客户端名称",
            key: "client"
          },
          {
            title: "备份次数",
            key: "backup"
          },
          {
            title: "成功次数",
            key: "success"
          },
          {
            title: "失败次数",
            key: "failures"
          },
          {
            title: "备份总数据量",
            key: "backupTotal"
          }
        ];
        // this.show = "设备报表";
      }
      if (name == "介质报表") {
      this.datas = [];
        this.columns = [
          {
            title: "Barcode ",
            key: "barcode "
          },
          {
            title: "标签",
            key: "label"
          },
          {
            title: "使用容量",
            key: "state"
          },
          {
            title: "介质池",
            key: "mediaPool"
          },
          {
            title: "最后写入时间",
            key: "writeTime"
          },
          {
            title: "设备",
            key: "equipment"
          }
        ];
        // this.show = "介质报表";
      }
    },
    historyData(obj) {
      let objj = obj.data;
      this.datas = [];
      for (let i = 0; i < objj.length; i++) {
        this.datas.push({
          id: objj[i].id,
          type: objj[i].type,
          client: objj[i].client,
          policy: objj[i].policy,
          starttime: objj[i].starttime,
          endtime: objj[i].endtime,
          scheduletype: objj[i].scheduletype,
          files: objj[i].files,
          bytes: objj[i].bytes,
          device: objj[i].device,
          pool: objj[i].pool,
          result: objj[i].result
        });
      }
    }
  }
};
</script>
