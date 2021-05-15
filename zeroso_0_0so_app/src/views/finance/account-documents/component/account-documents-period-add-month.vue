<template>
    <div class="inline-block">
        <el-button type="primary" @click="add">{{title || '新增月度会计区间'}}</el-button>

        <el-dialog :title="title ? title : addForm.id ? '编辑月度会计区间': '新增月度会计区间'" :visible.sync="dialogShow" width="650px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="120px">
                <el-form-item label="年度会计区间">
                    <el-select v-model="addForm.account_fiscalyear_id" :disabled="!!addForm.id">
                        <el-option
                                v-for="(item,$index) in accountFiscalyearIdList"
                                :key="$index"
                                :value="item.id"
                                :label="item.fiscalyear_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="account_period_name">
                    <el-input v-model="addForm.account_period_name"></el-input>
                </el-form-item>
                <el-form-item label="月度会计区间">
                    <el-date-picker
                            v-model="addForm.date_start"
                            type="date"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            placeholder="开始日期">
                    </el-date-picker>
                    至
                    <el-date-picker
                            v-model="addForm.date_end"
                            type="date"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            placeholder="结束日期">
                    </el-date-picker>
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
        props:['title','accountFiscalyearId','accountFiscalyearIdList'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    account_fiscalyear_id:'',
                    account_period_name:'',
                    date_start:'',
                    date_end:'',
                },
                addFormRule: {
                    account_period_name: [
                        {required: true, message: '请输入名称！'}
                    ],
                },
            }
        },
        created() {
        },
        methods: {
            add(){
                let monthArr = this.$utils.getNowMonthDate();
                this.addForm ={
                    account_fiscalyear_id: this.accountFiscalyearId,
                    account_period_name:'',
                    date_start: monthArr[0],
                    date_end: monthArr[1],
                };
                this.dialogShow=true;
            },
            edit(item){
                this.addForm = {
                    account_fiscalyear_id: this.accountFiscalyearId,
                    id: item.id,
                    account_period_name: item.account_period_name,
                    date_start: item.date_start,
                    date_end: item.date_end,
                };
                this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_account_period + (self.addForm.id ? '/'+self.addForm.id : ''),
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
