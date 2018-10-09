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

	<Modal v-model="newmodal" title="新建策略" @on-ok="ok" @on-cancel="cancel" ok-text="确定" class-name="vertical-center-modal">
<Tabs type="card" :animated="false" @on-click="click">
     	<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
      <NewContent :show="show" ></NewContent>
      </TabPane>
    </Tabs>  
  </Modal>
</template>
<script>
import NewContent from "./newcontent.vue";
export default {
  data() {
    return {
      tabList: [
        {
          title: "基本信息"
        },
        {
          title: "备份选项"
        },
        {
          title: "备份资源列表"
        },
         {
          title: "调度计划"
        }
      ],
      show: "基本信息"
    };
  },
  components: {
    NewContent
  },
  props: {
    newmodal: {
      type: Boolean
    }
  },
  methods: {
    ok: function() {
      this.$emit("closePolicy", false);
    },
    cancel: function() {
      this.$emit("closePolicy", false);
    },
    click: function(name) {
      this.show = name;
    }
  }
}
</script>