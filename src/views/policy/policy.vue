<style>
@import "./policy.css";
</style>

<template>
	<div class='policy'>
		<Table border :columns="policyColumns"  :data="data56"></Table>
		<Button type="error" style="margin-top:15px;" @click="newPolicy">新建策略</Button>
		<Button type="error" style="margin-top:15px;">删除策略</Button>
		<Button type="error" style="margin-top:15px;" @click="updatePolicy">修改策略</Button>
		<newPolicy :newmodal="newmodal" @closePolicy="closePolicy"></newPolicy>
		<updatePolicy :modal="modal" @close="close"></updatePolicy>
	</div>
</template>
<script>
import updatePolicy from "./updatePolicy.vue";
import newPolicy from "./newPolicy.vue";
export default {
  data() {
    return {
       newmodal: true,
      modal: false,
      policyColumns: [
        {
          title: "名称",
          key: "name",
          sortable: true
        },
        {
          title: "策略类型",
          key: "type",
          sortable: true
        },
        {
          title: "优先级",
          key: "equipment",
          sortable: true
        },
        {
          title: "状态",
          key: "pool",
          sortable: true
        },
        {
          title: "介质池",
          key: "priority",
          sortable: true
        },
        {
          title: "介质服务器",
          key: "client",
          sortable: true
        },
        {
          title: "设备",
          key: "state",
          sortable: true
        },
        {
          title: "操作栏",
          key: "operation",
          render: (h, params) => {
            return h(
              "div",
              {
                class: {
                  lubin: true
                }
              },
              [
                h("span", {
                  props: {
                    size: 20
                  },
                  style: {
                    marginLeft: "15px"
                  },
                  class: {
                    run: true,
                    icon: true
                  }
                }),
                h("span", {
                  props: {
                    size: 20
                  },
                  style: {
                    marginLeft: "15px"
                  },
                  class: {
                    stop: true,
                    icon: true
                  },
                })
              ]
            );
          }
        }
      ],
      data56: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        }
      ]
    };
  },
  components: {
    updatePolicy,
    newPolicy
  },
  methods: {
    updatePolicy: function() {
      this.modal = true;
    },
    close: function(modal) {
      this.modal = modal;
    },  
    newPolicy: function() {
      this.newmodal = true;
    },
    closePolicy: function(newmodal) {
      this.newmodal = newmodal;
    }
  }
};
</script>