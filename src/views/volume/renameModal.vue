<style lang="less">
</style>
<template>
    <!-- 介质服务器新建介质弹框 -->
    <Modal v-model="modal" title="重命名" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
        <Form :model="rowData" :label-width="130">
            <FormItem label="介质名称">
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
      util.restfullCall('/rest-ful/v3.0/volume/alias/'+this.rowData.id + '?name=' + this.rowData.name,null,'PUT',this.upload);
      this.modal = false
    },
    // 回调的数据传递给父组件
    upload(callback) {
        if(callback.data.code === 0) this.$emit('toogleRename', this.rowData)
    },
    cancel() {
      this.modal = false
    }
  }
}
</script>
