<template>
    <!-- 新建介质池弹框 -->
  <Modal v-model="modal" title="新建介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
    <Form :model="serverItem" ref="serverItem" :rules="ruleDiskData" :label-width="110" resetFields>
        <FormItem label="介质池名称" prop="name">
            <Input v-model="serverItem.name" placeholder="请输入介质池名称"></Input>
        </FormItem>
        <FormItem label="保留周期">
            <InputNumber v-model="serverItem.Protected"></InputNumber><span>( 天 )</span>
        </FormItem>
        <FormItem label="覆盖周期">
            <InputNumber width="100%" v-model="serverItem.Cover"></InputNumber><span>( 天 )</span>
        </FormItem>
    </Form>
  </Modal>
</template>

<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      ruleDiskData:{
        name:[{required: true, message: '请输入只含有汉字、数字、字母、下划线的名称', pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, trigger: 'blur'}]
        // name:[{required: true, message: '介质服务器名称不能为空', trigger: 'blur'},{min:1}]
      },
      modal: false,
      serverItem: {
        name: '',
        Protected: 30,
        Cover: 30,
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
      var severName = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      if(severName.test(this.serverItem.name)){
        util.restfullCall('/rest-ful/v3.0/volpool',this.serverItem,'post',this.upload);
      }else{
        this.$Message.error("新建磁盘输入格式错误！")
      }
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
        this.serverItem.name = ""
        this.serverItem.Protected = 30
        this.serverItem.Cover = 30
        // Object.keys(this.serverItem).forEach(key => this.serverItem[key] = null)
        
    },
    cancel() {
      // this.$Message.warning("操作已取消")
    }
  }
}
</script>

