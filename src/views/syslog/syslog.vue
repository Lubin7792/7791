<style>
@import './syslog.css';

</style>
<template>
  <div>
    <div class="sys-top">
      <Row type="flex" justify="space-between">
          <Col span="4">
            <span>级别:</span>
              <Select v-model="refresh.level" clearable @on-change="changesLevel" @on-open-change="openLevel" style="width:130px">
                <Option v-for="item in levelSelect" :value="item.level" :key="item.level">{{ item.name }}</Option>
              </Select>
          </Col>
          <Col span="4">
            <span>用户:</span>
              <Select v-model="refresh.user" clearable @on-change="changesUser" @on-open-change="openUser" style="width:130px">
                <Option v-for="item in userSelect" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
          </Col>
          <Col span="4">
            <span>来源:</span>
              <Select v-model="refresh.source" clearable @on-change="changesSource" @on-open-change="openSource" style="width:130px">
                <Option v-for="item in sourceSelect" :value="item.module" :key="item.module">{{ item.name }}</Option>
              </Select>
          </Col>
          <Col span="5">
              <span>开始时间</span>
              <DatePicker type="date" placeholder="请选择开始日期" style="width: 170px" @on-change="startTime"></DatePicker>
          </Col>
          <Col span="5">
            <span>结束时间</span>
            <DatePicker type="date" placeholder="请选择结束日期" style="width: 170px" @on-change="endTime"></DatePicker>
          </Col>
          <col span="2" class="lr">
            <Button type="warning" @click="onRefresh">查询</Button>
          </col>
      </Row>
    </div>
    <syscontent ref="syscontent"></syscontent>
  </div>

</template>
<script>
import axios from 'axios'
import util from '../../libs/util.js'
import syscontent from './syscontent.vue'
export default {
  components: {
    syscontent
  },
  data() {
    return {
      levelSelect: [],
      numNowList:[],
      userSelect: [],
      sourceSelect: [],
      refresh: {
        level: '',
        user: '',
        source: '',
        starttime: '',
        endtime: ''
      }
    }
  },
  created() {
    this.$store.dispatch("getPrivilege", 6);
  },
    computed: {
    getPrivilege(){
      return this.$store.state.index.privilegeData
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
    // 级别下拉框生成的数据
    openLevel:function(open) {
      if(open == true) util.restfullCall('/rest-ful/v3.0/loglevels', null, 'get', this.levelData)
    },
    // 级别下拉框回调数据
    levelData:function(obj) {
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          level:obj.data[i].level,
          name:obj.data[i].name
        })
      }
      this.levelSelect = array
    },
    // 级别下拉框选中的id
    changesLevel:function(id) {
      this.refresh.level = id
    },
    // 用户下拉框生成的数据
    openUser:function(open) {
      if(open == true) util.restfullCall('/rest-ful/v3.0/users', null, 'get', this.userData)
    },
    // 用户下拉框的回调数据
    userData:function(obj) {
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          id:obj.data[i].id,
          name:obj.data[i].name
        })
      }
      this.userSelect = array
    },
    // 用户下拉框选中的id
    changesUser:function(id) {
      this.refresh.user = id
    },
    // 来源下拉框生成的数据
    openSource:function(open) {
      if(open == true) util.restfullCall('/rest-ful/v3.0/logmodules', null, 'get', this.sourcelData)
    },
    // 来源下拉框回调数据
    sourcelData:function(obj) {
      var array = new Array
      for(let i = 0;i < obj.data.length;i++ ){
        array.push({
          module:obj.data[i].module,
          name:obj.data[i].name
        })
      }
      this.sourceSelect = array
    },
    // 来源下拉框选中的id
    changesSource:function(id) {
      this.refresh.source = id
    },
    // 开始时间
    startTime: function(start) {
      this.refresh.starttime = start
    },
    // 结束时间
    endTime: function(end) {
      this.refresh.endtime = end
    },
    // 点击刷新触发事件
    onRefresh() {
      let url = '/rest-ful/v3.0/syslogs?'
      Object.keys(this.refresh).forEach(item => {
        if(this.refresh[item]) url += `${item}=${this.refresh[item]}&`
      })
      util.restfullCall(url, null, 'get', this.callbackSyslogs)
      // this.$refs.syscontent.logfile(this.refresh)
    },
    // 刷新数据之后的回调传递给子组件表格
    callbackSyslogs: function(obj) {
      var array = new Array()
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          levelstr: obj.data[i].levelstr,
          desc: obj.data[i].desc,
          id: obj.data[i].id,
          level: obj.data[i].level,
          src: obj.data[i].src,
          time: obj.data[i].time,
          user: obj.data[i].user,
        })
      }
      this.$refs.syscontent.logfile(array)
    },
  },
}
</script>