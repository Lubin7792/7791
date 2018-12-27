<template>
  <Tabs :animated="false" class="demo-tabs-style1" style="background: #e3e8ee;padding:16px;" type="card">
  <!-- 介质池 -->
    <TabPane label="介质池">
        <Table stripe highlight-row :data="volpool" :columns="mediumPools" height="620px"></Table>

          <div class="btn"> 
              <Button type="info" @click="newPool">新建介质池</Button>
              <Button type="info">删除介质池</Button>
              <Button type="info">修改介介质池</Button>
              <poolModal ref="poolModal" @Return="Return"></poolModal>
              <!-- <updatePool></updatePool> -->
          </div>
    </TabPane>
    <!-- 介质 -->
    <TabPane label="介质">
            <Table stripe highlight-row :data="volume" :columns="mediums" @on-current-change="selData" height="620px"></Table>
            
            <div class="btn">
                <Button type="info">新建介质</Button>
                <Button type="info">修改介介质</Button>
                <Button type="info"  @click="bingDing">绑定介质池</Button>
                <bindModal :volumeData="volumeData" ref="bindModal"></bindModal>
                <!-- <mediumModal></mediumModal>
                <updateMedium></updateMedium> -->
            </div>
        </TabPane>
  </Tabs>
</template>

<script>
  import util from '../../libs/util.js'
  import axios from 'axios'

  // // 新建介质池模块
  import poolModal from './poolModal.vue'
  // // 修改介质池模块
  // import updatePool from './updatePool.vue'
  // // 新建介质模块
  // import mediumModal from './mediumModal.vue'
  // // 修改介质模块
  // import updateMedium from './updateMedium.vue'
  // // 绑定介质池
  import bindModal from './bindModal.vue'


  export default {
    components: {
      poolModal,
      bindModal,
      // updatePool,
      // mediumModal,
      // updateMedium
    },
    data() {
      return {
        mediumPools: [
          { title: 'ID', key: 'id', sortable: true},
          { title: '介质名称', key: 'name', sortable: true},
          { title: '保留周期', key: 'Protected', sortable: true},
          { title: '覆盖周期', key: 'Cover', sortable: true},
        ],
        mediums: [
          { title: 'id', key: 'id' },
          { title: 'Barcode', key: 'barcode' },
          { title: '介质名称', key: 'name' },
          { title: '介质池', key: 'pool' },
          { title: '已用容量', key: 'used' },
          { title: '最后写入时间', key: 'LastWrtime' },
          { title: '介质状态', key: 'state' },
          { title: '在线状态', key: 'online' },
        ],
        volpool: [],
        volume: [],
        volumeData: {}
      }
    },
    
    created() {
      // 获取介质池信息
      util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.callbackPool)
      // 获取介质信息
      util.restfullCall('/rest-ful/v3.0/volumes', null, 'get', this.callbackMedium)
    },

    methods:{
      // 查询介质池列表
      callbackPool: function(poolObj) {
        var array = new Array()
        for (let i = 0; i < poolObj.data.length; i++) {
          array.push({
          id: poolObj.data[i].id,
          name: poolObj.data[i].name,
          Cover: poolObj.data[i].Cover,
          Protected: poolObj.data[i].Protected,
          })
          this.volpool = array
        }

      },
      // 介质池
      // 查询介质列表
      callbackMedium: function(mediumObj) {
        var array = new Array()
        for (let i = 0; i < mediumObj.data.length; i++) {
          array.push({
          id: mediumObj.data[i].id,
          barcode: mediumObj.data[i].barcode,
          name: mediumObj.data[i].name,
          pool: mediumObj.data[i].pool,
          used: mediumObj.data[i].used,
          LastWrtime: mediumObj.data[i].LastWrtime,
          state: mediumObj.data[i].state,
          online: mediumObj.data[i].online,
          })
          this.volume = array
        }
      },
      // 新建介质池触发事件
      newPool: function() {
        this.$refs.poolModal.newPools()
      },
      // 接收添加成功的数据
      Return(datas) {
        console.log("添加成功数据",datas)
        this.volpool = datas
      },

      // 介质
      // 绑定介质池弹框触发事件
      bingDing: function() {
        this.$refs.bindModal.newbind()
      },
      // 选中行数据
      selData: function(currentRow) {
        console.log("选中行",currentRow)
        this.volumeData = currentRow
      },
    }
  
  }
</script>

<style>
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}

.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border-color: #fff;
}
.btn {
  margin-top: 15px;
}
</style>

