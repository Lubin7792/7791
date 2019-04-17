<style >
    .loading{
        position: fixed;
        z-index: 88;
        width: 50px;
        height: 50px;
    }
    .loading img{
        height: 50px;
        width: 50px;
}
</style>

<template>
    <div class="loading" id="loading" >
        <img src="../../images/loading.gif" alt="" >
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
  
      mounted() {
          document.onclick = function(ev){
                 var aLoading=document.getElementById('loading');
        let oEvent=ev||event;
        let scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        let scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        if(aLoading){
     aLoading.style.left=oEvent.clientX+scrollLeft- 25+'px';
        aLoading.style.top=oEvent.clientY+scrollTop-25+'px';
        }
          },
       document.onmousemove=function(ev){
           var aLoading=document.getElementById('loading');
        let oEvent=ev||event;
        let scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        let scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        if(aLoading){
     aLoading.style.left=oEvent.clientX+scrollLeft- 25+'px';
        aLoading.style.top=oEvent.clientY+scrollTop-25+'px';
        }
    
    }
  },
}
</script>