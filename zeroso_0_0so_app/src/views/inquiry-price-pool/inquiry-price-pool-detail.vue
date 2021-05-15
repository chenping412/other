<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">
                        询价池{{poolType? '-'+breadNameList[poolType] : ''}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '品牌询价详情' : '新增品牌询价'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">品牌信息</h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">

                        </div>
                    </div>
                </div>

                <el-form class="detail-base-body clearfix" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="90px">
                    <el-row :gutter="30">
                        <el-col :span="8">
                            <el-form-item label="品牌：">
                                <div class="form-border-bottom">
                                    <a class="blue margin-right-20" target="_blank"
                                       :href="'#/product/brand/detail?id='+detailForm.brand.id">{{detailForm.brand.name}}</a>
                                    <span class="margin-right-10">{{detailForm.brand.country | country}}</span>
                                    <isEuCountry :country="detailForm.brand.country"></isEuCountry>
                                    <BrandLever :state="detailForm.brand.state" :hideUnknown="true"> </BrandLever>
                                </div>
                            </el-form-item>
                            <el-form-item label="官网：">
                                <span class="form-border-bottom">
                                    <a class="blue" :href="detailForm.brand.website" target="_blank">{{detailForm.brand.website}}</a>
                                </span>
                            </el-form-item>
                            <el-form-item label="制造商：">
                                <span class="form-border-bottom">{{detailForm.brand.manufactruer | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="币种：">
                                <span class="form-border-bottom">{{currency}}</span>
                            </el-form-item>
                            <el-form-item label="跟进人：">
                                <span class="form-border-bottom">{{(detailForm.brand.follower_user ? detailForm.brand.follower_user.name : '') | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>

            <div class="car-box clearfix">
                <h3 class="left" style="line-height: 32px;">跟进中询价单</h3>
                <div class="inquiry-price-order-list">
                    <router-link v-for="(item,$index) in detailForm.in_progress_sheets"
                                 :to="'/inquiry-price/all/detail?id='+item" :key="$index">{{item}}
                    </router-link>
                </div>

                <inquiry-price-create
                        class="right"
                        :brandId="queryId"
                        @update="init">
                    <el-button type="primary">创建询价单</el-button>
                </inquiry-price-create>
            </div>

            <div class="car-box">
                <el-table :data="inquired_products" @sort-change="sortChange" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号" prop="type_no" sortable>
                        <template slot-scope="scope">
                            <router-link class="blue" target="_blank"
                                         :to="'/product/product/detail?id='+scope.row.id">
                                {{scope.row.type_no}}
                            </router-link>
                            <a v-if="scope.row.type_no"
                               :title="'搜索'+detailForm.brand.name+' '+scope.row.type_no"
                               class="icon-google-search"
                               target="_blank"
                               :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.type_no">
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号" prop="order_no" sortable>
                        <template slot-scope="scope">
                            <router-link class="blue" target="_blank"
                                         :to="'/product/product/detail?id='+scope.row.id">
                                {{scope.row.order_no}}
                            </router-link>
                            <a v-if="scope.row.order_no"
                               :title="'搜索'+detailForm.brand.name+' '+scope.row.order_no"
                               class="icon-google-search"
                               target="_blank"
                               :href="'https://www.google.de/search?q='+detailForm.brand.name+'%20'+scope.row.order_no">
                            </a>
                        </template>
                    </el-table-column>

                    <el-table-column>
                        <template v-slot:header>
                            <p>参数</p>
                            <p>附件</p>
                        </template>
                        <template slot-scope="scope">
                            <div class="margin-bottom-10">
                                <el-tooltip effect="light" placement="top">
                                    <span class="nowrap">{{scope.row.parameters}}</span>
                                    <pre slot="content" class="scroll" style="max-height: 500px;" v-html="scope.row.parameters"></pre>
                                </el-tooltip>
                            </div>
                            <div v-if="scope.row.inquiryFileList">
                                <FileListShow :fileList="scope.row.inquiryFileList"></FileListShow>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template v-slot:header>
                            <span>询报价单号</span>
                            <el-tooltip placement="top">
                                <i class="el-icon-question"></i>
                                <div slot="content">当前型号对应的询报价单号，不包含状态：已取消、已签订合同、已执行合同</div>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <div v-if="scope.row.inquiry_sheet_attachments && scope.row.inquiry_sheet_attachments.length>0">
                                <span v-for="(item,$index) in scope.row.inquiry_sheet_attachments" :key="$index">
                                    <router-link
                                            class="blue margin-right-5"
                                            target="_blank"
                                            v-if="item.inquiry_quotation_sheet_id"
                                            :to="'/inquiry-quotation/all/detail?id='+item.inquiry_quotation_sheet_id">
                                        {{item.inquiry_quotation_sheet_id}}
                                    </router-link>
                                </span>
                                <p v-if="scope.row.inquiry_sheet_attachments[0] && scope.row.inquiry_sheet_attachments[0].create_time">
                                    {{scope.row.inquiry_sheet_attachments[0].create_time | zerosoCompanyTime}}
                                </p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template v-slot:header>
                            <span>供应商</span>
                            <el-tooltip placement="top">
                                <i class="el-icon-question"></i>
                                <div slot="content">需要在品牌详情页添加供应商</div>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <div v-if="scope.row.isEditPrice">
                                <el-select v-model="scope.row.supplier_id">
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
                            </div>

                            <span v-else>{{scope.row.supplier_id}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="760px">
                        <template v-slot:header>
                            <table class="tiered-price-edit-table">
                                <thead>
                                <tr>
                                    <th>最小起订量</th>
                                    <th>面价(欧元)</th>
                                    <th class="col-discount">
                                        <div>
                                            优惠折扣(%)
                                        </div>
                                        <div>
                                            折扣系列(选一项)
                                        </div>
                                    </th>
                                    <th>独立销售</th>
                                    <th>货期(天)</th>
                                    <th>有效期</th>
                                    <th></th>
                                </tr>
                                </thead>
                            </table>
                        </template>
                        <template slot-scope="scope">
                            <tiered-price-edit
                                    :ref="'tieredPriceEdit'+scope.row.id"
                                    :isEditPrice.sync="scope.row.isEditPrice"
                                    :scopeRow.sync="scope.row"
                                    :brandId="detailForm.brand ? detailForm.brand.id :null"
                                    :supplierId="scope.row.supplier_id">
                            </tiered-price-edit>
                        </template>
                    </el-table-column>

                    <el-table-column width="180px">
                        <template slot-scope="scope">
                            <div>
                                <div v-if="!scope.row.isEditPrice">
                                    <el-button size="mini" type="warning"
                                               :disabled="hasEditAction"
                                               @click="clickEditRowPrice(scope.row)">编辑价格
                                    </el-button>
                                </div>
                                <div v-else>
                                    <el-button size="mini" type="success"
                                               @click="saveEditRowPriceData(scope.row)">保存价格
                                    </el-button>
                                    <el-button size="mini" plain @click="clickCancelEdit(scope.row)">取消编辑</el-button>
                                </div>
                            </div>

                            <p v-if="scope.row.quotation_comment">
                                备注：{{scope.row.quotation_comment.comment_type | productQuotationCommentType}}，
                                {{scope.row.quotation_comment.comment_no |
                                productQuotationComment(scope.row.quotation_comment.comment_type,scope.row.quotation_comment.comment)}}
                            </p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>


    </div>
</template>

<script>
    import TieredPriceEdit from "./../inquiry-price/component/tieredPriceEdit";
    import InquiryPriceCreate from "./component/inquiry-price-create";

    export default {
        components: {InquiryPriceCreate, TieredPriceEdit},
        data() {
            return {
                queryId: '',
                parentQuery: '',

                poolType: undefined,
                breadNameList: {
                    NO_PRICE: '无价格表',
                    HAS_MALL: '有商城',
                    HAS_PRICE: '有价格表',
                },

                isEdit: false,
                detailForm: {
                    brand: {},
                    inquired_products: [],
                },
                detailFormRule: {},

                currency: 'EUR',

                inquired_products: [],

                hasEditAction: false,

                supplierListData: [],
                supplierNormalSelectId: null,

                loading: false,

                priceSourceMap:{
                    NO_PRICE: 'inquiry_sheet',
                    HAS_MALL: 'e_shop',
                    HAS_PRICE: 'price_list',
                }
            }
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
                this.poolType = this.$route.params.poolType;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool + '/' + self.queryId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        if (data.inquired_products) {
                            for (let i = 0; i < data.inquired_products.length; i++) {
                                if (!data.inquired_products[i].supplier_id) data.inquired_products[i].supplier_id = '';
                                if (!data.inquired_products[i].price_list) data.inquired_products[i].price_list = [];
                                data.inquired_products[i].isEditPrice = false;
                                if (!data.inquired_products[i].price_list) data.inquired_products[i].price_list = [];
                                if (!data.inquired_products[i].supplier_id) data.inquired_products[i].supplier_id = null;

                                for (let k = 0; k < data.inquired_products[i].price_list.length; k++) {
                                    data.inquired_products[i].price_list[k].discountPercent = data.inquired_products[i].price_list[k].discount || data.inquired_products[i].price_list[k].discount === 0 ? Number(data.inquired_products[i].price_list[k].discount * 100) : null;
                                }

                                //遍历产品对应不同询报价单附件
                                data.inquired_products[i].inquiryFileList = [];
                                if (data.inquired_products[i].inquiry_sheet_attachments) {
                                    let inquiry_sheet_attachments = data.inquired_products[i].inquiry_sheet_attachments;
                                    for (let k = 0; k < inquiry_sheet_attachments.length; k++) {
                                        if (inquiry_sheet_attachments[k].attachments && inquiry_sheet_attachments[k].attachments.file_id_list) {
                                            let file_id_list = inquiry_sheet_attachments[k].attachments.file_id_list;
                                            for (let m = 0; m < file_id_list.length; m++) {
                                                try {
                                                    data.inquired_products[i].inquiryFileList.push(JSON.parse(file_id_list[m]));
                                                } catch (e) {
                                                    console.log(e)
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                            self.inquired_products = JSON.parse(JSON.stringify(data.inquired_products));
                        } else {
                            self.inquired_products = [];
                        }

                        self.detailForm = data;
                        self.getSupplierListData();
                    }
                })
            },
            sortChange({prop, order}) {
                if (this.inquired_products.length === 0) return false;
                if (order) {
                    this.inquired_products.sort(this.$utils.objectArraySort(prop,order))
                } else {
                    this.inquired_products = JSON.parse(JSON.stringify(this.detailForm.inquired_products));
                }
                this.hasEditAction = false;
            },
            createInquiry() {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                let product_id_list = [];
                self.inquired_products.forEach((item) => {
                    product_id_list.push(item.id)
                });
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_brand_inquiries + '/' + self.queryId + '/inquiries',
                    type: 'POST',
                    requestBody: true,
                    data: {
                        follower_id: self.$store.state.userInfo.id,
                        product_id_list: product_id_list,
                    },
                    success: function (data) {
                        self.$message({
                            showClose: true,
                            message: '创建成功！',
                            type: 'success'
                        });
                        if (data.sheet_id) {
                            self.$router.push({
                                path: "/inquiry-price/all/detail",
                                query: {
                                    id: data.sheet_id,
                                    currentUserId: self.$store.state.userInfo.id,
                                }
                            })
                        } else {
                            self.getDetailData();
                        }
                        self.loading = false;
                    }
                })
            },


            //获取当前品牌绑定的供应商
            getSupplierListData(callback) {
                let self = this;
                self.$http({
                    url: self.$api.product_brand_v5 + '/' + self.detailForm.brand.id + '/suppliers',
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg && data.msg) {
                            let supplierListData = data.msg;
                            self.supplierListData = supplierListData;
                            if(supplierListData[0]){
                                self.supplierNormalSelectId = supplierListData[0].company_info_with_follower.account_company_id;
                                for (let i = 0; i < supplierListData.length; i++) {
                                    if (supplierListData[i].is_default && supplierListData[i].company_info_with_follower) {
                                        self.supplierNormalSelectId = supplierListData[i].company_info_with_follower.account_company_id;
                                    }
                                }
                            }
                        }
                        if (callback) callback();
                    }
                })
            },

            //编辑价格
            clickEditRowPrice(row) {
                let self = this;
                if (self.$store.state.currentCompany.account_company_id !== 9428) {
                    self.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                row.isEditPrice = true;
                if (row.price_list.length === 0) {
                    this.$refs['tieredPriceEdit' + row.id].clickAddPriceList(row.price_list);
                }
                this.$emit('update:hasEditAction', true);
            },
            //保存价格
            saveEditRowPriceData(row) {
                let self = this;
                if (!row.supplier_id) {
                    self.$message({
                        showClose: true,
                        message: '请选择供应商！',
                        type: 'error'
                    });
                    return
                }
                if (!row.price_list || row.price_list.length === 0) {
                    self.$message({
                        showClose: true,
                        message: '请填写价格！',
                        type: 'error'
                    });
                    return
                }

                let price_list = self.checkPriceRules(row.price_list);
                if (!price_list) return;
                for(let i=0;i<price_list.length;i++){
                    if(price_list[i].unit_sellable===false){
                        self.$confirm('注意：当选择非独立销售时，务必要给该产品添加配件，否则将无法销售', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.saveEditRowPriceDataSubmit(row,price_list)
                                }
                            }
                        });
                        return;
                    }
                }
                self.saveEditRowPriceDataSubmit(row,price_list)
            },
            saveEditRowPriceDataSubmit(row,price_list){
                let self = this;
                self.$confirm('在提交报价之前，请确保<b class="red">供应商、面价、折扣</b>等都填写正确', '提示', {
                    confirmButtonText: '继续提交',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString:true,
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.inquiry_v6_brand_inquiries + '/' + self.queryId + '/inquiries/products/' + row.id + '/price',
                                type: 'POST',
                                requestBody: true,
                                data: {
                                    price_list: price_list,
                                    "currency": self.currency,
                                    "brand_id": self.queryId,
                                    "product_id": row.id,
                                    "supplier_id": row.supplier_id,
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.updatable) {
                                        self.$message({
                                            showClose: true,
                                            message: '保存成功！',
                                            type: 'success'
                                        });
                                        self.getDetailData();
                                        row.isEditPrice = false;
                                        self.hasEditAction = false;
                                    }
                                }
                            })
                        }
                    }
                });
            },


            checkPriceRules(list) {
                let self = this;
                let price_list = [];
                for (let i = 0; i < list.length; i++) {
                    let priceItem = list[i];

                    if (!priceItem.min_qty && priceItem.min_qty !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写最小起订量，,最小填1',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.price && priceItem.price !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写面价！',
                            type: 'error'
                        });
                        return false
                    } else if (priceItem.price === '0' || priceItem.price === 0) {
                        self.$message({
                            showClose: true,
                            message: '面价必须大于0！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.discountPercent && priceItem.discountPercent !== 0 && !priceItem.discount_serie_id) {
                        self.$message({
                            showClose: true,
                            message: '优惠折扣 与 折扣系列，至少需要选填一项！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.shipment_period && priceItem.shipment_period !== 0) {
                        self.$message({
                            showClose: true,
                            message: '请填写货期！',
                            type: 'error'
                        });
                        return false
                    }
                    if (!priceItem.expire_time) {
                        self.$message({
                            showClose: true,
                            message: '请填写有效期！',
                            type: 'error'
                        });
                        return false
                    }
                    price_list.push({
                        ...priceItem,
                        "discount": Number((priceItem.discountPercent / 100).toFixed(4)),
                        "source": self.priceSourceMap[self.poolType],
                    })
                }
                return price_list;
            },
            //取消编辑
            clickCancelEdit(row) {
                row.isEditPrice = false;
                this.hasEditAction = false;
                this.getDetailData();
            },

        }
    }
</script>

<style lang="scss">
    @import "../../assets/css/config";

    .inquiry-price-order-list {
        float: left;
        padding: 5px 20px;

        a {
            margin: 0 10px;
            color: $color-link;
            font-size: 14px;
            line-height: 22px;
            font-weight: bolder;
        }
    }
</style>
