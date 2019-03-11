<style>
</style>
<template>
  <Modal title="新建决策" v-model="nowShow" @on-ok="ok" @on-cancel="cancel" ok-text="确定">
     <Form  :label-width="120">
      <FormItem label="角色名称">
          <Input v-model="name"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="describe" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
        </Form>
  </Modal>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
        nowShow:this.show,
        name:'',
        describe:''
    };
  },
  props: {
    show: {
      type: Boolean
    }
  },
  methods: {
      ok: function() {
        let test={"name":this.name,"desc":this.describe};
     util.restfullCall("/rest-ful/v3.0/role", test, "post", this.roleData);
      this.$emit("close", false);
    },
    cancel: function() {
      this.$emit("close", false);
    },
    roleData:function (data) {
     if(data.status==200){
      this.$emit("post");

     }else{
       alert(data.data.message)
     }
    }
    
  },
    watch: {
    show(now) {
      this.nowShow = now;
    }
  }
};
</script>