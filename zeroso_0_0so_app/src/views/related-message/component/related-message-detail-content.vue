<template>
    <div class="related-message-detail" v-loading="loading">
        <div>
            <h3 class="padding-bottom-10" v-if="!headerHidden">
                <template v-if="orderName">
                    <span>订单号：</span>
                    <router-link class="blue" :to="'/order/order/all/detail?id='+orderDetail.order_id">
                        {{orderName}}
                    </router-link>
                    <template v-if="orderDetail.brand">
                        <span class="margin-left-20">品牌：</span>
                        <router-link class="blue"
                                     :to="'/product/brand/detail?id='+orderDetail.brand.id">
                            {{orderDetail.brand.name}}
                        </router-link>
                    </template>
                </template>
                <template v-if="inquiryQuotationId">
                    <span>询报价单号：</span>
                    <router-link class="blue"
                                 :to="isBSystem ? '/inquiry-price/all/detail?id='+inquiryQuotationId : '/inquiry-quotation/all/detail?id='+inquiryQuotationId">
                        {{inquiryQuotationId}}
                    </router-link>

                    <template v-if="inquiryQuotationDetail.brand && !isBSystem">
                        <span class="margin-left-20">品牌：</span>
                        <router-link class="blue"
                                     :to="'/product/brand/detail?id='+inquiryQuotationDetail.brand.id">
                            {{inquiryQuotationDetail.brand.name}}
                        </router-link>

                        <router-link class="margin-left-20" target="_blank"  :to='{
                                path: "/inquiry-price/all/list",
                                query: {
                                    order_by: encodeURIComponent(JSON.stringify({
                                        "field_name":"CREATE_TIME",
                                        "by":"desc"
                                    })),
                                    filter: encodeURIComponent(JSON.stringify([
                                        ["brandId","=",inquiryQuotationDetail.brand]
                                    ]))
                                }
                            }'>
                            <el-button size="mini">查询该品牌询价单</el-button>
                        </router-link>
                    </template>
                </template>

                <template v-if="inquiryId && !isBSystem">
                    <span>询价单号：</span>
                    <router-link class="blue" :to=" '/inquiry-price/all/detail?id='+inquiryId">
                        {{inquiryId}}
                    </router-link>
                </template>

            </h3>
            <div style="position: relative;">
                <div class="related-message-detail-list" id="related-message-detail-list" :style="{'height':height}">
                    <div class="message-item" v-for="(message,$index) in messageList" :key="$index">
                        <div class="message-item-info">
                            <div @click="fastTo(message.from_user)" v-if="message.from_user"
                                 class="fast-to inline-block">
                                <template v-if="show0soService(message.from_user)">
                                    <span>零搜客服</span>
                                </template>
                                <template v-else>
                                    <span>{{message.from_user.company_name}}</span>,
                                    <span>{{message.from_user.name}}</span>
                                </template>
                                <CompanyType :type="message.from_user.company_type"></CompanyType>
                            </div>
                            <span v-if="message.to_user" class="margin-left-20 margin-right-20 text-secondary">发给</span>
                            <div class="fast-to inline-block" v-if="message.to_user" @click="fastTo(message.to_user)">
                                <template v-if="show0soService(message.to_user)">
                                    <span>零搜客服</span>
                                </template>
                                <template v-else>
                                    <span>{{message.to_user.company_name}}</span>,
                                    <span>{{message.to_user.name}}</span>
                                </template>
                                <CompanyType :type="message.to_user.company_type"></CompanyType>
                            </div>
                            <span class="margin-left-20 text-secondary">{{message.create_time | zerosoCompanyTime}}</span>

                            <span class="margin-left-10" v-if="message.to_user">
                                <span class="blue" v-if="!message.is_read">未读</span>
                                <span class="text-secondary" v-if="message.is_read">已读</span>
                            </span>

                            <div class="inline-block margin-left-20">

                                <template v-if="!isBSystem">
                                    <el-tag size="mini" effect="plain" class="cursor-pointer"
                                            v-if="isSendToMe(message) && !isBSystem"
                                            @click="clickForward(message)">
                                        转发
                                    </el-tag>


                                    <el-tag type="info" size="mini" effect="plain" class="cursor-pointer"
                                            v-if="message.is_deal && showMarkDeal(message)"
                                            @click="updateMessageMarkDeal(message)">
                                        标记为未处理
                                    </el-tag>
                                    <el-tag type="danger" size="mini" effect="plain" class="cursor-pointer"
                                            v-if="!message.is_deal && showMarkDeal(message)"
                                            @click="updateMessageMarkDeal(message)">
                                        标记为已处理
                                    </el-tag>
                                </template>

                                <el-tag type="info" size="mini" effect="plain" class="cursor-pointer"
                                        v-if="!message.book_mark_id"
                                        @click="clickAddTag(message)">
                                    加入书签
                                </el-tag>
                                <template v-if="message.book_mark_id">
                                    <MessageTag :lever="message.mark_level"></MessageTag>
                                    <related-message-detail-delete-tag
                                            :tagId="message.book_mark_id"
                                            @update="init">
                                    </related-message-detail-delete-tag>
                                </template>

                                <div class="inline-block text-secondary" v-if="!isBSystem && message.mark_deal_user">
                                    <span>（ </span>
                                    <span>{{message.mark_deal_user.name}}</span>
                                    <span>标记为</span>
                                    <span v-if="!message.is_deal">未处理</span>
                                    <span v-if="message.is_deal">已处理</span>，
                                    <span>{{message.write_time|zerosoCompanyTime}}</span>
                                    <span> ）</span>
                                </div>

                            </div>
                        </div>

                        <div class="message-file">
                            <FileListShow
                                    :updateFileList.sync="message.fileList"
                                    :module_id="message.id"
                                    module_name="little_message"
                                    subsystem="message"
                                    @update="scrollToBottom">
                            </FileListShow>
                        </div>

                        <div v-if="message.message && message.message !== ''">
                            <span :class="messageItemClassName(message)" v-text="message.message"></span>
                        </div>
                    </div>
                </div>

                <i class="el-icon-refresh-right el-icon-normal cursor-pointer"
                   :class="{'el-icon-loading':loading,'el-icon-refresh-right':!loading}" @click="clickRefresh"></i>
            </div>


            <div class="message-send">
                <div class="padding-10 clearfix">
                    <div class="inline-block margin-right-20 left"
                         v-if="sendToUserList && sendToUserList.length>0 && !isBSystem">
                        <span>发送至：</span>
                        <el-select v-model="sendToUserId" filterable clearable placeholder="非必选，可输入关键词检索人名"
                                   style="width: 300px;">
                            <el-option
                                    v-for="(item,$index) in sendToUserList"
                                    :key="$index"
                                    :value="item.id"
                                    :label="item.company_name + ',' + item.name">
                                <span>{{item.company_name}}</span>
                                <span>，{{item.name}}</span>
                                <CompanyType :type="item.company_type"></CompanyType>
                            </el-option>
                        </el-select>
                    </div>

                    <FileUpload
                            class="message-content-file-upload"
                            ref="messageFileUpload"
                            :selectFileList.sync="sendFileList"
                            :module_id="module_id"
                            subsystem="message"
                            module_name="little_message">
                    </FileUpload>
                </div>
                <el-input ref="sendMessageTextarea" type="textarea" v-model="sendMessage" :rows="6" placeholder="此处可粘贴截图快速上传"></el-input>

                <div class="send-btn">
                    <related-message-detail-template
                            v-if="inquiryQuotationId && !isBSystem"
                            class="margin-right-20"
                            @addMessageText="addMessageText">
                    </related-message-detail-template>

                    <el-button
                            type="primary"
                            :disabled="!sendMessage && sendFileList.length===0"
                            @click="clickSendMessage">
                        发送
                    </el-button>

                    <related-message-detail-send-to-many
                            class="margin-left-20"
                            v-if="sendToUserList && sendToUserList.length>0 && !isBSystem"
                            :sendMessage="sendMessage"
                            :sendFileList="sendFileList"
                            :sendToUserList="sendToUserList"
                            :forwardCompanyIds="forwardCompanyIds"
                            :sendBrandId="sendBrandId"
                            :module_id="module_id"
                            :module_name="module_name"
                            :subsystem="subsystem"
                            @update="clearSendMessageText()">
                    </related-message-detail-send-to-many>
                </div>

            </div>

        </div>

        <related-message-detail-forward
                :forwardCompanyIds="forwardCompanyIds"
                ref="relatedMessageDetailForward">
        </related-message-detail-forward>

        <related-message-detail-add-tag
                :markType="1"
                ref="relatedMessageDetailAddTag"
                @update="init">
        </related-message-detail-add-tag>

    </div>
