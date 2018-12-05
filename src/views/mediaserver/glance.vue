<style>
</style>
<template>
  <Modal v-model="browse" title="浏览磁盘设备目录" @on-ok="ok" @on-cancel="cancel" class="content">
    <Tree :data="data1" @on-select-change="treeData"></Tree>
  </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      data1:[
        {
          title: '选择路径',
          // expand: true,
          children: [
            {
              title: this.device
            }
          ]
        }
      ],
      browse: false,
      selServiceList: [],
      medium: [],
      cityList: []
    }
  },
  props: {
    device: Array
  },
  // 获取路径
  created() {
  },
  methods: {
    treeData: function() {
      console.log("aaa",this.device)
    },
    newGlance: function() {
      this.browse = true
    },
    ok() {
      this.$store.commit('getModalGlance', false)
      console.log("666",this.device)
    },
    cancel() {
      this.$store.commit('getModalGlance', false)
    }
  }
}
</script>
