<style lang="less">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    
    .ivu-modal{
        top: 0;
    }
  }
</style>

<template>
    <!-- 运行记录报表详情弹框 -->
    <Modal footer-hide v-model="modal1" title="运行记录报表详情" class-name="vertical-center-modal">
        <Form :label-width="130">
            <div>
              内容为空
            </div>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
    props: {
      putDatas: {
        type: Object
      }
    },
    
    data () {
      return {
        modal1: false
      }
    },
    methods: {
      reportDetail:function() {
        this.modal1 = true
      }
    }
}
</script>
