<style>
.btn {
  margin-top: 15px;
}
</style>
<template>
	<div>
		<Table :columns="columns" :data="data1"></Table>
		<div v-show="show==='备份状态报表'" class="btn">
		</div>
		<div v-show="show==='客户端备份备份'" class="btn">
		</div>
		<div v-show="show==='介质报表'" class="btn">
		</div>
	</div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array
    },
    show: {
      type: String
    }
  },
  data() {
    return {
      data1: []
    };
  }
};
</script>