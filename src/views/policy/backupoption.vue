  <style>
@import "./policy.css";
</style>
<template>
	<div>
    <div v-show="show2 === '文件备份选项'">
      <p>aaa</p>  
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