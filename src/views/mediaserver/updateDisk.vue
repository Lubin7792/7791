<style>
@import './diskModal.css';
</style>
<template>
  <Modal title="修改磁盘设备" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="540" :mask-closable="false">
    <Form :label-width="120">
      <FormItem label="设备名称">
        <Input v-model="modalDisk.name" placeholder="请输入设备名称"></Input>
      </FormItem>
      <FormItem label="介质服务器">
				<Input v-model="modalDisk.server" disabled></Input>
			</FormItem>
      <FormItem label="设备路径">
				<Input v-model="modalDisk.path" disabled></Input>
			</FormItem>
      <FormItem label="存储容量">
				<Input v-model="modalDisk.enable"></Input>
			</FormItem>
      <FormItem label="状态">
				<Input v-model="modalDisk.type"></Input>
			</FormItem>
      <Row type="flex" justify="space-around">
				<Col span="12">
					<FormItem label="最大并发数">
					<Input v-model="modalDisk.maxjobs" style="width: 100px"></Input>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="容量告警下限">
						<Input v-model="modalDisk.lowlimit" style="width: 100px"></Input>
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="space-around">
				<Col span="6">
					<Checkbox on-change="checkchange" v-model="single">定制介质文件</Checkbox>
				</Col>
				<Col span="12">
					<FormItem label="介质文件容量" >
						<Input :disabled="!single" v-model="modalDisk.filesize">
                <span slot="append">(M)</span>
            </Input>
					</FormItem>
				</Col>
			</Row>
    </Form>
  </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  props: {
    modalDisk: {
      type: Object
    }
  },
  data() {
    return {
      modal: false,
      single: false
    }
  },
  methods: {
    showModify:function() {
      this.modal = true
    },
    // 点击保存时把修改的数据传给后台
    ok() {
      util.restfullCall('/rest-ful/v3.0/device/'+this.modalDisk.id,{name:this.modalDisk.name,enable:this.modalDisk.enable,type:this.modalDisk.type},'PUT',this.upload);
      this.modal = false
    },
    upload(callback){
      console.log("999",callback)
      if(callback.data.code === 0) this.$emit('listModify', this.modalDisk)
    },
    cancel() {
      // this.$emit('close', false)
      this.modal = false
    },
  }
}
</script>