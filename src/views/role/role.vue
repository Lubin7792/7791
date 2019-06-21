<style>
</style>

<template>
  <div>
    <div style="with:100%;text-align:right">
      <Button style="margin-bottom:10px;" type="primary" @click="newRole" v-if="nowShow(getPower.newRole)">
        <div class="buttonDiv">
              <img class="buttonIcon" src="../../images/newUser.png" >
           新建角色
           </div>
        </Button>
    </div>
    <Table border :columns="roleList" :data="roleData"></Table>
    <newRole :show="newShow" @close="closeNew" @post="backPost"></newRole>
    <editRole :show="editShow" @close="closeEdit" :backData="editData" @edit="backPost"></editRole>
    <rolePrower :show="prowerShow" @close="closePrower" :postData="ztreeData" :ztreeId="backId"></rolePrower>
    <Modal
      v-model="modalDelete"
      @on-ok="ok"
      ok-text="确认删除"
      cancel-text="取消"
      :closable="false"
      class-name="vertical-center-modal"
    >
      <p style="color:#f60;text-align:center;font-size:16px;">确认是否删除该实例，如果确认删除请点击删除，否认点击取消。</p>
    </Modal>
  </div>
</template>
<script>
import util from "../../libs/util.js";
import newRole from "./newRole.vue";
import editRole from "./editRole.vue";
import rolePrower from "./rolePrower";
export default {
  data() {
    return {
      newShow: false,
      editShow: false,
      prowerShow: false,
      modalDelete: false,
      rowId: "",
      backId: null,
      editData: {},
      ztreeData: [],
      roleList: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "描述",
          key: "desc"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  role: true
                }
              },
              [
                this.nowShow(this.getPower.editRole)?h("Div", {
                  props: { },
                  style: {
                    marginRight: "15px"
                  },
                  class:{
                    renderIcon:true,
                    policyA:true
                  },
                  on: {
                    click: () => {
                      console.log();
                      if(params.row.id>3){
                           this.editShow = true;
                      (this.editData = params.row);
                      }
                      
                   
                    }
                  }
                }):'',
               this.nowShow(this.getPower.setPower)? h("Icon", {
                  props: { type: "gear-b", size: 22 },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      if(params.row.id>3){
                      this.prowerShow = true;
                      this.backId = params.row.id;
                      util.restfullCall(
                        "/rest-ful/v3.0/role/" + params.row.id + "/privilege",
                        null,
                        "get",
                        this.rolePost
                      );
                      }
                    }
                  }
                }):'',
               this.nowShow(this.getPower.deleteRole)? h("Icon", {
                  props: { type: "trash-a", size: 22 },
                  on: {
                    click: () => {
                      if(params.row.id>3){
                      this.rowId = params.row.id;
                      this.modalDelete = true;
                    }
                    }
                  },
                  style: {}
                }):''
              ]
            );
          }
        }
      ],
      roleData: [],
      numNowList:[],

    };
  },
  components: {
    newRole,
    editRole,
    rolePrower
  },
  created() {
    this.$store.dispatch("getPrivilege", this.$store.state.power.module.role);
    util.restfullCall("/rest-ful/v3.0/roles", null, "get", this.rolesData);
  },
      computed: {
    getPrivilege(){
      return this.$store.state.index.privilegeData
    },
          getPower(){
      return this.$store.state.power.name
    },
  },
  watch: {
    getPrivilege(data){
      this.numNowList=data
    }
  },
  methods: {
            nowShow(num){
      if(this.numNowList.indexOf(num)!=-1){
        return true
      }else{
        return false
      }
    },
    rolePost: function(data) {
      this.ztreeData = data.data;
    },
    ok: function() {
      util.restfullCall(
        "/rest-ful/v3.0/role/" + this.rowId,
        null,
        "delete",
        this.deleteData
      );
    },
    deleteData: function(data) {
      if (data.data.code == 0) {
        this.backPost();
      }
    },
    backPost: function() {
      util.restfullCall("/rest-ful/v3.0/roles", null, "get", this.rolesData);
    },
    rolesData: function(data) {
      this.roleData = data.data;
    },
    newRole: function() {
      this.newShow = true;
    },
    closeNew: function(now) {
      this.newShow = now;
    },
    closeEdit: function(now) {
      this.editShow = now;
    },
    closePrower: function(now) {
      this.prowerShow = now;
    }
  }
};
</script>