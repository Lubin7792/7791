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
              <RadioGroup v-model="valueA" @on-change="filterType(parseInt(valueA))">
                <Radio label="6">只备份以下类型文件</Radio>
                <Input
                  v-model="valueB"
                  style="width: 300px"
                  placeholder="*txt;*exe;*dat"
                  @on-blur="filterValue(6,valueB)"
                />
                <p class="blanks"></p>
                <Radio label="7">不备份以下类型文件</Radio>
                <Input v-model="valueC" style="width: 300px" placeholder="*txt;*exe;*dat"   @on-blur="filterValue(7,valueC)"/>
              </RadioGroup>
            </div>
            <div class="clearfloat">
              <div class="frame fail">
                <p class="titles">打开文件失败处理方式</p>
                <RadioGroup v-model="valueF" @on-change="failType(parseInt(valueF))">
                  <Radio label="0">终止备份作业</Radio>
                  <p class="blanks"></p>
                  <Radio label="9">跳过被打开的文件</Radio>
                </RadioGroup>
              </div>
              <div class="list">
                <Checkbox v-model="showc" @on-change="checkType(showc,5)">启动高级文件备份</Checkbox>
                <p class="blanks"></p>
                <Checkbox v-model="showd" @on-change="checkType(showd,8)">备份后删除源文件</Checkbox>
              </div>
            </div>
            <div class="frame">
              <Checkbox
                label="备份前运行脚本"
                v-model="showa"
                @on-change="checkType(showa,3,valueD)"
              >备份前运行脚本</Checkbox>
              <Input
                v-model="valueD"
                :disabled="!showa"
                style="width: 300px"
                @on-blur="checkValue(showa,3,valueD)"
              />
              <p class="blanks"></p>
              <Checkbox v-model="showb" @on-change="checkType(showb,4,valueE)">备份后运行脚本</Checkbox>
              <Input
                v-model="valueE"
                :disabled="!showb"
                @on-blur="checkValue(showb,4,valueE)"
                style="width: 300px"
              />
            </div>
          </Form>
        </div>
        <div v-if="show2 === '131072'">
          <Checkbox v-model="showf" @on-change="checkType(showf,24,valueA)">指定脚本备份</Checkbox>
          <Input
            v-model="valueA"
            :disabled="!showf"
            @on-blur="checkValue(showf,24,valueA)"
            style="width: 300px"
          />
          <p class="blanks"></p>
          <p class="blanks"></p>
          <div class="frame oar">
            <p class="titles">备份选项</p>
            <Checkbox v-model="showa" @on-change="checkType(showa,13)">全库备份时备份归档日志</Checkbox>
            <p class="blanks"></p>
            <Checkbox v-model="showb" @on-change="checkType(showb,15)">删除已经备份的归档日志</Checkbox>
            <p class="blanks"></p>
            <span>归档备份范围</span>
            <Select
              v-model="valueB"
              style="width:160px"
              :label-in-value="true"
              @on-change="select(14,parseInt(valueB))"
              placeholder="备份所有归档"
            >
              <Option
                v-for="item in oracle.range"
                :label="item.name"
                :value="item.key"
                :key="item.key"
              ></Option>
            </Select>
            <p class="blanks"></p>
            <Checkbox v-model="showc" @on-change="checkType(showc,10,numberA)">配置通道个数</Checkbox>
            <InputNumber
              :max="10"
              :min="1"
              v-model="numberA"
              @on-change="checkValue(showc,10,numberA)"
            ></InputNumber>
            <p class="blanks"></p>
            <Checkbox v-model="showd" @on-change="checkType(showd,12,numberB)">指定(filesperset参数)</Checkbox>
            <InputNumber
              :max="5"
              :min="1"
              v-model="numberB"
              @on-change="checkValue(showd,12,numberB)"
            ></InputNumber>
            <p class="blanks"></p>
            <Checkbox v-model="showe" @on-change="checkType(showe,11)">启动ORACLE压缩</Checkbox>
          </div>
        </div>
        <div v-if="show2 === '196608'">
          <p>暂无</p>
        </div>
        <div v-if="show2 === '262144'">
         <Form ref="sqlserver" :model="sqlserver" :label-width="120">
            <div class="frame">
              <!-- <p class="titles">备份过滤选项</p> -->
              <FormItem label="备份前检查" class="marleft48">
                <Select
                  v-model="valueA"
                  style="width:160px"
                  :label-in-value="true"
                  @on-change="select(16,parseInt(valueA))"
                >
                  <Option
                    v-for="item in sqlserver.front"
                    :label="item.name"
                    :value="item.key"
                    :key="item.key"
                  ></Option>
                </Select>
              </FormItem>
              <FormItem label="备份后检查" class="marleft48">
                <Select
                  v-model="valueB"
                  style="width:160px"
                  :label-in-value="true"
                  @on-change="select(17,parseInt(valueB))"
                >
                  <Option
                    v-for="item in sqlserver.after"
                    :label="item.name"
                    :value="item.key"
                    :key="item.key"
                  ></Option>
                </Select>
              </FormItem>
              <Checkbox v-model="showa" @on-change="checkType(showa,18)">备份检验数据有效性（仅SQL 2005或以上版本）</Checkbox>
              <p class="blanks"></p>
              <Checkbox
                v-model="showb"
                @on-change="checkType(showb,19)"
              >检查失败后仍继续备份（如果不勾选,检查失败后将中止备份）</Checkbox>
            </div>
          </Form>
        </div>
        <div v-if="show2 === '327680'">
         <Checkbox v-model="showa" @on-change="checkType(showa,29)">跳过失败的虚拟机</Checkbox>
          <p class="blanks"></p>
          <Checkbox v-model="showb" @on-change="checkType(showb,21)">跳过关机的虚拟机</Checkbox>
          <p class="blanks"></p>
          <span>数据传输模式</span>
          <Select
            v-model="valueA"
            style="width:200px"
            :label-in-value="true"
            @on-change="select(28,parseInt(valueA))"
          >
            <Option
              v-for="item in vmware.modeList"
              :label="item.name"
              :value="item.key"
              :key="item.key"
            ></Option>
          </Select>
        </div>
        <div v-if="show2 === '393216'">
        <Form ref="basic" :model="basic" :label-width="120">
            <FormItem label="系统备份">
              <Input v-model="valueA"></Input>
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
  },
  destroyed() {},
  data() {
    return {
      showa: false,
      showb: false,
      showc: false,
      showd: false,
      showe: false,
      showf: false,
      valueA: "",
      valueB: "",
      valueC: "",
      valueD: "",
      valueE: "",
      valueF: "0",
      valueG: "",
      valueH: "",
      valueI: "",
      valueN: "",
      valueM: "",
      valueQ: "",
      numberA: 1,
      numberB: 5,
      showtest: "",
      options: [],
      basic: {
        state: ""
      },
      file: {
        name: "",
        type: "",
        client: "",
        state: "",
        filter: "",
        only: "",
        exclude: "",
        fail: "",
        other: [],
        beforeConten: "",
        afterConten: ""
      },
      sqlserver: {
        front: [
          {
            name: "不检查",
            key: "0"
          },
          {
            name: "检查索引一致性",
            key: "1"
          },
          {
            name: "检查物理一致性",
            key: "2"
          }
        ],
        frontResult: "",
        after: [
          {
            name: "不检查",
            key: "0"
          },
          {
            name: "检查索引一致性",
            key: "1"
          },
          {
            name: "检查物理一致性",
            key: "2"
          }
        ],
        afterResult: "",
        other: []
      },
      oracle: {
        numberA: 1,
        numberB: 5,
        number: "",
        number: "",
        number: "",
        number: "",
        script: "",
        rangeValue: 0,
        range: [
          {
            name: "备份所有归档",
            key: "0"
          },
          {
            name: "备份最近三天归档",
            key: "3"
          },
          {
            name: "备份最近七天归档",
            key: "7"
          }
        ]
      },
      vmware: {
        fail: "",
        off: "",
        mode: "",
        modeList: [
          { name: "NMBD", key: "1" },
          { name: "HOTADD", key: "2" },
          { name: "SAN", key: "3" },
          { name: "DEFAULT", key: "0" }
        ]
      }
    };
  },
  created() {
  },
  methods: {
    select(num, conten) {
      if (num == 28 && conten == 3) {
        this.deletes(num);
      } else {
        this.deletes(num);
        this.adds(num, conten);
      }
    },
    setOptins(num, conten) {
      this.adds(num, conten);
    },
    failType(num) {
      if (num == 9) {
        this.deletes(num);
        this.adds(num);
      } else {
        this.deletes(9);
      }
    },
    filterType(num) {
      this.deletes(6);
      this.deletes(7);
      var conten;
      if (num == "6") {
        conten = this.valueB;
      }
      if (num == "7") {
        conten = this.valueC;
      }
      this.adds(num, conten);
    },
    filterValue(num, conten) {
      if (this.valueA == num) {
        this.deletes(num);
        this.adds(num, conten);
      }
    },
    //多选
    checkType(state, num, conten) {
      if (state) {
        this.adds(num, conten);
      } else {
        this.deletes(num);
      }
    },
    //添加内数据
    adds(num, conten) {
      if (conten == undefined) {
        this.options.push({ type: num });
      } else {
        this.options.push({ type: num, value: conten.toString() });
      }
      // console.log(this.options);
    },
    //删除数据
    deletes(num) {
      function filters(element) {
        return element.type !== num;
      }
      this.options = this.options.filter(filters);
      // console.log(this.options);
    },
    //输入框添加数据
    checkValue(state, num, conten) {
      function filters(element) {
        return element.type !== num;
      }
      this.options = this.options.filter(filters);
      if (state) {
        this.options.push({ type: num, value: conten.toString() });
      }
    },
    showOption() {
      return this.options;
    },
    callBack(key, value) {
      Object.assign(this.$data, this.$options.data())
    }
  },
  updated() {
  },
  computed: {},
  watch: {}
};
</script> 