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
              <RadioGroup v-model="file.filter" @on-change="filterType(parseInt(file.filter))">
                <Radio label="6">只备份以下类型文件</Radio>
                <Input
                  v-model="file.only"
                  style="width: 300px"
                  placeholder="txt;exe;dat"
                  @on-blur="filterValue(6,file.only)"
                />
                <p class="blanks"></p>
                <Radio label="7">不备份以下类型文件</Radio>
                <Input v-model="file.exclude" style="width: 300px" placeholder="txt;exe;dat"/>
              </RadioGroup>
            </div>
            <div class="clearfloat">
              <div class="frame fail">
                <p class="titles">打开文件失败处理方式</p>
                <RadioGroup v-model="file.fail" @on-change="failType(parseInt(file.fail))">
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
                @on-change="checkType(showa,3,file.beforeConten)"
              >备份前运行脚本</Checkbox>
              <Input
                v-model="file.beforeConten"
                :disabled="!showa"
                style="width: 300px"
                @on-blur="checkValue(showa,3,file.beforeConten)"
              />
              <p class="blanks"></p>
              <Checkbox v-model="showb" @on-change="checkType(showb,4,file.afterConten)">备份后运行脚本</Checkbox>
              <Input
                v-model="file.afterConten"
                :disabled="!showb"
                @on-blur="checkValue(showb,4,file.afterConten)"
                style="width: 300px"
              />
            </div>
          </Form>
        </div>
        <div v-if="show2 === '131072'">
          <Checkbox v-model="showf" @on-change="checkType(showf,24,oracle.script)">指定脚本备份</Checkbox>
          <Input
            v-model="oracle.script"
            :disabled="!showf"
            @on-blur="checkValue(showf,4,oracle.script)"
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
              v-model="oracle.rangeValue"
              style="width:160px"
              :label-in-value="true"
              @on-change="select(14,parseInt(oracle.rangeValue))"
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
            <Checkbox v-model="showc" @on-change="checkType(showc,10,oracle.numberA)">配置通道个数</Checkbox>
            <InputNumber
              :max="10"
              :min="1"
              v-model="oracle.numberA"
              @on-change="checkValue(showc,10,oracle.numberA)"
            ></InputNumber>
            <p class="blanks"></p>
            <Checkbox
              v-model="showd"
              @on-change="checkType(showd,12,oracle.numberB)"
            >指定(filesperset参数)</Checkbox>
            <InputNumber
              :max="5"
              :min="1"
              v-model="oracle.numberB"
              @on-change="checkValue(showd,12,oracle.numberB)"
            ></InputNumber>
            <p class="blanks"></p>
            <Checkbox v-model="showe" @on-change="checkType(showe,11)">启动ORACLE压缩</Checkbox>
          </div>
        </div>
        <div v-if="show2 === '196608'">
          <p>暂无</p>
          <!-- <Form ref="basic" :model="basic" :label-width="120">
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
          </Form>-->
        </div>
        <div v-if="show2 === '262144'">
          <Form ref="sqlserver" :model="sqlserver" :label-width="120">
            <div class="frame">
              <!-- <p class="titles">备份过滤选项</p> -->
              <FormItem label="备份前检查" class="marleft48">
                <Select
                  v-model="sqlserver.frontResult"
                  style="width:160px"
                  :label-in-value="true"
                  @on-change="select(16,parseInt(sqlserver.frontResult))"
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
                  v-model="sqlserver.afterResult"
                  style="width:160px"
                  :label-in-value="true"
                  @on-change="select(17,parseInt(sqlserver.frontResult))"
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
          <Checkbox v-model="showa" @on-change="checkType(showa,21)">跳过失败的虚拟机</Checkbox>
          <p class="blanks"></p>
          <Checkbox v-model="showb" @on-change="checkType(showb,29)">跳过关机的虚拟机</Checkbox>
          <p class="blanks"></p>
          <span>数据传输模式</span>
          <Select
            v-model="vmware.mode"
            style="width:200px"
            :label-in-value="true"
            @on-change="select(28,parseInt(vmware.mode))"
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
          { name: "NMBD", key: "0" },
          { name: "HOTADD", key: "1" },
          { name: "SAN", key: "2" },
          { name: "DEFAULT", key: "3" }
        ]
      }
    };
  },
  methods: {
    select(num, conten) {
      if (num == 28 && conten == 3) {
        this.deletes(num);
      } else {
        this.deletes(num);
        this.adds(num, conten);
      }
      console.log( this.options
      )
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
        conten = this.file.only;
      }
      if (num == "7") {
        conten = this.file.exclude;
      }
      this.adds(num, conten);
    },
    filterValue(num, conten) {
      if (this.file.filter == num) {
        this.deletes(num);
        this.adds(num, conten);
      }
    },
    //多选
    checkType(state, num, conten) {
      console.log(state);
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
    }
  },
  computed: {},
  watch: {}
};
</script> 