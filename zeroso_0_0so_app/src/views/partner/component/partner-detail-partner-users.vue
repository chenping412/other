<template>
    <div class="partner-detail-partner-users clearfix" v-loading="loading">
        <div class="user-list" v-if="listData.length>0">
            <el-input v-model="searchKeyword" suffix-icon="el-icon-search"></el-input>
            <el-table :data="listDataShow" height="700" style="width: 100%;" ref="singleTable"
                      highlight-current-row
                      @current-change="handleCurrentChange"
                      :row-class-name="tableRowClassName"
                      :show-header="false">
                <el-table-column label="id / be" width="180">
                    <template slot-scope="scope">
                        <span>id：{{scope.row.id}}</span>
                        <span class="margin-left-10">be：{{scope.row.belong_to_company_id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="联系人">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                        <el-tag type="warning" v-if="scope.row.is_primary">推荐</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="right">
                    <template slot-scope="scope">
                        <i class="blue el-icon el-icon-view" v-if="scope.row.visibility ==='public'"></i>
                        <i class="lightblue el-icon el-icon-s-custom" v-if="scope.row.has_linked_login_account"></i>
                        <i class="yellow el-icon el-icon-s-opportunity" v-if="scope.row.is_self_maintain"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="user-info" :style="{'width':listData.length===0?'100%':null}">
            <div class="padding-left-20 padding-bottom-20">
                <el-button type="primary" @click="clickAddUser()">新增联系人</el-button>

                <template v-if="selectUserForm.id">
                    <el-button type="primary" @click="clickEditUser()">编辑</el-button>
                    <el-button type="warning" plain v-if="!selectUserForm.is_primary"
                               @click="setDefault('set_primary')">设为推荐
                    </el-button>
                    <el-button type="warning" plain v-if="selectUserForm.is_primary"
                               @click="setDefault('unset_primary')">取消推荐
                    </el-button>

                    <el-dropdown trigger="click" placement="bottom-start" class="margin-left-10">
                        <el-button plain>
                            更多操作 <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" class="partner-detail-partner-users-more-action">
                            <el-dropdown-item>
                                <partner-detail-partner-users-admin :queryId="queryId" :userId="selectUserForm.id"
                                                                    :actionDialogTitle="actionDialogTitle"
                                                                    @update="init"></partner-detail-partner-users-admin>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <partner-detail-partner-users-relation-email :queryId="queryId"
                                                                             :userId="selectUserForm.id"
                                                                             :actionDialogTitle="actionDialogTitle"
                                                                             @update="init"></partner-detail-partner-users-relation-email>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="permissionsMap['ZerosoAdminAccountUserManagerNeed']">
                                <partner-detail-partner-users-super-admin :queryId="queryId" :userId="selectUserForm.id"
                                                                          :actionDialogTitle="actionDialogTitle"
                                                                          @update="init"></partner-detail-partner-users-super-admin>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <partner-detail-partner-users-status-action :queryId="queryId"
                                                                            :selectUserForm="selectUserForm"
                                                                            :actionDialogTitle="actionDialogTitle"
                                                                            @update="init"></partner-detail-partner-users-status-action>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <partner-detail-partner-users-ad-brands :userId="selectUserForm.id"
                                                                        :actionDialogTitle="actionDialogTitle"></partner-detail-partner-users-ad-brands>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="permissionsMap['ZerosoAdminAccountUserManagerNeed']">
                                <partner-detail-partner-users-admin-status-action :queryId="queryId"
                                                                                  :selectUserForm="selectUserForm"
                                                                                  :actionDialogTitle="actionDialogTitle"
                                                                                  @update="init"></partner-detail-partner-users-admin-status-action>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-button class="margin-left-10" type="warning" size="mini" @click="clickWriteEmail">发邮件</el-button>
                </template>

            </div>
            <el-form class="base-info clearfix" v-if="selectUserForm.id" :model="selectUserForm" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="联系人：">
                            <span class="form-border-bottom">{{selectUserForm.name | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="性别：">
                            <span class="form-border-bottom">{{selectUserForm.gender | gender | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="生日：">
                            <span class="form-border-bottom">{{selectUserForm.birthday | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="职位：">
                            <span class="form-border-bottom">{{selectUserForm.position | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="部门：">
                            <span class="form-border-bottom">{{selectUserForm.department | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="头像：">
                            <ImageShow ref="show_partner_avatar" :module_id="selectUserForm.id"
                                       module_name="partner_avatar" subsystem="partner"></ImageShow>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱：">
                            <span class="form-border-bottom">{{selectUserForm.email | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="手机：">
                            <span class="form-border-bottom">{{selectUserForm.mobile | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="电话：">
                            <span class="form-border-bottom">
                                {{selectUserForm.phone | defaultStr}}{{selectUserForm.suffix_phone_number ? '-'+selectUserForm.suffix_phone_number : ''}}
                            </span>
                        </el-form-item>
                        <el-form-item label="微信：">
                            <span class="form-border-bottom">{{selectUserForm.wechat | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="Q Q：">
                            <span class="form-border-bottom">{{selectUserForm.qq | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="企点：">
                            <a v-if="selectUserForm.start_point" :href="selectUserForm.start_point" target="_blank">
                                <img src="./../../../assets/images/qq.png">
                            </a>
                        </el-form-item>
                        <el-form-item label="微信二维码：">
                            <ImageShow ref="show_wechat_qcode" :module_id="selectUserForm.id" module_name="wechat_qcode"
                                       subsystem="partner"></ImageShow>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="语言：">
                            <span class="form-border-bottom">{{selectUserForm.language_text | language | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="客户角色职务：">
                            <span class="form-border-bottom">{{selectUserForm.customer_contact_role | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="常用沟通工具：">
                            <span class="form-border-bottom">{{selectUserForm.customer_most_used_contact_tool | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="最终决策人：">
                            <span class="form-border-bottom">{{selectUserForm.is_key_man?'是':'否'}}</span>
                        </el-form-item>
                        <el-form-item label="联系人状态：">
                            <span class="form-border-bottom">{{selectUserForm.status | partnerUserStatus}}</span>
                        </el-form-item>
                        <el-form-item label="显示状态：">
                            <span class="form-border-bottom">{{selectUserForm.visibility | partnerUserAction}}</span>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <span class="form-border-bottom">{{selectUserForm.comment | defaultStr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-divider></el-divider>
            <div class="padding-left-20 padding-bottom-20" v-if="selectUserForm.id">
                <el-button type="primary" v-if="!bankAccount.isEdit" @click="clickEditBankAccount()">编辑</el-button>
                <el-button type="success" v-if="bankAccount.isEdit" @click="saveBankAccount()">保存</el-button>
                <el-button v-if="bankAccount.isEdit" @click="clickCancelEditBankAccount()">取消</el-button>
            </div>
            <el-form v-if="selectUserForm.id" :model="bankAccount" :rules="bankAccountRule" ref="bankAccountForm"
                     label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-if="bankAccount.isEdit" v-model="bankAccount.name"></el-input>
                            <span v-else class="form-border-bottom">{{bankAccount.name | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="开户行：" prop="bank_code">
                            <el-select v-if="bankAccount.isEdit" v-model="bankAccount.bank_code" filterable>
                                <el-option
                                        v-for="item in $store.state.bank_codes"
                                        :key="item"
                                        :value="item"
                                        :label="item">
                                </el-option>
                            </el-select>
                            <span v-else class="form-border-bottom">{{bankAccount.bank_code | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="开户行全称：" prop="bank_name">
                            <el-input v-if="bankAccount.isEdit" v-model="bankAccount.bank_name"></el-input>
                            <span v-else class="form-border-bottom">{{bankAccount.bank_name | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="开户名：" prop="account_name">
                            <el-input v-if="bankAccount.isEdit" v-model="bankAccount.account_name"></el-input>
                            <span v-else class="form-border-bottom">{{bankAccount.account_name | defaultStr}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="账号：" prop="account_number">
                            <el-input v-if="bankAccount.isEdit" v-model="bankAccount.account_number"></el-input>
                            <span v-else class="form-border-bottom">{{bankAccount.account_number | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="国家：" prop="country">
                            <el-select v-if="bankAccount.isEdit" v-model="bankAccount.country">
                                <el-option
                                        v-for="item in $store.state.country"
                                        :key="item.code2"
                                        :value="item.code2"
                                        :label="item.chinese_name">
                                </el-option>
                            </el-select>
                            <span v-else
                                  class="form-border-bottom">{{bankAccount.country | country | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="货币：" prop="currency">
                            <el-select v-if="bankAccount.isEdit" v-model="bankAccount.currency">
                                <el-option
                                        v-for="item in $store.state.currency"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.label">
                                </el-option>
                            </el-select>
                            <span v-else
                                  class="form-border-bottom">{{bankAccount.currency | currency | defaultStr}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>


        <el-dialog title="联系人操作" :visible.sync="dialogShow" width="950px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form class="clearfix" :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-row :gutter="20">
                    <el-col :span="11">
                        <el-form-item label="联系人" prop="name">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-input v-model="addForm.position" placeholder="例：销售经理"></el-input>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-input v-model="addForm.position"></el-input>
                        </el-form-item>
                        <el-form-item label="手机" prop="mobile">
                            <InputMobile :value.sync="addForm.mobile" :rules.sync="addFormRule.mobile"></InputMobile>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <InputPhone :value.sync="addForm.phone" :suffixPhone.sync="addForm.suffix_phone_number"
                                        :rules.sync="addFormRule.phone"></InputPhone>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-select v-model="addForm.gender">
                                <el-option
                                        v-for="item in $store.state.gender"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生日">
                            <el-date-picker
                                    v-model="addForm.birthday"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="生日">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="微信">
                            <el-input v-model="addForm.wechat"></el-input>
                        </el-form-item>
                        <el-form-item label="Q Q">
                            <el-input v-model="addForm.qq"></el-input>
                        </el-form-item>
                        <el-form-item label="企点">
                            <el-input v-model="addForm.start_point" placeholder="企点链接"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="头像">
                            <ImageUpload
                                    ref="partner_avatar"
                                    :showImage="true"
                                    :autoUpload="false"
                                    :module_id="addForm.id"
                                    module_name="partner_avatar"
                                    subsystem="partner"
                                    :width="250"
                                    :height="250"
                            ></ImageUpload>
                        </el-form-item>
                        <el-form-item label="微信二维码">
                            <ImageUpload
                                    ref="wechat_qcode"
                                    :showImage="true"
                                    :autoUpload="false"
                                    :module_id="addForm.id"
                                    module_name="wechat_qcode"
                                    subsystem="partner"
                                    :width="150"
                                    :height="150"
                            ></ImageUpload>
                        </el-form-item>
                        <el-form-item label="语言">
                            <el-select v-model="addForm.language_text">
                                <el-option
                                        v-for="item in $store.state.language"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户角色职务">
                            <el-select v-model="addForm.customer_contact_role">
                                <el-option
                                        v-for="item in $store.state.static_resource.customer_contact_role"
                                        :key="item"
                                        :value="item"
                                        :label="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="常用沟通工具">
                            <el-select v-model="addForm.customer_most_used_contact_tool">
                                <el-option
                                        v-for="item in $store.state.static_resource.customer_most_used_contact_tool"
                                        :key="item"
                                        :value="item"
                                        :label="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否最终决策人">
                            <el-checkbox v-model="addForm.is_key_man">最终决策人</el-checkbox>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="addForm.comment"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveUserDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import PartnerDetailPartnerUsersAdmin from "./partner-detail-partner-users-admin";
    import PartnerDetailPartnerUsersAdminStatusAction from "./partner-detail-partner-users-admin-status-action";
    import PartnerDetailPartnerUsersAdBrands from "./partner-detail-partner-users-ad-brands";
    import PartnerDetailPartnerUsersStatusAction from "./partner-detail-partner-users-status-action";
    import PartnerDetailPartnerUsersRelationEmail from "./partner-detail-partner-users-relation-email";
    import PartnerDetailPartnerUsersSuperAdmin from "./partner-detail-partner-users-super-admin";

    export default {
        components: {
            PartnerDetailPartnerUsersSuperAdmin,
            PartnerDetailPartnerUsersRelationEmail,
            PartnerDetailPartnerUsersStatusAction,
            PartnerDetailPartnerUsersAdBrands,
            PartnerDetailPartnerUsersAdminStatusAction,
            PartnerDetailPartnerUsersAdmin
        },
        props: ['queryId', 'detailForm'],
        data() {
            return {
                searchKeyword: '',

                listData: [],
                selectUserForm: {},
                selectUserId: null,
                bankAccount: {},
                bankAccountRule: {
                    name: [
                        {required: true, message: '请输入名称！'}
                    ], bank_code: [
                        {required: true, message: '请选择开户行！'}
                    ], bank_name: [
                        {required: true, message: '请输入开户行全称！'}
                    ], account_name: [
                        {required: true, message: '请输入开户名！'}
                    ], account_number: [
                        {required: true, message: '请输入账号！'}
                    ], country: [
                        {required: true, message: '请选择国家！'}
                    ], currency: [
                        {required: true, message: '请选择货币！'}
                    ],
                },

                loading: false,

                dialogShow: false,
                addForm: {},
                addFormRule: {
                    name: [
                        {required: true, message: '请输入联系人！'}
                    ],
                    mobile: null,
                    phone: null,
                },

                actionDialogTitle: '',

            }
        },
        computed: {
            permissionsMap() {
                return this.$store.state.permissionsMap
            },
            listDataShow(){
                let arr = [];
                this.listData.forEach((item) => {
                    if (item.id.toString().indexOf(this.searchKeyword) > -1 || item.name.toString().indexOf(this.searchKeyword) > -1) {
                        arr.push(item)
                    }
                });
                return  arr;
            }
        },
        watch: {
            listDataShow(val) {
                if (val.length > 0) {
                    this.$nextTick(() => {
                        let index = 0;
                        if (this.selectUserId) {
                            for (let i = 0; i < val.length; i++) {
                                if (val[i].id === this.selectUserId) {
                                    index = i;
                                    this.selectUserId = null;
                                    break
                                }
                            }
                        }
                        this.setCurrent(val[index]);
                    })
                } else {
                    this.selectUserForm = {};
                }
            },
            queryId() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_users',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },
            handleCurrentChange(row) {
                if (row && row.id) {
                    this.selectUserForm = row;
                    this.actionDialogTitle = this.detailForm.name + '，' + row.name
                    this.getBankAccount()
                }
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            tableRowClassName({row}) {
                if (row.status === 'leave') {
                    return 'partner-user-leave';
                }
                return '';
            },

            //新建联系人
            clickAddUser() {
                this.dialogShow = true;
                this.addForm = {
                    partnerId: this.queryId,
                }
            },
            //编辑联系人
            clickEditUser() {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(this.selectUserForm));
            },
            //保存联系人
            clickSaveUserDate() {
                let self = this;
                console.log(this.addFormRule)
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_users' + (self.addForm.id ? '/' + self.addForm.id : ''),
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    if (data.msg.account_user_id) {
                                        self.addForm.id = data.msg.account_user_id;
                                    }
                                    self.selectUserId = self.addForm.id;
                                    self.$refs.partner_avatar.submitUpload(self.addForm.id, () => {
                                        self.$refs.wechat_qcode.submitUpload(self.addForm.id, () => {
                                            self.$message({
                                                showClose: true,
                                                message: '保存成功！',
                                                type: 'success'
                                            });
                                            self.dialogShow = false;
                                            self.getListData();
                                            self.$refs.show_wechat_qcode.update();
                                            self.$refs.show_partner_avatar.update();
                                        });
                                    });
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
            //设为推荐
            setDefault(name) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_detail + '/' + self.queryId + '/partner_users/' + self.selectUserForm.id + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        account_company_id: self.queryId,
                        account_user_id: self.selectUserForm.id,
                        name: name
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
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
                });
            },


            getBankAccount() {
                let self = this;
                self.$http({
                    url: self.$api.bank_account_account_user + '/' + self.selectUserForm.id,
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            data.msg.isEdit = false;
                            self.bankAccount = data.msg;
                        } else {
                            self.bankAccount = {
                                isEdit: false
                            }
                        }
                    }
                })
            },
            //保存银行信息
            saveBankAccount() {
                let self = this;
                self.$refs.bankAccountForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.bank_account_account_user + '/' + self.selectUserForm.id,
                            type: 'PUT',
                            requestBody: true,
                            data: self.bankAccount,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.getBankAccount();
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
            //点击编辑银行信息
            clickEditBankAccount() {
                this.bankAccount.isEdit = true;
            },
            //取消编辑银行信息
            clickCancelEditBankAccount() {
                this.bankAccount.isEdit = false;
                this.getBankAccount();
            },

            clickWriteEmail(){
                this.$emit('clickWriteEmail',this.selectUserForm.email);
            },
        }
    }
</script>

<style lang="scss">
    .partner-detail-partner-users {
        .user-list {
            float: left;
            width: 400px;

            .el-icon {
                margin: 0 2px;
                font-size: 20px;
            }

            .partner-user-leave {
                background-color: #f0f0f0;
                color: #aaaaaa;
            }
        }

        .user-info {
            width: calc(100% - 410px);
            float: right;

        }
    }
.partner-detail-partner-users-more-action{
    .el-dropdown-menu__item{
        padding: 3px 8px;
        &>div>.el-button{
            min-width: 150px;
        }
    }
}
</style>
