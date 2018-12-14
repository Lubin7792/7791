<style>
@import './diskModal.css';
</style>
<template>
	<div>
    <Modal title="添加磁盘设备" v-model="modal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="540" :mask-closable="false">
		  <Form :model="diskItem" :label-width="120">
			<FormItem label="设备名称">
				<Input v-model="diskItem.name" placeholder="请输入设备名称"></Input>
			</FormItem>
      <FormItem label="设备类型">
        <Select @on-change="dislChanges" v-model="diskItem.type"  @on-open-change="typeDisk"> 
          <Option v-for="item in selectType" :value="item.type" :key="item.type">{{ item.name }}</Option>
				</Select>
      </FormItem>
			<FormItem label="介质服务器">
					<Select v-model="diskItem.server" @on-change="changes" @on-open-change="serverDisk">
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
            <InputNumber :max="100" :min="1" v-model="diskItem.maxjobs"></InputNumber>
					</FormItem>
				</Col>
				<Col span="12">
					<FormItem label="容量告警下限">
            <InputNumber :max="100" :min="1" v-model="diskItem.lowlimit"></InputNumber>
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="space-around">
				<Col span="6">
					<Checkbox on-change="checkchange" v-model="single">定制介质文件</Checkbox>
				</Col>
				<Col span="12">
					<FormItem label="介质文件容量" >
            <InputNumber :max="100" :min="1" v-model="diskItem.filesize"></InputNumber>
                <span slot="append">(M)</span>
            </Input>
					</FormItem>
				</Col>
			</Row>	
		  </Form>
	  </Modal>
    <!-- glance浏览目录弹框 -->
    <Glance ref="Glance" :device="device"></Glance>
  </div>
</template>
<script>
import Glance from './glance.vue'
import util from '../../libs/util.js'
export default {
  data() {
    return {
      modal: false,
      single: false,
      selectType:[],
      cityList:[],
      device:[],
      diskItem: {
        name: '',
        path: '',
        maxjobs: null,
        lowlimit: null,
        filesize: null,
        server: '',
        type: '',
      },
    }
  },
  created(){
    // 获取创建好的介质服务数据
    // util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    // 获取设备类型
    // util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.selType)
  },
  components: {
    Glance
  },
  methods: {
    // 点击下拉框获取介质服务器信息
    serverDisk:function(openServer) {
      if(openServer == true) util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.senddata)
    },
    // 点击下拉框获取设备类型信息
    typeDisk:function(openType) {
      if(openType == true) util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.selType)
    },
    selType:function(arr) {
      var array = new Array
      for(let i = 0;i < arr.data.length;i++ ){
        array.push({
          type:arr.data[i].type,
          name:arr.data[i].name
        })
      }
      this.selectType = array
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
    // 回调地址赋值并传给子组件
    address: function(ob) {
      if(ob.data.code===0) this.device=ob.data.pathlist
    },
    // 选中的设备名称type赋值给diskItem里type
    dislChanges: function(types) {
      this.type = types 
    },
    // 选中下拉内容获取选中数据id传给后台，并返回回调地址
    changes: function(datas) {
      this.server = datas
      util.restfullCall('/rest-ful/v3.0/devicepath?server=' + datas, null, 'get', this.address)
    },
    // 点击浏览弹出浏览框
    browse: function() {
      this.$refs.Glance.newGlance()
    },
    // 接收父组件
    newDisks: function() {
      this.modal = true
    },
    // 点击确认按钮，把信息传给后台
    ok() {
      util.restfullCall('/rest-ful/v3.0/device',JSON.stringify(this.diskItem), 'post', this.add)
      this.$emit('diskReturn',this.diskItem)
      this.modal = false
    },
    // 添加成功的回调
    add: function(adds) {
      if(adds.data.code===0) console.log("添加成功")
    },
    cancel() {
      this.modal = false
      // this.$store.commit('getModalDisk', false)
    },
    glance: function() {
      this.modal = false
      // this.$store.commit('getModalGlance', true)
    }
  }
}
</script>
