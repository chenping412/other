<template>
    <div id="" class="flex-box-column related-email-list">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>关联邮件</el-breadcrumb-item>
                </el-breadcrumb>
            </div>


            <div class="table-control clearfix">
                <div class="control-btns" style="font-size: 14px;line-height:32px;">
                    <span class="margin-right-20" v-if="data.orderName">
                        <span>订单号：</span>
                        <span class="blue cursor-pointer" @click="goToOrder">{{data.orderName}}</span>
                    </span>
                    <span class="margin-right-20" v-if="data.inquiryName">
                        <span>询价单号：</span>
                        <router-link class="blue" target="_blank" :to="'/inquiry-price/all/detail?id='+data.inquiryName">
                            {{data.inquiryName}}
                        </router-link>
                    </span>
                    <span class="margin-right-20" v-if="data.quoteInquiryName">
                        <span>询报价单号：</span>
                        <router-link class="blue" target="_blank" :to="'/inquiry-quotation/ALL/detail?id='+data.quoteInquiryName">
                            {{data.quoteInquiryName}}
                        </router-link>
                    </span>
                    <span class="margin-right-20" v-if="data.brand">
                        <span>品牌：</span>
                        <router-link class="blue" target="_blank" :to="'/product/brand/detail?id='+data.brand.id">{{data.brand.name}}</router-link>
                        <BrandLever :state="data.brand.state"></BrandLever>
                    </span>
                    <span class="margin-right-20"
                          v-if="data.supplier_company && data.supplier_company.account_company_id">
                        <span>供应商：</span>
                        <router-link class="blue" target="_blank" :to="'/partner/detail?id='+data.supplier_company.account_company_id">
                            {{data.supplier_company.company_name}}
                        </router-link>
                    </span>
                    <span class="margin-right-20"
                          v-if="data.customer_company && data.customer_company.account_company_id">
                        <span>客户：</span>
                        <router-link class="blue" target="_blank" :to="'/partner/detail?id='+data.customer_company.account_company_id">
                            {{data.customer_company.company_name}}
                        </router-link>
                    </span>

                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>

                <el-button type="primary" size="mini" class="right margin-right-20" @click="clickWriteEmail">写邮件
                </el-button>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table ref="table" :data="listData" :row-class-name="tableRowClassName" @row-click="rowClick"
                          :show-header="true" v-loading="loading">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div class="email-detail">
                                <div class="detail-base-body">
                                    <h2 class="title">
                                        <span>{{scope.row.message_subject}}</span>
                                        <a :href="'#/email/received/detail?id='+scope.row.id" target="_blank"
                                           class="blue margin-left-20" style="font-size: 14px;">查看邮件详情</a>
                                    </h2>

                                    <div class="info">
                                        <p>
                                            <span>发件人：</span>
                                            <email-detail-add-address :email="scope.row.mail_from"
                                                                      :email_map="scope.row.email_map"
                                                                      @update="init"></email-detail-add-address>
                                        </p>
                                        <p>
                                            <span>收件人：</span>
                                            <span class="margin-right-10" v-for="(item,$index) in scope.row.mail_to"
                                                  :key="$index">
                                            <email-detail-add-address :email="item" :email_map="scope.row.email_map"
                                                                      @update="init"> </email-detail-add-address>
                                        </span>
                                        </p>
                                        <p v-if="scope.row.mail_cc && scope.row.mail_cc.length>0">
                                            <span>抄送人：</span>
                                            <span class="margin-right-10" v-for="(item,$index) in scope.row.mail_cc"
                                                  :key="$index">
                                            <email-detail-add-address :email="item" :email_map="scope.row.email_map"
                                                                      @update="init"> </email-detail-add-address>
                                        </span>

                                        </p>
                                        <p v-if="scope.row.mail_bcc && scope.row.mail_bcc.length>0 && scope.row.box && scope.row.box.indexOf('SENTBOX')>-1">
                                            <span>密送人：</span>
                                            <span class="margin-right-10" v-for="(item,$index) in scope.row.mail_bcc"
                                                  :key="$index">
                                            <email-detail-add-address :email="item" :email_map="scope.row.email_map"
                                                                      @update="init"> </email-detail-add-address>
                                        </span>

                                        </p>

                                        <p>
                                            <span>{{scope.row.box && scope.row.box.indexOf('SENDBOX')>-1 && scope.row.send_state!=='SENT_ALL_FAIL' ? '预计发送' : '时  间'}}：</span>
                                            <span>{{(scope.row.send_time || scope.row.create_time) | zerosoCompanyTime}}</span>
                                        </p>
                                        <p v-if="scope.row.message_attachment">
                                            <span>附 件：</span>
                                            <span class="inline-block">
                                            <FileListShow :module_id="scope.row.id" module_name="message"
                                                          subsystem="message"></FileListShow>
                                        </span>
                                        </p>
                                    </div>

                                    <div class="email-log">
                                        <p>
                                            <a href="javascript:;" @click="scope.row.addLogShow=!scope.row.addLogShow">添加内部批注</a>
                                        </p>
                                        <table v-if="scope.row.addLogShow">
                                            <tbody>
                                            <tr>
                                                <td width="8%"></td>
                                                <td width="50%">
                                                    <el-input v-model="scope.row.addLogContent"
                                                              placeholder="输入批注内容"></el-input>
                                                </td>
                                                <td width="20%">
                                                    <el-button type="success" size="mini"
                                                               @click="clickSaveAddLogs(scope.row)">保存
                                                    </el-button>
                                                    <el-button type="primary" size="mini" plain
                                                               @click="scope.row.addLogShow=false">取消
                                                    </el-button>
                                                </td>
                                                <td width="12%"></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table v-if="scope.row.deal_logs && scope.row.deal_logs.length>0">
                                            <tbody>
                                            <tr v-for="(deal_log,$index) in scope.row.deal_logs" :key="$index">
                                                <td width="8%">{{deal_log.user_name}}</td>
                                                <td width="50%">{{deal_log.content}}</td>
                                                <td width="15%">{{deal_log.mail_target}}</td>
                                                <td width="17%">{{deal_log.create_time|zerosoCompanyTime}}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <email-detail-content :bodyHtml="scope.row.message_body_html"></email-detail-content>

                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="mail_from" label="发件人" width="200"></el-table-column>
                    <el-table-column prop="mail_to" label="收件人" width="200"></el-table-column>
                    <el-table-column label="附件" width="70">
                        <template slot-scope="scope">
                            <i class="el-icon-paperclip el-icon-normal" v-if="scope.row.message_attachment"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="主题">
                        <template slot-scope="scope">
                            <p class="nowrap" :title="scope.row.message_subject">{{scope.row.message_subject}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column width="250">
                        <template slot-scope="scope">
                            <span>指派给:</span>
                            <el-select style="width: 170px;" size="mini" v-model="scope.row.assignUserId"
                                       @change="updateEmaiData(scope.row,'/assign',{user_id:scope.row.assignUserId})">
                                <el-option :value="0" label="无"></el-option>
                                <el-option
                                        v-for="item in $store.state.all_internal_users"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.name">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="150">
                        <template slot-scope="scope">
                            <p>{{scope.row.create_time | zerosoCompanyTime}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tag type="warning">{{scope.row.state | mailState}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <SelectEmailTemplate
                                    v-if="['invoice','outgoing_transfer','order'].indexOf(scope.row.module_name)===-1"
                                    name="模板回复"
                                    :mail_to="[scope.row.mail_from]"
                                    :replySubject="scope.row.message_subject"
                                    :replyBodyHtml="scope.row.message_body_html"
                                    :module_id="scope.row.module_id"
                                    :module_name="scope.row.module_name"
                                    :subsystem="scope.row.subsystem"
                                    profession_type="to_supplier"
                                    template_module_name="inquiry_pool"
                                    template_subsystem="inquiry"
                                    :accountCompanyId="9428"
                                    size="mini">
                            </SelectEmailTemplate>

                            <el-button size="mini" type="primary" plain @click="clickReply(scope.row)">回复</el-button>
                            <el-button size="mini" type="primary" plain @click="clickForward(scope.row)">转发</el-button>

                            <el-button size="mini" plain :type="scope.row.message_deal? null : 'danger'"
                                       @click="updateEmaiData(scope.row,'/deal',{deal:!scope.row.message_deal})">
                                {{scope.row.message_deal?'标记为未处理':'标记为已处理'}}
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <edit-email
                :show.sync="editEmailShow"
                :emailTemplate="emailTemplate"
                :module_name="module_name"
                :subsystem="subsystem"
                :module_id="module_id"
                @saveSuccess="init">
        </edit-email>
    </div>
</template>

<script>
    import EditEmail from "./editEmail";
    import EmailDetailAddAddress from "./component/email-detail-add-address";
    import OrderUtils from "../order/order-utils";
    import EmailDetailContent from "./component/email-detail-content";

    export default {
        components: {EmailDetailContent, EditEmail, EmailDetailAddAddress},
        data() {
            return {
                data: {},
                module_id: '',
                module_name: '',
                subsystem: '',

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                listDataSelection: [],

                loading: false,

                editEmailShow: false,
                emailTemplate: {},

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
                if (this.$route.query.data) {
                    this.data = JSON.parse(decodeURIComponent(decodeURIComponent(this.$route.query.data)));
                }
                this.module_id = this.$route.query.module_id || '';
                this.module_name = this.$route.query.module_name || '';
                this.subsystem = this.$route.query.subsystem || '';

                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_v3_mail_module,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        module_id: self.module_id.toString(),
                        module_name: self.module_name,
                        subsystem: self.subsystem,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            for (let i = 0; i < data.msg.items.length; i++) {
                                self.$store.state.all_internal_users.forEach((item) => {
                                    if (data.msg.items[i].assign_user_id == item.id) {
                                        data.msg.items[i].assignUserId = data.msg.items[i].assign_user_id;
                                    }
                                })
                                data.msg.items[i].addLogShow = false;
                                data.msg.items[i].addLogContent = '';
                            }
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            //回复邮件
            clickReply(row) {
                this.emailTemplate = {
                    mail_to: [row.mail_from],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: 'Re: ' + row.message_subject,
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: row.message_body_html,
                    assign_user_id: row.assign_user_id,

                    isReply: true,
                    create_time: row.create_time,
                    repay_from_id: row.repay_from_id,
                };
                this.editEmailShow = true;
            },
            //转发
            clickForward(row) {
                this.getFileListData(row, (fileList) => {
                    this.copyEmailFile(fileList, (fileListNew) => {
                        this.emailTemplate = {
                            mail_to: [],
                            mail_cc: [],
                            mail_bcc: [],
                            message_subject: 'Fw: ' + row.message_subject,
                            mail_from: '',
                            updateFiles: fileListNew || [],
                            message_body_html: row.message_body_html,
                            assign_user_id: row.assign_user_id,

                            isForward: true,
                            create_time: row.create_time,
                            forward_from_id: row.id,

                            forwardData: {
                                mail_from: row.mail_from,
                                mail_to: row.mail_to,
                                mail_cc: row.mail_cc,
                                message_subject: row.message_subject,
                            }
                        };
                        this.editEmailShow = true;
                    });
                })
            },
            updateEmaiData(row, api, data, type, callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + api + '/' + row.id,
                    type: type || 'PUT',
                    requestBody: true,
                    data: {
                        messageId: row.id,
                        ...data || {}
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            if (callback) {
                                callback();
                            } else {
                                self.getListData();
                            }
                        }
                    }
                })
            },
            getFileListData(row, callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    data: {
                        module_id: row.id,
                        module_name: 'message',
                        subsystem: 'message',
                    },
                    success: function (data) {
                        self.loading = false;
                        let fileList = [];
                        if (data.err_code.length === 0 && data.msg && data.msg.items) {
                            fileList = data.msg.items;
                        }
                        callback && callback(fileList)
                    }, error() {
                        callback && callback([])
                    }
                })
            },
            copyEmailFile(fileList, callback) {
                let self = this;
                if (!fileList || fileList.length === 0) {
                    callback && callback(fileList);
                    return;
                }
                let relation_ids = [];
                fileList.forEach((item) => {
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
                            fileList = data.msg.items;
                        }
                        callback && callback(fileList);
                    }, error() {
                        callback && callback(fileList);
                    }
                });
            },

            clickSaveAddLogs(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_v3 + '/deal_log/' + row.id,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        content: row.addLogContent,
                        messageId: row.id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.result) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            row.addLogShow = false;
                            row.addLogContent = '';
                            self.getListData();
                        }
                    }
                })
            },


            clickWriteEmail() {
                this.emailTemplate = {
                    mail_to: [],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: '',
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: '',

                    isAdd: true,
                };
                this.editEmailShow = true;
            },

            goToOrder() {
                OrderUtils.goToOrderDetail(this.data.orderName)
            },
            tableRowClassName({row}) {
                if (!row.message_deal) {
                    return 'row-bolder';
                }
                return '';
            },
            rowClick(row) {
                console.log(row)
                this.$refs.table.toggleRowExpansion(row)
            },
        }
    }
