<template>
  <div class="home-right">
     <div class="home-title">
          <p > </p>
          <i>备份失败任务量</i>
          <em>{{this.right.failedtasks}}</em>    
        </div>
        <div class="home-content">
          <p class="home-con-tit">设备统计</p>
          <div class="home-state">
            <p>磁带库设备数量： {{this.right.device.tapelibdevs}}</p>
            <p></p>
            <p>磁盘设备数量： {{this.right.device.diskdevs}}</p>
           </div>
          <div class=" home-setup">
            <p>配置设备</p>
          </div>
        </div>
  </div>
</template>
<script >
  export default {
    props: {
      right:{}
    },
    data() {
      return{
        
      }
    },
    methods: {

    }
  }
</script>