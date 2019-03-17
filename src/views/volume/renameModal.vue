<style lang="less">
</style>
<template>
    <!-- 重命名介质弹框 -->
    <Modal v-model="modal" title="介质重命名" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
        <Form :model="rowData" ref="rowData" :rules="ruleRow" :label-width="130">
            <FormItem label="介质名称" prop="name">
                <Input v-model="rowData.name" placeholder="请输入改名称"></Input>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      ruleRow: {
        name:[{required: true, message: '请输入只含有数字、字母、下划线的名称', pattern: /^[0-9a-zA-Z_]{1,}$/, trigger: 'blur'}]
      },
      rowData: {},
      modal: false,
    }
  },
  methods: {
    // 接收父组件
    rename: function(row) {
      this.rowData = row
      console.log(this.rowData)
      this.modal = true
    },
    // 点击确定把添加的名字传给服务器
    ok() {
      var rowName = /^[0-9a-zA-Z_]{1,}$/;
      if(rowName.test(this.rowData.name)) {
        util.restfullCall('/rest-ful/v3.0/volume/alias/'+this.rowData.id + '?name=' + this.rowData.name,null,'PUT',this.upload);
      }else{
        this.$Message.error("介质名称输入格式错误！")
      }
    },
    // 回调的数据传递给父组件
    upload(callback) {
        if(callback.data.code === 0) this.$emit('toogleRename', this.rowData)
    },
    cancel() {
      this.$Message.warning("操作已取消")
    }
  }
}
</script>