</script>

<style lang="scss">
    .row-bolder {
        color: #333333;
        font-weight: bolder;
    }

    .related-email-list {
        .el-table,
        .el-table__body-wrapper,
        .el-table .cell{
            overflow: initial;
        }

        .email-detail {
            border: 2px solid #F5A623;
            padding: 20px;

            .detail-base-body {
                .title {
                    padding: 5px 0 15px;
                }

                .info {
                    padding-bottom: 10px;

                    p {
                        margin-bottom: 5px;
                        font-size: 12px;
                        line-height: 20px;

                        & > span:first-child {
                            display: inline-block;
                            min-width: 70px;
                            vertical-align: top;
                        }
                    }
                }

                .email-log {
                    background: #dde7f9;
                    padding: 8px;
                    margin-bottom: 20px;
                    font-size: 12px;
                    box-sizing: border-box;

                    table {
                        margin-top: 8px;
                        width: 100%;
                        border-collapse: collapse;

                        td {
                            background-color: #ffffff;
                            line-height: 20px;
                            padding: 4px 8px;
                            border-bottom: 1px solid #dde7f9;
                        }
                    }
                }

                .email-content {
                    line-height: 1.2em;
                    position: relative;
                    min-height: 100px;
                    overflow: auto;
                    p {
                        margin: 15px 0;
                    }

                    a {
                        color: blue;
                        text-decoration: underline;
                    }

                    pre {
                        white-space: inherit;
                    }
                }
            }
        }
    }
</style>
