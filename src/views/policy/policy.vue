<style>
@import "./policy.css";
</style>

<template>
  <div class="policy">
    <div class="buttonC">
      <Button type="error" style="margin-top:15px;" @click="newPolicy" v-if="nowShow(getPower.newPolicy)">新建策略</Button>
    </div>
    <Table border :columns="policyColumns" :data="policiesData" ref="exp"></Table>
    <newPolicy ref="newPolicyData" :modals="modalss" @closePolicy="closePolicy"></newPolicy>
    <updatePolicy :upmodal="modal" @close="revise"></updatePolicy>
    <Modal
      v-model="modalDelete"
      @on-ok="ok"
      ok-text="确认删除"
      cancel-text="取消"
      :closable="false"
      class-name="vertical-center-modal"
    >
      <p style="color:#f60;text-align:center;font-size:16px;">确认是否删除该策略，如果确认删除请点击删除，否认点击取消。</p>
    </Modal>
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
      modalDelete: false,
      _index: Number,
      policyId: "",
      postBackData: [],
      numNowList:[],
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
                 this.nowShow(this.getPower.enablePolicy)?h(
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
                ):''
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
                this.nowShow(this.getPower.dispatchPolicy)?h(
                  "Dropdown",
                  {
                    props: {
                      trigger: "click"
                    }
                  },
                  [
                    h(
                      "Icon",
                      {
                        props: {
                          type: "settings",
                          size: "25"
                        },
                        on: {
                          click: () => {
                            this.buttonPost(params);
                          }
                        },
                        style: {
                          marginRight: "15px"
                        }
                      },
                      "立即调度"
                    ),
                    h(
                      "DropdownMenu",
                      { slot: "list" },
                      this.postBackData.map(item => {
                        return [
                          h(
                            "DropdownItem",
                            {
                              nativeOn: {
                                click: () => {
                                  let url =
                                    "/rest-ful/v3.0/policy/schedule/" +
                                    params.row.id +
                                    "?type=" +
                                    item.type;
                                  util.restfullCall(
                                    url,
                                    null,
                                    "get",
                                    this.nowCallBack
                                  );
                                }
                              }
                            },
                            item.name
                          )
                        ];
                      })
                    )
                  ]
                ):'',
               this.nowShow(this.getPower.editPolicy)? h(
                  "Icon",
                  {
                    props: {
                      type: "edit",
                      size: "25"
                    },
                    style: {
                      marginRight: "15px"
                    },
                    on: {
                      click: () => {
                        this.modal = true;
                        util.restfullCall(
                          "/rest-ful/v3.0/policy/detail/" + params.row.id,
                          null,
                          "get",
                          this.detailData
                        );
                      }
                    }
                  },
                  "修改策略"
                ):"",

               this.nowShow(this.getPower.deletePolicy)? h(
                  "Icon",
                  {
                    props: {
                      type: "trash-a",
                      size: "25"
                    },
                    on: {
                      click: () => {
                        this.policyId = params.row.id;
                        this.modalDelete = true;
                      }
                    },
                    style: {}
                  },
                  "删除策略"
                ):''
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
    this.$store.dispatch("getPrivilege",this.$store.state.power.module.policy);
    util.restfullCall("/rest-ful/v3.0/clients", null, "get", this.clientsData);
    util.restfullCall("/rest-ful/v3.0/devices", null, "get", this.devicesData);
  },
  computed: {
    policiesData() {
      return this.$store.state.index.policiesData;
    },
     getPrivilege(){
      return this.$store.state.index.privilegeData
    },
          getPower(){
      return this.$store.state.power.name
    },
  },
  watch: {
      getPrivilege(data){
      this.numNowList=data
    }
  },
  methods: {
       nowShow(num){
      if(this.numNowList.indexOf(num)!=-1){
        return true
      }else{
        return false
      }
    },
    ok: function() {
      util.restfullCall(
        "/rest-ful/v3.0/policy/" + this.policyId,
        null,
        "delete",
        this.deleteData
      );
    },
    deleteData: function(value) {
      if (value.data.code === 0) {
        this.$store.commit("upPolicyOk", !this.$store.state.index.policySwitch);
        alert(value.data.message);
      } else {
        alert(value.data.message);
      }
    },
    // 废弃修改列表备份类型数据
    scheduletype(obj, scheduletype) {
      this.policiesData[scheduletype.index].scheduletypes.name =
        obj.data[0].name;
      this.policiesData[scheduletype.index].scheduletypes.type =
        obj.data[0].type;
      this.$nextTick(() => {
        this.$refs.exp.$children[1].$children[
          scheduletype.index
        ].$children[9].$children[1].currentVisible = true;
      });
    },
    buttonPost(params) {
      util.restfullCalls(
        "/rest-ful/v3.0/policy/scheduletype/" +
          this.policiesData[params.index].id,
        null,
        "get",
        this.postBack
      );
    },
    postBack: function(params) {
      this.postBackData = params.data;
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
      if(obj.data.code==0){
        console.log(obj.data.message);
      }
    },
    close: function(modal) {
      this.modal = modal;
    },
    newPolicy: function() {
      this.modalss = true;
        // this.$refs.newPolicy.basic.type="65536";
this.$refs.newPolicyData.$refs.newConten.callBackFun() ;
// console.log(this.$refs.newPolicyData.$refs.newConten.callBackFun)
// this.$refs.newPolicyData.$refs.newConten.basic.type="65536" 

    },
    closePolicy: function(modalss) {
      this.modalss = modalss;
    },
    revise: function(show) {
      this.modal = show;
    },
    //启动
    switch(params, value) {
      if (value) {
        this.policiesData[params.index].enable = 1;
        util.restfullCall(
          "/rest-ful/v3.0/policy/enable/" + params.row.id + "?method=enable",
          null,
          "get",
        obj=>{
          if(obj.data.code!=0){
        this.policiesData[params.index].enable = 0;

      }
        }
        );
      } else {
        this.policiesData[params.index].enable = 0;
        util.restfullCall(
          "/rest-ful/v3.0/policy/enable/" + params.row.id + "?method=disable",
          null,
          "get",
          obj=>{
          if(obj.data.code!=0){
        this.policiesData[params.index].enable = 1;
      }
        }
        );
      }
    },
    //修改策略信息
    detailData: function(obj) {
      this.$store.commit("existData", obj.data.policy);
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