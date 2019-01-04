<template>
    <!-- 新建介质池弹框 -->
  <Modal v-model="modal" title="新建介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
    <Form :model="serverItem" :label-width="110" resetFields>
        <FormItem label="介质池名称">
            <Input v-model="serverItem.name" placeholder="请输入介质池名称"></Input>
        </FormItem>
        <FormItem label="保留周期">
            <InputNumber v-model="serverItem.Protected" placeholder="请输入保留周期"></InputNumber>
        </FormItem>
        <FormItem label="覆盖周期">
            <InputNumber width="100%" v-model="serverItem.Cover" placeholder="请输入覆盖周期"></InputNumber>
        </FormItem>
    </Form>
  </Modal>
</template>

<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      modal: false,
      serverItem: {
        name: '',
        Protected: null,
        Cover: null,
      },
    }
  },
  methods: {
    // 接收父组件
    newPools: function() {
      this.modal = true
    },
    // 点击确定把添加的数据传给服务器
    ok() {
      util.restfullCall('/rest-ful/v3.0/volpool',this.serverItem,'post',this.upload);
      this.modal = false
    },
    // 成功接收到回调数据,获取添加成功的表格数据
    upload(callback) {
      if(callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.callbackPool)
    },
    // 添加成功的表格数据传递给父组件
    callbackPool: function(poolObj) {
        var array = new Array()
        for (let i = 0; i < poolObj.data.length; i++) {
          array.push({
          id: poolObj.data[i].id,
          name: poolObj.data[i].name,
          Cover: poolObj.data[i].Cover,
          Protected: poolObj.data[i].Protected,
          type: poolObj.data[i].type
          })
        }
        this.$emit('Return',array)
    },
    cancel() {
      this.modal = false
      
      // this.$store.commit('getModal', false)
    }
  }
}
</script>

