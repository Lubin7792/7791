<template>
<div>
<div :show="show">
	<div v-if="show==='basic'">
		<Basic></Basic>
	</div>
	<div v-if="show==='131072'">
		<Oracle></Oracle>
	</div>
	<div v-if="show==='196608'">
		<Mysql></Mysql>
	</div>
	<div v-if="show==='262144'">
		<Sqlserver></Sqlserver>
	</div>
	<!-- <div v-if="show==='VMWARE虚拟机'"> -->
	<div v-if="show==='327680'">
		<Vmware></Vmware>
	</div>
	<div v-if="show==='393216'">
		<p>系统备份这块还没编写</p>
	</div>
</div>
</div>

</template>
<script>
import Basic from './basic.vue';
import Oracle from './oracle.vue';
import Mysql from './mysql.vue';
import Sqlserver from './sqlserver.vue';
import Vmware from './vmware.vue';
	export default{
		components:{
			Basic,
			Oracle,
			Mysql,
			Sqlserver,
			Vmware
		},
		created() {
		},
		computed:{
			show(){
				console.log(this.$store.state.clientList)
				return this.$store.state.clientTitle;
			}
		},
		mounted:function(){
			// console.log(this.show);
				// console.log(this.$store.state.clientTitle,'conten mounted')

		}
	}
</script>