<style>
@import "./home.css";
</style>

<template>

  <div>
      <button value="2121" type="button" @click="clickHandler">asdsad</button>

   <hometask ></hometask> 
    <homesuccess></homesuccess> 
   <homefail></homefail>  
   <homewarning></homewarning>
  </div>

</template>

<script>
import homesuccess from "./homesuccess.vue";
import hometask from "./hometask.vue";
import homefail from "./homefail.vue";
import homewarning from "./homewarning.vue";
export default {
  components: {
    homesuccess,
    hometask,
    homefail,
    homewarning
  },
  methods:{
    clickHandler(){
      console.log('1111')
    }
  }
};

</script>