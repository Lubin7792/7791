<style>
</style>

<template>
  <div>
    <Button type="info" @click="newRole">新建角色</Button>
    <Table border :columns="roleList" :data="roleData"></Table>
    <newRole :show="newShow" @close="closeNew"></newRole>
    <editRole :show="editShow" @close="closeEdit"></editRole>
    <rolePrower :show="prowerShow" @close="closePrower"></rolePrower>
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
      roleList: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "描述",
          key: "describe"
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
                  props: { type: "gear-b", size: 25 },
                  style: {
                    marginRight: "15px"
                  },
                  on: {
                    click: () => {
                      this.editShow = true;
                    }
                  }
                }),
                h("Icon", {
                  props: { type: "wrench", size: 25 },
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
                  style: {}
                })
              ]
            );
          }
        }
      ],
      roleData: [
        { name: "测试1", describe: "无" },
        { name: "测试2", describe: "无" },
        { name: "测试3", describe: "无" },
        { name: "测试4", describe: "无" }
      ]
    };
  },
  components: {
    newRole,
    editRole,
    rolePrower
  },
  methods: {
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