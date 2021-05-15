<template>
    <div class="inline-block">
        <el-dropdown class="margin-right-10" trigger="click" placement="bottom-start"
                     @command="selectGroupFilter">
            <el-button type="primary" plain>
                <span>分组&emsp;</span>
                <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        class="collection-filter-item"
                        v-for="(item,$index) in allowGroupFieldsList"
                        :key="$index"
                        :class="{'active':queryGroupBy && item.field_name===queryGroupBy.by}"
                        :command="item.field_name">
                    <span>{{item.translate}}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>



        <el-dialog :visible.sync="dialogShow" width="90%" top="30px" append-to-body :close-on-click-modal="false">
            <div class="padding-bottom-10 padding-top-10 clearfix">
                <h3 class="left">分组：{{group_by&&group_by[0] ? group_by[0].translate : ''}}</h3>
                <el-pagination
                        class="right"
                        @current-change="getListData"
                        @size-change="getListData"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNum"
                        :total="totalCount"
                        :page-sizes="$store.state.paginationPageSizes"
                        :layout="$store.state.paginationLayOut"
                        :pager-count="5"
                        size="mini"
                        background>
                </el-pagination>
            </div>
            <el-table :data="groupListData" @row-click="openDetail" border size="mini" height="650px" stripe v-loading="loading">
                <el-table-column v-for="(item,$index) in groupConfig" :key="$index">
                    <template v-slot:header>
                        <div v-for="(title,titleIndex) in item.title" :key="titleIndex">{{title.title}}</div>
                    </template>
                    <template slot-scope="scope" v-if="scope.row[item.dataIndex]">
                        <span v-if="item.zerosoRound">{{scope.row[item.dataIndex] | zerosoRound}}</span>
                        <span v-else>{{scope.row[item.dataIndex]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props:['allowGroupFieldsList','filterKey','allowFilterFieldsUrl','groupConfig'],
        data() {
            return {
                queryGroupBy:null,
                filter: {},
                order_by:undefined,
                group_by:undefined,

                groupListData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                tableKeyList:[],

                dialogShow: false,
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
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.queryGroupBy = this.$route.query.group_by ? JSON.parse(decodeURIComponent(this.$route.query.group_by)) : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
            },


            selectGroupFilter(value){
                this.group_by = null;
                this.allowGroupFieldsList.forEach((item)=>{
                   if(item.field_name===value) {
                       this.group_by = [{
                           by: item.field_name,
                           translate: item.translate,
                       }];
                   }
                });
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                let filter = self.$parent.formatQueryFilter();
                self.filter = [];
                if(filter){
                    filter.forEach((item)=>{
                        if(!item[0] || (item[0] && self.group_by[0] && item[0]!== self.group_by[0].by) ){
                            self.filter.push(item);
                        }
                    });
                }
                self.dialogShow = true;
                self.loading = true;
                self.$http({
                    url: self.allowFilterFieldsUrl,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        group_by: self.group_by,
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.filter,
                        key: self.filterKey
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.groupListData = data.msg.groups;
                            self.totalCount = data.msg.total;
                        } else {
                            self.groupListData = [];
                            self.totalCount = 0;
                        }

                    }
                })
            },

            openDetail(row){
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.filter = row.filter ? encodeURIComponent(JSON.stringify(row.filter)) : undefined;
                query.pageNum = undefined;
                query.group_by = encodeURIComponent(JSON.stringify(this.group_by[0]));
                this.$router.push({
                    path: this.$route.path,
                    query: query
                });
                this.dialogShow = false;
            }
        },
    }
</script>

<style lang="scss">

</style>