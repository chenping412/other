<template>
    <div class="inline-block"
         v-loading.fullscreen.lock="loading"
         :element-loading-text="'正在更新中，请稍等……'"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-button :disabled="hasEditAction" @click="updateAllPrice()">
            <span>更新价格</span>
            <el-popover placement="top" trigger="hover">
                <i class="el-icon-question" slot="reference"></i>
                <p>1、当点击“更新价格”时，所有产品将会按照最新报价重新计算；</p>
                <p>2、如果产品报价不正常，或者询报价单状态不正常，可以使用该操作；</p>
            </el-popover>
        </el-button>
    </div>
</template>

<script>

    export default {
        props: ['hasEditAction','queryId'],
        data() {
            return {
                loading: false,
            }
        },
        created() {

        },
        methods: {
            //更新产品价格
            updateAllPrice() {
                let self = this;
                self.$confirm('确认更新价格吗？当点击“更新价格”时，所有产品将按照最新报价重新进行计算，该操作不可恢复！', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback(action) {
                        if (action === 'confirm') {
                            self.loading=true;
                            self.$http({
                                url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/refreshQuote',
                                type:'POST',
                                success () {
                                    self.loading=false;
                                    self.$message({
                                        showClose: true,
                                        message: '更新成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update');
                                }
                            })
                        }
                    }
                })
            },
        }
    }
</script>

