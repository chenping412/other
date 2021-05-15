<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心 / 品牌</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    ref="controlSearch"
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="openDetail()">新增品牌</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="name" label="品牌名"></el-table-column>
                    <el-table-column prop="chinese_name" label="中文名"></el-table-column>
                    <el-table-column label="国家">
                        <template slot-scope="scope">
                            <span>{{scope.row.country | country}}</span>
                            <isEuCountry :country="scope.row.country"></isEuCountry>
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌等级">
                        <template slot-scope="scope">
                            <BrandLever :state="scope.row.state"></BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column label="制造商">
                        <template slot-scope="scope">
                            <router-link
                                    @click.native.stop=""
                                    v-if="scope.row.manufactruer_company"
                                    :to="'/partner/detail?id='+scope.row.manufactruer_company.account_company_id">
                                {{scope.row.manufactruer_company.company_name}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="官网">
                        <template slot-scope="scope">
                            <a :href="scope.row.website" target="_blank" @click.stop="">{{scope.row.website}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进人">
                        <template slot-scope="scope" v-if="scope.row.follower">
                            {{scope.row.follower.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="发布状态">
                        <template slot-scope="scope">
                            <BrandPublishState :state="scope.row.publish_state"></BrandPublishState>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布人">
                        <template slot-scope="scope" v-if="scope.row.publisher">
                            {{scope.row.publisher.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态">
                        <template slot-scope="scope">
                            <BrandAuditState :state="scope.row.audit_state"></BrandAuditState>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核人">
                        <template slot-scope="scope" v-if="scope.row.auditor">
                            {{scope.row.auditor.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.create_time | zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "name",
                        "type": "string",
                        "translate": "品牌",
                    }, {
                        "field_name": "country",
                        "type": "country",
                        "translate": "国家",
                    }, {
                        "field_name": "state",
                        "type": "selection",
                        "translate": "品牌等级",
                    }, {
                        "field_name": "manufactruer_id",
                        "type": "partner",
                        "translate": "制造商",
                    },{
                        "field_name": "follower_id",
                        "type": "login_user",
                        "translate": "跟进人",
                    },{
                        "field_name": "publish_state",
                        "type": "selection",
                        "translate": "发布状态",
                    },{
                        "field_name": "publisher_id",
                        "type": "login_user",
                        "translate": "发布人",
                    },{
                        "field_name": "audit_state",
                        "type": "selection",
                        "translate": "审核状态",
                    },{
                        "field_name": "auditor_id",
                        "type": "login_user",
                        "translate": "审核人",
                    },
                ],
                allowFilterFieldsMore: [],

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

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
        mounted() {
            this.setControlSearch();
        },
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },
            setControlSearch() {
                for (let i = 0; i < this.allowFilterFieldsFast.length; i++) {
                    if (this.allowFilterFieldsFast[i].field_name === 'state') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.brandLever2.forEach((item) => {
                            this.allowFilterFieldsFast[i].selections.push([
                                item.code,
                                item.label
                            ])
                        });
                    }else if (this.allowFilterFieldsFast[i].field_name === 'publish_state') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.newBrandPublishState.forEach((item) => {
                            this.allowFilterFieldsFast[i].selections.push([
                                item.code,
                                item.label
                            ])
                        });
                    }else if (this.allowFilterFieldsFast[i].field_name === 'audit_state') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.newBrandAuditState.forEach((item) => {
                            this.allowFilterFieldsFast[i].selections.push([
                                item.code,
                                item.label
                            ])
                        });
                    }
                }
                this.$refs.controlSearch.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore)
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand_list,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        ...self.$utils.formatSearchFilterV6(self.filter),
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
                let query = {
                    id: row && row.uid ? row.uid : undefined,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },

        }
    }
</script>

<style>

</style>
