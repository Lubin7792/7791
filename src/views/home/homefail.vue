<style>
  .home-setup .ivu-btn-primary{
    background: #ed7149;
    border-color: #ed7149;
  }
</style>

<template>
  <div class="home-right">
    <div class="task">
      <div class="home-fail">
        <div class="home-title">
          <p > </p>
          <i>备份失败任务量</i>
          <em>{{this.right.failedtasks}}</em>    
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="home-content">
        <p class="home-con-tit">设备统计</p>
        <div class="home-state">
          <p>磁带库设备数量： {{tapelibdevs}}</p>
          <p></p>
          <p>磁盘设备数量： {{diskdevs}}</p>
        </div>
        <!-- 配置设备触发 -->
        <div class="home-setup">
          <Button type="primary" @click="allocation=true">配置设备&nbsp;&nbsp;&nbsp;<Icon type="gear-a" size="16" /></Button>
          <Modal v-model="allocation" title="配置设备" @on-ok="ok" @on-cancel="cancel">
            <Form :label-width="100">
              <FormItem label="选择类型:">
                <Select @on-change="onServer" v-model="type" @on-open-change="openServer"> 
                  <Option v-for="item in selectData" :value="item.type" :key="item.type">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Form>
          </Modal>
          <!-- 磁盘内容 -->
          <diskModal ref="diskModal"></diskModal>
          <!-- 磁带库内容 -->
          <libraryModal ref="libraryModal"></libraryModal>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
import util from '../../libs/util.js'
// 添加磁盘弹框
import diskModal from '../mediaserver/diskModal.vue'
// 添加磁带库弹框
import libraryModal from '../mediaserver/libraryModal.vue'
  export default {
    components:{
      diskModal,
      libraryModal
    },
    props: {
      right:{}
    },
    data() {
      return{
        allocation:false,
        tapelibdevs: '',
        diskdevs: '',
        type:'',
        selectData:[]
      }
    },
    watch: {
    right:function(data) {
      this.tapelibdevs = data.device.tapelibdevs
      this.diskdevs = data.device.diskdevs
    }
  },
    methods: {
      // 点击介质服务器下拉框触发事件
      openServer:function(open) {
        if(open) util.restfullCall('/rest-ful/v3.0/devicetype', null, 'get', this.callbackSle)
      },
      // 介质服务器下拉框回调
      callbackSle:function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            type:obj.data[i].type,
            name:obj.data[i].name
          })
        }
        this.selectData = array
      },
      // 介质服务器下拉框id
      onServer: function(id) {
        this.type = id 
      },
      ok () {
        if(this.type == 0){
          this.$refs.diskModal.newDisks()
        }else if(this.type == 1){
          this.$refs.libraryModal.newLibrarys()
        }
      },
      cancel () {
        // this.$Message.warning("操作已取消")
      }
    }
  }
</script>