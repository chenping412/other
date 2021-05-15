<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>官网 / 标签管理</el-breadcrumb-item>
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
                    <el-table-column label="标签名称" prop="name"></el-table-column>
                    <el-table-column label="父标签名称">
                        <template slot-scope="scope" v-if="scope.row.parent">
                            {{scope.row.parent.name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="state">
                        <template slot-scope="scope">
                            <NewProductTagsState :state="scope.row.state"></NewProductTagsState>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布人">
                        <template slot-scope="scope" v-if="scope.row.publisher">
                            {{scope.row.publisher.nick_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="发布时间">
                        <template slot-scope="scope">
                            {{scope.row.publish_time | zerosoCompanyTime}}
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
                        "translate": "标签名称",
                    },{
                        "field_name": "state",
                        "type": "selection",
                        "translate": "状态",
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
                        this.$store.state.newProductTagsState.forEach((item) => {
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
                    url: self.$api.new_product_basic_product_label_normal_list,
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
