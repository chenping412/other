<template>
    <div class="select-report-template">
        <div class="select-report-template" v-clickoutside="clickoutside" v-loading="loading">
            <el-button type="warning" :size="size" plain @click.native.stop="showList">
                {{ name || '发送邮件'}}
                <i class="el-icon-arrow-down"></i>
            </el-button>
            <ul class="select-report-template-list" v-show="listShow" :class="{'right':align==='right'}">
                <li v-for="(item,$index) in emailTemplateList" :key="$index" @click="selectTemplate(item)">{{item.name}}</li>
            </ul>
        </div>

        <el-dialog title="选择需要询价产品" :visible.sync="selectProductDialogShow" width="1200px" top="100px"
                   :close-on-click-modal="false">
            <div class="content">
                <el-table :data="productList" ref="selectProductTable"
                          @selection-change="tableSelectionChange"
                          @row-click="rowClick"
                          v-loading="loading" height="500px">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="type_no" label="型号"></el-table-column>
                    <el-table-column prop="order_no" label="订货号"></el-table-column>
                    <el-table-column prop="parameters" label="参数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="报价">
                        <template slot-scope="scope" v-if="scope.row.prodcut_quotation">
                            <p :class="{'red':scope.row.prodcut_quotation.procurement.price}">
                                {{scope.row.prodcut_quotation.procurement.price | formatMoney('EUR') | inquiryPriceNormalText}}
                            </p>
                            <el-tag type="danger" effect="dark" v-if="scope.row.mark_as_deleted">已删除</el-tag>
                            <el-tag type="danger" effect="dark" v-if="scope.row.prodcut_quotation.procurement.price">已有报价</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="650px">
                        <template v-slot:header>
                            <table class="tiered-price-edit-table">
                                <thead>
                                <tr>
                                    <th>最小起订量</th>
                                    <th>面价</th>
                                    <th>优惠折扣</th>
                                    <th>货期(天)</th>
                                    <th>有效期</th>
                                    <th></th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <tiered-price-edit :scopeRow.sync="scope.row"> </tiered-price-edit>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showWriteEmail(selectEmailTemplateItem)">下一步</el-button>
                <el-button @click="selectProductDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <edit-email
                :show.sync="editEmailShow"
                :emailTemplate="emailTemplate"
                :module_name="module_name"
                :subsystem="subsystem"
                :module_id="module_id">
        </edit-email>
    </div>
</template>

