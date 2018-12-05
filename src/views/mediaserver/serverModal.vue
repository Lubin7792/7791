<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
</style>
<template>
    <!-- 介质服务器新建介质弹框 -->
    <Modal v-model="modal" title="添加介质服务器" @on-ok="ok" @on-cancel="cancel" ok-text="保存" class-name="vertical-center-modal">
        <Form :model="serverItem" :label-width="130">
            <FormItem label="介质服务器名称">
                <Input v-model="serverItem.name" placeholder="请输入介质服务器名称"></Input>
            </FormItem>
            <FormItem label="选择存储服务器">
              <Select v-model="serverItem.id" placeholder="请选择选择存储服务器">
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
  data() {
    return {
      serverItem: {
        name: '',
        id: ''
      },
      modal: false,
      // 下拉框内容
      selServiceList: [],

    }
  },
  created() {
    util.restfullCall('/rest-ful/v3.0/vrtsserver?type=2', null, 'get', this.goback)
  },
  computed: {
    // modal() {
    //   return this.$store.state.modal
    //   console.log(modal)a
    // }
    
  },
  methods: {
    
    showMoadl: function() {
      this.modal = true
    },
    goback: function(obj) {
      //  console.log("5555",obj)
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          id: obj.data[i].id,
          machine: obj.data[i].machine
        })
      }
      this.selServiceList = array
    },
    // 点击确定把添加的名字传给服务器
    ok() {
      util.restfullCall('/rest-ful/v3.0/mediaserver',this.serverItem,'post',this.upload);
      this.model = false      
    },
    // 成功接收到回调数据就获取添加成功的表格数据
    upload(callback) {
      // console.log('data', callback)
      if(callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/mediaservers',null,'get',this.senddata)
    },
    // 添加成功的表格数据传递给父组件
    senddata: function(obj) {
                console.log(obj)                
        var array = new Array()
        for (let i = 0; i < obj.data.length; i++) {
            array.push({
            name: obj.data[i].name,
            id: obj.data[i].id,
            machine:obj.data[i].machine,
            os: obj.data[i].os,
            addr: obj.data[i].addr,
            status: obj.data[i].status,
            Version: obj.data[i].Version,
            devices: obj.data[i].devices,                    
            })
        }
        this.$emit('Return',array)
        console.log("2323",array)
      },
    cancel() {
      this.model = false
      // this.$store.commit('getModal', false)
    }
  }
}
</script>
