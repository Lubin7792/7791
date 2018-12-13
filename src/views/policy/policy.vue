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
    <Table border :columns="policyColumns" :data="policyList"></Table>
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
      status: [false, false, false, false, false],
      _index: Number,
      policyColumns: [
        {
          title: "名称",
          key: "machine",
          sortable: true
        },
        {
          title: "策略类型",
          key: "version",
          sortable: true
        },
        {
          title: "优先级",
          key: "equipment",
          sortable: true
        },
        {
          title: "状态",
          key: "state",
          sortable: true
        },
        {
          title: "介质池",
          key: "os",
          sortable: true
        },
        {
          title: "介质服务器",
          key: "client",
          sortable: true
        },
        {
          title: "设备",
          key: "ip",
          sortable: true
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
                        this.policyList[params.index].state == 1 ? true : false
                    },
                    style: {
                      marginLeft: "10px",
                      marginRight: "10px",
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
                this.policyList[params.index].state == 1
                  ? h("i-select", { style: { width: "100px" } }, [
                      h(
                        "Option",
                        {
                          props: {
                            value: "0"
                          }
                        },
                        "全量备份"
                      ),
                      h(
                        "Option",
                        {
                          props: {
                            value: "1"
                          }
                        },
                        "增量备份"
                      ),
                      h(
                        "Option",
                        {
                          props: {
                            value: "2"
                          }
                        },
                        "差量备份"
                      )
                    ])
                  : ""
              ]
            );
          }
        }
      ],
      policyList: []
    };
  },
  component: {},
  components: {
    updatePolicy,
    newPolicy
  },
  created() {
    util.restfullCall("/rest-ful/v3.0/clients", null, "get", this.policyData);
  },
  methods: {
    timeShow: function() {
      console.log(111);
    },
    policyData: function(obj) {
      let objj = obj.data;
      for (let i = 0; i < objj.length; i++) {
        this.policyList.push({
          machine: objj[i].machine,
          os: objj[i].os,
          ip: objj[i].ip,
          id: objj[i].id,
          state: objj[i].state,
          version: objj[i].version,

          ce: 0
        });
      }
      this.$store.commit("savePolicyData", this.policyList);
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
        this.policyList[params.index].state = 1;
      } else {
        this.policyList[params.index].state = 0;
      }
    },
    //更新反馈信息某一字段
    updateFeedbackMessage(id, key, value) {
      var vm = this;
      var data = {
        id: id
      };
      data[key] = value;
      vm.$http
        .put("/v1/suggestion", data)
        .then(function(response) {
          if (response.data.code == "000000") {
            vm.$Message.info("更新成功");
            vm.getFeedbackMessages(); //获取table数据信息，这里调用是因为修改值之后马上可以更新table值
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取所有反馈信息列表
    getFeedbackMessages() {
      var vm = this;
      var url = "/v1/suggestions?";
      url = url + "pageNum=" + this.pageNum + "&pageSize=" + this.pageSize;
      if (this.createByValue != "") {
        url = url + "&createBy=" + this.createByValue;
      }
      if (this.dealModelValue != "") {
        url = url + "&treatment=" + this.dealModelValue;
      }
      this.$http
        .get(url)
        .then(response => {
          if (response.data.code == "000000") {
            vm.data1 = response.data.data;
            vm.pageTotal = parseInt(response.data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>