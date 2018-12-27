<template>
    <!-- 绑定介质池弹框 -->
    <Modal v-model="modal" title="绑定介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
        <Form :label-width="130" resetFields>
            <FormItem label="选择绑定的介质池">
              <Select placeholder="请选择选择存储服务器">
                <Option v-for="item in selServiceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import util from '../../libs/util.js'
export default {
  props: {
    volumeData: {
      type: Object
    }
  },
  data() {
    return {
      modal: false,
      selServiceList:[]
    }
  },
  methods: {
    // 接收父组件
    newbind: function() {
      this.modal = true
    },
    ok() {
      this.model = false

    },
    cancel() {
      console.log("数据",this.volumeData)
      this.model = false

    }
  }
}
</script>