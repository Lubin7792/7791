<style>
</style>
<template>
  <Modal title="设置权限" v-model="nowShow" @on-ok="ok" @on-cancel="cancel" ok-text="确定">
    <div>asdasd</div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
        nowShow:this.show
    };
  },
  props: {
    show: {
      type: Boolean
    }
  },
  methods: {
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
    }
  }
};
</script>