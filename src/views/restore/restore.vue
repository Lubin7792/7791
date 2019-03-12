<style>
  .restore {
	  border: dashed 1px #FB784D;
	  padding: 30px 60px 0;
	  border-radius: 5px;
	  height: 90px;
	  margin-bottom: 20px;
	  min-width: 1000px;
	  background-color: #F3F3F3;
  }
  ._tree-box {
    height: 630px;
    border: 1px solid #ccc;
    position: relative;
  }
  .tree-top {
    background-color: #ccc;
    height: 60px;
    /* border: 1px solid blue; */
  }
  .tree-top p {
    text-align: center;
    font-weight: 600;
    line-height: 54px;
  }
  ._tree-box .btn {
    position: absolute;
    right: 10px;
    top: 10px;  
  }
  ._tree-box .tree {
    padding: 20px;
    width: 100%;
    height: 90%;
    overflow: auto;
    /* border: 1px solid red; */
  }
  .details {
    /* border: 1px solid #ccc; */
    height: 630px;
  }
  .details-top {
    height: 60px;
    background-color: #ccc;
    /* border: 1px solid blue; */
  }
  .details-top p {
    font-weight: 600;
    text-align: center;
    line-height: 60px;
  }
  .tab {
    margin-bottom: 20px;
  }
  .tree-conten .ivu-table th {
    display: none;
  }
</style>
<template>
  <div>
    <!-- 头部导航 -->
    <div class="restore">
      <Row type="flex" justify="space-between">
        <Col span="5">
          <span>客户端名称：</span>
            <Select v-model="query.client" placeholder="请选择客户端" @on-change="changesClient" style="width:180px">
              <Option v-for="item in clientSelect" :value="item.client" :key="item.client">{{ item.machine }}</Option>
            </Select>
        </Col>
        <Col span="5">
          <span>策略类型：</span>
            <Select v-model="query.policytype" placeholder="请选策略类型" @on-change="changesType" style="width:180px">
              <Option v-for="item in typeSelect" :value="item.policytype" :key="item.policytype">{{ item.name }}</Option>
            </Select>
        </Col>   
        <Col span="5">
            <span>起始时间：</span>
            <DatePicker type="datetime" placeholder="请选择开始日期" style="width: 200px" @on-change="startTime"></DatePicker>
        </Col>
        <Col span="5">
          <span>结束时间：</span>
          <DatePicker type="datetime" placeholder="请选择结束日期" style="width: 200px" @on-change="endTime"></DatePicker>
        </Col>
        <Col span="4">
          <Button type="warning" @click="onQuery">查询</Button>
        </Col>
      </Row>
    </div>

    <!-- 表格部分 -->
    <Table class="tab" @on-row-click="listClick" highlight-row :columns="regain" :data="regainData" height="235"></Table>
    <!-- 树形图部分 -->
    <Row  :gutter="16">
      <!-- 树形图部分 -->
      <Col span="12">    
        <div class="_tree-box">
          <Button class="btn" @click="onRecovery" type="primary">恢复</Button>
          <div class="tree-top">
            <p>选择需要恢复的数据</p>
            <!-- <span class="btn"><Button class="btn" @click="onRecovery" type="primary">恢复</Button></span> -->
          </div>
          <div class="tree">
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
      </Col>
      <!-- 数据详情部分 -->
      <Col span="12">
        <div class="details">
          <div class="details-top">
            <p>已选择恢复的数据</p>
            <div class="tree-conten">
              <Table border ref="selection" :columns="listPath" :data="pathConten" height="570"></Table>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <!-- 弹框区 -->
      <!-- 文件恢复弹框 -->
      <fileRecovery ref="fileRecovery"></fileRecovery>
      <!-- MYSQ恢复弹框 -->
      <frameMysql ref="frameMysql"></frameMysql>
    <!-- <dendrogram></dendrogram> -->

  </div>
