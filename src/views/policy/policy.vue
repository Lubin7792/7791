<style>
@import "./policy.css";
</style>

<template>
  <div class="policy">
    <div class="buttonC">
      <Button type="error" style="margin-top:15px;" @click="newPolicy">新建策略</Button>
      <Button type="error" style="margin-top:15px;">删除策略</Button>
      <Button type="error" style="margin-top:15px;" @click="updatePolicy">修改策略</Button>
    </div>
    <Table border :columns="policyColumns" :data="policiesData"></Table>
    <newPolicy ref="truefalse" :modals="modalss" @closePolicy="closePolicy"></newPolicy>
    <updatePolicy :upmodal="modal" @close="close"></updatePolicy>
  </div>
</template>
<script>
import updatePolicy from "./updatePolicy.vue";
import util from "../../libs/util.js";
import newPolicy from "./newPolicy.vue";
export default {
  data() {
    return {
      modalss: true,
      modal: false,
      _index: Number,
      policyColumns: [
        {
          title: "ID",
          key: "id",
          sortable: true
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "策略类型",
          key: "type"
        },
        {
          title: "优先级",
          key: "privilege"
        },
        {
          title: "状态",
          key: "state"
        },
        {
          title: "介质池",
          key: "pool"
        },
        {
          title: "介质服务器",
          key: "mediaserver"
        },
        {
          title: "保留天数",
          key: "savedays"
        },
        {
          title: "设备",
          key: "ip"
        },
        {
          title: "操作栏",
          width: 260,
          key: "operation",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  lubin: true
                },
                data() {
                  return {
                    status: true
                  };
                }
              },
              [
                h(
                  "i-switch",
                  {
                    props: {
                      type: "primary",
                      value:
                        this.policiesData[params.index].state === 1
                          ? true
                          : false
                    },
                    style: {
                      marginLeft: "5px",
                      marginRight: "5px",
                      width: "60px"
                    },
                    on: {
                      "on-change": value => {
                        this.switch(params, value);
                      }
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        slot: "open"
                      },
                      "启用"
                    ),
                    h(
                      "span",
                      {
                        slot: "close"
                      },
                      "禁用"
                    )
                  ]
                ),
                this.policiesData[params.index].state == 1
                  ? h(
                      "Button",
                      {
                        props: {
                          type: "error",
                          size: "small"
                        },
                        style: {
                          marginRight: "5px"
                        },
                        on: {
                          click: () => {
                            this.nowCall(params);
                          }
                        }
                      },
                      "立即调用"
                    )
                  : "",
                this.policiesData[params.index].state == 1
                  ? h(
                      "i-select",
                      {
                        style: { width: "80px" },
                        on: {
                          "on-change": (v, row) => {
                            var i = v;
                            this.selectOptions(i, params);
                          }
                        }
                      },
                      [
                         this.policiesData[params.index].scheduletypes == 1 ?'':h(
                            "Option",
                            {
                              props: {
                                value:this.policiesData[params.index].scheduletypes.type
                              }
                            },
                            this.policiesData[params.index].scheduletypes.name
                          )
                      ]
                    )
                  : ""
              ]
            );
          }
        }
      ]
    };
  },
  components: {
    updatePolicy,
    newPolicy
  },
  created() {
    util.restfullCall("/rest-ful/v3.0/clients", null, "get", this.clientsData);
    util.restfullCall("/rest-ful/v3.0/devices", null, "get", this.devicesData);
  },
  computed: {
    policiesData() {
      return this.$store.state.policiesData;
    }
  },
  methods: {
    scheduletype(obj, parameter) {
      this.$set(this.policiesData[parameter.index], "scheduletypes", {
        name: obj.data[0].name,
        type: obj.data[0].type
      });
    },
    selectOptions(v, params) {
      let url =
        "/rest-ful/v3.0/policy/schedule/" + params.row.id + "?type=" + v;
      util.restfullCall(url, null, "get", this.nowCallBack);
    },
    nowCall: function(params) {},
    nowCallBack: function(params) {
      alert(params.data.message);
    },
    timeShow: function() {},
    //客户端信息ztree
    clientsData: function(obj) {
      let objj = obj.data;
      let policyList = [];
      for (let i = 0; i < objj.length; i++) {
        policyList.push({
          machine: objj[i].machine,
          os: objj[i].os,
          ip: objj[i].ip,
          id: objj[i].id,
          state: objj[i].state,
          version: objj[i].version,
          ce: 0
        });
      }
      this.$store.commit("saveClientsData", policyList);
    },
    devicesData: function(obj) {
      let objj = obj.data;
      let devicesList = [];
      for (let i = 0; i < objj.length; i++) {
        devicesList.push({
          id: objj[i].id,
          type: objj[i].type,
          name: objj[i].name,
          server: objj[i].server,
          servername: objj[i].servername,
          enable: objj[i].enable,
          status: objj[i].status,
        });
      }
      this.$store.commit("saveDevicesData", devicesList);
    },
    updatePolicy: function() {
      this.modal = true;
    },
    close: function(modal) {
      this.modal = modal;
    },
    newPolicy: function() {
      this.modalss = true;
    },
    closePolicy: function(modalss) {
      this.modalss = modalss;
    },
    switch(params, value) {
      if (value) {
        this.policiesData[params.index].state = 1;
      } else {
        this.policiesData[params.index].state = 0;
      }
      util.restfullCalls(
        "/rest-ful/v3.0/policy/scheduletype/" +
          this.policiesData[params.index].id,
        null,
        "get",
        this.scheduletype,
        params
      );
    }
    // //更新反馈信息某一字段
    // updateFeedbackMessage(id, key, value) {
    //   var vm = this;
    //   var data = {
    //     id: id
    //   };
    //   data[key] = value;
    //   vm.$http
    //     .put("/v1/suggestion", data)
    //     .then(function(response) {
    //       if (response.data.code == "000000") {
    //         vm.$Message.info("更新成功");
    //         vm.getFeedbackMessages(); //获取table数据信息，这里调用是因为修改值之后马上可以更新table值
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },

    // //获取所有反馈信息列表
    // getFeedbackMessages() {
    //   var vm = this;
    //   var url = "/v1/suggestions?";
    //   url = url + "pageNum=" + this.pageNum + "&pageSize=" + this.pageSize;
    //   if (this.createByValue != "") {
    //     url = url + "&createBy=" + this.createByValue;
    //   }
    //   if (this.dealModelValue != "") {
    //     url = url + "&treatment=" + this.dealModelValue;
    //   }
    //   this.$http
    //     .get(url)
    //     .then(response => {
    //       if (response.data.code == "000000") {
    //         vm.data1 = response.data.data;
    //         vm.pageTotal = parseInt(response.data.message);
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
  }
};
</script>