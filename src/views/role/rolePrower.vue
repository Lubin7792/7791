<style>
</style>
<template>
  <Modal title="设置权限" v-model="nowShow" @on-ok="ok" @on-cancel="cancel" ok-text="确定">
    <div>
       <div class="tree-box">
          <div class=" ">
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
      ztreeData:[],
      ztreeLength:'',
       setting: {
        check: {
          enable: true
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        }
      },
        nowShow:this.show,
        listData:[]
    };
  },
  props: {
    show: {
      type: Boolean
    }
  },
  created() {
     util.restfullCall("/rest-ful/v3.0/systemmodules", null, "get", this.roleData);
  },
  computed:{
    systemmodules:function () {
      return this.listData
    }
  },
  methods: {
    zTreeOnClick:function (event, treeId, treeNode) {
      let num = treeNode.id -1
      console.log( num)
        if (!treeNode.hasOwnProperty("children")) {
           let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
       ztreeobj.addNodes(treeNode, this.ztreeData[num]);
        }
     

    },
    privilegeData:function (data) {
      this.ztreeData.push(data.data)
        console.log( this.ztreeData)
      
    },
    roleData:function (data) {
     this.listData=data.data
    },
      ok: function() {
      this.$emit("close", false);
    },
    cancel: function() {
      this.$emit("close", false);
    }
  },
    watch: {
    show(now) {
      this.nowShow = now;
    },
    systemmodules(data){
      console.log(data.length)
      this.ztreeLength=data.length;
       $.fn.zTree.init($("#treeDemoB"), this.setting, data);
       for(let i=0;i<data.length;i++){
         util.restfullCall("/rest-ful/v3.0/privilege/"+data[i].id, null, "get", this.privilegeData);
       }
    }
  }
};
</script>