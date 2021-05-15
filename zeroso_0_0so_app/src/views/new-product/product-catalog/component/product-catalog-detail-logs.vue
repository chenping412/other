<template>
    <div class="price-detail-logs clearfix" v-loading="loading">
        <div class="margin-bottom-5 clearfix">
            <h4 class="margin-left-5 left">维护日志</h4>
            <el-pagination
                    class="right"
                    @current-change="getListData"
                    @size-change="getListData"
                    :page-size.sync="pageSize"
                    :current-page.sync="pageNum"
                    :total="totalCount"
                    small
                    layout="prev, pager, next">
            </el-pagination>
        </div>
        <table>
            <tbody>
            <tr v-for="(item,$index) in 10" :key="$index">
                <td>价格表创建{{item}}</td>
                <td>aaaa</td>
                <td>2020-12-05 09:49:51</td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>

    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,
                listData: [],
                pageSize: 10,
                pageNum: 1,
                totalCount: 0,
            }
        },
        watch: {
            queryId () {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    // this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/rules',
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";
.price-detail-logs {
    margin-left: 20%;
    color: #777777;
    table{
        border-collapse: collapse;
        width: 100%;
        td{
            border: 1px solid $color-border;
            padding: 4px 10px;
            font-size: 12px;
        }
    }
    .el-pagination{
        color: inherit;
    }
}
</style>