<script>
    import reportService from './reportService'
    import EditEmail from "../../views/email/editEmail";

    import clickoutside from 'element-ui/src/utils/clickoutside'
    import TieredPriceEdit from "./../../views/inquiry-price/component/tieredPriceEdit";

    export default {
        components: {TieredPriceEdit, EditEmail},
        props: ['inquiryData','quoteInquiryData', 'name', 'module_name', 'module_id', 'subsystem', 'errorMessage', 'mastSelectProduct', 'supplierListData', 'supplierNormalSelectId','size','align'],
        directives: {clickoutside},
        data() {
            return {
                isGetData: false,

                emailTemplateList: [],
                selectEmailTemplateItem: {},
                listShow: false,

                editEmailShow: false,
                emailTemplate: {},

                loading: false,

                selectProductDialogShow: false,
                productList: [],
                selectProductList: [],

            }
        },
        watch:{
            module_id(){
                this.isGetData=false;
                this.listShow=false;
                this.editEmailShow=false;
                this.selectProductDialogShow=false;
            }
        },
        created() {

        },
        methods: {
            showList() {
                if (this.errorMessage) {
                    this.$message({
                        showClose: true,
                        message: this.errorMessage,
                        type: 'error'
                    });
                    return
                }
                if (!this.listShow) {
                    this.listShow = true;
                    this.getEmailTemplateList();
                } else {
                    this.listShow = false;
                }

                let productList = [];
                if (this.inquiryData && this.inquiryData.products) {
                    this.inquiryData.products.forEach((item) => {
                        if (item.valid && !item.replaced) {
                            productList.push(item)
                        }
                    })
                }else if(this.quoteInquiryData && this.quoteInquiryData.products){
                    this.quoteInquiryData.products.forEach((item) => {
                        if (item.product_quote_state!=='INVALID' && item.product_quote_state!=='REPLACED') {
                            productList.push(item)
                        }
                    })
                }
                this.productList = productList;
                this.selectProductList = productList;
            },

            getEmailTemplateList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_mail_templates,
                    data: {
                        account_company_ids: '9428',
                        module_name: 'inquiry_pool',
                        profession_type: 'to_customer_supplier',
                        subsystem: 'inquiry',
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.isGetData = true;
                            self.emailTemplateList = data.msg.items;
                        }
                    }
                })
            },

            selectTemplate(item) {
                let self = this;
                self.listShow = false;
                self.selectEmailTemplateItem = item;

                if (this.mastSelectProduct) {
                    this.selectProductDialogShow = true;
                    this.$nextTick(() => {
                        this.$refs.selectProductTable.toggleAllSelection();
                    })
                } else {
                    this.showWriteEmail(self.selectEmailTemplateItem)
                }
            },

            
            tableSelectionChange(val) {
                this.selectProductList = val;
            },
            rowClick(row) {
                this.$refs.selectProductTable.toggleRowSelection(row);
            },
            showWriteEmail(item) {
                let self = this;
                self.selectProductDialogShow = false;
                reportService.setInquiryEmail(item, self.inquiryData || self.quoteInquiryData, self.selectProductList, (requestData) => {
                    console.log(requestData.data.party_b.account_company.state)
                    if(['no_such_company','not_recommend'].indexOf(requestData.data.party_b.account_company.state)>-1){
                        self.$confirm('<b class="red">供应商等级为：无效、不推荐</b>，确定要发送邮件吗？', '提示', {
                            dangerouslyUseHTMLString:true,
                            confirmButtonText: '确定发邮件',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.showWriteEmailSubmit(item,requestData);

                                }
                            }
                        });
                        return
                    }
                    self.showWriteEmailSubmit(item,requestData);
                });
            },
            showWriteEmailSubmit(item,requestData) {
                let self = this;
                self.loading = true;
                    self.$http({
                        url: self.$api.file_mail_templates + '/' + item.id,
                        type: 'POST',
                        requestBody: true,
                        data: requestData,
                        success: function (data) {
                            self.loading = false;
                            if (requestData.data.party_b.account_company.email) {
                                data.msg.mail_to = [requestData.data.party_b.account_company.email]
                            }
                            if (data.msg) {
                                if (data.msg.report) {
                                    self.createReportTemplate(requestData, data.msg)
                                } else {
                                    self.emailTemplate = {
                                        id: '',
                                        mail_to: data.msg.mail_to || [],
                                        mail_cc: [],
                                        mail_bcc: [],
                                        message_subject: data.msg.subject,
                                        mail_from: data.msg.mail_from || '',
                                        updateFiles: data.msg.updateFiles || [],
                                        message_body_html: data.msg.body_html,
                                    };
                                    self.editEmailShow = true;
                                }
                            }
                        }
                    });
            },


            createReportTemplate(requestData, emailTemplate) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_report_template_generate,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        id: emailTemplate.report.id.toString(),
                        file_name: requestData.file_name,
                        data: requestData.data,
                        is_permanent: true,
                    },
                    success: function (data) {
                        self.loading = false;
                        self.copyReportTemplateFile(emailTemplate, data.msg || {})
                    }, error() {
                        self.emailTemplate = {
                            id: '',
                            mail_to: emailTemplate.mail_to || [],
                            mail_cc: [],
                            mail_bcc: [],
                            message_subject: emailTemplate.subject,
                            mail_from: emailTemplate.mail_from || '',
                            updateFiles: emailTemplate.updateFiles || [],
                            message_body_html: emailTemplate.body_html,
                        };
                        self.editEmailShow = true;
                    }
                });
            },
            copyReportTemplateFile(emailTemplate, reportData) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        subsystem: 'message',
                        module_name: 'message',
                        module_id: "0",
                        relation_ids: reportData.hash.toString(),
                        mode: "copy",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            emailTemplate.updateFiles = data.msg.items;
                        }
                        self.emailTemplate = {
                            id: '',
                            mail_to: emailTemplate.mail_to || [],
                            mail_cc: [],
                            mail_bcc: [],
                            message_subject: emailTemplate.subject,
                            mail_from: emailTemplate.mail_from || '',
                            updateFiles: emailTemplate.updateFiles || [],
                            message_body_html: emailTemplate.body_html,
                        };
                        self.editEmailShow = true;
                    }
                });
            },


            clickoutside() {
                this.listShow = false;
            },
        },
    }
</script>

<style lang="scss">
    @import "select-report";
</style>