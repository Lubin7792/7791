<style>
@import "./policy.css";
</style>

<template>
	<div class="newconten">
		<div v-show="show==='基本信息'"  class="basicinfo">
			<Form ref="basic" :model="basic" :label-width="80">
				<FormItem label="策略名称">
					<Input v-model="basic.name"></Input>
				</FormItem>
				<FormItem label="策略类型">
					<Input v-model="basic.type"></Input>
				</FormItem>
				<FormItem label="储存设备">
					<Input v-model="basic.client"></Input>
				</FormItem>
				<FormItem label="介质池">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="优先级">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="策略最大调度任务">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="启用压缩">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="启用加密">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="加密算法">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="数据保留周期">
					<Input v-model="basic.state"></Input>
				</FormItem>
			</Form>
		</div>
		<div v-show="show==='备份选项'">
      <Tabs type="card" :animated="false"   @on-click="click2">
     	<TabPane v-for="(tab,index) in tabList" :label="tab.title" :name="tab.title" :key="index">
         <backupoption :show2="show2"></backupoption> 
      </TabPane>
    </Tabs>  
		</div>
		<div v-show="show==='备份资源列表'">
			<Form ref="option" :model="option" :label-width="80">
				<FormItem label="备份内容">
					<Input v-model="option.content"></Input>
				</FormItem>
				<FormItem label="启用加密">
					<Input v-model="option.encryption"></Input>
				</FormItem>
				<FormItem label="启用压缩">
					<Input v-model="option.compress"></Input>
				</FormItem>
			</Form>
		</div>
		<div v-show="show==='调度计划'">
			<Form ref="plan" :model="plan" :label-width="80">
        	<FormItem label="调度类型">
					<Input v-model="option.compress"></Input>
				</FormItem>
        	<FormItem label="备份类型">
					<Input v-model="option.compress"></Input>
				</FormItem>
				<FormItem label="开始时间">
					<TimePicker format="HH:mm" placeholder="Select time" style="width: 112px"></TimePicker>
				</FormItem>
        		<FormItem label="结束时间">
					<TimePicker format="HH:mm" placeholder="Select time" style="width: 112px"></TimePicker>
				</FormItem>
				<FormItem label="间隔时间">
					<Select v-model="model1" style="width:200px">
						<Option v-for="item in frequency" :value="item.value" :key="item.value">{{ item.label }}</Option>
					</Select>
				</FormItem>
			</Form>
		</div>
		<Button type="warning">保存修改</Button>
		<Button type="warning">禁用</Button>
		<Button type="warning">启用</Button>
		<Button type="warning">立即调度</Button>
	</div>
</template>
<script>
import backupoption from './backupoption'
export default {
  props: {
    show: {
      type: String
    },
    model1:{
      type:[String,Object]
    }
  },
  components: {
    backupoption
  },
  data() {
    return {
      tabList: [
        {
          title: "文件备份选项"
        },
        {
          title: "RAOLE备份选项"
        },
        {
          title: "SQLSERVER备份选项"
        },
        {
          title: "VMWARE备份选项"
        }
      ],
      show2: "文件备份选项",
      basic: {
        name: '',
        type: '',
        client: '',
        state: ''
      },
      plan:{},
      resources: {
        pool: '',
        equipment: ''
      },
      option: {
        content: '',
        encryption: '',
        compress: ''
      },
      frequency: [
        {
          value: '天',
          label: '天'
        },
        {
          value: '周',
          label: '周'
        },
        {
          value: '月',
          label: '月'
        },
        {
          value: '季度',
          label: '季度'
        },
        {
          value: '年',
          label: '年'
        }
      ],
      level: [
        {
          value: '全量',
          label: '全量'
        },
        {
          value: '增量',
          label: '增量'
        },
        {
          value: '差量',
          label: '差量'
        }
      ],
      cycle: [
        {
          value: '天',
          label: '天'
        },
        {
          value: '周',
          label: '周'
        },
        {
          value: '月',
          label: '月'
        },
        {
          value: '季度',
          label: '季度'
        },
        {
          value: '年',
          label: '年'
        }
      ]
    }
  },
  methods: {
    click2: function(name){
      this.show2=name;
    }
   
  }

}
</script>