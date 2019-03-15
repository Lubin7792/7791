<style>
@import "./navigation.css";
/*@import './iconfont.css';*/
</style>
<template>
  <div class="layout">
    <Layout>
      <Header class="navigation-header" style="height:50px; background:none;">
        <Menu mode="horizontal" active-name="1" class="header" stylt="height:50px !important">
          <div class="layout-logo"></div>
          <span class="title">THE VRTS备份软件</span>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="help-circled"></Icon>帮助
            </MenuItem>
            <MenuItem name="2">
            <Dropdown trigger="click" style="margin-left: 20px" @on-click="adminClick" >
             <Icon type="android-person"></Icon>admin
              <DropdownMenu slot="list">
                <DropdownItem name="logout">退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
             </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout :style="{ height: '100%' }">
        <Content :style="{ background: '#fff', height: '100%' }">
          <Layout>
            <Sider hide-trigger :style="{ background: '#fff' }">
              <Menu
                active-name="1-2"
                :style="{ background: '#4a4949', height: '100%' }"
                width="282px"
                :open-names="['1']"
                @on-select="changeUrl"
              >
                <MenuItem name="home"  font-size="16px" v-if="nowShow(getPower.home)"  >
                  <!--  <Icon type="ios-home"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-home"></use>
                  </svg>
                  首页
                </MenuItem>
                <MenuItem name="usermanager" font-size="16px" v-if="nowShow(getPower.userManager)" >
                  <!-- <Icon type="person-add"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-user-circle"></use>
                  </svg>
                  用户管理
                </MenuItem>
                <MenuItem name="role" v-if="nowShow(getPower.role)" >  
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jiaose"></use>
                  </svg>
                  角色管理
                </MenuItem>
                <MenuItem name="taskmonitor" v-if="nowShow(getPower.taskMonitor)">
                  <!--  <Icon type="monitor"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dashboard"></use>
                  </svg>
                  <!-- <i class="iconfont">&#xe602;</i> -->
                  任务监控
                </MenuItem>
                <MenuItem name="client" v-if="nowShow(getPower.client)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-laptop"></use>
                  </svg>
                  客户端
                </MenuItem>
                <MenuItem name="syslog" v-if="nowShow(getPower.syslog)" >
                  <!-- <Icon type="clipboard"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-file"></use>
                  </svg>
                  日志管理
                </MenuItem>
                <MenuItem name="mediaserver" v-if="nowShow(getPower.mediaServer)||nowShow(getPower.diskDevice)" >
                  <!-- <Icon type="social-windows"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-server"></use>
                  </svg>
                  介质服务器
                </MenuItem>
                <MenuItem name="volume" v-if="nowShow(getPower.volume)" >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-hdd"></use>
                  </svg>
                  介质管理
                </MenuItem>
                <MenuItem name="policy" v-if="nowShow(getPower.policy)" >
                  <!-- <Icon type="edit"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xuanzewenjian"></use>
                  </svg>
                  策略管理
                </MenuItem>
                <MenuItem name="restore" v-if="nowShow(getPower.restore)" >
                  <!--  <Icon type="refresh"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-web-icon-"></use>
                  </svg>
                  恢复管理
                </MenuItem>
                <MenuItem name="report" v-if="nowShow(getPower.report)" >
                  <!-- <Icon type="ios-browsers-outline"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yiji-baobiaoguanli"></use>
                  </svg>
                  报表管理
                </MenuItem>
                <MenuItem name="sysset" v-if="nowShow(getPower.sysset)" >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-cog"></use>
                  </svg>
                  系统设置
                </MenuItem>
              </Menu>
            </Sider>
            <Content
              :style="{
                padding: '24px',
                minHeight: '280px',
                background: '#fff',
                width: '1000px'
              }"
            >
              <router-view></router-view>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import util from "../../libs/util.js";
import icon from "./iconfont.js";
export default {
  data(){
    return {
      nowLists:[]
    }
  },
  name: "navigation",
  computed: {
    //  权限
    getPower(){
      return this.$store.state.power.module
    },
    //新建成功
    policyState() {
      return this.$store.state.index.policySwitch;
    }
  },
  methods: {
    numNowBack(data){
      console.log(data.data)
    },
    nowShow(num){
      if(this.nowLists.indexOf(num)!=-1){
        return true
      }else{
        return false
      }
    },
    logoutBack(data){
      if(data.data.code==0){
            this.$router.push('/login')
      }
    },
    adminClick(data){
     if(data=="logout"){
      util.restfullCall("/rest-ful/v3.0/logout", null, "get", this.logoutBack);
     }
    },
    changeUrl(name,num) {
      this.$router.push("/" + name);
    },
    policyData: function(obj) {
      let objj = obj.data;
      let arrays = new Array();
      for (let i = 0; i < objj.length; i++) {
        arrays.push({
          key: objj[i].type,
          name: objj[i].name
        });
      }
      this.$store.commit("savePolicyType", arrays);
    },
    policiesData: function(obj) {
      let objj = obj.data;
      let arrays = new Array();
      for (let i = 0; i < objj.length; i++) {
        arrays.push({
          id: objj[i].id,
          name: objj[i].name,
          type: objj[i].type,
          privilege: objj[i].privilege,
          pool: objj[i].pool,
          mediaserver: objj[i].mediaserver,
          key: objj[i].device,
          savedays: objj[i].savedays,
          enable: objj[i].enable,
          device: objj[i].device,
          maxtasks: objj[i].maxtasks,
          scheduletypes: { type: "", name: "" },
          showS: false
        });
      }
      this.$store.commit("policiesData", arrays);
    },
    nowList(data){
      let list= []
        data.data.map(item=>{
            list.push(item.module)
        })
        this.nowLists=list;
    }
  },
  created() {
    let uId=JSON.parse(localStorage.userInfo).uid;
    util.restfullCall(
      "/rest-ful/v3.0/policytype",
      null,
      "get",
      this.policyData
    );
    util.restfullCall(
      "/rest-ful/v3.0/policies",
      null,
      "get",
      this.policiesData
    );
    util.restfullCall(
      "/rest-ful/v3.0/user/privilege/"+uId+"?module=-1",
      null,
      "get",
      this.nowList
    );
  },
  watch: {
    policyState: function() {
      util.restfullCall(
        "/rest-ful/v3.0/policies",
        null,
        "get",
        this.policiesData
      );
    }
  }
};
</script>   