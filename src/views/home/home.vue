<style>
@import "./home.css";
</style>

<template>

  <div>
      <!-- <button value="2121" type="button" @click="clickHandler">asdsad</button> -->

   <div class="Abox"> 
      <hometask :left="datalist"></hometask> 
    <homesuccess :content="datalist"></homesuccess>
    <homefail :right="datalist"></homefail>
   </div>
    <homewarning class="Bbox"></homewarning>
  </div>

</template>

<script>
import util from '../../libs/util.js'
import axios from 'axios'

import homesuccess from "./homesuccess.vue"
import hometask from "./hometask.vue"
import homefail from "./homefail.vue"
import homewarning from "./homewarning.vue"

export default {
  components: {
    homesuccess,
    hometask,
    homefail,
    homewarning
  },
  data() {
    return {
      datalist: {},
    }
  },
  created() {
    // 获取首页数据
    util.restfullCall('/rest-ful/v3.0/homepage', null, 'get', this.callbackHome)
  },
  methods:{
    // 首页数据回调
    callbackHome:function(obj) {
      this.datalist = obj.data
      // console.log(obj.data)
      // this.left.tasks = obj.data.tasks
      // this.left.totalbytes = obj.data.totalbytes
      // this.left.classsum = obj.data.classsum
      // this.left.increasebytes = obj.data.increasebytes
      // this.content.successtasks = obj.data.successtasks
      // this.content.clients = obj.data.clients
      // this.content.MediaServers = obj.data.MediaServers
      // this.right.failedtasks = obj.data.failedtasks
      // this.right.device = obj.data.device
      // console.log("11",this.left.classsum[0].percent)
    },
    
    // clickHandler(){
    //   console.log('1111')
    // }
  }
};

</script>