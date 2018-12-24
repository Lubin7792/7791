<style>
@import "./volume.css";
</style>
<template>
  <div>
    <Col span="24" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;">
      <Tabs type="card" :animated="false" @on-click="click">
        <TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
          <Table :columns="columns" :data="datas"></Table>
          <Content :show="show"></Content>
        </TabPane>
      </Tabs>
    </Col>
  </div>
</template>
<script>
import util from "../../libs/util.js";
import Content from "./content.vue";
export default {
  data() {
    return {
      datas: [],
      tabList: [
        {
          title: "介质池"
        },
        {
          title: "介质"
        }
      ],
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "介质名称",
          key: "name"
        },
        {
          title: "覆盖周期",
          key: "Cover"
        },
        {
          title: "保留周期",
          key: "Protected"
        }
      ],
      show: "介质池"
    };
  },
  components: {
    Content
  },
  methods: {
    click: function(name) {
      if (name == "介质池") {
        this.columns = [
          {
            title: "ID",
            sortable: true,
            key: "id"
          },
          {
            title: "介质名称",
            key: "name"
          },
          {
            title: "覆盖周期",
            sortable: true,
            key: "Cover"
          },
          {
            title: "保留周期",
            sortable: true,
            key: "Protected"
          }
        ];
        this.datas = [];
        this.show = "介质池";
        util.restfullCall(
          "/rest-ful/v3.0/volpools",
          null,
          "get",
          this.VRTSVolumeDataFormat
        );
      }
      if (name == "介质") {
        this.columns = [
          {
            title: "Barcode",
            key: "barcode"
          },
          {
            title: "介质名称",
            key: "name"
          },
          {
            title: "介质池",
            key: "pool"
          },
          {
            title: "已使用大小",
            key: "used"
          },
          {
            key: "LastWrtime",
            title: "最后写入时间"
          },
          {
            title: "状态",
            key: "state"
          },
          {
            title: "在线状态",
            key: "online"
          }
        ];
        this.show = "介质";
        this.datas = [];
        util.restfullCall(
      "/rest-ful/v3.0/volumes",
      null,
      "get",
      this.VRTSVolumeDataFormat
    );
      }
    },

    VRTSVolumeDataFormat(obj) {
      return (this.datas = obj.data.slice(0, obj.data.length));
      // console.log(obj);
    }
  },
  created() {
    util.restfullCall(
      "/rest-ful/v3.0/volpools",
      null,
      "get",
      this.VRTSVolumeDataFormat
    );
  }
};
</script>