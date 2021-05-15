<template>
    <div class="select-report-template" v-clickoutside="clickoutside" v-loading="loading">
        <el-button type="primary" plain @click.native.stop="showList">
            导出报表
            <i class="el-icon-arrow-down"></i>
        </el-button>
        <ul class="select-report-template-list" v-show="listShow">
            <li v-for="(item,$index) in reportTemplateList" :key="$index" @click="selectTemplate(item)">{{item.file_name}}</li>
        </ul>

        <el-dialog title="报告" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body v-loading="loading">
            <div style="text-align: center;">
                <p class="padding-bottom-20">{{reportForm.file_name}}</p>
                <div>
                    <a :href="reportForm.href" target="_blank" class="margin-right-20">
                        <el-button type="primary">
                            <i class="el-icon-view"> </i>
                            预览
                        </el-button>
                    </a>
                    <a :href="reportForm.href" target="_blank" :download="reportForm.file_name">
                        <el-button type="success">
                            <i class="el-icon-download"> </i>
                            下载
                        </el-button>
                    </a>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import reportService from './reportService'
    
    import clickoutside from 'element-ui/src/utils/clickoutside'

    export default {
        components: {},
        props: ['accountCompanyId','nextAccountCompanyId','reportData','module_name','subsystem', 'profession_type'],
        directives: {clickoutside},
        data() {
            return {
                isGetData: false,

                reportTemplateList: [],

                listShow: false,

                reportForm:{

                },

                dialogShow: false,

                loading: false,
            }
        },
        watch:{
            reportData(){
                this.isGetData=false;
                this.listShow=false;
                this.dialogShow=false;
            }
        },
        created() {

        },
        methods: {
            showList() {
                if (!this.listShow) {
                    this.listShow = true;
                    this.getReportTemplateList();
                } else {
                    this.listShow = false;
                }
            },
            getReportTemplateList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_report_templates_search,
                    data: {
                        account_company_ids: self.accountCompanyId + (self.nextAccountCompanyId ? ','+self.nextAccountCompanyId : ''),
                        module_name: self.module_name,
                        profession_type: self.profession_type,
                        subsystem: self.subsystem,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.isGetData = true;
                            self.reportTemplateList = data.msg.items;
                        }
                    }
                })
            },
            selectTemplate(item) {
                let self = this;
                self.listShow = false;
                if(self.module_name==='invoice'){
                    reportService.invoiceReport(item,self.reportData,(requestData)=>{
                        self.createReport(requestData)
                    });
                }else if(self.module_name==='outgoing_transfer'){
                    reportService.stockOutReport(item,self.reportData,(requestData)=>{
                        self.createReport(requestData)
                    });
                }else {
                    reportService.bigOrderReport(item,self.reportData,self.accountCompanyId,(requestData)=>{
                        self.createReport(requestData)
                    });
                }

            },
            createReport(requestData){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_report_template_generate,
                    type: 'POST',
                    requestBody: true,
                    data: requestData,
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            data.msg.href= self.$api.file_report_template_download + "/" + data.msg.hash + "?" + "&file_name=" + data.msg.file_name + "&file_type=" + data.msg.file_type;
                            self.reportForm=data.msg;
                            self.dialogShow=true;
                        }else {
                            self.reportForm={};
                        }
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