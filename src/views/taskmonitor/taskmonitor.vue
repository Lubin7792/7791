<template>
    <div>
        <Table border ref="selection" :columns="columns4" :data="data1"></Table>
        <Button @click="handleSelectAll(true)">全选</Button>
        <Button @click="handleSelectAll(false)">全部清除</Button>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '任务ID',
                        key: 'taskID'
                    },
                    {
                        title: '客户端',
                          width: 80,
                        key: 'client'
                    },
                    {
                        title: '介质服务器',
                        key: 'mediaServer'
                    },
                     {
                        title: '设备',
                        key: 'device'
                    },
                    {
                        title: '开始时间',
                        key: 'startTime'
                    },
                    {
                        title: '耗时',
                        key: 'timeConsuming'
                    },
                     {
                        title: '备份数量',
                        key: 'backuoNum'
                    },
                    {
                        title: '速率',
                        key: 'rate'
                    },
                    {
                        title: '调度策略',
                        key: 'strategy'
                    },
                     {
                        title: '状态',
                        key: 'state'
                    }

                ],
                data1: [
                    {
                        taskID: '001',
                        client: 'mac',
                        mediaServer: '阿里云',
                        device: '浪潮',
                        startTime:'2018-09-15',
                        timeConsuming:'1年',
                        backuoNum:'32T',
                        rate:'10M',
                        strategy:'随机',
                        state:'传输数据'
                    },
                   {
                        taskID: '001',
                        client: 'mac',
                        mediaServer: '阿里云',
                        device: '浪潮',
                        startTime:'2018-09-15',
                        timeConsuming:'1年',
                        backuoNum:'32T',
                        rate:'10M',
                        strategy:'随机',
                        state:'传输数据'
                    },{
                        taskID: '001',
                        client: 'mac',
                        mediaServer: '阿里云',
                        device: '浪潮',
                        startTime:'2018-09-15',
                        timeConsuming:'1年',
                        backuoNum:'32T',
                        rate:'10M',
                        strategy:'随机',
                        state:'传输数据'
                    },
                ]
            }
        },
        methods: {
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            }
        }
    }
</script>
