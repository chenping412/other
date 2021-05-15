<template>
    <div class="flex-box-column product-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">产品</el-breadcrumb-item>
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
                        <!--<div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                    <el-button type="warning" plain v-if="detailForm.custom_status ==='draft'" @click="customStateAction('apply')">海关信息提交</el-button>
                                    <el-button type="warning" plain v-if="detailForm.custom_status ==='need_validate'" @click="customStateAction('confirm')">海关信息审核通过</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>-->
                        <DetailPagination apiKey="product_product" :listApi="$api.product_common_search_product"></DetailPagination>

                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="160px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="品牌名：" prop="brand_id">
                                <SelectBrand v-if="!queryId || isEdit"
                                             :brandId.sync="detailForm.brand_id"
                                             :brand.sync="detailForm.brand"
                                             :option="detailForm.brand_id?[detailForm.brand]:null">
                                    <template slot="append">
                                        <BrandLever :state="detailForm.brand.state"></BrandLever>
                                    </template>
                                </SelectBrand>
                                <div v-else class="form-border-bottom">
                                    <span>{{detailForm.brand.name}}</span>
                                    <BrandLever class="margin-left-10" :state="detailForm.brand.state"></BrandLever>
                                </div>
                            </el-form-item>
                            <el-form-item label="型号：" prop="product_name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.product_name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.product_name | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="订货号：" prop="product_order_no">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.product_order_no"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.product_order_no | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品状态：">
                                <el-tag :type="detailForm.state==='verified'?'success' : 'warning'">
                                    {{detailForm.state | productState | defaultStr}}
                                </el-tag>

                                <el-tag type="info" effect="dark" v-if="detailForm.is_valid === 0">已标记无效</el-tag>
                                <el-tag type="info" effect="dark" v-if="detailForm.is_replaced === 1">已标记被替代</el-tag>
                                <el-tag type="danger" effect="dark" v-if="detailForm.is_3C === 1">已标记3C</el-tag>

                                <router-link class="blue margin-left-10" v-if="detailForm.correct_id" :to="'detail?id='+detailForm.correct_id">查看正确型号</router-link>
                            </el-form-item>
                            <!--<el-form-item label="海关信息状态：">
                                <el-tag :type="detailForm.custom_status==='verified'?'success' : 'danger'"
                                        v-if="detailForm.custom_status">
                                    {{detailForm.custom_status | productCustomState | defaultStr}}
                                </el-tag>
                            </el-form-item>-->
                        </el-col>
                    </el-row>

