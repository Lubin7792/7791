<style>
@import './libraryModal.css';
.titl {
  font-weight: 600;
  text-align: center
}
</style>
<template>
	<Modal title="新建磁带库" v-model="modal" class-name="vertical-center-modal" @on-ok="ok" @on-cancel="cancel" ok-text="保存" cancel-text="取消" width="640">
		<Form :model="libraryItem" :label-width="100">
			<FormItem label="设备名称">
				<Input v-model="libraryItem.name" placeholder="请输入设备名称"></Input>
			</FormItem>
			<FormItem label="介质服务器">
				<Select placeholder="请选择介质服务器">
					<Option value="beijing">New York</Option>
					<Option value="shanghai">London</Option>
					<Option value="shenzhen">Sydney</Option>
				</Select>
			</FormItem>
			<FormItem label="机械肩">
				<Select>
					<Option value="beijing">New York</Option>
					<Option value="shanghai" disabled>London</Option>
					<Option value="shenzhen">Sydney</Option>
				</Select>
			</FormItem>
      <P class="titl">驱动器信息</P>
			<Table :columns="libraryColumns" style="margin-bottom:20px"></Table>
      <P class="titl">槽位信息</P>
			<Table border :columns="Columns"></Table>
			<!-- <FormItem>
				<Checkbox v-model="single" class="checkbox">是否允许任务并行</Checkbox>
				<FormItem label="最大并行任务数量" v-if="single===true" class="maxTask">
					<Input v-model="libraryItem.max" style="width: 50px"></Input>
				</FormItem>
			</FormItem> -->
		</Form>
	</Modal>
</template>
<script>
export default {
  data() {
    return {
      libraryItem: {
        name: '',
        max: ''
      },
      libraryColumns: [
        { title: '序列号', key: 'id' },
        { title: '厂商', key: 'Manufacturer' },
        { title: '产品ID', key: 'driver' },
        { title: '版本', key: 'driver' },
        { title: '磁带条码', key: 'slot' },
        { title: '槽位数', key: 'slot' },
      ],
      Columns:[
        { title: '槽位号', key: 'id' },
        { title: '磁带条码', key: 'id' },
        { title: 'I/EXPORT', key: 'id' },
      ],
      single: false
    }
  },
  computed: {
    modal() {
      return this.$store.state.modalLibrary
    }
  },
  methods: {
    ok() {
      this.$store.commit('getModalLibrary', false)
    },
    cancel() {
      this.$store.commit('getModalLibrary', false)
    }
  }
}
</script>