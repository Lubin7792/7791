<template>
    <!-- 新建介质池弹框 -->
  <Modal v-model="modal" title="修改介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
    <Form :model="alterItem" :label-width="110" resetFields>
        <FormItem label="介质池名称">
            <Input v-model="alterItem.name" placeholder="请输入介质池名称"></Input>
        </FormItem>
        <FormItem label="保留周期">
            <InputNumber v-model="alterItem.Protected"></InputNumber><span>&nbsp(&nbsp天&nbsp)&nbsp</span>
        </FormItem>
        <FormItem label="覆盖周期">
            <InputNumber v-model="alterItem.Cover"></InputNumber><span>&nbsp(&nbsp天&nbsp)&nbsp</span>
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
      alterItem: {
        name: '',
        Protected: null,
        Cover: null,
        id: '',
      },
    }
  },
  methods: {
    // 接收父组件
    alterPools: function(row) {
      this.alterItem.name = row.name
      this.alterItem.id = row.id
      this.alterItem.Protected = row.Protected
      this.alterItem.Cover = row.Cover
      this.modal = true
    },
    // 点击确定把添加的数据传给服务器
    ok() {
      util.restfullCall(
        '/rest-ful/v3.0/volpool/' + this.alterItem.id,
        { name:this.alterItem.name, Protected:this.alterItem.Protected, Cover:this.alterItem.Cover },
        'PUT',
        this.callback
      );
      this.modal = false
    },
    // 成功接收到回调数据,获取添加成功的表格数据
    callback(obj) {
      if(obj.data.code === 0) util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.callbackPool)
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
        this.$emit('alrerReturn',array) 
    },
    cancel() {
      this.modal = false
    }
  }
}
</script>

