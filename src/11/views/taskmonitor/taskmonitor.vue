<template>
  <div>
    <Table border ref="selection" :columns="columns4" :data="taskMonitor"></Table>
    <updataDetail ref="updataDetail"></updataDetail>
    <!-- <Button @click="handleSelectAll(true)">全选</Button>
    <Button @click="handleSelectAll(false)">全部清除</Button> -->
  </div>
</template>
<script>
import util from '../../libs/util.js'
import updataDetail from './updataDetail.vue'

// 数据详情弹框
export default {
  components: {
    updataDetail
  },

  data() {
    return {
      numNowList:[],
      columns4: [
        // { type: 'selection', width: 60, align: 'center' },
        { title: '任务ID', width: 80, key: 'id' },
        { title: '策略', width: 160, key: 'policy' },
        { title: '客户端', width: 160, key: 'client' },
        { title: '介质服务器', key: 'mediaserver' },
        { title: '设备', width: 80, key: 'device'  },
        { title: '开始时间', key: 'starttime' },
        { title: '耗时', key: 'usedtime'  },
        { title: '备份数据量', key: 'bytes'  },
        { title: '速率', key: 'rate'  },
        { title: '介质', key: 'pool'  },
        { title: '状态', width: 80, key: 'state' },
        {title: '操作',key: 'operation',align: 'center',
          render: (h, params) => {
            return h('div', [
              // 任务监控详情
              h('Icon', {
                  props: {
                      type: 'gear-b',
                      size: '20'
                  },
                  style: {
                      marginRight: '8px',
                  },
                  on: {
                      click: () => {
                        this.$refs.updataDetail.monitorDetail(params.row.id)
                      }
                  }
              },),
              // 任务监控撤销接口
             this.nowShow(this.getPower.cancleTask)? h('Icon', {
                  props: {
                      type: 'ios-close',
                      size: '20',
                  },
                  on: {
                      click: () => {
                        util.restfullCall( '/rest-ful/v3.0/task/monitor/' + params.row.id + '/cancel', null, 'get', this.getCallback)
                      }
                  }
              },):'',
            ]);
          }
        },
      ],
      taskMonitor: []
    }
  },
  created() {
    this.$store.dispatch("getPrivilege", this.$store.state.power.module.taskMonitor);
    // 任务监控接口信息
    util.restfullCall('/rest-ful/v3.0/task/monitor', null, 'get', this.dealingData)
    // 任务监控定时器
    this.refreshData()
  },
     computed: {
    getPrivilege(){
      return this.$store.state.index.privilegeData
    },
      getPower(){
      return this.$store.state.power.name
    }
  },
    watch: {
    getPrivilege(data){
      this.numNowList=data
    }
  },
  methods: {
        nowShow(num){
      if(this.numNowList.indexOf(num)!=-1){
        return true
      }else{
        return false
      }
    },
    // 选框判断
    // handleSelectAll(status) {
    //   this.$refs.selection.selectAll(status)
    // },
    // 任务监控回调信息
    dealingData: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          id: obj.data[i].id,
          policy: obj.data[i].policy,
          client: obj.data[i].client,
          mediaserver: obj.data[i].mediaserver,
          device: obj.data[i].device,
          starttime: obj.data[i].starttime,
          usedtime: obj.data[i].usedtime,
          files: obj.data[i].files,
          bytes: obj.data[i].bytes,
          rate: obj.data[i].rate,
          pool: obj.data[i].pool,
          state: obj.data[i].state
        })
      }
      this.taskMonitor = array
    },
    // 任务监控撤销回调
    getCallback: function(obj) {
      if(obj.data.code == 0) {
        util.restfullCall('/rest-ful/v3.0/task/monitor', null, 'get', this.dealingData)
      }else{
        this.$Message.warning("取消任务失败："+obj.data.message)
      }
    },
    // 定时获取接口信息
    refreshData() {
      this.timer = setInterval(() => {
        util.restfullCall('/rest-ful/v3.0/task/monitor', null, 'get', this.dealingData)
      }, 1000)
    }
  },
  beforeDestroy() {
    if (this.timer) {
      //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer) //关闭
    }
  }
}
</script>
