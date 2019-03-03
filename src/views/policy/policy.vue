<style>
@import "./policy.css";
</style>

<template>
  <div class="policy">
    <div class="buttonC">


      <!-- <Button type="error" style="margin-top:15px;" @click="click">新建策略</Button> -->
      <Button type="error" style="margin-top:15px;" @click="newPolicy">新建策略</Button>
    </div>
    <Table border :columns="policyColumns" :data="policiesData" ref="exp"></Table>
    <newPolicy ref="truefalse" :modals="modalss" @closePolicy="closePolicy"></newPolicy>
    <updatePolicy :upmodal="modal" @close="revise"></updatePolicy>
  </div>
</template>
<script>
import updatePolicy from "./updatePolicy.vue";
import util from "../../libs/util.js";
import newPolicy from "./newPolicy.vue";
export default {
  data() {
    return {
      modalss: false,
      modal: false,
      _index: Number,
      shiliS: [
        {
          enable: 1,
          id: 12,
          key: "阿萨德",
          maxtasks: 0,
          mediaserver: "testmediaserver",
          name: "增量",
          pool: "空白介质池",
          privilege: "",
          savedays: 0,
          scheduletypes: { name: "再次点击", type: "再次点击" },
          type: "文件备份"
        },
        {
          enable: 1,
          id: 13,
          key: "阿萨asd德",
          maxtasks: 0,
          mediaserver: "testmediaserver",
          name: "增量sss",
          pool: "空白介质池",
          privilege: "",
          savedays: 0,
          scheduletypes: { name: "1", type: "1" },
          type: "文件备份"
        }
      ],
      policyColumns: [
        {
          title: "ID",
          width: 80,
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
          key: "device"
        },
        {
          title: "状态",
          key: "enable",
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
                        this.policiesData[params.index].enable === 1
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
                )
              ]
            );
          }
        },
        {
          title: "操作栏",
          width: 400,
          key: "operation",
          render: (h, params) => {
            var data = this.policiesData[params.index];
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
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        util.restfullCalls(
                          "/rest-ful/v3.0/policy/scheduletype/" +
                            this.policiesData[params.index].id,
                          null,
                          "get",
                          this.scheduletype,
                          params
                        );
                      }
                    },
                    style: {
                      verticalAlign: "middle",
                      backgroundColor: "#ed3f14",
                      padding: "2px",
                      marginLeft: "-4px",
                      color: "#fff",
                      borderRadius: "4px 0 0 4px"
                    }
                  },
                  "立即调度"
                ),
                h(
                  "Dropdown",
                  {
                    props: {
                      trigger: "click"
                    },
                    ref:'conten',
                    style: {},
                    on: {
                      "on-click": name => {
                        console.log("111");
                        if (data.scheduletypes.name) {
                          let url =
                            "/rest-ful/v3.0/policy/schedule/" +
                            params.row.id +
                            "?type=" +
                            data.scheduletypes.type;
                          util.restfullCall(url, null, "get", this.nowCallBack);
                        }
                      }
                    }
                  },
                  [
                    h(
                      "Button",
                      {
                        style: {
                          margin: "0 4px 0 1px",
                          borderColor: "#FFF",
                          padding: "0"
                        },
                        on: {
                          click: () => {
                            this.buttonPost(params);
                          }
                        }
                      },
                      [
                        h("Icon", {
                          props: {
                            type: "arrow-down-b"
                          },
                          style: {
                            lineHeight: "24px",
                            verticalAlign: "middle",
                            backgroundColor: "#ed3f14",
                            padding: "0 7px",
                            fontSize: "20px",
                            lineHeight: "26px",
                            color: "#fff",
                            height: "24px",
                            borderRadius: " 0 4px 4px  0"
                          }
                        })
                      ]
                    ),
                    h(
                      "DropdownMenu",
                      {
                        slot: "list"
                      },
                      [
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: data.scheduletypes.type
                            }
                          },
                          data.scheduletypes.name
                            ? data.scheduletypes.name
                            : "请立即调度"
                        )
                      ]
                    )
                  ]
                ),

                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on:{
                      click:()=>{
                          util.restfullCall(
                          "/rest-ful/v3.0/policy/" +
                            params.row.id,
                          null,
                          "delete",
                          this.deleteData
                        );
                      }
                    },
                    style: {
                      marginRight: "4px"
                    }
                  },
                  "删除策略"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on:{
                      click:()=>{
                        this.modal= true;
                          util.restfullCall(
                          "/rest-ful/v3.0/policy/detail/" +
                            params.row.id,
                          null,
                          "get",
                          this.detailData
                        );
                      }
                    }

                  },
                  "修改策略"
                )
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
  watch: {

  },
  methods: {
    click(){
      let str="DESKTOP-VBD4GRU_D:/$RECYCLE.BIN"
      let newStr = str.substring(str.indexOf("_"))
      console.log(newStr)
    },
    deleteData:function (value) {
       if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.policySwitch);
          alert(value.data.message)
      }else{
        alert(value.data.message)
      }
    },
    // 修改列表备份类型数据
    scheduletype(obj, scheduletype) {
      this.policiesData[scheduletype.index].scheduletypes.name =
        obj.data[0].name;
      this.policiesData[scheduletype.index].scheduletypes.type =
        obj.data[0].type;
      this.$nextTick(()=>{
       this.$refs.exp.$children[1].$children[scheduletype.index].$children[9].$children[1].currentVisible = true;
      })
    },
    buttonPost(params) {
      util.restfullCalls(
        "/rest-ful/v3.0/policy/scheduletype/" +
          this.policiesData[params.index].id,
        null,
        "get",
        this.scheduletype,
        params
      );
    },
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
          status: objj[i].status
        });
      }
      this.$store.commit("saveDevicesData", devicesList);
    },
    enableCall(obj) {
      alert(obj.data.message);
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
     revise: function(show) {
      this.modal = show;
    },
    switch(params, value) {
      if (value) {
        this.policiesData[params.index].enable = 1;
        util.restfullCall(
          "/rest-ful/v3.0/policy/enable/" + params.row.id + "?method=enable",
          null,
          "get",
          this.enableCall
        );
      } else {
        this.policiesData[params.index].enable = 0;
        util.restfullCall(
          "/rest-ful/v3.0/policy/enable/" + params.row.id + "?method=disable",
          null,
          "get",
          this.enableCall
        );
      }
    },
    detailData:function(obj){
        this.$store.commit("existData",obj.data.policy)
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