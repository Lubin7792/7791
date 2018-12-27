<template>
    <!-- 介质服务器修改介质弹框 -->
    <Modal v-model="modal1" title="修改介质服务器" @on-ok="ok" @on-cancel="cancel" ok-text="保存" class-name="vertical-center-modal">
        <Form :label-width="130">
            <FormItem label="介质服务器名称">
                <Input placeholder="请输入介质服务器名称" v-model="putDatas.name"></Input>
            </FormItem>
            <FormItem label="机器名">
                <Input disabled v-model="putDatas.machine"></Input>
            </FormItem>
            <FormItem label="操作系统类型">
                <Input disabled v-model="putDatas.os"></Input>
            </FormItem>
            <FormItem label="IP地址">
                <Input disabled v-model="putDatas.addr"></Input>
            </FormItem>
            <FormItem label="状态">
                <Input disabled v-model="putDatas.status"></Input>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
import util from '../../libs/util.js'
export default {
    props: {
        putDatas: {
            type: Object
        }
    },
    
    data () {
            return {
                modal1: false
            }
    },
    methods: {
        showMoad2: function() {
            this.modal1 = true
        },
        // 点击保存修改数据
        ok () {
            util.restfullCall('/rest-ful/v3.0/mediaserver/'+this.putDatas.id,{name:this.putDatas.name},'PUT',this.upload);
            this.modal1 = false
        },
        // 回调的数据传递给父组件
        upload(callback) {
            if(callback.data.code === 0) this.$emit('toogleMedium', this.putDatas)
        },
        cancel () {
            this.modal1 = false
        }
    }
}
</script>
