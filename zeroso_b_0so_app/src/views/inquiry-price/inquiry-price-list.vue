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
                    <el-button type="primary" @click="openDetail()">创建询报价单</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail"
                          border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="单号" field_name="ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.id}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="品牌" field_name="BRAND_ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.name}}</span>
                            <BrandLever :state="scope.row.brand.state" :hideUnknown="true"> </BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column width="400">
                        <template slot="header">
                            <ButtonSort label="供应商" field_name="SUPPLIER_COMPANY_ID"></ButtonSort>
                            <ButtonSort label="客户" field_name="CUSTOMER_COMPANY_ID" v-if="menuHasPartner"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <span>{{(scope.row.supplier_company?scope.row.supplier_company.company_name:'') | defaultStr}}</span>
                                <span v-if="scope.row.supplier_contact_user">，{{scope.row.supplier_contact_user.name}}</span>
                            </p>
                            <p v-if="menuHasPartner">
                                <span>{{(scope.row.customer_company?scope.row.customer_company.company_name:'') | defaultStr}}</span>
                                <span v-if="scope.row.customer_employee">，{{scope.row.customer_employee.name}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column  v-if="sheetType==='CANCELED'">
                        <template slot="header">
                            <ButtonSort label="取消前状态" field_name="PREVIOUS_SHEET_STATE"></ButtonSort>
                            <ButtonSort label="取消时间" field_name="STATE_UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <el-tag>{{scope.row.previous_sheet_state | inquirySheetState}}</el-tag>
                            </p>
                            <p>{{scope.row.state_updated_time | zerosoCompanyDate}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column  v-if="sheetType!=='CANCELED'">
                        <template slot="header">
                            <ButtonSort label="询价单状态" field_name="SHEET_STATE"></ButtonSort>
                            <ButtonSort label="状态变更时间" field_name="STATE_UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>
                                <InquirySheetState :state="scope.row.sheet_state"></InquirySheetState>
                                <el-tag type="danger" effect="dark" v-if="scope.row.has_pushed && scope.row.sheet_state==='EXPENSE_EXAMINE'">已催</el-tag>
                            </p>
                            <p>{{scope.row.state_updated_time | zerosoCompanyDate}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="客户询价单号" field_name="CUSTOMER_INQUIRY_NO" v-if="menuHasPartner"></ButtonSort>
                            <ButtonSort label="跟进人员" field_name="RESELLER_FOLLOWER_ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p v-if="menuHasPartner">{{scope.row.customer_inquiry_no | defaultStr}}</p>
                            <p>{{(scope.row.follower_user?scope.row.follower_user.name:'') | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="采购价总额" field_name="GRAND_PROCUREMENT_PRICE"></ButtonSort>
                            <ButtonSort label="销售价总额" field_name="GRAND_SELLING_PRICE" v-if="menuHasPartner"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.grand_procurement_price | isoCurrency(scope.row.currency_unit.currency) | defaultStr}}</p>
                            <p v-if="menuHasPartner">{{scope.row.grand_selling_price | isoCurrency(scope.row.currency_unit.currency) | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name">
                        <template slot="header">
                            <ButtonSort label="创建时间" field_name="CREATE_TIME"></ButtonSort>
                            <ButtonSort label="修改时间" field_name="UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.created_time | zerosoCompanyDate | defaultStr}}</p>
                            <p>{{scope.row.updated_time | zerosoCompanyDate | defaultStr}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    import InquirySheetState from "./component/InquirySheetState";
    export default {
        components: {InquirySheetState},
        inject:['reload'],
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "sheetId",
                        "type": "integer",
                        "translate": "单号",
                        "is_hidden": false
                    }, {
                        "field_name": "brandId",
                        "type": "brand",
                        "translate": "品牌",
                        "is_hidden": false
                    }, {
                        "field_name": "productId",
                        "type": "product",
                        "translate": "型号/订货号",
                    }, {
                        "field_name": "supplierCompanyId",
                        "type": "partner",
                        "translate": "供应商",
                        "is_hidden": false
                    }, {
                        "field_name": "customerCompanyId",
                        "type": "partner",
                        "translate": "客户",
                        "is_hidden": false
                    }, {
                        "field_name": "sheetState",
                        "type": "selection",
                        "translate": "状态",
                        "is_hidden": false
                    },{
                        "field_name": "customerInquiryNo",
                        "type": "string",
                        "translate": "客户询价单号",
                        "is_hidden": false
                    }, {
                        "field_name": "resellerFollowerId",
                        "type": "user",
                        "translate": "跟进员",
                        "is_hidden": false
                    },
                ],
                allowFilterFieldsMore: [],

                sheetType: undefined,
                breadNameList:{
                    OTHERS:'跟进中',
                    CONTRACT_ENFORCED:'已执行',
                    CANCELED:'已取消',
                    all:'所有',
                },

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,


                loading: false,
            }
        },
        computed:{
            menuHasPartner() { //B系统根据Bmenu菜单配置，判断是否有合作伙伴菜单
                return !!this.$store.state.permissionsMap['partner']
            },
        },
        watch: {
            '$route'() {
                this.reload();
            }
        },
        created() {
            this.init()

        },
        mounted() {
            this.setControlSearch()
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
            setControlSearch(){
                for (let i = 0; i < this.allowFilterFieldsFast.length; i++) {
                    if (this.allowFilterFieldsFast[i].field_name === 'sheetState') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.inquirySheetState.forEach((item) => {
                            if(this.sheetType==='CANCELED'){
                                this.allowFilterFieldsFast[i].field_name = 'previousSheetState';
                                this.allowFilterFieldsFast[i].translate = '取消前状态';
                                if(item.code !== 'CANCELED'){
                                    this.allowFilterFieldsFast[i].selections.push([
                                        item.code,
                                        item.label
                                    ])
                                }
                            }else if(this.sheetType==='CONTRACT_ENFORCED'){
                                if(item.code === this.sheetType){
                                    this.allowFilterFieldsFast[i].selections.push([
                                        item.code,
                                        item.label
                                    ])
                                }
                            }else if(this.sheetType==='others'){
                                if(item.code!=='CONTRACT_ENFORCED' && item.code!=='CANCELED'){
                                    this.allowFilterFieldsFast[i].selections.push([
                                        item.code,
                                        item.label
                                    ])
                                }
                            }else {
                                this.allowFilterFieldsFast[i].selections.push([
                                    item.code,
                                    item.label
                                ])
                            }

                        });
                        break
                    }
                }
                this.$refs.controlSearch.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore)
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_quotations,
                    data: {
                        resellerCompanyId:self.$store.state.currentCompany.account_company_id,
                        'pageRequest.page':self.pageNum,
                        'pageRequest.perPage':self.pageSize,
                        sheetType:self.sheetType==='all'?undefined:self.sheetType,
                        ...self.$utils.formatSearchFilterV6(self.filter),
                        ...self.$utils.formatSearchSortV6(self.order_by),
                        isNewAccount:!self.menuHasPartner
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
            openDetail(row) {
                let query = {
                    id : row && row.id ? row.id : undefined,
                    sheetType:this.sheetType==='all'?undefined:this.sheetType,
                    isNewAccount:!this.menuHasPartner || undefined
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },


        }
    }
</script>

<style>

</style>
