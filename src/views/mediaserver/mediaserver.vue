<style>
@import "./mediaserver.css";
</style>
<template>
	<div>
		 <Col span="24" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
            <Tabs type="card" :animated="false" @on-click="click">
            	<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
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
          title: "介质服务器"
        },
        {
          title: "磁盘"
        },
        {
          title: "磁带库"
        }
      ],
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "设备数量",
          key: "number"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "IP地址",
          key: "address"
        },
        {
          title: "操作系统",
          key: "system"
        },
        {
          title: "软件版本",
          key: "status"
        },
        {
          title: "状态",
          key: "state"
        }
      ],
      show: "介质服务器"
    };
  },
  methods: {
    click: function(name) {
      if (name == "介质服务器") {
        this.columns = [
          {
            title: "名称",
            key: "name"
          },
          {
            title: "设备数量",
            key: "number"
          },
          {
            title: "类型",
            key: "type"
          },
          {
            title: "IP地址",
            key: "address"
          },
          {
            title: "操作系统",
            key: "system"
          },
          {
            title: "软件版本",
            key: "status"
          },
          {
            title: "状态",
            key: "state"
          }
        ];
        this.show = "介质服务器";
      }
      if (name == "磁盘") {
        this.columns = [
          {
            title: "名称",
            key: "name"
          },
          {
            title: "设备路径",
            key: "path"
          },
          {
            title: "介质服务器",
            key: "server"
          },
          {
            title: "存储容量",
            key: "capacity"
          },
          {
            title: "状态",
            key: "state"
          }
        ];
        this.show = "磁盘";
      }
      if (name == "磁带库") {
        this.columns = [
          {
            title: "名称",
            key: "name"
          },
          {
            title: "介质服务器",
            key: "server"
          },
          {
            title: "设备序列号",
            key: "serialNumber"
          },
          {
            title: "槽位数",
            key: "slotNumber"
          },
          {
            title: "驱动器数量",
            key: "number"
          },
          {
            title: "状态",
            key: "state"
          }
        ];
        this.show = "磁带库";
      }
    }
  }
};
</script>