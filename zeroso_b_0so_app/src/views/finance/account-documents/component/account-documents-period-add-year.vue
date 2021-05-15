<template>
    <div class="inline-block">
        <el-button type="primary" @click="add">{{title || '新增年度会计区间'}}</el-button>

        <el-dialog :title="title ? title : addForm.id ? '编辑年度会计区间': '新增年度会计区间'" :visible.sync="dialogShow" width="650px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="120px">
                <el-form-item label="名称" prop="fiscalyear_name">
                    <el-input v-model="addForm.fiscalyear_name"></el-input>
                </el-form-item>
                <el-form-item label="年度会计区间" prop="date_start">
                    <el-date-picker
                            v-model="addForm.date_start"
                            type="date"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            placeholder="日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                            v-model="addForm.date_end"
                            type="date"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            placeholder="日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="自动生成月区间" v-if="!addForm.id">
                    <el-checkbox v-model="addForm.is_generate_period"></el-checkbox>
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
                    fiscalyear_name:'',
                    date_start:'',
                    date_end:'',
                    is_generate_period:true,
                },
                addFormRule: {
                    fiscalyear_name: [
                        {required: true, message: '请输入名称！'}
                    ],
                    date_start: [
                        {required: true, message: '请输入名称！'}
                    ],
                },
            }
        },
        created() {
        },
        methods: {
            add(){
                let year = new Date().getFullYear();
                this.addForm ={
                    fiscalyear_name:'',
                    date_start: year + '-01-01',
                    date_end: year + '-12-31',
                    is_generate_period:true,
                };
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
                            url: self.$api.bank_v4_account_fiscalyear + (self.addForm.id ? '/'+self.addForm.id : ''),
                            type:self.addForm.id?'PUT':'POST',
                            requestBody:true,
                            data: self.addForm,
                            success: function () {
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
        },
    }
</script>
