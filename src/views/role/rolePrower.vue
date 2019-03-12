<style>
.tree-box {
  height: 300px;
  overflow: auto;
}
</style>
<template>
  <Modal title="设置权限" v-model="nowShow" @on-ok="ok" @on-cancel="cancel" ok-text="确定">
    <div>
      <div class="tree-box">
        <div class>
          <ul id="treeDemoB" class="ztree"></ul>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
      ztreeData: [],
      num: 0,
      ztreeLength: "",
      setting: {
        view: {
          dblClickExpand: false
        },
        check: {
          enable: true
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        }
      },
      nowShow: this.show,
      listData: []
    };
  },
  props: {
    show: {
      type: Boolean
    },
    postData: {
      type: Array
    },
       ztreeId: {
      type: Number
    }
  },
  created() {
    util.restfullCall(
      "/rest-ful/v3.0/systemmodules",
      null,
      "get",
      this.roleData
    );
  },
  computed: {
    systemmodules: function() {
      return this.listData;
    }
  },
  methods: {
    rolePost: function(params) {
      console.log(params);
    },
    zTreeOnClick: function(event, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeDemoB");
      zTree.expandNode(treeNode);
      // let num = treeNode.id -1
      //   if (!treeNode.hasOwnProperty("children")&&treeNode.level==0) {
      //      let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
      //  ztreeobj.addNodes(treeNode, this.ztreeData[num]);
      //   }
    },
    zTreeOnCheck: function(event, treeId, treeNode) {
      if (treeNode.checked) {
        this.ztreeData.push({ privilege: treeNode.id });
      } else {
        function dataFilter(data) {
          return data.privilege !== treeNode.id;
        }
        this.ztreeData = this.ztreeData.filter(dataFilter);
      }
      console.log(this.ztreeData)

    },
    privilegeData: function(data) {
      for (let i = 0; i < data.data.length; i++) {}

      this.listData[this.num].children = data.data;
      this.listData[this.num].nocheck = true;
      this.num++;

      if (this.num == this.ztreeLength) {
        // $.fn.zTree.init($("#treeDemoB"), this.setting, this.listData);
        // var zTree = $.fn.zTree.getZTreeObj("treeDemoB");
        // var node = zTree.getNodeByParam("id", 1);
        // zTree.selectNode(node);
        // zTree.expandNode(node, true, false, false);
      }
    },
    roleData: function(data) {
      this.listData = data.data;
    },
    ok: function() {
      util.restfullCall(
        "/rest-ful/v3.0/role/" + this.ztreeId + "/privilege",
        this.ztreeData,
        "put",
        this.roleBack
      );
      this.$emit("close", false);
    },
    cancel: function() {
      this.$emit("close", false);
    },
    roleBack: function(params) {
      console.log(params);
    }
  },
  watch: {
    show(now) {
      this.nowShow = now;
    },
    systemmodules(data) {
      this.ztreeLength = data.length;
      // $.fn.zTree.init($("#treeDemoB"), this.setting, data);
      for (let i = 0; i < data.length; i++) {
        util.restfullCall(
          "/rest-ful/v3.0/privilege/" + data[i].id,
          null,
          "get",
          this.privilegeData
        );
      }
    },
    postData(data) {
      this.ztreeData=JSON.parse(JSON.stringify(data));
      let array = [];
      let num = this.listData.length;
      for (let i = 0; i < data.length; i++) {
        array.push(data[i].privilege);
      }
      for (let i = 0; i < this.listData.length; i++) {
        for (let j = 0; j < this.listData[i].children.length; j++) {
          let listId= this.listData[i].children[j].id
            if(array.indexOf(listId)!=-1){
                this.listData[i].children[j].checked=true
            }else{
                this.listData[i].children[j].checked=false
            }
        }
      }
        $.fn.zTree.init($("#treeDemoB"), this.setting, this.listData);
        var zTree = $.fn.zTree.getZTreeObj("treeDemoB");
        // var node = zTree.getNodeByParam("id", 1);
        zTree.expandAll(true); 
        // zTree.selectNode(node);
        // zTree.expandNode(node, true, false, false);
    }
  }
};
</script>