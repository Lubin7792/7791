  <style>
@import "./policy.css";
@import "./newcontent.css";
</style>
<template>
  <div>
    <div v-if="show2">
      <div>
        <div v-show="show2 === '65536'" class="file">
          <Form ref="basic" :model="basic" :label-width="120">
            <div class="filter">
              <RadioGroup v-model="basic.animal">
                <Radio label="只备份以下类型文件"></Radio>
                <Input v-model="basic.only" placeholder="Enter something..." style="width: 300px"/>
                <Radio label="不备份以下类型文件"></Radio>
                <Input
                  v-model="basic.exclude"
                  placeholder="Enter something..."
                  style="width: 300px"
                />
              </RadioGroup>
            </div>
            <div class="fail">
              <RadioGroup v-model="disabledGroup">
                <Radio label="终止备份作业" disabled></Radio>
                <Radio label="跳过被打开的文件"></Radio>
              </RadioGroup>
            </div>
            <div class="list"></div>
          </Form>
        </div>
        <div v-if="show2 === '131072'">
          <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="使用多通道">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="开启ORACLE压缩">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="数据片中文件个数">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="全库备份时备份归档">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="归档备份范围">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="删除已经备份的归档">
              <Input v-model="basic.state"></Input>
            </FormItem>
          </Form>
        </div>
        <div v-if="show2 === '196608'">
          <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="使用多通道">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="开启MYSQL备份">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="数据片中文件个数">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="全库备份时备份归档">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="归档备份范围">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="删除已经备份的归档">
              <Input v-model="basic.state"></Input>
            </FormItem>
          </Form>
        </div>
        <div v-if="show2 === '262144'">
          <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="备份前一致性检查">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="备份后一致性检查">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="启用SQLSERVER压缩  ">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="事务日志截断">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="归档备份范围">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="删除已经备份的归档">
              <Input v-model="basic.state"></Input>
            </FormItem>
          </Form>
        </div>
        <div v-if="show2 === '327680'">
          <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="跳过失败的虚拟机">
              <Input v-model="basic.state"></Input>
            </FormItem>
            <FormItem label="跳过关机的虚拟机">
              <Input v-model="basic.state"></Input>
            </FormItem>
          </Form>
        </div>
        <div v-if="show2 === '393216'">
          <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="系统备份">
              <Input v-model="basic.state"></Input>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div v-else>
      <p>请先选择策略类型</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    show2: {
      type: String
    },
    model1: {
      type: [String, Object]
    }
  },
  created() {
    this.showtest = this.show2;
    console.log(this.show2);
  },
  methods: {},
  data() {
    return {
      showtest: "",
      basic: {
        name: "",
        type: "",
        client: "",
        state: "",
        animal: "",
        only: "",
        exclude: ""
      },
      plan: {},
      resources: {
        pool: "",
        equipment: ""
      },
      option: {
        content: "",
        encryption: "",
        compress: ""
      },
      frequency: [
        {
          value: "天",
          label: "天"
        },
        {
          value: "周",
          label: "周"
        },
        {
          value: "月",
          label: "月"
        },
        {
          value: "季度",
          label: "季度"
        },
        {
          value: "年",
          label: "年"
        }
      ],
      level: [
        {
          value: "全量",
          label: "全量"
        },
        {
          value: "增量",
          label: "增量"
        },
        {
          value: "差量",
          label: "差量"
        }
      ],
      cycle: [
        {
          value: "天",
          label: "天"
        },
        {
          value: "周",
          label: "周"
        },
        {
          value: "月",
          label: "月"
        },
        {
          value: "季度",
          label: "季度"
        },
        {
          value: "年",
          label: "年"
        }
      ]
    };
  }
};
</script> 