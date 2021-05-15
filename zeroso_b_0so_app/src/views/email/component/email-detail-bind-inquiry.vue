<template>
    <div class="inline-block">
        <el-button size="mini" plain @click="add">询价单绑定</el-button>

        <el-dialog title="选择关联询价单" :visible.sync="dialogShow" width="1000px" :close-on-click-modal="false">

            <div class="email-detail-bind-inquiry-content">
                <div class="search-control clearfix">
                    <InputNumber class="item" placeholder="询价单号" :value.sync="searchKeyword" :integer="true" :clearable="true" @keyup.enter.native="searchListData" @change="searchInput"></InputNumber>

                    <SelectBrand class="item" :brandId.sync="searchBrandId" @change="searchListData" placeholder="品牌"></SelectBrand>

                    <SelectPartnerCompanyOnly class="item" :partnerId.sync="searchCompanyId" @change="searchListData" placeholder="供应商名称"></SelectPartnerCompanyOnly>

                    <el-button class="right" type="primary" @click="searchListData">搜索</el-button>
                </div>


                <el-table :data="listData" v-loading="loading" height="500px">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="询价单号" width="120"></el-table-column>
                    <el-table-column label="品牌" width="150">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="国家">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <p>{{scope.row.brand.country | country | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商" width="400">
                        <template slot-scope="scope">
                            <p v-if="scope.row.supplier_company">
                                <span>{{scope.row.supplier_company.company_name}}</span>
                                <span v-if="scope.row.supplier_company.name">，{{scope.row.supplier_company.name}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="clickBind(scope.row)">绑定</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,
                dialogShow: false,

                searchKeyword: '',
                searchBrandId:'',
                searchCompanyId:'',
                listData: [],

            }
        },
        watch: {},
        created() {
        },
        methods: {
            add() {
                this.dialogShow = true;
                this.searchListData();
            },
            searchInput(){
              if(this.timer) clearTimeout(this.timer);
              this.timer=setTimeout(()=>{
                  this.searchListData();
              },500)
            },
            searchListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool_quotations,
                    data: {
                        sheetId:self.searchKeyword || undefined,
                        brandId:self.searchBrandId || undefined,
                        supplierCompanyId:self.searchCompanyId || undefined,

                        currentUserId: self.$store.state.userInfo.id,
                        'pageRequest.perPage': self.$store.state.paginationPageSize,
                        'pageRequest.page': 1,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.item) {
                            self.listData = data.item;
                        } else {
                            self.listData = [];
                        }
                    }
                });
            },
            clickBind(row) {
                this.loading=true;
                this.$emit('updateEmaiData','/module',{
                    subsystem: "inquiry",
                    module_name: "inquiry_pool",
                    module_id: row.id.toString(),
                })
            },
        },
    }
</script>

<style lang="scss">
.email-detail-bind-inquiry-content{
    .search-control{
        margin-bottom: 10px;
        .item{
            float: left;
            width: 270px;
            margin-right: 20px;
            .el-select{
                width: 100%;
            }
        }
    }
}
</style>