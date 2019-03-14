<style>
@import "./servicemanager.css";
.name {
  font-size: 60px;
  background-color: #123;
}
</style>

<template>
  <div class="service">
    <Table border :columns="columns7" :data="data6" @on-row-click="getRowData" ></Table>
     <Modal  v-model="modal12" title="日志详情"  cancel-text class="popup">
               <popup :num="ceshi" ></popup>   
        </Modal>
  </div>
</template>
<script>
import axios from "axios";
import util from "../../libs/util";
import popup from "../common/popup.vue";
import $ from "jquery";
export default {
  data() {
    return {
      ceshi: [],
      modal12: false,
      columns7: [
        {
          title: "Name",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "Age",
          key: "age",
          width: 200
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "Action",
          key: "action",
          width: 350,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    size: "small",
                    className: "lubin"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal12 = true;
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    className: "sysdesc"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "停用"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "重启"
              )
            ]);
          }
        }
      ],
      data6: [
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
  methods: {
    getRowData(row, index) {
      this.ceshi = row;
    },
    remove(index) {
      this.data6.splice(index, 1);
    }
  },
  components: {
    popup
  }
};
</script>