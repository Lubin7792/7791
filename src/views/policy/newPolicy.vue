<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
</style>
<template>
  <Modal
    class="policyModal"
    v-model="InfoModal"
    title="新建策略"
    @on-cancel="cancel"
    class-name="vertical-center-modal"
  >
    <Tabs type="card" :animated="false" @on-click="click" v-model="tabValue" >
      <TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index" ></TabPane>
    </Tabs>
    <NewContent :show="show" ref="newConten"  ></NewContent>
     <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" @click="ok">确定</Button>
   </div>
  </Modal>
</template>
<script>
import NewContent from "./newcontent.vue";
export default {
  data() {
    return {
      tabValue:'',
      InfoModal: this.modals,
      tabList: [
        {
          title: "基本信息"
        },
        {
          title: "备份资源列表"
        },
        {
          title: "备份选项"
        },
        {
          title: "调度计划"
        }
      ],
      show: "基本信息",
      basicty: "",
    };
  },
  components: {
    NewContent
  },
  props: {
    modals: {
      type: Boolean
    }
  },
  beforeCreate() {
    this.name = "调度计划";
  },
  methods: {
    //子组件调用  
    delTabList: function() {
      this.tabList.splice(2, 1);
    },
    addTabList: function() {
      if (this.tabList.length == 3) {
        this.tabList.splice(2, 0, { title: "备份选项" });
      }
    },
    closeOpen:function (state) {
      this.$emit("closePolicy", state);
    },
    ok: function() {
      this.$refs.newConten.policypost();
    },
    cancel: function() {
      this.$emit("closePolicy", false);
    },
    click: function(name) {
      this.show = name;
    }
  },
  watch: {
    modals(modals) {
      this.InfoModal = modals;
    }
  }
};
</script>