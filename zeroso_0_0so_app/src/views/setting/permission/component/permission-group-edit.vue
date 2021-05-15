<template>
    <div class="permission-group-edit" v-loading="loading">
        <el-form :model="groupDetailForm" :rules="groupDetailFormRule" ref="form" label-width="150px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="groupDetailForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="上级：" prop="parent_permission_group_id">
                        <el-select v-model="groupDetailForm.parent_permission_group_id">
                            <el-option
                                    v-for="(item,$index) in groupListData"
                                    :key="$index"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="组内用户：">
                <template v-if="groupDetailForm.account_users">
                    <el-tag size="medium"
                            closable
                            v-for="(item,$index) in groupDetailForm.account_users"
                            :disable-transitions="true"
                            :key="$index" @close="removeUser(item)">
                        {{item.name}}
                    </el-tag>
                </template>

                <el-button type="primary" class="margin-left-10" @click="getNotCheckUserList">
                    <i class="el-icon-plus"></i>
                    <span>添加用户</span>
                </el-button>
            </el-form-item>

            <el-form-item label="模块：">
                <div>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                </div>
                <el-checkbox-group class="permissions-group-checkbox" v-model="permissionsChecked">
                    <el-checkbox
                            v-for="(item,$index) in permissionsList"
                            :label="item.id"
                            :key="$index">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <el-button type="success" @click="clickSaveDate">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form-item>
        </el-form>







        <el-dialog title="选择用户" :visible.sync="dialogShow" width="1200px" top="50px" :close-on-click-modal="false" v-loading="loading">

            <div class="check-user-scroll">
                <el-checkbox-group v-model="userChecked">
                    <el-checkbox
                            v-for="(item,$index) in notCheckUserList"
                            :label="item"
                            :key="$index">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickCheckUser()">确 定</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>




    </div>
</template>

<script>

    export default {
        data() {
            return {
                queryId: null,
                parentId: null,

                groupDetailForm: {},
                groupDetailFormRule: {
                    name: [
                        {required: true, message: '请输入名称！'}
                    ],
                },

                permissionsList: [],
                permissionsChecked: [],
                checkAll: false,
                isIndeterminate: false,

                groupListData: [],

                dialogShow:false,
                notCheckUserList: [],
                userChecked: [],

                loading: false,
            }
        },
        created() {
            this.getGroupList();
            this.init();
        },
        methods: {
            init() {
                let self = this;

                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.parentId = self.$route.query.parentId * 1;
                    self.queryId = null;
                    self.permissionsChecked = [];
                    self.groupDetailForm = {
                        parent_permission_group_id: self.parentId,
                        account_users: [],
                    };
                    self.getPermissionList();
                }
            },

            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_group + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.groupDetailForm = data.msg;

                            let permissionsChecked = [];
                            if (self.groupDetailForm.permissions) {
                                self.permissionsList = self.groupDetailForm.permissions;
                                self.permissionsList.forEach((item) => {
                                    if (item.checked) permissionsChecked.push(item.id);
                                });
                            }
                            self.permissionsChecked = permissionsChecked;
                        }
                    }
                })
            },

            removeUser(item) {
                this.groupDetailForm.account_users.splice(this.groupDetailForm.account_users.indexOf(item), 1);
            },

            handleCheckAllChange(val) {
                if (val) {
                    let permissionsChecked = [];
                    this.groupDetailForm.permissions.forEach((item) => {
                        permissionsChecked.push(item.id);
                    });
                    this.permissionsChecked = permissionsChecked;
                } else {
                    this.permissionsChecked = [];
                }
                this.isIndeterminate = false;
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let user_ids = [];
                        self.groupDetailForm.account_users.forEach((item) => {
                            user_ids.push(item.id);
                        });
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_v2_self_permission_group + (self.queryId ? '/' + self.queryId : ''),
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: {
                                "id": self.queryId || undefined,
                                "parent_permission_group_id": self.groupDetailForm.parent_permission_group_id,
                                "name": self.groupDetailForm.name,
                                "permissions": self.permissionsChecked,
                                "user_ids": user_ids,
                            },
                            success: function () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.goBack()
                            }
                        });
                    }
                });
            },

            goBack() {
                this.$router.push('group');
            },


            getPermissionList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_permission,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.permissionsList = data.msg.items;
                        }
                    }
                })
            },

            getGroupList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_group,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.groupListData = [{id: 0, name: '无'}].concat(data.msg);
                        }
                    }
                })
            },


            getNotCheckUserList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_user,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            let user_ids = [];
                            self.groupDetailForm.account_users.forEach((item) => {
                                user_ids.push(item.id);
                            });

                            let arr = data.msg.items;
                            let notCheckUserList = [];
                            for(let i=0;i<arr.length;i++){
                                if(user_ids.indexOf(arr[i].id) === -1){
                                    notCheckUserList.push({
                                        id:arr[i].id,
                                        name:arr[i].name
                                    })
                                }
                            }
                            self.notCheckUserList = notCheckUserList;
                            self.dialogShow=true;
                        }
                    }
                })
            },
            clickCheckUser(){
                this.groupDetailForm.account_users = this.groupDetailForm.account_users.concat(this.userChecked);
                this.dialogShow = false;
            },


        }
    }
</script>

<style lang="scss">
    .permissions-group-checkbox {
        .el-checkbox {
            min-width: 400px;
        }
    }
    .check-user-scroll{
        max-height: 600px;
        overflow-y: auto;
        .el-checkbox {
            min-width: 200px;
            margin-right: 15px;
            margin-bottom: 5px;
        }
    }
</style>
