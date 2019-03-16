<template>
  <Collapse v-model="model" accordion @on-change="col1">
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
        <Form :label-width="550">
          <FormItem>
            <Button style="margin-right: 8px">重 置</Button>
            <Button type="primary" @click="confirm">确认修改</Button>
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
        <Button @click="onSystem" type="success"  :disabled ="!nowShow(getPower.setsysset)">保存</Button>
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
          <Button class="email-but" @click="onMailbox" type="success" :disabled ="!nowShow(getPower.setEmail)">&nbsp;保 存&nbsp;</Button>
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
            <Button type="success" @click="addEmail" :disabled ="!nowShow(getPower.setEmail)">添加</Button>
            <Button type="warning" @click="preservation" :disabled ="!nowShow(getPower.setEmail)">保存</Button>
            <Button type="error" @click="deleteEmail" :disabled ="!nowShow(getPower.setEmail)">删除</Button>
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
      console.log(pathEma.test(this.Emailpath.mailPath));
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
      console.log(pathEma.test(this.Emailpath.mailPath));
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
