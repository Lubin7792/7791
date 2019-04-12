<style>
@import "./navigation.css";
/*@import './iconfont.css';*/
</style>
<template>
  <div class="layout">
    <Layout>
      <!-- 头部导航区 -->
      <Header class="navigation-header" style="height:50px; background:none;">
        <Menu mode="horizontal" active-name="1" @on-select="onMenu">
          <div class="layout-logo"></div>
          <span class="title">THE VRTS备份软件</span>
          <div class="layout-nav">
            <MenuItem name="3">
              <Icon type="ios-download-outline"></Icon>
              下载客户端
            </MenuItem>
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
      <!-- <Layout :style="{ height: '100%' }"> -->
      <Layout>
        <!-- <Content :style="{ background: '#fff', height: '100%' }"> -->
        <!-- <Content> -->
          <!-- <Layout> -->
            <!-- 左侧导航区 -->
            <Sider class="nev-lef" ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
              <Menu active-name="1-2" :style="{ background: '#4a4949', height: '100%' }" theme="dark" width="auto" :class="menuitemClasses" :open-names="['1']" @on-select="changeUrl">
                
                <Header :style="{padding: 0}" class="lef-head">
                  <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="drag" size="24"></Icon>
                </Header>

                <MenuItem name="home"  font-size="16px" v-if="nowShow(getPower.home)"  >
                  <!-- <Icon type="ios-home"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-home"></use>
                  </svg>
                  <span>首页</span>  
                </MenuItem>
                <MenuItem name="usermanager" font-size="16px" v-if="nowShow(getPower.userManager)" >
                  <!-- <Icon type="person-add"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-user-circle"></use>
                  </svg>
                  <span>用户管理</span>
                </MenuItem>
                <MenuItem name="role" v-if="nowShow(getPower.role)" >  
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-jiaose"></use>
                  </svg>
                  <span>角色管理</span>
                </MenuItem>
                <MenuItem name="taskmonitor" v-if="nowShow(getPower.taskMonitor)">
                  <!--  <Icon type="monitor"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dashboard"></use>
                  </svg>
                  <!-- <i class="iconfont">&#xe602;</i> -->
                  <span>任务监控</span>
                </MenuItem>
                <MenuItem name="client" v-if="nowShow(getPower.client)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-laptop"></use>
                  </svg>
                  <span>客户端</span>
                </MenuItem>
                <MenuItem name="syslog" v-if="nowShow(getPower.syslog)" >
                  <!-- <Icon type="clipboard"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-file"></use>
                  </svg>
                  <span>日志管理</span>
                </MenuItem>
                <MenuItem name="mediaserver" v-if="nowShow(getPower.mediaServer)||nowShow(getPower.diskDevice)" >
                  <!-- <Icon type="social-windows"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-server"></use>
                  </svg>
                  <span>介质服务</span>
                </MenuItem>
                <MenuItem name="volume" v-if="nowShow(getPower.volume)" >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-hdd"></use>
                  </svg>
                  <span>介质管理</span>
                </MenuItem>
                <MenuItem name="policy" v-if="nowShow(getPower.policy)" >
                  <!-- <Icon type="edit"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xuanzewenjian"></use>
                  </svg>
                  <span>策略管理</span>
                </MenuItem>
                <MenuItem name="restore" v-if="nowShow(getPower.restore)" >
                  <!--  <Icon type="refresh"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-web-icon-"></use>
                  </svg>
                  <span>恢复管理</span>
                </MenuItem>
                <MenuItem name="report" v-if="nowShow(getPower.report)" >
                  <!-- <Icon type="ios-browsers-outline"></Icon> -->
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yiji-baobiaoguanli"></use>
                  </svg>
                  <span>报表管理</span>
                </MenuItem>
                <MenuItem name="sysset" v-if="nowShow(getPower.sysset)" >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-cog"></use>
                  </svg>
                  <span>系统设置</span>
                </MenuItem>
              </Menu>
            </Sider>
            <!-- 右侧内容区 -->
            <Content :style="{ padding: '24px', minHeight: '280px', background: '#fff'}">
              <router-view></router-view>
            </Content>
          <!-- </Layout> -->
        <!-- </Content> -->
      </Layout>
    </Layout>
    <downloud ref="downloud"></downloud>
  </div>
</template>
<script>
import util from "../../libs/util.js";
import icon from "./iconfont.js";
// 下载客户端弹框
import downloud from "./downloud.vue";
export default {
  components:{
    downloud
  },
  data(){
    return {
      nowLists:[],
      isCollapsed: false
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
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    rotateIcon() {
      return ['menu-item', this.isCollapsed ? 'rotate-icon' : '']
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    numNowBack(data){
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
    },
    // 点击头部导航menu导航栏
    onMenu:function(data){
      // 点击下载客户端弹框
      if(data == 3){
        this.$refs.downloud.downModel();
      }
    },
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