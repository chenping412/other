<template>
    <div class="inline-block" v-if="email">
        <div v-if="email_map && email_map[email] && email_map[email][0]">
            <PopoverModel>
                <div slot="reference">
                    <span>{{email_map[email][0].company_name}}</span>
                    <span v-if="email_map[email][0].name">，{{email_map[email][0].name}}</span>
                    <el-tag effect="dark" size="mini" v-if="email_map[email].length>1">{{email_map[email].length}}</el-tag>
                    <CompanyType v-if="email_map[email][0].company_type" :type="email_map[email][0].company_type"></CompanyType>
                </div>

                <div class="nowrap" style="border: 1px solid #ddd;">
                    <div class="padding-10 border-bottom">
                        <span class="margin-right-10">{{email}}</span>
                        <el-button type="primary" size="mini" class="clipboard-button" :data-clipboard-text="email">复制
                        </el-button>
                    </div>
                    <div class="padding-10 border-bottom" v-for="(map,$index) in email_map[email]" :key="$index">
                        {{map.company_name}}，{{map.name}}
                    </div>
                </div>
            </PopoverModel>
        </div>
        <div v-else>
            {{email}}
            <i class="el-icon-circle-plus-outline cursor-pointer" style="font-size: 16px;vertical-align: middle;" @click="add"> </i>
        </div>



        <el-dialog title="添加为联系人" :visible.sync="dialogShow" width="900px" :close-on-click-modal="false">

            <div class="content">
                <el-input class="margin-bottom-10" placeholder="公司名称、联系人" v-model="searchKeyword"
                          @keyup.enter.native="searchListData" @input="searchInput">
                    <el-button slot="prepend" icon="el-icon-search" @click="searchListData"></el-button>
                </el-input>

                <el-table :data="listData" v-loading="loading" height="500px">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="公司名称" width="400">
                        <template slot-scope="scope">
                            <span>{{scope.row.company_name}}</span>
                            <CompanyType :type="scope.row.company_type"></CompanyType>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="联系人"></el-table-column>
                    <el-table-column prop="email" label="联系人邮箱"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" v-if="scope.row.name && !scope.row.is_in_platform"
                                       :disabled="scope.row.email" @click="clickAddAddress(scope.row)">加入邮件地址
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['email','email_map'],
        data() {
            return {
                loading: false,
                dialogShow: false,

                searchKeyword: '',
                listData: [],

            }
        },
        watch: {},
        created() {
        },
        methods: {
            add() {
                this.dialogShow = true;
                this.searchListData();
            },
            searchInput(){
              if(this.timer) clearTimeout(this.timer);
              this.timer=setTimeout(()=>{
                  this.searchListData();
              },500)
            },
            searchListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_search,
                    data: {
                        name: self.searchKeyword,
                        per_page: self.$store.state.paginationPageSize,
                        page: 1,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        } else {
                            self.listData = [];
                        }
                    }
                });
            },
            clickAddAddress(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + row.account_company_id + '/partner_users/' + row.account_user_id,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        partnerId: row.account_company_id,
                        id: row.account_user_id,
                        email: self.email
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '绑定成功！',
                                type: 'success'
                            });
                            self.dialogShow = false;
                            self.searchListData();
                            self.$emit('update')
                        } else {
                            self.$message({
                                showClose: true,
                                message: '绑定失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>