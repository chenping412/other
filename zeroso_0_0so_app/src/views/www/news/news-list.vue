<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>官网 / 新闻管理</el-breadcrumb-item>
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
                    <el-button type="primary" @click="openDetail()">新建新闻</el-button>
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
                    <el-table-column label="新闻图片" width="180px">
                        <template slot-scope="scope">
                            <img v-if="scope.row.images && scope.row.images.length>0"
                                style="width: 100px; height: 60px; object-fit: contain;"
                                :src="scope.row.images[0]"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="title"></el-table-column>
                    <el-table-column label="摘自" prop="quoted_from"></el-table-column>
                    <el-table-column label="原始链接" prop="origin_url"></el-table-column>
                    <el-table-column label="状态" prop="state" width="150px">
                        <template slot-scope="scope">
                            <WwwNewsState :state="scope.row.state"></WwwNewsState>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" prop="state" width="150px">
                        <template slot-scope="scope">
                            {{scope.row.type | wwwNewsType}}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="180px">
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
                        "field_name": "state",
                        "type": "selection",
                        "translate": "状态",
                        "selections":[]
                    },{
                        "field_name": "type",
                        "type": "selection",
                        "translate": "类型",
                        "selections":[]
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
                        this.$store.state.wwwNewsState.forEach((item) => {
                            this.allowFilterFieldsFast[i].selections.push([
                                item.code,
                                item.label
                            ])
                        });
                    }else if (this.allowFilterFieldsFast[i].field_name === 'type') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.wwwNewsType.forEach((item) => {
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
                    url: self.$api.www_0_news_list,
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
                    id: row && row.id ? row.id : undefined,
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
