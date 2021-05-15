<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>合作伙伴</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="partner_all" :allowFilterFieldsUrl="$api.partner_companies_search" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <PartnerAdd ref="partnerAdd"></PartnerAdd>
                </div>
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
                <el-table-column prop="company_name" label="公司名称">
                    <template slot-scope="scope">
                        <span :class="{'delete':scope.row.state=== 'no_such_company' || scope.row.state=== 'not_recommend'}">{{scope.row.company_name | defaultStr}}</span>
                        <CompanyType :type="scope.row.company_type"></CompanyType>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="国家">
                    <template slot-scope="scope">
                        <span>{{scope.row.country | country | defaultStr}}</span>
                        <span v-if="scope.row.country">({{scope.row.country}})</span>
                        <isEuCountry :country="scope.row.country"></isEuCountry>
                    </template>
                </el-table-column>
                <el-table-column prop="follower.name" label="跟进人">
                    <template slot-scope="scope" v-if="scope.row.follower">
                        {{scope.row.follower.name}}
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
    import PartnerAdd from "./component/partner-add";

    export default {
        components: {
            PartnerAdd
        },
        data() {
            return {
                filter: {},

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
        mounted() {
            if(this.$route.query.showAdd && this.$route.query.showAdd==='true'){
                this.$refs.partnerAdd.openAddModel();
            }
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
                    url: self.$api.partner_companies_search,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "partner_all"
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
                    id : row && row.account_company_id ? row.account_company_id : undefined,
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
