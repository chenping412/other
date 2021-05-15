<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>邮件 / {{breadNameList[boxType]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="filterKey" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="clickWriteEmail()">写邮件</el-button>

<!--                     <el-button type="warning" plain :disabled="tableSelectionList.length===0" @click="deleteRows(0)">删除</el-button>-->
<!--                     <el-button type="danger" plain :disabled="tableSelectionList.length===0" @click="deleteRows(1)">彻底删除</el-button>-->
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>


        <div class="container-content flex-item-scroll" v-loading="loading">
            <div class="container-table">
            <el-table :data="listData" @row-click="openDetail" @selection-change="tableSelectionChange" :row-class-name="tableRowClassName" border>
<!--                 <el-table-column type="selection" width="55"></el-table-column>-->
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column width="60px" label="书签">
                    <template slot-scope="scope">
                        <MessageTag :lever="scope.row.mark_level"></MessageTag>
                    </template>
                </el-table-column>
                <el-table-column prop="mail_from" label="发件人">
                    <template slot-scope="scope">
                    <p v-if="scope.row.partner_company_from">
                        {{scope.row.partner_company_from.company_name + '，' + scope.row.partner_company_from.name}}
                    </p>
                    <p v-else>{{scope.row.mail_from}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="收件人">
                    <template slot-scope="scope">
                        <p v-if="scope.row.partner_company_to">
                            {{scope.row.partner_company_to.company_name + '，' + scope.row.partner_company_to.name}}
                        </p>
                        <p v-else v-for="(item,$index) in scope.row.mail_to" :key="$index">{{item}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="附件" width="60">
                    <template slot-scope="scope">
                        <i class="el-icon-paperclip el-icon-normal" v-if="scope.row.message_attachment"></i>
                    </template>
                </el-table-column>

                <el-table-column label="主题">
                    <template slot-scope="scope">
                        <p class="nowrap" :title="scope.row.message_subject">{{scope.row.message_subject}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="跟进人" width="120">
                    <template slot-scope="scope" v-if="scope.row.assign_user">
                        {{scope.row.assign_user.name | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="关联单" width="180">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module_name==='order' && scope.row.order">
                            <span>订单：{{scope.row.module_id}}</span>
                            <orderInquiryPriority :state="scope.row.order.inquiry_priority"></orderInquiryPriority>
                        </div>
                        <p v-if="scope.row.module_name==='inquiry_pool' && scope.row.module_id">询价单：{{scope.row.module_id}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <EmailState :state="scope.row.state"></EmailState>
                    </template>
                </el-table-column>

                <el-table-column width="150">
                    <template slot="header">
                        <span v-if="boxType==='tag'">创建时间</span>
                        <ButtonSort v-else label="创建时间" field_name="create_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.create_time | zerosoCompanyTime}}</p>
                    </template>
                </el-table-column>

                <el-table-column width="150">
                    <template slot="header">
                        <span v-if="boxType==='tag'">最后操作时间</span>
                        <ButtonSort v-else label="最后操作时间" field_name="last_update_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        <p>{{scope.row.last_update_time | zerosoCompanyTime | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-tag type="info" size="mini" effect="plain" class="cursor-pointer"
                                v-if="!scope.row.book_mark_id"
                                @click.native.stop="clickAddTag(scope.row)">
                            加入书签
                        </el-tag>

                        <related-message-detail-delete-tag
                                v-if="scope.row.book_mark_id"
                                :tagId="scope.row.book_mark_id"
                                @update="getListData">
                        </related-message-detail-delete-tag>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        </div>

        <edit-email :show.sync="editEmailShow" :emailTemplate="emailTemplate"></edit-email>

        <related-message-detail-add-tag
                :markType="2"
                ref="relatedMessageDetailAddTag"
                @update="init">
        </related-message-detail-add-tag>
    </div>
</template>

<script>

    import EditEmail from "./editEmail";
    import RelatedMessageDetailAddTag from "../related-email-message/related-message-detail-add-tag";
    import RelatedMessageDetailDeleteTag from "../related-email-message/related-message-detail-delete-tag";
    export default {
        components: {RelatedMessageDetailDeleteTag, RelatedMessageDetailAddTag, EditEmail},
        data() {
            return {
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

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                tableSelectionList:[],

                loading: false,

                editEmailShow:false,
                emailTemplate:{},
            }
        },
        watch: {
            '$route'() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.boxType = this.$route.params.boxType;
                if(this.boxType==='tag'){
                    this.listApi=this.$api.message_book_mark_mails_search;
                    this.filterKey= undefined;
                }else {
                    this.listApi=this.$api.message_mail_search_filter_v3 + '/' + this.boxType;
                    this.filterKey='message_mail_' + this.boxType;
                }



                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                if(self.getListHttpRequest) self.getListHttpRequest.abort();
                self.loading = true;
                self.getListHttpRequest = self.$http({
                    url: self.listApi,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        box: self.boxType==='tag' ? undefined : self.boxType,
                        key: self.filterKey
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },


            tableSelectionChange(val) {
                this.tableSelectionList = [];
                val.forEach((item)=>{
                    this.tableSelectionList.push(item.id)
                });
                console.log(this.tableSelectionList)
            },
            
            deleteRows(strict){
                let self = this;
                self.$confirm('确定删除该邮件吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.message_mail_v3,
                                type: 'DELETE',
                                data: {
                                    ids: self.tableSelectionList.join(','),
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
                                        self.getListData();
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

            //点击加入书签
            clickAddTag(row) {
                this.$refs.relatedMessageDetailAddTag.emailAddTag(row)
            },

            openDetail(row) {
                let query = {
                    id : row && row.id ? row.id : undefined,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },

            tableRowClassName({row}) {
                if (!row.message_deal) {
                    return 'row-bolder';
                }
                return '';
            },
        }
    }
</script>

<style>
    .row-bolder{
        color: #333333;
        font-weight: bolder;
    }
</style>
