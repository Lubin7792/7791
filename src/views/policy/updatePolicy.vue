<style lang="less">
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
<template>
	<Modal   title="修改配置" v-model="InfoModal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="关闭"   class="policyModal">
		<Tabs type="card" :animated="false" @on-click="click" :value="tabName">
			<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
				<Content :show="show" @setshow="setshow"></Content>
			</TabPane>
		</Tabs>
	</Modal>
</template>
<script>
import Content from './content.vue'
export default {
  data() {
    return {
      InfoModal: this.upmodal,
      tabName:'基本信息',
      tabList: [
        {
          title: '基本信息'
        },
        {
          title: '备份资源'
        },
        {
          title: '备份选项'
        },
        {
          title: '调度计划'
        }
      ],
      show: '基本信息'
    }
  },
  components: {
    Content
  },
  props: {
    upmodal: {
      type: Boolean
    }
  },
  computed: {
    back(){
  return  this.$store.state.detailData
    }
  },
  methods: {
    delTabList: function() {
      this.tabList.splice(2, 1);
    },
    addTabList: function() {
      if (this.tabList.length == 3) {
        this.tabList.splice(2, 0, { title: "备份选项" });
      }},
    ok: function() {
      this.$emit('close', false)
    },
    cancel: function() {
      this.$emit('close', false)
    },
    click: function(name) {
      console.log(this.tabName)
      this.show = name
    },
    setshow:function(obj){
      console.log(obj);
      this.show=obj;
      this.tabName=obj;
      console.log( this.show);

    },
       datas(){
         console.log(1111)
   }
  },
  watch: {
  upmodal (upmodal) {
    this.InfoModal = upmodal
  },
  back(data){
if (data.base.type == 196608) {
      if(this.tabList.length == 4){
       this.delTabList();
      }
     }else{
       if(!(this.tabList.length == 4)){
         this.addTabList();
       }
     }
  }
}
}
</script>