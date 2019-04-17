<style>
@import './sqlserver.css';
</style>
<template>
    <Form class="sqlserver" :model="sqlserver" ref="sqlserver" :rules="ruleServer">
        <Row>
            <Col span="12">
            <FormItem label="实例名:"  prop="server">
                <Input v-model="sqlserver.server"></Input>
            </FormItem>
            </Col>
              <Col span="12">
            <span>认证方式</span>
            <Select v-model="type" style="width:170px" class='selection' >
                <Option v-for="item in authtype" :label="item.name" :value="item.type" :key="item.value"></Option>
            </Select>
              </Col>
        </Row>
        <Row>
           <Col span="12">
            <FormItem label="用户名:">
                <Input v-model="sqlserver.user" class="user-input" :disabled="disableds"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="密码:">
                <Input v-model="sqlserver.password" class="sqlserver-password" type="password" :disabled="disableds"></Input>
            </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
            <FormItem label="超时时间:">
                <InputNumber :max="300" :min="10" v-model="sqlserver.timeout"></InputNumber>
            </FormItem>
            </Col>
        </Row>
    <loading  v-show="loadingShow"></loading>
        <Row class="sqlserver-btn">
            <Button type="info" @click="updateSqlserver">保存修改</Button>
            <Button type="info" @click="newSqlserver">添加实例</Button>
            <Button type="info" @click="test">测试连接</Button>
            <Button type="info" @click="modalDelete = true">删除</Button>
            <Modal v-model="modalDelete" @on-ok="ok" @on-cancel="cancel" ok-text="确认删除" cancel-text="取消" class-name="vertical-center-modal">
                <p style="color:#f60;text-align:center;font-size:19px;">确认是否删除{{this.sqlserver.server}}实例，如果确认删除请点击删除，否认点击取消。</p>
            </Modal>
        </Row>
        <Row class="sqlserver-table">
            <Table :columns="columns" :data="data" @on-row-click="click" class="instanceTable"></Table>
        </Row>
    </Form>
