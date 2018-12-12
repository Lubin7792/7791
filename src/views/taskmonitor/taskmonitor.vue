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
          title: "客户端",
          width: 160,
          key: "client"
        },
        {
          title: "介质服务器",
          key: "mediaServer"
        },
        {
          title: "设备",
          width: 80,
          key: "device"
        },
        {
          title: "开始时间",
          key: "startTime"
        },
        {
          title: "耗时",
          width: 80,
          key: "usedtime"
        },
        {
          title: "备份数据量",
          width: 100,
          key: "bytes"
        },
        {
          title: "文件",
          width: 80,
          key: "files"
        },
        {
          title: "速率",
          width: 80,
          key: "rate"
        },
        {
          title: "调度策略",
          key: "policy"
        },
        {
          title: "状态",
          width: 80,
          key: "state"
        },
        {
          title: "介质",
          key: "pool"
        },
        {
          title: "任务日志",
          key: "taskLog"
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
      for (let i = 0; i < objj.length; i++) {
        this.taskMonitor.push({
          taskID: objj[i].id,
          client: objj[i].client,
          mediaServer: objj[i].mediaserver,
          device: objj[i].device,
          startTime: objj[i].starttime,
          usedtime: objj[i].usedtime,
          bytes: objj[i].bytes,
          files: objj[i].files,
          rate: objj[i].rate,
          policy: objj[i].policy,
          state: objj[i].state,
          pool: objj[i].pool,
          taskLog: objj[i].taskLog
        });
      }
    },
    refreshData() {
      this.timer =  setInterval(() => {
        console.log(1)
        // util.restfullCall(
        //   "/rest-ful/v3.0/task/monitor",
        //   null,
        //   "get",
        //   this.dealingData
        // );
      }, 1000); //此处要理解为什么是1000*i
    }
  },
  created() {
    // util.restfullCall(
    //   "/rest-ful/v3.0/task/monitor",
    //   null,
    //   "get",
    //   this.dealingData
    // );
    // this.refreshData();
  },
  beforeDestroy() {
    if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
        clearInterval(this.timer); //关闭
    }
}
};
</script>
