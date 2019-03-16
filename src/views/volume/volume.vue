<template>
  <Tabs :animated="false" type="card" class="volum">
    <!-- 介质池 -->
    <TabPane label="介质池">
      <Table stripe highlight-row :data="volpool" :columns="mediumPools" height="720"></Table>

      <div class="_btn">
        <Button type="info" @click="newPool" v-if="nowShow(getPower.newValume)">新建介质池</Button>
        <!-- <Button type="info" @click="delPool">删除介质池</Button> -->
        <!-- <Button type="info" @click="alterPool">修改介介质池</Button> -->
        <poolModal ref="poolModal" @Return="Return"></poolModal>
        <alterModal ref="alterModal" @alrerReturn="alrerReturn"></alterModal>
      </div>
    </TabPane>
    <!-- 介质 -->
    <TabPane label="介质">
      <Table
        :data="volume"
        :row-class-name="rowClassName"
        :columns="mediums"
        stripe
        highlight-row
        height="800"
      ></Table>

      <div class="_btn">
        <bindModal ref="bindModal" @againData="againData"></bindModal>
        <renameModal ref="renameModal" @toogleRename="toogleRename"></renameModal>
        <recoveryModal ref="recoveryModal" @recoveryData="recoveryData"></recoveryModal>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
  import util from '../../libs/util.js'
  import axios from 'axios'

  // 新建介质池模块
  import poolModal from './poolModal.vue'
  // 修改介质池
  import alterModal from './alterModal.vue'
  // 重命名介质模块
  import renameModal from './renameModal.vue'
  // 介质重新绑定介质池
  import bindModal from './bindModal.vue'
  // 回收介质模块
  import recoveryModal from './recoveryModal.vue'


  export default {
    components: {
      poolModal,
      alterModal,
      bindModal,
      renameModal,
      recoveryModal
    },
    data() {
      return {
      numNowList:[],
        mediumPools: [
          { title: 'ID', key: 'id', sortable: true},
          { title: '介质名称', key: 'name', sortable: true},
          { title: '保留周期', key: 'Protected', sortable: true},
          { title: '覆盖周期', key: 'Cover', sortable: true},
          {title: '操作',key: 'operation',align: 'center',
            render: (h, params) => {
              return h('div', [
                // 修改介质池弹框
                this.nowShow(this.getPower.editValume)?h('Icon', {
                  props: {
                      type: 'ios-chatboxes',
                      size: '20',
                  },
                  style: {
                      marginRight: '10px',
                  },
                  on: {
                      click: () => {
                        if(params.row.type == 4) {
                          this.$refs.alterModal.alterPools(params.row)                          
                        } else{
                          this.$Message.error("该介质池禁止被修改")
                        }
                      }
                  }
                },):'',
                // 删除介质
                h('Icon', {
                  props: {
                      type: 'ios-close',
                      size: '20',
                  },
                  on: {
                      click: () => {
                        if(params.row.type == 4) {
                          if (confirm('是否删除该介质池？')) util.restfullCall('/rest-ful/v3.0/volpool/'+params.row.id, null, 'DELETE', this.deletePool)
                        }else{
                          this.$Message.error("该介质池禁止被删除")
                        }
                      }
                  }
                },),
              ]);
            }
          }
        ],
        mediums: [
          { title: 'id', key: 'id', width: 80 },
          { title: 'Barcode', key: 'barcode' },
          { title: '介质名称', key: 'name' },
          { title: '介质池', key: 'pool' },
          { title: '已用容量', key: 'used', width: 100 },
          { title: '最后写入时间', key: 'LastWrtime' },
          { title: '介质状态', key: 'state', width: 100 },
          { title: '在线状态', key: 'online', width: 100 },
          {title: '操作',key: 'operation',align: 'center',
            render: (h, params) => {
              return h('div', [
                // 绑定介质弹框
                this.nowShow(this.getPower.binValume)?h('Icon', {
                  props: {
                      type: 'ios-shuffle',
                      size: '20'
                  },
                  style: {
                      marginRight: '8px',
                  },
                  on: {
                      click: () => {
                        // 绑定介质弹框
                        this.$refs.bindModal.newbind(params.row)
                      }
                  }
                },):'',
                // 删除介质
                this.nowShow(this.getPower.deleteValume)?h('Icon', {
                  props: {
                      type: 'ios-close',
                      size: '20',
                  },
                  style: {
                      marginRight: '8px',
                  },
                  on: {
                      click: () => {
                        // 删除介质
                        if (confirm('是否确认删除介质'))  util.restfullCall('/rest-ful/v3.0/volume/' + params.row.id, null, 'DELETE', this.deleteMedium)
                      }
                  }
                },):"",
                // 重命名弹框
               this.nowShow(this.getPower.reviseMedium)? h('Icon', {
                  props: {
                      type: 'ios-chatboxes',
                      size: '20',
                  },
                  style: {
                      marginRight: '8px',
                  },
                  on: {
                      click: () => {
                        // 重命名弹框
                        this.$refs.renameModal.rename(params.row)
                      }
                  }
                },):'',
                // 回收介质弹框
              this.nowShow(this.getPower.recoveryMedium)?   h('Icon', {
                  props: {
                      type: 'ios-undo',
                      size: '20'
                  },
                  on: {
                      click: () => {
                        this.$refs.recoveryModal.recovery(params.row)
                      }
                  }
                },):'',
              ]);
            }
          },
        ],
        volpool: [],
        volume: [],
        rowIndex: ''
      }
    },
    
    created() {
    this.$store.dispatch("getPrivilege", this.$store.state.power.module.volume);

      // 获取介质池信息
      util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.callbackPool)
      // 获取介质信息
      util.restfullCall('/rest-ful/v3.0/volumes', null, 'get', this.callbackMedium)
    },
  computed: {
         getPower(){
      return this.$store.state.power.name
    },
    getPrivilege(){
      return this.$store.state.index.privilegeData
    }
  },
   watch: {
  
    getPrivilege(data){
      this.numNowList=data
    }
  },
    methods:{
            nowShow(num){
      if(this.numNowList.indexOf(num)!=-1){
        return true
      }else{
        return false
      }
    },
      // 查询介质池列表
      callbackPool: function(poolObj) {
        // console.log("介质池数据",poolObj)
        var array = new Array()
        for (let i = 0; i < poolObj.data.length; i++) {
          array.push({
          id: poolObj.data[i].id,
          name: poolObj.data[i].name,
          Cover: poolObj.data[i].Cover,
          Protected: poolObj.data[i].Protected,
          type: poolObj.data[i].type,
          })
        }
        this.volpool = array
      },
      // 介质池
      // 查询介质列表
      callbackMedium: function(mediumObj) {
        // console.log("介质数据",mediumObj)
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
        }
        this.volume = array
      },
      // 新建介质池触发事件
      newPool: function() {
        this.$refs.poolModal.newPools()
      },
      // 接收添加成功的数据
      Return(datas) {
        this.volpool = datas
      },
      // 修改介质池的子组件传值接收
      alrerReturn(obj) {
        this.volpool = obj
      },
      // 删除成功之后的回调判断
      deletePool(callback) {
        if (callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/volpools', null, 'get', this.callbackPool)
      },

      // 介质
      // 删除成功之后的回调判断
      deleteMedium(callback) {
        if (callback.data.code === 0) util.restfullCall('/rest-ful/v3.0/volumes', null, 'get', this.callbackMedium)
      },
      // 绑定成功之后的数据接收
      againData(again) {
       this.volume = again  
      },
      // 重命名成功后的数据接收
      toogleRename(data) {
        this.volume.forEach(item => {
          if (item.id === data.id) item.name = data.name
        })
      },
      // 回收介质成功之后的数据渲染
      recoveryData(data) {
        if(data.code == 0) util.restfullCall('/rest-ful/v3.0/volumes', null, 'get', this.callbackMedium)
      },
      // 介质行内容
      rowClassName(row, index) {
        if(row.state === '已满') {
          return 'wrning';
        }else if(row.state === '出错') {
          return 'error';
        }
      },
    }
  
  }
</script>

<style>
.volum ._btn {
  margin-top: 15px;
}
.ivu-table .wrning td {
  background-color: rgb(224, 222, 63) !important;
}
.ivu-table .error td {
  background-color: rgb(201, 80, 50) !important;
}
</style>

