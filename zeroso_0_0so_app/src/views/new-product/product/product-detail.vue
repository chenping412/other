<template>
    <div class="flex-box-column product-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '产品详情' : '新增产品'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span>产品详情</span>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <el-button type="warning" size="mini" v-if="detailForm.publish_state==='draft'" @click="actionSubmit('publishing')">申请发布</el-button>
                                    <el-button type="warning" size="mini"
                                               v-if="['published','offline_brand_and_product','offline_brand'].indexOf(detailForm.publish_state)>-1"
                                               @click="actionSubmit('publishing')">
                                        再次申请发布
                                    </el-button>
                                    <el-button type="success" size="mini" v-if="detailForm.publish_state==='publishing'" @click="clickPublished()">正式发布</el-button>

                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="120px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="10">
                        <el-col :span="9">
                            <el-form-item label="品牌名：" prop="brand_uid">
                                <div class="form-border-bottom">
                                    <template v-if="detailForm.brand">
                                        <router-link class="blue" :to="'/new-product/brand/detail?id='+detailForm.brand.uid">
                                            {{detailForm.brand.name}}
                                        </router-link>
                                        <BrandLever class="margin-left-10" :state="detailForm.brand.state"></BrandLever>
                                    </template>
                                </div>
                            </el-form-item>
                            <el-form-item label="型号：" prop="type">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.type"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.type | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="订货号：" prop="article_number">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.article_number"></el-input>
                                <span v-else
                                      class="form-border-bottom">{{detailForm.article_number | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="产品描述：" prop="short_description">
                                <el-input type="textarea" rows="5" v-if="!queryId || isEdit"
                                          v-model="detailForm.short_description"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.short_description | defaultStr}}</pre>
                            </el-form-item>
                            <el-form-item label="产品系列：" prop="brand_product_series_id">
                                <SelectNewBrandProductSeries
                                        v-if="!queryId || isEdit"
                                        :disabled="!detailForm.brand_uid"
                                        :brandUid="detailForm.brand_uid"
                                        :brandProductSeriesId.sync="detailForm.brand_product_series_id">
                                </SelectNewBrandProductSeries>
                                <span v-else class="form-border-bottom">
                                    {{(detailForm.product_series?detailForm.product_series.name:'') | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="原产国：" prop="origin_of_country">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.origin_of_country">
                                    <el-option
                                            v-for="item in $store.state.country"
                                            :key="item.code2"
                                            :value="item.code2"
                                            :label="item.chinese_name">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">
                                    {{detailForm.origin_of_country | country | defaultStr}}
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="状态：" v-if="queryId">
                                <ProductState :state="detailForm.lifecycle_state"></ProductState>
                            </el-form-item>
                            <el-form-item label="发布状态：" v-if="queryId">
                                <BrandPublishState :state="detailForm.publish_state"></BrandPublishState>
                            </el-form-item>
                            <el-form-item label="EAN：" prop="ean">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.ean"></el-input>
                                <span v-else class="form-border-bottom">
                                    {{detailForm.ean | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="UPC：" prop="upc">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.upc"></el-input>
                                <span v-else class="form-border-bottom">
                                    {{detailForm.upc | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="备注：">
                                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="detailForm.comment.other"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.comment.other}}</pre>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="产品图片：">
                                <FileListShow
                                        ref="productAdvertiseShow"
                                        :isMinio="true"
                                        :module_id="detailForm.uid"
                                        module_name="product_advertise"
                                        :subsystem="detailForm.uid"
                                        :showDelete="isEdit">
                                </FileListShow>
                                <FileUpload
                                        v-if="!queryId || isEdit"
                                        ref="productAdvertise"
                                        :isMinio="true"
                                        :accept="['image/gif','image/jpeg','image/png','image/svg+xml']"
                                        fileNamePrefix="product_advertise-"
                                        :module_id.sync="detailForm.uid"
                                        module_name="product_advertise"
                                        :subsystem="detailForm.uid">
                                </FileUpload>
                            </el-form-item>
                            <el-form-item label="产品说明书：">
                                <FileListShow
                                        :isMinio="true"
                                        :showDelete="isEdit"
                                        ref="productDatasheetShow"
                                        :module_id.sync="detailForm.uid"
                                        module_name="product_datasheet"
                                        :subsystem="detailForm.uid">
                                </FileListShow>
                                <FileUpload
                                        v-if="!queryId || isEdit"
                                        ref="productDatasheet"
                                        :isMinio="true"
                                        :module_id.sync="detailForm.uid"
                                        module_name="product_datasheet"
                                        :subsystem="detailForm.uid">
                                </FileUpload>
                            </el-form-item>

                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20" :gutter="10">
                        <el-col :span="9">
                            <el-form-item label="中文报关品名：">
                                <div v-if="detailForm.vat_name">
                                    <div v-if="!queryId || isEdit">
                                        <SelectNewTradeName
                                                ref="vat_name"
                                                :tradeNameId.sync="detailForm.vat_name_id"
                                                :tradeName.sync="detailForm.vat_name"
                                                :option="detailForm.vat_name_id?[detailForm.vat_name]:null">
                                        </SelectNewTradeName>
                                    </div>
                                    <span v-else class="form-border-bottom">
                                        {{detailForm.vat_name.chinese_name | defaultStr}}
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="英文报关品名：">
                                <span v-if="detailForm.vat_name" class="form-border-bottom">
                                    {{detailForm.vat_name.english_name | defaultStr}}
                                </span>
                            </el-form-item>
                            <el-form-item label="中国纳税编码：">
                            <span v-if="detailForm.vat_name" class="form-border-bottom">
                                {{detailForm.vat_name.code | defaultStr}}
                            </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="毛重(kg)：" prop="gross_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.gross_weight">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else
                                      class="form-border-bottom">{{detailForm.gross_weight | defaultStr}}kg</span>
                            </el-form-item>
                            <el-form-item label="净重(kg)：" prop="net_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.net_weight">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.net_weight}}kg</span>
                            </el-form-item>
                            <el-form-item label="长*宽*高(mm)：">
                                <div v-if="!queryId || isEdit">
                                    <InputNumber :value.sync="detailForm.length" :integer="true" placeholder="长">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.width" :integer="true" placeholder="宽">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.height" :integer="true" placeholder="高">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                </div>
                                <div v-else class="form-border-bottom">
                                    <span>{{detailForm.length | defaultStr}}</span>*
                                    <span>{{detailForm.width | defaultStr}}</span>*
                                    <span>{{detailForm.height | defaultStr}}</span>
                                    <span>mm</span>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="其他附件：">
                                <FileListShow
                                        :isMinio="true"
                                        :showDelete="isEdit"
                                        ref="productAttachmentShow"
                                        :module_id.sync="detailForm.uid"
                                        module_name="product_attachment"
                                        :subsystem="detailForm.uid">
                                </FileListShow>
                                <FileUpload
                                        v-if="!queryId || isEdit"
                                        ref="productAttachment"
                                        :isMinio="true"
                                        :module_id.sync="detailForm.uid"
                                        module_name="product_attachment"
                                        :subsystem="detailForm.uid">
                                </FileUpload>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20">
                        <el-col :span="18">
                            <el-form-item label="扩展信息：" v-if="queryId">
                                <el-row v-if="detailForm.additional_info">
                                    <el-col :span="6" v-for="(item,$index) in detailForm.additional_info" :key="$index">
                                        {{$index}}：{{item}}
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20">
                        <el-col :span="18">
                            <el-form-item label="产品标签：" v-if="queryId">
                                <newProductAddTags ref="newProductAddTags" :queryId="queryId" type="product"></newProductAddTags>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <product-detail-price-list v-if="queryId && 0===1" :queryId="queryId" :detailForm="detailForm" @update="init()"></product-detail-price-list>
            </div>


            <el-tabs type="card" class="car-box" v-if="!(!queryId || isEdit)">
                <el-tab-pane label="海关编码" lazy>
                    <product-detail-customs :queryId="queryId"></product-detail-customs>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>


    import ProductDetailCustoms from "./component/product-detail-customs";
    import ProductDetailPriceList from "./component/product-detail-price-list";
    import NewProductAddTags from "../tags/component/newProductAddTags";
    export default {
        components: {
            NewProductAddTags,
            ProductDetailCustoms,ProductDetailPriceList
        },
        data() {
            let self=this;
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {
                    brand: {},
                    vat_name: {},
                    comment: {},
                },
                detailFormRule: {
                    brand_uid: [
                        {required: true, message: '请选择品牌！'}
                    ],
                    type: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.detailForm.type && !self.detailForm.article_number) {
                                    callback(new Error('请输入型号、订货号，二者不能全部为空'));
                                } {
                                    callback();
                                }
                            }
                        }
                    ],
                    article_number: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.detailForm.type && !self.detailForm.article_number) {
                                    callback(new Error('请输入型号、订货号，二者不能全部为空'));
                                } {
                                    callback();
                                }
                            }
                        }
                    ],
                },


                productTypeCheck:[],


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
                    self.queryId = self.$route.query.id;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        brand_uid: '',
                        brand: {},
                        brand_product_series_id: null,
                        vat_name_id: null,
                        vat_name: {},
                        comment: {},
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_product + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (!data.msg.brand) data.msg.brand = {};
                            if (!data.msg.vat_name) data.msg.vat_name = {};
                            if (!data.msg.comment) data.msg.comment = {};
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
                        if (self.detailForm.net_weight && (!self.detailForm.gross_weight || Number(self.detailForm.gross_weight)<Number(self.detailForm.net_weight))) {
                            self.$message({
                                showClose: true,
                                message: '填写净重后，必须填写毛重，并且毛重不能小于净重！',
                                type: 'error'
                            });
                            return
                        }
                        if(!self.detailForm.brand_product_series_id) self.detailForm.brand_product_series_id = undefined;
                        self.loading = true;
                        self.$http({
                            url: self.$api.new_product_catalog_product_product + '/' + self.queryId,
                            type: 'PUT',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                if (data.msg) {
                                    let productUid=null;
                                    if (!self.queryId && data.msg.uid) {
                                        productUid = data.msg.uid
                                    } else {
                                        productUid = self.queryId;
                                    }
                                    self.detailForm.uid = productUid;
                                    setTimeout(()=>{
                                        if(productUid){
                                            self.$refs.productAdvertise.submitUpload(productUid, () => {
                                                self.$refs.productDatasheet.submitUpload(productUid, () => {
                                                    self.$refs.productAttachment.submitUpload(productUid, () => {
                                                        self.loading = false;
                                                        self.$refs.productAdvertiseShow.update();
                                                        self.$refs.productDatasheetShow.update();
                                                        self.$refs.productAttachmentShow.update();
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
                                                        if(self.$refs.newProductAddTags) self.$refs.newProductAddTags.init();
                                                    });
                                                });
                                            });
                                        }
                                    },100)
                                }else {
                                    self.loading = false;
                                }
                            }
                        });
                    }
                });
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData();
                this.$refs.form.clearValidate();
            },


            //正式发布
            clickPublished() {
                let self = this;
                self.$confirm('确定正式发布吗？，确认后将同步信息至官网，正式发布前请检查信息是否有误', '提示', {
                    confirmButtonText: '确认发布',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.actionSubmit('publish');
                        }
                    }
                })

            },
            actionSubmit(action){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_product + '/' + self.queryId + '/' + action,
                    type: 'PUT',
                    success (){
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                });
            },
            
        }
    }
</script>

<style lang="scss">
    .product-detail {
        .table {
            th, td {
                text-align: left;
                padding: 3px 15px;
                vertical-align: top;
                max-width: 300px;
                line-height: 1.8em;
            }

            &.table-border {
                border: 1px solid #dddddd;

                tr:first-child th,
                tr:first-child td {
                    border-top: 1px solid #dddddd;

                    &:first-child {
                        border-right: 1px solid #dddddd;
                    }
                    &:last-child {
                        border-left: 1px solid #dddddd;
                    }
                }
            }
            &.table-all-border {
                th,td {
                    border: 1px solid #dddddd;
                }
            }
        }
    }
</style>
