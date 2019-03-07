<style>
</style>

<template>
  <div>
    <Button type="info">新建角色</Button>
    <Table border :columns="roleList" :data="roleData"></Table>
  </div>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    return {
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
                  }
                }),
                h("Icon", {
                  props: { type: "wrench", size: 25 },
                  style: {
                    marginRight: "15px"
                  }
                }),
                h("Icon", {
                  props: { type: "trash-a", size: 25 },
                  style: {
                  }
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
  }
};
</script>