<template>
    <div class="inline-block">
        <el-button type="primary" plain @click="clickEdit">导出xml</el-button>

        <el-dialog title="导出xml" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="120px">
                <el-form-item label="发货单号:">
                    <span>{{stockOut.outgoing_transfer_name}}</span>
                </el-form-item>
                <el-form-item label="转运方式:" prop="transportation_type">
                    <el-radio-group v-model="addForm.transportation_type">
                        <el-radio label="DE004851">海运</el-radio>
                        <el-radio label="DE003302">空运</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="托盘数:" prop="tray_quantity">
                    <InputNumber :value.sync="addForm.tray_quantity" :integer="true"></InputNumber>
                </el-form-item>
                <el-form-item label="发票单号:" prop="invoice_name">
                    <el-input v-model="addForm.invoice_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['stockOut'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    transportation_type:null,
                    tray_quantity:null,
                    invoice_name:null,
                },
                addFormRule: {
                    transportation_type: [
                        {required: true, message: '请选择转运方式！'}
                    ],tray_quantity: [
                        {required: true, message: '请输入托盘数！'}
                    ],invoice_name: [
                        {required: true, message: '请输入发票单号！'}
                    ],
                },


            }
        },
        created() {
        },
        methods: {
            clickEdit() {
                this.addForm = {
                    transportation_type:null,
                    tray_quantity:null,
                    invoice_name:null,
                };
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.dialogShow = false;
                        let url = self.$api.order_outgoing_transfers + '/' + self.stockOut.id + '/export_customs';
                        url = `${url}?transportation_type=${self.addForm.transportation_type}&invoice_name=${self.addForm.invoice_name}&tray_quantity=${self.addForm.tray_quantity}`;
                        window.open(url);
                    } else {
                        console.log('error submit!!');
                    }
                });
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>