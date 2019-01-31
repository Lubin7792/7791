import Vue from "vue";
import Vuex from "vuex";
import util from "../libs/util.js";
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    title: "",
    //管理update时的弹出控件
    updateModal: false,
    //管理客户端标签页数据
    clientList: [],
    clientTitle: "basic",
    clientId: "",
    url: "",
    returnMessage: {},
    //标签页title接口地址
    tabsUrl: "",
    //临时测试
    id: "",
    columns: [],
    oracle: [],
    postData: "",
    //校验新建是否成功的返回值
    code: "",
    //当前要修改或删除的对象的id
    instanceId: "",
    //初始tab标签页
    // tabName: "basic",
    modal: false,
    policySwitch: false,
    modalDisk: false,
    modalLibrary: false,
    modalGlance: false,
    policyData: [],
    policyType: [],
    policiesData: [],
    devicesList: []
  },
  mutations: {
    //更改updateModal的函数,使控件出现
    updateTrue(state) {
      state.updateModal = true;
    },
    //更改updateModal的函数，使控件隐藏
    updateFalse(state) {
      state.updateModal = false;
    },
    getModal(state, modal) {
      state.modal = modal;
    },
    getModalDisk(state, modalDisk) {
      state.modalDisk = modalDisk;
    },
    getModalLibrary(state, modalLibrary) {
      state.modalLibrary = modalLibrary;
    },
    getModalGlance(state, modalGlance) {
      state.modalGlance = modalGlance;
    },
    //更改客户端标签的title
    clientTitle(state, title) {
      state.clientTitle = title;
    },
    getTab(state, tabName) {
      // console.log(tabName);
      state.tabName = tabName;
    },
    //获得当前行的客户id
    getClientId(state, id) {
      state.clientId = id;
    },
    //获取当前方法需要的url
    getUrl(state, url) {
      state.url = url;
    },
    getColumns(state, columns) {
      // console.log(columns);
      state.columns = columns;
    },
    //clice-basic数据
    getBasic(state, obj) {
      state.returnMessage = obj.row;
    },
    //返回的数据处理
    getReturnMessage(state, obj) {
      //客户端配置基本信息页详细信息
      if (obj[1] == 0) {
        state.returnMessage = obj[0].data.client;
      }
      //tabs名称
      let clientList = [];
      clientList.push({
        title: "基本信息",
        name: "basic"
      });
      for (let i = 0; i < obj[0].data.agents.length; i++) {
        // if (!(obj[0].data.agents[0].type === 65536)) {
          clientList.push({
            title: obj[0].data.agents[i].name,
            name: obj[0].data.agents[i].type.toString(),
            key: obj[0].data.agents[i].type
          });
        // }
      }
      //删除列表中的文件系统
      function clientl(element) {
        return element.key !== 65536;
      }
      state.clientList = clientList.filter(clientl);
    },
    //oracle
    getOracle(state, oracle) {
      // console.log(4);
      state.oracle = oracle;
    },
    //模态框title
    getTitle(state, title) {
      state.title = title;
    },
    getId(state, id) {
      state.id = id;
    },
    getPostData(state, postData) {
      state.postData = postData;
    },
    //判断是否成功
    getCode(state, code) {
      state.code = code;
    },
    getInstanceId(state, instanceId) {
      state.instanceId = instanceId;
    },
    //客户端
    saveClientsData(state, policyOs) {
      state.policyData = policyOs;
    },
    savePolicyType(state, policyTy) {
      state.policyType = policyTy;
    },
    saveDevicesData(state, devices) {
      state.devicesList = devices;
    },
    policiesData(state, policyDa) {
      state.policiesData = policyDa;
    },
    //新建请求成功
    upPolicyOk(state, policyDa) {
      state.policySwitch = policyDa;
    }
  },
  actions: {
    //获取数据
    getData(state, number) {
      if (number == 0) {
        let url = this.state.url + this.state.clientId;
        util.restfullCall(url, null, "get", obj => {
          let arr = [];
          arr.push(obj);
          arr.push(number);
          state.commit("getReturnMessage", arr);
        });
      }
      if (number == 1) {
        console.log(1);
        let url = this.state.url + this.state.clientId + "&type=1";
        util.restfullCall(url, null, "get", obj => {
          console.log(3);
          let data = [];
          for (let i = 0; i < obj.data.length; i++) {
            let object = JSON.parse(obj.data[i].conf);
            object.id = obj.data[i].id;
            data.push(object);
          }
          state.commit("getOracle", data);
        });
      }
      if (number == 2) {
        util.restfullCall(this.state.url, this.state.postData, "post", obj => {
          console.log(obj.data.id);
          state.commit("getCode", obj.data.code);
          state.commit("getInstanceId", obj.data.id);
        });
      }
      if (number == 3) {
        util.restfullCall(this.state.url, this.state.postData, "put", obj => {
          // console.log(obj);
          state.commit("getCode", obj.data.code);
          state.commit("getInstanceId", obj.data.id);
        });
      }
      if (number == 4) {
        util.restfullCall(
          this.state.url,
          this.state.postData,
          "delete",
          obj => {
            state.commit("getCode", obj.data.code);
            state.commit("getInstanceId", obj.data.id);
          }
        );
      }
    },
    //获取tabs标签页名称
    getTabsTitle(state, number) {
      util.restfullCall(
        "rest-ful/v3.0/client/agents?client=" + number,
        null,
        "get",
        obj => {
          let arr = [];
          arr.push(obj);
          arr.push(number);
          state.commit("getReturnMessage", arr);
        }
      );
    }
  }
});
export default store;
