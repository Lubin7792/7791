<style>
</style>
<template>
	<Modal title="新建磁带库" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="640">
		<Form :model="libraryItem" ref="libraryItem" :rules="ruleLibrary" :label-width="100">
			<FormItem label="设备名称" prop="name">
				<Input v-model="libraryItem.name" placeholder="请输入设备名称"></Input>
			</FormItem>
      <Row>
        <Col span="12">
          <FormItem label="介质服务器">
          <Select v-model="libraryItem.server" placeholder="请选择介质服务器" @on-change="server" @on-open-change="serverDisk">
            <Option v-for="item in selList" :value="item.id" :key="item.id">{{ item.machine }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="机械肩">
            <Select v-model="libraryItem.Mechanics" placeholder="请选择选择机械臂" @on-change="changes">
              <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
			    </FormItem>
        </Col>
      </Row>	
      <P class="titl">驱动器信息</P>
			<Table :columns="driverColumns" :data="driver" style="margin-bottom:20px" height="200"></Table>
      <P class="titl">槽位信息</P>
			<Table :columns="slotColumns" :data="slot" border height="200"></Table>
		</Form>
	</Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      ruleLibrary:{
        name:[{required: true, message: '请输入只含有汉字、数字、字母、下划线、点的名称', pattern: /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/, trigger: 'blur'}]
      },
      cityList:[],
      selList:[],
      driver:[],
      slot:[],
      modal: false,
      libraryItem: {
      Mechanics:"",
        name: '',
        path: '',
        maxjobs: '',
        lowlimit: 0,
        filesize: 0,
        server: '',
        type: 1,
      },
      driverColumns: [
        { title: '序列号', key: 'driverno' },
        { title: '厂商', key: 'vendor' },
        { title: '产品ID', key: 'productid' },
        { title: '版本', key: 'sn' },
        { title: '磁带条码', key: 'barcode' },
        { title: '槽位数', key: 'slotno' },
      ],
      slotColumns:[
        { title: '槽位号', key: 'slotno' },
        { title: '磁带条码', key: 'barcode' },
        { title: 'I/EXPORT', key: 'iexport' },
      ],
      single: false
    }
  },
  created() {
    // util.restfullCall('/rest-ful/v3.0/mediumchanges?server='+16, null, 'get', this.senddata)
  },
  methods: {
    // 点击下拉框获取介质服务器信息
    serverDisk:function(openServer) {
      if(openServer == true) util.restfullCall('/rest-ful/v3.0/mediaservers', null, 'get', this.diskdata)
    },
    // 介质服务器的回调接收并赋值给下拉框
    diskdata:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          machine:obj.data[i].machine
        })
      }
      this.selList = array
    },
    // 介质服务器选中数据id传给后台拿到接卸臂的回调
    server:function(row){
      util.restfullCall('/rest-ful/v3.0/mediumchanges?server='+row, null, 'get', this.senddata)
    },
    // 机械臂回调并赋值给机械臂下拉框
    senddata:function(obj){
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          name:obj.data[i].name
        })
      }
      this.cityList = array
    },
    
    // 获取选中机械臂的id传给后台
    changes: function(datas) {
      util.restfullCall('/rest-ful/v3.0/mediumchanger/' + datas, null, 'get', this.address)
      
    },
    // 机械臂传id返回的数据
    address:function(changer) {
      if(changer.data.code === 0) 
      this.driver=changer.data.changer.driverlist,
      this.slot=changer.data.changer.slotlist,
      this.libraryItem.path=changer.data.changer.sn,
      this.libraryItem.maxjobs=changer.data.changer.drivers
    },
    // 接收父组件
    newLibrarys:function(){
      this.modal = true;
      Object.assign(this.$data.libraryItem, this.$options.data().libraryItem)
       this.driver=[];
       this.slot=[];

    },
    // 点击确认按钮，把信息传给后台
    ok() {
      var libraryName = /^[a-zA-Z0-9_.\u4e00-\u9fa5]+$/
      if(libraryName.test(this.libraryItem.name)){
        util.restfullCall('/rest-ful/v3.0/device', JSON.stringify(this.libraryItem), 'post', this.callb)
        this.libraryItem.name = null
        this.libraryItem.server = null
        this.libraryItem.Mechanics = null
      }else{
        this.$Message.error("新建磁带库输入格式错误！")
      }
    },
    callb(obj) {
      if(obj.data.code===0){
        util.restfullCall(
          "/rest-ful/v3.0/devices?type=1",
          null,
          "get",
          this.tapesdata
        );
      }else {
        this.$Message.error(obj.data.message)
      }
    },
    tapesdata: function(typeobj) {
      var array = new Array();
      for (let i = 0; i < typeobj.data.length; i++) {
        array.push({
          name: typeobj.data[i].name,
          id: typeobj.data[i].id,
          server: typeobj.data[i].server,
          servername: typeobj.data[i].servername,
          vendor: typeobj.data[i].vendor,
          productid: typeobj.data[i].productid,
          status: typeobj.data[i].status,
          serialno: typeobj.data[i].serialno,
          drivers: typeobj.data[i].drivers,
          slots: typeobj.data[i].slots,
          changer: typeobj.data[i].changer
        });      
      }
      this.$emit('libraryReturn',array)  
    },
    cancel() {
      // this.$Message.warning("操作已取消")
    }
  }
}
</script>