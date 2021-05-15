<template>
    <div class="permission-group-edit" v-loading="loading">
        <el-form :model="detailForm" :rules="detailFormRule" ref="form" label-width="150px">
            <div style="width: 1000px;">
                <el-form-item label="模板名称：" prop="name">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.name}}</span>
                    <el-input v-else v-model="detailForm.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名称：" prop="alias_name">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.alias_name}}</span>
                    <el-input v-else v-model="detailForm.alias_name"></el-input>
                </el-form-item>
                <el-form-item label="按钮位置：" prop="profession_type">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.profession_type | templateProfessionType}}</span>
                    <el-select v-else v-model="detailForm.profession_type" @change="getReportTemplateLIst">
                        <el-option
                                v-for="(item,$index) in $store.state.templateProfessionType"
                                :key="$index"
                                :label="item.label"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮件主题：" prop="subject">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.subject}}</span>
                    <el-input v-else v-model="detailForm.subject"></el-input>
                </el-form-item>
                <el-form-item label="发件人：" prop="mail_from">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.mail_from}}</span>
                    <el-input v-else v-model="detailForm.mail_from"></el-input>
                </el-form-item>
                <el-form-item label="报表模板：" prop="report">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.report ? detailForm.report.file_name : ''}}</span>
                    <el-select v-else v-model="detailForm.report_id">
                        <el-option label="不使用" :value="null"></el-option>
                        <el-option
                                v-for="(item,$index) in reportTemplateLIst"
                                :key="$index"
                                :label="item.file_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型：" prop="send_type">
                    <span class="form-border-bottom" v-if="!isEdit">{{detailForm.send_type}}</span>
                    <el-select v-else v-model="detailForm.send_type">
                        <el-option label="空" :value="null"></el-option>
                        <el-option label="报价单" value="offer"></el-option>
                        <el-option label="合同" value="order"></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item label="内 容：" prop="body_html">
                <div style="line-height: 1.6em;" v-if="!isEdit" v-html="detailForm.body_html"></div>
                <div v-else>
                    <WangEditor ref="WangEditor" :content-html.sync="detailForm.body_html"></WangEditor>
                </div>
            </el-form-item>

            <el-form-item>
                <div v-if="!isEdit">
                    <el-button type="primary" @click="clickEdit">编 辑</el-button>
                    <el-button @click="goBack">返 回</el-button>
                </div>
                <div v-else>
                    <el-button type="success" @click="clickSaveDate">保 存</el-button>
                    <el-button @click="clickCancel">取 消</el-button>
                </div>

            </el-form-item>
        </el-form>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                queryId: null,
                isEdit: false,

                detailForm: {},
                detailFormRule: {
                    name: [
                        {required: true, message: '请输入模板名称！'}
                    ],alias_name: [
                        {required: true, message: '请输入英文名称！'}
                    ],profession_type: [
                        {required: true, message: '请选择按钮位置！'}
                    ],subject: [
                        {required: true, message: '请输入邮件主题！'}
                    ],
                },

                reportTemplateLIst: [],

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = null;
                    self.detailForm = {
                        body_html:'',
                        report_id:null,
                        module_name: "message",
                        subsystem: "message",
                    };
                    self.isEdit = true;
                }
            },

            getDetailData() {
                let self = this;
                self.loading = true;
                self.isEdit = false;
                self.$http({
                    url: self.$api.file_mail_templates + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.detailForm = data.msg;
                            self.getReportTemplateLIst();
                        }
                    }
                })
            },


            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.file_mail_templates + (self.queryId ? '/' + self.queryId : ''),
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.isEdit = false;
                                if(self.queryId){
                                    self.getDetailData();
                                }else if(data.msg && data.msg.id) {
                                    self.$router.push({
                                        path:self.$route.path,
                                        query:{
                                            id:data.msg.id
                                        }
                                    })
                                }
                            }
                        });
                    }
                });
            },


            getReportTemplateLIst() {
                let self = this;
                if (self.detailForm.profession_type) {
                    let params={
                        'to_customer_supplier':{
                            module_name: 'order',
                            profession_type: 'to_customer_supplier',
                            subsystem: 'platform',
                        },'to_customer':{
                            module_name: 'order',
                            profession_type: 'to_customer',
                            subsystem: 'platform',
                        },'to_supplier':{
                            module_name: 'order',
                            profession_type: 'to_supplier',
                            subsystem: 'platform',
                        },'packing_list':{
                            module_name: 'outgoing_transfer',
                            profession_type: 'packing_list',
                            subsystem: 'logistics',
                        },'to_customer_invoice':{
                            module_name: 'invoice',
                            profession_type: 'to_customer_invoice',
                            subsystem: 'accounting',
                        },
                    };
                    if(params[self.detailForm.profession_type]) {
                        self.$http({
                            url: self.$api.file_report_templates_search,
                            data: {
                                account_company_ids: self.$store.state.currentCompany.account_company_id,
                                ...params[self.detailForm.profession_type]
                            },
                            success: function (data) {
                                if (data.msg && data.msg.items) {
                                    self.reportTemplateLIst = data.msg.items;
                                    self.detailForm.report_id = null;
                                }
                            }
                        })
                    }
                }
            },

            clickEdit(){
                this.isEdit=true;
                this.$nextTick(()=>{
                    this.$refs.WangEditor.setContent(this.detailForm.body_html);
                })
            },

            clickCancel() {
                if (this.queryId) {
                    this.init()
                } else {
                    this.goBack()
                }
            },
            goBack() {
                this.$router.push('emailList');
            },


        }
    }
</script>

<style lang="scss">

</style>
