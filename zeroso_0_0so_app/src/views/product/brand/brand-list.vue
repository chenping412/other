<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>品牌</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="product_brand" :allow-filter-fields-url="$api.product_common_search_brand"
                           :loginUserShowNull="true" @clickSearch="init()"></ControlSearch>

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
                    <el-table-column prop="name" label="品牌"></el-table-column>
                    <el-table-column prop="country" label="国家">
                        <template slot-scope="scope">
                            <span>{{scope.row.country | country}}</span>
                            <isEuCountry :country="scope.row.country"></isEuCountry>
                        </template>
                    </el-table-column>
                    <el-table-column label="官网">
                        <template slot-scope="scope">
                            <a :href="scope.row.website" target="_blank" @click.stop="">{{scope.row.website}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="等级">
                        <template slot-scope="scope">
                            <BrandLever :state="scope.row.state"></BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column label="产品目录是否完整">
                        <template slot-scope="scope">
                            <el-tag size="mini" effect="dark" type="success" v-if="scope.row.all_products_included">是</el-tag>
                            <el-tag size="mini" effect="dark" type="info" v-if="!scope.row.all_products_included">否</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进人">
                        <template slot-scope="scope" v-if="scope.row.related_login_user">
                            {{scope.row.related_login_user.nick_name}}
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
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_common_search_brand,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "product_brand"
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
