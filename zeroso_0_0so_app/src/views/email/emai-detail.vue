<template>
    <div class="flex-box-column email-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">邮件 / {{breadNameList[boxType]}}</el-breadcrumb-item>
                    <el-breadcrumb-item>
                        <span class="nowrap" style="max-width: 100px;">{{detailForm.message_subject}}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-status">
                        <span class="el-icon-back el-icon-normal cursor-pointer margin-right-20" @click="$router.back()"></span>

                        <template v-if="detailForm.id">
                            <el-button size="mini" plain :type="detailForm.message_deal? null : 'danger'"
                                       @click="updateEmaiData('/deal',{deal:!detailForm.message_deal})"
                                       v-if="isButtonBoxShow(['INBOX','PENDING'],detailForm.box)">
                                {{detailForm.message_deal?'标记为未处理':'标记为已处理'}}
                            </el-button>

                            <el-button-group class="margin-left-10">
                                <el-button size="mini" plain v-if="isButtonBoxShow(['DRAFTBOX'],detailForm.box)" @click="clickEditDraft">编辑草稿</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['INBOX','PENDING','search'],detailForm.box)" @click="clickReply">回复</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['INBOX','PENDING','search'],detailForm.box)" @click="clickReplyAll">全部回复</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['DRAFTBOX','INBOX','PENDING','SENTBOX','search'],detailForm.box)" @click="clickForward">转发</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['SENDBOX'],detailForm.box)" @click="updateEmaiData('/send_now')">立即发送</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['SENDBOX'],detailForm.box)" @click="updateEmaiData('/box',{box: 'DRAFTBOX'})">移动到草稿</el-button>
                            </el-button-group>
                            <SelectEmailTemplate
                                    v-if="['invoice','outgoing_transfer','order'].indexOf(detailForm.module_name)===-1 && isButtonBoxShow(['INBOX','PENDING','search'],detailForm.box)"
                                    name="模板回复"
                                    :mail_to="[detailForm.mail_from]"
                                    :replySubject="detailForm.message_subject"
                                    :replyBodyHtml="detailForm.message_body_html"
                                    :module_id="detailForm.module_id"
                                    :module_name="detailForm.module_name"
                                    :subsystem="detailForm.subsystem"
                                    profession_type="to_supplier"
                                    template_module_name="inquiry_pool"
                                    template_subsystem="inquiry"
                                    :accountCompanyId="9428"
                                    size="mini"
                                    class="margin-left-10">
                            </SelectEmailTemplate>

                            <email-detail-bind-order :queryId="queryId" v-if="detailForm.module_name!=='order'" class="margin-left-10" @updateEmaiData="updateEmaiData"></email-detail-bind-order>

                            <email-detail-bind-inquiry :queryId="queryId" v-if="$store.state.system==='0' && detailForm.module_name!=='inquiry_pool'" class="margin-left-10" @updateEmaiData="updateEmaiData"></email-detail-bind-inquiry>
                            <email-detail-bind-quote-inquiry :queryId="queryId" v-if="$store.state.system==='0' && detailForm.module_name!=='quote_inquiry'" class="margin-left-10" @updateEmaiData="updateEmaiData"></email-detail-bind-quote-inquiry>

                            <el-button size="mini" plain class="margin-left-10" v-if="detailForm.module_name==='order' || detailForm.module_name==='inquiry_pool' || detailForm.module_name==='quote_inquiry'" @click="updateEmaiData('/module',{},'DELETE')">解除绑定</el-button>

                            <span class="margin-left-20">指派给:</span>
                            <el-select class="margin-right-10" size="mini" v-model="assignUserId" @change="updateEmaiData('/assign',{user_id:assignUserId})">
                                <el-option :value="0" label="无"></el-option>
                                <el-option
                                        v-for="item in $store.state.all_internal_users"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.name">
                                </el-option>
                            </el-select>

                            <EmailState :state="detailForm.state"></EmailState>

                            <el-button-group class="margin-left-10 margin-right-10">
                                <el-button size="mini" plain v-if="isButtonBoxShow(['DRAFTBOX','INBOX','PENDING','SENDBOX','JUNKBOX'],detailForm.box)" @click="clickDelete(0)">删除</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['DELETEBOX','JUNKBOX'],detailForm.box)" @click="clickDelete(1)">彻底删除</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['DELETEBOX','JUNKBOX'],detailForm.box)" @click="updateEmaiData('/recover')">邮件恢复</el-button>
                                <el-button size="mini" plain v-if="isButtonBoxShow(['INBOX','PENDING'],detailForm.box)" @click="updateEmaiData('/box',{box: 'JUNKBOX'})">列为垃圾邮件</el-button>
                            </el-button-group>


                            <el-tag type="info" size="mini" effect="plain" class="cursor-pointer"
                                    v-if="!detailForm.book_mark_id"
                                    @click.native.stop="$refs.relatedMessageDetailAddTag.emailAddTag(detailForm)">
                                加入书签
                            </el-tag>
                            <template v-if="detailForm.book_mark_id">
                                <MessageTag :lever="detailForm.mark_level"></MessageTag>
                                <related-message-detail-delete-tag
                                        :tagId="detailForm.book_mark_id"
                                        @update="init">
                                </related-message-detail-delete-tag>
                            </template>
                        </template>
                    </div>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <el-button type="primary" size="mini" @click="clickWriteEmail()">写邮件</el-button>
                        </div>
                        <DetailPagination ref="DetailPagination" :apiKey="filterKey" :listApi="listApi"></DetailPagination>
                    </div>
                </div>

                <div class="detail-base-body">
                    <h2 class="title">{{detailForm.message_subject}}</h2>

                    <div class="relation-order right" v-if="detailForm.module_name==='order' && detailForm.order">
                        <span>已关联订单：</span>
                        <b class="blue cursor-pointer margin-right-10" @click="goToOrderDetail()">{{detailForm.module_id}}</b>
                        <OrderInquiryPriority :state="detailForm.order.inquiry_priority"></OrderInquiryPriority>
                    </div>

                    <div class="relation-order right" v-if="detailForm.module_name==='inquiry_pool' && detailForm.module_id">
                        <span>已关联询价单：</span>
                        <router-link class="blue cursor-pointer margin-right-20" target="_blank" :to="'/inquiry-price/all/detail?id='+detailForm.module_id">
                            <b>{{detailForm.module_id}}</b>
                        </router-link>
                    </div>

                    <div class="relation-order right" v-if="detailForm.module_name==='quote_inquiry' && detailForm.module_id">
                        <span>已关联询报价单：</span>
                        <router-link class="blue cursor-pointer margin-right-20" target="_blank" :to="'/inquiry-quotation/ALL/detail?id='+detailForm.module_id">
                            <b>{{detailForm.module_id}}</b>
                        </router-link>
                    </div>

                    <div class="info">
                        <p>
                            <span>发件人：</span>
                            <email-detail-add-address :email="detailForm.mail_from" :email_map="detailForm.email_map" @update="init"> </email-detail-add-address>
                        </p>
                        <p>
                            <span>收件人：</span>
                            <span class="margin-right-10" v-for="(item,$index) in detailForm.mail_to" :key="$index">
                                <email-detail-add-address :email="item" :email_map="detailForm.email_map" @update="init"> </email-detail-add-address>
                            </span>
                        </p>
                        <p v-if="detailForm.mail_cc && detailForm.mail_cc.length>0">
                            <span>抄送人：</span>
                            <span class="margin-right-10" v-for="(item,$index) in detailForm.mail_cc" :key="$index">
                                <email-detail-add-address :email="item" :email_map="detailForm.email_map" @update="init"> </email-detail-add-address>
                            </span>

                        </p>
                        <p v-if="detailForm.mail_bcc && detailForm.mail_bcc.length>0 && detailForm.box && detailForm.box.indexOf('SENTBOX')>-1">
                            <span>密送人：</span>
                            <span class="margin-right-10" v-for="(item,$index) in detailForm.mail_bcc" :key="$index">
                                <email-detail-add-address :email="item" :email_map="detailForm.email_map" @update="init"> </email-detail-add-address>
                            </span>

                        </p>

                        <p>
                            <span>{{detailForm.box && detailForm.box.indexOf('SENDBOX')>-1 && detailForm.send_state!=='SENT_ALL_FAIL' ? '预计发送' : '时  间'}}：</span>
                            <span>{{(detailForm.send_time || detailForm.create_time) | zerosoCompanyTime}}</span>
                        </p>
                        <p v-if="detailForm.message_attachment">
                            <span>附 件：</span>
                            <span class="inline-block">
                                <FileListShow :module_id="queryId" module_name="message" subsystem="message"></FileListShow>
                            </span>
                        </p>
                    </div>

                    <div class="email-log">
                        <p>
                            <a href="javascript:;" @click="addLogShow=!addLogShow">添加内部批注</a>
                        </p>
                        <table v-if="addLogShow">
                            <tbody>
                            <tr>
                                <td width="8%"></td>
                                <td width="50%">
                                    <el-input v-model="addLogContent" placeholder="输入批注内容"></el-input>
                                </td>
                                <td width="20%">
                                    <el-button type="success" size="mini" @click="clickSaveAddLogs">保存</el-button>
                                    <el-button type="primary" size="mini" plain @click="addLogShow=false">取消</el-button>
                                </td>
                                <td width="12%"></td>
                            </tr>
                            </tbody>
                        </table>
                        <table v-if="detailForm.deal_logs && detailForm.deal_logs.length>0">
                            <tbody>
                            <tr v-for="(deal_log,$index) in detailForm.deal_logs" :key="$index">
                                <td width="8%">{{deal_log.user_name}}</td>
                                <td width="50%">{{deal_log.content}}</td>
                                <td width="15%">{{deal_log.mail_target}}</td>
                                <td width="17%">{{deal_log.create_time|zerosoCompanyTime}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <email-detail-content :bodyHtml="detailForm.message_body_html"></email-detail-content>

                </div>
            </div>


        </div>



        <edit-email
                :show.sync="editEmailShow"
                :emailTemplate="emailTemplate"
                :module_id="this.emailTemplate.isAdd ? undefined : detailForm.module_id"
                :module_name="this.emailTemplate.isAdd ? undefined : detailForm.module_name"
                :subsystem="this.emailTemplate.isAdd ? undefined : detailForm.subsystem"
                @saveSuccess="getDetailData">
        </edit-email>

        <related-message-detail-add-tag
                :markType="2"
                ref="relatedMessageDetailAddTag"
                @update="init">
        </related-message-detail-add-tag>
    </div>
</template>

<script>
    import OrderUtils from './../order/order-utils'
    import EmailDetailAddAddress from "./component/email-detail-add-address";
    import EmailDetailBindOrder from "./component/email-detail-bind-order";
    import EditEmail from "./editEmail";
    import EmailDetailBindInquiry from "./component/email-detail-bind-inquiry";
    import RelatedMessageDetailAddTag from "../related-message/component/related-message-detail-add-tag";
    import RelatedMessageDetailDeleteTag from "../related-message/component/related-message-detail-delete-tag";
    import EmailDetailContent from "./component/email-detail-content";
    import EmailDetailBindQuoteInquiry from "./component/email-detail-bind-quote-inquiry";
    export default {
        components: {
            EmailDetailBindQuoteInquiry,
            EmailDetailContent,
            RelatedMessageDetailDeleteTag,
            RelatedMessageDetailAddTag,
            EmailDetailBindInquiry, EditEmail, EmailDetailBindOrder, EmailDetailAddAddress},
        data() {
            return {
                queryId: '',
                parentQuery: '',

                boxType:'',
                listApi:'',
                filterKey:'',
                breadNameList:{
                    all:'所有',
                    received:'收件箱',
                    sending:'发件箱',
                    sent:'已发送',
                    draft:'草稿箱',
                    deleted:'已删除',
                    junk:'垃圾箱',
                    waiting:'待处理',
                    tag:'邮件书签',
                },


                detailForm: {},

                assignUserId:0,




                addLogShow:false,
                addLogContent:'',

                loading: false,


                mailBox: {
                    receive: 'INBOX',
                    sent: 'SENTBOX',
                    send: 'SENDBOX',
                    draft: 'DRAFTBOX',
                    delete: 'DELETEBOX',
                    junk: 'JUNKBOX',
                    pending: 'PENDING',
                    search: 'search',
                    waiting: 'PENDING',
                },

                mailState: {
                    outgoing: 'OUTGOING',
                    ready: 'READY',
                    sentAll: 'SENT_ALL_SUCCESS',
                    sent: 'SENT_SUCCESS',
                    sentFail: 'SENT_ALL_FAIL',
                    syncMailFail: 'SYNC_MAIL_FAIL',
                    mailReceived: 'MAIL_RECEIVED',
                    onlyInternal: 'ONLY_INTERNAL'
                },

                editEmailShow:false,
                emailTemplate:{},
            }
        },
        watch: {
            '$store.state.all_internal_users'(){
                this.$store.state.all_internal_users.forEach((item)=>{
                    if(this.detailForm.assign_user_id==item.id){
                        this.assignUserId=this.detailForm.assign_user_id;
                    }
                })
            },
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
                this.boxType = this.$route.params.boxType;
                if(this.boxType==='tag'){
                    this.listApi=this.$api.message_book_mark_mails_search;
                    this.filterKey= undefined;
                }else {
                    this.listApi=this.$api.message_mail_search_filter_v3 + '/' + this.boxType;
                    this.filterKey='message_mail_' + this.boxType;
                }

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                }
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.detailForm = data.msg;
                            self.$store.state.all_internal_users.forEach((item)=>{
                                if(self.detailForm.assign_user_id==item.id){
                                    self.assignUserId=self.detailForm.assign_user_id;
                                }
                            })

                        }
                    },
                    error(data){
                        if(data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40203)>-1){
                            self.$router.back();
                        }
                    }
                })
            },


            clickSaveAddLogs() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + '/deal_log/' + self.queryId,
                    type:'POST',
                    requestBody:true,
                    data:{
                        content: self.addLogContent,
                        messageId: self.queryId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.result) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.addLogShow=false;
                            self.addLogContent='';
                            self.getDetailData();
                        }
                    }
                })
            },



            isButtonBoxShow(boxList,box){
                if(boxList && box){
                    for(let i=0;i<boxList.length;i++){
                        if(box.indexOf(boxList[i])>-1){
                            return true
                        }
                    }
                }
                return false
            },

            updateEmaiData(api,requestData,type,callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + api + '/' + self.queryId ,
                    type:type || 'PUT',
                    requestBody:true,
                    data:{
                        messageId: self.queryId,
                        ...requestData || {}
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            if(callback) {
                                callback();
                            }else {
                                self.getDetailData();
                                if(requestData && requestData.deal===true && self.boxType==='waiting'){
                                    self.$refs.DetailPagination.switchNextPage(()=>{
                                        self.$router.push(self.parentQuery ? 'list?'+self.parentQuery : 'list');
                                    });
                                }
                            }
                        }
                    }
                })
            },

            clickDelete(strict){
                let self=this;
                self.$confirm(strict===1?'确定彻底删除该邮件吗？':'确定删除该邮件吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback(action){
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.message_mail_v3,
                                type: 'DELETE',
                                data: {
                                    ids: self.queryId.toString(),
                                    strict: strict
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.err_code.length === 0 && data.msg) {
                                        self.$message({
                                            showClose: true,
                                            message: '删除成功！',
                                            type: 'success'
                                        });
                                        self.getDetailData();
                                    } else {
                                        self.$message({
                                            showClose: true,
                                            message: '删除失败！',
                                            type: 'error'
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            },

            //编辑草稿
            clickEditDraft(){
                this.getFileListData((fileList)=>{
                    this.emailTemplate = {
                        id: this.detailForm.id,
                        mail_to: this.detailForm.mail_to || [],
                        mail_cc: this.detailForm.mail_cc || [],
                        mail_bcc: this.detailForm.mail_bcc || [],
                        message_subject: this.detailForm.message_subject,
                        mail_from: this.detailForm.mail_from,
                        updateFiles: fileList || [],
                        message_body_html: this.detailForm.message_body_html,
                    };
                    this.editEmailShow=true;
                })
            },
            //回复邮件
            clickReply(){
                this.emailTemplate = {
                    mail_to: [this.detailForm.mail_from],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: 'Re: ' + this.detailForm.message_subject,
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: this.detailForm.message_body_html,
                    assign_user_id: this.detailForm.assign_user_id,

                    isReply:true,
                    create_time:this.detailForm.create_time,
                    repay_from_id:this.detailForm.repay_from_id,
                };
                this.editEmailShow=true;
            },
            //回复全部
            clickReplyAll(){
                this.emailTemplate = {
                    mail_to: [this.detailForm.mail_from],
                    mail_cc: this.detailForm.mail_cc || [],
                    mail_bcc: this.detailForm.mail_bcc || [],
                    message_subject: 'Re: ' + this.detailForm.message_subject,
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: this.detailForm.message_body_html,
                    assign_user_id: this.detailForm.assign_user_id,

                    isReply:true,
                    create_time:this.detailForm.create_time,
                    repay_from_id:this.detailForm.id,
                };
                this.editEmailShow=true;
            },

            //转发
            clickForward(){
                this.getFileListData((fileList)=>{
                    this.copyEmailFile(fileList,(fileListNew)=>{
                        this.emailTemplate = {
                            mail_to: [],
                            mail_cc: [],
                            mail_bcc: [],
                            message_subject: 'Fw: ' + this.detailForm.message_subject,
                            mail_from: '',
                            updateFiles: fileListNew || [],
                            message_body_html: this.detailForm.message_body_html,
                            assign_user_id: this.detailForm.assign_user_id,

                            isForward:true,
                            create_time:this.detailForm.create_time,
                            forward_from_id:this.detailForm.id,

                            forwardData:{
                                mail_from:this.detailForm.mail_from,
                                mail_to:this.detailForm.mail_to,
                                mail_cc:this.detailForm.mail_cc,
                                message_subject:this.detailForm.message_subject,
                            }
                        };
                        this.editEmailShow=true;
                    });
                })
            },

            //写邮件
            clickWriteEmail(){
                this.emailTemplate = {
                    mail_to: [],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: '',
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: '',

                    isAdd:true,
                };
                this.editEmailShow=true;
            },


            copyEmailFile(fileList,callback) {
                let self = this;
                if(!fileList || fileList.length===0) {
                    callback && callback(fileList);
                    return;
                }
                let relation_ids=[];
                fileList.forEach((item)=>{
                    relation_ids.push(item.id);
                });
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        subsystem: 'message',
                        module_name: 'message',
                        module_id: "0",
                        relation_ids: relation_ids.join(','),
                        mode: "copy",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            fileList=data.msg.items;
                        }
                        callback && callback(fileList);
                    },error(){
                        callback && callback(fileList);
                    }
                });
            },

            getFileListData(callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    data:{
                        module_id:self.queryId,
                        module_name:'message',
                        subsystem:'message',
                    },
                    success: function (data) {
                        self.loading = false;
                        let fileList=[];
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            fileList = data.msg.items;
                        }
                        callback && callback(fileList)
                    },error(){
                        callback && callback([])
                    }
                })
            },




            goToOrderDetail(){
                OrderUtils.goToOrderDetail(this.detailForm.module_id,true)
            }
        }
    }