<!--                    <el-row class="border-bottom margin-bottom-20" :gutter="30">-->
<!--                        <el-col :span="10">-->
<!--                            <el-form-item label="中国海关编码：">-->
<!--                                <div v-if="detailForm.product_customs_info">-->
<!--                                    <SelectChinaCustomsCode-->
<!--                                            v-if="!queryId || isEdit"-->
<!--                                            :customsCodeId.sync="detailForm.product_customs_info_id"-->
<!--                                            :customsCode.sync="detailForm.product_customs_info"-->
<!--                                            :option="detailForm.product_customs_info_id?[detailForm.product_customs_info]:null"-->
<!--                                    ></SelectChinaCustomsCode>-->
<!--                                    <span v-else class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_code | defaultStr}}</span>-->
<!--                                </div>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="德国海关编码：">-->
<!--                                <div v-if="detailForm.product_customs_info">-->
<!--                                    <span class="form-border-bottom">{{detailForm.product_customs_info.customs_de_code | defaultStr}}</span>-->
<!--                                </div>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="中国进口关税：">-->
<!--                                <div v-if="detailForm.product_customs_info">-->
<!--                                    <span class="form-border-bottom">{{detailForm.product_customs_info.import_cn_tariffs | percent | defaultStr}}</span>-->
<!--                                </div>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="中国海关产品描述：">-->
<!--                                <el-input type="textarea" rows="4" v-if="!queryId || isEdit"-->
<!--                                              v-model="detailForm.product_cn_customs_description"></el-input>-->
<!--                                <span v-else class="form-border-bottom">{{detailForm.product_cn_customs_description | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                        <el-col :span="10">-->
<!--                            <el-form-item label="中国商品名称及备注：">-->
<!--                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_description | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="德国海关描述：">-->
<!--                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_de_description | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="中国监管条件：">-->
<!--                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_conditions | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="预估关税：">-->
<!--                                <div v-if="!queryId || isEdit">-->
<!--                                    <InputNumber :value.sync="detailForm.forecast_import_tariff">-->
<!--                                        <template slot="append">%</template>-->
<!--                                    </InputNumber>-->
<!--                                </div>-->
<!--                                <span v-else class="form-border-bottom">{{detailForm.forecast_import_tariff | percent | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->

<!--                    <el-row class="border-bottom margin-bottom-20" :gutter="30">-->
<!--                        <el-col :span="10">-->
<!--                            <el-form-item label="中文报关品名：">-->
<!--                                <div v-if="detailForm.product_trade_name">-->
<!--                                    <div v-if="!queryId || isEdit">-->
<!--                                        <SelectChinaProductTradeName-->
<!--                                                ref="product_trade_name"-->
<!--                                                :productTradeNameId.sync="detailForm.product_trade_name_id"-->
<!--                                                :productTradeName.sync="detailForm.product_trade_name"-->
<!--                                                :option="detailForm.product_trade_name_id?[detailForm.product_trade_name]:null">-->
<!--                                            <template slot="append">-->
<!--                                                <ProductTradeNameAdd @update="productTradeNameAddSuccess" title="新增品名"></ProductTradeNameAdd>-->
<!--                                            </template>-->
<!--                                        </SelectChinaProductTradeName>-->
<!--                                    </div>-->
<!--                                    <span v-else class="form-border-bottom">{{detailForm.product_trade_name.product_cn_name | defaultStr}}</span>-->
<!--                                </div>-->
<!--                            </el-form-item>-->
<!--                            <el-form-item label="中国纳税编码：" prop="website">-->
<!--                                <span v-if="detailForm.product_trade_name" class="form-border-bottom">{{detailForm.product_trade_name.product_cn_tax_code | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                        <el-col :span="10">-->
<!--                            <el-form-item label="英文报关品名：">-->
<!--                                <span v-if="detailForm.product_trade_name" class="form-border-bottom">{{detailForm.product_trade_name.product_en_name | defaultStr}}</span>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->

                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="毛重(kg)：" prop="gross_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.gross_weight">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.gross_weight | defaultStr}}kg</span>
                            </el-form-item>
                            <el-form-item label="体积(mm)：">
                                <div v-if="!queryId || isEdit">
                                    <InputNumber :value.sync="detailForm.length" placeholder="长">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.width" placeholder="宽">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.height" placeholder="高">
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
<!--                            <el-form-item label="额外关税：" prop="extra_import_cn_tariffs">-->
<!--                                <div v-if="!queryId || isEdit">-->
<!--                                    <InputNumber :value.sync="detailForm.extra_import_cn_tariffs">-->
<!--                                        <template slot="append">%</template>-->
<!--                                    </InputNumber>-->
<!--                                </div>-->
<!--                                <span v-else class="form-border-bottom">{{detailForm.extra_import_cn_tariffs | percent | defaultStr}}</span>-->
<!--                            </el-form-item>-->
                            <el-form-item label="参数：" prop="product_parameter">
                                <el-input type="textarea" rows="5" v-if="!queryId || isEdit" v-model="detailForm.product_parameter"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.product_parameter | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="净重(kg)：" prop="net_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.net_weight">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.net_weight}}kg</span>
                            </el-form-item>
                            <el-form-item label="原产地" prop="origin_of_country">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.origin_of_country">
                                    <el-option
                                            v-for="item in $store.state.country"
                                            :key="item.code2"
                                            :value="item.code2"
                                            :label="item.chinese_name">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.origin_of_country | country | defaultStr}}</span>
                            </el-form-item>
<!--                            <el-form-item label="备注：" prop="comment">-->
<!--                                <el-input type="textarea" rows="5" v-if="!queryId || isEdit"-->
<!--                                          v-model="detailForm.comment"></el-input>-->
<!--                                <span v-else class="form-border-bottom">{{detailForm.comment | defaultStr}}</span>-->
<!--                            </el-form-item>-->
                        </el-col>
                    </el-row>

