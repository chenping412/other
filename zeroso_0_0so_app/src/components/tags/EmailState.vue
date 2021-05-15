<template>
    <el-tag :size="size" v-if="state" :type="tagType[state]">{{stateMap[state] || state}}</el-tag>
</template>

<script>
    export default {
        props: ['state', 'size'],
        data() {
            return {
                stateMap: {
                    received: '已收件',
                    send: '待发送',
                    retry_send: '重新发送',
                    send_success: '已发送',
                    send_fail: '发送失败',
                    partial_fail: '部分失败',
                    delete: '已删除',
                    deep_delete: '已彻底删除',
                    draft: '草稿',
                    outgoing: '正在发送',
                    junk: '垃圾邮件',
                },
                tagType: {
                    received: 'warning',
                    send_success: 'warning',
                    send: 'primary',
                    retry_send: 'primary',
                    draft: 'primary',
                    outgoing: 'success',
                    send_fail: 'danger',
                    partial_fail: 'danger',
                    delete: 'info',
                    deep_delete: 'info',
                    junk: 'info',
                }
            }
        },
    }
</script>
