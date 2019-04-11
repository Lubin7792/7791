<template>
  <div>
    <Modal v-model="modal1" title="下载客户端" @on-ok="ok" @on-cancel="cancel" :mask-closable="false" width="700">
      <!-- 下拉框选择部分 -->
      <Form :label-width="110" label-position="left">
        <!-- 安装类型 -->
        <FormItem label="安装类型">
          <Select v-model="install" @on-change="onInstall">
            <Option v-for="item in installSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select>
        </FormItem>
          
        <!-- 系统类型 -->
        <FormItem label="系统类型">
          <Select v-model="system" @on-change="onSystem">
            <Option v-for="item in systemSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <!-- 系统位数选择 -->
        <FormItem label="系统位数选择">
          <Select v-model="number" @on-change="onNumber">
            <Option v-for="item in numberSelect" :value="item.type" :key="item.type">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <!-- 表格部分 -->
      <Table :columns="downList" :data="downData" id="btnn"></Table>
    </Modal>    
  </div>
</template>
<script>
import util from "../../libs/util.js";
  export default {
    data () {
      return {
        modal1: false,
        install: '',
        installSelect: [],
        system: '',
        systemSelect: [],
        number: '',
        numberSelect:[],
        downList:[
          { title: '程序名称', key: 'name' },
          { title: '版本', key: 'version', width: 100, },
          { title: '描述', key: 'desc' },
          { title: '操作', width: 80,
            render: (h, params) => {
               return h('div', [
                h('a', {
                  attrs: {
                    href: params.row.url
                  },
                  style: {
                    // 样式
                  },
                  on: {
                    click: () => {
                      // console.log(params.row.url)
                    }
                  }
                },'下载')
              ])
            }
          },
        ],
        downData:[]
      }
    },
    created() {
      // 安装类型接口
      util.restfullCall( "/rest-ful/v3.0/installtype", null, "get", this.typeData);
      // 系统类型接口
      util.restfullCall( "/rest-ful/v3.0/ostype", null, "get", this.ostypeData);
      // 系统位数接口
      util.restfullCall( "/rest-ful/v3.0/osbits", null, "get", this.osbitsData);
    },
    computed: {
      address() {
        const { install, system, number} = this
        return {
          install,
          system,
          number
        }
      }
    },
    watch: {
      address: {
        handler:function(newval , oldval) {
          if((newval.install&&newval.system)&&newval.number)
          // 下载表格接口
          util.restfullCall( '/rest-ful/v3.0/package?insttype='+newval.install+'&ostype='+newval.system+'&bits='+newval.number, null, "get", this.packageData);
        },
        deep:true
      }
    },
    methods: {
      // 接收父组件的传值
      downModel:function() {
        this.modal1 = true
      },
      // 系统类型接口回调
      typeData:function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            type:obj.data[i].type,
            name:obj.data[i].name
          })
        }
        this.installSelect = array
        this.install = array[0].type
      },
      // 选中的系统类型type
      onInstall:function(type) {
        this.install = type
      },
      // 安装类型接口回调
      ostypeData:function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            type:obj.data[i].type,
            name:obj.data[i].name
          })
        }
        this.systemSelect = array
        this.system = array[0].type
      },
      // 选中的安装类型type
      onSystem:function(type) {
        this.system = type
      },
      // 系统位数接口回调
      osbitsData:function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            type:obj.data[i].type,
            name:obj.data[i].name
          })
        }
        this.numberSelect = array
        this.number = array[0].type
      },
      // 选中的系统位数type
      onNumber:function(type) {
        this.number = type
      },
      // 下载表格接口回调
      packageData:function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            desc:obj.data[i].desc,
            name:obj.data[i].name,
            url:obj.data[i].url,
            version:obj.data[i].version,
          })
        }
        this.downData = array
      },
      ok () {
        this.$Message.info('点击了确定');
      },
      cancel () {
        // this.$Message.warning('操作已取消');
      }
    }
  }
</script>