<template>
    <el-tag type="info" size="mini" effect="plain" class="cursor-pointer" v-loading="loading"
            @click.native.stop="clickDelete()">
        移除书签
    </el-tag>
</template>

<script>
    export default {
        props: ['tagId'],
        data() {
            return {
                loading: false,
            }
        },
        methods: {
            clickDelete() {
                let self = this;
                self.loading=true;
                self.$http({
                    url: self.$api.message_book_mark_messages + '/' + self.tagId,
                    type: 'PUT',
                    data:{
                        book_mark_id: self.tagId
                    },
                    success(){
                        self.loading=false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.$emit('update')
                    }
                });
            },
        },
    }
</script>