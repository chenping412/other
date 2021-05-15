<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>账户设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="login_user" :allowFilterFieldsUrl="listApi" :showAllFilter="true" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="clickAdd()">创建用户</el-button>
                </div>
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
                <el-table-column label="id" prop="id"></el-table-column>
                <el-table-column label="昵称">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.nick_name"></el-input>
                        <span v-else>{{scope.row.nick_name | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.mobile"></el-input>
                        <span v-else>{{scope.row.mobile | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="邮箱">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.isEdit" v-model="scope.row.email"></el-input>
                        <span v-else>{{scope.row.email | defaultStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效密码">
                    <template slot-scope="scope">
                        <span>{{scope.row.has_password ? '有密码' : '无密码'}}</span>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <div v-if="scope.row.isEdit">
                            <el-button size="mini" type="success" @click="clickSaveDate(scope.row)">保存</el-button>
                            <el-button size="mini" @click="getListData">取消</el-button>
                        </div>
                        <div v-else>
                            <el-button size="mini" type="primary" @click="scope.row.isEdit=true">编辑</el-button>
                            <el-button size="mini" type="danger" @click="clickEditPassword(scope.row)">重置密码</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <setting-user-edit-password ref="editPassword" @update="init"></setting-user-edit-password>
    </div>
</template>

<script>
    import SettingUserEditPassword from "./setting-user-edit-password";
    export default {
        components: {
            SettingUserEditPassword

        },
        data() {
            return {
                filter: {},
                listApi:this.$api.partner_v5_login_user + '/search',

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
                    url: self.listApi,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "login_user"
                    },
                    success: function (data) {
                        self.loading = false;
                        if(data.msg && data.msg.items) {
                            for(let i=0;i<data.msg.items.length;i++){
                                data.msg.items[i].isEdit = false;
                            }
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            clickSaveDate(row) {
                let self = this;
                if(!row.nick_name){
                    self.$message({
                        showClose: true,
                        message: '请输入昵称！',
                        type: 'error'
                    });
                    return
                }
                if(!row.mobile){
                    self.$message({
                        showClose: true,
                        message: '请输入手机号！',
                        type: 'error'
                    });
                    return
                }
                if(!row.email){
                    self.$message({
                        showClose: true,
                        message: '请输入邮箱！',
                        type: 'error'
                    });
                    return
                }

                self.loading = true;
                self.$http({
                    url: row.id ? self.$api.partner_v5_login_user + '/' +row.id : self.$api.partner_v5_login_user,
                    type: row.id ? 'PUT' : 'POST',
                    requestBody: true,
                    data: row,
                    success: function () {
                        self.loading = false;
                        row.isEdit = false;
                        self.getListData();
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                });
            },


            clickAdd(){
                this.listData.unshift({
                    isEdit:true,
                    email: null,
                    mobile: null,
                    nick_name: null,
                })
            },

            clickEditPassword(row){
              this.$refs.editPassword.edit(row)
            },


        }
    }
</script>

<style>

</style>
