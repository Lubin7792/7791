<style>
@import './diskModal.css';
</style>
<template>
  <div>
    <Modal title="添加磁盘设备" v-model="modal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="540" :mask-closable="false">
		  <Form :model="diskItem" :label-width="120" ref="diskItem" :rules="ruleDiskData" >
        <FormItem label="设备名称" prop="name">
          <Input v-model="diskItem.name" placeholder="请输入设备名称"></Input>
        </FormItem>
        <FormItem label="设备类型">
          <Select @on-change="dislChanges" v-model="diskItem.type" disabled> 
            <Option v-for="item in selectType" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="介质服务器">
            <Select v-model="diskItem.server" @on-change="changes" @on-open-change="serverDisk" :label-in-value="true">
              <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.machine }}</Option>
            </Select>
        </FormItem>
        <FormItem label="设备路径">
          <Row>
            <Col span="19">
              <Input type="text" v-model="diskItem.path" disabled></Input>
            </Col>
            <Col span="4" offset="1">
              <Button type="primary" @click="browse">浏览</Button>
            </Col>
          </Row>
        </FormItem>
        <Row type="flex" justify="space-around">
          <Col span="12">
            <FormItem label="最大并发数">
              <InputNumber :max="10" :min="5" v-model="diskItem.maxtasks"></InputNumber>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="容量告警下限">
              <InputNumber :max="60" :min="5" v-model="diskItem.lowlimit"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="space-around">
          <Col span="6">
            <Checkbox v-model="diskItem.single">定制介质文件</Checkbox>
          </Col>
          <Col span="12">
            <FormItem label="介质文件容量" >
              <InputNumber :max="100" :min="1" v-model="diskItem.filesize" :disabled="!diskItem.single"></InputNumber> (M)
            </FormItem>
          </Col>
        </Row>	
		  </Form>
	  </Modal>
    <!-- glance浏览目录弹框 -->
    <Glance ref="Glance" @glanceReturn="glanceReturn" :device="device"></Glance>
  </div>
</template>
<script>
import Glance from './glance.vue'
import util from '../../libs/util.js'
export default {
  data() {
    return {
      ruleDiskData:{
        name:[{required: true, message: '请输入只含有汉字、数字、字母、下划线、点的名称', pattern: /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/, trigger: 'blur'}]
        // name:[{required: true, message: '介质服务器名称不能为空', trigger: 'blur'},{min:1}]
      },
      modal: false,
   
      selectType:[],
      cityList:[],
      device: [],
      diskItem: {
           single: false,
        name: '',
        path: '',
        maxtasks: 5,
        lowlimit: 10,
        filesize: null,
        server: '',
        type: '',
      },
    }
  },
  created(){
    // 获取设备类型
    util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.selType)
  },
  components: {
    Glance
  },
  methods: {
    // 点击下拉框获取介质服务器信息
    serverDisk:function(openServer) {
      if(openServer == true) util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    },
    // 拿到介质服务数据里的ID及machine赋给路径下拉框
    senddata:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          machine:obj.data[i].machine
        })
      }
      this.cityList = array
    },
    // 接收下拉框设备回调并渲染下拉框
    selType:function(arr) {
      var array = new Array
      for(let i = 0;i < arr.data.length;i++ ){
        array.push({
          type:arr.data[i].type,
          name:arr.data[i].name
        })
      }
      this.selectType = array
      this.diskItem.type = array[0].type
    },
    // 选中的设备名称type赋值给diskItem里type
    dislChanges: function(types) {
      this.diskItem.type = types 
    },
    // 选中下拉内容获取选中数据id传给后台，并返回回调地址
    changes: function(datas) {
      console.log(datas)
    if(datas){
        var ar = []
        ar.push({
          name: datas.label,
          id: datas.value
        })
      this.device = ar
    }
    },
    // 点击浏览弹出浏览框
    browse: function() {
      this.$refs.Glance.newGlance()
    },
    // 接收父组件
    newDisks: function() {
      this.modal = true
    util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.selType)
      Object.assign(this.$data.diskItem, this.$options.data().diskItem)
    },
    // 点击确认按钮，把信息传给后台
    ok() {
      var diskName = /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/
      if(diskName.test(this.diskItem.name)){
        util.restfullCall('/rest-ful/v3.0/device',JSON.stringify(this.diskItem), 'post', this.add)
      }else{
        this.$Message.error("新建磁盘输入格式错误！")
      }
      
      // Object.keys(this.diskItem).forEach(key => this.diskItem[key] = null)
    },
    // 添加成功的回调
    add: function(adds) {
      if(adds.data.code===0) util.restfullCall('/rest-ful/v3.0/devices?type='+this.diskItem.type, null, 'get', this.diskdata)
    },
    // 添加成功的磁盘数据传递给父组件
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
        this.$emit('diskReturn',array)
        // Object.keys(this.diskItem).forEach(key => this.diskItem[key] = null)
        this.diskItem.name = null
        this.diskItem.path = null
        this.diskItem.maxtasks = null
        this.diskItem.lowlimit = null
        this.diskItem.filesize = null
        this.diskItem.single = false
    },
    // 接收选中的path路径
    glanceReturn(pathReturn){
      this.diskItem.path = pathReturn
    },
    cancel() {
      // this.$Message.warning("操作已取消")

      // this.diskItem.name = null
      //   this.diskItem.path = null
      //   this.diskItem.maxtasks = null
      //   this.diskItem.lowlimit = null
      //   this.diskItem.filesize = null
    },
    glance: function() {
      this.modal = false
    }
  }
}
</script>
