<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>询价池{{poolType? ' - '+breadNameList[poolType] : ''}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="table-control clearfix">
                <el-input style="width: 400px;" v-model="brandKeyword" clearable
                          placeholder="输入品牌关键词，不区分大小写，自动筛选"></el-input>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-table :data="listDataShow" :default-sort="{prop: 'pooled_in_days', order: 'descending'}"
                          @row-click="openDetail" border v-loading="loading">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="brandName" label="品牌" sortable>
                        <template slot-scope="scope">
                            <span>{{scope.row.brand.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="品牌等级" width="95px">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <BrandLever :state="scope.row.brand.state"></BrandLever>
                        </template>
                    </el-table-column>
                    <el-table-column prop="country" label="国家" sortable>
                        <template slot-scope="scope">
                            <span>{{scope.row.brand.country | country}}</span>
                            <isEuCountry :country="scope.row.country"></isEuCountry>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商（跟进人）" width="400px">
                        <template slot-scope="scope" v-if="scope.row.brand && scope.row.brand.brand_suppliers">
                            <div>
                                <p class="border-bottom" v-for="(supplier,$index) in scope.row.brand.brand_suppliers"
                                   :key="$index">
                                    <router-link
                                            :to="'/partner/detail?id='+supplier.account_companty.account_company_id"
                                            target="_blank" @click.native.stop="">
                                        <span v-if="supplier.account_companty">{{supplier.account_companty.company_name}}</span>
                                        <b v-if="supplier.account_user">（{{supplier.account_user.name}}）</b>
                                    </router-link>
                                </p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product_type_amounts" label="产品数量" sortable></el-table-column>
                    <el-table-column prop="customer_amounts" label="询价客户数" sortable></el-table-column>
                    <el-table-column prop="pooled_in_days" label="进池天数" sortable></el-table-column>
                    <el-table-column prop="pooled_date_time" label="进池时间" sortable>
                        <template slot-scope="scope">
                            {{scope.row.pooled_date_time | zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="follower_user_name" label="跟进人" sortable>
                        <template slot-scope="scope">
                            <span v-if="scope.row.brand.follower_user">{{scope.row.brand.follower_user.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="跟进中询价单">
                        <template slot-scope="scope"  v-if="scope.row.inquiry_sheet">
                            <span class="inline-block blue margin-right-10" v-for="item in scope.row.inquiry_sheet" :key="item">{{item}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <router-link class="blue" target="_blank" @click.native.stop="" :to='{
                                path: "/related/message-list/waiting",
                                query: {
                                    order_by: encodeURIComponent(JSON.stringify({
                                        "field_name": "create_time",
                                        "by": "asc"
                                    })),
                                    filter: encodeURIComponent(JSON.stringify([
                                        ["module_name", "=", "inquiry_pool"],
                                        ["brand_id","=",{
                                            id:scope.row.brand.id,
                                            name:scope.row.brand.name,
                                        }]
                                    ]))
                                }
                            }'>消息查询</router-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                listData: [],


                poolType: undefined,
                breadNameList: {
                    NO_PRICE: '无价格表',
                    HAS_MALL: '有商城',
                    HAS_PRICE: '有价格表',
                },

                brandKeyword: '',

                loading: false,
            }
        },
        computed: {
            listDataShow() {
                let arr = [];
                this.listData.forEach((item) => {
                    if (!this.brandKeyword || (this.brandKeyword && item.brand.name && item.brand.name.toLowerCase().indexOf(this.brandKeyword.toLowerCase().replace(/(^\s*)|(\s*$)/g, "")) > -1)) {
                        arr.push(item)
                    }
                });
                return arr
            },
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init()

        },
        methods: {
            init() {
                this.poolType = this.$route.params.poolType;
                this.getListData();

                if (this.$store.state.currentCompany.account_company_id !== 9428) {
                    this.$message({
                        showClose: true,
                        message: '温馨提示：为了是数据的准确性，请切换到 ZNS GmbH 员工账号！',
                        type: 'warning'
                    });
                }
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool,
                    data: {
                        inquiryPoolType: self.poolType || 'ALL',
                    },
                    success: function (data) {
                        self.loading = false;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].brand) {
                                data[i].brandName = data[i].brand.name;
                                data[i].country = data[i].brand.country;
                                data[i].manufactruer = data[i].brand.manufactruer;
                                if (data[i].brand.follower_user) data[i].follower_user_name = data[i].brand.follower_user.name;
                            } else {
                                data[i].brand = {}
                            }
                        }
                        self.listData = data;
                    }
                })
            },



            openDetail(row) {
                let query = {
                    id: row && row.brand && row.brand.id ? row.brand.id : undefined,
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
