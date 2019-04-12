<style>
</style>
<template>
  <Modal title="编辑策略" v-model="nowShow" @on-ok="ok" @on-cancel="cancel" ok-text="确定">
     <Form  :label-width="120">
      <FormItem label="角色名称">
          <Input v-model="backData.name"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="backData.desc" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
        </Form>
  </Modal>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
        nowShow:this.show
    };
  },
  props: {
    show: {
      type: Boolean
    },
    backData:{
      type:Object
    }
  },
  methods: {
      ok: function() {
         let test={"name":this.backData.name,"desc":this.backData.desc,"id":this.backData.id};
     util.restfullCall("/rest-ful/v3.0/role/"+this.backData.id, test, "put",this.editData );

      this.$emit("close", false);
    },
    cancel: function() {
      this.$emit("close", false);
    },
    editData:function (data) {
 if(data.data.code==0){
      this.$emit("edit");

     }else{
       alert(data.data.message)
        this.$emit("edit");
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

