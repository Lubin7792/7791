<template>
  <div>
    <Modal title="文件恢复选项" v-model="modal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="开始恢复" cancel-text="取消恢复" width="500" :mask-closable="false">
		  <!-- 重定向恢复 -->
      <div class="redirect">
        <span class="marquee-top"><Checkbox v-model="redirection">重定向恢复</Checkbox></span>
        <Form label-position="left" :label-width="100">
            <FormItem label="目的机器：" :model="redirect">
                <Select placeholder="请选择机器" :disabled="!redirection" @on-open-change="aimMachines" v-model="redirect.machine">
                  <Option v-for="item in aimSelect" :value="item.id" :key="item.id">{{ item.machine }}</Option>
                </Select>
            </FormItem>
            <FormItem label="目的路径：">
              <Input type="text" :disabled="!redirection" v-model="redirect.path"></Input>
                <!-- <Row>
                  <Col span="19">
                    <Input type="text" :disabled="!redirection" v-model="redirect.path"></Input>
                  </Col>
                  <Col span="4" offset="1">
                      <Button type="primary" @click="browse">浏览</Button>
                  </Col>
                </Row> -->
            </FormItem>
        </Form>
      </div>
      <!-- 文件处理 -->
      <div class="handle">
        <span class="_title">已有文件处理方式</span>
        <Form label-position="left" :label-width="50">
          <RadioGroup v-model="fileHandle">
            <FormItem>
                <Radio label="news">直接覆盖已存储的文件</Radio>
            </FormItem>
            <FormItem>
                <Radio label="old">只覆盖老的文件</Radio>
            </FormItem>
          </RadioGroup>
        </Form>
      </div>
      <!-- 运行模式 -->
      <div class="handle">
        <span class="_title">运行模式</span>
        <Form label-position="left" :label-width="50">
          <RadioGroup v-model="runMode">
            <FormItem>
                <Radio label="normal">正常恢复</Radio>
            </FormItem>
            <FormItem>
                <Radio label="test">恢复测试</Radio>
            </FormItem>
          </RadioGroup>
        </Form>
      </div>
      <!-- 脚本设置 -->
      <div class="handle">
        <span class="_title">脚本设置</span>
        <Form label-position="left" :label-width="30">
            <FormItem>
              <Row>
                  <Col span="6">
                    <Checkbox v-model="recoveryBefore">恢复前脚本</Checkbox>
                  </Col>
                  <Col span="14" offset="1">
                    <Input type="text" :disabled="!recoveryBefore" v-model="scenarioPre"></Input>
                  </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                  <Col span="6">
                    <Checkbox v-model="recoveryAfter">恢复后脚本</Checkbox>
                  </Col>
                  <Col span="14" offset="1">
                    <Input type="text" :disabled="!recoveryAfter" v-model="scenarioAfter"></Input>
                  </Col>
              </Row>
            </FormItem>
        </Form>
      </div>
      <!-- 路径弹框 -->
      <div :class="show">
        <!-- 头部内容 -->
        <div class="pash-top">
          <p>路径选择</p>
        </div>
        <!-- 树形图 -->
        <div class="path-tree">
          <div class="tree">
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
      </div>
	  </Modal>
  </div>
</template>

<script>
  import util from '../../libs/util.js'

  export default {
    data() {
      return {
        // 重定向
        redirect: {
          machine: '',
          path: ''
        },
        // 文件处理
        fileHandle: 'news',
        // 运行模式
        runMode: 'normal',
        // 脚本设置
        scenarioPre: '',
        scenarioAfter: '',
        number: 1,
        show: "box-hide",
        redirection: false,
        recoveryBefore: false,
        recoveryAfter: false,
        modal: false,
        aimSelect: [],
        Client: '',
        RestoreTime: '',
        PolicyType: '',
        treeTemp: []
      }
    },

    methods: {
      browse:function() {
          if (this.number%2 === 0) {
            this.show = "box-hide"
          }else {
            this.show = "box-display"
          }
        this.number++;
      },
      // 接收父组件的传递
      recovery: function(row,tree) {
        this.treeTemp = tree
        this.Client = row.client;
        this.RestoreTime = row.RestoreTime;
        this.PolicyType = row.policytype;
        this.modal = true
      },
      // 目的机器获取数据
      aimMachines:function(open) {
        if(open == true) util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.aimlData)
      },
      // 目标机器回调数据
      aimlData:function(obj) {
        var array = new Array()
        for (let i = 0; i < obj.data.length; i++) {
          if(this.Client !== obj.data[i].id )
            array.push({
            id: obj.data[i].id,
            machine: obj.data[i].machine,
          })
        }
        this.aimSelect = array
      },
      ok() {
        var file = "1"; var run = "1";
        if(this.fileHandle == "news") {
          file = "1"
        }else {
          file = "2"
        }
        if(this.runMode == "normal") {
          run = "1"
        }else {
          run = "2"
        }
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.Client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.treeTemp,
            Options:[
              { type:22, value:this.redirect.path },
              { type:23, value:file },
              { type:30, value:run },
              { type:31, value:this.scenarioPre },
              { type:32, value:this.scenarioAfter }
            ]
          },
          'POST',
          this.clientslData
        )
      },
      cancel() {

      }
    }
  }
</script>
<style>
  .redirect {
    position: relative;
    padding: 20px;
    height: 25%;
  }
  .redirect .ivu-form-item {
    margin-bottom: 3px;
  }
  .marquee-top {
    position: absolute;
    top: -10px;
    left: 0px;
  }
  .handle {
    position: relative;
    padding-top: 20px;
    height: 25%;
    border: 1px solid #ccc;
    margin-bottom: 20px;
  }
  .handle .ivu-form-item {
    margin-bottom: 3px;
  }
  ._title {
    position: absolute;
    left: 10px;
    top: -10px;
    background: #fff;
  }
  .api {
    height: 400px;
  }
  .box-hide {  
    display: none;
  }
  .box-display {
    display: block;
    position: absolute;
    height: 100%;
    width: 400px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background: #fff;
    right: -400px;
    top: 0px;
  }
  .pash-top p {
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid #e9eaec;
  }
  .path-tree {
    padding: 20px;
    height: 90%;
  }
  .path-tree > .tree {
    height: 100%;
  }
</style>
