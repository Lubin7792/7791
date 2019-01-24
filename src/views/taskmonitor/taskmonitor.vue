<template>
  <div>
    <Table
      border
      ref="selection"
      :columns="columns4"
      :data="taskMonitor"
    ></Table>
    <Button @click="handleSelectAll(true)">全选</Button>
    <Button @click="handleSelectAll(false)">全部清除</Button>
  </div>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "任务ID",
          width: 80,
          key: "taskID"
        },   
        {
          title: "策略",
          width: 160,
          key: "policy"
        },
        {
          title: "客户端",
          width: 160,
          key: "client"
        },
        {
          title: "介质服务器",
          key: "mediaserver"
        },
        {
          title: "设备",
          width: 80,
          key: "device"
        },
        {
          title: "开始时间",
          key: "starttime"
        },
        {
          title: "耗时",
          width: 80,
          key: "usedtime"
        },
        
        {
          title: "备份数据量",
          key: "bytes"
        },
        
        {
          title: "速率",
          key: "rate"
        },
        {
          title: "介质",
          key: "pool"
        },
        {
          title: "状态",
          width: 80,
          key: "state"
        }
      ],
      taskMonitor: []
    };
  },
  methods: {
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    dealingData: function(obj) {
      let objj = obj.data;
      this.taskMonitor = [];
      for (let i = 0; i < objj.length; i++) {
        this.taskMonitor.push({
          taskID: objj[i].id,
          policy: objj[i].policy,
          client: objj[i].client,
          mediaserver: objj[i].mediaserver,
          device: objj[i].device,
          starttime: objj[i].starttime,
          usedtime: objj[i].usedtime,
          files: objj[i].files,
          bytes: objj[i].bytes,
          rate: objj[i].rate,
          pool: objj[i].pool,
          state: objj[i].state
        });
      }
    },
    refreshData() {
      this.timer =  setInterval(() => {
        util.restfullCall(
          "/rest-ful/v3.0/task/monitor",
          null,
          "get",
          this.dealingData
        );
      }, 1000); 
    }
  },
  created() {
    util.restfullCall(
      "/rest-ful/v3.0/task/monitor",
      null,
      "get",
      this.dealingData
    );
    this.refreshData();
  },
  beforeDestroy() {
    if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(this.timer); //关闭
    }
}
};
</script>
