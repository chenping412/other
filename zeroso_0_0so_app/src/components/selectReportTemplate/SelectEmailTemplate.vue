<template>
    <div class="select-report-template" v-clickoutside="clickoutside" v-loading="loading">
        <el-button type="primary" :size="size" plain @click.native.stop="showList" v-if="$store.state.system==='0'">
            {{name || '发模板邮件'}}
            <i class="el-icon-arrow-down"></i>
        </el-button>
        <ul class="select-report-template-list" v-show="listShow">
            <li v-for="(item,$index) in emailTemplateList" :key="$index" @click.stop="selectTemplate(item)">{{item.name}}</li>
        </ul>

        <edit-email
                :show.sync="editEmailShow"
                :emailTemplate="emailTemplate"
                :module_name="module_name"
                :subsystem="subsystem"
                :module_id="module_id">
        </edit-email>
    </div>
</template>

<script>
    import clickoutside from 'element-ui/src/utils/clickoutside'
    import EditEmail from "../../views/email/editEmail";
    import reportService from "./reportService";

    export default {
        components: {EditEmail},
        props: ['accountCompanyId','nextAccountCompanyId', 'profession_type','module_name','module_id','subsystem','orderData','invoiceData','stockOutData'
            ,'mail_to','replySubject','replyBodyHtml','size','name','template_module_name','template_subsystem'],
        directives: {clickoutside},
        data() {
            return {
                isGetData: false,

                emailTemplateList: [],

                listShow: false,

                editEmailShow: false,
                emailTemplate: {},

                loading: false,
            }
        },
        watch:{
            module_id(){
                this.isGetData=false;
                this.listShow=false;
                this.editEmailShow=false;
            }
        },
        created() {

        },
        methods: {
            showList() {
                if (!this.listShow) {
                    this.listShow = true;
                    this.getEmailTemplateList();
                } else {
                    this.listShow = false;
                }
                console.log(this.orderData)
            },
            getEmailTemplateList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_mail_templates,
                    data: {
                        account_company_ids: self.accountCompanyId + (self.nextAccountCompanyId ? ','+self.nextAccountCompanyId : ''),
                        module_name: self.template_module_name || "message",
                        profession_type: self.profession_type,
                        subsystem: self.template_subsystem || "message",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.isGetData = true;
                            self.emailTemplateList = data.msg.items;
                        }
                    }
                })
            },



            selectTemplate(item) {
                let self = this;
                self.listShow = false;
                if(self.module_name ==='invoice'){
                    self.createInvoiceEmailReport(item);
                }else if(self.module_name ==='outgoing_transfer'){
                    self.createStockOutEmailReport(item);
                }else if(self.module_name ==='order'){
                    self.createOrderEmailReport(item);
                }else {
                    self.createNormalEmailReport(item);
                }
            },


            //生成发票邮件
            createInvoiceEmailReport(item){
                let self = this;
                reportService.invoiceReport(item,self.invoiceData,(requestData)=>{
                    self.loading = true;
                    self.$http({
                        url: self.$api.file_mail_templates + '/' + item.id,
                        type: 'POST',
                        requestBody: true,
                        data: requestData,
                        success: function (data) {
                            self.loading = false;
                            if (data.msg) {
                                if(self.invoiceData[self.invoiceData.invoice_style] && self.invoiceData[self.invoiceData.invoice_style].email){
                                    data.msg.mail_to = [self.invoiceData[self.invoiceData.invoice_style].email]
                                }
                                console.log(self.invoiceData)
                                if(self.invoiceData.fileList && self.invoiceData.fileList.length>0){
                                    let fileIds = [];
                                    self.invoiceData.fileList.forEach((item)=>{
                                        fileIds.push(item.id);
                                    });
                                    self.copyReportTemplateFile(data.msg,fileIds.join(','));
                                }else {
                                    self.emailTemplate = {
                                        id:'',
                                        mail_to: data.msg.mail_to || [],
                                        mail_cc:[],
                                        mail_bcc:[],
                                        message_subject: data.msg.subject,
                                        mail_from: data.msg.mail_from || '',
                                        updateFiles: data.msg.updateFiles || [],
                                        message_body_html: data.msg.body_html,
                                    };
                                    self.editEmailShow = true;
                                }
                            }
                        }
                    });
                });
            },

            createStockOutEmailReport(item){
                let self = this;
                reportService.stockOutReport(item,self.stockOutData,(requestData)=>{
                    self.loading = true;
                    self.$http({
                        url: self.$api.file_mail_templates + '/' + item.id,
                        type: 'POST',
                        requestBody: true,
                        data: requestData,
                        success: function (data) {
                            self.loading = false;
                            if (data.msg) {
                                self.emailTemplate = {
                                    id:'',
                                    mail_to: self.stockOutData.to_email_list,
                                    mail_cc:[],
                                    mail_bcc:[],
                                    message_subject: data.msg.subject,
                                    mail_from: data.msg.mail_from || '',
                                    updateFiles: data.msg.updateFiles || [],
                                    message_body_html: data.msg.body_html,
                                };
                                self.editEmailShow = true;
                            }
                        }
                    });
                });
            },


            //生成订单邮件
            createOrderEmailReport(item){
                let self = this;
                reportService.bigOrderReport(item,self.orderData,self.accountCompanyId,(requestData)=>{
                    self.loading = true;
                    self.$http({
                        url: self.$api.file_mail_templates + '/' + item.id,
                        type: 'POST',
                        requestBody: true,
                        data: requestData,
                        success: function (data) {
                            self.loading = false;
                            if (data.msg) {
                                if(requestData.data.party_b.account_company_id===self.$store.state.currentCompany.account_company_id){
                                    if(requestData.data.party_a.email){
                                        data.msg.mail_to = [requestData.data.party_a.email]
                                    }
                                }else if(requestData.data.party_a.account_company_id===self.$store.state.currentCompany.account_company_id){
                                    if(requestData.data.party_b.email){
                                        data.msg.mail_to = [requestData.data.party_b.email]
                                    }
                                }

                                if(data.msg.report){
                                    self.createReportTemplate(requestData,data.msg)
                                }else {
                                    self.emailTemplate = {
                                        id:'',
                                        mail_to: data.msg.mail_to || [],
                                        mail_cc:[],
                                        mail_bcc:[],
                                        message_subject: data.msg.subject,
                                        mail_from: data.msg.mail_from || '',
                                        updateFiles: data.msg.updateFiles || [],
                                        message_body_html: data.msg.body_html,
                                    };
                                    self.editEmailShow = true;
                                }
                            }
                        }
                    });
                });
            },

            //其他不需要填充数据的邮件
            createNormalEmailReport(item){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_mail_templates + '/' + item.id,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        file_name: item.name,
                        data:{
                            currentCompany: self.$store.state.currentCompany,
                            currentUser: self.$store.state.currentUser,
                        }
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.emailTemplate = {
                                id:'',
                                mail_to: self.mail_to,
                                mail_cc:[],
                                mail_bcc:[],
                                message_subject: self.replySubject ? 'Re: ' + self.replySubject : data.msg.subject,
                                mail_from: data.msg.mail_from || '',
                                updateFiles: data.msg.updateFiles || [],
                                message_body_html: self.replyBodyHtml ? data.msg.body_html
                                        + '<p>---------------- Original ---------------- </p>'
                                        + self.replyBodyHtml : data.msg.body_html,
                            };
                            self.editEmailShow = true;
                        }
                    }
                });
            },



            createReportTemplate(requestData,emailTemplate) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_report_template_generate,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        id: emailTemplate.report.id.toString(),
                        file_name: emailTemplate.alias_name+"_"+self.orderData.name,
                        data:requestData.data,
                        is_permanent: true,
                    },
                    success: function (data) {
                        self.loading = false;
                        self.copyReportTemplateFile(emailTemplate,data.msg.hash.toString() || {})
                    },error(){
                        self.emailTemplate = {
                            id:'',
                            mail_to: emailTemplate.mail_to || [],
                            mail_cc:[],
                            mail_bcc:[],
                            message_subject: emailTemplate.subject,
                            mail_from: emailTemplate.mail_from || '',
                            updateFiles: emailTemplate.updateFiles || [],
                            message_body_html: emailTemplate.body_html,
                        };
                        self.editEmailShow = true;
                    }
                });
            },
            copyReportTemplateFile(emailTemplate,relation_ids) {
                let self = this;
                //TODO 临时功能需要后续优化
                if (emailTemplate.report && /确认下单/.test(emailTemplate.report.file_name)) {
                    relation_ids = relation_ids + ',' + '719666'
                }
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        subsystem: 'message',
                        module_name: 'message',
                        module_id: "0",
                        relation_ids: relation_ids,
                        mode: "copy",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            emailTemplate.updateFiles=data.msg.items;
                        }
                        self.emailTemplate = {
                            id:'',
                            mail_to: emailTemplate.mail_to || [],
                            mail_cc:[],
                            mail_bcc:[],
                            message_subject: emailTemplate.subject,
                            mail_from: emailTemplate.mail_from || '',
                            updateFiles: emailTemplate.updateFiles || [],
                            message_body_html: emailTemplate.body_html,
                        };
                        self.editEmailShow = true;
                    }
                });
            },


            clickoutside() {
                this.listShow = false;
            },
        },
    }
</script>

<style lang="scss">
    @import "select-report";
</style>