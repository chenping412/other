<template>
    <div class="inline-block">
        <div @click="showList">
            <slot></slot>
        </div>

        <el-dialog title="选择产品" :visible.sync="selectProductDialogShow" width="1200px" top="50px"
                   :close-on-click-modal="false">
            <div class="content">
                <el-table :data="productList"
                          ref="selectProductTable"
                          @selection-change="tableSelectionChange"
                          @row-click="rowClick"
                          v-loading="loading"
                          height="600px">

                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="type_no" sortable label="型号">
                        <template slot-scope="scope">
                            <router-link class="blue" target="_blank"
                                         :to="'/product/product/detail?id='+scope.row.id">
                                {{scope.row.type_no}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="order_no" sortable label="订货号">
                        <template slot-scope="scope">
                            <router-link class="blue" target="_blank"
                                         :to="'/product/product/detail?id='+scope.row.id">
                                {{scope.row.order_no}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="parameters" label="参数"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="sheetId" :disabled="!selectProductList || selectProductList.length===0"
                           @click="addProductToInquiry()">添加到本询价单
                </el-button>
                <el-button type="success" :disabled="!selectProductList || selectProductList.length===0"
                           @click="createInquiry()">创建询价单
                </el-button>
                <el-button @click="selectProductDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    export default {
        props: ['sheetId', 'brandId', 'disabled'],
        data() {
            return {
                loading: false,

                selectProductDialogShow: false,
                productList: [],
                selectProductList: [],
            }
        },
        created() {

        },
        methods: {
            showList() {
                if (this.disabled) {
                    return
                }
                if (this.$store.state.currentCompany.account_company_id !== 9428) {
                    this.$message({
                        showClose: true,
                        message: '请使用 ZNS GmbH 员工账号进行此操作！',
                        type: 'error'
                    });
                    return
                }
                this.selectProductDialogShow = true;
                this.getProductList();
            },

            getProductList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool + '/' + self.brandId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        if (data.inquired_products) {
                            self.productList = data.inquired_products;
                        } else {
                            self.productList = [];
                        }
                    }
                })
            },

            //创建询报价单和添加产品到询价单中之前，检查提交的型号是否还存在于询价池，以此防止重复建单
            checkProductsInToInquiryPool(callback) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_pool + '/' + self.brandId,
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        let newProductIds = [];
                        if (data.inquired_products) {
                            data.inquired_products.forEach((item) => {
                                newProductIds.push(item.id)
                            });
                        }
                        let hasArrIds = [];
                        let notHasArr = [];
                        self.selectProductList.forEach((item) => {
                            if (newProductIds.indexOf(item.id) > -1) {
                                hasArrIds.push(item.id)
                            } else {
                                notHasArr.push(item)
                            }
                        });
                        if (hasArrIds.length === 0) {
                            self.$message({
                                showClose: true,
                                message: '检测到已选择的所有型号，均已创建询价单、或者是已撤销询价，无需再创建！',
                                type: 'error'
                            });
                        } else if (notHasArr.length > 0) {
                            let content = '<p>检测到已选择的型号中，有部分型号已创建询价单，或者是已撤销询价，确认继续，将不提交以下型号：</p>';
                            notHasArr.forEach((item, index) => {
                                content += '<p>' + (index+1) + '、型号：' + item.type_no + '，订货号：' + item.order_no + '</p>';
                            });
                            self.$confirm(content, '提示', {
                                confirmButtonText: '确认继续',
                                cancelButtonText: '取消',
                                type: 'warning',
                                dangerouslyUseHTMLString: true,
                                callback(action) {
                                    if (action === 'confirm') {
                                        if (callback) callback(hasArrIds, notHasArr)
                                    }
                                }
                            });
                        } else {
                            if (callback) callback(hasArrIds, notHasArr)
                        }
                    }
                })
            },


            createInquiry() {
                let self = this;
                self.checkProductsInToInquiryPool((product_id_list) => {
                    self.loading = true;
                    self.$http({
                        url: self.$api.inquiry_v6_brand_inquiries + '/' + self.brandId + '/inquiries',
                        type: 'POST',
                        requestBody: true,
                        data: {
                            follower_id: self.$store.state.userInfo.id,
                            product_id_list: product_id_list,
                        },
                        success(data) {
                            self.loading = false;
                            self.selectProductDialogShow = false;
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
                                self.$emit('update')
                            }
                        }
                    })
                })
            },


            addProductToInquiry() {
                let self = this;
                self.checkProductsInToInquiryPool((product_id_list) => {
                    self.loading = true;
                    self.$http({
                        url: self.$api.inquiry_v6_brand_inquiries_inquiries + '/' + self.sheetId + '/addProducts',
                        type: 'PUT',
                        requestBody: true,
                        data: {
                            product_id_list: product_id_list,
                        },
                        success: function () {
                            self.loading = false;
                            self.selectProductDialogShow = false;
                            self.$message({
                                showClose: true,
                                message: '添加到本询价单成功！',
                                type: 'success'
                            });
                            self.$emit('update');
                        }
                    });
                });
            },

            tableSelectionChange(val) {
                this.selectProductList = val;
            },
            rowClick(row) {
                this.$refs.selectProductTable.toggleRowSelection(row);
            },
        },
    }
</script>

<style lang="scss">

</style>