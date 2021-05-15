<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>询价单</el-breadcrumb-item>
                    <el-breadcrumb-item>{{breadNameList[sheetType]}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    ref="controlSearch"
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" border v-loading="loading">
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
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌等级" width="95px">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <BrandLever :state="scope.row.brand.state"> </BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column label="国家">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.country | country | defaultStr}}</span>
                            <isEuCountry :country="scope.row.brand.country"></isEuCountry>
                        </template>
                    </el-table-column>
                    <el-table-column width="400">
                        <template slot="header">
                            <ButtonSort label="供应商" field_name="SUPPLIER_ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p v-if="scope.row.supplier_company">
                                <span>{{scope.row.supplier_company.company_name}}</span>
                                <span v-if="scope.row.supplier_company.name">，{{scope.row.supplier_company.name}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="状态" field_name="STATE"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <SupplierInquiryState :state="scope.row.state"></SupplierInquiryState>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="创建时间" field_name="CREATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.created_time | zerosoCompanyDate | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="修改时间" field_name="UPDATE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.updated_time | zerosoCompanyDate | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="状态变更时间" field_name="STATE_CHANGE_TIME"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{scope.row.state_updated_time | zerosoCompanyDate | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="跟进人" field_name="FOLLOWER_ID"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <p>{{(scope.row.follower_user?scope.row.follower_user.name:'') | defaultStr}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    import SupplierInquiryState from "./component/SupplierInquiryState";
    export default {
        components: {SupplierInquiryState},
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
                        "is_hidden": false
                    }, {
                        "field_name": "followerUserId",
                        "type": "selection",
                        "translate": "跟进人",
                        "is_hidden": false
                    }, {
                        "field_name": "state",
                        "type": "selection",
                        "translate": "状态",
                        "is_hidden": false
                    }, {
                        "field_name": "supplierCompanyId",
                        "type": "partner",
                        "translate": "供应商",
                        "is_hidden": false
                    },
                ],
                allowFilterFieldsMore: [],

                sheetType: undefined,
                breadNameList: {
                    OTHERS: '跟进中',
                    QUOTE_REFUSED: '无报价',
                    QUOTED: '已报价',
                    all: '所有',
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
                this.init()
            }
        },
        created() {
            this.init();
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
                this.$nextTick(()=>{
                    this.setControlSearch()
                })
            },
            setControlSearch() {
                for (let i = 0; i < this.allowFilterFieldsFast.length; i++) {
                    if (this.allowFilterFieldsFast[i].field_name === 'state') {
                        this.allowFilterFieldsFast[i].selections = [];
                        this.$store.state.supplierInquiryState.forEach((item) => {
                            if (this.sheetType === 'QUOTED' || this.sheetType === 'QUOTE_REFUSED') {
                                if (item.code === this.sheetType) {
                                    this.allowFilterFieldsFast[i].selections.push([
                                        item.code,
                                        item.label
                                    ])
                                }
                            } else if (this.sheetType === 'OTHERS') {
                                if (item.code !== 'QUOTED' && item.code !== 'QUOTE_REFUSED') {
                                    this.allowFilterFieldsFast[i].selections.push([
                                        item.code,
                                        item.label
                                    ])
                                }
                            } else {
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
                    url: self.$api.inquiry_v6_pool_quotations,
                    data: {
                        currentUserId: self.$store.state.userInfo.id,
                        'pageRequest.page': self.pageNum,
                        'pageRequest.perPage': self.pageSize,
                        sheetType: self.sheetType === 'all' ? undefined : self.sheetType,
                        ...self.$utils.formatSearchFilterV6(self.filter),
                        ...self.$utils.formatSearchSortV6(self.order_by),
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
                    url: self.$api.inquiry_v6_pool_quotations+'/followers',
                    success: function (data) {
                        let arr=[];
                        for(let i=0;i<data.length;i++){
                            arr.push([data[i].id,data[i].nick_name])
                        }
                        for (let i = 0; i < self.allowFilterFieldsFast.length; i++) {
                            if (self.allowFilterFieldsFast[i].field_name === 'followerUserId') {
                                self.allowFilterFieldsFast[i].selections = arr;
                                break
                            }
                        }
                        self.$refs.controlSearch.init(self.allowFilterFieldsFast, self.allowFilterFieldsMore)
                    }
                })
            },

            openDetail(row) {
                let query = {
                    id: row && row.id ? row.id : undefined,
                    currentUserId: this.$store.state.userInfo.id,
                    sheetType: this.sheetType === 'all' ? undefined : this.sheetType,
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