</script>

<style lang="scss">
    .email-detail{
        .detail-base-info{
            overflow: initial !important;
        }
        .detail-base-body{
             padding-left: 30px !important;
            .title{
                padding: 5px 0 15px;
            }
            .info{
                padding-bottom: 10px;
                p{
                    margin-bottom: 5px;
                    font-size: 12px;
                    line-height: 20px;
                    &>span:first-child{
                        display: inline-block;
                        min-width: 70px;
                        vertical-align: top;
                    }
                }
            }
            .email-log{
                background: #dde7f9;
                padding: 8px;
                margin-bottom: 20px;
                font-size: 12px;
                box-sizing: border-box;
                a{
                    font-size: 12px;
                }
                table{
                    margin-top: 8px;
                    width: 100%;
                    border-collapse: collapse;
                    td{
                        background-color: #ffffff;
                        line-height: 20px;
                        padding: 4px 8px;
                        border-bottom: 1px solid #dde7f9;
                    }
                }
            }
            .email-content{
                line-height: 1.4em;
                word-break: break-word;
                position: relative;//抵触设置定位坐标，防止邮件正文中包含Position的属性，导致内容乱飞
                p{
                    margin: 10px 0;
                }
                a{
                    color: blue;
                    text-decoration: underline;
                }
                pre{
                    white-space: inherit;
                }
            }
        }
        .relation-order{
            font-size: 15px;
        }
    }
</style>
