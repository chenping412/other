<template>
    <div class="partner-add">
        <el-button type="primary" @click="add">{{title || '新增品名信息'}}</el-button>

        <el-dialog :title="title ? title : addForm.id ? '编辑品名信息': '新增品名信息'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="150px">
                <el-form-item label="中国报关品名" prop="product_cn_name">
                    <el-input v-model="addForm.product_cn_name"></el-input>
                </el-form-item>
                <el-form-item label="英文报关品名" prop="product_en_name">
                    <el-input v-model="addForm.product_en_name"></el-input>
                </el-form-item>
                <el-form-item label="中国纳税编码" prop="product_cn_tax_code">
                    <el-input v-model="addForm.product_cn_tax_code"></el-input>
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
        props:['title'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {

                },
                addFormRule: {
                    product_cn_name: [
                        {required: true, message: '请输入中国报关品名！'}
                    ],product_en_name: [
                        {required: true, message: '请输入英文报关品名！'}
                    ],
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            add(){
                this.addForm ={};
                this.dialogShow=true;
            },
            edit(item){
                this.addForm = JSON.parse(JSON.stringify(item));
                this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product_trade_name + (self.addForm.id ? '/'+self.addForm.id : ''),
                            type:self.addForm.id?'PUT':'POST',
                            requestBody:true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow=false;
                                    self.addForm.id = data.msg.id
                                    self.$emit('update',self.addForm);
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .partner-add {
        display: inline-block;
    }
</style>