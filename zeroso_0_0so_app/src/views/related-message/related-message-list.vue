<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>消息</el-breadcrumb-item>
                    <el-breadcrumb-item>{{breadNameList[messageType]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    :filterKey="'message_message_'+messageType"
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    :partner_is_company_user="true"
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
                <el-table-column width="100px">
                    <template slot-scope="scope" v-if="!scope.row.is_deal">
                        <el-tag type="danger" effect="dark" size="mini">{{scope.row.message_count}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="关联单号" width="180">
                    <template slot-scope="scope">
                        <div v-if="scope.row.module_name==='order'">
                            <span>订单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                        <div v-if="scope.row.module_name==='quote' || scope.row.module_name==='quote_inquiry'">
                            <span>询报价单：{{scope.row.module_id | defaultStr}}</span>
                        </div>
                        <div v-if="scope.row.module_name==='inquiry_pool'">
                            <span>询价单：{{scope.row.module_id | defaultStr}}</span>
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
                         <span :class="zerosoMessageOverTime(scope.row.create_time)">
                             {{scope.row.create_time | zerosoCompanyTime | defaultStr}}
                         </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>

    import Vue from "vue";

    export default {
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "deal",
                        "type": "selection",
                        "translate": "处理状态",
                        "selections": [
                            ["NONE", "全部"],
                            ["YES", "已处理"],
                            ["NO", "未处理"]
                        ]
                    },
                    {
                        "field_name": "module_name",
                        "type": "selection",
                        "translate": "关联单据类型",
                        "selections": this.$store.state.system === '0' ? [
                            ["无", "所有"],
                            ["quote", "询报价单"],
                            ["order", "订单"],
                            ["inquiry_pool", "询价单"]
                        ] : [
                            ["无", "所有"],
                            ["quote", "询报价单"],
                            ["order", "订单"]
                        ]
                    },
                    {
                        "field_name": "module_id",
                        "type": "string",
                        "translate": "关联单据号",
                    },
                    {
                        "field_name": "brand_id",
                        "type": "brand",
                        "translate": "品牌",
                    },
                    {
                        "field_name": "from_user",
                        "type": this.$store.state.system === '0' ? "partner" : 'user',
                        "translate": "发送人",
                    },
                    {
                        "field_name": "to_user",
                        "type": this.$store.state.system === '0' ? "partner" : 'user',
                        "translate": "接收人",
                    },
                    {
                        "field_name": "message",
                        "type": "string",
                        "translate": "消息内容",
                    },
                    {
                        "field_name": "create_time",
                        "type": "datetime",
                        "translate": "创建时间",
                    },
                ],
                allowFilterFieldsMore: [],


                messageType: null,
                searchListUrl: this.$api.message_v4_message_search_filter,
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
                this.messageType = this.$route.params.messageType;
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
                let requestFilter = self.$utils.formatSearchFilter(self.filter);
                if (self.$store.state.system === '0') {
                    if (requestFilter) {
                        requestFilter.push(['is_from_0', '=', true]);
                    } else {
                        requestFilter = [['is_from_0', '=', true]]
                    }
                }
                self.$http({
                    url: self.searchListUrl,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: requestFilter,
                        key: "message_message_" + self.messageType
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

            zerosoMessageOverTime(value) {
                let zerosoCompanyTime = Vue.filter('zerosoCompanyTime');
                const messageTime = new Date(zerosoCompanyTime(value)).getTime();
                if (Number(new Date().getTime() - messageTime) > 86400000) {
                    return `red`;
                } else {
                    return null
                }
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
