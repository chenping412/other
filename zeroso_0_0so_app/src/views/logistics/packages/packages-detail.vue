<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">仓库 / 快递签收</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? detailForm.delivery_mail_no : '创建快递签收'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20">运单号/trackId：{{detailForm.delivery_mail_no}}</span>
                        <el-tag v-if="detailForm.status">{{detailForm.status|logisticsV4PackgeState}}</el-tag>

                        <email-message-count-button
                                v-if="queryId"
                                class="margin-left-20"
                                :module_id="queryId"
                                module_name="delivery_package"
                                subsystem="logistics">
                        </email-message-count-button>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination apiKey="logistics_delivery_packages" :listApi="$api.order_delivery_packages + '/search'"></DetailPagination>

                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="180px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="50">
                        <el-col :span="10">
                            <el-form-item label="运单号/trackId：" prop="delivery_mail_no">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.delivery_mail_no"></el-input>
                                <div v-else class="form-border-bottom">{{detailForm.delivery_mail_no}}</div>
                            </el-form-item>
                            <el-form-item label="收货公司/receiving company：" prop="receive_company_id">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.receive_company_id">
                                    <el-option v-for="(item,$index) in $store.state.currentCompanyList"
                                               :key="$index"
                                               :label="item.company_name"
                                               :value="item.account_company_id">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.receive_company?detailForm.receive_company.company_name:null}}</span>
                            </el-form-item>
                            <el-form-item label="时间/time：" prop="create_time">
                                <span class="form-border-bottom">{{detailForm.create_time|zerosoCompanyTime|defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="备注/note：" prop="content">
                                <el-input type="textarea" :rows="5" v-if="!queryId || isEdit" v-model="detailForm.content"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.content | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="箱号：">
                                <template v-if="detailForm.box_list">
                                    <router-link class="margin-right-20"
                                                 v-for="(item,$index) in detailForm.box_list"
                                                 :key="$index" :to="'/logistics/box/order/detail?id='+item.id"
                                    >{{item.box_name}}</router-link>
                                </template>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="包裹重量/packWeight：">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.buy_weight"></InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.buy_weight | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="供应商/supplier：">
                                <SelectPartnerCompanyOnly
                                        v-if="!queryId || isEdit"
                                        :partnerId.sync="detailForm.partner_company_id"
                                        :partner.sync="detailForm.partner_company"
                                        :option="detailForm.partner_company_id ? [detailForm.partner_company] :null"
                                        @change="partnerChange">
                                </SelectPartnerCompanyOnly>
                                <span v-else class="form-border-bottom">{{detailForm.partner_company ? detailForm.partner_company.company_name : null}}</span>
                            </el-form-item>
                            <el-form-item label="寄件人/sender：">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.sender_name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.sender_name | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <div style="text-align: center;padding: 20px 0;" v-if="queryId">

                        <template v-if="detailForm.status==='draft'">
                            <el-button type="primary"
                                       v-for="(btn,$index) in actionObj['draft']"
                                       :key="$index"
                                       @click="updatePackageState(btn.action)">
                                {{btn.name}}
                            </el-button>
                        </template>

                        <template v-if="detailForm.status!=='draft'">
                            <el-button plain :type="btn.action==='done' ? 'success' : 'primary'"
                                       v-for="(btn,$index) in actionObj['other']"
                                       :key="$index"
                                       @click="updatePackageState(btn.action)">
                                {{btn.name}}
                            </el-button>
                        </template>

                    </div>

                </el-form>
            </div>
        </div>


        <el-card v-if="queryId && ['abnormal', 'draft', 'received'].indexOf(detailForm.status) > -1">
            <h3 slot="header">入库列表</h3>

            <stock-in-list :delivery_package_id="queryId"></stock-in-list>
        </el-card>

    </div>
</template>

<script>

    import StockInList from "../stockIn/stockIn-list";
    import EmailMessageCountButton from "../../related-message/email-message-count-button";
    export default {
        components: {EmailMessageCountButton, StockInList},
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {
                    partner_company: {},
                    receive_company: {},
                },
                detailFormRule: {
                    delivery_mail_no: [
                        {required: true, message: '请输入运单号/trackId！'}
                    ],
                },

                actionObj: {
                    "draft": [{name: "签收/receive", action: "received"}],
                    "other": [
                        {name: "完成/done", action: "done"},
                        {name: "验货异常/Cargo Bad", action: "abnormal"},
                        {name: "退回/returns", action: "returned"},
                        {name: "取消/cancel", action: "canceled"},],

                },

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
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
                        partner_company: {},
                        receive_company: {},
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.order_delivery_packages + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if(!data.msg.partner_company) data.msg.partner_company={};
                            if(!data.msg.receive_company) data.msg.receive_company={};
                            self.detailForm = data.msg;
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.queryId ? self.$api.order_delivery_packages + '/' + self.queryId : self.$api.order_delivery_packages,
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.isEdit = false;
                                    if(self.queryId){
                                        self.getDetailData();
                                    }else if (data.msg.id){
                                        self.$router.push({
                                            path: 'detail',
                                            query: {
                                                id: data.msg.id,
                                            }
                                        });
                                    }
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
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },


            partnerChange(partner){
                if(partner && partner.company_name){
                    this.detailForm.sender_name = partner.company_name
                }
            },


            //更新包裹状态
            updatePackageState(state){
                let self = this;
                if (state === 'abnormal' || state === 'returned' || state === 'canceled') {
                    let title,text;
                    if (state === 'abnormal') {
                        title = '请将包裹存放到异常区!!!';
                        text = '请填写异常原因：';
                    } else if (state === 'returned') {
                        title = '请确定包裹已发回!!!';
                        text = '请记录，发货时间、快递单号：';
                    } else if (state === 'canceled') {
                        title = '取消';
                        text = '请输入详细取消原因：';
                    }
                    self.$prompt(text, title, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputType:'textarea',
                        inputValidator(value){
                            return !value ? text : true
                        }
                    }).then(({ value }) => {
                        self.updatePackageStateSubmit(state,value)
                    }).catch(()=>{

                    });
                } else {
                    this.updatePackageStateSubmit(state)
                }

            },
            updatePackageStateSubmit(state,message){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_delivery_packages + '/' + self.queryId + '/action',
                    type:'PUT',
                    requestBody: true,
                    data:{
                        id: self.queryId,
                        message: message,
                        name: state,
                    },
                    success () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                })
            }


        }
    }
</script>

<style lang="scss">

</style>
