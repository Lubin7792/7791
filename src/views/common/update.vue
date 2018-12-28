<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal-close {
  }
  .ivu-modal {
    top: 0;
  }
}
</style>
<template>
  <div>
    <Modal
      v-model="updateModal"
      class-name="vertical-center-modal"
      :title="title"
      @on-ok="ok"
      @on-cancel="cancel"
      id="modal"
    >
      <Tab :values="tabName"></Tab>
    </Modal>
  </div>
</template>
<script>
import Tab from "./tab.vue";
export default {
  components: {
    Tab
  },
  data() {
    return {
      // tabName: '131072'
    };
  },
  // updated: function() {
  //   this.tabName = 'basic'
  // },
  computed: {
    updateModal: {
      get: function() {
        return this.$store.state.updateModal;
      },
      set: function(obj) {}
    },
    title() {
      return this.$store.state.title;
    },
    getBasic() {
      return this.$store.state.returnMessage;
    },
    tabName: {
      get: function() {
        return this.$store.state.clientTitle;
      },
      set: function(obj) {}
    }
  },
  methods: {
    ok() {
      // this.updateModal=false;
      this.$store.commit("updateFalse", false);
      // this.tabName = "basic";
    },
    cancel() {
      // this.updateModal=false;
      this.$store.commit("updateFalse", false);
      // this.tabName = "basic";
    }
  },
  watch: {
    getBasic() {
      this.$store.commit("clientTitle", "basic");
    }
  }
};
</script>