</template>

<script>
    import RelatedMessageDetailForward from "./related-message-detail-forward";
    import RelatedMessageDetailAddTag from "./related-message-detail-add-tag";
    import RelatedMessageDetailDeleteTag from "./related-message-detail-delete-tag";
    import RelatedMessageDetailSendToMany from "./related-message-detail-send-to-many";
    import RelatedMessageDetailTemplate from "./related-message-detail-template";

    export default {
        components: {
            RelatedMessageDetailTemplate,
            RelatedMessageDetailSendToMany,
            RelatedMessageDetailDeleteTag, RelatedMessageDetailAddTag, RelatedMessageDetailForward
        },
        props:['orderName','inquiryQuotationId','inquiryId','sendBrandId','module_id','module_name','subsystem','headerHidden','height'],
        data() {
            return {
                loading: false,
                messageList: [],

                sendFileList: [],
                sendToUserList: [],
                sendToUserId: '',
                sendMessage: '',

                orderDetail: {},
                inquiryQuotationDetail: {},

                forwardCompanyIds: [],

                isBSystem: this.$store.state.system === 'B',

            }
        },
        computed: {
            sendToCompanyId() {
                let companyId = null;
                for (let i = 0; i < this.sendToUserList.length; i++) {
                    if (this.sendToUserList[i].id === this.sendToUserId) {
                        companyId = this.sendToUserList[i].account_company_id;
                    }
                }
                return companyId
            }
        },
        watch: {
            'orderName'() {
                this.init()
            },
            'module_id'() {
                this.init()
            },
        },
        mounted() {
            this.init();
            this.bindClipboardEvent();
        },
        methods: {
            init() {
                let self = this;
                if (self.orderName) {
                    self.getOrderMessageList();
                } else {
                    this.getRelationMessageList();
                }
            },
            getMessageInit(){
                this.init();
            },

            getRelationMessageList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_v4_message_relation,
                    data: {
                        module_id: self.module_id,
                        module_name: self.module_name,
                        subsystem: self.subsystem,
                        is_from_0: !self.isBSystem || undefined
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.messageList = data.msg.items;
                            self.autoMarkRead();
                            self.scrollToBottom();

                            if (self.inquiryQuotationId) {
                                if (self.isBSystem) {
                                    let last0soUser=null;
                                    self.messageList.forEach((message) => {
                                        if (!message.is_deal && !!self.isSendToMe(message)) {
                                            self.updateMessageMarkDeal(message);
                                        }
                                        if([39567,9428].indexOf(message.from_user.account_company_id)>-1){
                                            last0soUser = message.from_user
                                        }
                                    });
                                    if(last0soUser){
                                        self.fastTo(last0soUser)
                                    }else {
                                        self.get0soService({
                                            // brand_id: self.sendBrandId || undefined //去掉参数，不查品牌跟进人
                                        })
                                    }
                                } else {
                                    self.getInquiryQuotationDetail();
                                }
                            }else if (self.inquiryId) {
                                self.getSendToUserList({
                                    // company_ids: self.$store.state.currentCompany.account_company_id
                                    company_ids: '9428,39567'
                                })
                            }
                            self.$emit("update")
                        }
                    }
                })
            },

            getOrderMessageList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_v4_message_order + '/' + self.orderName,
                    data: {
                        is_from_0: !self.isBSystem || undefined
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.messageList = data.msg.items;
                            self.orderDetail = data.msg.order;
                            self.sendBrandId = data.msg.order.brand.id;
                            self.autoMarkRead();
                            self.scrollToBottom();

                            if (self.isBSystem) {
                                //当B系统订单模块时，先查看是否有零搜员工回复消息，默认回复最后一条，否则：先查询零搜供应链自己的跟进人，如果没有的话，就查询供应链中对联营公司的跟进人
                                let last0soUser=null;
                                self.messageList.forEach((message) => {
                                    if (!message.is_deal && !!self.isSendToMe(message)) {
                                        self.updateMessageMarkDeal(message);
                                    }
                                    if([39567,9428].indexOf(message.from_user.account_company_id)>-1){
                                        last0soUser = message.from_user
                                    }
                                });
                                if(last0soUser){
                                    self.fastTo(last0soUser)
                                }else {
                                    self.get0soService({
                                        account_company_id: 39567
                                    }, (data) => {
                                        if (!data.msg || !data.msg.follower_id) {
                                            self.get0soService();
                                        }
                                    });
                                }
                            } else {
                                self.getSendToUserList({
                                    order_name: self.orderName
                                }, () => {
                                    self.forwardCompanyIds = [];
                                    self.sendToUserList.forEach((item) => {
                                        if (self.forwardCompanyIds.indexOf(item.account_company_id) === -1) {
                                            self.forwardCompanyIds.push(item.account_company_id)
                                        }
                                    });
                                });
                            }
                            self.$emit("update")
                        }
                    }
                })
            },

            getSendToUserList(param, callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v4_self_multi_users,
                    data: param,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.sendToUserList = data.msg;
                        }
                        if (callback) callback()
                    }
                })
            },

            //B系统获取零搜客服方法
            get0soService(param, callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.$store.state.currentCompany.account_company_id + '/get_account_company_follower_by_id',
                    data: {
                        belong_to_company_id: 39567,
                        account_company_id: self.$store.state.currentCompany.account_company_id,
                        ...param
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.follower_id) {
                            self.sendToUserList = [{
                                id: data.msg.follower_id,
                                name: data.msg.follower_name,
                                account_company_id: data.msg.account_company_id,
                                company_name: data.msg.account_company_name,
                                company_type: 'internal'
                            }];
                            self.sendToUserId = self.sendToUserList[0].id;
                        }
                        if (callback) callback(data);
                    }
                })
            },

            getInquiryQuotationDetail() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.inquiryQuotationId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        self.inquiryQuotationDetail = data;
                        if (data.reseller && data.reseller.company && data.reseller.company.account_company_id) {
                            self.forwardCompanyIds = [data.reseller.company.account_company_id];
                            let company_ids = [9428,39567];
                            company_ids.push(data.reseller.company.account_company_id);
                            self.getSendToUserList({
                                company_ids: company_ids.join(',')
                            }, () => {
                                if (data.reseller.user) {
                                    self.fastTo({
                                        account_company_id: data.reseller.company.account_company_id,
                                        company_name: data.reseller.company.company_name,
                                        company_type: data.reseller.company.company_type,
                                        account_user_id: data.reseller.user.account_user_id,
                                        name: data.reseller.user.name,
                                    })
                                }
                            })
                        }
                    }
                })
            },

            scrollToBottom() {
                this.$nextTick(() => {
                    document.getElementById('related-message-detail-list').scrollTop = 1000000000;
                })
            },


            fastTo(user) {
                let sendToUserId = null;
                for (let i = 0; i < this.sendToUserList.length; i++) {
                    if (this.sendToUserList[i].id === user.account_user_id) {
                        sendToUserId = user.account_user_id;
                    }
                }
                if (sendToUserId) {
                    this.sendToUserId = sendToUserId;
                    this.scrollToBottom();
                } else {
                    this.sendToUserList.push({
                        account_company_id: user.account_company_id,
                        company_name: user.company_name,
                        company_type: user.company_type,
                        id: user.account_user_id,
                        name: user.name,
                    });
                    this.sendToUserId = user.account_user_id;
                    this.scrollToBottom();
                }
            },

            clickSendMessage(param,callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_v4_message,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        "module_id": self.module_id,
                        "module_name": self.module_name,
                        "subsystem": self.subsystem,
                        "from_company_id": self.$store.state.currentCompany.account_company_id,
                        "from_user_id": self.$store.state.currentCompany.user_id,
                        "message": param.message || self.sendMessage,
                        "to_user_id": param.to_user_id || self.sendToUserId || undefined,
                        "to_company_id": param.to_company_id || self.sendToCompanyId || undefined,
                        "brand_id": self.sendBrandId || undefined,
                    },
                    success(data) {
                        self.sendMessage = '';
                        if (data.msg && data.msg.id && self.sendFileList && self.sendFileList.length>0) {
                            self.$refs.messageFileUpload.submitUpload(data.msg.id, () => {
                                self.loading = false;
                                self.getMessageInit();
                                self.$refs.messageFileUpload.clearFiles();
                            });
                        }else {
                            self.loading = false;
                            self.getMessageInit();
                        }
                        if(callback) callback(data)
                    },error(){
                        self.loading = false;
                        self.sendMessage = '';
                        self.getMessageInit();
                    }
                })
            },


            clearSendMessageText(){
                this.sendMessage = '';
                this.$refs.messageFileUpload.clearFiles();
                this.getMessageInit();
            },

            clickRefresh() {
                this.loading = true;
                setTimeout(() => {
                    this.getMessageInit();
                }, 200)
            },

            addMessageText(message){
                if(this.sendMessage){
                    this.sendMessage += '\n' + message;
                }else {
                    this.sendMessage = message;
                }
            },

            //标记已处理、未处理
            updateMessageMarkDeal(message) {
                let self = this;
                self.$http({
                    url: self.$api.message_v4_message_mark_deal + '/' + message.id,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        deal: !message.is_deal,
                        id: message.id,
                    },
                    success() {
                        self.getMessageInit();
                    }
                })
            },

            //检测并且处理已读
            autoMarkRead() {
                let self = this;
                let ids=[];
                self.messageList.forEach((message)=>{
                    if(self.isSendToMe(message) && !message.is_read){
                        ids.push(message.id)
                    }
                });
                if(ids.length>0){
                    self.$http({
                        url: self.$api.message_v4_message_mark_read,
                        type: 'PUT',
                        requestBody: true,
                        data: {
                            message_ids: ids,
                        },
                        success() {
                            self.getMessageInit();
                        }
                    })
                }
            },


            //点击转发
            clickForward(message) {
                this.$refs.relatedMessageDetailForward.forwardMessage({
                    oldMessage: message.from_user.company_name + '，' +
                            message.from_user.name + '：\n' +
                            message.message,
                    oldId:message.id
                })
            },

            //点击加入书签
            clickAddTag(message) {
                this.$refs.relatedMessageDetailAddTag.messageAddTag(message)
            },






            isSendToMe(message) {
                return !!(message.to_user && message.to_user.account_user_id === this.$store.state.currentCompany.user_id)
            },
            showMarkDeal(message) {
                if (this.$store.state.zerosoCompany[this.$store.state.currentCompany.account_company_id]) {
                    //当前公司为零搜集团旗下公司时，可以标记集团其他人接收到的消息
                    return !!(message.to_user && this.$store.state.zerosoCompany[message.to_user.account_company_id])
                } else {
                    //当前公司为非零搜集团时，只能标记自己公司的消息
                    return !!(message.to_user && message.to_user.account_company_id === this.$store.state.currentCompany.account_company_id)
                }
            },

            show0soService(user) {
                return !!(this.isBSystem && (user.account_company_id === 39567 || user.account_company_id === 9428))
            },


            messageItemClassName(message) {
                if (message.from_user.account_user_id === this.$store.state.currentCompany.user_id) {
                    return "message-tag message-purple";
                }
                return "message-tag message-green";
            },


            bindClipboardEvent(){
                let self=this;
                this.$refs.sendMessageTextarea.$el.onpaste= function (event) {
                    if (event.clipboardData || event.originalEvent) {
                        let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
                        if(clipboardData.items){
                            var  items = clipboardData.items,
                                    len = items.length,
                                    blob = null;
                            for (var i = 0; i < len; i++) {
                                if (items[i].kind === 'file') {
                                    blob = items[i].getAsFile();
                                }
                            }
                            console.log('剪切板file',blob);
                            if(blob){
                                let nameArr = blob.name.split('.');
                                let fileName=nameArr[0] + blob.size + '.' + nameArr[nameArr.length-1];
                                let blobCopy = new File([blob], fileName, {type: blob.type});
                                let file = {
                                    name: blobCopy.name,
                                    percentage: 0,
                                    raw: blobCopy,
                                    size: blobCopy.size,
                                    status: "ready",
                                    uid: blobCopy.lastModified,
                                };
                                self.sendFileList.push(file);
                                self.$refs.messageFileUpload.fileChange(file,self.sendFileList)
                            }
                        }
                    }
                }
            },

        },
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";

    .related-message-detail {
        .related-message-detail-list {
            height: 480px;
            padding: 20px;
            overflow-y: auto;
            border: 1px solid #c5c5c5;
            border-radius: 5px;
            position: relative;

            .message-item {
                margin-bottom: 20px;

                .message-item-info {
                    margin-bottom: 5px;

                    .fast-to {
                        cursor: pointer;

                        &:hover {
                            color: $color-link;
                        }
                    }
                }

                .message-file {
                    margin-bottom: 5px;
                    max-width: 70%;
                }

                .message-tag {
                    display: inline-block;
                    max-width: 70%;
                    padding: 8px 10px;
                    color: #f5f5f5;
                    border-radius: 5px;
                    background-color: #999999;
                    white-space: pre-wrap;
                }

                .message-purple {
                    background-color: #755092 !important;
                }

                .message-green {
                    background-color: #468627 !important;
                }

                .message-blue {
                    background-color: #00a0f0 !important;
                }

                .message-dark-gray {
                    background-color: #999 !important;
                }
            }

        }

        .el-icon-refresh-right {
            position: absolute;
            left: 10px;
            bottom: 10px;
        }

        .message-send {
            position: relative;

            .send-btn {
                position: absolute;
                right: 20px;
                bottom: 10px;
            }
        }

        .message-content-file-upload{
            float: left;
            display: block;
            width: calc(100% - 380px);
            max-width: 100%;
            .el-upload{
                vertical-align: top;
                float: left;
                margin-right: 10px;
            }
            .el-upload-list{
                float: left;
                vertical-align: top;
                .el-upload-list__item{
                    float: left;
                    margin-top: 0;
                    width: auto;
                    .el-upload-list__item-name{
                        margin-right: 30px;
                    }
                }
            }
        }
    }
</style>
