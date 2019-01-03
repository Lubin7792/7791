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
  props: {
    modalLibrary: {
      type: Object
    }
  },
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
      name: null,
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
              h('Icon', {
                  props: {
                      type: 'ios-close',
                      size: '20'
                  },
                  on: {
                      click: () => {
                        console.log("删除")
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
            return h('div', [
              h('Icon', {
                  props: {
                      type: 'ios-browsers',
                      size: '20'
                  },
                  on: {
                      click: () => {
                        console.log("下拉框")
                      }
                  }
              },),
            ]);
          }
        },
      ],
    }
  },
  methods: {
    livrayModify:function(changer, name){
      this.name = name
      util.restfullCall('/rest-ful/v3.0/mediumchanger/' + changer, null, 'get', this.address)
      this.modal = true
    },
    address:function(changer) {
      console.log("changer",changer)
      if(changer.data.code !== 0) return
      this.driver=changer.data.changer.driverlist
      this.slot=changer.data.changer.slotlist
      this.changer.name = this.name
      Object.assign(this.changer, this.changer, changer.data.changer)
      // this.changer = changer.data.changer
      console.log(this.changer)
    },
  }
}
</script>