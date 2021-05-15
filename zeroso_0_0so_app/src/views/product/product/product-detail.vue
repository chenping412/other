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
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <router-link class="blue margin-right-10" target="_blank" :to='{
                                            path: "/related/message-list/waiting",
                                            query: {
                                                order_by: encodeURIComponent(JSON.stringify({
                                                    "field_name": "create_time",
                                                    "by": "asc"
                                                })),
                                                filter: encodeURIComponent(JSON.stringify([
                                                    ["brand_id","=",{
                                                        id:detailForm.brand.id,
                                                        name:detailForm.brand.name,
                                                    }],
                                                    ["message", "=", detailForm.product_name]
                                                ]))
                                            }
                                        }'>
                                        <el-button size="mini">查询型号相关消息</el-button>
                                    </router-link>

                                    <el-button size="mini" @click="openOrder()">查看订单</el-button>
                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination
                                v-if="queryId"
                                apiKey="product_product"
                                :listApi="$api.product_common_search_product">
                        </DetailPagination>

                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="160px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="品牌名：" prop="brand_id">
                                <SelectBrand v-if="!queryId || isEdit"
                                             :disabled="!productAllowChangeBaseInfo"
                                             :brandId.sync="detailForm.brand_id"
                                             :brand.sync="detailForm.brand"
                                             :option="detailForm.brand_id?[detailForm.brand]:null">
                                    <template slot="append">
                                        <BrandLever :state="detailForm.brand.state"></BrandLever>
                                    </template>
                                </SelectBrand>
                                <div v-else class="form-border-bottom">
                                    <template v-if="detailForm.brand">
                                        <router-link class="blue" :to="'/product/brand/detail?id='+detailForm.brand.id">
                                            {{detailForm.brand.name}}
                                        </router-link>
                                        <BrandLever class="margin-left-10" :state="detailForm.brand.state"></BrandLever>
                                    </template>
                                </div>
                            </el-form-item>
                            <el-form-item label="型号：" prop="product_name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.product_name" :disabled="!productAllowChangeBaseInfo"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.product_name | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="订货号：" prop="product_order_no">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.product_order_no" :disabled="!productAllowChangeBaseInfo"></el-input>
                                <span v-else
                                      class="form-border-bottom">{{detailForm.product_order_no | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="产品系列：" prop="product_serie_id">
                                <SelectBrandProductSeries
                                        v-if="!queryId || isEdit"
                                        :disabled="!detailForm.brand || !detailForm.brand.id || !productAllowChangeBaseInfo"
                                        :brandId="detailForm.brand.id"
                                        :brandProductSeriesId.sync="detailForm.product_serie_id">
                                </SelectBrandProductSeries>
                                <span v-else class="form-border-bottom">{{(detailForm.product_serie?detailForm.product_serie.name:'') | defaultStr}}</span>
                            </el-form-item>

                            <el-form-item label="参数：" prop="product_parameter">
                                <el-input type="textarea" rows="5" v-if="!queryId || isEdit" :disabled="!productAllowChangeBaseInfo"
                                          v-model="detailForm.product_parameter"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.product_parameter | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品状态：">
                                <ProductState :state="detailForm.state"></ProductState>
                                <product-detail-shelf
                                        v-if="queryId"
                                        :shelf="detailForm.on_selling"
                                        :queryId="queryId"
                                        @update="init()">
                                </product-detail-shelf>
                            </el-form-item>
                            <el-form-item label="产品来源：">
                                <ProductDetailSource :source="detailForm.source"></ProductDetailSource>
                            </el-form-item>
                            <el-form-item label="基本信息审核状态：" v-if="queryId && 1===0">
                                <product-detail-governance-state
                                        :governance_state="detailForm.governance_state"
                                        :queryId="queryId"
                                        @update="init()">
                                </product-detail-governance-state>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="中国海关编码：">
                                <div v-if="detailForm.product_customs_info">
                                    <SelectChinaCustomsCode
                                            v-if="!queryId || isEdit"
                                            :disabled="!productAllowChangeApprovalInfo"
                                            :customsCodeId.sync="detailForm.product_customs_info_id"
                                            :customsCode.sync="detailForm.product_customs_info"
                                            :option="detailForm.product_customs_info_id?[detailForm.product_customs_info]:null"
                                    ></SelectChinaCustomsCode>
                                    <span v-else class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_code | defaultStr}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="德国海关编码：">
                                <div v-if="detailForm.product_customs_info">
                                    <span class="form-border-bottom">{{detailForm.product_customs_info.customs_de_code | defaultStr}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="中国进口关税：">
                                <div v-if="detailForm.product_customs_info">
                                    <span class="form-border-bottom">{{detailForm.product_customs_info.import_cn_tariffs | percent | defaultStr}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="预估关税：">
                                <div v-if="!queryId || isEdit">
                                    <InputNumber :value.sync="detailForm.forecast_import_tariff" :disabled="!productAllowChangeApprovalInfo">
                                        <template slot="append">%</template>
                                    </InputNumber>
                                </div>
                                <span v-else class="form-border-bottom">{{detailForm.forecast_import_tariff | percent | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="额外关税：" prop="extra_import_cn_tariffs">
                                <div v-if="!queryId || isEdit">
                                    <InputNumber :value.sync="detailForm.extra_import_cn_tariffs" :disabled="!productAllowChangeApprovalInfo">
                                        <template slot="append">%</template>
                                    </InputNumber>
                                </div>
                                <span v-else class="form-border-bottom">{{detailForm.extra_import_cn_tariffs | percent | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="中国商品名称及备注：">
                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_description | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="德国海关描述：">
                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_de_description | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="中国监管条件：">
                                <span v-if="detailForm.product_customs_info" class="form-border-bottom">{{detailForm.product_customs_info.customs_cn_conditions | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="中国海关产品描述：">
                                <el-input type="textarea" rows="4" v-if="!queryId || isEdit" :disabled="!productAllowChangeApprovalInfo"
                                          v-model="detailForm.product_cn_customs_description"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.product_cn_customs_description | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="产品类型：">
                                <el-checkbox-group v-model="productTypeCheck" v-if="!queryId || isEdit" :disabled="!productAllowChangeApprovalInfo" @change="productTypeCheckChange">
                                    <el-checkbox  v-for="(item,$index) in $store.state.productType" :key="$index" :label="item.code">
                                        {{item.label}}
                                    </el-checkbox>
                                </el-checkbox-group>
                                <ProductType v-else :type="detailForm.type"></ProductType>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="中文报关品名：">
                                <div v-if="detailForm.product_trade_name">
                                    <div v-if="!queryId || isEdit">
                                        <SelectChinaProductTradeName
                                                ref="product_trade_name"
                                                :disabled="!productAllowChangeApprovalInfo"
                                                :productTradeNameId.sync="detailForm.product_trade_name_id"
                                                :productTradeName.sync="detailForm.product_trade_name"
                                                :option="detailForm.product_trade_name_id?[detailForm.product_trade_name]:null">
                                            <template slot="append">
                                                <ProductTradeNameAdd @update="productTradeNameAddSuccess"
                                                                     title="新增品名"></ProductTradeNameAdd>
                                            </template>
                                        </SelectChinaProductTradeName>
                                    </div>
                                    <span v-else class="form-border-bottom">{{detailForm.product_trade_name.product_cn_name | defaultStr}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="中国纳税编码：">
                                <span v-if="detailForm.product_trade_name" class="form-border-bottom">{{detailForm.product_trade_name.product_cn_tax_code | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="英文报关品名：">
                                <span v-if="detailForm.product_trade_name" class="form-border-bottom">{{detailForm.product_trade_name.product_en_name | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="毛重(kg)：" prop="gross_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.gross_weight" :disabled="!productAllowChangeApprovalInfo">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else
                                      class="form-border-bottom">{{detailForm.gross_weight | defaultStr}}kg</span>
                            </el-form-item>
                            <el-form-item label="净重(kg)：" prop="net_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.net_weight" :disabled="!productAllowChangeApprovalInfo">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.net_weight}}kg</span>
                            </el-form-item>
                            <el-form-item label="体积 长*宽*高(mm)：">
                                <div v-if="!queryId || isEdit">
                                    <InputNumber :value.sync="detailForm.length" :disabled="!productAllowChangeApprovalInfo" placeholder="长">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.width" :disabled="!productAllowChangeApprovalInfo" placeholder="宽">
                                        <template slot="append">mm</template>
                                    </InputNumber>
                                    <InputNumber :value.sync="detailForm.height" :disabled="!productAllowChangeApprovalInfo" placeholder="高">
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
                        <el-col :span="10">
                            <el-form-item label="预估重量(kg)：" prop="estimated_weight">
                                <InputNumber v-if="!queryId || isEdit" :value.sync="detailForm.estimated_weight" :disabled="!productAllowChangeApprovalInfo">
                                    <template slot="append">kg</template>
                                </InputNumber>
                                <span v-else class="form-border-bottom">{{detailForm.estimated_weight}}kg</span>
                            </el-form-item>
                            <el-form-item label="原产地：" prop="origin_of_country">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.origin_of_country" :disabled="!productAllowChangeApprovalInfo">
                                    <el-option
                                            v-for="item in $store.state.country"
                                            :key="item.code2"
                                            :value="item.code2"
                                            :label="item.chinese_name">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.origin_of_country | country | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="备注：" prop="comment">
                                <el-input type="textarea" rows="5" v-if="!queryId || isEdit" :disabled="!productAllowChangeApprovalInfo"
                                          v-model="detailForm.comment"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.comment | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="产品附件：">
                                <FileListShow
                                        :showDelete="isEdit"
                                        ref="fileListShow"
                                        :module_id="queryId"
                                        module_name="product"
                                        subsystem="product">
                                </FileListShow>
                                <FileUpload
                                        v-if="!queryId || isEdit"
                                        :module_id="queryId"
                                        module_name="product"
                                        subsystem="product"
                                        ref="fileUpload">
                                </FileUpload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>



                <product-detail-price-list v-if="queryId" :queryId="queryId" :detailForm="detailForm" @update="init()"></product-detail-price-list>

                <product-detail-correct-list v-if="queryId" :queryId="queryId" :detailForm="detailForm"></product-detail-correct-list>

            </div>
        </div>


    </div>
</template>

<script>

    import ProductTradeNameAdd from "../product-trade-name/product-trade-name-add";
    import ProductDetailPriceList from "./component/product-detail-price-list";
    import ProductDetailCorrectList from "./component/product-detail-correct-list";
    import ProductDetailShelf from "./component/product-detail-shelf";
    import ProductDetailGovernanceState from "./component/product-detail-governance-state";
    import HostConfig from "../../../config/host-config";

    export default {
        components: {
            ProductDetailGovernanceState,
            ProductDetailShelf,
            ProductDetailCorrectList,
            ProductDetailPriceList,
            ProductTradeNameAdd
        },
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
                    product_name: [
                        {required: true, message: '请输入型号，若产品只有订货号，则此项也填写订货号！'}
                    ],
                    product_order_no: [
                        {required: true, message: '请输入订货号，若产品只有型号，则此项也填写型号！'}
                    ],
                },


                productTypeCheck:[],


                loading: false,
            }
        },
        computed:{
            productAllowChangeApprovalInfo() {
                return HostConfig.productAllowChangeApprovalInfo.length===0 || HostConfig.productAllowChangeApprovalInfo.indexOf(this.$store.state.userInfo.id) > -1
            },
            productAllowChangeBaseInfo() {
                return HostConfig.productAllowChangeBaseInfo.length===0 || HostConfig.productAllowChangeBaseInfo.indexOf(this.$store.state.userInfo.id) > -1
            },
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
                        brand_id: '',
                        brand: {},
                        state: 'draft',
                        type: 0,
                        source: 'product',
                        governance_state: false,
                        product_logistics_governance_state: false,
                        product_serie_id: null,
                        product_customs_info_id: null,
                        product_customs_info: {},
                        product_trade_name_id: null,
                        product_trade_name: {},
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.productTypeCheck=[];
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (!data.msg.brand) data.msg.brand = {};
                            if (!data.msg.product_customs_info) data.msg.product_customs_info = {};
                            if (!data.msg.product_trade_name) data.msg.product_trade_name = {};
                            self.detailForm = data.msg;
                            self.computedProductType();
                        }
                    }
                })
            },
            computedProductType(){
              if(this.detailForm.type){
                  let typeString = this.detailForm.type.toString(2);
                  let typeStringArr = typeString.split('');
                  typeStringArr.reverse();
                  for(let i=0;i<typeStringArr.length;i++){
                      if(typeStringArr[i]==='1'){
                          let str = '1';
                          for(let k=0;k<i;k++){
                              str += '0'
                          }
                          this.productTypeCheck.push(parseInt(str,2).toString()) //parseInt(str,2)表示二进制转为十进制
                      }
                  }
              }
            },
            productTypeCheckChange(){
                let type=0;
                this.productTypeCheck.forEach((item)=>{
                    type += Number(item)
                });
                this.detailForm.type = parseInt(type);
            },


            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            productTradeNameAddSuccess(item) {
                if (item.id) {
                    this.detailForm.product_trade_name = JSON.parse(JSON.stringify(item));
                    this.detailForm.product_trade_name_id = item.id;
                    this.$refs.product_trade_name.setInit(item.id, [item])
                }
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
                        if(!self.detailForm.product_serie_id) self.detailForm.product_serie_id = undefined;
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
                                    if (self.queryId) {
                                        self.$refs.fileUpload.submitUpload(self.queryId, () => {
                                            self.getDetailData();
                                            self.$refs.fileListShow.update();
                                            self.isEdit = false;
                                        })
                                    } else if (data.msg.id) {
                                        self.$refs.fileUpload.submitUpload(data.msg.id, () => {
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



            openOrder() {
                let routeData = this.$router.resolve({
                    path: '/order/order/all/list',
                    query: {
                        order_by: encodeURIComponent(JSON.stringify({
                            "field_name": "write_time", "by": "desc"
                        })),
                        filter: encodeURIComponent(JSON.stringify([
                            ["product", '=', {
                                id: this.detailForm.id,
                                product_name: this.detailForm.product_name,
                                product_order_no: this.detailForm.product_order_no,
                            }]
                        ])),
                    }
                });
                window.open(routeData.href);
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
