<template>
    <div class="flex-box-column brand-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">产品中心 / 产品目录管理</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '产品目录详情' : '新增产品目录'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span v-if="!queryId">
                            基础信息
                        </span>
                        <div v-else>
                            <span class="margin-right-20">产品目录编号：{{detailForm.uid}}</span>
                            <NewProductProductCatalogState :state="detailForm.state"></NewProductProductCatalogState>
                        </div>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">

                                    <el-button size="mini"
                                               v-if="['to_be_audited','auditing','audited'].indexOf(detailForm.state)>-1"
                                               @click="clickExportExcel()">
                                        导出产品目录
                                    </el-button>

                                    <el-button v-for="(item,$index) in thisStateActions"
                                               :type="item.type"
                                               :key="$index"
                                               size="mini"
                                               @click="clickAction(item.action)">
                                        {{item.name}}
                                    </el-button>

                                    <el-button type="primary" size="mini"
                                               :disabled="!canEditState"
                                               @click="clickEdit()">
                                        编辑
                                    </el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination
                                v-if="queryId"
                                :isNewSystem="true"
                                :noResellerCompanyId="true"
                                requestType="POST"
                                :listApi="$api.new_product_catalog_product_catalog_list">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="9">
                            <el-form-item label="品牌：" prop="brand_uid">
                                <SelectNewBrand
                                        v-if="!queryId"
                                        :isNewProduct="true"
                                        :brandUid.sync="detailForm.brand_uid"
                                        :brand.sync="detailForm.brand"
                                        :option="detailForm.brand_uid?[detailForm.brand]:null">
                                </SelectNewBrand>
                                <div v-else class="form-border-bottom">
                                    <template v-if="detailForm.brand">
                                        <router-link class="blue" :to="'/new-product/brand/detail?id='+detailForm.brand.uid">
                                            {{detailForm.brand.name}}
                                        </router-link>
                                        <BrandLever class="margin-left-10" :state="detailForm.brand.state"></BrandLever>
                                    </template>
                                </div>
                            </el-form-item>
                            <el-form-item label="供应商：" prop="supplier_id">
                                <SelectPartnerCompanyOnly
                                        v-if="!queryId"
                                        :partnerId.sync="detailForm.supplier_id"
                                        :partner="detailForm.supplier_company"
                                        :option="detailForm.supplier_id ? [detailForm.supplier_company] : null"
                                        @change="supplierCompanyChange">
                                </SelectPartnerCompanyOnly>
                                <div v-else class="form-border-bottom">
                                    <router-link class="blue"
                                                 :to="'/partner/detail?id='+detailForm.supplier_company.account_company_id"
                                                 v-if="detailForm.supplier_company">
                                        {{detailForm.supplier_company.company_name}}
                                    </router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="供应商联系人：" prop="supplier_contact_id">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.supplier_contact_id" clearable>
                                    <el-option v-for="(item,$index) in supplierCompanyUserList"
                                               :key="$index"
                                               :label="item.name"
                                               :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-else class="form-border-bottom">
                                    <span v-if="detailForm.supplier_contact_user">{{detailForm.supplier_contact_user.name}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="重量单位：" prop="weight_unit" v-if="queryId">
                                <el-select v-if="isEdit" v-model="detailForm.weight_unit" clearable>
                                    <el-option
                                            v-for="item in $store.state.weightUnit"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">
                                    {{detailForm.weight_unit | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="长度单位：" prop="length_unit" v-if="queryId">
                                <el-select v-if="isEdit" v-model="detailForm.length_unit" clearable>
                                    <el-option
                                            v-for="item in $store.state.lengthUnit"
                                            :key="item.code"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">
                                    {{detailForm.length_unit | defaultStr}}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="获取时间：" prop="acquired_date">
                                <el-date-picker
                                        v-if="!queryId || isEdit"
                                        v-model="detailForm.acquired_date"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="yyyy-MM-dd">
                                </el-date-picker>
                                <div v-else class="form-border-bottom">
                                    {{detailForm.acquired_date | zerosoCompanyDate | defaultStr}}
                                </div>
                            </el-form-item>
                            <el-form-item label="原始产品目录：">
                                <div class="form-border-bottom">
                                    <FileListShow
                                            ref="priceOriginFileShow"
                                            :isMinio="true"
                                            :updateFileList.sync="originPriceFileList"
                                            :module_id="detailForm.uid"
                                            module_name="price_origin_file"
                                            :subsystem="detailForm.brand_uid"
                                            :showDelete="!queryId || isEdit">
                                    </FileListShow>
                                    <FileUpload
                                            v-if="!queryId || isEdit"
                                            ref="priceOriginFileUpdate"
                                            :isMinio="true"
                                            :module_id.sync="detailForm.uid"
                                            module_name="price_origin_file"
                                            :subsystem="detailForm.brand_uid">
                                    </FileUpload>
                                </div>
                            </el-form-item>
                            <el-form-item label="模板产品目录：" v-if="detailForm.uid">
                                <div>
                                    <ProductCatalogDetailImportTemplatePrice
                                            :templatePriceFileList.sync="templatePriceFileList"
                                            :verifyResultCode.sync="verifyResultCode"
                                            :canImportTemplate="canImportTemplate"
                                            :showVerifyButton="showVerifyButton"
                                            :detailForm="detailForm">
                                    </ProductCatalogDetailImportTemplatePrice>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <div class="el-form-gray el-form-margin-small" v-if="queryId">
                                <el-form-item label="创建人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.creator">
                                            {{detailForm.creator.nick_name | defaultStr}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="制表人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.tabulator">
                                            {{detailForm.tabulator.nick_name | defaultStr}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="校对人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.collator">
                                            {{detailForm.collator.nick_name | defaultStr}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="审核人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.auditor">
                                            {{detailForm.auditor.nick_name | defaultStr}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="创建时间：">
                                    <div class="form-border-bottom">
                                        {{detailForm.create_time | zerosoCompanyTime}}
                                    </div>
                                </el-form-item>
                                <el-form-item label="修改时间：">
                                    <div class="form-border-bottom">
                                        {{detailForm.write_time | zerosoCompanyTime}}
                                    </div>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>


            <el-card class="margin-bottom-20">
                <div class="clearfix" slot="header">
                    <h3 class="left">使用说明</h3>
                    <div class="right" v-if="queryId">
                        <div v-if="!manualEdit">
                            <el-button type="primary" @click="manualEdit=true">编辑</el-button>
                        </div>
                        <div v-if="manualEdit">
                            <el-button type="success" @click="clickSaveManual()">保存</el-button>
                            <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                        </div>
                    </div>
                </div>

                <el-form label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="9">
                            <el-form-item label="型号字段：">
                                <el-input v-if="!queryId || manualEdit" v-model="detailForm.manual.type_field"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.manual.type_field | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="产品系列说明：">
                                <el-input v-if="!queryId || manualEdit" type="textarea" :rows="4" v-model="detailForm.manual.product_series"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.manual.product_series | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="订货号字段：">
                                <el-input v-if="!queryId || manualEdit" v-model="detailForm.manual.order_no_field"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.manual.order_no_field | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="其他说明：">
                                <el-input v-if="!queryId || manualEdit" type="textarea" :rows="4" v-model="detailForm.manual.other"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.manual.other | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-tabs type="card" class="car-box" v-if="detailForm.uid && !isEdit">
                <el-tab-pane label="产品列表" lazy>
                    <ProductCatalogDetailProduct ref="priceDetailProduct" :queryId="detailForm.uid" :brandUid="detailForm.brand_uid"></ProductCatalogDetailProduct>
                </el-tab-pane>
            </el-tabs>

        </div>


    </div>
</template>

<script>
    import ProductCatalogDetailProduct from "./component/product-catalog-detail-product";
    import ProductCatalogDetailImportTemplatePrice from "./component/product-catalog-detail-import-template-price";
    export default {
        components: {
            ProductCatalogDetailImportTemplatePrice,
            ProductCatalogDetailProduct,
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                manualEdit: false,
                parentQuery: '',

                detailForm: {
                    manual:{},
                    supplier_contact_id:"",
                },
                detailFormRule: {
                    brand_uid: [
                        {required: true, message: '请选择品牌！'}
                    ], supplier_id: [
                        {required: true, message: '请选择供应商！'}
                    ],acquired_date: [
                        {required: true, message: '请选择获取时间！'}
                    ],
                },

                loading: false,

                supplierCompanyUserList:[],
                thisStateActions:[],
                templatePriceFileList:[],
                originPriceFileList:[],

                verifyResultCode:null,

            }
        },
        computed: {
            canEditState(){
                return ['draft','to_be_tabulated','redo_tabulate','tabulating','import_failed'].indexOf(this.detailForm.state)>-1
            },
            canImportTemplate(){
                return ['tabulating','import_failed'].indexOf(this.detailForm.state)>-1
            },
            showVerifyButton(){
                return ['draft','to_be_tabulated','redo_tabulate','tabulating','to_be_collated','collating','import_failed'].indexOf(this.detailForm.state)>-1
            },
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
                let self = this;
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        manual:{},
                        supplier_contact_id:"",
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_catalog + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            let detailForm = data.msg;
                            if(!detailForm.supplier_contact_id) detailForm.supplier_contact_id=null;
                            if(!detailForm.weight_unit) detailForm.weight_unit=null;
                            if(!detailForm.length_unit) detailForm.length_unit=null;
                            if(!detailForm.manual) detailForm.manual={};
                            self.getManualDetailData(detailForm);
                            self.$store.state.newProductProductCatalogState.forEach((item)=>{
                                if(item.code === detailForm.state){
                                    self.thisStateActions = item.actions
                                }
                            })
                        }
                    }
                });
                if(self.$refs.form) self.$refs.form.clearValidate();
            },

            getManualDetailData(detailForm) {
                let self = this;
                self.manualEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_catalog + '/' + self.queryId + '/manual',
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            detailForm.manual = data.msg;
                        }
                        self.detailForm = detailForm
                    },error(){
                        self.detailForm = detailForm
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
                this.getSupplierCompanyUserList();
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.queryId ? self.$api.new_product_catalog_product_catalog + '/' + self.queryId : self.$api.new_product_catalog_product_catalog,
                    type: self.queryId ? 'PUT' : 'POST',
                    requestBody: true,
                    data: self.detailForm,
                    success: function (data) {
                        if (data.msg) {
                            let call = function (){
                                self.loading = false;
                                if (!self.queryId && data.msg.uid) {
                                    self.$router.push({
                                        path: 'detail',
                                        query: {
                                            id: data.msg.uid,
                                        }
                                    });
                                } else {
                                    self.getDetailData();
                                }
                                self.isEdit = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                            };

                            let newUid=null;
                            if (!self.queryId && data.msg.uid) {
                                newUid = data.msg.uid
                            } else {
                                newUid = self.queryId;
                            }
                            self.detailForm.uid = newUid;
                            setTimeout(()=>{
                                if(newUid && self.$refs.priceOriginFileUpdate){
                                    self.$refs.priceOriginFileUpdate.submitUpload(newUid, () => {
                                        self.$refs.priceOriginFileShow.update();
                                        call();
                                    });
                                }else {
                                    call()
                                }
                            },100)
                        } else {
                            self.loading = false;
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.manualEdit = false;
                this.getDetailData()
            },

            clickSaveManual() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_catalog + '/' + self.queryId + '/manual',
                    type: 'PUT',
                    requestBody: true,
                    data: self.detailForm.manual,
                    success () {
                        self.loading = false;
                        self.manualEdit = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                })
            },


            supplierCompanyChange(){
                this.detailForm.supplier_contact_id=null;
                this.getSupplierCompanyUserList();
            },
            getSupplierCompanyUserList() {
                let self = this;
                if(self.detailForm.supplier_id){
                    self.$http({
                        url: self.$api.partner_companies_detail + '/' + self.detailForm.supplier_id + '/partner_users',
                        success: function (data) {
                            if (data.msg) {
                                self.supplierCompanyUserList = data.msg;
                            }
                        }
                    })
                }
            },


            clickAction(action){
                let self = this;
                if(['start_tab','reimport'].indexOf(action)>-1){
                    if(this.originPriceFileList.length === 0){
                        self.$message({
                            showClose: true,
                            message: '操作前必须上传 原始产品目录！',
                            type: 'error'
                        });
                        return
                    }
                }
                if(['finish_tab'].indexOf(action)>-1){
                    if(this.templatePriceFileList.length === 0){
                        self.$message({
                            showClose: true,
                            message: '操作前必须上传 模板产品目录！',
                            type: 'error'
                        });
                        return
                    }
                    if(this.verifyResultCode==='no'){
                        self.$message({
                            showClose: true,
                            message: '模板产品目录未通过检测，请修改后重新上传！',
                            type: 'error'
                        });
                        return
                    }
                }

                if(action === 'finish_check'){
                    self.$confirm('完成校对将触发产品目录导入系统，请确认是否导入系统！', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (confirmAction) {
                            if (confirmAction === 'confirm') {
                                self.actionSubmit(action);
                            }
                        }
                    });
                    return;
                }
                if(action === 'rollback' && ['import_failed','to_be_audited'].indexOf(self.detailForm.state)>-1){
                    self.$confirm('确定要回退吗？该操作将会删除已经导入成功的产品！', '提示', {
                        confirmButtonText: '确认回退',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (confirmAction) {
                            if (confirmAction === 'confirm') {
                                self.actionSubmit(action,()=>{
                                    if(self.$refs.priceDetailProduct) self.$refs.priceDetailProduct.init();
                                });
                            }
                        }
                    });
                    return;
                }
                self.actionSubmit(action);
            },
            actionSubmit(action,callback){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_catalog + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        action:action,
                    },
                    success () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                        if(callback) callback();
                    }
                })
            },

            //导出产品目录
            clickExportExcel(){
                let url = this.$api.new_product_catalog_product_template_export + '/' + this.queryId;
                url = this.$utils.setCurrentCompanyToSearchParam(url);
                window.open(url)
            }

        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .edit-brand-lever-dialog {
        .check-box {
            width: 460px;
            float: left;

            .el-radio {
                margin: 5px !important;
                width: 140px;
                height: 80px;
                padding-top: 30px;

                &.is-checked {
                    background-color: $color-main;

                    .el-radio__label {
                        color: #ffffff;
                    }

                    .el-radio__input.is-checked .el-radio__inner {
                        border-color: #ffffff;
                        background-color: #ffffff;
                    }

                    .el-radio__inner::after {
                        background-color: $color-main;
                    }
                }
            }
        }

        .el-form {
            width: 380px;
            float: right;
        }
    }
</style>
