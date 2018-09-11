<style>
</style>
<template>
  <div>
    <Col span="24" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
        <Tabs type="card" :animated="false" @on-click="click">
            <TabPane v-for="tab in tabList" :label="tab.title" :name="tab.title">
              <Content  :columns="columns" :show="show"></Content>
            </TabPane>
        </Tabs>
    </Col>
  </div>
</template>
<script>
import Content from "./content.vue";
export default {
  components: {
    Content
  },
  data() {
    return {
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
          key: "id"
        },
        {
          title: "策略",
          key: ""
        },
        {
          title: "开始时间",
          key: "timeStart"
        },
        {
          title: "结束时间",
          key: "timeCons"
        },
        {
          title: "备份大小",
          key: "backup"
        },
        {
          title: "速率",
          key: "file"
        },
        {
          title: "介质服务器",
          key: "client"
        },
        {
          title: "状态",
          key: "resource"
        },
      ],
      show: "运行记录报表"
    };
  },
  methods: {
    click: function(name) {
      if (name == "运行记录报表") {
        this.columns = [
          {
            title: "ID",
            key: "id"
          },
          {
            title: "策略",
            key: "timeStart"
          },
          {
            title: "开始时间",
            key: "timeStart"
          },
          {
            title: "结束时间",
            key: "timeCons"
          },
          {
            title: "备份大小",
            key: "backup"
          },
          {
            title: "速率",
            key: "file"
          },
          {
            title: "介质服务器",
            key: "client"
          },
          {
            title: "状态",
            key: "resource"
          },
        ];
        this.show = "运行记录报表";
      }
      if (name == "设备报表") {
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
        this.show = "设备报表";
      }
      if (name == "介质报表") {
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
        this.show = "介质报表";
      }
    }
  }
};
</script>
