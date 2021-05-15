<template>
    <div class="edit-email-view">

        <el-dialog title="编辑邮件"
                   :visible.sync="dialogShow"
                   width="1000px"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   :append-to-body="true"
                   top="30px"
                   custom-class="edit-email-view-dialog">
            <div class="content" v-loading="loading">
                <el-form :model="emailForm" :rules="emailFormRule" ref="emailForm" label-width="80px" label-position="left">
                    <el-form-item label="收件人：" prop="mail_to">
                        <div class="email-row">
                            <SelectEmailInput style="width: 90%" :email.sync="emailForm.mail_to" placeholder="请输入收件人邮箱，多个可用英文分号隔开"></SelectEmailInput>
                            <div class="append">
                                <a class="blue cursor-pointer" v-if="!mailCcShow" @click="mailCcShow=true">抄送</a>
                                <a class="blue cursor-pointer" v-if="!mailBccShow" @click="mailBccShow=true">密送</a>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="抄送人：" prop="mail_cc" v-if="mailCcShow">
                        <div class="email-row">
                            <SelectEmailInput style="width: 90%" :email.sync="emailForm.mail_cc" placeholder="请输入抄送人邮箱，多个可用英文分号隔开"></SelectEmailInput>
                            <div class="append">
                                <a class="blue cursor-pointer" @click="mailCcShow=false">取消抄送</a>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="密送人：" prop="mail_bcc" v-if="mailBccShow">
                        <div class="email-row">
                            <SelectEmailInput style="width: 90%" :email.sync="emailForm.mail_bcc" placeholder="请输入密送人邮箱，多个可用英文分号隔开"></SelectEmailInput>
                            <div class="append">
                                <a class="blue cursor-pointer" @click="mailBccShow=false">取消密送</a>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="主题：" prop="message_subject">
                        <el-input v-model="emailForm.message_subject" placeholder="请输入主题"></el-input>
                    </el-form-item>
                    <el-form-item label="发件人：" prop="email">
                        <el-select v-model="emailForm.mail_from" style="width: 300px;">
                            <el-option
                                    v-for="item in senderList"
                                    :key="item.email"
                                    :value="item.email"
                                    :label="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件：" prop="email">
                        <ul class="list">
                            <li v-for="(item,$index) in emailForm.updateFiles" :key="$index">
                                <i class="el-icon-document"> </i>
                                <a class="margin-left-10" :href="$api.file_file + '/' + item.id" target="_blank">{{item.file_name}}</a>
                                <a class="margin-left-10" href="javascript:;" @click="clickDelete(item)">删除</a>
                            </li>
                        </ul>
                        <el-upload
                                ref="emailFileUpload"
                                :action="uploadUrl"
                                :on-change="fileChange"
                                :before-upload="beforeUpload"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                :show-file-list="false"
                                :auto-upload="false"
                                :with-credentials="true"
                                multiple>
                            <span :slot="canUploadFile?'trigger':'tip'" class="cursor-pointer el-icon-normal" @click="clickAddFile">
                                <i class="el-icon-paperclip"></i>
                                <span style="font-size: 14px;">添加附件</span>

                                <span v-if="uploadLoading" style="font-size: 14px;margin-left: 20px;">
                                    <i class="el-icon-loading"></i>
                                    <span>上传中……</span>
                                </span>
                            </span>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="正文：" prop="message_body_html">
                        <WangEditor ref="WangEditor" :content-html.sync="emailForm.message_body_html"></WangEditor>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveSubmit(false)">
                    <i class="el-icon-s-promotion"></i>
                    <span>发送</span>
                </el-button>
                <el-button type="primary" plain @click="saveSubmit(true)">存为草稿</el-button>
                <el-button @click="dialogShow = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import SelectEmailInput from "./component/SelectEmailInput";
    import Vue from "vue";
    export default {
        components: {SelectEmailInput},
        props: ['show','emailTemplate','module_name','module_id','subsystem'],
        data() {
            return {
                dialogShow: false,

                emailForm:{
                    id:'',
                    mail_to:[],//收件人
                    mail_cc:[],//抄送人
                    mail_bcc:[],//密送人
                    message_subject:'',//主题
                    mail_from:'',//发件人
                    updateFiles:[],//附件
                    message_body_html:'',//正文
                },
                emailFormRule:{
                    mail_to: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value || value.length===0) {
                                    callback(new Error('请输入收件人！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'change'
                        }
                    ],
                    message_subject: [
                        {required: true, message: '请输入主题！', trigger: 'change'}
                    ],message_body_html: [
                        {required: true, message: '请输入正文！', trigger: 'change'}
                    ],
                },

                senderList:[],

                mailCcShow: false,
                mailBccShow: false,
                loading: false,


                uploadUrl:'',
                canUploadFile:false,
                uploadLoading:false,

            }
        },
        watch:{
            show(){
              this.init()
            },
            dialogShow(val){
              if(!val) this.$emit('update:show',val)
            },
            'emailForm.mail_to'(){
                this.canUploadFile = this.emailForm.mail_to && this.emailForm.mail_to.length>0 && this.emailForm.message_subject;
            },
            'emailForm.message_subject'(){
                this.canUploadFile = this.emailForm.mail_to && this.emailForm.mail_to.length>0 && this.emailForm.message_subject;
            },
            '$route'() {
                this.dialogShow=false;
            }
        },
        created() {
            this.getFilters();
        },
        methods: {
            init(){
                if(this.show && this.emailTemplate){
                    this.dialogShow = this.show;
                    let emailTemplateCopy=JSON.parse(JSON.stringify(this.emailTemplate))
                    this.emailForm={
                        id: emailTemplateCopy.id || '',
                        mail_to: emailTemplateCopy.mail_to || [],
                        mail_cc: emailTemplateCopy.mail_cc || [],
                        mail_bcc: emailTemplateCopy.mail_bcc || [],
                        message_subject: emailTemplateCopy.message_subject,
                        mail_from: emailTemplateCopy.mail_from,
                        updateFiles: emailTemplateCopy.updateFiles || [],
                        message_body_html: emailTemplateCopy.message_body_html,
                    };
                    this.mailCcShow=emailTemplateCopy.mail_cc.length>0;
                    this.mailBccShow=emailTemplateCopy.mail_bcc.length>0;

                    this.getSenderList();
                    this.$nextTick(()=>{
                        this.$refs.WangEditor.setContent(this.emailForm.message_body_html);
                        this.$refs.emailForm.clearValidate();
                    })
                }
            },
            getFilters(){
                this.zerosoCompanyTime = Vue.filter('zerosoCompanyTime');
            },

            getSenderList(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_self_address_v3,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            let senderList=[];
                            if(self.emailTemplate.mail_from){
                                senderList.push({
                                    email:self.emailTemplate.mail_from,
                                    label:self.emailTemplate.mail_from,
                                })
                            }
                            data.msg.items.forEach((item)=>{
                                if(senderList[0] && senderList[0].email===item.email){
                                    senderList[0]={
                                        email:item.email,
                                        label:item.display_name ? '"'+item.display_name+'" <'+item.email+'>' : item.email
                                    }
                                }else {
                                    senderList.push({
                                        email:item.email,
                                        label:item.display_name ? '"'+item.display_name+'" <'+item.email+'>' : item.email
                                    })
                                }
                            });
                            self.senderList=senderList;

                            if(self.senderList.length>0){
                                self.emailForm.mail_from=self.senderList[0].email;
                                self.addSignatureToContent(data.msg.items);
                            }else {
                                self.$message({
                                    showClose: true,
                                    message: '未获取到发件人信息，无法发送邮件，请联系管理员！',
                                    type: 'error'
                                });
                                self.dialogShow = false;
                            }
                        }
                    }
                })
            },

            //拼接前面到邮件内容中
            addSignatureToContent(senderList){
              let self=this;
                let signature = ''
                if(senderList[0] && senderList[0].signature){
                    signature = senderList[0].signature;
                }

                if(self.emailTemplate.isReply){
                    self.emailForm.message_body_html =
                        '<p>&nbsp;</p><p>&nbsp;</p>'
                        + signature
                        + '<p>&nbsp;</p><p>---------------- Original ---------------- </p>'
                        +'<pre>At ' + self.zerosoCompanyTime(self.emailTemplate.create_time) + ' ' + self.emailTemplate.mail_to[0] + ',' + ' wrote:</pre>'
                        + '<pre>' + self.emailTemplate.message_body_html + '</pre>';

                }else if(self.emailTemplate.isForward){
                    self.emailForm.message_body_html =
                        '<p>&nbsp;</p><p>&nbsp;</p>'
                        + signature
                        + '<p>&nbsp;</p><p>---------------- Original ---------------- </p>'+

                        "From：" + self.emailTemplate.forwardData.mail_from + "<br>" +
                        "Date：" + self.zerosoCompanyTime(self.emailTemplate.create_time) + "<br>" +
                        "To：" + self.emailTemplate.forwardData.mail_to.join(', ') + "<br>" +
                        "Cc：" + self.emailTemplate.forwardData.mail_cc.join(', ') + "<br>" +
                        "Subject：" + self.emailTemplate.forwardData.message_subject + "<br>" +

                        '<p>&nbsp;</p>'+
                        '<pre>' + self.emailTemplate.message_body_html + '</pre>';

                }else if(self.emailTemplate.isAdd){
                    self.emailForm.message_body_html = '<p>&nbsp;</p><p>&nbsp;</p>' + signature
                }

                if(self.emailTemplate.isReply || self.emailTemplate.isForward || self.emailTemplate.isAdd){
                    self.$nextTick(()=>{
                        self.$refs.WangEditor.setContent(self.emailForm.message_body_html);
                    })
                }
            },


            saveSubmit(isDraft,isBeforeUpdateFile,callback){
                let self = this;
                self.$refs.emailForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        let updateFiles=[];
                        let willToMoveFiles=[];
                        self.emailForm.updateFiles.forEach((item)=>{
                            if(!item.module_id || item.module_id==='0'){
                                willToMoveFiles.push(item);
                            }else {
                                updateFiles.push(item);
                            }
                        });
                        self.$http({
                            url:self.emailForm.id ? self.$api.message_mail_v3+'/'+self.emailForm.id : self.$api.message_mail_v3,
                            type: self.emailForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data:{
                                updateFiles: updateFiles,
                                message_body_html: self.emailForm.message_body_html,
                                message_subject: self.emailForm.message_subject,
                                mail_from: self.emailForm.mail_from,
                                assign_user_id: self.emailTemplate.assign_user_id || self.$store.state.currentCompany.user_id,
                                send_time: null,
                                isDraft: isDraft,
                                message_attachment: self.emailForm.updateFiles.length>0,
                                mail_to: self.emailForm.mail_to,
                                mail_cc: self.mailCcShow ? self.emailForm.mail_cc : [],
                                mail_bcc: self.mailBccShow ? self.emailForm.mail_bcc : [],

                                module_id: self.module_id ? self.module_id.toString() : undefined,
                                module_name: self.module_name,
                                subsystem: self.subsystem,

                                id: self.emailForm.id || undefined,
                                messageId: self.emailForm.id || undefined,
                                repay_from_id: self.emailTemplate.repay_from_id,
                                forward_from_id: self.emailTemplate.forward_from_id,
                            },
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.emailForm.id=data.msg.id;
                                    if(!isBeforeUpdateFile){
                                        if(!isDraft){
                                            self.sendSubmit(data.msg.id);
                                        }else {
                                            self.$message({
                                                type: 'success',
                                                duration:6000,
                                                dangerouslyUseHTMLString: true,
                                                message: '<span>邮件保存草稿成功！</span><a class="blue" href="#/email/draft/detail?id='+data.msg.id+'" target="_blank">点击查看邮件详情</a>',
                                                showClose: 'true'
                                            });
                                            self.dialogShow=false;
                                            self.$emit('saveSuccess','DRAFTBOX')
                                        }
                                    }
                                    if(willToMoveFiles.length>0){
                                        self.moveReportTemplateFile(willToMoveFiles,()=>{
                                            callback && callback();
                                        });
                                    }else {
                                        callback && callback();
                                    }
                                }
                            }
                        });

                    } else {
                        console.log('error submit!!');
                    }
                });

            },

            sendSubmit(id){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + '/box/' + id,
                    type: 'PUT',
                    requestBody: true,
                    data:{
                        box: "SENDBOX",
                        messageId: id
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.result) {
                            self.$message({
                                type: 'success',
                                duration:4000,
                                dangerouslyUseHTMLString: true,
                                message: '<span>邮件发送成功！</span><a class="blue" href="#/email/sending/detail?id='+ id +'" target="_blank">点击查看邮件详情</a>',
                                showClose: 'true'
                            });
                            self.dialogShow=false;
                            self.$emit('saveSuccess','SENDBOX')
                        }
                    }
                })
            },


            moveReportTemplateFile(willToMoveFiles,callback) {
                let self = this;
                let relation_ids=[];
                willToMoveFiles.forEach((item)=>{
                    relation_ids.push(item.id);
                });
                self.$http({
                    url: self.$api.file_files_list,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        subsystem: 'message',
                        module_name: 'message',
                        module_id: self.emailForm.id.toString(),
                        relation_ids: relation_ids.join(','),
                        mode: "move",
                    },
                    success (data) {
                        if(data.msg && data.msg.items){
                            data.msg.items.forEach((item)=>{
                                for(let i=0;i<willToMoveFiles.length;i++){
                                    if(item.id == willToMoveFiles[i].id){
                                        willToMoveFiles[i].module_id = item.module_id;
                                    }
                                }
                            })
                        }
                        callback && callback()
                    },
                    error () {
                        callback && callback()
                    },
                });
            },

            clickDelete(item) {
                if(item.id){
                    for(let i=0;i<this.emailForm.updateFiles.length;i++){
                        if(this.emailForm.updateFiles[i].id === item.id){
                            this.emailForm.updateFiles.splice(i,1);
                            break
                        }
                    }
                }

            },

            clickAddFile(){
                let self=this;
                if(!self.canUploadFile){
                    self.$refs.emailForm.validate();
                }
            },
            fileChange(){
                this.uploadUrl = this.$utils.setCurrentCompanyToSearchParam(this.$api.file_files_list + '?subsystem=message&module_name=message&module_id='+this.emailForm.id);
                if(this.timer) clearTimeout(this.timer);
                this.timer=setTimeout(()=>{
                    if(this.emailForm.id){
                        this.$refs.emailFileUpload.submit();
                    }else {
                        this.saveSubmit(true,true,()=>{
                            this.fileChange();
                        })
                    }
                },200);
            },
            beforeUpload(){
                this.uploadLoading=true;
            },
            uploadSuccess(data, file){
                this.uploadLoading=false;
                if(data.msg && data.msg.items){
                    file.fileId=data.msg.items.id;
                    this.emailForm.updateFiles.push(data.msg.items);
                }
            },
            uploadError(data,file){
                this.uploadLoading=false;
                this.$message({
                    showClose: true,
                    message: '上传失败：' + file.name,
                    type: 'error'
                });
            },
        },
    }
</script>

<style lang="scss">
    @import "./../../assets/css/config";
    .edit-email-view-dialog {
        .email-row{
            position: relative;
            .append{
                position: absolute;
                right: 0;
                top: 0;
                z-index: 99;
                a{
                    font-size: 12px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>