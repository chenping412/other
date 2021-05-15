<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>核准池</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch ref="controlSearch" :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                           :allowFilterFieldsFast.sync="allowFilterFieldsFast" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">

            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listDataShow" :default-sort = "{prop: 'verify_pooled_time', order: 'ascending'}" @sort-change="sortChange" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" sortable="custom" :sort-orders="['ascending', 'descending']">
                        <template slot-scope="scope">
                            <router-link :to="'/product/brand/detail?id='+scope.row.brand.id">
                                {{scope.row.brand.name | defaultStr}}
                            </router-link>
                            <el-tag type="danger" effect="dark" v-if="scope.row.has_pushed">催</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌等级" width="95px">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <BrandLever :state="scope.row.brand.state"> </BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column prop="country" label="国家" sortable="custom" :sort-orders="['ascending', 'descending']">
                        <template slot-scope="scope">
                            <span>{{scope.row.brand.country | country}}</span>
                            <isEuCountry :country="scope.row.country"></isEuCountry>
                        </template>
                    </el-table-column>
                    <el-table-column prop="verify_pooled_time" label="时间" sortable="custom" :sort-orders="['ascending', 'descending']">
                        <template slot-scope="scope">
                            <span>{{scope.row.verify_pooled_time | zerosoCompanyTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type_no" label="型号" sortable="custom" :sort-orders="['ascending', 'descending']">
                        <template slot-scope="scope">
                            <router-link :to="'/product/product/detail?id='+scope.row.product_id">
                                {{scope.row.type_no | defaultStr}}
                            </router-link>
                            <a v-if="scope.row.type_no"
                               :title="'搜索'+scope.row.brand.name+' '+scope.row.type_no"
                               class="icon-google-search"
                               target="_blank"
                               :href="'https://www.google.de/search?q='+scope.row.brand.name+'%20'+scope.row.type_no">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_no" label="订货号" sortable="custom" :sort-orders="['ascending', 'descending']">
                        <template slot-scope="scope">
                            <router-link :to="'/product/product/detail?id='+scope.row.product_id">
                                {{scope.row.order_no | defaultStr}}
                            </router-link>
                            <a v-if="scope.row.order_no"
                               :title="'搜索'+scope.row.brand.name+' '+scope.row.order_no"
                               class="icon-google-search"
                               target="_blank"
                               :href="'https://www.google.de/search?q='+scope.row.brand.name+'%20'+scope.row.order_no">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="editRow(scope.row)" :disabled="!productAllowChangeApprovalInfo">核准</el-button>
                            <el-button size="mini" type="warning" @click="markAs3c(scope.row)" :disabled="!productAllowChangeApprovalInfo">标记为3C</el-button>
                            <router-link class="blue margin-left-10" target="_blank" @click.native.stop="" :to='{
                                    path: "/related/message-list/waiting",
                                    query: {
                                        order_by: encodeURIComponent(JSON.stringify({
                                            "field_name": "create_time",
                                            "by": "asc"
                                        })),
                                        filter: encodeURIComponent(JSON.stringify([
                                            ["brand_id","=",{
                                                id:scope.row.brand.id,
                                                name:scope.row.brand.name,
                                            }]
                                        ]))
                                    }
                                }'>消息查询
                            </router-link>

                            <div>
                                <router-link class="blue" target="_blank" @click.native.stop="" :to='{
                                    path: "/inquiry-price/all/list",
                                    query: {
                                        order_by: encodeURIComponent(JSON.stringify({
                                            "field_name":"CREATE_TIME",
                                            "by":"desc"
                                        })),
                                        filter: encodeURIComponent(JSON.stringify([
                                            ["productId","=",{
                                                "id":scope.row.product_id,
                                                "brand_name":scope.row.brand.name,
                                                "product_name":scope.row.type_no,
                                                "product_order_no":scope.row.order_no,
                                            }]
                                        ]))
                                    }
                                }'>询价单-型号
                                </router-link>
                                <router-link class="blue margin-left-10" target="_blank" @click.native.stop="" :to='{
                                    path: "/inquiry-price/all/list",
                                    query: {
                                        order_by: encodeURIComponent(JSON.stringify({
                                            "field_name":"CREATE_TIME",
                                            "by":"desc"
                                        })),
                                        filter: encodeURIComponent(JSON.stringify([
                                            ["brandId","=",{
                                                "id":scope.row.brand.id,
                                                "name":scope.row.brand.name,
                                                "state":scope.row.brand.state,
                                            }]
                                        ]))
                                    }
                                }'>询价单-品牌
                                </router-link>
                            </div>
                            <div>
                                <router-link class="blue" target="_blank" @click.native.stop="" :to='{
                                    path: "/inquiry-quotation/ALL/list",
                                    query: {
                                        order_by: encodeURIComponent(JSON.stringify({
                                            "field_name":"CREATE_TIME",
                                            "by":"desc"
                                        })),
                                        filter: encodeURIComponent(JSON.stringify([
                                            ["productId","=",{
                                                "id":scope.row.product_id,
                                                "brand_name":scope.row.brand.name,
                                                "product_name":scope.row.type_no,
                                                "product_order_no":scope.row.order_no,
                                            }]
                                        ]))
                                    }
                                }'>询报价单-型号
                                </router-link>
                                <router-link class="blue margin-left-10" target="_blank" @click.native.stop="" :to='{
                                    path: "/inquiry-quotation/ALL/list",
                                    query: {
                                        order_by: encodeURIComponent(JSON.stringify({
                                            "field_name":"CREATE_TIME",
                                            "by":"desc"
                                        })),
                                        filter: encodeURIComponent(JSON.stringify([
                                            ["brandId","=",{
                                                "id":scope.row.brand.id,
                                                "name":scope.row.brand.name,
                                                "state":scope.row.brand.state,
                                            }]
                                        ]))
                                    }
                                }'>询报价单-品牌
                                </router-link>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <el-dialog title="核准" :visible.sync="dialogShow" width="1200px" top="60px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editForm" :rules="editFormRule" ref="editForm" label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="品牌名">
                            <div class="form-border-bottom">
                                <span>{{editForm.brand.name | defaultStr}}</span>
                                <BrandLever :state="editForm.brand.state"></BrandLever>
                            </div>
                        </el-form-item>
                        <el-form-item label="型号">
                            <div class="form-border-bottom">{{editForm.type_no | defaultStr}}</div>
                        </el-form-item>
                        <el-form-item label="订货号">
                            <div class="form-border-bottom">{{editForm.order_no | defaultStr}}</div>
                        </el-form-item>
                        <el-form-item label="中文报关品名" prop="product_trade_name_id">
                            <SelectChinaProductTradeName
                                    ref="product_trade_name"
                                    :productTradeNameId.sync="editForm.product_trade_name_id"
                                    :productTradeName.sync="editForm.product_trade_name"
                                    :option="editForm.product_trade_name_id?[editForm.product_trade_name]:null">
                                <template slot="append">
                                    <ProductTradeNameAdd @update="productTradeNameAddSuccess"
                                                         title="新增"></ProductTradeNameAdd>
                                </template>
                            </SelectChinaProductTradeName>
                        </el-form-item>
                        <el-form-item label="英文报关品名">
                            <span v-if="editForm.product_trade_name" class="form-border-bottom">{{editForm.product_trade_name.product_en_name | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="中国纳税编码">
                            <span v-if="editForm.product_trade_name" class="form-border-bottom">{{editForm.product_trade_name.product_cn_tax_code | defaultStr}}</span>
                        </el-form-item>

                        <el-form-item label="毛重" prop="gross_weight">
                            <InputNumber :value.sync="editForm.gross_weight" placeholder="预估重量 和 净重毛重，必须二选一！">
                                <template slot="append">kg</template>
                            </InputNumber>
                        </el-form-item>
                        <el-form-item label="净重" prop="net_weight">
                            <InputNumber :value.sync="editForm.net_weight" @change="netWeightChange" placeholder="预估重量 和 净重毛重，必须二选一！">
                                <template slot="append">kg</template>
                            </InputNumber>
                        </el-form-item>
                        <el-form-item label="预估重量" prop="estimated_weight">
                            <InputNumber :value.sync="editForm.estimated_weight" placeholder="预估重量 和 净重毛重，必须二选一！">
                                <template slot="append">kg</template>
                            </InputNumber>
                        </el-form-item>
                        <el-form-item label="预估关税" prop="forecast_import_tariff">
                            <InputNumber :value.sync="editForm.forecast_import_tariff"
                                         placeholder="预估关税 和 中国海关编码，二者选填一项">
                                <template slot="append">%</template>
                            </InputNumber>
                        </el-form-item>
                        <el-form-item label="额外关税" prop="extra_import_tariff">
                            <InputNumber :value.sync="editForm.extra_import_tariff">
                                <template slot="append">%</template>
                            </InputNumber>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="中国海关编码" prop="product_customs_info_id">
                            <SelectChinaCustomsCode
                                    :customsCodeId.sync="editForm.product_customs_info_id"
                                    :customsCode.sync="editForm.product_customs_info"
                                    :option="editForm.product_customs_info_id?[editForm.product_customs_info]:null"
                                    placeholder="中国海关编码 和 预估关税，二者选填一项"
                            ></SelectChinaCustomsCode>
                        </el-form-item>
                        <el-form-item label="中国商品名称及备注">
                            <span v-if="editForm.product_customs_info" class="form-border-bottom">{{editForm.product_customs_info.customs_cn_description | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="德国海关编码">
                            <span class="form-border-bottom">{{editForm.product_customs_info.customs_de_code | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="德国海关描述">
                            <span v-if="editForm.product_customs_info" class="form-border-bottom">{{editForm.product_customs_info.customs_de_description | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="中国进口关税">
                            <span class="form-border-bottom">{{editForm.product_customs_info.import_cn_tariffs | percent | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="中国监管条件">
                            <span v-if="editForm.product_customs_info" class="form-border-bottom">{{editForm.product_customs_info.customs_cn_conditions | defaultStr}}</span>
                        </el-form-item>
                        <el-form-item label="中国海关产品描述" prop="product_cn_customs_description">
                            <el-input type="textarea" :rows="5"
                                      v-model="editForm.product_cn_customs_description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import ProductTradeNameAdd from "../product/product-trade-name/product-trade-name-add";
    import HostConfig from "../../config/host-config"

    export default {
        components: {
            ProductTradeNameAdd
        },
        data() {
            let self = this;
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "brand",
                        "type": "brand",
                        "translate": "品牌名称",
                    }, {
                        "field_name": "country",
                        "type": "country",
                        "translate": "国家",
                    }, {
                        "field_name": "product_name",
                        "type": "string",
                        "translate": "产品型号/订货号",
                    }, {
                        "field_name": "has_pushed",
                        "type": "boolean",
                        "translate": "是否催",
                    },
                ],
                allowFilterFieldsMore: [],

                filter: {},

                listData: [],
                listDataShow: [],

                dialogShow: false,
                editForm: {
                    brand: {},
                    product_trade_name_id: '',
                    product_trade_name: {},
                    product_customs_info_id: '',
                    product_customs_info: {},
                    gross_weight: '',
                    net_weight: '',
                    estimated_weight: '',
                    forecast_import_tariff: '',
                    extra_import_tariff: '',
                    product_cn_customs_description: '',
                },
                editFormRule: {
                    product_customs_info_id: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.editForm.product_customs_info_id && !self.editForm.forecast_import_tariff && self.editForm.forecast_import_tariff !== 0) {
                                    callback(new Error('中国海关编码 和 预估关税，二者必须选填一项'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    forecast_import_tariff: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!self.editForm.product_customs_info_id && !self.editForm.forecast_import_tariff && self.editForm.forecast_import_tariff !== 0) {
                                    callback(new Error('预估关税 和 中国海关编码，二者必须选填一项'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],

                    gross_weight: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (
                                        !Number(self.editForm.gross_weight)
                                        && !Number(self.editForm.net_weight)
                                        && !Number(self.editForm.estimated_weight)
                                ) {
                                    callback(new Error('预估重量 和 净重毛重，必须二选一！'));
                                } else if (
                                        !Number(value) && Number(self.editForm.net_weight)
                                ) {
                                    callback(new Error('净重与毛重，必须一起填写！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    net_weight: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (
                                        !Number(self.editForm.gross_weight)
                                        && !Number(self.editForm.net_weight)
                                        && !Number(self.editForm.estimated_weight)
                                ) {
                                    callback(new Error('预估重量 和 净重毛重，必须二选一！'));
                                } else if (
                                      !Number(value) && Number(self.editForm.gross_weight)
                                ) {
                                    callback(new Error('净重与毛重，必须一起填写！'));
                                } else if (
                                        Number(value) > Number(self.editForm.gross_weight)
                                ) {
                                    callback(new Error('净重不可大于毛重！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    estimated_weight: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (
                                        !Number(self.editForm.gross_weight)
                                        && !Number(self.editForm.net_weight)
                                        && !Number(self.editForm.estimated_weight)
                                ) {
                                    callback(new Error('预估重量 和 净重毛重，必须二选一！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },


                loading: false,
            }
        },
        computed:{
            productAllowChangeApprovalInfo() {
                return HostConfig.productAllowChangeApprovalInfo.length===0 || HostConfig.productAllowChangeApprovalInfo.indexOf(this.$store.state.userInfo.id) > -1
            },
        },
        watch: {
            dialogShow(val) {
                if (!val) {
                    this.$refs.editForm.clearValidate();
                }
            },
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init()

        },
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.filter = this.$utils.formatSearchFilterV6(this.filter);
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_verify_products,
                    success: function (data) {
                        self.loading = false;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].brand) {
                                data[i].brandName = data[i].brand.name;
                                data[i].country = data[i].brand.country;
                                data[i].manufactruer = data[i].brand.manufactruer;
                            } else {
                                data[i].brand = {}
                            }
                        }
                        let arr = [];
                        data.forEach((item) => {
                            let itemYes = true;
                            if (self.filter.brand && self.filter.brand !== item.brand.id) {
                                itemYes = false;
                            }
                            if (self.filter.country && self.filter.country !== item.brand.country) {
                                itemYes = false;
                            }
                            if ((self.filter.has_pushed || self.filter.has_pushed === false) && self.filter.has_pushed !== item.has_pushed) {
                                itemYes = false;
                            }
                            if (self.filter.product_name
                                    && (!item.type_no || item.type_no.indexOf(self.filter.product_name) === -1)
                                    && (!item.order_no || item.order_no.indexOf(self.filter.product_name) === -1)
                            ) {
                                itemYes = false;
                            }
                            if (itemYes) arr.push(item);
                        });
                        self.listData = arr;
                        self.sortChange({prop: 'verify_pooled_time', order: 'ascending'})
                    }
                })
            },

            editRow(row) {
                let self = this;
                let editForm = JSON.parse(JSON.stringify(row));
                Object.assign(editForm, {
                    product_trade_name_id: '',
                    product_trade_name: {},
                    product_customs_info_id: '',
                    product_customs_info: {},
                    gross_weight: '',
                    net_weight: '',
                    estimated_weight: '',
                    forecast_import_tariff: '',
                    extra_import_tariff: '',
                    product_cn_customs_description: '',
                });


                self.loading = true;
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + row.product_id,
                    success(data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (data.msg.product_trade_name) {
                                editForm.product_trade_name_id = data.msg.product_trade_name.id;
                                editForm.product_trade_name = data.msg.product_trade_name;
                            }
                            if (data.msg.product_customs_info) {
                                editForm.product_customs_info_id = data.msg.product_customs_info.id;
                                editForm.product_customs_info = data.msg.product_customs_info;
                            }
                            if (data.msg.gross_weight && data.msg.gross_weight !== '0' && data.msg.gross_weight !== 0) editForm.gross_weight = data.msg.gross_weight;
                            if (data.msg.net_weight && data.msg.net_weight !== '0' && data.msg.net_weight !== 0) editForm.net_weight = data.msg.net_weight;
                            if (data.msg.estimated_weight && data.msg.estimated_weight !== '0' && data.msg.estimated_weight !== 0) editForm.estimated_weight = data.msg.estimated_weight;
                            if (data.msg.forecast_import_tariff || data.msg.forecast_import_tariff === 0) editForm.forecast_import_tariff = data.msg.forecast_import_tariff;
                            if (data.msg.extra_import_tariff || data.msg.extra_import_tariff === 0) editForm.extra_import_tariff = data.msg.extra_import_tariff;
                            if (data.msg.product_cn_customs_description) editForm.product_cn_customs_description = data.msg.product_cn_customs_description;
                        }
                        self.editForm = editForm;
                        self.dialogShow = true;
                    }, error() {
                        self.editForm = editForm;
                        self.dialogShow = true;
                    }
                })
            },
            productTradeNameAddSuccess(item) {
                if (item.id) {
                    this.editForm.product_trade_name = JSON.parse(JSON.stringify(item));
                    this.editForm.product_trade_name_id = item.id;
                    this.$refs.product_trade_name.setInit(item.id, [item])
                }
            },
            clickSaveDate() {
                let self = this;
                self.$refs.editForm.validate(function (valid) {
                    if (valid) {
                        if (self.editForm.product_customs_info_id && !self.editForm.product_customs_info.import_cn_tariffs && self.editForm.product_customs_info.import_cn_tariffs!==0) {
                            self.$message({
                                showClose: true,
                                message: '海关编码无“中国进口关税”，请先完善！',
                                type: 'error'
                            });
                            return
                        }
                        self.loading = true;
                        self.$http({
                            url: self.$api.inquiry_v6_verify + '/' + self.editForm.product_id,
                            type: 'PUT',
                            requestBody: true,
                            data: {
                                "product_id": self.editForm.product_id,
                                "gross_weight": self.editForm.gross_weight,
                                "net_weight": self.editForm.net_weight,
                                "estimated_weight": self.editForm.estimated_weight,
                                "forecast_import_tariff": self.editForm.forecast_import_tariff || self.editForm.forecast_import_tariff===0 ? self.editForm.forecast_import_tariff : undefined,
                                "extra_import_tariff": self.editForm.extra_import_tariff || self.editForm.extra_import_tariff===0 ? self.editForm.extra_import_tariff : undefined,
                                "product_cn_custom_description": self.editForm.product_cn_customs_description,
                                "product_custom_id": self.editForm.product_customs_info_id || undefined,
                                "product_trade_id": self.editForm.product_trade_name_id || undefined,
                            },
                            success: function (data) {
                                self.loading = false;
                                if (data) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    self.getListData();
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

            //标记为3C
            markAs3c(row) {
                let self = this;
                self.$confirm('确定标记为3C吗？此操作不可逆！', '提示', {
                    confirmButtonText: '确定执行',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.inquiry_v6_verify + '/' + row.product_id + '/mark3C',
                                type: 'PUT',
                                requestBody: true,
                                data: {
                                    "3_c": true,
                                    "product_id": row.product_id
                                },
                                success: function () {
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

            netWeightChange(){
                if(this.editForm.net_weight){
                    this.editForm.gross_weight = Number(this.editForm.net_weight * 1.2).myRound(4);
                }
            },

            sortChange({prop, order}) {
                if (this.listData.length === 0) return false;
                let arr1=[];
                let arr2=[];
                this.listData.forEach((item)=>{
                    if(item.has_pushed){
                        arr1.push(item)
                    }else {
                        arr2.push(item);
                    }
                });
                if (order) {
                    arr1.sort(this.$utils.objectArraySort(prop,order));
                    arr2.sort(this.$utils.objectArraySort(prop,order));
                }
                this.listDataShow = arr1.concat(arr2);
            },

        }
    }
</script>

<style>

</style>
