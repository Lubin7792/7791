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
	<Modal  class="policyModal" v-model="InfoModal" title="新建策略" @on-ok="ok" @on-cancel="cancel" ok-text="确定" class-name="vertical-center-modal">
<Tabs type="card" :animated="false" @on-click="click" value="">
     	<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
      </TabPane>
    </Tabs>  
      <NewContent :show="show"  ref="newConten"></NewContent>
  </Modal>
</template>
<script>
import NewContent from "./newcontent.vue";
export default {
  data() {
    return {
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
      basicty: ""
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
    ok: function() {
      this.$emit("closePolicy", false);
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