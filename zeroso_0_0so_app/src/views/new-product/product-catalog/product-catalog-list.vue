<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心 / 产品目录管理</el-breadcrumb-item>
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
                    <el-button type="primary" @click="openDetail()">新增产品目录</el-button>
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
                    <el-table-column label="品牌">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商" width="300px">
                        <template slot-scope="scope" v-if="scope.row.supplier_company">
                            <span>{{scope.row.supplier_company.company_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="获取时间" prop="acquired_date"></el-table-column>
                    <el-table-column label="创建人">
                        <template slot-scope="scope" v-if="scope.row.creator">
                            {{scope.row.creator.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="制表人">
                        <template slot-scope="scope" v-if="scope.row.tabulator">
                            {{scope.row.tabulator.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="校对人">
                        <template slot-scope="scope" v-if="scope.row.collator">
                            {{scope.row.collator.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="审核人">
                        <template slot-scope="scope" v-if="scope.row.auditor">
                            {{scope.row.auditor.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <NewProductProductCatalogState :state="scope.row.state"></NewProductProductCatalogState>
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
                        "field_name": "brand_uid",
                        "type": "new_brand",
                        "translate": "品牌",
                    }, {
                        "field_name": "supplier_id",
                        "type": "partner",
                        "translate": "供应商",
                    }, {
                        "field_name": "creator_id",
                        "type": "login_user",
                        "translate": "创建人",
                    }, {
                        "field_name": "tabulator_id",
                        "type": "login_user",
                        "translate": "制表人",
                    },{
                        "field_name": "collator_id",
                        "type": "login_user",
                        "translate": "校对人",
                    },{
                        "field_name": "auditor_id",
                        "type": "login_user",
                        "translate": "审核人",
                    },{
                        "field_name": "state",
                        "type": "selection",
                        "translate": "状态",
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
                        this.$store.state.newProductProductCatalogState.forEach((item) => {
                            this.allowFilterFieldsFast[i].selections.push([
                                item.code,
                                item.label
                            ])
                        });
                        break
                    }
                }
                this.$refs.controlSearch.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore)
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_catalog_list,
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