</template>
<script>
import util from '../../libs/util.js'
export default {
  computed: {
    clientId() {
      return this.$store.state.index.clientId
    },
    instanceId() {
      return this.$store.state.index.instanceId
    },
    clientList() {
      return this.$store.state.index.clientList
    },
    thisType(){
      return this.type
    }

  },
  data() {
       const formServer = function(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else if (!/^[a-zA-Z0-9_]{1,84}$/.test(value)) {
        return callback(new Error("可包含-字母、数字、下划线"));
      } else {
        callback();
      }
    };
    return {
      loadingShow:false,
          ruleServer: {
        server: [
          {
            required: true,
            validator: formServer,
            trigger: "blur"
          }
        ]
      },
      sqlserver: {
        server:'',
        host: '',
        user: '',
        password: '',
        timeout: 10
      },
      modalDelete: false,
      columns: [
        {
          title: '服务地址',  
          key: 'server'
        },
        {
          width: 100,
          title: '用户名',
          key: 'user'
        },
        {
          title: '超时时间',
          width: 90,
          key: 'timeout'
        },
        {
          title: '认证方式',
          width: 170,
          key: 'authtype'
        }
      ],
      data: [],
      authtype: [],
      type: '',
      code: '',
      param: false,
      disableds:false
    }
  },
  created(){
    let url ="rest-ful/v3.0/MSSQLAuthType"
    util.restfullCall(url,null,"get",this.callAuthType)
  },
  mounted: function() {
    let url =
      'rest-ful/v3.0/client/agent/instances?cid=' +
      this.clientId +
      '&type=' +
     this.$store.state.index.clientTitle
    util.restfullCall(url, null, 'get', obj => {
      let data = []
      for (let i = 0; i < obj.data.length; i++) {
        let object = JSON.parse(obj.data[i].conf)
        let num = object.authtype;
         object.authtype = this.findType(num)
        object.id = obj.data[i].id
        data.push(object)
        this.data.push(data[i])
      }
      // for (let i = 0; i < data.length; i++) {
      //   this.data.push(data[i])
      // }

    })
   this.type =1;
  },
  watch: {
    thisType:function (type) {
      if(type == 1){
        this.disableds = true;
      }else{
        this.disableds = false;
      }
    }
  },
  methods: {
  findType:function (num) {
    function findCherries(fruit) { 
    return fruit.type ===num;
   }
 return this.authtype.find(findCherries).name
  },
   findName:function (name) {
    function findCherries(fruit) { 
    return fruit.name ===name;
   }
 return this.authtype.find(findCherries).type
  },
    // 认证方式
    callAuthType:function (obj) {
       this.authtype= obj.data;
    },
    //删除实例
    ok() {
      let url = 'rest-ful/v3.0/client/agent/instance/' + this.sqlserver.id
      util.restfullCall(url, null, 'delete', obj => {
        // state.commit('getCode',obj.data.code);
        // state.commit('getInstanceId',obj.data.id);
        if (obj.data.code == 0) {
          this.data.forEach((item, index) => {
            if (item.id == this.sqlserver.id) {
              this.data.splice(index, 1)
            }
          })
          this.sqlserver = []
          this.type = ''
        }else{
			alert(删除失败)
		}
      })
    },
    cancel() {
      this.sqlserver = []
      this.type = ''
    },
    click: function(item, index) {
      this.sqlserver.server = item.server
      this.sqlserver.user = item.user
      this.sqlserver.password = item.password
      this.sqlserver.timeout = item.timeout
      this.type = this.findName(item.authtype)
      this.sqlserver.id = item.id
    },
    updateSqlserver: function() {
if(!/^[a-zA-Z0-9_]{1,84}$/.test(this.sqlserver.server)){
        this.$Message.error("输入实例名格式错误！添加失败");
      }else{

      let url = 'rest-ful/v3.0/client/agent/instance/' + this.sqlserver.id
      let message = {}
      message.server = this.sqlserver.server
      message.user = this.sqlserver.user
      message.password = this.sqlserver.password
      message.timeout = this.sqlserver.timeout
      message.authtype = this.type
      let conf = JSON.stringify(message)
      let postData = {}
      postData.cid = this.clientId
      postData.conf = conf
      postData.type = parseInt(this.$store.state.index.clientTitle)
      postData.id = this.sqlserver.id
      util.restfullCall(url, postData, 'put', obj => {
        if (obj.data.code == 0) {
          this.data.map(x => {
            if (x.id == this.sqlserver.id) {
              x.server = message.server
              x.user = message.user
              x.password = message.password
              x.timeout = message.timeout
              x.authtype =this.findType(message.authtype)
            }
          })
        }
      })}
    },
    newSqlserver: function() {
      if(!/^[a-zA-Z0-9_]{1,84}$/.test(this.sqlserver.server)){
        this.$Message.error("输入实例名格式错误！添加失败");
      }else{
      let message = {}
      message.server = this.sqlserver.server
      message.user = this.sqlserver.user
      message.password = this.sqlserver.password
      message.timeout = parseInt(this.sqlserver.timeout)
      message.authtype = parseInt(this.type)
      let conf = JSON.stringify(message)
      let postData = {}
      postData.cid = this.clientId
      postData.type = parseInt(this.$store.state.index.clientTitle)
      postData.conf = conf
      util.restfullCall(
        'rest-ful/v3.0/client/agent/instance',
        postData,
        'post',
        obj => {
          if (obj.data.code == 0) {
            this.data.push({
              server: this.sqlserver.server,
              user: this.sqlserver.user,
              password: this.sqlserver.password,
              timeout:parseInt( this.sqlserver.timeout),
              authtype:this.findType( parseInt(this.type)),
              id: obj.data.id
            })
            this.sqlserver = []
            this.type = ''
          }
        }
      )
      console.log(postData)
      }
    },
    test: function() {
      this.loadingShow=true;
      let message = {}
      message.server = this.sqlserver.server
      message.user = this.sqlserver.user
      message.password = this.sqlserver.password
      message.timeout = this.sqlserver.timeout
      message.authtype = this.type
      let conf = JSON.stringify(message)
      let postData = {}
      postData.cid = this.clientId
      postData.conf = conf
      postData.id = this.sqlserver.id
      postData.type = parseInt(this.$store.state.index.clientTitle)
      util.restfullCall(
        'rest-ful/v3.0/client/agent/instance/test',
        postData,
        'post',
        obj => {
          this.loadingShow=false;
          if (obj.data.code == 0) {
           this.$Message.success('测试连接成功');
          }
   else {
            this.$Message.warning('测试连接失败');
          }
          
        }
      )
      // this.sqlserver = []
      // this.type = ''
    },
  }
}
</script>