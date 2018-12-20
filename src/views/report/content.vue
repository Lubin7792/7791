<style>
.btn {
  margin-top: 15px;
}
</style>
<template>
	<div>
		<Table :columns="columns" :data="data1"></Table>
	
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