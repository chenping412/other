<template>
    <div class="inquiry-quotation-detail-edit-product">
        <template v-if="productLine.product_quote_state!=='INVALID' && productLine.product_quote_state!=='REPLACED'">
            <template v-if="!productLine.mark_as_deleted">
                <div>
                    <el-button size="mini" type="primary"
                               @click="clickEditQuantity(productLine)">
                        修改数量
                    </el-button>
                </div>
                <div>
                    <el-button size="mini" type="danger"
                               @click="clickDelete(productLine.product_id,true)">
                        删除
                    </el-button>
                </div>
            </template>
            <div v-else>
                <el-button size="mini" type="success" plain
                           @click="clickDelete(productLine.product_id)">
                    恢复
                </el-button>
            </div>
        </template>
    </div>
</template>

<script>

    export default {
        props: ['queryId','productLine','productListData'],
        data() {
            return {

                loading: false,
            }
        },
        created() {

        },
        methods: {
            clickEditQuantity(row){
                let self=this;
                self.$prompt('修改数量：', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    let product_item = JSON.parse(JSON.stringify(row));
                    product_item.prodcut_quotation.quantity = value;
                    self.loading = true;
                    self.$http({
                        url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/' + row.product_id,
                        type: 'PUT',
                        requestBody: true,
                        data: {
                            product_item: product_item
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.sheet_id) {
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.$emit('update');
                            } else {
                                self.$message({
                                    showClose: true,
                                    message: '保存失败！',
                                    type: 'error'
                                });
                            }
                        }
                    });
                });
            },

            clickDelete(product_id, isDelete) {
                let self = this;
                if (isDelete) {
                    let m = 0;
                    for (let i = 0; i < self.productListData.length; i++) {
                        if (!self.productListData[i].mark_as_deleted && self.productListData[i].product_quote_state !== 'INVALID' && self.productListData[i].product_quote_state !== 'REPLACED') {
                            m++
                        }
                    }
                    if (m <= 1) {
                        self.$message({
                            showClose: true,
                            message: '至少需要保留一个有效产品！',
                            type: 'error'
                        });
                        return
                    }

                }
                self.$confirm('确定执行该操作吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/' + product_id,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.sheet_id) {
                                        self.$message({
                                            showClose: true,
                                            message: '操作成功！',
                                            type: 'success'
                                        });
                                        self.$emit('update');
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '操作失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            },

        }
    }
</script>
<style lang="scss">
    .inquiry-quotation-detail-edit-product{
        .el-button{
            padding: 4px 10px;
            margin: 1px !important;
        }
    }
</style>