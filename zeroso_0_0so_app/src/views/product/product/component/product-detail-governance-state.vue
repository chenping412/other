<template>
    <div class="inline-block">
        <el-tag :type="governance_state ? 'success' : 'warning'">
            {{governance_state ? '已审核' : '待审核'}}
        </el-tag>

        <el-button plain size="mini" class="margin-left-10" v-loading="loading" @click="clickUpdate()">
            {{!governance_state ? '审核' : '撤销审核'}}
        </el-button>
    </div>
</template>

<script>
    export default {
        props: ['governance_state','queryId'],
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
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/governance',
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
