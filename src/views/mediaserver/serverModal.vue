<style lang="less">
</style>
<template>
    <!-- 介质服务器新建介质弹框 -->
    <Modal v-model="modal" title="添加介质服务器" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
        <Form :model="serverItem" :label-width="130" ref="serverItem" :rules="ruleServer">
            <FormItem label="介质服务器名称" prop="name">
                <Input v-model="serverItem.name" placeholder="请输入介质服务器名称"></Input>
            </FormItem>
            <FormItem label="选择存储服务器">
              <Select v-model="serverItem.id" @on-change="serverlChanges">
                <Option v-for="item in selServiceList" :value="item.id" :key="item.id">{{ item.machine }}</Option>
              </Select>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  // inject:['getmediumInfo'],
  props: {
      // 下拉框内容
        selServiceList: {
            type: Array
        }
    },
  data() {
    return {
      ruleServer: {
        name:[{required: true, message: '请输英文的介质服务器名称', pattern: /^[a-zA-Z]+$/, trigger: 'blur'}]        
      },
      serverItem: {
        name: '',
        id: ''
      },
      modal: false,

    }
  },
  methods: {
    // 接收父组件
    showMoadl: function() {
      this.modal = true
      if(this.selServiceList[0]) this.serverItem.id = this.selServiceList[0].id
    },
    serverlChanges: function(id) {
      this.serverItem.id = id
    },
    // 点击确定把添加的名字传给服务器
    ok() {
      var severName = /^[a-zA-Z]+$/;
      if(severName.test(this.serverItem.name)){
      util.restfullCall('/rest-ful/v3.0/mediaserver',this.serverItem,'post',this.upload)
      // this.modal = false
      }else{
        this.$Message.error("添加的介质服务器名称格式错误！")
      }
    },
    // 成功接收到回调数据就获取添加成功的表格数据
    upload(callback) {
      if(callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/mediaservers',null,'get',this.senddata)
    },
    // 添加成功的表格数据传递给父组件
    senddata: function(obj) {             
        var array = new Array()
        for (let i = 0; i < obj.data.length; i++) {
            array.push({
            name: obj.data[i].name,
            id: obj.data[i].id,
            machine:obj.data[i].machine,
            os: obj.data[i].os,
            addr: obj.data[i].addr,
            status: obj.data[i].status,
            version: this.filter(obj.data[i].version),
            devices: obj.data[i].devices,                    
            })
        }
        this.$emit('Return',array)
        // 初始化弹框页面
        Object.keys(this.serverItem).forEach(key => this.serverItem[key] = null)
    },
    // 软件版本号转换
    filter: function(versions) {
      let v0 = (versions & 0xff000000) >> 24;
      v0 = v0.toString();
      let v1 = (versions & 0xff0000) >> 16;
      v1 = v1.toString();
      let v2 = (versions & 0xff00) >> 8;
      v2 = v2.toString();
      let v3 = versions & 0xff;
      v3 = v3.toString();
      let str = v0 + "." + v1 + "." + v2 + "." + v3;
      return str;
    },
    cancel() {
      this.$Message.warning("操作已取消")
    }
  }
}
</script>
