<template>
  <Collapse v-model="model" @on-change="col1">
    <!-- 系统安全设置 -->
    <Panel name="1">
      <!-- 标题栏 -->
      <span class="xt">系统安全设置</span>
      <!-- 安全级别 -->
      <div slot="content" class="security-select">
        <Form :label-width="100">
          <FormItem label="安全级别：" >
            <Select
              style="width:400px"
              :disabled ="!nowShow(getPower.setSecurityLevel)"
              v-model="levelSelect"
              @on-open-change="openSafe"
              @on-change="onSafe"
              placeholder="请选择安全级别"
            >
              <Option v-for="item in securityLevel" :value="item.id" :key="item.id">{{ item.level }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="content" class="setPassword">
        <span class="_title">设置密码</span>
        <Form :model="formItem" ref="formItem" :rules="ruleValidate" :label-width="100">
          <FormItem label="原密码：">
            <Input type="password" v-model="formItem.old" placeholder="请输入原密码" style="width: 70%"></Input>
          </FormItem>
          <FormItem label="新密码：" prop="password">
            <Input
              type="password"
              v-model="formItem.password"
              placeholder="请输入新密码"
              style="width: 70%"
            ></Input>
          </FormItem>
          <FormItem label="重输密码：" prop="rpassword">
            <Input
              type="password"
              v-model="formItem.rpassword"
              placeholder="重新输入新密码"
              style="width: 70%"
            ></Input>
          </FormItem>
        </Form>
        <Form :label-width="50">
          <FormItem>
            <Button style="margin-right: 8px" @click="Reset">重 置</Button>
            <Button type="primary" class="buttonA"   @click="confirm">确认修改</Button>
          </FormItem>
        </Form>
      </div>
    </Panel>

    <!-- 系统参数设置 -->
    <Panel name="2">
      <!-- 标题栏 -->
      <span class="xt">系统参数设置</span>
      <div slot="content">
        <Form :label-width="150">
          <FormItem label="调度间隔时间：">
            <InputNumber :max="5" :min="1" v-model="parameter.dispatch"></InputNumber>（ 单位/分 ）
          </FormItem>
          <FormItem label="设备状态检查间隔时间：">
            <InputNumber :max="15" :min="5" v-model="parameter.state"></InputNumber>（ 单位/分 ）
          </FormItem>
          <FormItem label="介质回收间隔时间：">
            <InputNumber :max="15" :min="5" v-model="parameter.recovery"></InputNumber>（ 单位/分 ）
          </FormItem>
          <FormItem label="客户端最大并行任务数：">
            <InputNumber :max="10" :min="5" v-model="parameter.task"></InputNumber>（ 单位/个 ）
          </FormItem>
          <FormItem label="系统日志保留最长时间">
            <InputNumber :max="30" :min="7" v-model="parameter.log"></InputNumber>（ 单位/天 ）
          </FormItem>
        </Form>
        <Button class="buttonA" @click="onSystem" type="success"  :disabled ="!nowShow(getPower.setsysset)">保存</Button>
      </div>
    </Panel>

    <!-- 发送邮件账户设置 -->
    <Panel name="3">
      <!-- 标题栏 -->
      <span class="xt">邮件设置</span>
      <Row slot="content" class="Email">
        <!-- 左侧 -->
        <Col span="12">
          <!-- <div slot="content" class="Email"> -->
          <span class="_titles">发送邮件账户设置</span>
          <Form :label-width="160" ref="mailbox" :model="mailbox" :rules="ruleEmail">
            <FormItem label="邮 件 账 户：" prop="admin">
              <Input type="text" v-model="mailbox.admin" placeholder="请输入邮件账户" style="width: 70%"></Input>
            </FormItem>
            <FormItem label="邮 件 密 码：" prop="password">
              <Input
                type="password"
                v-model="mailbox.password"
                placeholder="请输入邮件密码"
                style="width: 70%"
              ></Input>
            </FormItem>
            <FormItem label="SMTP服务器地址：" prop="path">
              <Input v-model="mailbox.path" placeholder="重新输入SMTP服务器地址" style="width: 70%"></Input>
            </FormItem>
            <FormItem label="SMTP服务器端口号：" prop="port">
              <Input v-model="mailbox.port" placeholder="重新输入SMTP服务器端口号" style="width: 70%"></Input>
            </FormItem>
          </Form>
          <Button class="email-but buttonA" @click="onMailbox" type="success" :disabled ="!nowShow(getPower.setEmail)">&nbsp;保 存&nbsp;</Button>
          <!-- </div> -->
        </Col>
        <!-- 右侧 -->
        <Col span="12">
          <Form
            ref="Emailpath"
            :model="Emailpath"
            :rules="ruleMail"
            :label-width="110"
            label-position="left"
          >
            <FormItem label="EMAIL地址：" prop="mailPath">
              <Input v-model="Emailpath.mailPath" placeholder="请输入EMAIL地址" style="width: 70%"></Input>
            </FormItem>
          </Form>
          <div class="_button">
            <Button type="error" @click="addEmail"   :disabled ="!nowShow(getPower.setEmail)">添加</Button>
            <Button type="warning"  class="buttonA"  @click="preservation" :disabled ="!nowShow(getPower.setEmail)">保存</Button>
            <Button type="error" @click="deleteEmail" class="buttonB"  :disabled ="!nowShow(getPower.setEmail)">删除</Button>
          </div>
          <Table
            class="_tabs"
            highlight-row
            border
            :columns="emails"
            :data="emailData"
            @on-row-click="rowClick"
            height="190"
          ></Table>
        </Col>
      </Row>
    </Panel>
   <Panel name="4"  class="license">
     <span class="xt">授权信息</span>
      <Row slot="content" >
        <Col span="20">
        <Tabs value="name1" type="card" :animated="false">
          <TabPane label="基本信息" name="name1">
              <div class="frame">
                <p class="titles">授权方式</p> 
                <RadioGroup v-model="Base.LicenseType" >
                <div >
                    <Radio v-model="modelA" disabled label="0">功能授权</Radio>
                    <p class="mr10">按功能模块进行授权,当相应模块未授权或者超过授权数量时,对应的模块或超过数量部分将不能够被使用。备份的总存储容量不受限制</p>
                </div>
                  <p class="blanks"></p>
                  <div >
                    <Radio v-model="modelA" disabled label="1">容量授权</Radio>
                  <p class="mr10">按备份的存储容量进行授权,功能模块不受限制,当备份保留的总数据量超过授权容量时,将会备份失败。</p>
                  </div>
              </RadioGroup>
              </div>
               <div class="frame">
                <p class="titles">选择授权类型</p>  
                <RadioGroup v-model="Base.LicenseMode" >
                <Radio disabled label="0">测试授权</Radio>
                  <p class="mr10">用于测试使用,测试授权固定只有30天的使用期限</p>
                <p class="blanks"></p>
                <Radio disabled label="1">商用授权 </Radio>
                <p class="mr10">商用授权为销售授权,没有使用时限的限制</p>
              </RadioGroup>
             </div>
                <p class="blanks"></p>
             <Form  :label-width="90" >
              <FormItem label="系统注册码:" >
                <Input id="copyValue" readonly="readonly" v-model="syssetCode" style="width: 70%"></Input>
                 <button ref="copy" @click="copyValues(syssetCode)"  data-clipboard-action="copy" data-clipboard-target="#copyValue" class="ivu-btn ivu-btn-warning" >复制注册码</button>
              </FormItem>
              <div class="frame" v-if="Base.LicenseType=='0' ">
            <div  style="width: 49%;display:inline-block">
                <Checkbox disabled label="备份前运行脚本" v-model="Base.VssBackup" >打开文件备份</Checkbox>
             <p class="mr10">此授权用于控制高级文件备份功能</p>
            </div>
             <div  style="width: 49%;display:inline-block">
                <Checkbox disabled v-model="Base.Dedump">重复数据删除</Checkbox>
             <p class="mr10">此授权用于控制重复数据删除功能</p>
             </div>
            </div>
            </Form>
              <Form  :label-width="90"  >
              <FormItem label="授权容量:" >
                <Input readonly="readonly" v-model="Base.Capacity" style="width: 30%"></Input>&nbsp G
              </FormItem>
            </Form>
              </div>
          </TabPane>
            <TabPane  v-if="Base.LicenseType=='0' " label="存储服务授权" name="name2">
              <Table  highlight-row  border :columns="clientList" :data="Client"></Table>
          </TabPane>
          <TabPane  v-if="Base.LicenseType=='0' " label="客户端授权" name="name3">
             <Table   highlight-row  border :columns="storageList" :data="Storage"></Table>
          </TabPane>
          <TabPane  v-if="Base.LicenseType=='0' " label="备份代理授权" name="name4">
             <Table  highlight-row  border :columns="agentList" :data="Agent"></Table>
          </TabPane>
       </Tabs>
     <div>
       <span style="width: 87px; display: inline-block;">选择授权文件:</span>
       <Input   style="width: 30%"></Input>
       <Upload action="/rest-ful/v3.0/system/license/import" with-credentials:true :on-success="upLoad" :on-error="upLoad"  :on-format-error="upLoad">
        <Button type="warning" >浏览</Button>
    </Upload>
      <Button type="warning">导入</Button>
     </div>
        </Col>
      </Row>

    </Panel>

  </Collapse>
</template>
<script>
import util from "../../libs/util.js";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (this.formItem.password != "" && value === "") {
        callback(new Error("确认密码不能为空"));


      } else if (this.formItem.password != value) {
        callback(new Error("新密码和确认密码应相同"));
      } else {
        callback();
      }
    };
    return {
      copyBtn:null,
      Base:{
        LicenseType:'1',
        LicenseMode:'1',
        VssBackup:false,
        Dedump:false,
        Capacity:'0'
      },
      clientList:  [{ title: "操作系统类型", key: "OS", align: "center" }, {title: "授权数量", key: "Value", align: "center" }],
      storageList:[{ title: "操作系统类型", key: "OS", align: "center" }, {title: "授权数量", key: "Value", align: "center" }],
      agentList: [{ title: "代理类型", key: "Agent", align: "center" }, {title: "系统类型", key: "OS", align: "center" }, {title: "授权数量", key: "Value", align: "center" }],
      Client:[],
      Storage:[],
      Agent:[],
      syssetCode:'',
      valueA:"1",
      modelA:true,
      numNowList:[],
      // 重复密码验证
      ruleValidate: {
        password: [
          {
            required: true,
            message: "密码不能为空",
            pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/,
            validator: validatePass,
            trigger: "blur"
          },
          {
            min: 6,
            message: "请输入输入6-20个以字母开头、可带数字、“_”、“.”的密码"
          }
        ],
        rpassword: [
          { required: true, validator: validatePassCheck, trigger: "blur" },
          { min: 1 }
        ]
      },
      // 发送邮件账户设置验证
      ruleEmail: {
        admin: [
          {
            required: true,
            message: "E-mail不能为空",
            pattern: /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            trigger: "blur"
          },
          { type: "email", message: "请输入正确格式的E-mail" }
        ],
        port: [
          {
            required: true,
            message: "请输入正确的SMTP服务器端口号",
            pattern: /^[0-9]*$/,
            trigger: "blur"
          },
          { min: 1 }
        ]
      },
      // E-mail地址验证
      ruleMail: {
        // mailPath:[{ required: true, message: 'E-mail地址不能为空',pattern:/^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/, trigger: 'blur' },{type:'email', message: '请输入正确格式的E-mail地址'}]
        mailPath: [
          {
            required: true,
            message: "请输入正确格式的E-mail地址",
            pattern: /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            trigger: "blur"
          },
          { min: 1 }
        ]
      },
      model: "1",
      formItem: {
        old: "",
        password: "",
        rpassword: ""
      },
      parameter: {
        dispatch: 1,
        recovery: 5,
        state: 5,
        task: 5,
        log: 30
      },
      mailbox: {
        admin: "",
        password: "",
        path: "",
        port: "",
        addressID: ""
      },
      Emailpath: {
        mailPath: ""
      },
      levelSelect: "",
      securityLevel: [],
      emails: [
        { title: "ID", key: "id", align: "center" },
        { title: "Email", key: "email", align: "center" }
      ],
      emailData: []
    };
  },
  created() {
    this.$store.dispatch("getPrivilege", this.$store.state.power.module.sysset);
    util.restfullCall(
      "/rest-ful/v3.0/system/param",
      null,
      "get",
      this.systemList
    );
    util.restfullCall(
      "/rest-ful/v3.0/system/license",
      null,
      "get",
      this.licenseList
    );
      util.restfullCall(
      "/rest-ful/v3.0/system/registcode",
      null,
      "get",
      this.registcodeValue
    );

  },
  mounted() {
    this.copyBtn = new this.clipboard(this.$refs.copy);
  },
  computed: {
    
    getPrivilege() {
      return this.$store.state.index.privilegeData;
    },
    getPower() {
      return this.$store.state.power.name;
    }
  },
  watch: {
    getPrivilege(data) {
      this.numNowList = data;
    }
  },
  methods: {
    upLoad(a,b,c){
      console.log(a,b,c)
    },
    copyValues(value){
      let _this = this;
    let clipboard = _this.copyBtn;
      var oInput = document.createElement('input');
        oInput.value = value;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令 
        this.$Message.success("复制成功")
      // 废弃的
      // clipboard.on("success",function (e) {
      //   _this.$Message.success("复制成功")
      // clipboard.destroy()
      // })
      //  clipboard.on("error",function (e) {
      //   _this.$Message.warning("复制失败,请手动复制")
      // clipboard.destroy()
      // })
    },
    registcodeValue(obj){
       if(obj.data.code==0){
         this.syssetCode=obj.data.registcode.toString()
       }
    },
    licenseList(obj){
      if(obj.data.code==0){
          this.Base.LicenseType=obj.data.license.Base.LicenseType.toString();
          this.Base.LicenseMode=obj.data.license.Base.LicenseMode.toString();
          this.Base.VssBackup=obj.data.license.Base.VssBackup==0?false:true;
          this.Base.Dedump=obj.data.license.Base.Dedump==0?false:true;
          this.Base.Capacity=obj.data.license.Base.Capacity.toString();
          this.Client=obj.data.license.Client;
          this.Storage=obj.data.license.Storage;
          this.Agent=obj.data.license.Agent;
      }else{
          this.$Message.warning('license连接失败');
      }

    },
    nowShow(num) {
      if (this.numNowList.indexOf(num) != -1) {
        return true;
      } else {
        return false;
      }
    },
    // 点击下拉框获取下拉框信息
    openSafe: function(open) {
      this.securityLevel = [
        { id: "3", level: "高" },
        { id: "2", level: "中" },
        { id: "1", level: "低" }
      ];
    },
    // 级别下拉框狂id
    onSafe: function(id) {
      util.restfullCall(
        "/rest-ful/v3.0/system/param",
        [{ type: 1, value: id }],
        "put",
        this.onSafeData
      );
    },
    // 级别下拉框id回调
    onSafeData: function(obj) {
      if (obj.data.code !== 0) {
        this.$Message.error(obj.data.message);
      }
    },
    // 打开折叠栏触发事件
    col1: function(ca) {
      if (ca[0] == 3) {
        util.restfullCall(
          "/rest-ful/v3.0/system/emails",
          null,
          "get",
          this.emailsData
        );
      }
      return false;
    },
    // 系统参数接口回调
    systemList: function(obj) {
      for (let i = 0; i < obj.data.length; i++) {
        if (obj.data[i].type == 2) {
          this.parameter.dispatch = obj.data[i].value - 0;
        } else if (obj.data[i].type == 3) {
          this.parameter.recovery = obj.data[i].value - 0;
        } else if (obj.data[i].type == 4) {
          this.parameter.state = obj.data[i].value - 0;
        } else if (obj.data[i].type == 5) {
          this.parameter.task = obj.data[i].value - 0;
        } else if (obj.data[i].type == 10) {
          this.parameter.log = obj.data[i].value - 0;
        } else if (obj.data[i].type == 6) {
          this.mailbox.admin = obj.data[i].value;
        } else if (obj.data[i].type == 7) {
          this.mailbox.password = obj.data[i].value;
        } else if (obj.data[i].type == 8) {
          this.mailbox.path = obj.data[i].value;
        } else if (obj.data[i].type == 9) {
          this.mailbox.port = obj.data[i].value;
        } else if (obj.data[i].type == 1) {
          if (obj.data[i].value == "3") {
            this.securityLevel.push({
              level: "高",
              id: obj.data[i].value
            });
            this.levelSelect = obj.data[i].value;
          } else if (obj.data[i].value == "2") {
            this.securityLevel.push({
              level: "中",
              id: obj.data[i].value
            });
            this.levelSelect = obj.data[i].value;
          } else if (obj.data[i].value == "1") {
            this.securityLevel.push({
              level: "低",
              id: obj.data[i].value
            });
            this.levelSelect = obj.data[i].value;
          }
        }
      }
    },
    // 设置密码确认修改
    confirm: function() {
      var word = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/;
      var user = JSON.parse(localStorage.getItem("userInfo"));
      if (
        this.formItem.password == this.formItem.rpassword &&
        word.test(this.formItem.password)
      ) {
        util.restfullCall(
          "/rest-ful/v3.0/usr/password/" + user.uid,
          {
            oldpassword: this.formItem.old,
            newpassword: this.formItem.password
          },
          "put",
          this.passwordData
        );
      } else {
        this.$Message.error("输入密码格式错误！修改失败");
      }
    },
    // 重置密码按钮重置表单
    Reset:function() {
      this.formItem.old = "";
      this.formItem.password = "";
      this.formItem.rpassword = "";
    },
    // 设置密码确认修改回调
    passwordData: function(obj) {
      if (obj.data.code == 0) {
        this.$Message.success("密码修改成功！");
        this.formItem.old = "";
        this.formItem.password = "";
        this.formItem.rpassword = "";
      } else {
        this.$Message.warning(obj.data.message);
      }
    },
    // 打开邮件设置获取邮件数据回调
    emailsData: function(obj) {
      var array = new Array();
      for (let i = 0; i < obj.data.length; i++) {
        array.push({
          id: obj.data[i].id,
          email: obj.data[i].email
        });
      }
      this.emailData = array;
    },
    // 保存系统参数
    onSystem: function() {
      util.restfullCall(
        "/rest-ful/v3.0/system/param",
        // JSON.stringify([{type:2,value:this.parameter.dispatch.toString()},{type:3,value:this.parameter.state},{type:4,value:this.parameter.recovery},{type:5,value:this.parameter.task},{type:10,value:this.parameter.log}]),
        [
          { type: 2, value: this.parameter.dispatch.toString() },
          { type: 3, value: this.parameter.recovery.toString() },
          { type: 4, value: this.parameter.state.toString() },
          { type: 5, value: this.parameter.task.toString() },
          { type: 10, value: this.parameter.log.toString() }
        ],
        "put",
        this.systemData
      );
    },
    // 系统参数回调
    systemData: function(obj) {
      if (obj.data.code !== 0) {
        this.$Message.error(obj.data.message);
      }
    },
    // 保存邮箱设置
    onMailbox: function() {
      var email = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/;
      var number = /^[0-9]*$/;
      if (email.test(this.mailbox.admin) && number.test(this.mailbox.port)) {
        util.restfullCall(
          "/rest-ful/v3.0/system/param",
          [
            { type: 6, value: this.mailbox.admin },
            { type: 7, value: this.mailbox.password },
            { type: 8, value: this.mailbox.path },
            { type: 9, value: this.mailbox.port }
          ],
          "put",
          this.setEmailData
        );
      } else {
        this.$Message.error("输入的格式有误！");
      }
    },
    // 保存邮箱设置回调
    setEmailData: function(obj) {
      if (obj.data.code !== 0) this.$Message.error(obj.data.message);
    },
    // 添加Email到表格
    addEmail: function() {
      var pathEma = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/;
      // console.log(pathEma.test(this.Emailpath.mailPath));
      if (pathEma.test(this.Emailpath.mailPath)) {
        util.restfullCall(
          "/rest-ful/v3.0/system/email",
          { email: this.Emailpath.mailPath },
          "POST",
          this.accountData
        );
      } else {
        this.$Message.error("添加的E-mail格式错误！");
      }
    },
    // 添加Email到表格的回调
    accountData: function(obj) {
      if (obj.data.code !== 0) {
        this.$Message.error(obj.data.message);
      } else {
        util.restfullCall(
          "/rest-ful/v3.0/system/emails",
          null,
          "get",
          this.emailsData
        );
      }
    },
    // 点击Email表格数据赋值给输入框
    rowClick: function(row) {
      this.mailbox.addressID = row.id;
      this.Emailpath.mailPath = row.email;
    },
    // 点击保存按钮保存修改后的数据
    preservation: function() {
      var pathEma = /^[0-9A-Za-z][\.-_0-9A-Za-z]*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/;
      // console.log(pathEma.test(this.Emailpath.mailPath));
      if (pathEma.test(this.Emailpath.mailPath)) {
        util.restfullCall(
          "/rest-ful/v3.0/system/email",
          { id: this.mailbox.addressID, email: this.Emailpath.mailPath },
          "PUT",
          this.calbakData
        );
      } else {
        this.$Message.error("要保存的E-mail格式错误！");
      }
    },
    // 保存修改的数据回调
    calbakData: function(obj) {
      if (obj.data.code !== 0) {
        this.$Message.error(obj.data.message);
      } else {
        util.restfullCall(
          "/rest-ful/v3.0/system/emails",
          null,
          "get",
          this.emailsData
        );
      }
    },
    // 删除Email表格数据
    deleteEmail: function() {
      util.restfullCall(
        "/rest-ful/v3.0/system/email/" + this.mailbox.addressID,
        null,
        "delete",
        this.emailDelete
      );
    },
    // 删除Email表格数据回调
    emailDelete: function(obj) {
      if (obj.data.code !== 0) {
        this.$Message.error(obj.data.message);
      } else {
        util.restfullCall(
          "/rest-ful/v3.0/system/emails",
          null,
          "get",
          this.emailsData
        );
      }
    }
  }
};
</script>

