<template>
    <div class="inline-block margin-left-10">
        <el-tag :type="shelf ? 'success' : 'info'">
            {{shelf ? '已上架' : '已下架'}}
        </el-tag>

        <el-button plain size="mini" class="margin-left-10" v-loading="loading" @click="clickUpdate()">
            {{!shelf ? '上架' : '下架'}}
        </el-button>
    </div>
</template>

<script>
    export default {
        props: ['shelf','queryId'],
        data() {
            return {
                loading:false,
            }
        },
        methods: {
            clickUpdate(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/shelf',
                    type: 'PUT',
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.editDialogShow = false;
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.$emit('update');
                        }
                    }
                });
            },
        },
    }
</script>
