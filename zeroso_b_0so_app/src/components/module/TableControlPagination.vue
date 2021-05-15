<template>
    <div class="control-pagination clearfix">
        <div class="pagination">
<!--            <span>{{(pageSize*(pageNum-1)+1) <= totalCount ? (pageSize*(pageNum-1)+1) : totalCount}}-{{pageSize*pageNum <= totalCount ? pageSize*pageNum :totalCount}} /</span>-->
            <el-pagination
                    @current-change="tablePageNumChange"
                    @size-change="tablePageSizeChange"
                    :page-size="pageSize"
                    :current-page="pageNum"
                    :total="totalCount"
                    :page-sizes="$store.state.paginationPageSizes"
                    :layout="$store.state.paginationLayOut"
                    :pager-count="5"
                    background>
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:['pageSize','pageNum','totalCount'],
        data() {
            return {

            }
        },

        created() {

        },
        methods: {
            tablePageNumChange(val) {
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageNum = val;
                this.$router.push({
                    path: this.$route.path,
                    query: query
                })
            },
            tablePageSizeChange(val) {
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.pageSize = val;
                this.$router.push({
                    path: this.$route.path,
                    query: query
                })
            },
        },
    }
</script>

<style lang="scss">
    .control-pagination{
        float: right;
        .detail-pagination{
            font-size: 16px;
            padding: 2px 0;
            &>span{
                margin-right: 10px;
                vertical-align: middle;
            }
        }
    }
</style>