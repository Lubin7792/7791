<style>
@import './libraryModal.css';
</style>
<template>
	<Modal footer-hide title="磁带库设备管理页面" v-model="modal" class-name="vertical-center-modal" width="640">
      <P class="titl">基本信息</P>
      <div class="parent" style="margin-bottom:20px">
        <div v-for="(value,key) in changer" :key="key" v-if="(typeof(value) !== 'object') && (key !== 'id')">{{ralations[key]}}: {{value}}</div>
      </div>
      <P class="titl">驱动器信息</P>
			<Table :columns="driverColumns" :data="driver" style="margin-bottom:20px" height="200"></Table>
      <P class="titl">槽位信息</P>
			<Table :columns="slotColumns" :data="slot" border height="200"></Table>
	</Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      changer:{},
      ralations: {
        name: '名称',
        Vendor: '厂商',
        productid: '产品id',
        revision: '版本号',
        sn: '产品序列号',
        drivers: '驱动器数量',
        slots: '槽位数量',
        iexports: '扩展槽位数量',
      },
      key:[],
      driver:[],
      slot:[],
      libraryList:{},
      modal: false,
      driverColumns: [
        { title: '序列号', key: 'driverno' },
        { title: '厂商', key: 'vendor' },
        { title: '产品ID', key: 'productid' },
        { title: '版本', key: 'sn' },
        { title: '磁带条码', key: 'barcode' },
        { title: '原槽位号', key: 'slotno' },
        {title: '操作',key: 'operation',align: 'center',
          render: (h, params) => {
            return h('div', [
              // 删除驱动信息
              h('Icon', {
                  props: {
                      type: 'ios-close',
                      size: '20'
                  },
                  on: {
                      click: () => {
                        if (confirm('是否确认将磁带从该驱动器中移出？')) { util.restfullCall('/rest-ful/v3.0/tape/unload?device='+ this.libraryList.id + '&driver='+ params.row.driverno, null, 'get', this.delCallback) }
                      }
                  }
              },),
            ]);
          }
        },
      ],
      slotColumns:[
        { title: '槽位号', key: 'slotno' },
        { title: '磁带条码', key: 'barcode' },
        { title: 'I/EXPORT', key: 'iexport' },
        {title: '操作',key: 'operation',align: 'center',
          render: (h, params) => {
            return h('Dropdown',[
              h('Button','加载磁带'),
              h('DropdownMenu',{
                slot:"list",
              },this.driver.map((item=>{
                return [
                h('DropdownItem',{
                  nativeOn: {
                    click:() => {
                      util.restfullCall('/rest-ful/v3.0/tape/load?device='+ this.libraryList.id+'&driver='+item.driverno+'&slot='+params.row.slotno, null, 'get', this.slotCallback)
                    }
                  }
                },"驱动器"+item.driverno),
              ]
              }))
              
              )
            ]
          )}  
        },
      ],
    }
  },
  methods: {
    // 接收父组件的传值
    livrayModify:function(row){
      this.libraryList = row
      // 获取磁盘详情列表数据
      util.restfullCall('/rest-ful/v3.0/mediumchanger/' + row.changer, null, 'get', this.address)
      this.modal = true
    },
    // 磁盘详情详情数据回调
    address:function(changer) {
      if(changer.data.code !== 0) return
      this.driver=changer.data.changer.driverlist
      this.slot=changer.data.changer.slotlist
      this.changer.name = this.libraryList.name
      Object.assign(this.changer, this.changer, changer.data.changer)
    },
    // 槽位信息选择驱动器回调
    slotCallback:function(obj) {
      if(obj.data.code == 0) {
        this.$Message.success("磁带加载成功")
      }else{
        this.$Message.warning(obj.data.message)
      }
    },
    // 磁带移出驱动器回调
    delCallback:function(obj) {
      if(obj.data.code == 0) {
        this.$Message.success("磁带移出驱动器成功")
      }else{
        this.$Message.warning(obj.data.message)
      }
    }
  }
}
</script>