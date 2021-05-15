<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">会计凭证列表</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId?'凭证详情':'创建凭证'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-control clearfix" v-if="queryId">
                        <div class="control-btns">
                            <el-button type="primary" @click="clickCreate()">创建凭证</el-button>
                        </div>
                        <DetailPagination
                                apiKey="accounting_account_move"
                                :listApi="$api.bank_v4_account_move + '/search'">
                        </DetailPagination>
                    </div>
                </div>


                <account-documents-move
                        :accountMove="detailForm"
                        type="accountDocuments"
                        @update="init">
                </account-documents-move>

            </div>


        </div>

    </div>
</template>

<script>
    import AccountDocumentsMove from "./component/account-documents-move";

    export default {
        components: {AccountDocumentsMove},
        data() {
            return {
                queryId: '',
                parentQuery: '',
                detailForm: {},

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
                let self = this;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        account_move_lines: [],
                        bank_statement_relations: [],
                    };
                }

            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_account_move + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                        }
                    },
                    error(data) {
                        if (data.responseJSON && data.responseJSON.err_code && data.responseJSON.err_code.indexOf(40001) > -1) {
                            self.$router.back();
                        }
                    }
                })
            },

            clickCreate() {
                this.$router.push({
                    path: 'detail',
                });
            },

        }
    }
</script>

<style lang="scss">


</style>
