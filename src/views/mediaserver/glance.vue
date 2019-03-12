<style>
.tree {
  width: 100%;
  float: left;
  height: 300px;
  overflow: auto;
}
.tree-box {
  height: 300px;
}
</style>
<template>
  <div>
    <Modal v-model="browse" title="浏览磁盘设备目录" @on-ok="ok" @on-cancel="cancel">
        <div class="tree-box">
          <div class="tree">
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
    </Modal>
  </div>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      setting: {
        check: {
          enable: true,
        },
        view: {
          selectedMulti: false
        },
        callback: {
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        }
      },
      browse: false,
      glancePath:''
    }
  },
  props: {
    device: {
      type:Array
    },
  },
  computed: {
    data3() {
      let data1 = [];
      data1 = this.device;
      const array = [];
      for (var i=0;i<data1.length;i++){
        array.push({
          name: data1[i].name,
          iconSkin:"diy02",
          id: data1[i].id,
          nocheck:true,
          nodetype: 0
        })
      }
      return array;
    }
  },
  watch: {
    data3: {
      handler(newVal, oldVal) {
        console.log('newVal', newVal)
        $.fn.zTree.init($("#treeDemo"), this.setting, this.data3);
      },
    }
  },
  
  methods: {
    build_path_by_tree_node: function(treeNode) {
      //获取路径  
      var path = "";
      var cid = 0;
      do {
        let parent = treeNode.getParentNode();
        if(!parent) {
          cid = treeNode.id;
          name = treeNode.name;
          break;
        }  

        if(parent.nodetype !=0 ) {
            path ="/" + treeNode.name +path;
        }else{
          path = treeNode.name + path
        }
        if(parent.nodetype !=1){

        }
          
        treeNode = parent;
      }while(true);
     
    },
     //获取子节点发送请求
    zTreeOnClick: function(event, treeId, treeNode) {
      console.log("treeNode1",treeNode)
      if (!treeNode.hasOwnProperty("children")) {
        let path = this.build_path_by_tree_node(treeNode);
      console.log("treeNode2",treeNode)
        let str =
          "/rest-ful/v3.0/devicepath?server=" +  path.client + "&path=" + path.path;
        util.restfullCall(str, null, "get", function(obj) {
          //返回数据处理
          var arrays = new Array();
          let objj = obj.data.pathlist;
          for (let i = 0; i < objj.length; i++) {
            arrays.push({
              name: objj[i],
              nodetype: 1
            });
          }
          let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
          ztreeobj.addNodes(treeNode, arrays);
        });
      }
    },
    // 选中节点
    zTreeOnCheck: function(event, treeId, treeNode) {
      let path = this.build_path_by_tree_node(treeNode);
      // let pathList = path.path;
      this.glancePath = path.path
    },
    ok() {
      this.$emit('glanceReturn',this.glancePath)
      this.browse = false
    },
    // 接收父组件的传递
    newGlance: function() {
      this.browse = true
    },
    cancel() {
      // this.$store.commit('getModalGlance', false)
      this.browse = false
    }
  }
}
</script>
