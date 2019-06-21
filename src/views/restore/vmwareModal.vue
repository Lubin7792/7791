<template>
  <div>
    <Modal title="恢复选项" v-model="modal" @on-ok="ok" @on-cancel="cancel" ok-text="开始恢复" cancel-text="取消恢复" width="500" :mask-closable="false">
      <!-- 恢复路径 -->
      <div>
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
        <Form label-position="left" :label-width="120">
            <FormItem label="客户端：">
                <Select placeholder="请选择客户端" :disabled="!disab" @on-open-change="clientChange" @on-change="onClient" v-model="redirect.client">
                  <Option v-for="item in clientSelect" :value="item.client" :key="item.client">{{ item.machine }}</Option>
                </Select>
            </FormItem>
            <FormItem label="重定向实例：">
                <Select placeholder="请选择实例" :disabled="!disab" @on-change="changes" @on-open-change="caseChange" v-model="redirect.case" :label-in-value="true">
                  <Option v-for="item in example" :value="item.host" :key="item.host">{{ item.host }}</Option>
                </Select>
            </FormItem>
            <FormItem label="重定向路径：">
                <Input type="text" :disabled="!disab" v-model="redirect.path"></Input>
            </FormItem>
        </Form>
        <Form>
            <FormItem>
                <Checkbox v-model="restart">恢复后启动虚拟机</Checkbox>
            </FormItem>
            <FormItem>
              <Checkbox v-model="fictitious">重命名虚拟机</Checkbox>
              <Input type="text" :disabled="!fictitious" v-model="redirect.name"></Input>
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
        restart: false,
        fictitious: false,
        path: 'new',
        redirect: {
          client: '',
          case: '',
          path: '',
          name: ''
        },
        clientSelect: [],
        example: [],
        RestoreTime: '',
        PolicyType: '',
        list: [],
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
      // 重选择客户端
      clientChange:function(open) {
        if(open == true) util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.clientslData)
      },
      // 客户端回调数据
      clientslData: function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            client:obj.data[i].id,
            machine:obj.data[i].machine
          })
        }
        this.clientSelect = array
      },
      // 客户端id
      onClient: function(id) {
        console.log("id",id)
        this.redirect.client = id
      },
      // 实例下拉框获取的数据
      caseChange: function(open) {
        if(open==true) util.restfullCall('/rest-ful/v3.0/client/agent/instances?cid='+this.redirect.client+'&type='+this.PolicyType, null, 'get', this.exampleData)
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
      this.redirect.case = datas.label
      },
      // 接收父组件的传递
      vmware: function(row, data) {
        var array = new Array
        for(var i=0;i<data.length;i++) {
          console.log(data[i].name.substring(0,1))
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
        this.redirect.client = row.client
        this.RestoreTime = row.RestoreTime;
        this.PolicyType = row.policytype
        this.modal = true
      },
      // 单选恢复到原路径
      originalPath:function(path) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[]
          },
          'POST',
          this.calbackClients
        )
      },
      // 恢复原路径+恢复后启动虚拟机
      originalMachine:function(path) {
          util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type: 33}
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 恢复原路径+重命名虚拟机
      originalName:function(path) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:34, value:this.redirect.name }
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 恢复原路径+恢复后启动虚拟机+重命名虚拟机
      originaAll:function(path) {
          util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:33},
              { type:34, value:this.redirect.name }
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 单选重定向恢复
      singleRedirect:function(path) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:22, value:this.redirect.path },
              { type:35, value:this.redirect.case },
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 单选重定向恢复+恢复后启动虚拟机
      redirectMachine:function(path) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:33},
              { type:22, value:this.redirect.path },
              { type:35, value:this.redirect.case },
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 单选重定向恢复+重命名虚拟机
      redirectName:function(path) {
        util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:22, value:this.redirect.path },
              { type:34, value:this.redirect.name },
              { type:35, value:this.redirect.case },
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      // 单选重定向恢复+恢复后启动虚拟机+重命名虚拟机
       redirectAll:function(path) {
        return util.restfullCall(
          '/rest-ful/v3.0/restore',
          { Client:this.redirect.client, RestoreTime:this.RestoreTime, PolicyType:this.PolicyType,
            Resources:this.list,
            Options:[
              { type:33 },
              { type:22, value:this.redirect.path },
              { type:34, value:this.redirect.name },
              { type:35, value:this.redirect.case },
            ]
          },
          'POST',
          this.calbackClients
        )
      },
      ok() {
        if((this.path == "new")&&((this.restart==false)&&(this.fictitious==false))){
          // 只选恢复到原路径
          this.originalPath()
        }else if((this.path == "new")&&((this.restart==true)&&(this.fictitious==false))) {
          // 只选恢复到原路径+恢复后启动虚拟机
          this.originalMachine()
        }else if((this.path == "new")&&((this.restart==false)&&(this.fictitious==true))) {
          // 只选恢复到原路径+重命名虚拟机
          this.originalName()
        }else if((this.path == "new")&&((this.restart==true)&&(this.fictitious==true))) {
          // 只选恢复到原路径+恢复原路径+恢复后启动虚拟机+重命名虚拟机
          this.originaAll()
        }else if((this.path == "old")&&((this.restart==false)&&(this.fictitious==false))) {
          // 单选重定向恢复
          this.singleRedirect()
        }else if((this.path == "old")&&((this.restart==true)&&(this.fictitious==false))) {
          // 单选重定向恢复+恢复后启动虚拟机
          this.redirectMachine()
        }else if((this.path == "old")&&((this.restart==false)&&(this.fictitious==true))) {
          // 单选重定向恢复+重命名虚拟机
          this.redirectName()
        }else if((this.path == "old")&&((this.restart==false)&&(this.fictitious==true))) {
          // 单选重定向恢复+恢复后启动虚拟机+重命名虚拟机
          this.redirectAll()
        }
        // 初始化弹框
        this.path="new";
        this.redirect.client='';
        this.redirect.case='';
        this.redirect.path='';
        this.restart=false;
        this.fictitious=false;
        this.redirect.name='';
        this.clientSelect=[];
        this.example=[];
        this.list=[];
      },
      calbackClients:function(data) {
        if(data.data.code==0){
           this.$Message.success('提交恢复任务成功，转到任务监控可以查看任务详细信息');
        }else{
           this.$Message.error('提交任务失败'+data.data.message);
        }
      },
      cancel() {
        this.list=[];
      }
    }
  }
</script>
