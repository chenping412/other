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
                        <span class="margin-left-10"
                              v-if="detailForm.correct_brand && (detailForm.state=== 'inactive' || detailForm.state=== 'invalid')">({{detailForm.correct_brand.name}})</span>

                        <email-message-count-button
                                class="margin-left-20"
                                v-if="detailForm.id"
                                :hideEmail="true"
                                :module_id="detailForm.id"
                                module_name="brand"
                                subsystem="product">
                        </email-message-count-button>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <router-link class="blue margin-right-10" target="_blank" :to='{
                                            path: "/related/message-list/waiting",
                                            query: {
                                                order_by: encodeURIComponent(JSON.stringify({
                                                    "field_name": "create_time",
                                                    "by": "asc"
                                                })),
                                                filter: encodeURIComponent(JSON.stringify([
                                                    ["brand_id","=",{
                                                        id:detailForm.id,
                                                        name:detailForm.name,
                                                    }]
                                                ]))
                                            }
                                        }'>
                                        <el-button size="mini">查询品牌相关消息</el-button>
                                    </router-link>

                                    <el-button size="mini" @click="openThisBrandProduct()">查看该品牌产品</el-button>
                                    <el-button size="mini" @click="openThisBrandOrder()">查看订单</el-button>

                                    <el-button type="warning" plain @click="clickEditBrandLever()">标记品牌等级</el-button>

                                    <el-button type="warning" plain
                                               v-if="allowChangeAllRelatedLoginUser || (!alreadyHasRelatedLoginUser && thisUserIsInMerchandiserList)"
                                               @click="clickEditMerchandiser">
                                        绑定跟进人
                                    </el-button>

                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination apiKey="product_brand"
                                          :listApi="$api.product_common_search_brand"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="140px">
                    <el-row :gutter="30">
                        <el-col :span="9">
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
                            <el-form-item label="正确的品牌：" v-if="queryId">
                                <div class="form-border-bottom">
                                    <router-link target="_blank" v-if="detailForm.correct_brand"
                                                 :to="'detail?id='+detailForm.correct_brand.id">
                                        {{detailForm.correct_brand.name}}
                                    </router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="产品目录是否完整：" v-if="queryId">
                                <el-select v-if="isEdit" v-model="detailForm.all_products_included">
                                    <el-option label="是" :value="true"></el-option>
                                    <el-option label="否" :value="false"></el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">
                                    <el-tag size="mini" effect="dark" type="success" v-if="detailForm.all_products_included">是</el-tag>
                                    <el-tag size="mini" effect="dark" type="info" v-if="!detailForm.all_products_included">否</el-tag>
                                </span>
                            </el-form-item>
                            <el-form-item label="服务费率：" prop="service_rate">
                                <el-input type="number" v-if="!queryId || isEdit"
                                          v-model="detailForm.service_rate"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.service_rate | percent}}</span>
                            </el-form-item>
                            <el-form-item label="价格表位置：" prop="price_location">
                                <el-input type="textarea" rows="10" v-if="!queryId || isEdit"
                                          v-model="detailForm.price_location"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.price_location}}</span>
                            </el-form-item>

                        </el-col>
                        <el-col :span="9">
                            <el-form-item label="中文名：" prop="chinese_name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.chinese_name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.chinese_name}}</span>
                            </el-form-item>
                            <el-form-item label="制造商：" prop="manufactruer">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.manufactruer"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.manufactruer}}</span>
                            </el-form-item>
                            <el-form-item label="跟进人：" v-if="queryId">
                                <div class="form-border-bottom">
                                    <span class="margin-right-20" v-if="detailForm.related_login_user">
                                        {{detailForm.related_login_user.nick_name}}
                                    </span>
                                    <brand-detail-related-login-user-history
                                            v-if="detailForm.name"
                                            :queryId="queryId"
                                            :name="detailForm.name">
                                    </brand-detail-related-login-user-history>
                                </div>
                            </el-form-item>
                            <el-form-item label="预付全款优惠率：" prop="prepayment_discount_rate">
                                <el-input type="number" v-if="!queryId || isEdit"
                                          v-model="detailForm.prepayment_discount_rate"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.prepayment_discount_rate | percent}}</span>
                            </el-form-item>

                            <el-form-item label="品牌等级：" v-if="queryId">
                                <brandDetailHistory :state="detailForm.state"
                                                    :name="detailForm.name"></brandDetailHistory>

                                <div class="form-border-bottom" v-if="queryId && detailForm.last_history">
                                    <span>{{detailForm.last_history.operation_time | zerosoTimeFormat}}&emsp;</span>
                                    <span>{{detailForm.last_history.from_state | brandLever}}&emsp;</span>
                                    <span>-&gt;&emsp;</span>
                                    <span>{{detailForm.last_history.to_state | brandLever}}&emsp;</span>
                                    <p>{{detailForm.last_history.comment}}</p>
                                </div>
                            </el-form-item>

                        </el-col>
                        <el-col :span="6">
                            <OrderDataStatisticsBase
                                    v-if="queryId"
                                    class="cursor-pointer"
                                    :baseUrl="$api.product_products_brands + '/' + queryId + '/state/get_brief'"
                                    @click.native="openOrderDataStatisticsModel">
                            </OrderDataStatisticsBase>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="18">
                            <el-form-item label="备注：" prop="comment">
                                <el-input type="textarea" rows="10" v-if="!queryId || isEdit"
                                          v-model="detailForm.comment"></el-input>
                                <pre v-else class="form-border-bottom">{{detailForm.comment}}</pre>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>


            <el-tabs type="card" class="car-box" v-if="!(!queryId || isEdit)">
                <el-tab-pane label="供应商" lazy>
                    <brandDetailSupplier :queryId="queryId"
                                         @openOrderDataStatisticsModel="openOrderDataStatisticsModel"></brandDetailSupplier>
                </el-tab-pane>
                <el-tab-pane label="产品系列" lazy>
                    <brand-detail-product-series :queryId="queryId"></brand-detail-product-series>
                </el-tab-pane>
                <el-tab-pane label="折扣系列" lazy>
                    <brand-detail-discount-series :queryId="queryId"></brand-detail-discount-series>
                </el-tab-pane>
                <el-tab-pane label="采购公司" lazy>
                    <brandDetailPurchaser :queryId="queryId"></brandDetailPurchaser>
                </el-tab-pane>
                <el-tab-pane label="品牌资料" lazy>
                    <brandDetailBrandDescription :queryId="queryId"></brandDetailBrandDescription>
                </el-tab-pane>
                <el-tab-pane label="价格表" lazy>
                    <brand-detail-import-price :queryId="queryId"
                                               :brandDetailForm="detailForm"></brand-detail-import-price>
                </el-tab-pane>
            </el-tabs>

        </div>


        <el-dialog :title="'品牌名：'+detailForm.name" :visible.sync="editBrandLeverDialogShow" width="900px"
                   :close-on-click-modal="false"
                   v-loading="loading">
            <div class="edit-brand-lever-dialog clearfix">
                <div class="check-box">
                    <h4 class="padding-10">标记为：</h4>
                    <el-radio-group v-model="editBrandLeverForm.to_state" @change="editBrandLeverStateChange"
                                    size="medium">
                        <el-radio
                                v-for="(item,$index) in $store.state.brandLever"
                                :key="$index"
                                :label="item.code"
                                border>
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </div>
                <el-form :model="editBrandLeverForm" :rules="editBrandLeverFormRule" ref="editBrandLeverForm"
                         label-width="0px">
                    <el-form-item prop="reason"
                                  v-if="['exclusive','agency','unclassfied'].indexOf(editBrandLeverForm.to_state)===-1">
                        <p>备注：</p>
                        <el-input
                                type="textarea"
                                rows="8"
                                maxlength="120"
                                show-word-limit
                                v-model="editBrandLeverForm.reason"
                                :disabled="editBrandLeverForm.to_state==='non_eu'">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="time" v-if="['exclusive','agency'].indexOf(editBrandLeverForm.to_state)>-1">
                        <p>代理有效期：</p>
                        <el-date-picker
                                v-model="editBrandLeverForm.time"
                                @change="editBrandLeverTimeChange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy/MM/dd"
                                unlink-panels>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="correct_brand_id"
                                  v-if="['inactive','invalid'].indexOf(editBrandLeverForm.to_state)>-1">
                        <p>正确品牌：</p>
                        <SelectBrand :brandId.sync="editBrandLeverForm.correct_brand_id"
                                     :brand="editBrandLeverForm.correct_brand"
                                     :option="editBrandLeverForm.correct_brand_id?[editBrandLeverForm.correct_brand]:null">
                        </SelectBrand>
                    </el-form-item>

                </el-form>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editBrandLeverSave()">保 存</el-button>
                <el-button @click="editBrandLeverDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="修改备注" :visible.sync="editCommentDialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editCommentForm" :rules="editCommentFormRule" ref="editCommentForm" label-width="0px">
                <el-form-item prop="reason">
                    <p>备注：</p>
                    <el-input type="textarea" rows="10" v-model="editCommentForm.reason"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editCommentSave()">保 存</el-button>
                <el-button @click="editCommentDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="绑定跟进人" :visible.sync="editMerchandiserDialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editMerchandiserForm" label-width="120px">
                <el-form-item label="跟进人：">
                    <el-select
                            v-model="editMerchandiserForm.login_user_id"
                            placeholder="请选择"
                            :disabled="!allowChangeAllRelatedLoginUser"
                            filterable
                            clearable>
                        <el-option v-for="item in merchandiserList"
                                   :key="item.id"
                                   :value="item.id"
                                   :label="item.nick_name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editMerchandiserSave()">保 存</el-button>
                <el-button @click="editMerchandiserDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <OrderDataStatisticsModel ref="orderDataStatisticsModel"></OrderDataStatisticsModel>
    </div>
