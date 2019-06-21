<template>
    <!-- 介质服务器修改介质弹框 -->
    <Modal v-model="modal1" title="设备属性" @on-ok="ok" @on-cancel="cancel" ok-text="保存" class-name="vertical-center-modal">
        <Form :label-width="130" :model="putDatas" ref="putDatas" :rules="rulePut">
            <FormItem label="介质服务器名称" prop="name">
                <Input placeholder="请输入介质服务器名称" v-model="putDatas.name"></Input>
            </FormItem>
            <FormItem label="机器名">
                <Input disabled v-model="putDatas.machine"></Input>
            </FormItem>
            <FormItem label="操作系统类型">
                <Input disabled v-model="putDatas.os"></Input>
            </FormItem>
            <FormItem label="IP地址">
                <Input disabled v-model="putDatas.addr"></Input>
            </FormItem>
            <FormItem label="状态">
                <Input disabled v-model="putDatas.status"></Input>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
    
  data () {
    return {
      rulePut:{
        name:[{required: true, message: '介质服务器名称只能是汉子字母数字下划线(_)点(.)', pattern: /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/, trigger: 'blur'}]        
      },
      modal1: false,
      putDatas: {
        name: '',
        id: '',
        machine: '',
        os: '',
        addr: '',
        status: '',
        Version: '',
        devices: ''
      }
    }
  },
  methods: {
    // 传递的行数据接收
    showMoad2: function(row) {
      // this.putDatas = row
      this.putDatas.name = row.name
      this.putDatas.id = row.id
      this.putDatas.machine = row.machine
      this.putDatas.os = row.os
      this.putDatas.addr = row.addr
      this.putDatas.status = row.status
      this.putDatas.Version = row.Version
      this.putDatas.devices = row.devices
      this.modal1 = true
    },
    // 点击保存修改数据
    ok () {
      var severName = /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/;
      if(severName.test(this.putDatas.name)){
        util.restfullCall('/rest-ful/v3.0/mediaserver/'+this.putDatas.id,{name:this.putDatas.name},'PUT',this.upload);
      }else{
        this.$Message.error("修改的介质服务器名称格式错误！")
      }
    },
    // 回调的数据传递给父组件
    upload(callback) {
      if(callback.data.code === 0) this.$emit('toogleMedium', this.putDatas)
    },
    cancel () {
      // this.$Message.warning("操作已取消")
    }
  }
}
</script>
