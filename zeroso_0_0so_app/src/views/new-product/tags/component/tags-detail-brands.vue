<template>
    <div v-loading="loading">
        <div class="clearfix padding-bottom-10">
            <div class="left">
                <el-button size="mini" type="primary" @click="getListData">查询</el-button>
            </div>
            <div class="right">
                <el-pagination
                        @current-change="getListData"
                        @size-change="getListData"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNum"
                        :total="totalCount"
                        :layout="$store.state.paginationLayOut"
                        :pager-count="5"
                        background>
                </el-pagination>
            </div>
        </div>
        <el-table :data="listData" border  @row-click="openDetail">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="name" label="品牌名称"></el-table-column>
            <el-table-column prop="country" label="国家"></el-table-column>
            <el-table-column label="品牌等级">
                <template slot-scope="scope">
                    <BrandLever :state="scope.row.state"></BrandLever>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        props: ['queryId'],
        data() {
            return {
                listData: [],
                pageSize: 10,
                pageNum: 1,
                totalCount: 0,
                loading: false,

            }
        },
        watch: {
            queryId() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_label_normal + '/' + self.queryId + '/brands',
                    type:"POST",
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
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
                this.$router.push({
                    path: '/new-product/brand/detail',
                    query: {
                        id:row.uid,
                    }
                });
            },

        },
    }
</script>

<style lang="scss">

</style>
