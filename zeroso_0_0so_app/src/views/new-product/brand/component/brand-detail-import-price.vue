<template>
    <div class="brand-detail-import-price" v-loading="loading">
        <div class="clearfix padding-bottom-10">
            <el-button class="left" type="primary" @click="showImportExcel">价格表导入（.txt文件）</el-button>
            <div class="right">
                <el-pagination
                        @current-change="getListData"
                        @size-change="getListData"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNum"
                        :total="totalCount"
                        :layout="$store.state.paginationLayOut"
                        :pager-count="5"
                        background>
                </el-pagination>
            </div>
        </div>
        <el-table :data="listData" border>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名"></el-table-column>
            <el-table-column prop="fileSize" label="文件大小(KB)">
                <template slot-scope="scope" v-if="scope.row.fileSize">
                    {{scope.row.fileSize}}KB
                </template>
            </el-table-column>
            <el-table-column label="供应商">
                <template slot-scope="scope" v-if="scope.row.supplierCompany">
                    {{scope.row.supplierCompany.company_name}}
                </template>
            </el-table-column>
            <el-table-column prop="count" label="价格表产品数"></el-table-column>
            <el-table-column prop="countBeforeImport" label="导入前产品数"></el-table-column>
            <el-table-column prop="countAfterImport" label="导入后产品数"></el-table-column>
            <el-table-column prop="countOfError" label="导入失败产品数"></el-table-column>
            <el-table-column prop="errorLog" label="导入记录">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.countOfError" size="mini"
                               @click="openErrorProduct(scope.row.id)">查看出错产品记录
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="跟进人">
                <template slot-scope="scope" v-if="scope.row.operatorUser && scope.row.operatorUser.name">
                    {{scope.row.operatorUser.name}}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="导入时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | zerosoCompanyTime}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="导入状态">
                <template slot-scope="scope">
                    <el-tag :type="importStateTagType[scope.row.status]">
                        {{importStateList[scope.row.status]}}
                        <i class="el-icon-loading" v-if="scope.row.status===4"></i>
                        <el-tooltip placement="top" v-if="scope.row.status===4">
                            <i class="el-icon-question"></i>
                            <div slot="content" style="line-height: 1.5em">
                                <p>注意：若状态为导入中，则表示后台正在执行导入操作，请稍后再查看</p>
                                <p>因产品数量较多时，会花费较长时间，几分钟或十几分钟不等，当系统操作完后会自动变更状态为完成！</p>
                            </div>
                        </el-tooltip>
                    </el-tag>

                    <i class="el-icon-refresh el-icon-normal cursor-pointer" title="刷新" v-if="scope.row.status===4"
                       @click="updateListData()"></i>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" v-if="scope.row.status === 0" @click="exportPriceSubmit(scope.row)">
                        导入
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="导入价格表" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false" v-loading="loading">
            <el-form label-width="100px">
                <el-form-item label="供应商" required>
                    <el-select v-model="selectSupplierId" @change="supplierChange">
                        <el-option
                                v-for="item in supplierListData"
                                :key="item.id"
                                :label="item.company_info_with_follower.company_name"
                                :value="item.company_info_with_follower.account_company_id">
                            <span>{{item.company_info_with_follower.company_name}}</span>
                            <el-tag size="mini" v-if="item.is_default">推荐</el-tag>
                        </el-option>
                    </el-select>
                    <p class="red" v-if="!supplierListData || supplierListData.length===0">该品牌未添加供应商</p>
                </el-form-item>
                <el-form-item label="文件" required>
                    <p>只允许导入.txt文件，单次只允许导入1个文件</p>
                    <FileUpload
                            :autoUpload="false"
                            :show-file-list="true"
                            :updateFileList.sync="updateFileList"
                            :fileNamePrefix="fileNamePrefix"
                            :multiple="false"
                            :limit="1"
                            :accept="['text/plain']"
                            module_id="0"
                            module_name="product_import"
                            subsystem="product"
                            ref="importPrice">
                    </FileUpload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="clickImportExcel">导入表格</el-button>
                <el-button @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>


        <el-dialog title="查看出错产品记录" :visible.sync="errorProductDialogShow" width="1200px">
            <div class="clearfix padding-bottom-10">
                <div class="right">
                    <el-pagination
                            @current-change="getErrorProductLog()"
                            @size-change="getErrorProductLog()"
                            :page-size.sync="errorProductPageSize"
                            :current-page.sync="errorProductPageNum"
                            :total="errorProductTotalCount"
                            :layout="$store.state.paginationLayOut"
                            :pager-count="5"
                            background>
                    </el-pagination>
                </div>
            </div>
            <el-table :data="errorProductList" border height="550px" v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="lineNum" label="出错行" width="100"></el-table-column>
                <el-table-column prop="record" label="行内容"></el-table-column>
                <el-table-column prop="errorMsg" label="错误信息"></el-table-column>
            </el-table>
            <b>
                1、出错行：在原txt文件中第几行出错； 2、行内容：出错行的内容； 3、错误信息：程序提示错误原因
            </b>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="errorProductDialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        props: ['queryId', 'brandDetailForm'],
        data() {
            return {
                loading: false,
                serviceLoading: false,

                listData: [],

                pageSize: 10,
                pageNum: 1,
                totalCount: 0,

                dialogShow: false,
                updateFileList: [],
                fileNamePrefix: '',

                errorProductDialogShow: false,
                errorRowId: '',
                errorProductList: [],
                errorProductPageSize: 10,
                errorProductPageNum: 1,
                errorProductTotalCount: 0,

                importStateList: {
                    0: '草稿',
                    1: '成功',
                    2: '部分成功',
                    3: '失败',
                    4: '导入中'
                },
                importStateTagType: {
                    0: 'info',
                    1: 'success',
                    2: 'warning',
                    3: 'danger',
                    4: 'warning'
                },


                supplierListData:[],
                selectSupplierId:null,

            }
        },
        watch: {
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
                    this.dialogShow = false;
                    this.errorProductDialogShow = false;
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_import + '/' + self.queryId + '/price',
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
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

            updateListData() {
                this.loading = true;
                setTimeout(() => {
                    this.getListData();
                }, 300)
            },


            //打开导入文件弹窗
            showImportExcel() {
                this.dialogShow = true;
                this.updateFileList = [];
                this.getSupplierListData();
                this.$nextTick(() => {
                    this.$refs.importPrice.clearFiles();
                })
            },

            //确定导入
            clickImportExcel() {
                let self = this;
                if(!self.selectSupplierId){
                    self.$message({
                        showClose: true,
                        message: '请选择供应商！',
                        type: 'error'
                    });
                    return
                }
                self.$confirm('确定导入该文件吗？在导入之前请先确保文件内容正确', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$refs.importPrice.submitUpload(null, (number) => {
                                if (number === 0) {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '请先选择文件！',
                                        type: 'error'
                                    });
                                } else {
                                    for (let i = 0; i < self.updateFileList.length; i++) {
                                        self.submitFileToSetPrice(self.updateFileList[i]);
                                    }
                                }

                            })
                        }
                    }
                })
            },
            //将上传的文件信息，提交给价格解析接口
            submitFileToSetPrice(fileForm) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_import_price + '/' + self.queryId,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        "brand_id": self.queryId,
                        "current_user_id": self.$store.state.currentCompany.user_id,
                        "file_id": fileForm.id,
                        "file_name": fileForm.file_name,
                        "file_size": fileForm.file_size,
                        "supplier_id": self.selectSupplierId
                    },
                    success: function () {
                        self.dialogShow = false;
                        self.pageNum = 1;
                        self.getListData();
                        self.$message({
                            showClose: true,
                            message: '导入成功！',
                            type: 'success'
                        });
                    }
                });
            },


            //获取当前品牌绑定的供应商，判断当前供应商是否是推荐供应商，以此判断是否锁定
            getSupplierListData() {
                let self = this;
                this.supplierListData = [];
                this.selectSupplierId = null;
                this.fileNamePrefix = null;
                self.$http({
                    url: self.$api.product_brand_v5 + '/' + self.queryId + '/suppliers',
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.supplierListData=data.msg;
                            self.selectSupplierId = self.supplierListData[0].company_info_with_follower.account_company_id;
                            for (let i = 0; i < self.supplierListData.length; i++) {
                                if (self.supplierListData[i].is_default && self.supplierListData[i].company_info_with_follower) {
                                    self.selectSupplierId = self.supplierListData[i].company_info_with_follower.account_company_id;
                                }
                            }
                            self.supplierChange();
                        }
                    }
                })
            },
            supplierChange(){
                let self = this;
                self.fileNamePrefix = 'Price-' + self.brandDetailForm.name + '-' + self.selectSupplierId + '-' + self.$moment().format('YYYYMMDDHHmms');
            },


            exportPriceSubmit(row) {
                let self = this;
                self.$confirm('注意：请务必谨慎执行该操作，当前选择的推荐供应商是 <b class="red">' + (row.supplierCompany?row.supplierCompany.company_name:'') + '</b>，在执行导入之前，请确认价格表是否是该供应商提供的，如果不是，必须先将推荐供应商修改为提供价格表的供应商，否则执行导入后的价格将是错误价格！', '提示', {
                    confirmButtonText: '确定执行导入',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.serviceLoading = self.$loading({
                                lock: true,
                                text: '因产品数量较多时，会花费较长时间，几分钟或十几分钟不等，当系统操作完后会自动变更状态为完成，请耐心等待！',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            self.$http({
                                url: self.$api.product_import_price + '/' + row.id + '/performImport',
                                type: 'PUT',
                                requestBody: true,
                                data: {
                                    importId: row.id
                                },
                                success: function () {
                                    self.serviceLoading.close();
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }, error() {
                                    self.serviceLoading.close();
                                }
                            });
                        }
                    }
                })
            },

            openErrorProduct(id) {
                this.errorProductPageNum = 1;
                this.errorRowId = id;
                this.getErrorProductLog()
            },
            getErrorProductLog(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_import + '/' + self.queryId + '/price/' + self.errorRowId + '/error',
                    data: {
                        page: self.errorProductPageNum,
                        per_page: self.errorProductPageSize,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items) {
                            let errorProductList = data.msg.items;
                            for(let i=0;i<errorProductList.length;i++){
                                if(errorProductList[i].record){
                                    errorProductList[i].record = errorProductList[i].record.replace(/\t/g,' | ');
                                }
                            }
                            self.errorProductList = errorProductList;
                            self.errorProductTotalCount = data.msg.total;
                        } else {
                            self.errorProductList = [];
                            self.errorProductTotalCount = 0;
                        }
                        self.errorProductDialogShow = true;
                    }
                });
            },

        }
    }
</script>

<style lang="scss">
    .brand-detail-import-price {

    }
</style>
