<template>
    <!-- 绑定介质池弹框 -->
    <Modal v-model="modal" title="绑定介质池" @on-ok="ok" @on-cancel="cancel" ok-text="保存">
        <Form :label-width="140">
            <FormItem label="选择绑定的介质池">
              <Select placeholder="请选择介质池" v-model="storage" @on-open-change="openDisk" @on-change="optionId">
                <Option v-for="item in selServiceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import util from '../../libs/util.js'
export default {
  data() {
    return {
      volumeData: {},
      storage: "",
      modal: false,
      selServiceList:[],
      volumeId: null
    }
  },
  methods: {
    // 下拉框变动时触发事件
    openDisk: function(openData) {
      if(openData == true) util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.calPool)
    },
    // 下拉框回调介质池数据赋值给下拉框
    calPool: function(poolObj) {
      var array = new Array()
      for (let i = 0; i < poolObj.data.length; i++) {
        if(this.volumeData.pool !== poolObj.data[i].name )
        array.push({
        id: poolObj.data[i].id,
        name: poolObj.data[i].name,
        Cover: poolObj.data[i].Cover,
        Protected: poolObj.data[i].Protected,
        type: poolObj.data[i].type
        })
      }
      this.selServiceList = array
    },
    // 下拉框内选中的介质池数据
    optionId: function(dataId) {
      this.volumeId = dataId
    },
    // 接收父组件
    newbind: function(obj) {
      this.volumeData = obj
      this.modal = true
    },
    // 点击确认绑定介质池和介质id
    ok() {
      util.restfullCall('/rest-ful/v3.0/volume/bind/'+this.volumeData.id +'?pool='+this.volumeId, null, 'get', this.bindData)
    },
    bindData: function(goBack) {
      if(goBack.data.code === 0) {
        util.restfullCall('/rest-ful/v3.0/volumes', null, 'get', this.againMedium)
      }else{
        this.$Message.error(goBack.data.Message);
      }
    },
    againMedium: function(againObj) {
      var array = new Array()
      var volume = []
      for (let i = 0; i < againObj.data.length; i++) {
        array.push({
        id: againObj.data[i].id,
        barcode: againObj.data[i].barcode,
        name: againObj.data[i].name,
        pool: againObj.data[i].pool,
        used: againObj.data[i].used,
        LastWrtime: againObj.data[i].LastWrtime,
        state: againObj.data[i].state,
        online: againObj.data[i].online,
        })
        volume = array
      }
      this.$emit('againData', volume)
      this.storage = null
    },
    cancel() {   
      // console.log("下拉框选中数据",this.volumeId,"选中数据id",this.volumeData.id)
      // this.$Message.warning('操作已取消');
    }
  }
}
</script>