<!--                    <el-row class="border-bottom margin-bottom-20" :gutter="30">-->
<!--                        <el-col :span="20">-->
<!--                            <el-form-item label="产品附件：">-->
<!--                                <FileListShow-->
<!--                                        :showDelete="isEdit"-->
<!--                                        ref="fileListShow"-->
<!--                                        :module_id="queryId"-->
<!--                                        module_name="product"-->
<!--                                        subsystem="product">-->
<!--                                </FileListShow>-->
<!--                                <FileUpload-->
<!--                                        v-if="!queryId || isEdit"-->
<!--                                        :module_id="queryId"-->
<!--                                        module_name="product"-->
<!--                                        subsystem="product"-->
<!--                                        ref="fileUpload">-->
<!--                                </FileUpload>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->
<!--                    <el-row :gutter="30">-->
<!--                        <el-col :span="24">-->
<!--                            <el-form-item label="报价备注：">-->
<!--                                <table class="table">-->
<!--                                    <thead>-->
<!--                                    <tr>-->
<!--                                        <th>操作类型</th>-->
<!--                                        <th>备注内容</th>-->
<!--                                        <th>时间</th>-->
<!--                                    </tr>-->
<!--                                    </thead>-->
<!--                                    <tbody>-->
<!--                                    <tr v-if="detailForm.quotation_comment">-->
<!--                                        <td>{{detailForm.quotation_comment.commentType | productQuotationCommentType}}-->
<!--                                        </td>-->
<!--                                        <td style="max-width: 500px;">{{detailForm.quotation_comment.commentNo |-->
<!--                                            productQuotationComment(detailForm.quotation_comment.commentType,detailForm.quotation_comment.comment)}}-->
<!--                                        </td>-->
<!--                                        <td>{{detailForm.quotation_comment.createTime | zerosoCompanyTime}}</td>-->
<!--                                    </tr>-->
<!--                                    </tbody>-->
<!--                                </table>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
<!--                    </el-row>-->

                </el-form>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {
                    brand: {},
                    product_customs_info: {},
                    product_trade_name: {},
                },
                detailFormRule: {
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
                    ],
                },

                productFileList:[],

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
                        brand_id:'',
                        brand: {},
                        product_customs_info_id: null,
                        product_customs_info: {},
                        product_trade_name_id: null,
                        product_trade_name: {},
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if(!data.msg.brand) data.msg.brand={};
                            if(!data.msg.product_customs_info) data.msg.product_customs_info={};
                            if(!data.msg.product_trade_name) data.msg.product_trade_name={};
                            self.detailForm = data.msg;
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            productTradeNameAddSuccess(item){
                if(item.id){
                    this.detailForm.product_trade_name = JSON.parse(JSON.stringify(item));
                    this.detailForm.product_trade_name_id = item.id;
                    this.$refs.product_trade_name.setInit(item.id,[item])
                }
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(!self.detailForm.product_name && !self.detailForm.product_order_no){
                            self.$message({
                                showClose: true,
                                message: '型号、订货号 至少填写一个！',
                                type: 'error'
                            });
                            return
                        }
                        self.loading = true;
                        self.$http({
                            url: self.queryId ? self.$api.product_product_manage_product + '/' + self.queryId : self.$api.product_product_manage_product,
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
                                    if(self.queryId){
                                        self.$refs.fileUpload.submitUpload(self.queryId,()=>{
                                            self.getDetailData();
                                            self.$refs.fileListShow.update();
                                            self.isEdit = false;
                                        })
                                    }else if (data.msg.id){
                                        self.$refs.fileUpload.submitUpload(data.msg.id,()=>{
                                            self.$router.push({
                                                path: 'detail',
                                                query: {
                                                    id: data.msg.id,
                                                }
                                            });
                                            self.isEdit = false;
                                        })
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


            //修改海关信息状态
            customStateAction(name) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        id:self.queryId,
                        name:name
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.getDetailData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
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
                padding: 0 20px;
            }
        }
    }
</style>
