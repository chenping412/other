<template>
    <div class="partner-add">
        <el-button type="primary" @click="add">{{title || '新增海关信息'}}</el-button>

        <el-dialog :title="title ? title : addForm.id ? '编辑海关信息': '新增海关信息'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="150px">
                <el-form-item label="中国海关编码" prop="customs_cn_code">
                    <el-input v-model="addForm.customs_cn_code"></el-input>
                </el-form-item>
                <el-form-item label="中国商品名称及备注" prop="customs_cn_description">
                    <el-input type="textarea" rows="4" v-model="addForm.customs_cn_description"></el-input>
                </el-form-item>
                <el-form-item label="德国海关编码" prop="customs_de_code">
                    <el-input v-model="addForm.customs_de_code"></el-input>
                </el-form-item>
                <el-form-item label="德国海关描述" prop="customs_de_description">
                    <el-input type="textarea" rows="4" v-model="addForm.customs_de_description"></el-input>
                </el-form-item>
                <el-form-item label="中国进口关税" prop="import_cn_tariffs">
                    <InputNumber :value.sync="addForm.import_cn_tariffs"></InputNumber>
                </el-form-item>
                <el-form-item label="中国监管条件" prop="customs_cn_conditions">
                    <el-input v-model="addForm.customs_cn_conditions"></el-input>
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
                    customs_cn_code: [
                        {required: true, message: '请输入中国海关编码！'}
                    ],customs_cn_description: [
                        {required: true, message: '请输入中国商品名称及备注！'}
                    ],customs_de_code: [
                        {required: true, message: '请输入德国海关编码！'}
                    ],customs_de_description: [
                        {required: true, message: '请输入德国海关描述！'}
                    ],import_cn_tariffs: [
                        {required: true, message: '请输入中国进口关税！'}
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
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
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
                            url: self.$api.product_product_manage_product_customs_info + (self.addForm.id ? '/'+self.addForm.id : ''),
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