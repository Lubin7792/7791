  <style>
@import "./policy.css";
</style>

<template>
	<div class="newconten">
		<div v-show="show2==='文件备份选项'"  class="basicinfo">
			<Form ref="basic" :model="basic" :label-width="80">
				<FormItem label="使用多通道">
					<Input v-model="basic.name"></Input>
				</FormItem>
			</Form>
		</div>
		<div v-show="show2==='RAOLE备份选项'">
			<Form ref="resources" :model="resources" :label-width="80">
				<FormItem label="是否实用打开文件备份">
					<Input v-model="resources.pool"></Input>
				</FormItem>
				<FormItem label="过滤指定类型的文件">
					<Input v-model="resources.equipment"></Input>
				</FormItem>
			</Form>
		</div>
		<div v-show="show2==='SQLSERVER备份选项'">
			<Form ref="option" :model="option" :label-width="80">
				<FormItem label="11111">
					<Input v-model="option.content"></Input>
				</FormItem>
				<FormItem label="11111">
					<Input v-model="option.encryption"></Input>
				</FormItem>
				<FormItem label="11111">
					<Input v-model="option.compress"></Input>
				</FormItem>
			</Form>
		</div>
    <div v-show="show2==='VMWARE备份选项'">
			<Form ref="option" :model="option" :label-width="80">
				<FormItem label="11111">
					<Input v-model="option.content"></Input>
				</FormItem>
				<FormItem label="11111">
					<Input v-model="option.encryption"></Input>
				</FormItem>
				<FormItem label="11111">
					<Input v-model="option.compress"></Input>
				</FormItem>
			</Form>
		</div>
	</div>
</template>
<script>
export default {
  props: {
    show2: {
      type: String
    },
    model1:{
      type:[String,Object]
    }
  },
  data() {
    return {
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
  }
}
</script>