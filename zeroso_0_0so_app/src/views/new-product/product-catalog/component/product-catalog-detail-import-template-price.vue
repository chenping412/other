<template>
    <div v-loading="loading">
        <div>
            <FileListShow
                    ref="priceTemplateFileShow"
                    :isMinio="true"
                    :updateFileList.sync="templatePriceFileList"
                    :module_id="detailForm.uid"
                    module_name="price_template_file"
                    :subsystem="detailForm.brand_uid"
                    :showDelete="canImportTemplate">
            </FileListShow>
            <FileUpload
                    v-if="canImportTemplate"
                    class="inline-block margin-right-10"
                    ref="priceTemplateFileUpdate"
                    :isMinio="true"
                    :autoUpload="true"
                    :isOnlyOne="true"
                    :show-file-list="false"
                    :accept="['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel']"
                    :module_id.sync="detailForm.uid"
                    module_name="price_template_file"
                    :subsystem="detailForm.brand_uid"
                    @uploadSuccess="uploadSuccess">
            </FileUpload>
            <template v-if="templatePriceFileList.length>0 && showVerifyButton">
                <el-button size="mini" type="warning" plain @click="clickVerifyTemplate()">重新检测模板</el-button>
                <el-button size="mini" plain v-if="verifyResultCode==='no'" @click="clickShowErrata()">查看出错记录</el-button>
                <span class="green margin-left-10" v-if="verifyResultCode==='yes'">
                    <i class="el-icon-circle-check"></i>
                    已通过检测
                </span>
                <span class="red margin-left-10" v-if="verifyResultCode==='no'">
                    <i class="el-icon-circle-close"></i>
                    未通过检测
                </span>
            </template>
        </div>


        <el-dialog title="查看出错记录" :visible.sync="dialogShow" :close-on-click-modal="false" width="1200px" top="30px">
            <div class="clearfix padding-bottom-10">
                <div class="right">
                    <el-pagination
                            @current-change="getTemplateErrataData()"
                            @size-change="getTemplateErrataData()"
                            :page-size.sync="pageSize"
                            :current-page.sync="pageNum"
                            :total="totalCount"
                            :layout="$store.state.paginationLayOut"
                            :pager-count="5"
                            background>
                    </el-pagination>
                </div>
            </div>
            <el-table :data="listData" border height="550px" v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="row_number" label="出错行" width="100"></el-table-column>
                <el-table-column prop="error_cell" label="出错列" width="150"></el-table-column>
                <el-table-column prop="row_content" label="行内容"></el-table-column>
                <el-table-column prop="error_message" label="错误信息"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        props: ['detailForm','canImportTemplate','showVerifyButton'],
        data() {
            return {
                loading: false,

                listData:[],
                pageNum:1,
                pageSize:10,
                totalCount:0,
                dialogShow: false,

                templatePriceFileList:[],

                verifyResultCode:null,
            }
        },
        watch: {
            detailForm () {
                this.init()
            },
            templatePriceFileList(val){
              this.$emit("update:templatePriceFileList",val)
            },
            verifyResultCode(val){
              this.$emit("update:verifyResultCode",val)
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.verifyResultCode = null;
                this.dialogShow = false;
                if(this.showVerifyButton){
                    this.getTemplateErrataData();
                }
            },

            uploadSuccess(){
                if(this.$refs.priceTemplateFileShow){
                    this.$refs.priceTemplateFileShow.update();
                }
                this.verifyTemplateSubmit(true);
            },

            clickVerifyTemplate(){
                let self = this;
                if(self.templatePriceFileList.length === 0){
                    self.$message({
                        showClose: true,
                        message: '未上传模板产品目录！',
                        type: 'error'
                    });
                    return
                }
                self.verifyTemplateSubmit();
            },
            verifyTemplateSubmit(isClearVerify){
                let self = this;
                if(self.detailForm.uid){
                    self.loading = true;
                    self.$http({
                        url: self.$api.new_product_catalog_product_template + '/' + self.detailForm.uid + (isClearVerify ? '/clear_verify' : '/verify'),
                        success (data) {
                            self.loading = false;
                            self.verifyResultCode = data.msg ? 'yes' : 'no';
                            if(!data.msg){
                                self.clickShowErrata();
                            }else {
                                self.$message({
                                    showClose: true,
                                    message: '模板产品目录校测通过，可以进行下一步操作！',
                                    type: 'success'
                                });
                            }
                        },error(){
                            self.verifyResultCode = 'no';
                        }
                    })
                }
            },



            clickShowErrata(){
                this.dialogShow = true;
                this.getTemplateErrataData();
            },
            getTemplateErrataData() {
                let self = this;
                if(self.detailForm.uid) {
                    self.loading = true;
                    self.$http({
                        url: self.$api.new_product_catalog_product_template + '/errata/' + self.detailForm.uid,
                        data: {
                            page: self.pageNum,
                            per_page: self.pageSize,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.msg && data.msg.items) {
                                self.listData = data.msg.items;
                                self.totalCount = data.msg.total;
                                if(self.listData.length>0){
                                    self.verifyResultCode = 'no';
                                }
                            } else {
                                self.listData = [];
                                self.totalCount = 0;
                            }
                        }
                    })
                }
            },
        }
    }
</script>

<style lang="scss">

</style>
