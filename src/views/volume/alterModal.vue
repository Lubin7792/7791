<template>
    <!-- 新建介质池弹框 -->
  <Modal v-model="modal" title="修改介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
    <Form :model="alterItem" ref="severName" :rules="ruleAlter" :label-width="110" resetFields>
        <FormItem label="介质池名称" prop="name">
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
      ruleAlter: {
        name:[{required: true, message: '请输入只含有汉字、数字、字母、下划线的名称', pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, trigger: 'blur'}]
      },
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
      var alterName = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      if(alterName.test(this.alterItem.name)){
        util.restfullCall(
          '/rest-ful/v3.0/volpool/' + this.alterItem.id,
          { name:this.alterItem.name, Protected:this.alterItem.Protected, Cover:this.alterItem.Cover },
          'PUT',
          this.callback
        );
      }else{
        this.$Message.error("新建磁盘输入格式错误！")
      }
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
      this.$Message.warning("操作已取消")      
    }
  }
}
</script>

