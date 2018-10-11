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
	<Modal title="修改配置" v-model="InfoModal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="关闭">
		<Tabs type="card" :animated="false" @on-click="click">
			<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
				<Content :show="show" ></Content>
			</TabPane>
		</Tabs>
	</Modal>
</template>
<script>
import Content from './content.vue'
export default {
  data() {
    return {
      InfoModal: this.upmodal,
      tabList: [
        {
          title: '基本信息'
        },
        {
          title: '备份资源'
        },
        {
          title: '备份选项'
        },
        {
          title: '调度计划'
        }
      ],
      show: '基本信息'
    }
  },
  components: {
    Content
  },
  props: {
    upmodal: {
      type: Boolean
    }
  },
  methods: {
    ok: function() {
      this.$emit('close', false)
    },
    cancel: function() {
      this.$emit('close', false)
    },
    click: function(name) {
      this.show = name
    }
  },
  watch: {
  upmodal (upmodal) {
    this.InfoModal = upmodal
  }
}
}
</script>