<style>
.license .ivu-upload{
  display: inline-block;
}
.license .mr10{
  margin-left:20px; 
}
.license .ivu-table-body{
  height: 420px;
  overflow: auto;
}
.license .ivu-table td, .ivu-table th{
  height: 30px;
}
.license .ivu-tabs{
  height: 520px;
}
.license .blanks {
  width: 100%;
  padding: 5px 0;
}
.license .frame {
  padding: 20px 10px 10px;
  border: 1px solid #dddee1;
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
}
.license .frame .titles {
  position: absolute;
  left: 30px;
  top: -11px;
  background-color: #fff;
  padding: 0 6px;
  font-size: 14px;
}
.xt {
  font-weight: 600;
  margin-left: 10px;
}
.security-select {
  margin: 0 0 20px;
}
.setPassword {
  padding-top: 30px;
  position: relative;
  border: 2px solid #ccc;
  width: 50%;
  margin-bottom: 10px;
}
._title {
  padding: 0px 5px;
  font-weight: 600;
  position: absolute;
  background: #fff;
  top: -10px;
  left: 10px;
}
.Email {
  padding-top: 30px;
  position: relative;
  border: 2px solid #ccc;
  height: 350px;
  margin-bottom: 10px;
}
._titles {
  padding: 0px 5px;
  font-weight: 600;
  position: absolute;
  background: #fff;
  top: -42px;
  left: 10px;
}
._tabs {
  margin-top: 10px;
}
._button {
  margin-top: 10px;
}
.email-but {
  margin-left: 40%;
}
</style>
