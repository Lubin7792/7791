  <style>
@import "./policy.css";
</style>
<template>
	<div>
    <div v-if="show2 === '文件备份选项'">
     	<Form ref="basic" :model="basic" :label-width="120">
        	<FormItem label="时候打开文件备份">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="过滤指定文件">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="备份指定类型的文件">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="跳过备份失败的文件">
					<Input v-model="basic.state"></Input>
				</FormItem>
			</Form>
      <button @click="show3">asdasd</button>
    </div>
    <div v-if="show2 === 'RAOLE备份选项'">
    	<Form ref="basic" :model="basic" :label-width="120">
        	<FormItem label="使用多通道">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="开启ORACLE压缩">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="数据片中文件个数">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="全库备份时备份归档">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="归档备份范围">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="删除已经备份的归档">
					<Input v-model="basic.state"></Input>
				</FormItem>
			</Form>
    </div>
    <div v-if="show2 === 'SQLSERVER备份选项'">
    	<Form ref="basic" :model="basic" :label-width="120">
        	<FormItem label="备份前一致性检查">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="备份后一致性检查"> 
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="启用SQLSERVER压缩  ">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="事务日志截断">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="归档备份范围">
					<Input v-model="basic.state"></Input>
          </FormItem>
        	<FormItem label="删除已经备份的归档">
					<Input v-model="basic.state"></Input>
				</FormItem>
			</Form>
    </div>
    <div v-if="show2 === 'VMWARE备份选项'">
    	<Form ref="basic" :model="basic" :label-width="120">
        	<FormItem label="跳过失败的虚拟机">
					<Input v-model="basic.state"></Input>
				</FormItem>
        	<FormItem label="跳过关机的虚拟机"> 
					<Input v-model="basic.state"></Input>
				</FormItem>
			</Form>
    </div>
  </div>
</template>
<script>
export default {
  // basictyp:this.show2,
  props: {
    show2: {
      type: String
    },
    model1:{
      type:[String,Object]
    }
  },
  created(){
    this.showtest = this.show2 
    // console.log(this.showtest,11111);
  },
  methods:{
    show3() {
       console.log(this.data)
    }

    
  },
  created() {
   
  },
    
  data() {
    return {
      showtest:'',
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
//   watch: {
//   show2 (show2) {
//     this.basictyp = show2
//   }
// }
}
</script> 