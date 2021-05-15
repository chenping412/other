<template>
    <div>
        <el-button size="mini" plain @click="clickEdit" :disabled="!productAllowChangeBaseInfo">编辑产品</el-button>

        <el-dialog title="编辑产品" :visible.sync="dialogShow" width="650px" :close-on-click-modal="false" append-to-body v-loading="loading">
            <el-form :model="editForm" :rules="editFormRule" ref="editForm" label-width="100px">
                <el-form-item label="型号：" prop="product_name">
                    <el-input v-model="editForm.product_name"></el-input>
                </el-form-item>
                <el-form-item label="订货号：" prop="product_order_no">
                    <el-input v-model="editForm.product_order_no"></el-input>
                </el-form-item>
                <el-form-item label="参数：" prop="product_parameter">
                    <el-input type="textarea" rows="8" v-model="editForm.product_parameter"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import HostConfig from "../../../config/host-config";

    export default {
        props: ['row'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                editForm: {},
                editFormRule: {
                    product_name: [
                        {required: true, message: '请输入型号，若产品只有订货号，则此项也填写订货号！'}
                    ],
                    product_order_no: [
                        {required: true, message: '请输入订货号，若产品只有型号，则此项也填写型号！'}
                    ],
                },
            }
        },
        computed:{
            productAllowChangeBaseInfo() {
                return HostConfig.productAllowChangeBaseInfo.length===0 || HostConfig.productAllowChangeBaseInfo.indexOf(this.$store.state.userInfo.id) > -1
            },
        },
        methods: {
            clickEdit(){
                this.editForm = {
                    id: this.row.product_id,
                    "product_name": this.row.product_name || '',
                    "product_order_no": this.row.product_order_no || '',
                    "product_parameter": this.row.product_parameter || '',
                };
                this.dialogShow = true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.editForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product + '/' + self.editForm.id + '/info',
                            type: 'PUT',
                            requestBody:true,
                            data: self.editForm,
                            success () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.dialogShow=false;
                                self.$emit('update');
                            }
                        });
                    }
                });
            },


        }
    }
</script>
