<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">银行对账单</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '对账单详情' : '新建对账单'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span class="margin-right-10">对账单名称：{{detailForm.name}}</span>
                        <el-tag v-if="detailForm.status">已打开</el-tag>
                        <el-tag type="danger" v-if="!detailForm.status">已关闭</el-tag>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <el-button type="warning" v-if="!detailForm.status" @click="clickOpenOrClose(true)">打开对账单</el-button>
                                    <el-button type="warning" v-if="detailForm.status" @click="clickOpenOrClose(false)">关闭对账单</el-button>
                                    <el-button type="primary" v-if="detailForm.status" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="125px">
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="银行名称：" prop="bank_account_id">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.bank_account_id" @change="bankAccountIdChange">
                                    <el-option v-for="option in selfBankAccountList" :label="option.bank_name+'('+option.name+')'" :value="option.id" :key="option.id"></el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{(detailForm.bank_account?detailForm.bank_account.bank_name:'') | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="货币：">
                                <span class="form-border-bottom">{{detailForm.currency}}</span>
                            </el-form-item>
                            <el-form-item label="对账单名：" prop="name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.name}}</span>
                            </el-form-item>
                            <el-form-item label="区间范围：" prop="date">
                                <el-date-picker
                                        v-if="!queryId || isEdit"
                                        v-model="detailForm.date"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd"
                                        unlink-panels
                                        :clearable="false"
                                        :picker-options="$store.state.dateRangeOptions">
                                </el-date-picker>
                                <span v-else class="form-border-bottom">{{detailForm.start_time | zerosoDateFormat}} 至 {{detailForm.end_time | zerosoDateFormat}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="期初余额：" prop="start_balance">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.start_balance">
                                    <template slot="append">
                                        {{detailForm.currency | isoCurrency}}
                                    </template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.start_balance | isoCurrency(detailForm.currency)}}</span>
                            </el-form-item>
                            <el-form-item label="期末余额：" prop="end_balance">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.end_balance">
                                    <template slot="append">
                                        {{detailForm.currency | isoCurrency}}
                                    </template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.end_balance | isoCurrency(detailForm.currency)}}</span>
                            </el-form-item>
                            <el-form-item label="参考余额：" prop="reference_end_balance">
                                <span class="form-border-bottom">
                                    {{(detailForm.start_balance ? (detailForm.start_balance*1+bankStatementLineMoney) : '')  | isoCurrency(detailForm.currency)}}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </el-form>
            </div>

            <bank-statement-detail-line :queryId="queryId" v-if="queryId" :statementLineId="statementLineId" :bankStatementLineMoney.sync="bankStatementLineMoney" :status="detailForm.status"></bank-statement-detail-line>
        </div>


    </div>
</template>

<script>


    import BankStatementDetailLine from "./bank-statement-detail-line";
    export default {
        components: {
            BankStatementDetailLine
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    bank_account_id: [
                        {required: true, message: '请选择银行名称！'}
                    ],name: [
                        {required: true, message: '请输入对账单名！'}
                    ],date: [
                        {required: true, validator: function (rule, value, callback) {
                            if (!value || value.length<2) {
                                callback(new Error('请选择区间范围'));
                            } {
                                callback();
                            }
                        }}
                    ],start_balance: [
                        {required: true, message: '请输入期初余额！'}
                    ],
                },
                selfBankAccountList:[],

                bankStatementLineMoney:0,

                statementLineId:null,

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if (self.$route.query.statementLineId && self.$route.query.statementLineId !== 'undefined' && self.$route.query.statementLineId !== 'null') {
                    self.statementLineId = self.$route.query.statementLineId;
                }
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        date:self.$utils.getNowMonthDate(),
                    };
                }
                this.getSelfBankAccountList();

            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_bank_statement + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            data.msg.date=[];
                            self.detailForm = data.msg;
                        }
                    },
                    error(data){
                        if(data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40001)>-1){
                            self.$router.back();
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
                this.detailForm.date = [this.detailForm.start_time ,this.detailForm.end_time];
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.detailForm.start_time = self.detailForm.date[0];
                        self.detailForm.end_time = self.detailForm.date[1];
                        self.loading = true;
                        self.$http({
                            url: self.queryId ? self.$api.bank_bank_statement + '/' + self.queryId : self.$api.bank_bank_statement,
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.isEdit = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    if (!self.queryId && data.msg.id) {
                                        self.$router.push({
                                            path: 'detail',
                                            query: {
                                                id: data.msg.id,
                                            }
                                        });
                                    }else {
                                        self.getDetailData();
                                    }
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
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },
            getSelfBankAccountList() {
                let self = this;
                self.$http({
                    url: self.$api.bank_self_bank_account,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg.items) {
                            self.selfBankAccountList=data.msg.items;
                        }
                    }
                })
            },
            bankAccountIdChange(val){
                this.selfBankAccountList.forEach((item)=>{
                    if(val === item.id){
                        this.detailForm.currency = item.currency;
                    }
                })
            },


            //删除行
            clickOpenOrClose(is_open) {
                let self = this;
                self.$confirm(is_open?'确认打开该对账单?':'确认关闭该对账单?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_bank_statement+'/'+self.queryId +'/open_close',
                                type: 'PUT',
                                requestBody: true,
                                data:{
                                    id:self.queryId,
                                    is_open:is_open
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '操作成功！',
                                            showClose: 'true'
                                        });
                                        self.getDetailData();
                                    }
                                }
                            })

                        }
                    }
                })
            },
        }
    }
</script>

<style lang="scss">


</style>
