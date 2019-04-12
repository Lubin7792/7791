<style>
</style>
<template>
  <Modal title="修改磁盘设备" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="540" :mask-closable="false">
    <Form :label-width="120" :model="modalDisk" ref="modalDisk" :rules="ruleDisk">
      <FormItem label="设备名称" prop="name">
        <Input v-model="modalDisk.name" placeholder="请输入设备名称"></Input>
      </FormItem>
      <FormItem label="介质服务器">
				<Input v-model="modalDisk.servername" disabled></Input>
			</FormItem>
      <FormItem label="设备路径">
				<Input v-model="modalDisk.path" disabled></Input>
			</FormItem>
      <!-- <FormItem label="存储容量">
				<Input v-model="modalDisk.enable"></Input>
			</FormItem>
      <FormItem label="状态">
				<Input v-model="modalDisk.type"></Input>
			</FormItem> -->
      <Row type="flex" justify="space-around">
				<Col span="12">
					<FormItem label="最大并发数">
            <InputNumber :max="10" :min="1" v-model="modalDisk.maxtasks"></InputNumber>
					  <!-- <Input v-model="modalDisk.maxtasks" style="width: 100px"></Input> -->
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="容量告警下限">
            <InputNumber :max="10" :min="1" v-model="modalDisk.lowlimit"></InputNumber>
						<!-- <Input v-model="modalDisk.lowlimit" style="width: 100px"></Input> -->
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="space-around">
				<Col span="6">
					<Checkbox on-change="checkchange" v-model="single">定制介质文件</Checkbox>
				</Col>
				<Col span="12">
					<FormItem label="介质文件容量" >
            <InputNumber :max="10" :min="1" :disabled="!single" v-model="modalDisk.filesize"><span slot="append">(M)</span></InputNumber>
						<!-- <Input :disabled="!single" v-model="modalDisk.filesize">
                <span slot="append">(M)</span>
            </Input> -->
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
  },
  data() {
    return {
      ruleDisk:{
        name:[{required: true, message: '请输入只含有汉字、数字、字母、下划线、点的名称', pattern: /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/, trigger: 'blur'}]
      },
      // diskItem: {
      //   name: '',
      //   path: '',
      //   maxjobs: null,
      //   lowlimit: null,
      //   filesize: null,
      //   server: '',
      //   type: '',
      // },
      modalDisk: {
        id: '',
        name: '',
        type: '',
        server: '',
        servername: '',
        enable: '',
        status: '',
        path: '',
        filesize: 0,
        maxtasks: 0,
        lowlimit: 0,
      },
      modal: false,
      single: false
    }
  },
  methods: {
    // 接收行数据
    showModify:function(row) {
      this.modalDisk.id = row.id
      this.modalDisk.name = row.name
      this.modalDisk.type = row.type
      this.modalDisk.server = row.server
      this.modalDisk.servername = row.servername
      this.modalDisk.enable = row.enable
      this.modalDisk.status = row.status
      this.modalDisk.path = row.path
      this.modalDisk.filesize = row.filesize
      this.modalDisk.maxtasks = row.maxtasks
      this.modalDisk.lowlimit = row.lowlimit
      this.modal = true
    },
    // 点击保存时把修改的数据传给后台
    ok() {
      var diskName = /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/;
      if(diskName.test(this.modalDisk.name)){
        util.restfullCall('/rest-ful/v3.0/device/'+this.modalDisk.id,
        {name:this.modalDisk.name, enable:this.modalDisk.enable, type:this.modalDisk.type, maxtasks:this.modalDisk.maxtasks, lowlimit:this.modalDisk.lowlimit, filesize:this.modalDisk.filesize},
        'PUT',
        this.upload);
      }else{
        this.$Message.error("修改磁盘输入格式错误！")
      }
    },
    // 修改磁盘的回调数据判断
    upload(callback){
      if(callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/devices?type=0', null, 'get', this.diskdata)
    },
    // 修改完成后查询添加成功的磁盘表
    diskdata: function(diskobj) {
      var array = new Array()
      for (let i = 0; i < diskobj.data.length; i++) {
        array.push({
          id: diskobj.data[i].id,
          name: diskobj.data[i].name,
          type: diskobj.data[i].type,
          server: diskobj.data[i].server,
          servername: diskobj.data[i].servername,
          enable: diskobj.data[i].enable,
          status: diskobj.data[i].status,
          path: diskobj.data[i].path,
          filesize: diskobj.data[i].filesize,
          maxtasks: diskobj.data[i].maxtasks,
          lowlimit: diskobj.data[i].lowlimit,
        })
      }
      this.$emit('listModify', array)
    },
    cancel() {
      // this.$Message.warning("操作已取消")
    },
  }
}
</script>