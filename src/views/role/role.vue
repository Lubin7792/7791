<style>
</style>

<template>
  <div>
    <Button type="info" @click="newRole">新建角色</Button>
    <Table border :columns="roleList" :data="roleData"></Table>
    <newRole :show="newShow" @close="closeNew" @post="backPost"></newRole>
    <editRole :show="editShow" @close="closeEdit" :backData="editData" @edit="backPost"></editRole>
    <rolePrower :show="prowerShow" @close="closePrower"></rolePrower>
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
      rowId:'',
      editData: {},
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
                h("Icon", {
                  props: { type: "edit", size: 25 },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.editShow = true;
                      (this.editData = params.row), console.log(this.editData);
                    }
                  }
                }),
                h("Icon", {
                  props: { type: "gear-b", size: 25 },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.prowerShow = true;
                    }
                  }
                }),
                h("Icon", {
                  props: { type: "trash-a", size: 25 },
                  on: {
                    click: () => {
                     this.rowId=params.row.id;
                      this.modalDelete = true
                    }
                  },
                  style: {}
                })
              ]
            );
          }
        }
      ],
      roleData: []
    };
  },
  components: {
    newRole,
    editRole,
    rolePrower
  },
  created() {
    util.restfullCall("/rest-ful/v3.0/roles", null, "get", this.rolesData);
  },
  methods: {
    ok:function () {
       util.restfullCall(
                        "/rest-ful/v3.0/role/" +this.rowId,
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