<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>消息书签</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column width="60px" label="书签">
                    <template slot-scope="scope">
                        <MessageTag :lever="scope.row.mark_level"></MessageTag>
                    </template>
                </el-table-column>
                <el-table-column label="关联单号" width="180">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module_name==='order'">
                            <span>订单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                        <div v-if="scope.row.module_name==='quote'">
                            <span>询报价单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                        <div v-if="scope.row.module_name==='inquiry_pool'">
                            <span>询价单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                        <div v-if="scope.row.module_name==='quote_inquiry'">
                            <span>询报价单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="品牌">
                    <template slot-scope="scope" v-if="scope.row.brand">
                        <span>{{scope.row.brand.name | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送人">
                    <template slot-scope="scope" v-if="scope.row.from_user">
                        <span>{{scope.row.from_user.company_name | defaultStr}}</span>
                        <span>，{{scope.row.from_user.name | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="接收人">
                    <template slot-scope="scope" v-if="scope.row.to_user">
                        <span>{{scope.row.to_user.company_name | defaultStr}}</span>
                        <span>，{{scope.row.to_user.name | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="消息" prop="message" width="500px" show-overflow-tooltip></el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="创建时间" field_name="create_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.create_time | zerosoCompanyTime | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-tag type="info" size="mini" effect="plain" class="cursor-pointer"
                                v-if="!scope.row.book_mark_id"
                                @click.native.stop="$refs.relatedMessageDetailAddTag.messageAddTag(scope.row)">
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

        <related-message-detail-add-tag
                :markType="1"
                ref="relatedMessageDetailAddTag"
                @update="getListData">
        </related-message-detail-add-tag>
    </div>
</template>

<script>

    import RelatedMessageDetailDeleteTag from "./component/related-message-detail-delete-tag";
    import RelatedMessageDetailAddTag from "./component/related-message-detail-add-tag";

    export default {
        components: {RelatedMessageDetailAddTag, RelatedMessageDetailDeleteTag},
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "module_name",
                        "type": "selection",
                        "translate": "关联单据类型",
                        "selections": this.$store.state.system === '0' ? [
                            ["", "全部"],
                            ["quote", "询报价单-消息"],
                            ["quote_inquiry", "询报价单-日志"],
                            ["order", "订单"],
                            ["inquiry_pool", "询价单"]
                        ] : [
                            ["", "全部"],
                            ["quote", "询报价单"],
                            ["order", "订单"]
                        ]
                    }, {
                        "field_name": "module_id",
                        "operators": [
                            "="
                        ],
                        "type": "string",
                        "translate": "关联单据单号",
                        "is_hidden": false
                    }, {
                        "field_name": "level",
                        "operators": [
                            "="
                        ],
                        "type": "selection",
                        "translate": "重要级别",
                        "is_hidden": false,
                        "selections": [
                            [
                                "1000",
                                "高"
                            ],
                            [
                                "100",
                                "中"
                            ],
                            [
                                "10",
                                "低"
                            ]
                        ]
                    }

                ],
                allowFilterFieldsMore: [],

                searchListUrl: this.$api.message_book_mark_messages_search,
                breadNameList: {
                    waiting: '待处理',
                },

                filter: {},
                order_by: undefined,

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                listDataSelection: [],

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
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : undefined;
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.searchListUrl,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },


            openDetail(row) {
                let query = null;
                if (row.module_name === 'order') {
                    query = {
                        orderName: row.module_id,
                    }
                } else {
                    query = {
                        module_id: row.module_id,
                        module_name: row.module_name,
                        subsystem: row.subsystem,
                    };
                    if (row.module_name === 'quote' || row.module_name === 'quote_inquiry') {
                        query.inquiryQuotationId = row.module_id;
                    }
                    if (row.module_name === 'inquiry_pool') {
                        query.inquiryId = row.module_id;
                    }
                }
                if (row.brand && row.brand.id) {
                    query.brandId = row.brand.id
                }
                if ((row.module_name === 'quote' || row.module_name === 'quote_inquiry') && this.$store.state.system === '0') {
                    this.$router.push({
                        path: '/inquiry-quotation/ALL/detail',
                        query: {
                            id:row.module_id
                        }
                    });
                }else {
                    this.$router.push({
                        path: '/related/message',
                        query: query
                    });
                }
            },


        }
    }
</script>

<style>

</style>
