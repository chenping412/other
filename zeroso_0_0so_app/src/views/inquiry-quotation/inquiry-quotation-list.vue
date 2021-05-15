<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>询报价单</el-breadcrumb-item>
                    <el-breadcrumb-item>{{breadNameList[sheetType]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <ControlSearch ref="controlSearch" :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                           :allowFilterFieldsFast.sync="allowFilterFieldsFast" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="openCreate">创建询报价单</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll" v-loading="loading">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column width="100px">
                        <template slot="header">
                            <ButtonSort label="单号" field_name="ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.id}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="品牌(跟进人)" field_name="BRAND_ID"></ButtonSort>
                            <div>品牌等级</div>
                        </template>
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <div>
                                <span>{{scope.row.brand.name}}</span>
                                <span v-if="scope.row.brand.follower_user">
                                    ({{scope.row.brand.follower_user.name}})
                                </span>
                            </div>
                            <BrandLever :state="scope.row.brand.state"> </BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column width="300">
                        <template slot="header">
                            <div>供应商</div>
                            <div>公司等级 / 跟进人</div>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <span>{{(scope.row.inquiry_supplier_company ? scope.row.inquiry_supplier_company.company_name : '') | defaultStr}}</span>
                            </p>
                            <p>
                                <CompanyLever class="margin-right-5" v-if="scope.row.inquiry_supplier_company" :state="scope.row.inquiry_supplier_company.state"></CompanyLever>
                                <span>{{(scope.row.inquiry_supplier_follower_user ? scope.row.inquiry_supplier_follower_user.name : '') | defaultStr}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column width="300">
                        <template slot="header">
                            <ButtonSort label="联营公司" field_name="RESELLER_COMPANY_ID"></ButtonSort>
                            <div>公司等级 / 跟进人</div>
                        </template>
                        <template slot-scope="scope">
                            <p class="blue">
                                <span>{{(scope.row.reseller_company ? scope.row.reseller_company.company_name : '') | defaultStr}}</span>
                                <span v-if="scope.row.reseller_contact_user">,{{scope.row.reseller_contact_user.name | defaultStr}}</span>
                                <CompanyType v-if="scope.row.reseller_company" :type="scope.row.reseller_company.company_type"></CompanyType>
                            </p>
                            <p>
                                <CompanyLever class="margin-right-5" v-if="scope.row.reseller_company" :state="scope.row.reseller_company.state"></CompanyLever>
                                <span>{{(scope.row.reseller_follower_user ? scope.row.reseller_follower_user.name : '') | defaultStr}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="询报价单状态" field_name="SHEET_STATE"></ButtonSort>
                            <ButtonSort label="状态变更时间" field_name="STATE_UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <InquirySheetState :state="scope.row.sheet_state"></InquirySheetState>
                                <el-tag type="danger" effect="dark"
                                        v-if="scope.row.has_pushed && scope.row.sheet_state==='EXPENSE_EXAMINE'">已催
                                </el-tag>
                                <el-tag type="danger" effect="dark" v-if="scope.row.is_zeroso_created">0端创建</el-tag>
                            </p>
                            <p>{{scope.row.state_updated_time | zerosoCompanyTime | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="询价状态" field_name="INQUIRY_STATE"></ButtonSort>
                            <ButtonSort label="状态变更时间" field_name="INQUIRY_STATE_CHANGE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <SupplierInquiryState v-if="scope.row.inquiry_state" :state="scope.row.inquiry_state"></SupplierInquiryState>
                                <span v-else>{{'' | defaultStr}}</span>
                            </p>
                            <p>{{scope.row.inquiry_state_change_time | zerosoCompanyTime | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进人">
                        <template slot-scope="scope">
                            <p>{{(scope.row.follower_user?scope.row.follower_user.name:'') | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="销售金额" field_name="GRAND_PROCUREMENT_PRICE"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.grand_procurement_price | isoCurrency(scope.row.currency_unit.currency) | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name">
                        <template slot="header">
                            <ButtonSort label="创建时间" field_name="CREATE_TIME"></ButtonSort>
                            <ButtonSort label="修改时间" field_name="UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.created_time | zerosoCompanyTime | defaultStr}}</p>
                            <p>{{scope.row.updated_time | zerosoCompanyTime | defaultStr}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    import InquirySheetState from "./component/InquirySheetState";
    import SupplierInquiryState from "../inquiry-price/component/SupplierInquiryState";

    export default {
        components: {SupplierInquiryState, InquirySheetState},
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "sheetId",
                        "type": "integer",
                        "translate": "单号",
                    }, {
                        "field_name": "brandId",
                        "type": "brand",
                        "translate": "品牌",
                    }, {
                        "field_name": "productId",
                        "type": "product",
                        "translate": "型号/订货号",
                    }, {
                        "field_name": "inquirySupplierCompanyId",
                        "type": "partner",
                        "translate": "供应商",
                    }, {
                        "field_name": "inquirySupplierFollowerId",
                        "type": "companyUser",
                        "translate": "供应商跟进人",
                        companyIds:9428,
                    }, {
                        "field_name": "resellerCompanyId",
                        "type": "partner",
                        "translate": "联营公司",
                    }, {
                        "field_name": "resellerFollowerId",
                        "type": "companyUser",
                        "translate": "联营公司跟进人",
                        companyIds:39567,
                    },  {
                        "field_name": "sheetState",
                        "type": "selection",
                        "translate": "询报价单状态",
                    }, {
                        "field_name": "followerId",
                        "type": "selection",
                        "translate": "跟进人",
                        "is_hidden": false
                    }, {
                        "field_name": "isZerosoCreated",
                        "type": "boolean",
                        "translate": "是否由0端创建",
                        "is_hidden": false
                    },
                ],
                allowFilterFieldsMore: [],

                sheetType: undefined,
                breadNameList: {
                    DRAFT: '待询价',
                    INQUIRY_SENT: '已询价',
                    INQUIRY_SENT_TIMEOUT: '待催价',
                    INQUIRY_PUSHED: '已催价',
                    INQUIRY_REPLIED: '已报价',
                    CANCELED: '已取消',
                    CONTRACT_ENFORCED: '已下单',
                    ALL: '全部',
                },

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,


                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init();
            }
        },
        created() {
            this.init()

        },
        mounted() {
            this.getFollowerUserListData();
        },
        methods: {
            init() {
                this.sheetType = this.$route.params.sheetType;

                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? JSON.parse(decodeURIComponent(this.$route.query.order_by)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations,
                    data: {
                        'pageRequest.page': self.pageNum,
                        'pageRequest.perPage': self.pageSize,
                        sheetType: self.sheetType,
                        ...self.$utils.formatSearchFilterV6(self.filter),
                        ...self.$utils.formatSearchSortV6(self.order_by)
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.item) {
                            self.listData = data.item;
                            self.totalCount = data.page.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            //获取跟进人列表
            getFollowerUserListData() {
                let self = this;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations+'/followers',
                    success: function (data) {
                        let arr=[];
                        for(let i=0;i<data.length;i++){
                            arr.push([data[i].id,data[i].nick_name])
                        }
                        for (let i = 0; i < self.allowFilterFieldsFast.length; i++) {
                            if (self.allowFilterFieldsFast[i].field_name === 'followerId') {
                                self.allowFilterFieldsFast[i].selections = arr;
                                break
                            }
                        }
                        self.setControlSearch();
                    },error(){
                        self.setControlSearch();
                    }
                })
            },

            setControlSearch() {
                for (let i = 0; i < this.allowFilterFieldsFast.length; i++) {
                    if (this.allowFilterFieldsFast[i].field_name === 'sheetState') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.inquirySheetState.forEach((item) => {
                            if (item.code !== 'CREATED' && item.code !== 'EXPENSE_APPROVED') {
                                this.allowFilterFieldsFast[i].selections.push([
                                    item.code,
                                    item.label
                                ])
                            }
                        });
                    }
                }
                this.$refs.controlSearch.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore)
            },


            openDetail(row) {
                let query = {
                    id: row && row.id ? row.id : undefined,
                    sheetType: this.sheetType,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },
            openCreate() {
                let query = {};
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'create',
                    query: query
                });
            },


        }
    }
</script>

<style>

</style>
