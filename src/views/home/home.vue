<style>
@import "./home.css";
</style>

<template>

  <div>
      <!-- <button value="2121" type="button" @click="clickHandler">asdsad</button> -->

    <hometask :left="dataList"></hometask> 
    <!-- <homesuccess :content="dataList"></homesuccess>  -->
    <!-- <homefail :right="dataList"></homefail>   -->
    <!-- <homewarning></homewarning> -->
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
      dataList:{}
    }
  },
  created() {
    // 获取首页数据
    util.restfullCall('/rest-ful/v3.0/homepage', null, 'get', this.callbackHome)
  },
  methods:{
    // 首页数据回调
    callbackHome:function(obj) {
      // console.log(obj.data)
      this.dataList = JSON.parse(JSON.stringify(obj.data))
    },
    
    clickHandler(){
      // console.log('1111')
    }
  }
};

</script>