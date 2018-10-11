<style >
@import "./popup.css";

</style>
<template>
    <div>
        <ul>
            <li>
                <span>级别:</span>
                <Input v-model="num.address" readonly placeholder="Enter something..." style="width: 300px"></Input>
            </li>
            <li>
                <span>时间:</span>
                <Input v-model="num.time" readonly placeholder="Enter something..." style="width: 300px"></Input>
            </li>
            <li>
                <span>用户:</span>
                <Input v-model="num.id" readonly placeholder="Enter something..." style="width: 300px"></Input>
            </li>
            <li>
                <span>来源:</span>
                <Input v-model="num.src" readonly placeholder="Enter something..." style="width: 300px"></Input>
            </li>
            <li>
                <span>描述:</span>
                <Input v-model="num.desc" type="textarea" :autosize="{minRows: 5,maxRows: 6}" placeholder="Enter something..." style="width: 300px"></Input>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  props: {
    num: {
      type: [Object,Array]
    }
  }
};


</script>