</template>
<script>
  import util from '../../libs/util.js'
  // import dendrogram from './dendrogram.vue'
  import fileRecovery from './fileRecovery.vue'
  import frameMysql from './frameMysql.vue'
  

  export default {
    components: {
      // dendrogram
      fileRecovery,
      frameMysql
    },
    data() {
      return {
        regain: [
          { title:'ID', key: 'id' },
          { title:'策略名称', key: 'policy' },
          { title:'策略类型', key: 'policytype' },
          { title:'开始时间', key: 'starttime' },
          { title:'结束时间', key: 'endtime' },
        ],
        regainData: [],
        clientSelect:[],
        typeSelect:[],
        query: {
          client: '',
          policytype: '',
          starttime: '',
          endtime: '',
          RestoreTime: ''
        },
        setting: {
          check: {
            enable: true,
          },
          view: {
            selectedMulti: false
          },
          callback: {
            onClick: this.zTreeOnClick,
            onCheck: this.zTreeOnCheck
          }
        },
        listPath: [
          { title: "目录文件" , key: "name" }    
        ],
        device: [],
        pathConten: [],
        temporary: [],
        treeNodeTemp: []
      }
    },
    created() {
      // 客户端下拉框数据
      util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.clientslData)
      // 策略类型下拉框数据
      util.restfullCall('/rest-ful/v3.0/policytype', null, 'get', this.typelData)
    },
    computed: {
      data3() {
        let data1 = [];
        data1 = this.device;
        return data1;
        // console.log("data1",data1)
      }
    },
    watch: {
      data3: {
        handler(newVal, oldVal) {
          console.log('newVal', newVal)
          $.fn.zTree.init($("#treeDemo"), this.setting, this.data3);
        },
      }
    },
    methods: {
      // 客户端下拉框数据获取
      // openClient: function(open) {
      //   if(open == true) util.restfullCall('/rest-ful/v3.0/clients', null, 'get', this.clientslData)
      // },
      // 客户端下拉框回调
      clientslData: function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            client:obj.data[i].id,
            machine:obj.data[i].machine
          })
        }
        this.clientSelect = array
        this.query.client = array[0].client
        
      },
      // 选中的客户端id
      changesClient: function(id) {
        this.query.client = id
      },
      // // 策略类型下拉框获取数据
      // openType: function(open) {
      //   if(open == true) util.restfullCall('/rest-ful/v3.0/policytype', null, 'get', this.typelData)
      // },
      // 策略类型下拉框回调
      typelData: function(obj) {
        var array = new Array
        for(let i = 0;i < obj.data.length;i++ ){
          array.push({
            policytype:obj.data[i].type,
            name:obj.data[i].name
          })
        }
        this.typeSelect = array
        this.query.policytype = array[0].policytype
      },
      // 选中的策略类型type
      changesType: function(type) {
        this.query.policytype = type
      },
      // 开始时间
      startTime: function(start) {
        this.query.starttime = start
      },
      // 结束时间
      endTime: function(end) {
        this.query.endtime = end
      },
      // 点击查询
      onQuery() {
        let url = '/rest-ful/v3.0/report/history?'
        Object.keys(this.query).forEach(item => {
          if(this.query[item]) url += `${item}=${this.query[item]}&`
        })
        util.restfullCall(url, null, 'get', this.callbackRegain)
      },
      // 点击查询的回调
      callbackRegain: function(obj){
        var array = new Array()
        for (let i = 0; i < obj.data.length; i++) {
          array.push({
            bytes: obj.data[i].bytes,
            client: obj.data[i].client,
            device: obj.data[i].device,
            endtime: obj.data[i].endtime,
            files: obj.data[i].files,
            id: obj.data[i].id,
            policy: obj.data[i].policy,
            policytype: obj.data[i].policytype,
            pool: obj.data[i].pool,
            rate: obj.data[i].rate,
            result: obj.data[i].result,
            scheduletype: obj.data[i].scheduletype,
            starttime: obj.data[i].starttime,
            type: obj.data[i].type
          })
        }
        this.regainData = array
      },
      // 单击行数据发送请求展示树形数据
      listClick:function(row) {
        this.query.RestoreTime = row.endtime
        util.restfullCall('/rest-ful/v3.0/restore/resource/query?client='+this.query.client+'&type='+this.query.policytype+'&startime='+this.query.starttime+'&endtime'+row.endtime, null, 'get', this.callbackTree)
      },
      // 数型数据回调
      callbackTree:function(obj) {
        this.device = obj.data.data
      },
      //获取子节点发送请求
      zTreeOnClick: function(event, treeId, treeNode) {
        if (treeNode.children.length==0) {
          let str = "/rest-ful/v3.0/restore/resource/browse?client=" + this.query.client + "&type=" + this.query.policytype +"&path=" + treeNode.path;
          util.restfullCall(str, null, "get", function(obj) {
            //返回数据处理
            var objj = []
            objj.nodetype = 1
            objj = obj.data.data;
            let ztreeobj = $.fn.zTree.getZTreeObj(treeId);
            ztreeobj.addNodes(treeNode, objj);
        console.log(str)
          });
        }
      },
      // 选中节点
      zTreeOnCheck: function(event, treeId, treeNode) {
        console.log(treeNode)
        if(treeNode.checked) {
          this.pathConten.unshift({ name : "+" + treeNode.path })
        }else if(!treeNode.checked) {
          this.pathConten.unshift({ name : "-" + treeNode.path })
        }
        var hash = {};
        this.temporary = this.pathConten.reduce(function(item, next) {
            hash[next.name] ? '' : hash[next.name] = true && item.push(next);
            return item
        }, [])
        this.pathConten = []
        this.pathConten = this.temporary
        this.temporary = []

        if(treeNode.checked) {
          this.treeNodeTemp.unshift({Type:treeNode.type,path:treeNode.path,Exclude:treeNode.Exclude= 0 })
        }else if(!treeNode.checked)
        this.treeNodeTemp.unshift({Type:treeNode.type,path:treeNode.path,Exclude:treeNode.Exclude= 1})
      },
      // 恢复弹框判定
      onRecovery: function() {
        if(this.pathConten.length == 0) {
          this.$Message.warning("请先选择需要恢复的资源")
        }else {
          if(this.query.policytype == 65536) {
            this.$refs.fileRecovery.recovery(this.query,this.treeNodeTemp)
          }else if(this.query.policytype == 196608) {
            this.$refs.frameMysql.mysql(this.query,this.treeNodeTemp)
          }
        }
      }
    }
  };
</script>