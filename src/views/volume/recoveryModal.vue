<template>
  <Modal v-model="modal" title="确认回收该介质池" @on-ok="ok" @on-cancel="cancel">
    <p>点击<span style="color:red;font-weight: bold">确定</span>按钮该介质池将被回收，点击<span style="color:red;font-weight: bold">取消</span>按钮返回上一层</p>
  </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return{
    rowData: {},
    modal: false
    }
  },
  methods:{
    // 接收父组件
    recovery: function(row) {
      this.rowData = row
      this.modal = true
    },
    // 点击确认按钮调用回收介质接口
    ok() {
      util.restfullCall('/rest-ful/v3.0/volume/recycle/'+this.rowData.id,null,'get',this. callback);

    },
    // 回收介质回调
    callback: function (obj) {
      this.$emit('recoveryData', obj)
    },
    // 取消按钮
    cancel() {
      // this.modal =false
    }
  }
}
</script>
