  <style>
@import "./newcontent.css";
</style>
<template>
  <div>
    <div v-if="show2">
      <div>
        <div v-show="show2 === '65536'" class="file">
          <Form ref="file" :model="file" :label-width="120">
            <div class="frame">
              <p class="titles">备份过滤选项</p>
              <RadioGroup v-model="file.filter">
                <Radio label="只备份以下类型文件"></Radio>
                <Input v-model="file.only" style="width: 300px"/>
                <p class="blanks"></p>
                <Radio label="不备份以下类型文件"></Radio>
                <Input v-model="file.exclude" style="width: 300px"/>
              </RadioGroup>
            </div>
            <div class="clearfloat">
              <div class="frame fail">
                <p class="titles">打开文件失败处理方式</p>
                <RadioGroup v-model="file.fail">
                  <Radio label="终止备份作业"></Radio>
                  <p class="blanks"></p>
                  <Radio label="跳过被打开的文件"></Radio>
                </RadioGroup>
              </div>
              <div class="list">
                <CheckboxGroup v-model="file.other">
                  <Checkbox label="启动高级文件备份"></Checkbox>
                  <p class="blanks"></p>
                  <Checkbox label="备份后删除源文件"></Checkbox>
                </CheckboxGroup>
              </div>
            </div>
            <div class="frame">
              <RadioGroup v-model="file.scritpts">
                <Radio label="备份前运行脚本"></Radio>
                <Input v-model="file.only" style="width: 300px"/>
                <p class="blanks"></p>
                <Radio label="备份后运行脚本"></Radio>
                <Input v-model="file.exclude" style="width: 300px"/>
              </RadioGroup>
            </div>
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
          <Form ref="sqlserver" :model="sqlserver" :label-width="120">
            <div class="frame">
              <p class="titles">备份过滤选项</p>
            </div>
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
      file: {
        name: "",
        type: "",
        client: "",
        state: "",
        filter: "",
        only: "",
        exclude: "",
        fail: "",
        other: "",
        scritpts: ""
      },
      sqlserver: {
        name: "",
        type: "",
        client: "",
        state: "",
        filter: "",
        only: "",
        exclude: "",
        fail: "",
        other: "",
        scritpts: ""
      }
    };
  }
};
</script> 