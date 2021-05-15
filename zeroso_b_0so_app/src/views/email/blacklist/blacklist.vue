<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>黑白名单</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="message_mail_white_black" :allowFilterFieldsUrl="$api.message_mail_address_white_black_v5" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <blacklist-add @update="getListData"></blacklist-add>
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
                <el-table :data="listData" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="时间" field_name="create_time"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_time | zerosoCompanyTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="名单类型">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.access_type==='whitelist'">白名单</el-tag>
                            <el-tag type="danger" v-if="scope.row.access_type==='blacklist'">黑名单</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="updateAction(scope.row.id,'remove')">移除</el-button>
                            <el-button size="mini" type="success" plain v-if="scope.row.access_type==='blacklist'" @click="updateAction(scope.row.id,'set_white')">设为白名单</el-button>
                            <el-button size="mini" type="danger" plain v-if="scope.row.access_type==='whitelist'" @click="updateAction(scope.row.id,'set_black')">设为黑名单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    import BlacklistAdd from "./blacklist-add";
    export default {
        components: {BlacklistAdd},
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
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_address_white_black_v5,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        key: "message_mail_white_black"
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


            updateAction(id,action) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.message_mail_address_white_black_v4 + '/' +id+ '/action',
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        name: action,
                        email_id: id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.getListData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '操作失败！',
                                type: 'error'
                            });
                        }
                    }
                })
            },






        }
    }
</script>

<style>

</style>
