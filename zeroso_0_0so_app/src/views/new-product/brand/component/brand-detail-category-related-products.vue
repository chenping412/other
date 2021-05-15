<template>
    <div class="clearfix" v-loading="loading">
        <div class="clearfix">
            <i class="el-icon-edit-outline el-icon-normal cursor-pointer right margin-top-5" @click="clickEdit"></i>
            <template v-if="scopeRow.products">
                <table class="table brand-detail-category-related-products-table">
                    <thead>
                    <tr>
                        <th>型号</th>
                        <th>订货号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,$index) in scopeRow.products" :key="$index">
                        <td>
                            <router-link :to="'/new-product/product/detail?id='+item.uid">{{item.type}}</router-link>
                        </td>
                        <td>
                            <router-link :to="'/new-product/product/detail?id='+item.uid">{{item.article_number}}</router-link>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </template>

        </div>

        <el-dialog :title="scopeRow.chinese_name"
                   :visible.sync="dialogShow" width="1400px" top="50px" :close-on-click-modal="false"
                   append-to-body v-loading="loading">
            <div class="brand-detail-category-related-products">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="clearfix padding-bottom-10">
                        <div class="search clearfix left">
                            <el-input class="item" size="mini" v-model="searchForm.type" clearable placeholder="型号"></el-input>
                            <el-input class="item" size="mini" v-model="searchForm.article_number" clearable placeholder="订货号"></el-input>
                            <el-button class="left" size="mini" type="primary" @click="getListData">查询</el-button>
                        </div>
                        <div class="right">
                            <el-pagination
                                    small
                                    @current-change="getListData"
                                    @size-change="getListData"
                                    :page-size.sync="pageSize"
                                    :current-page.sync="pageNum"
                                    :total="totalCount"
                                    layout="total, prev, pager, next"
                                    background>
                            </el-pagination>
                        </div>
                    </div>
                    <el-table :data="searchProductList" border size="mini" height="550px">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="type" label="型号"></el-table-column>
                        <el-table-column prop="article_number" label="订货号"></el-table-column>
                        <el-table-column label="操作" width="100px">
                            <template slot-scope="scope">
                                <span class="cursor-pointer color-main" @click="clickAddRow(scope.row)">选择</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <h4 class="padding-bottom-10" style="line-height: 28px;">已选择产品</h4>
                    <el-table :data="selectProductList" border size="mini" height="550px">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column prop="type" label="型号"></el-table-column>
                        <el-table-column prop="article_number" label="订货号"></el-table-column>
                        <el-table-column label="操作" width="100px">
                            <template slot-scope="scope">
                                <span class="cursor-pointer red" @click="clickDeleteRow(scope.row)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        props: ['brandUid','scopeRow'],
        data() {
            return {
                loading: false,

                dialogShow: false,

                searchForm:{
                    type:null,
                    article_number:null,
                },
                pageSize: 50,
                pageNum: 1,
                totalCount: 0,
                searchProductList:[],
                
                selectProductList:[],
            }
        },
        methods: {
            //编辑地址
            clickEdit() {
                this.dialogShow = true;
                this.selectProductList = this.scopeRow.products ? JSON.parse(JSON.stringify(this.scopeRow.products)) : [];
            },
            clickAddRow(row) {
                let hasSelect = false;
                this.selectProductList.forEach((item)=>{
                    if(item.uid === row.uid){
                        hasSelect = true;
                    }
                });
                if(!hasSelect){
                    this.selectProductList.push(row);
                }else {
                    this.$message({
                        showClose: true,
                        message: '已选择有相同产品，无需重复选择！',
                        type: 'error'
                    });
                }
            },
            clickDeleteRow(row) {
                this.selectProductList.splice(this.selectProductList.indexOf(row), 1)
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                let products_uid_list = [];
                self.selectProductList.forEach((item)=>{
                    products_uid_list.push(item.uid)
                });
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/category/'+self.scopeRow.id+'/related_products',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        related_products:products_uid_list
                    },
                    success () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.dialogShow = false;
                        self.$emit('update');
                    }
                });
            },


            //搜索型号
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_catalog_product_brand + '/' + self.brandUid + '/product/list',
                    type:"POST",
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        type:self.searchForm.type || undefined,
                        article_number:self.searchForm.article_number || undefined,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.searchProductList = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.searchProductList = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .brand-detail-category-related-products{
        .search{
            .item{
                width: 120px;
                float: left;
                margin-right: 10px;
            }
        }
    }
    .table.brand-detail-category-related-products-table{
        td,th{
            padding: 1px 10px;
            background-color: #ffffff;
        }
    }
</style>
