<template>
    <div class="flex-box-column brand-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">品牌</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '品牌详情' : '新增品牌'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span :class="{'delete':detailForm.state=== 'inactive' || detailForm.state=== 'invalid'}">{{detailForm.name}}</span>
                        <span class="margin-left-10" v-if="detailForm.correct_brand && (detailForm.state=== 'inactive' || detailForm.state=== 'invalid')">({{detailForm.correct_brand.name}})</span>
                        <BrandLever class="margin-left-20" :state="detailForm.state"></BrandLever>
                    </h3>
                    <div class="detail-control clearfix">
                        <DetailPagination apiKey="product_brand" :listApi="$api.product_common_search_brand"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="125px">
                    <el-row :gutter="30">
                        <el-col :span="10">
                            <el-form-item label="品牌名：" prop="name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.name}}</span>
                            </el-form-item>
                            <el-form-item label="国家：" prop="country">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.country">
                                    <el-option label="请选择" value=""></el-option>
                                    <el-option
                                            v-for="item in $store.state.country"
                                            :key="item.code2"
                                            :label="item.chinese_name"
                                            :value="item.code2">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.country | country}}</span>
                            </el-form-item>
                            <el-form-item label="官网：" prop="website">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.website"></el-input>
                                <div class="form-border-bottom" v-else>
                                    <a target="_blank" :href="detailForm.website">{{detailForm.website}}</a>
                                </div>
                            </el-form-item>
                            <el-form-item label="正确的品牌："  v-if="!(!queryId || isEdit)">
                                <div class="form-border-bottom">
                                    <router-link target="_blank" v-if="detailForm.correct_brand" :to="'detail?id='+detailForm.correct_brand.id">{{detailForm.correct_brand.name}}</router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="应用领域：">
                                <TagsListEdit :tags.sync="brandDescriptionData.using_area" :isEdit="isEdit"></TagsListEdit>
                                <span v-if="(!brandDescriptionData.using_area || brandDescriptionData.using_area.length===0) && !isEdit">{{'' | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="主要品类：">
                                <TagsListEdit :tags.sync="brandDescriptionData.category" :isEdit="isEdit"></TagsListEdit>
                                <span v-if="(!brandDescriptionData.category || brandDescriptionData.category.length===0) && !isEdit">{{'' | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="产品品类：">
                                <TagsListEdit :tags.sync="brandDescriptionData.main_products" :isEdit="isEdit"></TagsListEdit>
                                <span v-if="(!brandDescriptionData.main_products || brandDescriptionData.main_products.length===0) && !isEdit">{{'' | defaultStr}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="品牌简介：">
                                <el-input type="textarea" rows="6" v-if="isEdit" v-model="brandDescriptionData.short_description"></el-input>
                                <pre v-else class="form-border-bottom">{{brandDescriptionData.short_description | defaultStr}}</pre>
                            </el-form-item>
                            <el-form-item label="品牌详情：">
                                <el-input type="textarea" rows="6" v-if="isEdit" v-model="brandDescriptionData.description"></el-input>
                                <pre v-else class="form-border-bottom">{{brandDescriptionData.description | defaultStr}}</pre>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>


        </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    name: [
                        {required: true, message: '请输入品牌名！'}
                    ],country: [
                        {required: true, message: '请选择国家！'}
                    ],price_list_state: [
                        {required: true, message: '请选择价格表状态！'}
                    ],
                },
                productList:[],

                brandDescriptionData: {},


                editBrandLeverDialogShow: false,
                editBrandLeverForm: {},
                editBrandLeverFormRule: {
                    reason: [
                        {required: true, message: '请输入原因！'}
                    ],
                    correct_brand_id: [
                        {required: true, message: '请选择正确品牌！'}
                    ],
                },

                editCommentDialogShow: false,
                editCommentForm: {},
                editCommentFormRule: {
                    reason: [
                        {required: true, message: '请输入备注！'}
                    ],
                },

                editMerchandiserDialogShow:false,
                editMerchandiserForm: {},

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
                    self.getBrandDescriptionData();
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        is_primary_sale_brand: false,
                        is_temporarily_no_sale: false,
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            self.getProductListData(self.detailForm.id,self.detailForm.name);
                        }
                    }
                })
            },

            getBrandDescriptionData() {
                let self = this;
                self.brandDescriptionData= {};
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId + '/brand_description',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            data.msg.brand_id=data.msg.id;
                            self.brandDescriptionData = data.msg;
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            //保存客户信息
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.queryId ? self.$api.product_products_brands + '/' + self.queryId : self.$api.product_products_brands,
                            type: self.queryId ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.detailForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.isEdit = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    if (!self.queryId && data.msg.id) {
                                        self.$router.push({
                                            path: 'detail',
                                            query: {
                                                id: data.msg.id,
                                            }
                                        });
                                    }else {
                                        self.getDetailData();
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


            //点击标记品牌等级
            clickEditBrandLever(){
                this.editBrandLeverDialogShow=true;
                this.editBrandLeverForm={
                    brand_id:this.detailForm.id,
                    to_state:this.detailForm.state,
                    reason:'',
                    correct_brand:this.detailForm.correct_brand || null,
                    correct_brand_id:this.detailForm.correct_brand? this.detailForm.correct_brand.id : '',
                    is_update_state_start_time:false,
                };
            },
            editBrandLeverSave(){
                let self = this;
                self.$refs.editBrandLeverForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_products_brands + '/' + self.queryId + '/state/action',
                            type: 'PUT',
                            requestBody: true,
                            data: self.editBrandLeverForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.editBrandLeverDialogShow = false;
                                    self.getDetailData();
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


            clickEditComment(){
                this.editCommentDialogShow=true;
                this.editCommentForm={
                    brand_id:this.detailForm.id,
                    reason:'',
                };
            },
            editCommentSave(){
                let self = this;
                self.$refs.editCommentForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_products_brands + '/' + self.queryId + '/state/add_history',
                            type: 'PUT',
                            requestBody: true,
                            data: self.editCommentForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.editCommentDialogShow = false;
                                    self.getDetailData();
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

            clickEditMerchandiser(){
                this.editMerchandiserDialogShow=true;
                this.editMerchandiserForm={
                    brand_id:this.detailForm.id,
                    login_user_id:this.detailForm.related_login_user ? this.detailForm.related_login_user.id : '',
                    login_user:this.detailForm.related_login_user || null
                };
            },
            editMerchandiserSave(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_brand_v5 + '/' + self.queryId + '/login_user',
                    type: 'PUT',
                    requestBody: true,
                    data: self.editMerchandiserForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.editMerchandiserDialogShow = false;
                            self.getDetailData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },


            //获取该品牌对应产品列表
            getProductListData(id,name) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_common_search_product,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        filter: [["brand_name","=",{"id":id,"name":name}]],
                        key: "order_all"
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items && data.msg.items.length>0) {
                            self.productList = data.msg.items;
                        }
                    }
                })
            },

            openThisBrandProduct() {
                let routerData = this.$router.resolve({
                    path: '/product/product/list',
                    query: {
                        filter: encodeURIComponent(JSON.stringify([
                            ["brand_name", '=', {
                                "id": this.detailForm.id,
                                "name": this.detailForm.name
                            }]
                        ])),
                    }
                });
                window.open(routerData.href);
            },

            openThisBrandOrder() {
                let routerData = this.$router.resolve({
                    path: '/order/order/all/list',
                    query: {
                        order_by: encodeURIComponent(JSON.stringify({
                            "field_name": "write_time", "by": "desc"
                        })),
                        filter: encodeURIComponent(JSON.stringify([
                            ["brand", '=', {
                                "id": this.detailForm.id,
                                "name": this.detailForm.name
                            }]
                        ])),
                    }
                });
                window.open(routerData.href)
            },

        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .edit-brand-lever-dialog{
        .check-box{
            width: 460px;
            float: left;
            .el-radio{
                margin: 5px !important;
                width: 140px;
                height: 80px;
                padding-top: 30px;
                &.is-checked{
                    background-color: $color-main;
                    .el-radio__label{
                        color: #ffffff;
                    }
                    .el-radio__input.is-checked .el-radio__inner{
                        border-color: #ffffff;
                        background-color: #ffffff;
                    }
                    .el-radio__inner::after{
                        background-color: $color-main;
                    }
                }
            }
        }
        .el-form{
            width: 380px;
            float: right;
        }
    }
</style>
