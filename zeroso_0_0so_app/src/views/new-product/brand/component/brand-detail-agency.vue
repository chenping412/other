<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="厂家联系人" prop="contact_user_id">
                <template slot-scope="scope">
                    <router-link v-if="scope.row.contact_user" target="_blank" class="blue"
                                 :to="'/partner/detail?id='+scope.row.contact_user.account_company_id">
                        {{scope.row.contact_user.company_name}}，
                        {{scope.row.contact_user.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="谈判人" prop="negotiator">
                <template slot-scope="scope">
                    <span v-if="scope.row.negotiator">
                        {{scope.row.negotiator.nick_name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="签订日期">
                <template slot-scope="scope">
                    <span>{{scope.row.sign_date | zerosoCompanyDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="代理时间">
                <template slot-scope="scope">
                    <span>{{scope.row.start_date | zerosoCompanyDate}}</span>
                    <span> 至 </span>
                    <span>{{scope.row.end_date | zerosoCompanyDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="授权公司" prop="authorized_company_id">
                <template slot-scope="scope">
                    <router-link v-if="scope.row.authorized_company" target="_blank" class="blue"
                            :to="'/partner/detail?id='+scope.row.authorized_company.account_company_id">
                        {{scope.row.authorized_company.company_name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column label="授权范围" prop="authorized_scope">
                <template slot-scope="scope" v-if="scope.row.authorized_scope && scope.row.authorized_scope.length>0">
                    <span v-for="(item,$index) in scope.row.authorized_scope" :key="$index">
                        {{$index!==0?',':''}}{{authorizedScopeListFilter(item)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="续签条件" prop="renew_condition"></el-table-column>
            <el-table-column label="备注" prop="comment"></el-table-column>
            <el-table-column label="代理文件列表">
                <template slot-scope="scope">
                    <FileListShow
                            :isMinio="true"
                            :module_id="scope.row.id"
                            module_name="brand_agency"
                            :subsystem="queryId">
                    </FileListShow>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time | zerosoCompanyTime}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="clickDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增代理信息</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="代理信息" :visible.sync="dialogShow" width="800px" top="30px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="厂家联系人" prop="contact_user_id">
                    <el-select v-model="addForm.contact_user_id">
                        <el-option
                                v-for="item in contactUserList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name">
                        </el-option>
                    </el-select>
                    <p v-if="!manufactruerId" class="red">该品牌未绑定制造商，无法获取厂家联系人，请先添加制造商</p>
                </el-form-item>
                <el-form-item label="谈判人" prop="negotiator_id">
                    <SelectLoginUser
                            :userId.sync="addForm.negotiator_id"
                            :user="addForm.negotiator"
                            :option="addForm.negotiator_id ? [addForm.negotiator] : null">
                    </SelectLoginUser>
                </el-form-item>
                <el-form-item label="签订日期" prop="sign_date">
                    <el-date-picker
                            v-model="addForm.sign_date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="签订日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="代理时间" prop="agencyDate">
                    <el-date-picker
                            v-model="addForm.agencyDate"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            unlink-panels>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="授权公司" prop="authorized_company_id">
                    <el-select v-model="addForm.authorized_company_id">
                        <el-option :value="9428" label="ZNS GmbH"></el-option>
                        <el-option :value="1" label="零搜科技（深圳）有限公司"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授权范围" prop="authorized_scope">
                    <el-checkbox-group v-model="addForm.authorized_scope">
                        <el-checkbox
                                v-for="item in authorizedScopeList"
                                :key="item.code"
                                :label="item.code">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="续签条件" prop="renew_condition">
                    <el-input type="textarea" :rows="4" v-model="addForm.renew_condition"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                    <el-input type="textarea" :rows="4" v-model="addForm.comment"></el-input>
                </el-form-item>
                <el-form-item label="代理文件列表">
                    <FileListShow
                            ref="fileListShow"
                            :isMinio="true"
                            :module_id="addForm.id"
                            module_name="brand_agency"
                            :subsystem="queryId"
                            :showDelete="true">
                    </FileListShow>
                    <FileUpload
                            ref="fileUpdate"
                            :isMinio="true"
                            fileNamePrefix="brand_agency-"
                            :module_id.sync="addForm.id"
                            module_name="brand_agency"
                            :subsystem="queryId">
                    </FileUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        props: ['queryId','manufactruerId'],
        data() {
            return {
                loading: false,
                listData: [],


                dialogShow: false,
                addForm: {},
                addFormRule: {
                    contact_user_id: [
                        {required: true, message: '请选择厂家联系人！'}
                    ],negotiator_id: [
                        {required: true, message: '请选择谈判人！'}
                    ],sign_date: [
                        {required: true, message: '请选择签订日期！'}
                    ],agencyDate: [
                        {required: true, message: '请选择代理时间！'}
                    ],authorized_company_id: [
                        {required: true, message: '请选择授权公司！'}
                    ],authorized_scope: [
                        {required: true, message: '请选择授权范围！'},
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value || value.length===0) {
                                    callback(new Error('请选择授权范围！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },


                contactUserList: [],

                authorizedScopeList:[
                    {
                        label:"全球",
                        code:'world',
                    },{
                        label:"欧洲",
                        code:'europe',
                    },{
                        label:"亚洲",
                        code:'asia',
                    },{
                        label:"中国",
                        code:'china',
                    },{
                        label:"德国",
                        code:'germany',
                    },
                ],
            }
        },
        watch: {
            queryId () {
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
                self.listData= [];
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/agency',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },

            //新建
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    brand_uid: this.queryId,
                    contact_user_id: '',
                    negotiator_id: '',
                    authorized_company_id: '',
                    authorized_scope:[],
                    sign_date: '',
                    renew_condition: '',
                    comment: '',
                    start_date: '',
                    end_date: '',
                    agencyDate: [],
                };
                this.getContactUserList();
                this.$nextTick(()=>{
                    this.$refs.fileListShow.update();
                })
            },
            //编辑
            clickEdit(item) {
                this.addForm = JSON.parse(JSON.stringify(item));
                if(this.addForm.start_date && this.addForm.end_date) {
                    this.addForm.agencyDate = [this.addForm.start_date,this.addForm.end_date]
                }
                this.dialogShow = true;
                this.getContactUserList();
                this.$nextTick(()=>{
                    this.$refs.fileListShow.update();
                })
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(self.addForm.agencyDate && self.addForm.agencyDate.length>0){
                            self.addForm.start_date = self.addForm.agencyDate[0]
                            self.addForm.end_date = self.addForm.agencyDate[1]
                        }
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.new_product_basic_product_brand + '/' + self.queryId + '/agency/'+ self.addForm.id : self.$api.new_product_basic_product_brand + '/' + self.queryId + '/agency',
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success (data) {
                                self.$refs.fileUpdate.submitUpload(data.msg.id || self.addForm.id,()=>{
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    self.getListData();
                                });
                            }
                        });
                    }
                });
            },



            //删除
            clickDelete(id){
                let self = this;
                self.$confirm('确定删除？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/agency/'+ id,
                                type: 'DELETE',
                                success () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }
                            });
                        }
                    }
                })
            },


            getContactUserList() {
                let self = this;
                if(self.manufactruerId){
                    self.loading = true;
                    self.$http({
                        url: self.$api.partner_companies_detail + '/' + self.manufactruerId + '/partner_users',
                        success: function (data) {
                            self.loading = false;
                            if (data.msg) {
                                self.contactUserList = data.msg;
                            }
                        }
                    })
                }
            },

            authorizedScopeListFilter(value){
                let str = '';
                this.authorizedScopeList.forEach((item) => {
                    if (item.code === value) {
                        str = item.label;
                    }
                });
                return str ? str : value;
            },

        }
    }
</script>

<style lang="scss">

</style>