</template>

<script>
    import brandDetailHistory from './component/brand-detail-history'
    import brandDetailSupplier from './component/brand-detail-supplier'
    import brandDetailPurchaser from './component/brand-detail-purchaser'
    import brandDetailBrandDescription from './component/brand-detail-brand_description'
    import BrandDetailImportPrice from "./component/brand-detail-import-price";
    import EmailMessageCountButton from "../../related-message/email-message-count-button";
    import BrandDetailRelatedLoginUserHistory from "./component/brand-detail-related-login-user-history";
    import HostConfig from '../../../config/host-config'
    import BrandDetailProductSeries from "./component/brand-detail-product-series";
    import BrandDetailDiscountSeries from "./component/brand-detail-discount-series";

    export default {
        components: {
            BrandDetailDiscountSeries,
            BrandDetailProductSeries,
            BrandDetailRelatedLoginUserHistory,
            EmailMessageCountButton,
            BrandDetailImportPrice,
            brandDetailHistory,
            brandDetailSupplier,
            brandDetailPurchaser,
            brandDetailBrandDescription,
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    name: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请输入品牌名称！'));
                                } else if (/[\u4E00-\u9FA5\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g.test(value)) {
                                    callback(new Error('品牌名称不能输入中文！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ], country: [
                        {required: true, message: '请选择国家！'}
                    ],
                },


                editBrandLeverDialogShow: false,
                editBrandLeverForm: {},
                editBrandLeverFormRule: {
                    reason: [
                        {required: true, message: '请输入原因！'}
                    ],
                    time: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value || value.length === 0) {
                                    callback(new Error('请选择代理有效期！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },

                editCommentDialogShow: false,
                editCommentForm: {},
                editCommentFormRule: {
                    reason: [
                        {required: true, message: '请输入备注！'}
                    ],
                },

                editMerchandiserDialogShow: false,
                editMerchandiserForm: {},
                merchandiserList: [],

                loading: false,

                alreadyHasRelatedLoginUser: false,

            }
        },
        computed: {
            allowChangeAllRelatedLoginUser() {
                //允许修改跟进人为所有人的登录账号ID,根据host-config文件中不同环境的不同配置取值
                let loginUserIds = HostConfig.brandAllowChangeAllRelatedLoginUserId;
                return loginUserIds.indexOf(this.$store.state.userInfo.id) > -1
            },
            thisUserIsInMerchandiserList() {
                let yes = false;
                this.merchandiserList.forEach((item) => {
                    if (item.id === this.$store.state.userInfo.id) {
                        yes = true;
                    }
                });
                return yes
            },
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
            this.getMerchandiserList();
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
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        is_primary_sale_brand: false,
                        is_temporarily_no_sale: false,
                        all_products_included: false,
                    };
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.alreadyHasRelatedLoginUser = false;
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            if (self.detailForm.related_login_user && self.detailForm.related_login_user) {
                                self.alreadyHasRelatedLoginUser = true;
                            }
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
                        if(self.detailForm.all_products_included){
                            self.$confirm('设置为完整产品目录后，将不能新增和删除此品牌下的产品，确定保存吗？', '提示', {
                                confirmButtonText: '确认',
                                cancelButtonText: '取消',
                                type: 'warning',
                                callback: function (action) {
                                    if (action === 'confirm') {
                                        self.saveDataSubmit();
                                    }
                                }
                            });
                            return
                        }
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
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
                            } else {
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
            },


            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },


            //点击标记品牌等级
            clickEditBrandLever() {
                this.editBrandLeverDialogShow = true;
                this.editBrandLeverForm = {
                    brand_id: this.detailForm.id,
                    to_state: this.detailForm.state,
                    reason: '',
                    correct_brand: this.detailForm.correct_brand || null,
                    correct_brand_id: this.detailForm.correct_brand ? this.detailForm.correct_brand.id : '',
                    time: [],
                };
                this.editBrandLeverStateChange();
            },
            editBrandLeverSave() {
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

            editBrandLeverStateChange() {
                if (this.editBrandLeverForm.to_state === 'non_eu') {
                    this.editBrandLeverForm.reason = '非常抱歉，零搜科技目前只提供欧盟区品牌询报价服务，我们无法找到该品牌欧盟区供应商。'
                } else {
                    this.editBrandLeverForm.reason = ''
                }
                if (['inactive', 'invalid'].indexOf(this.editBrandLeverForm.to_state) === -1) {
                    this.editBrandLeverForm.correct_brand_id = null;
                    this.editBrandLeverForm.correct_brand = null;
                }
                this.editBrandLeverForm.time = [];
                this.$nextTick(() => {
                    this.$refs.editBrandLeverForm.clearValidate()
                })
            },
            editBrandLeverTimeChange() {
                if (this.editBrandLeverForm.time && this.editBrandLeverForm.time.length > 0) {
                    this.editBrandLeverForm.reason = this.editBrandLeverForm.time.join(' - ');
                } else {
                    this.editBrandLeverForm.reason = ''
                }
                console.log(this.editBrandLeverForm.reason)
            },


            clickEditComment() {
                this.editCommentDialogShow = true;
                this.editCommentForm = {
                    brand_id: this.detailForm.id,
                    reason: '',
                };
            },
            editCommentSave() {
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


            getMerchandiserList() {
                let self = this;
                self.$http({
                    url: self.$api.partner_companies_v5 + '/9428/login_users',
                    data: {
                        account_company_id: 9428
                    },
                    success: function (data) {
                        if (data.msg) {
                            self.merchandiserList = data.msg;
                        }
                    }
                });
            },
            clickEditMerchandiser() {
                if (this.detailForm.related_login_user) {
                    this.editMerchandiserForm = {
                        brand_id: this.detailForm.id,
                        login_user_id: this.detailForm.related_login_user.id,
                        operator_id: this.$store.state.userInfo.id,
                    };
                } else {
                    if (!this.alreadyHasRelatedLoginUser && !this.allowChangeAllRelatedLoginUser) {
                        this.editMerchandiserForm = {
                            brand_id: this.detailForm.id,
                            login_user_id: this.$store.state.userInfo.id,
                            operator_id: this.$store.state.userInfo.id,
                        };
                    } else {
                        this.editMerchandiserForm = {
                            brand_id: this.detailForm.id,
                            login_user_id: null,
                            operator_id: this.$store.state.userInfo.id,
                        };
                    }
                }
                this.editMerchandiserDialogShow = true;
            },
            editMerchandiserSave() {
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


            openOrderDataStatisticsModel(accountCompany) {
                this.$refs.orderDataStatisticsModel.init({
                    dataType: 'brand',
                    brandData: {
                        id: this.detailForm.id,
                        name: this.detailForm.name,
                        state: this.detailForm.state,
                    },
                    partnerData: accountCompany
                })
            },

        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .edit-brand-lever-dialog {
        .check-box {
            width: 460px;
            float: left;

            .el-radio {
                margin: 5px !important;
                width: 140px;
                height: 80px;
                padding-top: 30px;

                &.is-checked {
                    background-color: $color-main;

                    .el-radio__label {
                        color: #ffffff;
                    }

                    .el-radio__input.is-checked .el-radio__inner {
                        border-color: #ffffff;
                        background-color: #ffffff;
                    }

                    .el-radio__inner::after {
                        background-color: $color-main;
                    }
                }
            }
        }

        .el-form {
            width: 380px;
            float: right;
        }
    }
</style>
