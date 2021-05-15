<template>
    <div class="inline-block">
        <el-button type="danger" @click="clickMove">强制移箱</el-button>

        <el-dialog title="强制移箱" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <div v-if="detailForm.order_route_map && detailForm.order_route_map.length>0">
                <el-radio-group v-model="moveToCompanyId" style="width: 100%;">
                    <p v-for="(item,$index) in detailForm.order_route_map" :key="$index" class="margin-bottom-10">
                        <el-radio :label="item.account_company_id" border style="width: 100%;">
                            {{item.company_name | mainCompanyAbbreviationCode(item.account_company_id)}}
                        </el-radio>
                    </p>
                </el-radio-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="!moveToCompanyId" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props:['detailForm'],
        data() {
            return {
                loading:false,
                dialogShow:false,

                moveToCompanyId:null,

            }
        },
        watch: {},
        created() {
        },
        methods: {
            clickMove(){
                let self = this;
                self.$confirm('强制移箱是特殊权限是否确认？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.dialogShow=true;
                        }
                    }
                })
            },
            clickSaveDate() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_boxes + '/' +self.detailForm.id + '/move_to',
                    type:'PUT',
                    requestBody:true,
                    data: {
                        box_id: self.detailForm.id,
                        to_company_id: self.moveToCompanyId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.dialogShow=false;
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
            },
        },
    }
</script>

<style lang="scss">

</style>