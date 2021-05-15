<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>官网</el-breadcrumb-item>
                    <el-breadcrumb-item>联系我们</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    :allowFilterFieldsUrl="searchListUrl"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="公司" prop="company_name"></el-table-column>
                <el-table-column label="姓名" prop="user_name"></el-table-column>
                <el-table-column label="联系电话" prop="mobile"></el-table-column>
                <el-table-column label="微信或QQ" prop="qq"></el-table-column>
                <el-table-column label="描述" prop="demand" width="250px">
                    <template slot-scope="scope">
                        <pre>{{scope.row.demand}}</pre>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <ButtonSort label="创建时间" field_name="create_time"></ButtonSort>
                    </template>
                    <template slot-scope="scope">
                        {{scope.row.create_time | zerosoCompanyTime | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column width="200">
                    <template slot-scope="scope">
                        <span>指派给:</span>
                        <el-select style="width: 120px;" size="mini" v-model="scope.row.deal_user_id"
                                   :disabled="scope.row.is_deal"
                                   @change="updateDealUser(scope.row)">
                            <el-option :value="null" label="无"></el-option>
                            <el-option
                                    v-for="item in $store.state.all_internal_users"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="处理备注" prop="remark" width="200px"></el-table-column>
                <el-table-column label="最后操作时间">
                    <template slot-scope="scope">
                        {{scope.row.write_time | zerosoCompanyTime | defaultStr}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80px">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.is_deal">已处理</el-tag>
                        <el-tag type="danger" effect="dark"  v-if="!scope.row.is_deal">未处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.deal_user_id && scope.row.deal_user_id === $store.state.currentCompany.user_id">
                            <el-button type="primary" size="mini"
                                       v-if="!scope.row.is_deal"
                                       @click.native.stop="clickChangeState(scope.row)">
                                标记已处理
                            </el-button>
                            <el-button plain size="mini"
                                       v-if="scope.row.is_deal"
                                       @click.native.stop="clickChangeState(scope.row)">
                                标记未处理
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog title="操作备注" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <div >
                <el-input type="textarea" :rows="10" v-model="remarkForm.remark" placeholder="非必填"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveChangeState()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {

                searchListUrl: this.$api.www_users_demands_list,

                filter: {},
                order_by: undefined,

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,


                dialogShow: false,
                remarkForm: {
                    id:null,
                    remark:'',
                },


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
            if (this.$store.state.currentCompany.account_company_id !== 39567) {
                this.$message({
                    showClose: true,
                    message: '温馨提示：为了是数据的准确性，请切换到 零搜供应链 员工账号！',
                    type: 'warning'
                });
            }
        },
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : undefined;
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
                    url: self.searchListUrl,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        order_by: self.order_by,
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
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

            //变更指派人
            updateDealUser(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.www_users_demands + '/' + row.id + '/assignDealUser',
                    type: 'PUT',
                    requestBody: true,
                    data:{
                        deal_user_id:row.deal_user_id
                    },
                    success () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getListData();
                    }
                })
            },


            //点击处理
            clickChangeState(row){
                if(!row.is_deal){
                    this.remarkForm = {
                        id:row.id,
                        is_deal:true,
                        remark:'',
                    };
                    this.dialogShow=true;
                }else {
                    this.changeState(row.id,{
                        is_deal:false,
                        remark:'',
                    })
                }
            },
            clickSaveChangeState(){
                this.changeState(this.remarkForm.id,{
                    is_deal:true,
                    remark:this.remarkForm.remark,
                })
            },
            //改变处理状态
            changeState(id,requestData) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.www_users_demands + '/' + id + '/assignDealStatus',
                    type: 'PUT',
                    requestBody: true,
                    data:requestData,
                    success () {
                        self.loading = false;
                        self.dialogShow = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getListData();
                    }
                })
            },



        }
    }
</script>

<style>

</style>
