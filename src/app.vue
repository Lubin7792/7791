<style>
/* body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
} */
</style>

<template>
  <div >
    <router-view></router-view>
  </div>
</template>

<script>
document.body.onselectstart = function(){
　　return false;
}
export default {};
</script>
