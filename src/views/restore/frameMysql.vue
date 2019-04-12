<style scoped>
  .sql-path {
    border: 1px solid #ccc;
    padding: 20px;
    position: relative;
  }
  .sql-title {
    position: absolute;
    left: 10px;
    top: -10px;
    background: #fff;
    font-weight: 600;
  }
</style>

<template>
  <div>
    <Modal title="恢复选项" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="开始恢复" cancel-text="取消恢复" width="500" :mask-closable="false">
      <!-- 恢复路径 -->
      <div>
      <!-- <div class="sql-path"> -->
        <!-- <span class="sql-title">恢复路径</span> -->
        <Form label-position="left" :label-width="0">
          <RadioGroup v-model="path">
            <FormItem>
                <Radio label="new">恢复到原路径</Radio>
            </FormItem>
            <FormItem>
                <Radio label="old">重定向恢复</Radio>
            </FormItem>
          </RadioGroup>
        </Form>
        <Form label-position="left" :label-width="100">
          <FormItem label="目的机器：">
                <Select placeholder="请选择机器" :disabled="!disab" @on-open-change="aimMachine" @on-change="aimChanges" v-model="aim">
                  <Option v-for="item in aimSelect" :value="item.id" :key="item.id">{{ item.machine }}</Option>
                </Select>
            </FormItem>
            <FormItem label="实例名：">
                <Select placeholder="请选择实例" :disabled="!disab" @on-change="changes" @on-open-change="exampleSlect" v-model="exa" :label-in-value="true">
                  <Option v-for="item in example" :value="item.host" :key="item.host">{{ item.host }}</Option>
                </Select>
            </FormItem>
        </Form>
      </div>
	  </Modal>
  </div>
</template>

<script>
  import util from '../../libs/util.js'

  export default {
    data() {
      return {
        modal: false,
        disab: false,
        // 恢复路径
        path: 'new',
        aimSelect: [],
        example: [],
        aim: '',
        exa: '',
        RestoreTime: '',
        PolicyType: '',
        list:[]
      }
    },
    watch: {
      path: {
        handler(newVal, oldVal) {
          if(newVal=="new") {
            this.disab = false
          }else if(newVal=="old") {
            this.disab = true
          }
        }
      }
    },
    methods: {
      // 目的机器获取数据
      aimMachine:function(open) {
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
      // 目标机器选中id
      aimChanges:function(id) {
        this.aim = id
      },
      // 实例下拉框获取的数据
      exampleSlect: function(open) {
        if(open==true) util.restfullCall('/rest-ful/v3.0/client/agent/instances?cid='+this.aim+'&type='+this.PolicyType, null, 'get', this.exampleData)
      },
      // 实例下拉框回调
      exampleData: function(obj) {
        let data = []
        for(let i = 0;i < obj.data.length;i++ ){
          let object = JSON.parse(obj.data[i].conf)
          data.push(object)
        }
        var array = new Array
        for(let i = 0;i < data.length;i++ ){
          array.push({
            host:data[i].host
          })
        }
        this.example = array

      },
       // 选中实例名字
      changes: function(datas) {
      this.exa = datas.label
      },
      // 接收父组件的传递
      mysql: function(row, data) {
        var array = new Array
        for(var i=0;i<data.length;i++) {
          // console.log(data[i].name.substring(0,1))
          if(data[i].name.substring(0,1) == '+'){  
            this.list.push({
              Exclude:0,
              Type:data[i].type,
              path: data[i].name.substring(1,data[i].name.length)
            })
          }else  if(data[i].name.substring(0,1) == '-'){  
            this.list.push({
              Exclude:1,
              Type:data[i].type,
              path: data[i].name.substring(1,data[i].name.length)
            })
          }
        }
        this.aim = row.client
        this.RestoreTime = row.RestoreTime;
        this.PolicyType = row.policytype
        this.modal = true
      },
      // 恢复原路径
      originalPath:function(arr) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.aim, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[]
          },
          'POST',
          this.clientslData
        )
      },
      // 重定向恢复
      singleRedirect:function(arr) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.aim, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:22, value:this.exa },
            ]
          },
          'POST',
          this.clientslData
        )
      },
      ok() {
        if(this.path == "new") {
          this.originalPath()
        }else if(this.path == "old") {
          this.singleRedirect()
        }
        // 初始化弹框
        this.path="new";
        this.aim='';
        this.exa='';
        this.aimSelect=[];
        this.example=[];
        this.list=[]
      },
      cancel() {
        this.list=[];
      }
    }
  }
</script>
